from rest_framework import serializers
from .models import Booking
import re


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['name', 'email', 'contact', 'video_file', 'plan', 'amount', 'booking_id', 'status', 'created_at']
        read_only_fields = ['booking_id', 'status', 'created_at']

    def validate_name(self, value):
        # Validate name format to prevent XSS and injection
        if not re.match(r'^[a-zA-Z\s\-\'\.]+$', value):
            raise serializers.ValidationError("Name contains invalid characters")
        return value.strip()

    def validate_email(self, value):
        # Use Django's built-in email validator
        from django.core.validators import validate_email
        try:
            validate_email(value)
        except Exception:
            raise serializers.ValidationError("Invalid email format")
        return value.lower().strip()

    def validate_contact(self, value):
        # Validate contact is digits only and within length limits
        if not value.isdigit() or len(value) < 10 or len(value) > 15:
            raise serializers.ValidationError("Contact number must be 10-15 digits")
        return value

    def validate_video_file(self, value):
        if value:
            # Check file type
            allowed_types = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo']
            if value.content_type not in allowed_types:
                raise serializers.ValidationError(f"Video file type not supported. Allowed types: {allowed_types}")

            # Check file size (limit to 500MB)
            max_size = 500 * 1024 * 1024  # 500MB
            if value.size > max_size:
                raise serializers.ValidationError("Video file size too large. Maximum size is 500MB")
        return value