from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import Court, TimeSlot
from .serializers import CourtSerializer, CourtListSerializer


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def court_list(request):
    """List all active courts"""
    courts = Court.objects.filter(is_active=True)
    serializer = CourtListSerializer(courts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def court_detail(request, pk):
    """Get court details"""
    try:
        court = Court.objects.get(pk=pk, is_active=True)
        serializer = CourtSerializer(court)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Court.DoesNotExist:
        return Response(
            {'error': 'Court not found'},
            status=status.HTTP_404_NOT_FOUND
        )


class CourtViewSet(ModelViewSet):
    """ViewSet for admin court management - requires admin for create/update/delete"""
    queryset = Court.objects.all()
    serializer_class = CourtSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if not (self.request.user.is_staff or getattr(self.request.user, 'is_admin', False) or self.request.user.is_superuser):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Admin access required')
        serializer.save()

    def perform_update(self, serializer):
        if not (self.request.user.is_staff or getattr(self.request.user, 'is_admin', False) or self.request.user.is_superuser):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Admin access required')
        serializer.save()

    def perform_destroy(self, instance):
        if not (self.request.user.is_staff or getattr(self.request.user, 'is_admin', False) or self.request.user.is_superuser):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Admin access required')
        instance.delete()
