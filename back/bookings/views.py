from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .models import Booking, Payment, Review, Notification
from .serializers import BookingSerializer, PaymentSerializer, ReviewSerializer, NotificationSerializer


@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def booking_list_create(request):
    """List user's bookings or create a new booking"""
    if request.method == 'GET':
        bookings = Booking.objects.filter(user=request.user)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = BookingSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def booking_detail(request, pk):
    """Get, update, or delete a booking"""
    try:
        booking = Booking.objects.get(pk=pk, user=request.user)
    except Booking.DoesNotExist:
        return Response(
            {'error': 'Booking not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        serializer = BookingSerializer(booking, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        booking.delete()
        return Response({'message': 'Booking deleted successfully'}, status=status.HTTP_200_OK)


class BookingViewSet(ModelViewSet):
    """ViewSet for admin booking management"""
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Booking.objects.all()
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset
