from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'manage', views.BookingViewSet, basename='booking')

urlpatterns = [
    path('', views.booking_list_create, name='booking_list_create'),
    path('<int:pk>/', views.booking_detail, name='booking_detail'),
    path('', include(router.urls)),
]
