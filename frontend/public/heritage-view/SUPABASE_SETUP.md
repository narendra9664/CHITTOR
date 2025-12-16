# Supabase Integration Setup Guide

This guide will help you set up Supabase to store user information collected from your Heritage View website.

## Step 1: Create a Supabase Account and Project

1. Go to [https://supabase.com](https://supabase.com) and click "Start your project"
2. Sign up with your preferred method (email, Google, GitHub, etc.)
3. Complete the account setup process
4. In your dashboard, click "New Project"
5. Enter a project name (e.g., "Heritage View")
6. Create a strong password for the database
7. Select your preferred region
8. Click "Create new project"

## Step 2: Set up the Database Table

Once your project is created:

1. Navigate to the "Table Editor" in your Supabase dashboard
2. Click "New table" 
3. Name the table `users`
4. Add the following columns:

| Column Name | Type | Default | Allow NULL? | Primary Key? |
|-------------|------|---------|-------------|--------------|
| id | `auto-incrementing int8` | `nextval(...)` | No | Yes |
| name | `text` | - | No | No |
| email | `text` | - | No | No |
| contect_no | `text` | - | Yes | No |
| created_at | `timestamp with time zone` | `now()` | No | No |

5. Click "Save" to create the table

## Step 3: Get Your Project Credentials

1. In your Supabase dashboard, go to your project
2. Click on "Project Settings" in the left sidebar
3. Click on "API" 
4. Copy your "Project URL" (this is your SUPABASE_URL)
5. Copy your "anon (Public) key" (this is your SUPABASE_ANON_KEY)

## Step 4: Configure Environment Variables

### For Node.js:
Create a `.env` file in your project root directory:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### For Python:
Create a `.env` file in your project root directory:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 5: Update Code with Your Credentials

Replace the placeholder values in the files:

1. In `supabaseClient.js`:
   - Replace `'https://XXXXX.supabase.co'` with your actual Project URL
   - Replace `'your-anon-key-here'` with your actual anon key

2. In `supabaseServer.js`:
   - The server will automatically use environment variables

3. In `supabase_app.py`:
   - The server will automatically use environment variables

## Step 6: Install Dependencies

### For Node.js:
```bash
npm install @supabase/supabase-js
```

### For Python:
```bash
pip install -r requirements.txt
```

## Step 7: Start Your Server

### For Node.js:
```bash
npm run start:supabase
```

### For Python:
```bash
python supabase_app.py
```

## Step 8: Test the Integration

1. Submit the user information form on your website
2. Check your Supabase dashboard to see if the data was inserted into the `user_downloads` table
3. Monitor your server logs for any errors

## Database Security Settings (Recommended)

To secure your database:

1. In your Supabase dashboard, go to "Authentication" → "Settings"
2. Configure your authentication settings as needed
3. In "Database" → "Policies", set up Row Level Security (RLS) if needed
4. For the `user_downloads` table, you can create a policy allowing inserts from authenticated users or with specific conditions

## Troubleshooting

If you encounter issues:

1. Verify that your SUPABASE_URL and SUPABASE_ANON_KEY are correct
2. Check that the `user_downloads` table exists with the correct column names and types
3. Ensure your server can connect to the internet to reach Supabase
4. Check the server console for error messages
5. Verify that your Supabase project is not in "Disabled" state

## Supabase API Reference

For more complex queries or operations, refer to the [Supabase documentation](https://supabase.com/docs).

## Important Notes

- The anon key is safe to use in client-side code for public operations, but be mindful of your database security settings
- For production, ensure you have appropriate rate limiting in place
- Consider setting up email notifications for new user signups
- Monitor your Supabase usage to ensure you stay within your plan limits