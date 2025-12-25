import uuid

from django.conf import settings
from django.db import models


class BookingStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pending'
    CONFIRMED = 'CONFIRMED', 'Confirmed'
    CANCELLED = 'CANCELLED', 'Cancelled'
    CHECKED_IN = 'CHECKED_IN', 'Checked In'
    CHECKED_OUT = 'CHECKED_OUT', 'Checked Out'


class PaymentStatus(models.TextChoices):
    UNPAID = 'UNPAID', 'Unpaid'
    PAID = 'PAID', 'Paid'


class PaymentMethod(models.TextChoices):
    UNSPECIFIED = 'UNSPECIFIED', 'Unspecified'
    CASH = 'CASH', 'Cash'
    MOMO = 'MOMO', 'Mobile Money'


class Booking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reference = models.CharField(max_length=32, unique=True, blank=True)

    room = models.ForeignKey('rooms.Room', on_delete=models.PROTECT, related_name='bookings')
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_bookings',
    )

    check_in = models.DateField()
    check_out = models.DateField()
    adults = models.PositiveIntegerField(default=1)
    children = models.PositiveIntegerField(default=0)
    special_requests = models.TextField(blank=True)

    status = models.CharField(max_length=20, choices=BookingStatus.choices, default=BookingStatus.PENDING)
    payment_status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.UNPAID)
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices, default=PaymentMethod.UNSPECIFIED)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    guest_first_name = models.CharField(max_length=100, blank=True)
    guest_last_name = models.CharField(max_length=100, blank=True)
    guest_email = models.EmailField(blank=True)
    guest_phone = models.CharField(max_length=50, blank=True)
    guest_address = models.CharField(max_length=255, blank=True)
    guest_city = models.CharField(max_length=100, blank=True)
    guest_country = models.CharField(max_length=100, blank=True)
    guest_postal_code = models.CharField(max_length=30, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.reference:
            self.reference = f"NCH-{uuid.uuid4().hex[:10].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.reference
