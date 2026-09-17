from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile, SavedAddress, PaymentCard, NotificationSettings


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'phone', 'bio', 'company', 'birthday',
            'avatar_url', 'member_tier', 'loyalty_points',
            'one_click_checkout', 'member_since',
        ]
        read_only_fields = ['member_tier', 'loyalty_points', 'member_since']


class SavedAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedAddress
        fields = [
            'id', 'label', 'full_name', 'email', 'phone',
            'street', 'city', 'state', 'zip_code', 'country',
            'is_default', 'delivery_instructions', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class PaymentCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentCard
        fields = [
            'id', 'holder_name', 'card_number_last4', 'card_brand',
            'expiry_month', 'expiry_year', 'is_default', 'card_color', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class NotificationSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationSettings
        fields = [
            'order_updates_email', 'order_updates_sms',
            'driver_arrival_alerts', 'price_drop_alerts', 'weekly_digest',
        ]
