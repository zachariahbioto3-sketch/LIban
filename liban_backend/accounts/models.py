from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    TIER_CHOICES = [
        ('standard', 'Standard'),
        ('silver', 'Silver'),
        ('gold', 'Gold'),
        ('platinum', 'Platinum VIP'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=30, blank=True, default='')
    bio = models.TextField(blank=True, default='')
    company = models.CharField(max_length=120, blank=True, default='')
    birthday = models.DateField(null=True, blank=True)
    avatar_url = models.URLField(max_length=500, blank=True, default='')
    member_tier = models.CharField(max_length=20, choices=TIER_CHOICES, default='standard')
    loyalty_points = models.PositiveIntegerField(default=0)
    one_click_checkout = models.BooleanField(default=False)
    member_since = models.DateField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} — profile'


class SavedAddress(models.Model):
    LABEL_CHOICES = [
        ('Home', 'Home'),
        ('Office', 'Office / HQ'),
        ('Studio', 'Studio / Lab'),
        ('Warehouse', 'Warehouse / Depot'),
        ('Other', 'Other'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    label = models.CharField(max_length=20, choices=LABEL_CHOICES, default='Home')
    full_name = models.CharField(max_length=120)
    email = models.EmailField(blank=True, default='')
    phone = models.CharField(max_length=30, blank=True, default='')
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True, default='')
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='Kenya')
    is_default = models.BooleanField(default=False)
    delivery_instructions = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_default', 'created_at']

    def save(self, *args, **kwargs):
        if self.is_default:
            SavedAddress.objects.filter(user=self.user, is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.user.username} — {self.label}'


class PaymentCard(models.Model):
    BRAND_CHOICES = [
        ('visa', 'Visa'),
        ('mastercard', 'Mastercard'),
        ('amex', 'Amex'),
        ('discover', 'Discover'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_cards')
    holder_name = models.CharField(max_length=120)
    card_number_last4 = models.CharField(max_length=4)
    card_brand = models.CharField(max_length=20, choices=BRAND_CHOICES, default='visa')
    expiry_month = models.CharField(max_length=2)
    expiry_year = models.CharField(max_length=2)
    is_default = models.BooleanField(default=False)
    card_color = models.CharField(max_length=120, default='from-slate-900 via-indigo-950 to-slate-900')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_default', 'created_at']

    def save(self, *args, **kwargs):
        if self.is_default:
            PaymentCard.objects.filter(user=self.user, is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.user.username} — {self.card_brand} ****{self.card_number_last4}'


class NotificationSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_settings')
    order_updates_email = models.BooleanField(default=True)
    order_updates_sms = models.BooleanField(default=False)
    driver_arrival_alerts = models.BooleanField(default=True)
    price_drop_alerts = models.BooleanField(default=True)
    weekly_digest = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.user.username} — notifications'
