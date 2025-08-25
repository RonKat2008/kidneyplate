<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# KidneyPlate - CKD Nutrition Tracker

This is a React Native mobile app built with Expo and TypeScript for kidney disease (CKD) patients to track their nutrition and health data.

## Project Guidelines

- **Frontend Only**: This project is frontend-only. All API calls and database storage should use placeholder functions or mock data with clear TODO comments.
- **Technology Stack**: React Native, Expo, TypeScript, React Navigation, NativeWind/TailwindCSS
- **Architecture**: Functional components with hooks, modular folder structure
- **Styling**: Use TailwindCSS classes via NativeWind or StyleSheet.create for consistent styling

## Key Features

1. **Authentication**: Login/Sign Up screens with placeholder handlers
2. **Dashboard**: Daily nutrition totals, recent meals, AI tips
3. **Meal Logging**: Food search and nutrient tracking
4. **Lab Tracker**: Lab value input and trend visualization
5. **AI Chat**: Nutrition assistance chat interface
6. **Profile**: CKD stage, dietary preferences, settings

## Code Conventions

- Always include TODO comments where backend logic will be implemented
- Use TypeScript interfaces for all data structures
- Follow React Native best practices for performance
- Keep components modular and reusable
- Use proper error handling and loading states
- Include accessibility features where appropriate

## Mock Data

- All data is currently mocked in `src/utils/mockData.ts`
- Replace mock API calls with actual endpoints when backend is ready
- Maintain proper typing throughout the application
