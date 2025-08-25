import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { auth } from '../config/firebase';
import {useAuth} from '../context/AuthContext';
import { sendEmailVerification,} from 'firebase/auth';
import { AuthStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
type VerifyEmailScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'VerifyEmail'>;
const VerifyEmailScreen: React.FC = () => {
  const navigation = useNavigation<VerifyEmailScreenNavigationProp>();
  const { setUser, setIsAuthenticated } = useAuth();
  const [isResending, setIsResending] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(false);
  const handleResend = async () => {
        const user = auth.currentUser;
        setIsResending(true);
        try {
            if(user && !user.emailVerified) {
                await sendEmailVerification(user);
                Alert.alert('Success', 'Verification email resent. Please check your inbox.');
            }
        }
        catch (error) {
            Alert.alert('Error', 'Failed to resend verification email. Please try again later.');
        } finally {
            setIsResending(false);
    }
  };

  const handleContinue = async () => {
    const user = auth.currentUser;
    
    if (!user) {
      Alert.alert('Error', 'No user found. Please try signing in again.');
      return;
    }

    setIsChecking(true);
    
    try {
      // Reload user to get latest email verification status
      await user.reload();
      
      // Get the updated user after reload
      const updatedUser = auth.currentUser;
      
      console.log('📧 Email verified status after reload:', updatedUser?.emailVerified);

      if (updatedUser?.emailVerified) {
        // TODO: Replace with backend API call to update user verification status
        
        
        Alert.alert(
          'Success', 
          'Email verified! You can now continue with setting up your profile.',
          [
            {
              text: 'Continue',
              onPress: () => {
                console.log('✅ Email verified - navigating to CKD onboarding');
                // Navigate to CKD onboarding screen
                navigation.navigate('CKDOnboarding');
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Email Not Verified',
          'Your email has not been verified yet. Please check your inbox and click the verification link, then try again.',
          [
            { text: 'OK', style: 'default' },
            { text: 'Resend Email', onPress: handleResend, style: 'default' }
          ]
        );
      }
    } catch (error) {
      console.error('❌ Email verification check error:', error);
      Alert.alert('Error', 'Failed to check email verification status. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Email Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="mail" size={80} color="#0ea5e9" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Verify Your Email</Text>
        
        {/* Subtitle */}
        <Text style={styles.subtitle}>
          We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
        </Text>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <View style={styles.instructionRow}>
            <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
            <Text style={styles.instructionText}>Check your email inbox</Text>
          </View>
          <View style={styles.instructionRow}>
            <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
            <Text style={styles.instructionText}>Click the verification link</Text>
          </View>
          <View style={styles.instructionRow}>
            <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
            <Text style={styles.instructionText}>Return here and continue</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleContinue}
          >
            <Ionicons name="checkmark" size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Email Verified</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, isResending && styles.buttonDisabled]}
            onPress={handleResend}
            disabled={isResending}
          >
            <Ionicons 
              name={isResending ? "hourglass" : "refresh"} 
              size={20} 
              color="#0ea5e9" 
              style={styles.buttonIcon} 
            />
            <Text style={styles.secondaryButtonText}>
              {isResending ? 'Sending...' : 'Resend Verification'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            Didn't receive an email? Check your spam folder or try resending.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Having trouble? Contact support for assistance.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 32,
  },
  instructionsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  buttonContainer: {
    gap: 16,
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
  helpContainer: {
    backgroundColor: '#fff7ed',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  helpText: {
    fontSize: 14,
    color: '#92400e',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default VerifyEmailScreen;
