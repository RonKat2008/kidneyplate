# KidneyPlate - CKD Nutrition Tracker

A React Native mobile app built with Expo and TypeScript designed specifically for chronic kidney disease (CKD) patients to track their nutrition and health data.

## 🎯 Features

### ✅ Implemented (Frontend Only)

1. **Authentication System**

   - Login and Sign Up screens with form validation
   - Placeholder authentication handlers (TODO: Connect to backend)

2. **Dashboard/Home Screen**

   - Daily nutrition totals (sodium, potassium, phosphorus, protein)
   - Visual progress cards with goal tracking
   - Recent meals list
   - AI tip of the day section
   - Quick stats overview

3. **Meal Logging**

   - Food search functionality (mock data)
   - Nutrient preview for selected foods
   - Meal type categorization (breakfast, lunch, dinner, snack)
   - Quantity input and calculation
   - "Add to Log" functionality

4. **Lab Value Tracker**

   - Input form for common CKD lab values (eGFR, creatinine, potassium, BUN, albumin, phosphorus)
   - Simple chart visualization of trends over time
   - Normal range indicators
   - Lab value history

5. **AI Chat Assistant**

   - Chat interface for nutrition questions
   - Mock AI responses for CKD-specific queries
   - Quick question suggestions
   - Medical disclaimer

6. **Profile Management**
   - User information editing
   - CKD stage selection
   - Dietary preferences configuration
   - Fluid limit settings
   - App settings (notifications)
   - Account actions (export data, logout)

## 🛠 Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Styling**: StyleSheet.create (ready for NativeWind/Tailwind CSS)
- **Icons**: Expo Vector Icons
- **Charts**: Simple custom implementation (ready for Victory Native or Chart Kit)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── NutrientCard.tsx    # Nutrition progress cards
│   ├── MealListItem.tsx    # Meal entry display
│   └── LabValueForm.tsx    # Lab value input form
├── navigation/          # Navigation configuration
│   └── AppNavigator.tsx    # Main navigation setup
├── screens/            # Screen components
│   ├── LoginScreen.tsx     # User authentication
│   ├── SignUpScreen.tsx    # User registration
│   ├── HomeScreen.tsx      # Dashboard/home
│   ├── MealLogScreen.tsx   # Food logging
│   ├── CKDOnboardingScreen.tsx
│   ├── DemoAIChatScreen.tsx #Ddemo Chat bot
|   |── ResetPasswordScreen.tsx
|   |── VerifyEmailScreen.tsx
│   ├── AIChatScreen.tsx    # AI assistant
│   └── ProfileScreen.tsx   # User profile
│   ├── PrivacyPolicyScreen.tsx
│   ├── TermsOfServiceScreen.tsx
│   ├── AIKnowledgeSourceScreen.tsx
│   ├── ResetPasswordScreen.tsx
├── types/              # TypeScript interfaces
│   └── index.ts           # All type definitions
└── utils/              # Utilities and mock data
    └── mockData.ts        # Mock API functions and data
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

### Installation

1. **Clone the repository** (if applicable)

   ```bash
   git clone <repository-url>
   cd KidneyPlate
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Copy the example environment file and configure your API keys and endpoints:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your actual configuration values:

   ```env
   # Firebase Configuration - Get these from your Firebase project settings
   EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

   # API Configuration
   EXPO_PUBLIC_API_URL=http://localhost:8000/
   EXPO_PUBLIC_USDA_API_KEY=your_usda_api_key_here
   EXPO_PUBLIC_USDA_BASE_URL=https://api.nal.usda.gov/fdc/v1

   # Contact Information
   EXPO_PUBLIC_CONTACT_EMAIL=your_contact_email@domain.com
   ```

   **Important**: Never commit the `.env` file to version control. It's already included in `.gitignore`.

4. **Start the development server**

   ```bash
   npm start
   # or
   expo start
   ```

5. **Run on a platform**
   ```bash
   npm run ios     # iOS Simulator
   npm run android # Android Emulator
   npm run web     # Web browser
   ```

## 📱 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run in web browser

## 🏥 CKD-Specific Features

The app is specifically designed for CKD patients with:

- **Nutrient tracking** focused on sodium, potassium, phosphorus, and protein
- **CKD stage selection** (1-5) affecting dietary recommendations
- **Dietary restrictions** management
- **AI assistance** for CKD-specific nutrition questions

## 🤝 Contributing

1. Follow the established code style and TypeScript practices
2. Add TODO comments for any backend integration points
3. Test on both iOS and Android platforms
4. Update this README for any new features

## 📄 License

This project is private and proprietary.

## 🩺 Medical Disclaimer

This app is for informational purposes only and should not replace professional medical advice. Users should always consult with their healthcare providers for medical guidance.

---

**Note**: This is a frontend-only implementation. All backend functionality is marked with TODO comments and uses mock data for demonstration purposes.
