from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Opportunity, Application
from .serializers import OpportunitySerializer, ApplicationSerializer


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import Opportunity
from .serializers import OpportunitySerializer

class OpportunityListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        opportunities = Opportunity.objects.filter(is_active=True)
        serializer = OpportunitySerializer(opportunities, many=True)
        return Response(serializer.data)

    def post(self, request):
        allowed_roles = ['admin', 'Company','Mentor', 'Company', 'Export']
        user_role = getattr(request.user, 'role', '').strip()

        if user_role not in allowed_roles:
            return Response(
                {"detail": "You do not have permission to create opportunities."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = OpportunitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response({
                "detail": "Opportunity created successfully",
                "opportunity": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OpportunityDetailView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, pk):
        opportunity = get_object_or_404(Opportunity, pk=pk)
        serializer = OpportunitySerializer(opportunity)
        return Response(serializer.data)

    def put(self, request, pk):
        opportunity = get_object_or_404(Opportunity, pk=pk)
        allowed_roles = ['admin', 'Company','Mentor', 'Company', 'Export']
        user_role = getattr(request.user, 'role', '').strip()

        # Allow if user is the owner or has an allowed role
        if opportunity.created_by != request.user and user_role not in allowed_roles:
            return Response(
                {"detail": "You do not have permission to update this opportunity."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = OpportunitySerializer(opportunity, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "detail": "Opportunity updated successfully",
                "opportunity": serializer.data
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        opportunity = get_object_or_404(Opportunity, pk=pk)
        allowed_roles = ['admin', 'Company','Mentor', 'Company', 'Export']
        user_role = getattr(request.user, 'role', '').strip()

        if opportunity.created_by != request.user and user_role not in allowed_roles:
            return Response(
                {"detail": "You do not have permission to delete this opportunity."},
                status=status.HTTP_403_FORBIDDEN
            )

        opportunity.delete()
        return Response(
            {"detail": "Opportunity deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )



class ApplicationListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, opportunity_pk):
        applications = Application.objects.filter(opportunity_id=opportunity_pk, user=request.user)
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)

    def post(self, request, opportunity_pk):
        data = request.data.copy()
        data['opportunity'] = opportunity_pk
        serializer = ApplicationSerializer(data=data, context={'request': request})

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({
                "detail": "Application submitted successfully",
                "application": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApplicationDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        application = get_object_or_404(Application, pk=pk)

        if application.user != request.user and not request.user.is_staff:
            return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)

        serializer = ApplicationSerializer(application)
        return Response(serializer.data)