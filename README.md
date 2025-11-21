# NutriSnap - AI-Powered Nutrition Tracker

NutriSnap is a mobile-first nutrition tracking app that uses AI to analyze food from photos. Simply snap a picture of your meal, and get instant nutritional information including calories, macros, and personalized health recommendations.

## Features

- 📸 **Camera-First Food Tracking**: Take photos of your meals for instant AI analysis
- 🤖 **AI-Powered Analysis**: Get detailed nutritional breakdown including calories, protein, carbs, fats, and fiber
- 📊 **Real-Time Dashboard**: Track your daily calorie intake and macro distribution
- 📝 **Meal History**: View all your logged meals with timestamps and images
- 🥗 **Leftover Recipe Suggestions**: Get sustainable recipe ideas based on leftover ingredients
- 💬 **AI Health Advisor**: Personalized diet and workout recommendations based on your profile
- 👤 **User Profiles**: Set your goals, track progress, and customize your experience

## Technologies Used

- **Frontend**: React + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn-ui components
- **Backend**: Supabase (Database, Authentication, Edge Functions)
- **AI**: Google Gemini 2.5 Flash (vision + text generation)
- **Camera**: Native MediaDevices API

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **bun**
- **Git** - [Download here](https://git-scm.com/)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd nutrisnap
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using bun:
```bash
bun install
```

### 3. Environment Variables

The project uses Supabase for backend services. The `.env` file should contain:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

**Note**: These are automatically configured if you're using Lovable Cloud.

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

### 5. Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

## Usage Guide

### First Time Setup

1. **Sign Up**: Create an account using email and password
2. **Complete Profile**: Enter your height, weight, age, gender, and activity level
3. **Set Goals**: Define your daily calorie goal and target weight

### Logging Meals

1. Tap the **Camera** icon in the navigation
2. Position food in the frame and tap capture (or upload an existing photo)
3. Tap **Analyze Food** to get AI-powered nutritional analysis
4. Review the results and tap **Save to Diary**
5. Your dashboard will update automatically with the calories and macros

### Using AI Chat

1. Complete your profile first (height, weight required)
2. Navigate to **AI Chat** tab
3. Ask questions about nutrition, workouts, or healthy living
4. Get personalized advice based on your profile data

### Leftover Recipes

1. Navigate to **Recipes** tab
2. Enter leftover ingredients (e.g., "chicken, broccoli, rice")
3. Tap **Generate Recipes** to get AI-suggested sustainable meal ideas

## Project Structure

```
nutrisnap/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.tsx    # Main calorie tracking dashboard
│   │   ├── CameraCapture.tsx # Camera interface for food photos
│   │   ├── AIChat.tsx       # AI chatbot component
│   │   ├── Profile.tsx      # User profile management
│   │   └── ui/              # Reusable UI components (shadcn)
│   ├── pages/               # Route pages
│   │   ├── Index.tsx        # Main app with navigation
│   │   └── Auth.tsx         # Login/signup page
│   ├── integrations/
│   │   └── supabase/        # Supabase client & types
│   └── main.tsx             # App entry point
├── supabase/
│   ├── functions/           # Edge functions
│   │   ├── analyze-food/    # AI food image analysis
│   │   ├── chat-advisor/    # AI health chatbot
│   │   └── generate-recipes/ # AI recipe generator
│   └── migrations/          # Database migrations
└── public/
    └── data/                # Nutritional reference datasets

```

## Database Schema

- **profiles**: User profile information (height, weight, goals)
- **meals**: Logged meals with nutritional data and images
- **user_goals**: User fitness and weight goals

## Troubleshooting

### Camera Not Working
- Ensure you've granted camera permissions in your browser
- Use HTTPS or localhost (camera requires secure context)

### AI Analysis Failing
- Check your internet connection
- Ensure the Supabase edge functions are deployed
- Check browser console for detailed error messages

### Meals Not Saving
- Ensure you're logged in
- Complete your user profile first
- Check browser console for RLS policy errors

## Deployment

This project is deployed using Lovable's hosting platform:

```bash
# Deploy via Lovable
1. Open your Lovable project
2. Click Share -> Publish
3. Click "Update" to deploy changes
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using React, TypeScript, Supabase, and AI
