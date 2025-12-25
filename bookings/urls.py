from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BookingViewSet, BookingMeView, BookingCancelView, BookingAvailabilityView


router = DefaultRouter(trailing_slash=False)
router.register(r'', BookingViewSet, basename='bookings')

urlpatterns = [
    path('me', BookingMeView.as_view(), name='bookings-me'),
    path('check-availability', BookingAvailabilityView.as_view(), name='bookings-check-availability'),
    path('<uuid:pk>/cancel', BookingCancelView.as_view(), name='bookings-cancel'),
    path('', include(router.urls)),
]
