from django.contrib import admin

from .models import Room


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'max_occupancy', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name',)
