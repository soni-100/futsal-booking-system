from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login
from django.db.models import Count
from django.utils import timezone
from .serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    UserLoginSerializer,
    AdminLoginSerializer
)
from .models import User


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def user_register(request):
    """User registration endpoint"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def user_login(request):
    """User login endpoint"""
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        login(request, user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def admin_login(request):
    """Admin login endpoint"""
    serializer = AdminLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        login(request, user)
        return Response({
            'token': token.key,
            'admin': UserSerializer(user).data,
            'message': 'Admin login successful'
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_detail(request):
    """Get current user details"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def admin_detail(request):
    """Get current admin details"""
    if not _is_admin(request.user):
        return Response(
            {'error': 'You do not have admin privileges.'},
            status=status.HTTP_403_FORBIDDEN
        )
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout(request):
    """Logout endpoint - delete token"""
    try:
        request.user.auth_token.delete()
    except Exception:
        pass
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


def _is_admin(user):
    return user.is_authenticated and (user.is_staff or getattr(user, 'is_admin', False) or user.is_superuser)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def admin_users_list(request):
    """List all users - admin only"""
    if not _is_admin(request.user):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    from bookings.models import Booking
    users = User.objects.exclude(is_superuser=True).annotate(
        total_bookings=Count('bookings')
    ).order_by('-date_joined')
    data = []
    for u in users:
        data.append({
            'id': u.id,
            'email': u.email,
            'first_name': u.first_name,
            'last_name': u.last_name,
            'phone': u.phone or '',
            'is_active': u.is_active,
            'date_joined': u.date_joined.isoformat() if u.date_joined else None,
            'total_bookings': u.total_bookings,
        })
    return Response(data, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def admin_user_toggle_active(request, pk):
    """Toggle user is_active - admin only"""
    if not _is_admin(request.user):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    try:
        user = User.objects.get(pk=pk)
        if user.is_superuser:
            return Response({'error': 'Cannot modify superuser'}, status=status.HTTP_400_BAD_REQUEST)
        user.is_active = not user.is_active
        user.save()
        return Response({'is_active': user.is_active}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def admin_stats(request):
    """Dashboard stats - admin only"""
    if not _is_admin(request.user):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    from courts.models import Court
    from bookings.models import Booking
    today = timezone.now().date()
    total_users = User.objects.exclude(is_superuser=True).count()
    total_courts = Court.objects.count()
    total_bookings = Booking.objects.count()
    total_revenue = sum(float(b.total_price) for b in Booking.objects.filter(status='confirmed'))
    today_bookings = Booking.objects.filter(booking_date=today).count()
    pending_bookings = Booking.objects.filter(status='pending').count()
    return Response({
        'totalUsers': total_users,
        'totalCourts': total_courts,
        'totalBookings': total_bookings,
        'totalRevenue': total_revenue,
        'todayBookings': today_bookings,
        'pendingBookings': pending_bookings,
    }, status=status.HTTP_200_OK)
