from django.urls import path
from . import views

urlpatterns = [
    # Video booking endpoints
    path('create/', views.create_booking, name='create_booking'),
    path('create-order/', views.create_order, name='create_order'),
    path('verify-payment/', views.verify_payment, name='verify_payment'),
    path('submit-manual-payment/', views.submit_manual_payment, name='submit_manual_payment'),
    path('status/<str:booking_id>/', views.booking_status, name='booking_status'),
    path('pdf/<str:booking_id>/', views.generate_pdf, name='generate_pdf'),
    path('bookings/', views.list_bookings, name='list_bookings'),
    
    # PDF download endpoints
    path('pdf-info/', views.get_pdf_info, name='get_pdf_info'),
    path('pdf-purchase/', views.create_pdf_purchase, name='create_pdf_purchase'),
    path('pdf-verify-payment/', views.verify_pdf_payment, name='verify_pdf_payment'),
    path('pdf-submit-manual-payment/', views.submit_pdf_manual_payment, name='submit_pdf_manual_payment'),
    path('pdf-download/<str:token>/', views.download_paid_pdf, name='download_paid_pdf'),
    path('mediakit-track/', views.track_mediakit_download, name='track_mediakit_download'),
    path('mediakit-download/<str:filename>/', views.download_mediakit_pdf, name='download_mediakit_pdf'),
]