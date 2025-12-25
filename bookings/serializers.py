from datetime import date

from rest_framework import serializers

from accounts.serializers import UserSerializer
from rooms.serializers import RoomSerializer

from .models import Booking, BookingStatus, PaymentMethod, PaymentStatus


class _ISODateField(serializers.DateField):
    def to_internal_value(self, value):
        if isinstance(value, str) and len(value) >= 10:
            value = value[:10]
        return super().to_internal_value(value)


class BookingCreateSerializer(serializers.ModelSerializer):
    roomId = serializers.IntegerField(write_only=True)
    checkIn = _ISODateField(write_only=True)
    checkOut = _ISODateField(write_only=True)

    guestInfo = serializers.DictField(write_only=True)
    specialRequests = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'roomId',
            'checkIn',
            'checkOut',
            'adults',
            'children',
            'special_requests',
            'specialRequests',
            'guestInfo',
        ]

    def validate(self, attrs):
        check_in = attrs['checkIn']
        check_out = attrs['checkOut']
        if check_out <= check_in:
            raise serializers.ValidationError('Check-out must be after check-in')
        if check_in < date.today():
            raise serializers.ValidationError('Check-in cannot be in the past')
        return attrs

    def create(self, validated_data):
        room_id = validated_data.pop('roomId')
        check_in = validated_data.pop('checkIn')
        check_out = validated_data.pop('checkOut')
        guest_info = validated_data.pop('guestInfo')
        special_requests = validated_data.pop('specialRequests', '') or validated_data.get('special_requests', '')

        booking = Booking.objects.create(
            room_id=room_id,
            check_in=check_in,
            check_out=check_out,
            adults=validated_data.get('adults', 1),
            children=validated_data.get('children', 0),
            special_requests=special_requests,
            guest_first_name=guest_info.get('firstName', ''),
            guest_last_name=guest_info.get('lastName', ''),
            guest_email=guest_info.get('email', ''),
            guest_phone=guest_info.get('phone', ''),
            guest_address=guest_info.get('address', ''),
            guest_city=guest_info.get('city', ''),
            guest_country=guest_info.get('country', ''),
            guest_postal_code=guest_info.get('postalCode', ''),
            status=BookingStatus.PENDING,
            payment_status=PaymentStatus.UNPAID,
            payment_method=PaymentMethod.UNSPECIFIED,
            created_by=self.context['request'].user if self.context['request'].user.is_authenticated else None,
        )
        return booking


class BookingSerializer(serializers.ModelSerializer):
    room = RoomSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'reference',
            'room',
            'check_in',
            'check_out',
            'adults',
            'children',
            'special_requests',
            'status',
            'payment_status',
            'payment_method',
            'amount_paid',
            'guest_first_name',
            'guest_last_name',
            'guest_email',
            'guest_phone',
            'guest_address',
            'guest_city',
            'guest_country',
            'guest_postal_code',
            'created_by',
            'created_at',
            'updated_at',
        ]


class AdminBookingUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['status', 'payment_status', 'payment_method', 'amount_paid']
