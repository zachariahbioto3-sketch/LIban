from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import UserProfile, SavedAddress, PaymentCard, NotificationSettings
from .serializers import (
    RegisterSerializer, UserSerializer,
    UserProfileSerializer, SavedAddressSerializer,
    PaymentCardSerializer, NotificationSettingsSerializer,
)


# ── Auth ──────────────────────────────────────────────────────────────────────

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            if User.objects.filter(username=request.data.get('username')).exists():
                return Response({'error': 'Username already taken.'}, status=400)
            user = serializer.save()
            login(request, user)
            return Response(UserSerializer(user).data, status=201)
        return Response(serializer.errors, status=400)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return Response(UserSerializer(user).data)
        return Response({'error': 'Invalid username or password.'}, status=400)


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Logged out.'})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


# ── Profile ───────────────────────────────────────────────────────────────────

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        user_data = UserSerializer(request.user).data
        profile_data = UserProfileSerializer(profile).data
        return Response({**user_data, **profile_data})

    def patch(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        user = request.user

        # Update User fields
        user_fields = ['first_name', 'last_name', 'email']
        for field in user_fields:
            if field in request.data:
                setattr(user, field, request.data[field])
        user.save()

        # Update Profile fields
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            user_data = UserSerializer(user).data
            profile_data = UserProfileSerializer(profile).data
            return Response({**user_data, **profile_data})
        return Response(serializer.errors, status=400)


# ── Addresses ─────────────────────────────────────────────────────────────────

class AddressListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        addresses = SavedAddress.objects.filter(user=request.user)
        return Response(SavedAddressSerializer(addresses, many=True).data)

    def post(self, request):
        serializer = SavedAddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class AddressDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return SavedAddress.objects.get(pk=pk, user=user)
        except SavedAddress.DoesNotExist:
            return None

    def patch(self, request, pk):
        addr = self.get_object(pk, request.user)
        if not addr:
            return Response({'error': 'Not found.'}, status=404)
        serializer = SavedAddressSerializer(addr, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        addr = self.get_object(pk, request.user)
        if not addr:
            return Response({'error': 'Not found.'}, status=404)
        addr.delete()
        return Response(status=204)


# ── Payment Cards ─────────────────────────────────────────────────────────────

class CardListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cards = PaymentCard.objects.filter(user=request.user)
        return Response(PaymentCardSerializer(cards, many=True).data)

    def post(self, request):
        serializer = PaymentCardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class CardDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            card = PaymentCard.objects.get(pk=pk, user=request.user)
            card.delete()
            return Response(status=204)
        except PaymentCard.DoesNotExist:
            return Response({'error': 'Not found.'}, status=404)


# ── Notifications ─────────────────────────────────────────────────────────────

class NotificationSettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        settings, _ = NotificationSettings.objects.get_or_create(user=request.user)
        return Response(NotificationSettingsSerializer(settings).data)

    def patch(self, request):
        settings, _ = NotificationSettings.objects.get_or_create(user=request.user)
        serializer = NotificationSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


# ── Change Password ───────────────────────────────────────────────────────────

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current = request.data.get('current_password', '')
        new_pw = request.data.get('new_password', '')
        if not request.user.check_password(current):
            return Response({'error': 'Current password is incorrect.'}, status=400)
        if len(new_pw) < 8:
            return Response({'error': 'New password must be at least 8 characters.'}, status=400)
        request.user.set_password(new_pw)
        request.user.save()
        update_session_auth_hash(request, request.user)
        return Response({'message': 'Password updated successfully.'})
