"""
Integration tests for the API endpoints.
These tests verify that the complete booking flow works end-to-end.
"""
from django.test import TestCase, Client
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from .models import Booking
import json


class APIIntegrationTest(TestCase):
    """Integration tests for the complete API flow"""
    
    def setUp(self):
        """Set up test data"""
        self.client = Client()
        self.valid_booking_data = {
            'name': 'Test Customer',
            'email': 'test@example.com',
            'contact': '9876543210',
            'plan': 'One Day Story',
            'amount': '999.00'
        }
    
    def test_complete_booking_flow(self):
        """Test the complete booking flow: create booking -> create order -> verify payment -> check status"""
        # Step 1: Create booking
        response = self.client.post(
            reverse('create_booking'),
            data=self.valid_booking_data
        )
        
        self.assertEqual(response.status_code, 201)
        booking_data = response.json()
        booking_id = booking_data['booking_id']
        self.assertIsNotNone(booking_id)
        
        # Verify booking was created in database
        booking = Booking.objects.get(booking_id=booking_id)
        self.assertEqual(booking.name, 'Test Customer')
        self.assertEqual(booking.status, 'pending')
        
        # Step 2: Create order
        order_data = {'booking_id': booking_id}
        response = self.client.post(
            reverse('create_order'),
            data=json.dumps(order_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        order_response = response.json()
        self.assertIn('order_id', order_response)
        self.assertEqual(order_response['amount'], 99900)  # Amount in paisa
        
        # Step 3: Verify payment (this will fail due to invalid signature, but should return appropriate error)
        payment_data = {
            'razorpay_order_id': order_response['order_id'],
            'razorpay_payment_id': 'pay_test123',
            'razorpay_signature': 'invalid_signature',
            'booking_id': booking_id
        }
        
        response = self.client.post(
            reverse('verify_payment'),
            data=json.dumps(payment_data),
            content_type='application/json'
        )
        
        # Should fail with signature verification error
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
        
        # Booking status should still be pending
        booking = Booking.objects.get(booking_id=booking_id)
        self.assertEqual(booking.status, 'pending')
    
    def test_booking_flow_with_video_upload(self):
        """Test the booking flow with video file upload"""
        # Create a mock video file
        mock_video = SimpleUploadedFile(
            name="test_video.mp4",
            content=b"fake video content",
            content_type="video/mp4"
        )
        
        booking_data = self.valid_booking_data.copy()
        booking_data['video_file'] = mock_video
        
        # Create booking with video
        response = self.client.post(
            reverse('create_booking'),
            data=booking_data
        )
        
        self.assertEqual(response.status_code, 201)
        booking_data_response = response.json()
        booking_id = booking_data_response['booking_id']
        
        # Verify booking was created with video file
        booking = Booking.objects.get(booking_id=booking_id)
        self.assertIsNotNone(booking.video_file)
        self.assertEqual(booking.name, 'Test Customer')
    
    def test_error_handling_flow(self):
        """Test the flow with various error conditions"""
        # Test creating booking with missing fields
        incomplete_data = {'name': 'Test Customer'}  # Missing required fields
        response = self.client.post(
            reverse('create_booking'),
            data=incomplete_data
        )
        
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
        
        # Test creating booking with invalid email
        invalid_email_data = self.valid_booking_data.copy()
        invalid_email_data['email'] = 'invalid-email'
        response = self.client.post(
            reverse('create_booking'),
            data=invalid_email_data
        )
        
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
        self.assertIn('email', response.json()['error'])
        
        # Test creating booking with invalid amount
        invalid_amount_data = self.valid_booking_data.copy()
        invalid_amount_data['amount'] = '-100'
        response = self.client.post(
            reverse('create_booking'),
            data=invalid_amount_data
        )
        
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
        self.assertIn('positive', response.json()['error'])
        
        # Test creating booking with invalid contact
        invalid_contact_data = self.valid_booking_data.copy()
        invalid_contact_data['contact'] = 'invalid-contact'
        response = self.client.post(
            reverse('create_booking'),
            data=invalid_contact_data
        )
        
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
        self.assertIn('digits', response.json()['error'])
    
    def test_booking_status_flow(self):
        """Test creating a booking and retrieving its status"""
        # Create booking
        response = self.client.post(
            reverse('create_booking'),
            data=self.valid_booking_data
        )
        
        self.assertEqual(response.status_code, 201)
        booking_id = response.json()['booking_id']
        
        # Get booking status
        response = self.client.get(
            reverse('booking_status', kwargs={'booking_id': booking_id})
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['booking_id'], booking_id)
        self.assertEqual(response.json()['status'], 'pending')
        self.assertEqual(response.json()['name'], 'Test Customer')
        
        # Try to get status of non-existent booking
        response = self.client.get(
            reverse('booking_status', kwargs={'booking_id': 'NON-EXISTENT-ID'})
        )
        
        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())
    
    def test_pdf_generation_flow(self):
        """Test the complete flow including PDF generation"""
        # Create booking
        response = self.client.post(
            reverse('create_booking'),
            data=self.valid_booking_data
        )
        
        self.assertEqual(response.status_code, 201)
        booking_id = response.json()['booking_id']
        
        # Generate PDF for the booking
        response = self.client.get(
            reverse('generate_pdf', kwargs={'booking_id': booking_id})
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get('Content-Type'), 'application/pdf')
        
        # Try to generate PDF for non-existent booking
        response = self.client.get(
            reverse('generate_pdf', kwargs={'booking_id': 'NON-EXISTENT-ID'})
        )
        
        self.assertEqual(response.status_code, 404)
    
    def test_admin_bookings_access(self):
        """Test admin access to list all bookings"""
        # Create multiple bookings
        for i in range(3):
            booking_data = self.valid_booking_data.copy()
            booking_data['name'] = f'Test Customer {i}'
            booking_data['email'] = f'test{i}@example.com'
            response = self.client.post(
                reverse('create_booking'),
                data=booking_data
            )
            self.assertEqual(response.status_code, 201)
        
        # Access all bookings
        response = self.client.get(reverse('list_bookings'))
        
        self.assertEqual(response.status_code, 200)
        bookings = response.json()
        self.assertEqual(len(bookings), 3)
        
        # Verify the bookings contain expected data
        for booking in bookings:
            self.assertIn('name', booking)
            self.assertIn('email', booking)
            self.assertIn('booking_id', booking)
            self.assertIn('status', booking)
    
    def test_duplicate_payment_prevention(self):
        """Test that payments can't be verified twice for the same booking"""
        # Create booking
        response = self.client.post(
            reverse('create_booking'),
            data=self.valid_booking_data
        )

        self.assertEqual(response.status_code, 201)
        booking_id = response.json()['booking_id']

        # Manually update booking status to simulate payment received
        booking = Booking.objects.get(booking_id=booking_id)
        booking.status = 'payment_received'
        booking.save()

        # Try to verify payment again (should fail before signature check)
        payment_data = {
            'razorpay_order_id': 'order_test123',
            'razorpay_payment_id': 'pay_test123',
            'razorpay_signature': 'any_signature',
            'booking_id': booking_id
        }

        response = self.client.post(
            reverse('verify_payment'),
            data=json.dumps(payment_data),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
        # The error should mention that payment was already processed since we check status first
        error_msg = response.json()['error'].lower()
        self.assertTrue('already processed' in error_msg or 'payment already processed' in error_msg)