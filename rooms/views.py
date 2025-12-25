from datetime import date

from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsReceptionistOrAdmin
from bookings.models import Booking, BookingStatus

from .models import Room
from .serializers import RoomSerializer


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all().order_by('id')
    serializer_class = RoomSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [IsReceptionistOrAdmin()]


class RoomAvailabilityView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        room_id = request.data.get('roomId') or request.data.get('room_id')
        check_in = request.data.get('checkIn') or request.data.get('check_in')
        check_out = request.data.get('checkOut') or request.data.get('check_out')

        if not room_id or not check_in or not check_out:
            return Response({'message': 'roomId, checkIn, checkOut are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            room_id = int(room_id)
        except (TypeError, ValueError):
            return Response({'message': 'roomId must be an integer'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            check_in_date = date.fromisoformat(str(check_in)[:10])
            check_out_date = date.fromisoformat(str(check_out)[:10])
        except ValueError:
            return Response({'message': 'Dates must be ISO format'}, status=status.HTTP_400_BAD_REQUEST)

        if check_out_date <= check_in_date:
            return Response({'available': False, 'message': 'Invalid date range'}, status=status.HTTP_200_OK)

        overlapping = Booking.objects.filter(
            room_id=room_id,
            status__in=(BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN),
            check_in__lt=check_out_date,
            check_out__gt=check_in_date,
        ).exists()

        return Response({'available': not overlapping})
