from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, MeView,
    ProfileView,
    AddressListCreateView, AddressDetailView,
    CardListCreateView, CardDetailView,
    NotificationSettingsView,
    ChangePasswordView,
)

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('me/', MeView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('addresses/', AddressListCreateView.as_view()),
    path('addresses/<int:pk>/', AddressDetailView.as_view()),
    path('cards/', CardListCreateView.as_view()),
    path('cards/<int:pk>/', CardDetailView.as_view()),
    path('notifications/', NotificationSettingsView.as_view()),
    path('change-password/', ChangePasswordView.as_view()),
]
