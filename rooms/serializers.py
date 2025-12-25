from rest_framework import serializers

from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    maxOccupancy = serializers.IntegerField(source='max_occupancy')
    isActive = serializers.BooleanField(source='is_active')

    class Meta:
        model = Room
        fields = [
            'id',
            'name',
            'description',
            'price',
            'size',
            'maxOccupancy',
            'amenities',
            'isActive',
            'created_at',
            'updated_at',
        ]
