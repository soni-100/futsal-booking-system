from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.authtoken.models import Token

from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import redirect
from django.utils import timezone

import hmac
import hashlib
import base64
import json

from .models import Booking, Payment, Review, Notification
from .serializers import BookingSerializer, PaymentSerializer, ReviewSerializer, NotificationSerializer


# =========================
# 🔐 eSewa SIGNATURE
# =========================
def generate_signature(message, secret):
    secret_key = secret.encode()
    message = message.encode()
    hash = hmac.new(secret_key, message, hashlib.sha256)
    return base64.b64encode(hash.digest()).decode()


# =========================
# 📅 BOOKING APIs
# =========================
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
            booking = serializer.save()

            # ✅ Auto create payment
            Payment.objects.create(
                booking=booking,
                amount=booking.total_price,
                status="pending"
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def booking_detail(request, pk):
    """Get, update, or delete a booking"""

    try:
        booking = Booking.objects.get(pk=pk, user=request.user)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BookingSerializer(booking)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = BookingSerializer(booking, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        booking.delete()
        return Response({'message': 'Booking deleted successfully'})


class BookingViewSet(ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Booking.objects.all()
        status_filter = self.request.query_params.get('status')

        if status_filter:
            queryset = queryset.filter(status=status_filter)

        return queryset


# =========================
# 💳 ESEWA PAYMENT
# =========================
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def initiate_esewa_payment(request, booking_id):
    """Redirect user to eSewa - requires authentication via token"""

    # Authenticate user using token from query
    token_key = request.GET.get('token')
    if not token_key:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        token = Token.objects.get(key=token_key)
        user = token.user
    except Token.DoesNotExist:
        return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

    # Check if booking belongs to the authenticated user
    if booking.user != user:
        return Response({'error': 'Unauthorized to pay for this booking'}, status=status.HTTP_403_FORBIDDEN)

    try:
        payment = Payment.objects.get(booking=booking)
    except Payment.DoesNotExist:
        # Create payment if it doesn't exist (fallback)
        payment = Payment.objects.create(
            booking=booking,
            amount=booking.total_price,
            status="pending"
        )

    transaction_uuid = f"BOOKING_{booking.id}"
    total_amount = str(booking.total_price)

    message = (
        f"amount={total_amount},"
        f"tax_amount=0,"
        f"total_amount={total_amount},"
        f"transaction_uuid={transaction_uuid},"
        f"product_code={settings.ESEWA_MERCHANT_ID}"
    )
    signature = generate_signature(message, settings.ESEWA_SECRET_KEY)

    data = {
        "amount": total_amount,
        "tax_amount": "0",
        "total_amount": total_amount,
        "transaction_uuid": transaction_uuid,
        "product_code": settings.ESEWA_MERCHANT_ID,
        "product_service_charge": "0",
        "product_delivery_charge": "0",
        "success_url": settings.ESEWA_SUCCESS_URL,
        "failure_url": settings.ESEWA_FAILURE_URL,
        "signed_field_names": "amount,tax_amount,total_amount,transaction_uuid,product_code",
        "signature": signature,
    }

    # eSewa requires POST form submission in its v2 API (GET redirect gives 405)
    inputs = "\n".join([
        f'<input type="hidden" name="{k}" value="{v}" />'
        for k, v in data.items()
    ])

    html = f"""
    <html>
      <head><title>Redirecting to eSewa</title></head>
      <body onload="document.forms[0].submit()">
        <p>Redirecting to eSewa payment...</p>
        <form action="{settings.ESEWA_URL}" method="POST">
          {inputs}
        </form>
      </body>
    </html>
    """

    return HttpResponse(html)


# =========================
# ✅ PAYMENT SUCCESS
# =========================
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def esewa_payment_success(request):
    """Handle eSewa payment success callback"""
    
    # Try to get transaction_uuid from query params directly
    transaction_uuid = request.GET.get("transaction_uuid")
    
    # If not found, try to decode from 'data' parameter (eSewa callback format)
    if not transaction_uuid:
        data_param = request.GET.get("data")
        if data_param:
            try:
                # Decode base64 encoded JSON data
                decoded_data = base64.b64decode(data_param).decode('utf-8')
                payload = json.loads(decoded_data)
                transaction_uuid = payload.get("transaction_uuid")
            except Exception as e:
                print(f"Error decoding eSewa data: {e}")
                return Response({"error": f"Invalid data format: {str(e)}"}, status=400)

    if not transaction_uuid:
        return Response({"error": "Invalid request - no transaction UUID"}, status=400)

    try:
        # Extract booking ID from transaction UUID (format: BOOKING_9)
        booking_id = transaction_uuid.split("_")[1]
        booking = Booking.objects.get(id=booking_id)
        payment = Payment.objects.get(booking=booking)
    except (IndexError, ValueError):
        return Response({"error": "Invalid transaction UUID format"}, status=400)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)
    except Payment.DoesNotExist:
        return Response({"error": "Payment not found"}, status=404)

    # Update booking status
    booking.payment_status = "paid"
    booking.status = "confirmed"
    booking.save()

    # Update payment status
    payment.status = "completed"
    payment.transaction_id = transaction_uuid
    payment.paid_at = timezone.now()
    payment.save()

    return redirect(f"{settings.FRONTEND_URL}/payment-success/{booking.id}")


# =========================
# ❌ PAYMENT FAILURE
# =========================
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def esewa_payment_failure(request):
    return redirect(f"{settings.FRONTEND_URL}/payment-failed")