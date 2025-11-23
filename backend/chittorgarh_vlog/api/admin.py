from django.contrib import admin
from .models import Booking, PDFPurchase, MediaKitDownload


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_id', 'name', 'email', 'plan', 'amount', 'status', 'created_at')
    list_filter = ('status', 'plan', 'created_at')
    search_fields = ('name', 'email', 'booking_id')
    readonly_fields = ('booking_id', 'created_at')


@admin.register(PDFPurchase)
class PDFPurchaseAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'pdf_name', 'amount', 'payment_status', 'downloaded_at', 'created_at')
    list_filter = ('payment_status', 'created_at', 'downloaded_at')
    search_fields = ('name', 'email', 'razorpay_order_id', 'razorpay_payment_id')
    readonly_fields = ('download_token', 'created_at', 'updated_at')
    
    def has_delete_permission(self, request, obj=None):
        # Prevent deletion of payment records for legal/audit purposes
        return False


@admin.register(MediaKitDownload)
class MediaKitDownloadAdmin(admin.ModelAdmin):
    list_display = ('pdf_name', 'email', 'file_size_mb', 'ip_address', 'downloaded_at')
    list_filter = ('pdf_name', 'downloaded_at')
    search_fields = ('email', 'ip_address')
    readonly_fields = ('downloaded_at',)