import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebase';

import { setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase'; // Ensure you have this import for Firestore
import { getFirestore, doc } from 'firebase/firestore';
type CKDOnboardingNavigationProp = StackNavigationProp<AuthStackParamList, 'CKDOnboarding'>;

interface CKDFormData {
  ckdStage: 1 | 2 | 3 | 4 | 5 | 'N/A';
  fluidLimit: string;
  dietaryPreferences: string[];
  egfrValue: string;
  doctorNotes: string;
}

const initializeDailyData = async (uid: string) => {
  try {
    const today = new Date();
    const dateKey = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    console.log('🚀 Initializing daily data for user:', uid, 'Date:', dateKey);
    
    // TODO: Replace Firestore with backend API call
    const dailyDocRef = doc(db, 'users', uid, 'history', dateKey);
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
      console.log('✅ Initialized daily data for user:', uid);
    } else {
      console.log('📊 Daily data already exists for user:', uid);
    }
  } catch (error) {
    console.error('❌ Failed to initialize daily data for user:', uid, error);
    // TODO: Handle error appropriately - maybe show user notification
  }
};

const CKDOnboardingScreen: React.FC = () => {
  const navigation = useNavigation<CKDOnboardingNavigationProp>();
  const { setUser, setIsAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [disclaimerAgreed, setDisclaimerAgreed] = React.useState(false);
  
  const [formData, setFormData] = React.useState<CKDFormData>({
    ckdStage: 'N/A',
    fluidLimit: '',
    dietaryPreferences: [],
    egfrValue: '',
    doctorNotes: '',
  });

  // Available dietary preferences
  const dietaryOptions = [
    'Low Sodium',
    'Low Potassium',
    'Low Phosphorus',
    'Low Protein',
    'Diabetic Friendly',
    'Heart Healthy',
    'Vegetarian',
    'Vegan',
    'Gluten Free',
    'N/A'
  ];

  const handleCKDStageSelect = (stage: 1 | 2 | 3 | 4 | 5 | 'N/A') => {
    setFormData(prev => ({ ...prev, ckdStage: stage }));
  };

  const handleDietaryPreferenceToggle = (preference: string) => {
    setFormData(prev => {
      const newPreferences = [...prev.dietaryPreferences];
      
      // If N/A is selected, clear all other preferences
      if (preference === 'N/A') {
        return { ...prev, dietaryPreferences: ['N/A'] };
      }
      
      // If other preference is selected and N/A was previously selected, remove N/A
      if (newPreferences.includes('N/A')) {
        const index = newPreferences.indexOf('N/A');
        newPreferences.splice(index, 1);
      }
      
      // Toggle the selected preference
      const index = newPreferences.indexOf(preference);
      if (index > -1) {
        newPreferences.splice(index, 1);
      } else {
        newPreferences.push(preference);
      }
      
      return { ...prev, dietaryPreferences: newPreferences };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // TODO: Replace with backend API call to save CKD information
      const ckdData = {
        ckdStage: formData.ckdStage,
        fluidLimit: formData.fluidLimit === '' ? null : parseInt(formData.fluidLimit),
        dietaryPreferences: formData.dietaryPreferences.length === 0 ? ['N/A'] : formData.dietaryPreferences,
        egfrValue: formData.egfrValue === '' ? null : parseFloat(formData.egfrValue),
        doctorNotes: formData.doctorNotes === '' ? 'N/A' : formData.doctorNotes,
      };
      
      
      console.log('🏥 CKD Information submitted:', ckdData);
      
      // Mock API delay
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user found.');
      }
      const userData = {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || user.email?.split('@')[0] || 'User',
        ckdData: ckdData,

      };
      setUser(userData);
      setIsAuthenticated(true);
      await setDoc(doc(db, 'users', user.uid), userData);
      await initializeDailyData(user.uid);
      console.log('✅ CKD information saved successfully for user:', user.uid);
      
      // TODO: Update user profile with CKD information
      // This would typically be sent to backend and user context updated
      
      Alert.alert(
        'Profile Complete!',
        'Your CKD information has been saved. You can now start using the app.',
        [
          {
            text: 'Get Started',
            onPress: () => {
              // Complete onboarding - set user as authenticated
              console.log('✅ CKD onboarding complete - navigating to main app');
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('❌ CKD onboarding error:', error);
      Alert.alert('Error', 'Failed to save your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="medical" size={60} color="#0ea5e9" />
          </View>
          <Text style={styles.title}>CKD Information</Text>
          <Text style={styles.subtitle}>
            Help us personalize your nutrition tracking by providing your CKD information
          </Text>
        </View>

        {/* CKD Stage Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CKD Stage</Text>
          <Text style={styles.sectionSubtitle}>Select your current CKD stage</Text>
          
          <View style={styles.stageContainer}>
            {[1, 2, 3, 4, 5, 'N/A'].map((stage) => (
              <TouchableOpacity
                key={stage}
                style={[
                  styles.stageButton,
                  formData.ckdStage === stage && styles.stageButtonSelected
                ]}
                onPress={() => handleCKDStageSelect(stage as 1 | 2 | 3 | 4 | 5 | 'N/A')}
              >
                <Text style={[
                  styles.stageButtonText,
                  formData.ckdStage === stage && styles.stageButtonTextSelected
                ]}>
                  {stage === 'N/A' ? 'N/A' : `Stage ${stage}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Fluid Limit */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Fluid Limit</Text>
          <Text style={styles.sectionSubtitle}>Enter your daily fluid limit in mL (optional)</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={formData.fluidLimit}
              onChangeText={(text) => setFormData(prev => ({ ...prev, fluidLimit: text }))}
              placeholder="e.g., 1500 or leave empty for N/A"
              keyboardType="numeric"
              maxLength={6}
            />
            <Text style={styles.inputUnit}>mL</Text>
          </View>
        </View>

        {/* Dietary Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dietary Preferences</Text>
          <Text style={styles.sectionSubtitle}>Select all that apply to your dietary needs</Text>
          
          <View style={styles.preferencesContainer}>
            {dietaryOptions.map((preference) => (
              <TouchableOpacity
                key={preference}
                style={[
                  styles.preferenceButton,
                  formData.dietaryPreferences.includes(preference) && styles.preferenceButtonSelected
                ]}
                onPress={() => handleDietaryPreferenceToggle(preference)}
              >
                <Text style={[
                  styles.preferenceButtonText,
                  formData.dietaryPreferences.includes(preference) && styles.preferenceButtonTextSelected
                ]}>
                  {preference}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* eGFR Value */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>eGFR Value</Text>
          <Text style={styles.sectionSubtitle}>Enter your most recent eGFR value (optional)</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={formData.egfrValue}
              onChangeText={(text) => setFormData(prev => ({ ...prev, egfrValue: text }))}
              placeholder="e.g., 45.5 or leave empty for N/A"
              keyboardType="numeric"
              maxLength={6}
            />
            <Text style={styles.inputUnit}>mL/min/1.73m²</Text>
          </View>
        </View>

        {/* Doctor Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Doctor's Notes</Text>
          <Text style={styles.sectionSubtitle}>Any specific dietary instructions from your doctor (optional)</Text>
          
          <TextInput
            style={styles.textAreaInput}
            value={formData.doctorNotes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, doctorNotes: text }))}
            placeholder="Enter any specific dietary instructions from your healthcare provider or leave empty for N/A"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
        </View>

        {/* Medical Disclaimer */}
        <View style={styles.disclaimerSection}>
          <View style={styles.disclaimerHeader}>
            <Ionicons name="medical" size={24} color="#dc2626" />
            <Text style={styles.disclaimerTitle}>Important Medical Disclaimer</Text>
          </View>
          
          <View style={styles.disclaimerContent}>
            <Text style={styles.disclaimerText}>
              <Text style={styles.disclaimerBold}>KidneyPlate is for informational purposes only and is NOT a medical device.</Text>
              {'\n\n'}
              This application provides general nutrition tracking and educational information but does not constitute medical advice, diagnosis, or treatment.
              {'\n\n'}
              <Text style={styles.disclaimerBold}>Always consult with qualified healthcare professionals</Text> before making any decisions regarding your health, diet, or medical treatment.
              {'\n\n'}
              By proceeding, you acknowledge that you understand this is an informational tool and you will not rely solely on this app for medical decisions.
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setDisclaimerAgreed(!disclaimerAgreed)}
          >
            <View style={[styles.checkbox, disclaimerAgreed && styles.checkboxChecked]}>
              {disclaimerAgreed && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </View>
            <Text style={styles.checkboxText}>
              I understand and agree to the medical disclaimer above
            </Text>
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.primaryButton, 
              (isSubmitting || !disclaimerAgreed) && styles.buttonDisabled
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting || !disclaimerAgreed}
          >
            <Ionicons 
              name={isSubmitting ? "hourglass" : "checkmark"} 
              size={20} 
              color="white" 
              style={styles.buttonIcon} 
            />
            <Text style={styles.primaryButtonText}>
              {isSubmitting ? 'Saving...' : 'Complete Setup'}
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSkip}
            disabled={isSubmitting}
          >
            <Ionicons name="arrow-forward" size={20} color="#0ea5e9" style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Skip for Now</Text>
          </TouchableOpacity> */}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This information helps us provide personalized nutrition recommendations. You can update it anytime in your profile settings.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  stageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  stageButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    minWidth: 90,
    alignItems: 'center',
  },
  stageButtonSelected: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  stageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  stageButtonTextSelected: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  inputUnit: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  preferenceButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  preferenceButtonSelected: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  preferenceButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  preferenceButtonTextSelected: {
    color: 'white',
  },
  textAreaInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
    minHeight: 100,
  },
  buttonContainer: {
    gap: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  secondaryButtonText: {
    color: '#0ea5e9',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 18,
  },
  disclaimerSection: {
    backgroundColor: '#fef2f2',
    borderWidth: 2,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  disclaimerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginLeft: 8,
  },
  disclaimerContent: {
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  disclaimerBold: {
    fontWeight: 'bold',
    color: '#dc2626',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});

export default CKDOnboardingScreen;
