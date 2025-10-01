# Supabase Backend Setup Guide

This guide will help you set up the backend for storing and analyzing AI Adoption Score results.

## 1. Create a Supabase Project

1. Go to https://supabase.com and sign up/log in
2. Click "New Project"
3. Choose your organization and give your project a name
4. Set a strong database password (save it somewhere safe)
5. Choose a region close to your users
6. Click "Create new project"

## 2. Get Your API Keys

1. In your Supabase project, go to Settings → API
2. Copy the following values to your `.env.local` file:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Example `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. Run Database Migration

1. In your Supabase project, go to SQL Editor
2. Click "New Query"
3. Copy the contents of `supabase/migrations/001_create_results_table.sql`
4. Paste into the SQL Editor
5. Click "Run" or press Ctrl+Enter

This will create:
- `results` table for storing quiz results
- Indexes for performance
- Row Level Security policies
- `calculate_percentile()` function

## 4. Enable Authentication Providers

### Google OAuth

1. Go to Authentication → Providers in Supabase
2. Find "Google" and enable it
3. Follow the Google Cloud Console setup:
   - Go to https://console.cloud.google.com
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase
4. Save the configuration

### GitHub OAuth

1. Go to Authentication → Providers in Supabase
2. Find "GitHub" and enable it
3. Create a GitHub OAuth App:
   - Go to https://github.com/settings/developers
   - Click "New OAuth App"
   - Application name: "AI Adoption Score"
   - Homepage URL: Your app URL
   - Authorization callback URL: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase
4. Save the configuration

## 5. Configure Email Settings (Optional)

If you want to enable email verification:

1. Go to Authentication → Email Templates
2. Customize the confirmation email template
3. Configure SMTP settings in Authentication → Settings

## 6. Test the Integration

1. Start your Next.js development server: `npm run dev`
2. Take the quiz and complete it
3. Results should be automatically submitted to Supabase
4. Check the Supabase Table Editor → `results` table to see your data
5. Try clicking "Continue with Google" or "Continue with GitHub" to test auth

## 7. View Statistics

Query your data in the SQL Editor:

```sql
-- Total results
SELECT COUNT(*) as total_results FROM results;

-- Verified vs unverified
SELECT is_verified, COUNT(*) as count 
FROM results 
GROUP BY is_verified;

-- Average score by archetype
SELECT archetype, AVG(overall_score) as avg_score, COUNT(*) as count
FROM results
WHERE is_verified = true
GROUP BY archetype
ORDER BY avg_score DESC;

-- Score distribution
SELECT 
  FLOOR(overall_score / 10) * 10 as score_range,
  COUNT(*) as count
FROM results
WHERE is_verified = true
GROUP BY score_range
ORDER BY score_range;
```

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env.local` values
- Make sure you're using the **anon** key, not the service_role key
- Restart your dev server after changing .env.local

### OAuth redirect not working
- Check that the callback URL is correctly configured in Google/GitHub
- Ensure it matches exactly: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
- Check browser console for errors

### Results not showing in database
- Check Row Level Security policies are enabled
- Verify the anon key has correct permissions
- Check Supabase logs in Dashboard → Logs

### Percentile calculation issues
- Make sure you have at least one verified result
- The `calculate_percentile` function needs verified results to work
- Check function logs in SQL Editor

## Privacy & Security

- Anonymous results are stored but not linked to users
- Verified results link to user_id but don't store personal info
- Row Level Security ensures users can only see verified results and their own data
- OAuth tokens are handled by Supabase, never stored in your database
- All data transmission uses HTTPS

## Next Steps

- Monitor your database usage in Supabase Dashboard
- Set up database backups (automatic in Supabase)
- Consider adding more analytics queries
- Add rate limiting if needed
- Export data for deeper analysis
