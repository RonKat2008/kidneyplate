import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {db} from '../config/firebase'; // Adjust the import path as necessary
import { auth } from '../config/firebase'; // Adjust the import path as necessary
import { 
    sendEmailVerification,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged,
    User as FirebaseUser,
    updateProfile
  } from 'firebase/auth';
interface User {
    id: string;
    email: string;
    name: string;
  }
  
interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void; // ✅ Must be here
  user: User | null;
  setUser: (user: User | null) => void;        // ✅ Must be here
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  isLoading: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);


const initializeDailyData = async (firebaseUser: FirebaseUser) => {
  const userId = firebaseUser.uid;
  const today = new Date();
  const dateKey = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const dailyDocRef = doc(db, 'users', firebaseUser.uid, 'history', dateKey);
  const dailyDataDoc = await getDoc(dailyDocRef);

  if (!dailyDataDoc.exists()) {
    // Initialize daily data if it doesn't exist
    const initialData = {
      sodium: 0,
      potassium: 0,
      phosphorus: 0,
      protein: 0,
      calories: 0,
      fiber: 0,
      meals: [],
    };
    await setDoc(dailyDocRef, initialData);
    console.log('Initialized daily data for user:', userId);
  } else {
    console.log('Daily data already exists for user:', userId);
  }
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await firebaseUser.reload(); // Ensure user data is up-to-date
        const isEmailVerified = firebaseUser.emailVerified;
        console.log('Auth state changed - emailVerified:', isEmailVerified);
        if (isEmailVerified) {
          const userData: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            };
          console.log('User data:', userData);
          setUser(userData);
          setIsAuthenticated(true);
          await initializeDailyData(firebaseUser);
           // Initialize daily data for the user
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try { 
        setIsLoading(true);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        };
        setUser(userData);
        setIsAuthenticated(true);
        return true;
    } catch (error: any) {
      console.error('❌ Firebase login error:', error.message);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      } else {
        throw new Error('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    try { 
        setIsLoading(true);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        await updateProfile(firebaseUser, { displayName: name });
        await sendEmailVerification(firebaseUser);
       
        return true;
    } catch (error: any) {
      console.error('❌ Firebase signup error:', error.message);

      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address.');
      } else {
        throw new Error('Sign up failed. Please try again.');
      }
    } finally {
        setIsLoading(false);
    }
}

const logout = async (): Promise<void> => {
    try {
        setIsLoading(true);
        await signOut(auth);
        setUser(null);
        setIsAuthenticated(false);
    }
    catch (error) {
        console.error('Logout error:', error);
    }
    finally {
        setIsLoading(false);
    }
}


const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    signUp,
    isLoading,
    setIsAuthenticated, // ✅ Must be here
    setUser,           // ✅ Must be here

};
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
