from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'phone', 'is_staff', 'is_admin', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_admin', 'is_active', 'date_joined')
    search_fields = ('email', 'first_name', 'last_name', 'phone')
    ordering = ('-date_joined',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('phone', 'is_admin')}),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('phone', 'is_admin')}),
    )
