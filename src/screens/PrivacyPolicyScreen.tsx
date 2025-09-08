import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const PrivacyPolicyScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0ea5e9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: September 7, 2025</Text>
        
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          KidneyPlate ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our mobile application.
        </Text>

        <Text style={styles.sectionTitle}>2. Information We Collect</Text>
        
        <Text style={styles.subsectionTitle}>Account Information</Text>
        <Text style={styles.paragraph}>
          When you create an account, we collect:
        </Text>
        <Text style={styles.bulletPoint}>• Email address (required for authentication)</Text>
        <Text style={styles.bulletPoint}>• Display name (optional)</Text>
        <Text style={styles.bulletPoint}>• Password (encrypted and stored securely)</Text>

        <Text style={styles.subsectionTitle}>Health and Nutrition Data</Text>
        <Text style={styles.paragraph}>
          With your consent, we collect and store:
        </Text>
        <Text style={styles.bulletPoint}>• CKD stage information</Text>
        <Text style={styles.bulletPoint}>• Dietary preferences and restrictions</Text>
        <Text style={styles.bulletPoint}>• Daily fluid intake limits</Text>
        <Text style={styles.bulletPoint}>• eGFR values (if provided)</Text>
        <Text style={styles.bulletPoint}>• Doctor's notes and medical instructions</Text>
        <Text style={styles.bulletPoint}>• Meal logs and nutrition tracking data</Text>
        <Text style={styles.bulletPoint}>• Chat interactions with our AI assistant</Text>

        <Text style={styles.sectionTitle}>3. How We Store Your Data</Text>
        
        <Text style={styles.subsectionTitle}>Firebase Cloud Services</Text>
        <Text style={styles.paragraph}>
          Your data is securely stored using Google Firebase, which provides:
        </Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Authentication:</Text> Secure login system with encrypted credentials</Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Cloud Firestore:</Text> NoSQL database with automatic encryption at rest</Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Data Isolation:</Text> Your data is tied to your unique user ID and cannot be accessed by other users</Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Backup and Recovery:</Text> Automatic data backup and disaster recovery</Text>

        <Text style={styles.subsectionTitle}>Data Organization</Text>
        <Text style={styles.paragraph}>
          Your data is organized as follows:
        </Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>User Profile:</Text> /users/{'{your-user-id}'}/</Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Daily Nutrition:</Text> /users/{'{your-user-id}'}/history/{'{date}'}/</Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Meal Logs:</Text> Stored within daily nutrition records</Text>

        <Text style={styles.sectionTitle}>4. Data Security</Text>
        <Text style={styles.paragraph}>
          We implement multiple layers of security:
        </Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Encryption:</Text> All data is encrypted in transit (HTTPS/TLS) and at rest</Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Authentication:</Text> Firebase Authentication with secure token management</Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Access Control:</Text> Strict database rules ensure users can only access their own data</Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Infrastructure:</Text> Google Cloud Platform's enterprise-grade security</Text>

        <Text style={styles.sectionTitle}>5. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use your information to:
        </Text>
        <Text style={styles.bulletPoint}>• Provide personalized nutrition tracking</Text>
        <Text style={styles.bulletPoint}>• Generate relevant AI-powered recommendations</Text>
        <Text style={styles.bulletPoint}>• Sync your data across devices</Text>
        <Text style={styles.bulletPoint}>• Improve app functionality and user experience</Text>
        <Text style={styles.bulletPoint}>• Provide customer support when requested</Text>

        <Text style={styles.sectionTitle}>6. Data Sharing</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>We do NOT sell, rent, or share your personal health information with third parties.</Text> Your health data remains private and is only accessible to you through your authenticated account.
        </Text>
        <Text style={styles.paragraph}>
          Limited data may be shared only in these circumstances:
        </Text>
        <Text style={styles.bulletPoint}>• With your explicit consent</Text>
        <Text style={styles.bulletPoint}>• When required by law or legal process</Text>
        <Text style={styles.bulletPoint}>• To protect the safety and security of our users</Text>

        <Text style={styles.sectionTitle}>7. Data Retention</Text>
        <Text style={styles.paragraph}>
          We retain your data for as long as your account remains active. You may request account deletion at any time, which will permanently remove all your personal information from our systems within 30 days.
        </Text>

        <Text style={styles.sectionTitle}>8. Your Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to:
        </Text>
        <Text style={styles.bulletPoint}>• Access your personal information</Text>
        <Text style={styles.bulletPoint}>• Correct inaccurate data</Text>
        <Text style={styles.bulletPoint}>• Delete your account and data</Text>
        <Text style={styles.bulletPoint}>• Export your data</Text>
        <Text style={styles.bulletPoint}>• Withdraw consent for data processing</Text>

        <Text style={styles.sectionTitle}>9. Children's Privacy</Text>
        <Text style={styles.paragraph}>
          KidneyPlate is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
        </Text>

        <Text style={styles.sectionTitle}>10. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy periodically. We will notify you of any material changes through the app or via email.
        </Text>

        <Text style={styles.sectionTitle}>11. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have questions about this Privacy Policy or your personal information, please contact us through the app's support features.
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Your privacy is important to us. We are committed to protecting your personal health information and maintaining the highest standards of data security.
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 24,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  bold: {
    fontWeight: 'bold',
    color: '#1f2937',
  },
  bulletPoint: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 8,
    marginLeft: 16,
  },
  footer: {
    backgroundColor: '#ecfdf5',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  footerText: {
    fontSize: 14,
    color: '#065f46',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
});

export default PrivacyPolicyScreen;
