from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import *

router = DefaultRouter()
router.register(r'manage', views.BookingViewSet, basename='booking')

urlpatterns = [
    path('', views.booking_list_create, name='booking_list_create'),
    path('<int:pk>/', views.booking_detail, name='booking_detail'),
    path('', include(router.urls)),
    path('pay/<int:booking_id>/', initiate_esewa_payment),
    path('payment-success/', esewa_payment_success),
    path('payment-failure/', esewa_payment_failure),
]
