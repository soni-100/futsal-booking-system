from rest_framework import serializers
from .models import Court, TimeSlot


class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ('id', 'start_time', 'end_time', 'day_of_week', 'is_available')


class CourtSerializer(serializers.ModelSerializer):
    time_slots = TimeSlotSerializer(many=True, read_only=True)
    image_src = serializers.SerializerMethodField()

    class Meta:
        model = Court
        fields = ('id', 'name', 'location', 'description', 'price_per_hour', 
                  'capacity', 'image', 'image_url', 'image_src', 'is_active', 'time_slots', 
                  'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at', 'image_url', 'image_src')

    def get_image_src(self, obj):
        """Return the best available image source - never returns None"""
        request = self.context.get('request') if hasattr(self, 'context') else None

        # Try external image_url first
        if obj.image_url:
            return obj.image_url

        # Try uploaded image file
        if obj.image:
            image_url = obj.image.url if hasattr(obj.image, 'url') else str(obj.image)
            # Convert relative to absolute if possible
            if image_url.startswith('/') and request is not None:
                return request.build_absolute_uri(image_url)
            # Return relative path as-is (Vite proxy will handle it)
            return image_url

        # Fallback to placeholder if no image at all
        return f"https://via.placeholder.com/400x300?text={obj.name.replace(' ', '+')}"


class CourtListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list views"""
    available_slots = serializers.SerializerMethodField()
    image_src = serializers.SerializerMethodField()

    class Meta:
        model = Court
        fields = ('id', 'name', 'location', 'description', 'price_per_hour', 
                  'capacity', 'image', 'image_url', 'image_src', 'is_active', 'available_slots')

    def get_image_src(self, obj):
        """Return the best available image source"""
        request = self.context.get('request') if hasattr(self, 'context') else None

        if obj.image_url:
            return obj.image_url

        if obj.image:
            image_url = obj.image.url if hasattr(obj.image, 'url') else str(obj.image)
            if image_url.startswith('/') and request is not None:
                return request.build_absolute_uri(image_url)
            return image_url

        # Fallback to placeholder if no image
        return f"https://via.placeholder.com/400x300?text={obj.name.replace(' ', '+')}"

    def get_available_slots(self, obj):
        slots = TimeSlot.objects.filter(court=obj, is_available=True).values_list('start_time', flat=True).distinct()
        return [f"{s.strftime('%H:%M')}" for s in slots] if slots else ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
