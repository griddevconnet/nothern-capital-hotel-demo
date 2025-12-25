from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import RoomViewSet, RoomAvailabilityView


router = DefaultRouter(trailing_slash=False)
router.register(r'', RoomViewSet, basename='rooms')

urlpatterns = [
    path('check-availability', RoomAvailabilityView.as_view(), name='rooms-check-availability'),
    path('availability', RoomAvailabilityView.as_view(), name='rooms-availability-alias'),
    path('', include(router.urls)),
]
