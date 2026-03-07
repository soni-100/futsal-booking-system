from rest_framework import serializers
from .models import Booking, Payment, Review, Notification
from accounts.serializers import UserSerializer
from courts.serializers import CourtListSerializer


class BookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    court = CourtListSerializer(read_only=True)
    court_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Booking
        fields = ('id', 'user', 'court', 'court_id', 'booking_date', 'start_time', 
                  'end_time', 'duration', 'total_price', 'status', 'payment_status', 
                  'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')
        extra_kwargs = {'total_price': {'required': False}}

    def create(self, validated_data):
        from courts.models import Court
        validated_data['user'] = self.context['request'].user
        court_id = validated_data.pop('court_id')
        court = Court.objects.get(pk=court_id)
        validated_data['court'] = court
        if 'total_price' not in validated_data or validated_data['total_price'] is None:
            validated_data['total_price'] = float(court.price_per_hour) * validated_data.get('duration', 1)
        return super().create(validated_data)


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ('id', 'booking', 'amount', 'payment_method', 'transaction_id', 
                  'status', 'paid_at', 'created_at')
        read_only_fields = ('id', 'created_at')


class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    court = CourtListSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'user', 'court', 'booking', 'rating', 'comment', 
                  'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('id', 'user', 'title', 'message', 'type', 'is_read', 'created_at')
        read_only_fields = ('id', 'created_at')
