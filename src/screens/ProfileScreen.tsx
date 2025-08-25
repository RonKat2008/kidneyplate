import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  
  // TODO: Replace with actual user data from context/state management
  const [userData, setUserData] = React.useState<User>({
    id: user?.id || '1',
    email: user?.email || 'user@example.com',
    name: user?.name || 'John Doe',
    ckdStage: 3,
    dietaryPreferences: ['low-sodium', 'low-potassium'],
    fluidLimit: 1500,
  });

  const [isEditing, setIsEditing] = React.useState(false);
  const [editedUser, setEditedUser] = React.useState<User>(userData);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const ckdStages = [
    { value: 1, label: 'Stage 1 (Normal to high)' },
    { value: 2, label: 'Stage 2 (Mild decrease)' },
    { value: 3, label: 'Stage 3 (Moderate decrease)' },
    { value: 4, label: 'Stage 4 (Severe decrease)' },
    { value: 5, label: 'Stage 5 (Kidney failure)' },
  ];

  const dietaryOptions = [
    { key: 'low-sodium', label: 'Low Sodium' },
    { key: 'low-potassium', label: 'Low Potassium' },
    { key: 'low-phosphorus', label: 'Low Phosphorus' },
    { key: 'low-protein', label: 'Low Protein' },
    { key: 'diabetic-friendly', label: 'Diabetic Friendly' },
    { key: 'vegetarian', label: 'Vegetarian' },
    { key: 'vegan', label: 'Vegan' },
  ];

  const handleSave = async () => {
    try {
      // TODO: Replace with actual API call to update user profile
      console.log('Saving user profile:', editedUser);
      
      setUserData(editedUser);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditedUser(userData);
    setIsEditing(false);
  };

  const toggleDietaryPreference = (preference: string) => {
    setEditedUser(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter(p => p !== preference)
        : [...prev.dietaryPreferences, preference],
    }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },          { 
            text: 'Logout', 
            style: 'destructive',
            onPress: () => {
              logout(); // This will automatically navigate back to auth screens
            }
          },
      ]
    );
  };

  const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const ProfileField = ({ 
    label, 
    value, 
    onChangeText, 
    editable = true,
    keyboardType = 'default' as any,
    placeholder = ''
  }: {
    label: string;
    value: string;
    onChangeText?: (text: string) => void;
    editable?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric';
    placeholder?: string;
  }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, !editable && styles.fieldInputDisabled]}
        value={value}
        onChangeText={onChangeText}
        editable={isEditing && editable}
        keyboardType={keyboardType}
        placeholder={placeholder}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color="#0ea5e9" />
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          
          <TouchableOpacity
            style={[styles.editButton, isEditing && styles.editButtonActive]}
            onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            <Ionicons 
              name={isEditing ? "checkmark" : "create-outline"} 
              size={20} 
              color="white" 
            />
            <Text style={styles.editButtonText}>
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Basic Information */}
        <ProfileSection title="Basic Information">
          <ProfileField
            label="Full Name"
            value={editedUser.name}
            onChangeText={(text) => setEditedUser(prev => ({ ...prev, name: text }))}
          />
          <ProfileField
            label="Email"
            value={editedUser.email}
            onChangeText={(text) => setEditedUser(prev => ({ ...prev, email: text }))}
            keyboardType="email-address"
            editable={false}
          />
        </ProfileSection>

        {/* CKD Information */}
        <ProfileSection title="CKD Information">
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>CKD Stage</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.stageSelector}>
                {ckdStages.map((stage) => (
                  <TouchableOpacity
                    key={stage.value}
                    style={[
                      styles.stageButton,
                      editedUser.ckdStage === stage.value && styles.stageButtonSelected,
                      !isEditing && styles.stageButtonDisabled,
                    ]}
                    onPress={() => isEditing && setEditedUser(prev => ({ ...prev, ckdStage: stage.value as any }))}
                    disabled={!isEditing}
                  >
                    <Text
                      style={[
                        styles.stageButtonText,
                        editedUser.ckdStage === stage.value && styles.stageButtonTextSelected,
                      ]}
                    >
                      {stage.value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <Text style={styles.fieldHelper}>
              Current: {ckdStages.find(s => s.value === editedUser.ckdStage)?.label}
            </Text>
          </View>

          <ProfileField
            label="Daily Fluid Limit (mL)"
            value={editedUser.fluidLimit?.toString() || ''}
            onChangeText={(text) => setEditedUser(prev => ({ 
              ...prev, 
              fluidLimit: text ? parseInt(text) : undefined 
            }))}
            keyboardType="numeric"
            placeholder="e.g., 1500"
          />
        </ProfileSection>

        {/* Dietary Preferences */}
        <ProfileSection title="Dietary Preferences">
          <View style={styles.preferencesGrid}>
            {dietaryOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.preferenceButton,
                  editedUser.dietaryPreferences.includes(option.key) && styles.preferenceButtonSelected,
                  !isEditing && styles.preferenceButtonDisabled,
                ]}
                onPress={() => isEditing && toggleDietaryPreference(option.key)}
                disabled={!isEditing}
              >
                <Text
                  style={[
                    styles.preferenceButtonText,
                    editedUser.dietaryPreferences.includes(option.key) && styles.preferenceButtonTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {editedUser.dietaryPreferences.includes(option.key) && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ProfileSection>

        {/* App Settings */}
        <ProfileSection title="App Settings">
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Meal Reminders</Text>
              <Text style={styles.settingDescription}>
                Get notified to log your meals
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e5e7eb', true: '#bfdbfe' }}
              thumbColor={notificationsEnabled ? '#0ea5e9' : '#9ca3af'}
            />
          </View>
        </ProfileSection>

        {/* Account Actions */}
        <ProfileSection title="Account">
          <TouchableOpacity style={styles.actionButton} onPress={() => {
            // TODO: Navigate to data export screen
            Alert.alert('Export Data', 'This feature will be available soon.');
          }}>
            <Ionicons name="download-outline" size={20} color="#0ea5e9" />
            <Text style={styles.actionButtonText}>Export My Data</Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => {
            // TODO: Navigate to help/support screen
            Alert.alert('Support', 'This feature will be available soon.');
          }}>
            <Ionicons name="help-circle-outline" size={20} color="#0ea5e9" />
            <Text style={styles.actionButtonText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Logout</Text>
          </TouchableOpacity>
        </ProfileSection>

        {/* App Information */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>KidneyPlate v1.0.0</Text>
          <Text style={styles.appInfoText}>CKD Nutrition Tracker</Text>
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
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  editButtonActive: {
    backgroundColor: '#22c55e',
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 8,
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionContent: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  fieldInputDisabled: {
    backgroundColor: '#f9fafb',
    color: '#6b7280',
  },
  fieldHelper: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  stageSelector: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
  },
  stageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageButtonSelected: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  stageButtonDisabled: {
    opacity: 0.6,
  },
  stageButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  stageButtonTextSelected: {
    color: 'white',
  },
  preferencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  preferenceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  preferenceButtonSelected: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  preferenceButtonDisabled: {
    opacity: 0.6,
  },
  preferenceButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  preferenceButtonTextSelected: {
    color: 'white',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  logoutButton: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 8,
    paddingTop: 16,
  },
  logoutButtonText: {
    color: '#ef4444',
  },
  appInfo: {
    alignItems: 'center',
    padding: 24,
    gap: 4,
  },
  appInfoText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default ProfileScreen;
