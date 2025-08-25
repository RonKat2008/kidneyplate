import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NutrientCardProps {
  title: string;
  current: number;
  goal: number;
  unit: string;
  color?: string;
}

export const NutrientCard: React.FC<NutrientCardProps> = ({
  title,
  current,
  goal,
  unit,
  color = '#0ea5e9',
}) => {
  const percentage = Math.min((current / goal) * 100, 100);
  const isOverGoal = current > goal;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, isOverGoal && styles.overGoal]}>
        {Math.round(current)}{unit}
      </Text>
      <Text style={styles.goal}>Goal: {goal}{unit}</Text>
      
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: isOverGoal ? '#ef4444' : color 
            }
          ]} 
        />
      </View>
      
      <Text style={[styles.percentage, isOverGoal && styles.overGoal]}>
        {Math.round(percentage)}%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 140,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  goal: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  overGoal: {
    color: '#ef4444',
  },
});
