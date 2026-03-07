from django.urls import path
from . import views

urlpatterns = [
    # User authentication
    path('register/', views.user_register, name='user_register'),
    path('login/', views.user_login, name='user_login'),
    path('user/', views.user_detail, name='user_detail'),
    path('logout/', views.logout, name='logout'),
    
    # Admin authentication and management
    path('admin/login/', views.admin_login, name='admin_login'),
    path('admin/user/', views.admin_detail, name='admin_detail'),
    path('admin/users/', views.admin_users_list, name='admin_users_list'),
    path('admin/users/<int:pk>/toggle/', views.admin_user_toggle_active, name='admin_user_toggle_active'),
    path('admin/stats/', views.admin_stats, name='admin_stats'),
]
