from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['name', 'email', 'contact', 'video_file', 'plan', 'amount', 'booking_id', 'status', 'created_at']
        read_only_fields = ['booking_id', 'status', 'created_at']