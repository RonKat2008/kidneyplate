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

const TermsOfServiceScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0ea5e9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: September 7, 2025</Text>
        
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By downloading, installing, or using the KidneyPlate application ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the App.
        </Text>

        <Text style={styles.sectionTitle}>2. Medical Disclaimer</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>IMPORTANT: KidneyPlate is NOT a medical device and is for informational purposes only.</Text> The App provides general nutrition tracking and educational information related to chronic kidney disease (CKD) management but does not constitute medical advice, diagnosis, or treatment.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Always consult with qualified healthcare professionals</Text> before making any decisions regarding your health, diet, or medical treatment. Never disregard professional medical advice or delay seeking medical attention because of information provided by this App.
        </Text>

        <Text style={styles.sectionTitle}>3. AI-Generated Content</Text>
        <Text style={styles.paragraph}>
          The App may include AI-generated content, including but not limited to nutrition tips, meal suggestions, and responses to user queries. This content is for general informational purposes only and should not be considered personalized medical advice. AI responses may contain errors or inaccuracies.
        </Text>

        <Text style={styles.sectionTitle}>4. User Responsibilities</Text>
        <Text style={styles.paragraph}>
          You acknowledge and agree that:
        </Text>
        <Text style={styles.bulletPoint}>• You are solely responsible for all decisions regarding your health and nutrition</Text>
        <Text style={styles.bulletPoint}>• You will not rely solely on the App for medical decisions</Text>
        <Text style={styles.bulletPoint}>• You will consult healthcare professionals for personalized medical advice</Text>
        <Text style={styles.bulletPoint}>• You will use the App at your own risk</Text>

        <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE APP DEVELOPERS AND THEIR AFFILIATES SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</Text> arising out of or relating to your use of the App, including but not limited to:
        </Text>
        <Text style={styles.bulletPoint}>• Any health-related decisions or outcomes</Text>
        <Text style={styles.bulletPoint}>• Reliance on AI-generated content</Text>
        <Text style={styles.bulletPoint}>• Nutrition tracking inaccuracies</Text>
        <Text style={styles.bulletPoint}>• Data loss or system failures</Text>

        <Text style={styles.sectionTitle}>6. No Warranty</Text>
        <Text style={styles.paragraph}>
          The App is provided "AS IS" without warranties of any kind, either express or implied. We do not warrant that the App will be error-free, secure, or continuously available.
        </Text>

        <Text style={styles.sectionTitle}>7. Data Usage</Text>
        <Text style={styles.paragraph}>
          Your use of the App is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information.
        </Text>

        <Text style={styles.sectionTitle}>8. Modifications</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these Terms at any time. Continued use of the App after changes constitutes acceptance of the modified Terms.
        </Text>

        <Text style={styles.sectionTitle}>9. Contact Information</Text>
        <Text style={styles.paragraph}>
          If you have questions about these Terms, please contact us through the App's support features.
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using KidneyPlate, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#92400e',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
});

export default TermsOfServiceScreen;
