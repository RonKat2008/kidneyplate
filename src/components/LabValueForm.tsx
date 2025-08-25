import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LabValue } from '../types';

interface LabValueFormProps {
  onSubmit: (labValue: Omit<LabValue, 'id'>) => void;
}

export const LabValueForm: React.FC<LabValueFormProps> = ({ onSubmit }) => {
  const [selectedType, setSelectedType] = React.useState<LabValue['type']>('eGFR');
  const [value, setValue] = React.useState('');

  const labTypes = [
    { type: 'eGFR' as const, unit: 'mL/min/1.73m²', normalRange: { min: 90, max: 120 } },
    { type: 'creatinine' as const, unit: 'mg/dL', normalRange: { min: 0.7, max: 1.3 } },
    { type: 'potassium' as const, unit: 'mEq/L', normalRange: { min: 3.5, max: 5.0 } },
    { type: 'BUN' as const, unit: 'mg/dL', normalRange: { min: 6, max: 24 } },
    { type: 'albumin' as const, unit: 'g/dL', normalRange: { min: 3.4, max: 5.4 } },
    { type: 'phosphorus' as const, unit: 'mg/dL', normalRange: { min: 3.0, max: 4.5 } },
  ];

  const currentLabType = labTypes.find(lab => lab.type === selectedType)!;

  const handleSubmit = () => {
    if (!value || isNaN(Number(value))) {
      Alert.alert('Error', 'Please enter a valid number');
      return;
    }

    const labValue: Omit<LabValue, 'id'> = {
      type: selectedType,
      value: Number(value),
      unit: currentLabType.unit,
      date: new Date(),
      normalRange: currentLabType.normalRange,
    };

    onSubmit(labValue);
    setValue('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Lab Value</Text>
      
      {/* Lab Type Selector */}
      <Text style={styles.label}>Lab Test Type</Text>
      <View style={styles.typeSelector}>
        {labTypes.map((labType) => (
          <TouchableOpacity
            key={labType.type}
            style={[
              styles.typeButton,
              selectedType === labType.type && styles.selectedTypeButton,
            ]}
            onPress={() => setSelectedType(labType.type)}
          >
            <Text
              style={[
                styles.typeButtonText,
                selectedType === labType.type && styles.selectedTypeButtonText,
              ]}
            >
              {labType.type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Value Input */}
      <Text style={styles.label}>
        Value ({currentLabType.unit})
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder={`Enter ${selectedType} value`}
        keyboardType="numeric"
      />
      
      <Text style={styles.normalRange}>
        Normal Range: {currentLabType.normalRange.min} - {currentLabType.normalRange.max} {currentLabType.unit}
      </Text>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add Lab Value</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 8,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  selectedTypeButton: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  selectedTypeButtonText: {
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  normalRange: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
