from django.db import models
import uuid


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('payment_received', 'Payment Received'),
        ('completed', 'Completed'),
    ]

    booking_id = models.CharField(max_length=20, unique=True, editable=False)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    contact = models.CharField(max_length=15)
    # Store uploaded video file path (saved to local container)
    video_file = models.FileField(upload_to='uploaded_videos/', blank=True, null=True)
    plan = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.booking_id:
            self.booking_id = f'BK-{str(uuid.uuid4().hex[:8]).upper()}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.booking_id}"