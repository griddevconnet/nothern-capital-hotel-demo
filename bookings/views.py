from datetime import date

from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsReceptionistOrAdmin

from .models import Booking, BookingStatus
from .serializers import AdminBookingUpdateSerializer, BookingCreateSerializer, BookingSerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.select_related('room', 'created_by').all().order_by('-created_at')

    def get_serializer_class(self):
        if self.action == 'create':
            return BookingCreateSerializer
        return BookingSerializer

    def get_permissions(self):
        if self.action in ('retrieve', 'list'):
            return [permissions.AllowAny()]
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [IsReceptionistOrAdmin()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)


class BookingMeView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BookingSerializer

    def get_queryset(self):
        # For customers: their own created bookings
        return Booking.objects.select_related('room', 'created_by').filter(created_by=self.request.user).order_by('-created_at')


class BookingCancelView(APIView):
    permission_classes = [permissions.AllowAny]

    def delete(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response({'message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

        if booking.status in (BookingStatus.CANCELLED, BookingStatus.CHECKED_OUT):
            return Response({'message': 'Booking cannot be cancelled'}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = BookingStatus.CANCELLED
        booking.save(update_fields=['status', 'updated_at'])
        return Response(BookingSerializer(booking).data)


class BookingAvailabilityView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        room_id = request.data.get('roomId')
        check_in = request.data.get('checkIn')
        check_out = request.data.get('checkOut')
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

        overlapping = Booking.objects.filter(
            room_id=room_id,
            status__in=(BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN),
            check_in__lt=check_out_date,
            check_out__gt=check_in_date,
        ).exists()

        return Response({'available': not overlapping})


class AdminBookingsView(generics.ListAPIView):
    permission_classes = [IsReceptionistOrAdmin]
    serializer_class = BookingSerializer

    def get_queryset(self):
        return Booking.objects.select_related('room', 'created_by').all().order_by('-created_at')


class AdminBookingDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsReceptionistOrAdmin]
    queryset = Booking.objects.select_related('room', 'created_by').all()

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return AdminBookingUpdateSerializer
        return BookingSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Receptionists can update most booking fields we expose here.
        # You can tighten this later if needed.
        self.perform_update(serializer)
        return Response(BookingSerializer(instance).data)
