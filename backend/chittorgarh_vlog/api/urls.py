from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_booking, name='create_booking'),
    path('create-order/', views.create_order, name='create_order'),
    path('verify-payment/', views.verify_payment, name='verify_payment'),
    path('status/<str:booking_id>/', views.booking_status, name='booking_status'),
    path('pdf/<str:booking_id>/', views.generate_pdf, name='generate_pdf'),
    path('bookings/', views.list_bookings, name='list_bookings'),  # For admin access to videos
]