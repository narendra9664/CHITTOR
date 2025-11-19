from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.conf import settings
import razorpay
from reportlab.pdfgen import canvas
from django.http import HttpResponse
from .models import Booking
from .serializers import BookingSerializer
import uuid
import requests


# Initialize clients
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


@api_view(['POST'])
def create_booking(request):
    """Create a booking record and upload the video to Supabase storage (if provided).

    Returns: { booking_id, amount }
    """
    try:
        data = request.data
        name = data.get('name')
        email = data.get('email')
        contact = data.get('contact')
        plan = data.get('plan')
        amount = data.get('amount')

        video_url = None
        video_file = request.FILES.get('video_file')
        if video_file and settings.SUPABASE_URL and settings.SUPABASE_KEY:
            # create unique path inside the 'videos' bucket
            ext = video_file.name.split('.')[-1]
            filename = f"{uuid.uuid4().hex}.{ext}"
            bucket = 'videos'
            # Supabase Storage upload endpoint (PUT to object path)
            upload_url = f"{settings.SUPABASE_URL}/storage/v1/object/{bucket}/{filename}"
            headers = {
                'Authorization': f"Bearer {settings.SUPABASE_KEY}",
                'apikey': settings.SUPABASE_KEY,
                'Content-Type': getattr(video_file, 'content_type', 'application/octet-stream')
            }
            resp = requests.put(upload_url, data=video_file.read(), headers=headers)
            if resp.status_code in (200, 201):
                # public URL for bucket objects
                video_url = f"{settings.SUPABASE_URL}/storage/v1/object/public/{bucket}/{filename}"
            else:
                video_url = None

        booking = Booking.objects.create(
            name=name,
            email=email,
            contact=contact,
            plan=plan,
            amount=amount,
            video_url=video_url,
            status='pending'
        )

        return Response({'booking_id': booking.booking_id, 'amount': booking.amount}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def create_order(request):
    """Create a Razorpay order for a booking. Expects JSON { booking_id } or { amount }.
    """
    try:
        data = request.data
        amount = None
        booking_id = data.get('booking_id')
        if booking_id:
            booking = Booking.objects.get(booking_id=booking_id)
            amount = int(float(booking.amount) * 100)
        else:
            amount = int(float(data.get('amount', 0)) * 100)

        order_data = {
            'amount': amount,
            'currency': 'INR',
            'payment_capture': 1
        }
        order = razorpay_client.order.create(data=order_data)

        # we don't persist the razorpay order id on the model in this simple flow

        return Response({'order_id': order['id'], 'amount': order['amount'], 'currency': order['currency']})
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def verify_payment(request):
    try:
        data = request.data
        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_signature = data.get('razorpay_signature')
        booking_id = data.get('booking_id')

        # Verify signature
        razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        })

        # Update booking
        booking = Booking.objects.get(booking_id=booking_id)
        booking.status = 'payment_received'
        booking.save()

        # Send confirmation email if configured
        try:
            from django.core.mail import send_mail
            if booking.email and settings.EMAIL_HOST_USER:
                send_mail(
                    subject='Booking Confirmation',
                    message=f"Thank you for booking! Your booking ID is {booking.booking_id}",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[booking.email],
                    fail_silently=True,
                )
        except Exception:
            pass

        return Response({'success': True, 'booking_id': booking.booking_id, 'message': 'Payment verified and booking updated'})
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def booking_status(request, booking_id):
    try:
        booking = Booking.objects.get(booking_id=booking_id)
        serializer = BookingSerializer(booking)
        return Response(serializer.data)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def generate_pdf(request, booking_id):
    try:
        booking = Booking.objects.get(booking_id=booking_id)

        # Create PDF
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="booking_{booking_id}.pdf"'

        p = canvas.Canvas(response)
        p.drawString(100, 750, f"Booking Confirmation - {booking_id}")
        p.drawString(100, 730, f"Name: {booking.name}")
        p.drawString(100, 710, f"Email: {booking.email}")
        p.drawString(100, 690, f"Plan: {booking.plan}")
        p.drawString(100, 670, f"Amount: ₹{booking.amount}")
        p.drawString(100, 650, f"Status: {booking.status}")
        p.drawString(100, 630, f"Date: {booking.created_at}")
        p.showPage()
        p.save()

        return response
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
