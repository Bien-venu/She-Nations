from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password, make_password
from .models import Booking, User
from .serializers import AccountSerializer, BookingSerializer, MentorSerializer, RegisterSerializer, LoginSerializer, UserSerializer
from rest_framework import status, permissions
from .models import UserProfile
from .serializers import UserProfileSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import User
from .serializers import UserSerializer, UserProfileSerializer


from rest_framework import generics, permissions
from .models import User
from .serializers import MentorSerializer

class MentorListAPIView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.filter(role='Mentor', is_active=True).select_related('profile')
    serializer_class = MentorSerializer

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            user = User.objects.create(
                name=data['name'],
                email=data['email'],
                password=make_password(data['password']),
                phone=data['phone'],
                location=data['location'],
                role=data['role'],
                education_level=data['education_level'],
                is_active=(data['role'] == 'admin')
            )

            message = (
                "Admin registered and activated successfully."
                if user.is_active else
                "User registered. Awaiting approval."
            )
            return Response({"message": message}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"error": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST)

            if not check_password(password, user.password):
                return Response({"error": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST)

            if not user.is_active:
                return Response({"error": "User is not active"}, status=status.HTTP_403_FORBIDDEN)

            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role,
                    'is_active': user.is_active,
                    "education_level": user.education_level,
                    "phone": user.phone,
                    "location": user.location,
                    "date_registered": user.date_registered.isoformat()
                }
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    



class VerifyUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
      
        if request.user.role != 'admin':
            return Response({"detail": "Only admin can verify users."}, status=status.HTTP_403_FORBIDDEN)
        
        user_id = request.data.get("user_id")
        try:
            user = User.objects.get(id=user_id)
            user.is_verified = True 
            user.is_active = True
            user.save()
            return Response({"detail": f"User {user.email} has been verified."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)



class GetAllUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({"detail": "Only admin can view all users."}, status=status.HTTP_403_FORBIDDEN)
        
        users = User.objects.all()
        serializer = AccountSerializer(users, many=True)
        return Response(serializer.data)
    


class UserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            return None

    def is_admin(self, user):
        return user.role == 'admin'

    def get(self, request, pk):
        if not self.is_admin(request.user):
            return Response({'detail': 'Only admin can view user details.'}, status=status.HTTP_403_FORBIDDEN)
        user = self.get_object(pk)
        if not user:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        if not self.is_admin(request.user):
            return Response({'detail': 'Only admin can update users.'}, status=status.HTTP_403_FORBIDDEN)
        user = self.get_object(pk)
        if not user:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'detail': 'User updated successfully.', 'user': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not self.is_admin(request.user):
            return Response({'detail': 'Only admin can delete users.'}, status=status.HTTP_403_FORBIDDEN)
        user = self.get_object(pk)
        if not user:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return Response({'detail': 'User deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)


class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        try:
            profile = user.profile
            serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        except UserProfile.DoesNotExist:
            serializer = UserProfileSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=user)
            return Response({"detail": "Profile saved successfully", "profile": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    
class UserProfileUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.profile
        except UserProfile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        try:
            profile = request.user.profile
        except UserProfile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Profile updated successfully", "profile": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import BookingCreateSerializer

class BookMentorView(generics.CreateAPIView):
    serializer_class = BookingCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "message": "Booking successfully created.",
            "booking": serializer.data,
        }, status=status.HTTP_201_CREATED)

from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Booking

class MentorCalendarBookingsAPIView(APIView):
    permission_classes = [AllowAny]  # ✅ Allow public access

    def get(self, request):
        mentor_id = request.query_params.get("mentor_id")

        if not mentor_id:
            return Response({"error": "mentor_id query parameter is required."}, status=400)

        bookings = Booking.objects.filter(mentor_id=mentor_id)

        data = []
        for booking in bookings:
            start_time = booking.time.isoformat() if booking.time else "00:00:00"
            data.append({
                "id": booking.id,
                "title": booking.title or "Mentorship Session",
                "start": f"{booking.day}T{start_time}",
                "end": f"{booking.day}T{start_time}",
                "note": booking.note,
                "mentor": str(booking.mentor),
                "mentee": str(booking.mentee),
            })

        return Response(data)
    
class MentorBookingsListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Booking.objects.filter()