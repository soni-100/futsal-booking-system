from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom User model extending Django's AbstractUser"""
    phone = models.CharField(max_length=20, blank=True, null=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
