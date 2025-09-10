// Environment variable configuration for Expo
// In Expo, environment variables must be prefixed with EXPO_PUBLIC_ to be accessible in the client

export const Config = {
  // Firebase Configuration
  FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyCJZ0IK6Tfvt45L8h4SVXh8cbFN5QXxHUc",
  FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "kidneyplatedatabase.firebaseapp.com",
  FIREBASE_DATABASE_URL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || "https://kidneyplatedatabase-default-rtdb.firebaseio.com",
  FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "kidneyplatedatabase",
  FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "kidneyplatedatabase.appspot.com",
  FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "157810271411",
  FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:157810271411:web:fc9df04e7aa1e7157c7cc6",
  FIREBASE_MEASUREMENT_ID: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-E006GKPQ7G",

  // API Configuration
  API_URL: process.env.EXPO_PUBLIC_API_URL || "https://kidneyplatefastapi-production-e1cb.up.railway.app/",
  USDA_API_KEY: process.env.EXPO_PUBLIC_USDA_API_KEY || "dbHO73RPfnpb8oORlVA41c7R6lv6L2P3hQ630j5M",
  USDA_BASE_URL: process.env.EXPO_PUBLIC_USDA_BASE_URL || "https://api.nal.usda.gov/fdc/v1",

  // Contact Information
  CONTACT_EMAIL: process.env.EXPO_PUBLIC_CONTACT_EMAIL || "kidneyplate@gmail.com"
};
