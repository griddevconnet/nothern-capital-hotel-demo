from django.urls import path

from .views import AdminBookingsView, AdminBookingDetailView

urlpatterns = [
    path('bookings', AdminBookingsView.as_view(), name='admin-bookings'),
    path('bookings/<uuid:pk>', AdminBookingDetailView.as_view(), name='admin-booking-detail'),
]
