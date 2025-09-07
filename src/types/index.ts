// Type definitions for the CKD Nutrition Tracker App

export interface User {
  id: string;
  email: string;
  name: string;
  ckdStage: 1 | 2 | 3 | 4 | 5 | 'N/A';
  dietaryPreferences: string[];
  fluidLimit?: number; // in mL
  egfrValue?: number;
  doctorNotes?: string;
}

export interface NutrientData {
  sodium: number;    // mg
  potassium: number; // mg
  phosphorus: number; // mg
  protein: number;   // g
  calories: number;
  fiber: number;     // g
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  nutrients: NutrientData;
  servingSize: string;
}

export interface MealEntry {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  timestamp: Date;
  nutrients: NutrientData;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface LabValue {
  id: string;
  type: 'eGFR' | 'creatinine' | 'potassium' | 'BUN' | 'albumin' | 'phosphorus';
  value: number;
  unit: string;
  date: Date;
  normalRange: {
    min: number;
    max: number;
  };
}

export interface DailyNutritionGoals {
  sodium: number;
  potassium: number;
  phosphorus: number;
  protein: number;
  calories: number;
  fluid: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  VerifyEmail: undefined;
  CKDOnboarding: undefined;
  ResetPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  MealLog: undefined;
  AIChat: undefined;
  Profile: undefined;
};
