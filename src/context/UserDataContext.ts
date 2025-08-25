import { auth } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// TODO: Replace with backend API calls when ready
// Ensure user is authenticated before using this context
function getAuthenticatedUser() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User must be authenticated to access user data context. This should only be used in authenticated screens.');
  }
  return user;
}

// Cache for user data to avoid repeated Firestore calls
let userDataCache: any = null;
let dailyDataCache: any = null;
let lastFetchDate: string | null = null;

// TODO: Replace with proper React Context pattern for better state management
async function ensureUserDataLoaded(): Promise<void> {
  try {
    const user = getAuthenticatedUser();
    const userId = user.uid;
    
    const today = new Date();
    const dateKey = today.toISOString().split('T')[0];

    // Only fetch if we haven't cached today's data
    if (!userDataCache || lastFetchDate !== dateKey) {
      console.log('🔄 Loading user data for authenticated user:', userId);
      
      // TODO: Replace Firestore calls with backend API
      const [userDoc, dailyDoc] = await Promise.all([
        getDoc(doc(db, 'users', userId)),
        getDoc(doc(db, 'users', userId, 'history', dateKey))
      ]);

      userDataCache = userDoc.data() || {};
      dailyDataCache = dailyDoc.data() || {};
      lastFetchDate = dateKey;
      
      console.log('✅ User data loaded successfully');
    }
  } catch (error) {
    console.error('❌ Failed to load user data:', error);
    throw error;
  }
}

// Helper function to get cached data with fallback
function getCachedUserData(): any {
  if (!userDataCache) {
    console.warn('⚠️ User data not loaded. Call ensureUserDataLoaded() first or use async versions.');
    return {};
  }
  return userDataCache;
}

function getCachedDailyData(): any {
  if (!dailyDataCache) {
    console.warn('⚠️ Daily data not loaded. Call ensureUserDataLoaded() first or use async versions.');
    return {};
  }
  return dailyDataCache;
}

// ----- Async Data Loading Functions -----
export async function loadUserData(): Promise<void> {
  await ensureUserDataLoaded();
}

// ----- Nutrition Data Functions -----
export function getCalories(): number {
  return getCachedDailyData().calories || 0;
}

export function getFiber(): number {
  return getCachedDailyData().fiber || 0;
}

export function getMeals(): any[] {
  return getCachedDailyData().meals || [];
}

export function getPhosphorus(): number {
  return getCachedDailyData().phosphorus || 0;
}

export function getPotassium(): number {
  return getCachedDailyData().potassium || 0;
}

export function getProtein(): number {
  return getCachedDailyData().protein || 0;
}

export function getSodium(): number {
  return getCachedDailyData().sodium || 0;
}

// ----- Async Nutrition Data Functions (Recommended) -----
export async function getCaloriesAsync(): Promise<number> {
  await ensureUserDataLoaded();
  return getCachedDailyData().calories || 0;
}

export async function getMealsAsync(): Promise<any[]> {
  await ensureUserDataLoaded();
  return getCachedDailyData().meals || [];
}

export async function getNutritionDataAsync(): Promise<{
  calories: number;
  fiber: number;
  phosphorus: number;
  potassium: number;
  protein: number;
  sodium: number;
  meals: any[];
}> {
  await ensureUserDataLoaded();
  const data = getCachedDailyData();
  
  return {
    calories: data.calories || 0,
    fiber: data.fiber || 0,
    phosphorus: data.phosphorus || 0,
    potassium: data.potassium || 0,
    protein: data.protein || 0,
    sodium: data.sodium || 0,
    meals: data.meals || [],
  };
}

// ----- CKD Data Functions -----
export function getCkdData(): any {
  return getCachedUserData().ckdData || {};
}

export function getCkdStage(): string {
  return getCachedUserData().ckdStage || 'N/A';
}

export function getDietaryPreferences(): string[] {
  return getCachedUserData().dietaryPreferences || [];
}

export function getDoctorNotes(): string {
  return getCachedUserData().doctorNotes || '';
}

export function getEgfrValue(): number | null {
  // TODO: Fetch eGFR value from backend API
  return getCachedUserData().egfrValue || null;
}

export function getFluidLimit(): number | null {
  // TODO: Fetch fluid limit from backend API
  return getCachedUserData().fluidLimit || null;
}

// ----- Async CKD Data Functions (Recommended) -----
export async function getCkdDataAsync(): Promise<{
  ckdStage: string;
  dietaryPreferences: string[];
  doctorNotes: string;
  egfrValue: number | null;
  fluidLimit: number | null;
}> {
  await ensureUserDataLoaded();
  const data = getCachedUserData();
  
  return {
    ckdStage: data.ckdStage || 'N/A',
    dietaryPreferences: data.dietaryPreferences || [],
    doctorNotes: data.doctorNotes || '',
    egfrValue: data.egfrValue || null,
    fluidLimit: data.fluidLimit || null,
  };
}

// ----- Limit Calculation Functions -----
type CKDStage = '1' | '2' | '3' | '4' | '5' | 'N/A';

interface Limits {
  sodium: number;
  potassium: number;
  phosphorus: number;
  protein: number;
  calories: number;
  fiber: number;
  fluid: number | null;
}

function getLimits(): Limits {
  const stage = getCkdStage() as CKDStage;
  
  // TODO: Replace with backend API call to get personalized limits
  const defaultLimits: Limits = {
    sodium: 2300,
    potassium: 4700,
    phosphorus: 1000,
    protein: 0.8,
    calories: 2000,
    fiber: 25,
    fluid: null,
  };

  const limitsByStage: Record<CKDStage, Limits> = {
    '1': defaultLimits,
    '2': defaultLimits,
    '3': {
      sodium: 2000,
      potassium: 3000,
      phosphorus: 800,
      protein: 0.6,
      calories: 2000,
      fiber: 25,
      fluid: null,
    },
    '4': {
      sodium: 1500,
      potassium: 2000,
      phosphorus: 700,
      protein: 0.6,
      calories: 2000,
      fiber: 25,
      fluid: 1500,
    },
    '5': {
      sodium: 1500,
      potassium: 1500,
      phosphorus: 600,
      protein: 0.6,
      calories: 2000,
      fiber: 25,
      fluid: 1000,
    },
    'N/A': defaultLimits,
  };

  return limitsByStage[stage] || defaultLimits;
}

export function getSodiumLimit(): number {
  return getLimits().sodium;
}

export function getPotassiumLimit(): number {
  return getLimits().potassium;
}

export function getPhosphorusLimit(): number {
  return getLimits().phosphorus;
}

export function getProteinLimit(): number {
  return getLimits().protein;
}

export function getCaloriesLimit(): number {
  return getLimits().calories;
}

export function getFiberLimit(): number {
  return getLimits().fiber;
}

export function getFluidLimitByStage(): number | null {
  return getLimits().fluid;
}

// ----- Async Limits Function (Recommended) -----
export async function getLimitsAsync(): Promise<Limits> {
  await ensureUserDataLoaded();
  return getLimits();
}

// ----- Utility Functions -----
export function getCurrentUserId(): string {
  const user = getAuthenticatedUser();
  return user.uid;
}

export function getCurrentUserEmail(): string {
  const user = getAuthenticatedUser();
  return user.email || '';
}

// ----- Update Functions -----
// TODO: Replace with backend 