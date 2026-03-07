from rest_framework import serializers
from .models import Court, TimeSlot


class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ('id', 'start_time', 'end_time', 'day_of_week', 'is_available')


class CourtSerializer(serializers.ModelSerializer):
    time_slots = TimeSlotSerializer(many=True, read_only=True)

    class Meta:
        model = Court
        fields = ('id', 'name', 'location', 'description', 'price_per_hour', 
                  'capacity', 'image', 'image_url', 'is_active', 'time_slots', 
                  'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class CourtListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list views"""
    available_slots = serializers.SerializerMethodField()

    class Meta:
        model = Court
        fields = ('id', 'name', 'location', 'description', 'price_per_hour', 
                  'capacity', 'image_url', 'is_active', 'available_slots')

    def get_available_slots(self, obj):
        slots = TimeSlot.objects.filter(court=obj, is_available=True).values_list('start_time', flat=True).distinct()
        return [f"{s.strftime('%H:%M')}" for s in slots] if slots else ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
