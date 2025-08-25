import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MealEntry } from '../types';

interface MealListItemProps {
  meal: MealEntry;
  onPress?: () => void;
}

export const MealListItem: React.FC<MealListItemProps> = ({ meal, onPress }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '#f59e0b';
      case 'lunch': return '#0ea5e9';
      case 'dinner': return '#8b5cf6';
      case 'snack': return '#22c55e';
      default: return '#6b7280';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.mealTypeBadge, { backgroundColor: getMealTypeColor(meal.mealType) }]}>
          <Text style={styles.mealTypeText}>{meal.mealType.toUpperCase()}</Text>
        </View>
        <Text style={styles.time}>{formatTime(meal.timestamp)}</Text>
      </View>
      
      <Text style={styles.foodName}>{meal.foodItem.name}</Text>
      <Text style={styles.serving}>Quantity: {meal.quantity} × {meal.foodItem.servingSize}</Text>
      
      <View style={styles.nutrients}>
        <Text style={styles.nutrient}>
          Na: {Math.round(meal.foodItem.nutrients.sodium * meal.quantity)}mg
        </Text>
        <Text style={styles.nutrient}>
          K: {Math.round(meal.foodItem.nutrients.potassium * meal.quantity)}mg
        </Text>
        <Text style={styles.nutrient}>
          P: {Math.round(meal.foodItem.nutrients.phosphorus * meal.quantity)}mg
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mealTypeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: '#6b7280',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  serving: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  nutrients: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutrient: {
    fontSize: 12,
    color: '#374151',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
