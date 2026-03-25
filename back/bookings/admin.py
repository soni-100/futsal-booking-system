from django.contrib import admin
from .models import Booking, Payment, Review, Notification


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'court', 'booking_date', 'start_time', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'payment_status', 'booking_date', 'created_at')
    search_fields = ('user__email', 'court__name')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('booking', 'amount', 'payment_method', 'status', 'paid_at', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('booking__user__email', 'transaction_id')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'court', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__email', 'court__name')


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'notification_type', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('user__email', 'title')
