from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Opportunity, Application
from .serializers import OpportunitySerializer, ApplicationSerializer


class OpportunityListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        opportunities = Opportunity.objects.filter(is_active=True)
        serializer = OpportunitySerializer(opportunities, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_staff:
            return Response({"detail": "Only admins can create opportunities."}, status=status.HTTP_403_FORBIDDEN)
        serializer = OpportunitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Opportunity created successfully", "opportunity": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OpportunityDetailView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, pk):
        opportunity = get_object_or_404(Opportunity, pk=pk)
        serializer = OpportunitySerializer(opportunity)
        return Response(serializer.data)

    def put(self, request, pk):
        if not request.user.is_staff:
            return Response({"detail": "Only admins can update opportunities."}, status=status.HTTP_403_FORBIDDEN)
        opportunity = get_object_or_404(Opportunity, pk=pk)
        serializer = OpportunitySerializer(opportunity, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Opportunity updated successfully", "opportunity": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not request.user.is_staff:
            return Response({"detail": "Only admins can delete opportunities."}, status=status.HTTP_403_FORBIDDEN)
        opportunity = get_object_or_404(Opportunity, pk=pk)
        opportunity.delete()
        return Response({"detail": "Opportunity deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class ApplicationListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, opportunity_pk):
        applications = Application.objects.filter(opportunity_id=opportunity_pk, user=request.user)
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)

    def post(self, request, opportunity_pk):
        data = request.data.copy()
        data['user'] = request.user.id
        data['opportunity'] = opportunity_pk
        serializer = ApplicationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Application submitted successfully", "application": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApplicationDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        application = get_object_or_404(Application, pk=pk)
        serializer = ApplicationSerializer(application)
        return Response(serializer.data)

    def put(self, request, pk):
        application = get_object_or_404(Application, pk=pk)
        if application.user != request.user:
            return Response({"detail": "You can only update your own applications."}, status=status.HTTP_403_FORBIDDEN)
        serializer = ApplicationSerializer(application, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Application updated successfully", "application": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        application = get_object_or_404(Application, pk=pk)
        if application.user != request.user:
            return Response({"detail": "You can only delete your own applications."}, status=status.HTTP_403_FORBIDDEN)
        application.delete()
        return Response({"detail": "Application deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
