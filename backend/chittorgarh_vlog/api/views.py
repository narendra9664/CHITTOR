from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.conf import settings
from django.core.cache import cache
import razorpay
from reportlab.pdfgen import canvas
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from rest_framework.permissions import IsAuthenticated
from .models import Booking
from .serializers import BookingSerializer
import uuid
import logging
import re
import time


# Initialize clients
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

# Set up logging
logger = logging.getLogger(__name__)

def check_rate_limit(request, key_prefix, max_requests=10, window=300):  # 10 requests per 5 minutes
    """Check rate limit for a given key prefix"""
    client_ip = get_client_ip(request)
    cache_key = f"{key_prefix}_{client_ip}"

    requests_data = cache.get(cache_key, {'count': 0, 'start_time': time.time()})
    current_time = time.time()

    # Reset if window has passed
    if current_time - requests_data['start_time'] > window:
        requests_data = {'count': 1, 'start_time': current_time}
    else:
        # Increment request count
        requests_data['count'] += 1

    cache.set(cache_key, requests_data, timeout=int(window))

    if requests_data['count'] > max_requests:
        return False  # Rate limit exceeded

    return True

def get_client_ip(request):
    """Get the real client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@api_view(['POST'])
def create_booking(request):
    """Create a booking record and save the video file locally.

    Returns: { booking_id, amount }
    """
    # Rate limiting: max 5 bookings per IP per 10 minutes
    if not check_rate_limit(request, 'create_booking', max_requests=5, window=600):
        return Response(
            {'error': 'Rate limit exceeded. Please try again later.'},
            status=status.HTTP_429_TOO_MANY_REQUESTS
        )

    try:
        # Validate required fields
        data = request.data
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        contact = data.get('contact', '').strip()
        plan = data.get('plan', '').strip()
        amount = data.get('amount', '').strip()

        # Validate required fields
        if not name or not email or not contact or not plan or not amount:
            return Response(
                {'error': 'Missing required fields: name, email, contact, plan, amount'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Sanitize inputs to prevent XSS and injection
        import re
        if not re.match(r'^[a-zA-Z\s\-\'\.]+$', name):
            return Response(
                {'error': 'Name contains invalid characters'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            return Response(
                {'error': 'Invalid email format'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate amount is a positive number
        try:
            float_amount = float(amount)
            if float_amount <= 0:
                return Response(
                    {'error': 'Amount must be a positive number'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except (ValueError, TypeError):
            return Response(
                {'error': 'Amount must be a valid number'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate contact format
        if not contact.isdigit() or len(contact) < 10 or len(contact) > 15:
            return Response(
                {'error': 'Contact number must be 10-15 digits'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Handle video file upload
        video_file = request.FILES.get('video_file')

        # Optionally validate file type and size
        if video_file:
            # Check file type
            allowed_types = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo']
            if video_file.content_type not in allowed_types:
                return Response(
                    {'error': f'Video file type not supported. Allowed types: {allowed_types}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check file size (limit to 500MB as per frontend)
            max_size = 500 * 1024 * 1024  # 500MB
            if video_file.size > max_size:
                return Response(
                    {'error': 'Video file size too large. Maximum size is 500MB'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        booking = Booking.objects.create(
            name=name,
            email=email,
            contact=contact,
            plan=plan,
            amount=amount,
            video_file=video_file,  # Save the uploaded file locally
            status='pending'
        )

        logger.info(f"Successfully created booking: {booking.booking_id}")
        return Response({'booking_id': booking.booking_id, 'amount': booking.amount}, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.error(f"Error creating booking: {str(e)}")
        # Don't expose internal error details to client
        return Response({'error': 'An error occurred while creating the booking'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def create_order(request):
    """Create a Razorpay order for a booking. Expects JSON { booking_id } or { amount }.
    """
    # Rate limiting: max 10 orders per IP per 10 minutes
    if not check_rate_limit(request, 'create_order', max_requests=10, window=600):
        return Response(
            {'error': 'Rate limit exceeded. Please try again later.'},
            status=status.HTTP_429_TOO_MANY_REQUESTS
        )

    try:
        data = request.data
        amount = None
        booking_id = data.get('booking_id', '').strip()

        if booking_id:
            try:
                # Validate booking_id format
                booking = Booking.objects.get(booking_id=booking_id)
                amount = int(float(booking.amount) * 100)
            except Booking.DoesNotExist:
                return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
            except ValueError:
                return Response({'error': 'Invalid booking ID format'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            amount_input = data.get('amount', 0)
            try:
                float_amount = float(amount_input)
                if float_amount <= 0:
                    return Response({'error': 'Amount must be a positive number'}, status=status.HTTP_400_BAD_REQUEST)
                amount = int(float_amount * 100)
            except (ValueError, TypeError):
                return Response({'error': 'Amount must be a valid number'}, status=status.HTTP_400_BAD_REQUEST)

        order_data = {
            'amount': amount,
            'currency': 'INR',
            'payment_capture': 1
        }

        try:
            order = razorpay_client.order.create(data=order_data)
        except Exception as e:
            logger.error(f"Error creating Razorpay order: {str(e)}")
            return Response({'error': 'Payment gateway error. Please try again later.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        logger.info(f"Successfully created Razorpay order for booking {booking_id if booking_id else 'N/A'}")
        return Response({'order_id': order['id'], 'amount': order['amount'], 'currency': order['currency']})
    except Exception as e:
        logger.error(f"Error creating order: {str(e)}")
        return Response({'error': 'An error occurred while creating the order'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def verify_payment(request):
    # Rate limiting: max 10 payment verifications per IP per 10 minutes
    if not check_rate_limit(request, 'verify_payment', max_requests=10, window=600):
        return Response(
            {'error': 'Rate limit exceeded. Please try again later.'},
            status=status.HTTP_429_TOO_MANY_REQUESTS
        )

    try:
        data = request.data
        razorpay_order_id = data.get('razorpay_order_id', '').strip()
        razorpay_payment_id = data.get('razorpay_payment_id', '').strip()
        razorpay_signature = data.get('razorpay_signature', '').strip()
        booking_id = data.get('booking_id', '').strip()

        # Validate required fields
        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id]):
            return Response({'error': 'Missing required payment verification fields'}, status=status.HTTP_400_BAD_REQUEST)

        # Get booking first to check status
        try:
            booking = Booking.objects.get(booking_id=booking_id)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

        # Prevent duplicate payment verification
        if booking.status == 'payment_received' or booking.status == 'completed':
            return Response({
                'error': f'Payment already processed for this booking with status: {booking.status}'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Verify signature only after confirming booking exists and not already processed
        try:
            razorpay_client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })
        except Exception as e:
            logger.warning(f"Payment signature verification failed: {str(e)}")
            return Response({'error': 'Payment verification failed. Invalid signature.'}, status=status.HTTP_400_BAD_REQUEST)

        # Update booking status
        booking.status = 'payment_received'
        booking.save()

        logger.info(f"Payment verified and booking updated: {booking.booking_id}")

        # Send confirmation email if configured (using proper HTML escaping)
        try:
            from django.core.mail import send_mail
            from django.utils.html import escape
            
            # 1. Send to Customer
            if booking.email and settings.EMAIL_HOST_USER:
                sanitized_booking_id = escape(booking.booking_id)
                send_mail(
                    subject='Booking Confirmation - Chittorgarh Vlog',
                    message=f"Thank you for booking! Your booking ID is {sanitized_booking_id}. We have received your video and will process it shortly.",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[booking.email],
                    fail_silently=True,
                )
            
            # 2. Send to Admin (You)
            if settings.EMAIL_HOST_USER:
                video_url = "No video uploaded"
                if booking.video_file:
                    # Generate full download URL
                    video_url = request.build_absolute_uri(booking.video_file.url)
                
                send_mail(
                    subject=f'💰 New Booking: {booking.name} - ₹{booking.amount}',
                    message=f"""
                    New Booking Received!
                    
                    Name: {booking.name}
                    Email: {booking.email}
                    Phone: {booking.contact}
                    Plan: {booking.plan}
                    Amount: ₹{booking.amount}
                    
                    ----------------------------------------
                    VIDEO DOWNLOAD LINK (Valid for ~24h on Railway):
                    {video_url}
                    ----------------------------------------
                    
                    If the video is missing or link is broken, contact the user immediately via WhatsApp: {booking.contact}
                    """,
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[settings.EMAIL_HOST_USER], # Send to yourself
                    fail_silently=True,
                )
                
        except Exception as email_error:
            logger.warning(f"Failed to send confirmation email: {str(email_error)}")

        return Response({'success': True, 'booking_id': booking.booking_id, 'message': 'Payment verified and booking updated'})
    except Exception as e:
        logger.error(f"Error verifying payment: {str(e)}")
        return Response({'error': 'An error occurred while verifying the payment'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def submit_manual_payment(request):
    """Submit manual payment details (Transaction ID)"""
    # Rate limiting
    if not check_rate_limit(request, 'manual_payment', max_requests=5, window=600):
        return Response({'error': 'Rate limit exceeded'}, status=status.HTTP_429_TOO_MANY_REQUESTS)

    try:
        booking_id = request.data.get('booking_id')
        transaction_id = request.data.get('transaction_id')

        if not booking_id or not transaction_id:
            return Response({'error': 'Booking ID and Transaction ID are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            booking = Booking.objects.get(booking_id=booking_id)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

        booking.payment_method = 'manual'
        booking.transaction_id = transaction_id
        # We keep status as pending or move to payment_received? 
        # For manual, we want admin to verify. But to stop the user from worrying, we can say "Payment Submitted".
        # Let's set it to 'payment_received' so it shows up in the list as paid/processed, 
        # but the admin knows it's manual via payment_method.
        booking.status = 'payment_received' 
        booking.save()
        
        logger.info(f"Manual payment submitted for booking: {booking.booking_id}, txn: {transaction_id}")

        # Send confirmation email
        try:
            from django.core.mail import send_mail
            from django.utils.html import escape
            
            # 1. Send to Customer
            if booking.email and settings.EMAIL_HOST_USER:
                sanitized_booking_id = escape(booking.booking_id)
                send_mail(
                    subject='Payment Submitted - Chittorgarh Vlog',
                    message=f"Thank you! We have received your manual payment details (Txn: {transaction_id}). Your booking ID is {sanitized_booking_id}. We will verify the transaction and process your video shortly.",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[booking.email],
                    fail_silently=True,
                )
            
            # 2. Send to Admin
            if settings.EMAIL_HOST_USER:
                video_url = "No video uploaded"
                if booking.video_file:
                    video_url = request.build_absolute_uri(booking.video_file.url)
                
                send_mail(
                    subject=f'💰 Manual Payment: {booking.name} - ₹{booking.amount}',
                    message=f"""
                    Manual Payment Submitted!
                    
                    Name: {booking.name}
                    Email: {booking.email}
                    Phone: {booking.contact}
                    Plan: {booking.plan}
                    Amount: ₹{booking.amount}
                    Transaction ID: {transaction_id}
                    
                    ----------------------------------------
                    VIDEO DOWNLOAD LINK:
                    {video_url}
                    ----------------------------------------
                    
                    Please verify the transaction ID in your bank account before processing.
                    """,
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[settings.EMAIL_HOST_USER],
                    fail_silently=True,
                )
        except Exception as email_error:
            logger.warning(f"Failed to send confirmation email: {str(email_error)}")

        return Response({'success': True, 'booking_id': booking.booking_id, 'message': 'Manual payment submitted successfully'})
    except Exception as e:
        logger.error(f"Error submitting manual payment: {str(e)}")
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def booking_status(request, booking_id):
    try:
        # Validate booking_id format if needed
        if not booking_id:
            return Response({'error': 'Booking ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            booking = Booking.objects.get(booking_id=booking_id)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error retrieving booking status: {str(e)}")
            return Response({'error': 'Invalid booking ID format'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = BookingSerializer(booking)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Unexpected error getting booking status: {str(e)}")
        return Response({'error': 'An error occurred while retrieving booking status'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def generate_pdf(request, booking_id):
    try:
        if not booking_id:
            return Response({'error': 'Booking ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            booking = Booking.objects.get(booking_id=booking_id)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error retrieving booking for PDF: {str(e)}")
            return Response({'error': 'Invalid booking ID format'}, status=status.HTTP_400_BAD_REQUEST)

        # Create PDF
        try:
            # Sanitize filename to prevent directory traversal
            import re
            safe_booking_id = re.sub(r'[^a-zA-Z0-9_\-]', '', booking_id)[:50]  # Limit length and sanitize
            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="booking_{safe_booking_id}.pdf"'

            p = canvas.Canvas(response)
            # Sanitize data before adding to PDF
            from django.utils.html import escape
            p.drawString(100, 750, f"Booking Confirmation - {escape(str(booking_id))}")
            p.drawString(100, 730, f"Name: {escape(booking.name)}")
            p.drawString(100, 710, f"Email: {escape(booking.email)}")
            p.drawString(100, 690, f"Plan: {escape(booking.plan)}")
            p.drawString(100, 670, f"Amount: ₹{escape(str(booking.amount))}")
            p.drawString(100, 650, f"Status: {escape(booking.status)}")
            p.drawString(100, 630, f"Date: {booking.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
            p.showPage()
            p.save()

            logger.info(f"PDF generated successfully for booking: {booking_id}")
            return response
        except Exception as pdf_error:
            logger.error(f"Error generating PDF for booking {booking_id}: {str(pdf_error)}")
            return Response({'error': 'Error generating PDF'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        logger.error(f"Unexpected error generating PDF: {str(e)}")
        return Response({'error': 'An error occurred while generating the PDF'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([IsAuthenticated])
@api_view(['GET'])
def list_bookings(request):
    """List all bookings for admin access"""
    # Require authentication for this sensitive endpoint
    if not request.user.is_staff:
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)

    try:
        bookings = Booking.objects.all().order_by('-created_at')
        # Add pagination for performance
        from django.core.paginator import Paginator
        paginator = Paginator(bookings, 50)  # 50 bookings per page
        page_number = request.GET.get('page', 1)
        page_obj = paginator.get_page(page_number)

        serializer = BookingSerializer(page_obj, many=True)
        logger.info(f"Retrieved {len(page_obj)} bookings")
        return Response({
            'bookings': serializer.data,
            'pagination': {
                'page': page_obj.number,
                'total_pages': page_obj.paginator.num_pages,
                'total_count': paginator.count,
                'has_next': page_obj.has_next(),
                'has_previous': page_obj.has_previous()
            }
        })
    except Exception as e:
        logger.error(f"Error retrieving bookings: {str(e)}")
        return Response({'error': 'An error occurred while retrieving bookings'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== PDF DOWNLOAD ENDPOINTS ====================

from .models import PDFPurchase, MediaKitDownload
from django.http import FileResponse
import os
from datetime import datetime, timedelta
import secrets


@api_view(['POST'])
def create_pdf_purchase(request):
    """
    Create Razorpay order for paid PDF (₹9 Chittorgarh Guide)
    """
    # Rate limiting
    if not check_rate_limit(request, 'pdf_purchase', max_requests=5, window=300):
        return Response({'error': 'Too many requests. Please try again later.'}, 
                       status=status.HTTP_429_TOO_MANY_REQUESTS)
    
    try:
        # Validate input
        name = sanitize_input(request.data.get('name', '').strip())
        email = sanitize_input(request.data.get('email', '').strip())
        phone = sanitize_input(request.data.get('phone', '').strip())
        
        if not name or not email or not phone:
            return Response({'error': 'Name, email, and phone are required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Validate email
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            return Response({'error': 'Invalid email format'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Validate phone
        if not re.match(r'^\+?[\d\s-]{10,15}$', phone):
            return Response({'error': 'Invalid phone number'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Create Razorpay order
        pdf_amount = 9  # ₹9
        order_data = {
            'amount': pdf_amount * 100,  # Convert to paise
            'currency': 'INR',
            'payment_capture': 1
        }
        
        razorpay_order = razorpay_client.order.create(data=order_data)
        
        # Create PDF purchase record
        pdf_purchase = PDFPurchase.objects.create(
            name=name,
            email=email,
            phone=phone,
            pdf_name='chittorgarh-guide.pdf',
            amount=pdf_amount,
            razorpay_order_id=razorpay_order['id'],
            payment_status='pending',
            ip_address=get_client_ip(request)
        )
        
        logger.info(f"PDF purchase created: {pdf_purchase.id} for {email}")
        
        return Response({
            'order_id': razorpay_order['id'],
            'amount': pdf_amount,
            'currency': 'INR',
            'purchase_id': pdf_purchase.id
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Error creating PDF purchase: {str(e)}")
        return Response({'error': 'Failed to create PDF purchase'}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def verify_pdf_payment(request):
    """
    Verify Razorpay payment and generate one-time download token
    """
    try:
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')
        
        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
            return Response({'error': 'Missing payment verification data'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Verify payment signature
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }
        
        try:
            razorpay_client.utility.verify_payment_signature(params_dict)
        except razorpay.errors.SignatureVerificationError:
            logger.warning(f"Invalid payment signature for order {razorpay_order_id}")
            return Response({'error': 'Invalid payment signature'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Find PDF purchase
        try:
            pdf_purchase = PDFPurchase.objects.get(razorpay_order_id=razorpay_order_id)
        except PDFPurchase.DoesNotExist:
            return Response({'error': 'Purchase not found'}, 
                          status=status.HTTP_404_NOT_FOUND)
        
        # Check if already completed
        if pdf_purchase.payment_status == 'completed':
            # Return existing download token
            return Response({
                'success': True,
                'download_token': pdf_purchase.download_token,
                'pdf_name': pdf_purchase.pdf_name
            })
        
        # Generate one-time download token
        download_token = secrets.token_urlsafe(32)
        
        # Update purchase record
        pdf_purchase.razorpay_payment_id = razorpay_payment_id
        pdf_purchase.payment_status = 'completed'
        pdf_purchase.download_token = download_token
        pdf_purchase.save()
        
        logger.info(f"PDF payment verified: {pdf_purchase.id}")
        
        # Send confirmation email (optional)
        try:
            from django.core.mail import send_mail
            send_mail(
                subject='Chittorgarh Guide - Download Ready',
                message=f'Thank you for your purchase! Your download is ready.',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[pdf_purchase.email],
                fail_silently=True
            )
        except:
            pass  # Don't fail if email fails
        
        return Response({
            'success': True,
            'download_token': download_token,
            'pdf_name': pdf_purchase.pdf_name
        })
        
    except Exception as e:
        logger.error(f"Error verifying PDF payment: {str(e)}")
        return Response({'error': 'Payment verification failed'}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def download_paid_pdf(request, token):
    """
    Download paid PDF using one-time token
    """
    try:
        # Find purchase by token
        try:
            pdf_purchase = PDFPurchase.objects.get(download_token=token, payment_status='completed')
        except PDFPurchase.DoesNotExist:
            return Response({'error': 'Invalid or expired download link'}, 
                          status=status.HTTP_404_NOT_FOUND)
        
        # Check if already downloaded (one-time download)
        if pdf_purchase.downloaded_at:
            # Allow re-download within 1 hour
            if datetime.now(pdf_purchase.downloaded_at.tzinfo) - pdf_purchase.downloaded_at > timedelta(hours=1):
                return Response({'error': 'Download link has expired. Please contact support if you need assistance.'}, 
                              status=status.HTTP_410_GONE)
        
        # Mark as downloaded
        if not pdf_purchase.downloaded_at:
            pdf_purchase.downloaded_at = datetime.now()
            pdf_purchase.save()
        
        # Local Storage
        pdf_path = os.path.join(settings.MEDIA_ROOT, 'pdfs', 'paid', pdf_purchase.pdf_name)
        
        if not os.path.exists(pdf_path):
            logger.error(f"PDF file not found: {pdf_path}")
            return Response({'error': 'PDF file not found'}, 
                          status=status.HTTP_404_NOT_FOUND)
        
        # Serve file
        response = FileResponse(open(pdf_path, 'rb'), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{pdf_purchase.pdf_name}"'
        
        logger.info(f"PDF downloaded: {pdf_purchase.pdf_name} by {pdf_purchase.email}")
        
        return response
        
    except Exception as e:
        logger.error(f"Error downloading paid PDF: {str(e)}")
        return Response({'error': 'Download failed'}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def track_mediakit_download(request):
    """
    Track free media kit download
    """
    try:
        pdf_name = request.data.get('pdf_name')
        email = request.data.get('email', '')
        file_size = request.data.get('file_size_mb', 0)
        
        if not pdf_name:
            return Response({'error': 'PDF name is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Create download record
        MediaKitDownload.objects.create(
            pdf_name=pdf_name,
            email=sanitize_input(email) if email else None,
            file_size_mb=file_size,
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:500]
        )
        
        logger.info(f"Media kit download tracked: {pdf_name}")
        
        return Response({'success': True})
        
    except Exception as e:
        logger.error(f"Error tracking media kit download: {str(e)}")
        # Don't fail the download if tracking fails
        return Response({'success': True})


@api_view(['GET'])
def download_mediakit_pdf(request, filename):
    """
    Download free media kit PDF
    """
    try:
        # Sanitize filename to prevent directory traversal
        safe_filename = os.path.basename(filename)
        pdf_path = os.path.join(settings.MEDIA_ROOT, 'pdfs', 'free', safe_filename)
        
        if not os.path.exists(pdf_path):
            return Response({'error': 'PDF file not found'}, 
                          status=status.HTTP_404_NOT_FOUND)
        
        # Serve file
        content_type = 'application/pdf'
        if safe_filename.endswith('.zip'):
            content_type = 'application/zip'
            
        response = FileResponse(open(pdf_path, 'rb'), content_type=content_type)
        response['Content-Disposition'] = f'attachment; filename="{safe_filename}"'
        
        logger.info(f"Media kit downloaded: {safe_filename}")
        
        return response
        
    except Exception as e:
        logger.error(f"Error downloading media kit PDF: {str(e)}")
        return Response({'error': 'Download failed'}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_pdf_info(request):
    """
    Get information about available PDFs
    """
    try:
        return Response({
            'paid_pdf': {
                'name': 'Chittorgarh Tourism Guide',
                'filename': 'chittorgarh-guide.pdf',
                'price': 9,
                'currency': 'INR',
                'description': 'Complete tourism guide for Chittorgarh with historical information, maps, and travel tips'
            },
            'free_pdfs': [
                {
                    'name': 'Media Kit (English)',
                    'filename': 'media-kit-english.pdf',
                    'description': 'Brand presentation and promotional materials in English'
                },
                {
                    'name': 'Media Kit (Hindi)',
                    'filename': 'media-kit-hindi.pdf',
                    'description': 'Brand presentation and promotional materials in Hindi'
                }
            ]
        })
    except Exception as e:
        logger.error(f"Error getting PDF info: {str(e)}")
        return Response({'error': 'Failed to retrieve PDF information'}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)