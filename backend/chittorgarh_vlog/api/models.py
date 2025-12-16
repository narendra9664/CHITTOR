from django.db import models
import uuid
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError


def validate_video_file(value):
    """Custom validator for video file uploads"""
    if value:
        allowed_types = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo']
        if value.content_type not in allowed_types:
            raise ValidationError(f'Video file type not supported. Allowed types: {allowed_types}')

        # Check file size (limit to 500MB)
        max_size = 500 * 1024 * 1024  # 500MB
        if value.size > max_size:
            raise ValidationError('Video file size too large. Maximum size is 500MB')


def validate_name(value):
    """Custom validator for name field"""
    import re
    if not re.match(r'^[a-zA-Z\s\-\'\.]+$', value):
        raise ValidationError('Name contains invalid characters')


def validate_contact(value):
    """Custom validator for contact field"""
    if not value.isdigit() or len(value) < 10 or len(value) > 15:
        raise ValidationError('Contact number must be 10-15 digits')


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('payment_received', 'Payment Received'),
        ('completed', 'Completed'),
    ]

    booking_id = models.CharField(max_length=20, unique=True, editable=False)
    name = models.CharField(max_length=100, validators=[validate_name])
    email = models.EmailField()
    contact = models.CharField(max_length=15, validators=[validate_contact])
    # Store uploaded video file path (saved to local container)
    video_file = models.FileField(upload_to='uploaded_videos/', blank=True, null=True, validators=[validate_video_file])
    plan = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=20, default='razorpay')
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.booking_id:
            self.booking_id = f'BK-{str(uuid.uuid4().hex[:8]).upper()}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.booking_id}"


class PDFPurchase(models.Model):
    """Model for paid PDF downloads (₹9 Chittorgarh Guide)"""
    
    # Customer Information
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    
    # PDF Details
    pdf_name = models.CharField(max_length=200, default='chittorgarh-guide.pdf')
    amount = models.IntegerField(default=9)  # ₹9
    
    # Razorpay Integration
    razorpay_order_id = models.CharField(max_length=200, unique=True)
    razorpay_payment_id = models.CharField(max_length=200, blank=True, null=True)
    payment_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('completed', 'Completed'),
            ('failed', 'Failed'),
        ],
        default='pending'
    )
    
    # Download Tracking
    download_token = models.CharField(max_length=100, blank=True, null=True, unique=True)
    downloaded_at = models.DateTimeField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'PDF Purchase'
        verbose_name_plural = 'PDF Purchases'
    
    def __str__(self):
        return f"{self.name} - {self.pdf_name} - ₹{self.amount}"


class MediaKitDownload(models.Model):
    """Model for free media kit downloads"""
    
    # Optional tracking
    email = models.EmailField(blank=True, null=True)
    
    # PDF Details
    pdf_name = models.CharField(max_length=200)
    file_size_mb = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Analytics
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=500, blank=True)
    
    # Timestamp
    downloaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-downloaded_at']
        verbose_name = 'Media Kit Download'
        verbose_name_plural = 'Media Kit Downloads'
    
    def __str__(self):
        return f"{self.pdf_name} - {self.downloaded_at.strftime('%Y-%m-%d %H:%M')}"