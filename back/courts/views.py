from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import Court, TimeSlot
from .serializers import CourtSerializer, CourtListSerializer


# =========================
# 🔐 ADMIN PERMISSION CLASS
# =========================
class IsAdmin(permissions.BasePermission):
    """Custom permission to check if user is admin"""
    message = "Admin access required"

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (
            request.user.is_staff or 
            getattr(request.user, 'is_admin', False) or 
            request.user.is_superuser
        )


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def court_list(request):
    """List all active courts"""
    courts = Court.objects.filter(is_active=True)
    serializer = CourtListSerializer(courts, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def court_detail(request, pk):
    """Get court details"""
    try:
        court = Court.objects.get(pk=pk, is_active=True)
        serializer = CourtSerializer(court, context={'request': request})
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
    permission_classes = [IsAdmin]
