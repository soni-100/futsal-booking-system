from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'manage', views.CourtViewSet, basename='court')

urlpatterns = [
    path('', views.court_list, name='court_list'),
    path('<int:pk>/', views.court_detail, name='court_detail'),
    path('', include(router.urls)),
]
