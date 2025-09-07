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
|   |── ResetPasswordScreen.tsx
|   |── VerifyEmailScreen.tsx
│   ├── AIChatScreen.tsx    # AI assistant
│   └── ProfileScreen.tsx   # User profile
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

3. **Start the development server**

   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on a platform**
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

## 🔧 Current Implementation Status

### ✅ Completed (Frontend)

- [x] Project setup with Expo and TypeScript
- [x] Navigation structure (Stack + Bottom Tabs)
- [x] All required screens implemented
- [x] Mock data and API structure
- [x] Responsive UI components
- [x] TypeScript interfaces for all data types
- [x] Basic form validation and error handling

### 🚧 TODO (Backend Integration)

- [ ] User authentication API integration
- [ ] Food database API (USDA Food Data Central or similar)
- [ ] User profile and preferences persistence
- [ ] Meal logging data storage
- [ ] Lab value tracking with cloud sync
- [ ] AI chat integration (OpenAI or similar)
- [ ] Push notifications for meal reminders
- [ ] Data export functionality
- [ ] Offline data caching

### 🎨 TODO (Enhancements)

- [ ] Proper chart library integration (Victory Native or React Native Chart Kit)
- [ ] NativeWind/Tailwind CSS styling implementation
- [ ] Dark mode support
- [ ] Accessibility improvements
- [ ] Unit tests
- [ ] Integration tests
- [ ] Performance optimizations

## 📊 Mock Data

The app currently uses comprehensive mock data located in `src/utils/mockData.ts`:

- **User profiles** with CKD stages and preferences
- **Food database** with nutrition information
- **Lab values** with normal ranges
- **Chat messages** for AI assistant demo
- **API functions** ready for backend integration

All mock functions include TODO comments indicating where real API calls should be implemented.

## 🏥 CKD-Specific Features

The app is specifically designed for CKD patients with:

- **Nutrient tracking** focused on sodium, potassium, phosphorus, and protein
- **CKD stage selection** (1-5) affecting dietary recommendations
- **Lab value monitoring** for kidney function indicators
- **Fluid limit tracking** for advanced CKD stages
- **Dietary restrictions** management
- **AI assistance** for CKD-specific nutrition questions

## 🔒 Data Privacy

- Currently all data is stored locally (mock implementation)
- TODO: Implement secure cloud storage with user consent
- TODO: Add data export functionality
- TODO: Ensure HIPAA compliance for health data

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
