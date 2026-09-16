from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import RegisterSerializer, UserSerializer

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
