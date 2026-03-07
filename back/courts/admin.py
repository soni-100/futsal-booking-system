from django.contrib import admin
from .models import Court, TimeSlot


@admin.register(Court)
class CourtAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'price_per_hour', 'capacity', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'location')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ('court', 'day_of_week', 'start_time', 'end_time', 'is_available')
    list_filter = ('day_of_week', 'is_available', 'court')
    search_fields = ('court__name',)
