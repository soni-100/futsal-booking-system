from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'confirm_password', 'first_name', 'last_name', 'phone')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            username=validated_data['email'],  # Use email as username
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone=validated_data.get('phone', ''),
            is_active=True  # Ensure user is active immediately after registration
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    is_admin_user = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'phone', 'date_joined', 'last_login', 'is_admin_user', 'is_staff', 'is_superuser')
        read_only_fields = ('id', 'date_joined', 'last_login')

    def get_is_admin_user(self, obj):
        """Check if user is admin (has any admin privilege)"""
        return obj.is_staff or obj.is_admin or obj.is_superuser


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email', '').lower()  # Convert to lowercase for comparison
        password = attrs.get('password')

        if email and password:
            # Try to find user by email (case-insensitive)
            try:
                # First, try to authenticate with the email
                user = authenticate(username=email, password=password)
                if user:
                    if not user.is_active:
                        raise serializers.ValidationError('User account is disabled.')
                    attrs['user'] = user
                    return attrs
            except:
                pass
            
            # If normal authenticate fails, try case-insensitive lookup
            from django.contrib.auth import get_user_model
            UserModel = get_user_model()
            try:
                user = UserModel.objects.get(email__iexact=email)
                if user.check_password(password):
                    if not user.is_active:
                        raise serializers.ValidationError('User account is disabled.')
                    attrs['user'] = user
                    return attrs
            except UserModel.DoesNotExist:
                pass
            
            raise serializers.ValidationError('Invalid email or password.')
        else:
            raise serializers.ValidationError('Must include "email" and "password".')

        return attrs


class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email', '').lower()  # Convert to lowercase for comparison
        password = attrs.get('password')

        if email and password:
            # Try to find user by email (case-insensitive)
            from django.contrib.auth import get_user_model
            UserModel = get_user_model()
            try:
                user = UserModel.objects.get(email__iexact=email)
                if user.check_password(password):
                    if not user.is_active:
                        raise serializers.ValidationError('User account is disabled.')
                    if not (user.is_staff or user.is_admin or user.is_superuser):
                        raise serializers.ValidationError('You do not have admin privileges.')
                    attrs['user'] = user
                    return attrs
            except UserModel.DoesNotExist:
                pass
            
            raise serializers.ValidationError('Invalid email or password.')
        else:
            raise serializers.ValidationError('Must include "email" and "password".')

        return attrs
