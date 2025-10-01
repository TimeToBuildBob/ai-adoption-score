# AI Adoption Score

An adaptive quiz that assesses how deeply users have integrated AI into their lives and work. Built to be viral and insightful.

## Features

- 🎯 **Adaptive Questions**: 29 questions that adapt based on user type and previous answers
- 📊 **Detailed Breakdown**: Category scores across habits, work, privacy, autonomy, sophistication, emotional, budget, and philosophy
- 🏆 **Archetype Classification**: Users are classified into 5 archetypes (AI Native, Power User, Pragmatic Adopter, AI Curious, AI Skeptic)
- 📈 **Visual Results**: Beautiful radar charts and progress bars
- 💾 **Auto-save Progress**: Answers stored in localStorage so users can resume
- 🚀 **Auto-advance**: Single-choice questions automatically advance
- 🔗 **Social Sharing**: Easy sharing to Twitter, LinkedIn, and email
- ✅ **Verified Results**: Optional authentication with Google/GitHub for trusted data
- 📊 **Real Percentiles**: Percentile rankings based on verified user data
- 🎨 **Modern UI**: Built with Next.js, Tailwind, and Framer Motion

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Backend**: Supabase (optional)
- **Auth**: Supabase Auth with Google/GitHub OAuth

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

The app works fully without a backend, but you can optionally set up Supabase for enhanced features.

## Backend Setup (Optional)

Adding Supabase enables:
- ✅ Real percentile rankings based on verified users
- ✅ Data collection and analysis
- ✅ OAuth verification with Google/GitHub
- ✅ Trusted data subset for accurate statistics

**See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed setup instructions.**

Quick setup:
1. Create a Supabase project
2. Copy `.env.local` and add your Supabase URL and keys
3. Run the SQL migration in Supabase SQL Editor
4. Enable Google/GitHub OAuth providers
5. Restart your dev server

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TimeToBuildBob/ai-adoption-score)

Or deploy manually:

```bash
# Build for production
npm run build

# Start production server
npm start
```

Don't forget to add your environment variables in Vercel's dashboard if using the backend.

## Project Structure
