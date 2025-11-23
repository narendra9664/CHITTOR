# Testing Guide - Operation: Red October

Comrade, follow these steps to verify the integrity of our facility.

## 1. Setup & Launch

First, we must start the engines.

1.  **Configure Secrets**:
    - Open `backend/.env.docker` and `frontend/.env.docker`.
    - Replace `YOUR_KEY_HERE` with your actual Razorpay Test Keys.
    - (Optional) Update email settings if you want to test emails.

2.  **Launch Docker**:
    Open your terminal in the project root and run:
    ```bash
    docker-compose up --build
    ```
    *Wait for the logs to settle. You should see "Listening at: http://0.0.0.0:8000" for backend.*

3.  **Run Migrations**:
    We need to set up the database tables. Open a **new** terminal window and run:
    ```bash
    docker-compose exec backend python manage.py migrate
    ```

4.  **Create Admin User**:
    To inspect the vault (database), create a superuser:
    ```bash
    docker-compose exec backend python manage.py createsuperuser
    ```
    *Follow the prompts to set a username and password.*

## 2. Manual Verification Checklist

### A. The Booking Flow (Frontend)
- [ ] **Access Site**: Go to [http://localhost:3000](http://localhost:3000).
- [ ] **Navigation**: Click "Pricing" in the menu.
- [ ] **Select Plan**: Click "Choose Plan" on "Two's Story & Post".
- [ ] **Fill Form**:
    - Name: `Test Comrade`
    - Email: `test@example.com`
    - Contact: `9876543210`
    - Video: Upload a small `.mp4` file (under 500MB).
- [ ] **Payment**:
    - Click "Proceed to Payment".
    - A Razorpay popup should appear.
    - Use a "Success" test card (usually provided by Razorpay in test mode).
- [ ] **Success**:
    - Verify you see the "Success" message after payment.

### B. The Vault (Backend Admin)
- [ ] **Access Admin**: Go to [http://localhost:8000/admin](http://localhost:8000/admin).
- [ ] **Login**: Use the superuser credentials you created.
- [ ] **Check Booking**:
    - Go to "Bookings".
    - You should see the new booking from `Test Comrade`.
    - Status should be `payment_received`.
- [ ] **Check PDF**:
    - (If implemented) Try to download the invoice/PDF if there's a button, or check the API endpoint `http://localhost:8000/api/generate-pdf/<booking_id>/`.

## 3. Troubleshooting

- **"Razorpay SDK not loaded"**: Refresh the page. Ensure internet access is available.
- **"Connection Refused"**: Ensure Docker containers are running (`docker-compose ps`).
- **"Database error"**: Did you run the migrations? (Step 1.3).

Report any failures to me immediately!
