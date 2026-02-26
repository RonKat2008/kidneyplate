import { auth } from '../config/firebase';
import { arrayRemove, arrayUnion, doc, getDoc, increment, setDoc, updateDoc,collection,getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { MealEntry } from '../types';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

// Simple event emitter for data changes
type DataChangeListener = () => void;
const dataChangeListeners: DataChangeListener[] = [];

export function addDataChangeListener(listener: DataChangeListener): () => void {
  dataChangeListeners.push(listener);
  return () => {
    const index = dataChangeListeners.indexOf(listener);
    if (index > -1) {
      dataChangeListeners.splice(index, 1);
    }
  };
}

function notifyDataChange(): void {
  console.log('📢 Notifying data change to', dataChangeListeners.length, 'listeners');
  dataChangeListeners.forEach(listener => {
    try {
      listener();
    } catch (error) {
      console.error('❌ Error in data change listener:', error);
    }
  });
}

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
let historyCache: any = null;
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
      const [userDoc, dailyDoc, historyDoc] = await Promise.all([
        getDoc(doc(db, 'users', userId)),
        getDoc(doc(db, 'users', userId, 'history', dateKey)),
        getDocs(collection(db, 'users', userId, 'history'))
      ]);

      userDataCache = userDoc.data() || {};
      dailyDataCache = dailyDoc.data() || {};
      historyCache = historyDoc.docs.map(doc => ({ id: doc.id, ...doc.data() })) || {};
      console.log('History data:', historyCache);
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
function getCachedHistoryData(): any {
  if (!historyCache) {
    console.warn('⚠️ History data not loaded. Call ensureUserDataLoaded() first or use async versions.');
    return {};
  }
  return historyCache;
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
  suger: number;
  fat: number;
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
    suger: data.suger || 0,
    fat: data.fat || 0,
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
export function getHistoryData(): any {

  return getCachedHistoryData() || {};
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
  suger: number;
  fat: number;
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
    suger: 50,
    fat: 70,
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
      suger: 50,
      fat: 70,
      fluid: null,
    },
    '4': {
      sodium: 1500,
      potassium: 2000,
      phosphorus: 700,
      protein: 0.6,
      calories: 2000,
      fiber: 25,
      suger: 50,
      fat: 70,
      fluid: 1500,
    },
    '5': {
      sodium: 1500,
      potassium: 1500,
      phosphorus: 600,
      protein: 0.6,
      calories: 2000,
      fiber: 25,
      suger: 50,
      fat: 70,
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
export function getSugerLimit(): number {
  return getLimits().suger;
}
export function getFatLimit(): number {
  return getLimits().fat;
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


// Function to invalidate cache and force refresh
function invalidateCache(): void {
  userDataCache = null;
  dailyDataCache = null;
  lastFetchDate = null;
  console.log('🔄 Cache invalidated, will refresh on next access');
  // Notify all listeners that data has changed
  notifyDataChange();
}

export async function logMeal(mealEntry: MealEntry): Promise<boolean> {
  try {
    console.log('Logging meal entry:', mealEntry);
    const uid = getCurrentUserId();
    const today = new Date();
    const dateKey = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    console.log('🚀 Initializing daily data for user:', uid, 'Date:', dateKey);

    // TODO: Replace Firestore with backend API call
    const dailyDocRef = doc(db, 'users', uid, 'history', dateKey);
    const dailyDataDoc = await getDoc(dailyDocRef);

    if (!dailyDataDoc.exists()) {
      console.log('⚠️ Creating new daily data for user:', uid, 'Date:', dateKey);
      // Create the document if it doesn't exist
      await setDoc(dailyDocRef, {
        meals: [mealEntry],
        calories: mealEntry.nutrients.calories,
        protein: mealEntry.nutrients.protein,
        sodium: mealEntry.nutrients.sodium,
        potassium: mealEntry.nutrients.potassium,
        phosphorus: mealEntry.nutrients.phosphorus,
        fiber: mealEntry.nutrients.fiber,
        suger: mealEntry.nutrients.suger,
        fat: mealEntry.nutrients.fat,
        date: dateKey,
      });
    } else {
      await updateDoc(dailyDocRef, {
        meals: arrayUnion(mealEntry),
        calories: increment(mealEntry.nutrients.calories),
        protein: increment(mealEntry.nutrients.protein),
        sodium: increment(mealEntry.nutrients.sodium),
        potassium: increment(mealEntry.nutrients.potassium),
        phosphorus: increment(mealEntry.nutrients.phosphorus),
        fiber: increment(mealEntry.nutrients.fiber),
        suger: increment(mealEntry.nutrients.suger),
        fat: increment(mealEntry.nutrients.fat),
      });
    }

    // Invalidate cache to force refresh
    invalidateCache();
    
    console.log('✅ Meal logged successfully for', uid, dateKey);
    return true;
  } catch (error) {
    console.error('❌ Failed to log meal:', error);
    return false;
  }
}

export async function deleteMeal(mealId: string, mealTimestamp: Date): Promise<boolean> {
  try {
    console.log(mealTimestamp);
    console.log(mealId);
    console.log('Deleting meal entry with ID:', mealId);
    const uid = getCurrentUserId();
    const today = (mealTimestamp as any).toDate?.() ?? mealTimestamp;
    const dateKey = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const dailyDocRef = doc(db, 'users', uid, 'history', dateKey);
    const dailyDataDoc = await getDoc(dailyDocRef);
    if (!dailyDataDoc.exists()) {
      console.log('⚠️ No daily data found for user:', uid, 'Date:', dateKey);
      return false;
    }

    const dailyData = dailyDataDoc.data();
    const meals = dailyData.meals || [];
    const mealEntry = meals.find((meal: MealEntry) => meal.id === mealId);
    if (!mealEntry) {
      console.log('⚠️ Meal entry not found for ID:', mealId);
      return false;
    }

    await updateDoc(dailyDocRef, {
      meals: arrayRemove(mealEntry), // Remove the entire meal object, not just the ID
      calories: increment(-mealEntry.nutrients.calories),
      protein: increment(-mealEntry.nutrients.protein),
      sodium: increment(-mealEntry.nutrients.sodium),
      potassium: increment(-mealEntry.nutrients.potassium),
      phosphorus: increment(-mealEntry.nutrients.phosphorus),
      fiber: increment(-mealEntry.nutrients.fiber),
      suger: increment(-mealEntry.nutrients.suger),
      fat: increment(-mealEntry.nutrients.fat),
    });

    // Invalidate cache to force refresh
    invalidateCache();
    
    console.log('✅ Meal deleted successfully for', uid, dateKey);
    return true;
  } catch (error) {
    console.error('❌ Failed to delete meal:', error);
    return false;
  }
}

// ----- Update Functions -----
export async function updateCkdDataAsync(ckdData: {
  ckdStage: number | string;
  dietaryPreferences: string[];
  fluidLimit: number | null;
  egfrValue: number | null;
  doctorNotes: string;
}): Promise<void> {
  try {
    const user = getAuthenticatedUser();
    const userDocRef = doc(db, 'users', user.uid);
    
    console.log('💾 Updating CKD data for user:', user.uid);
    
    await updateDoc(userDocRef, {
      ckdStage: ckdData.ckdStage,
      dietaryPreferences: ckdData.dietaryPreferences,
      fluidLimit: ckdData.fluidLimit,
      egfrValue: ckdData.egfrValue,
      doctorNotes: ckdData.doctorNotes,
      updatedAt: new Date(),
    });
    
    // Invalidate cache to force refresh
    invalidateCache();
    
    console.log('✅ CKD data updated successfully');
  } catch (error) {
    console.error('❌ Failed to update CKD data:', error);
    throw error;
  }
}

// TODO: Replace with backend 