import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { NutrientCard } from '../components/NutrientCard';
import { MealListItem } from '../components/MealListItem';
import { useFocusEffect } from '@react-navigation/native';
import * as UserDataContext from '../context/UserDataContext';


const HomeScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [todaysMeals, setTodaysMeals] = useState<any[]>([]);
  const [nutritionData, setNutritionData] = useState({
    calories: 0,
    fiber: 0,
    phosphorus: 0,
    potassium: 0,
    protein: 0,
    sodium: 0,
    suger: 0,
    fat: 0,
  });
  const [limits, setLimits] = useState({
    calories: 2000,
    fiber: 25,
    phosphorus: 1000,
    potassium: 4700,
    protein: 0.8,
    sodium: 2300,
    suger: 50,
    fat: 70,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      console.log('📊 Loading nutrition data for HomeScreen...');
      const [nutritionData, limitsData, meals] = await Promise.all([
        UserDataContext.getNutritionDataAsync(),
        UserDataContext.getLimitsAsync(),
        UserDataContext.getMealsAsync(),
      ]);

      setNutritionData(nutritionData);
      setLimits(limitsData);
      setTodaysMeals(meals);
      console.log('✅ HomeScreen data loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load HomeScreen data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data when screen is focused (to get fresh data after adding meals)
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // Listen for data changes
  useEffect(() => {
    const unsubscribe = UserDataContext.addDataChangeListener(() => {
      console.log('🔄 HomeScreen received data change notification');
      loadData();
    });

    return unsubscribe;
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.dateText}>{formatDate(new Date())}</Text>
        </View>

        {/* Daily Nutrition Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Nutrition</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.nutrientCards}>
              <NutrientCard
                title="Sodium"
                current={nutritionData.sodium}
                goal={limits.sodium}
                unit="mg"
                color="#ef4444"
              />
              <NutrientCard
                title="Potassium"
                current={nutritionData.potassium}
                goal={limits.potassium}
                unit="mg"
                color="#f59e0b"
              />
              <NutrientCard
                title="Suger"
                current={nutritionData.suger}
                goal={limits.suger}
                unit="g"
                color="#f97316"
              />
              <NutrientCard
                title="Fat"
                current={nutritionData.fat}
                goal={limits.fat}
                unit="g"
                color="#0ea5e9"
              />
              <NutrientCard
                title="Phosphorus"
                current={nutritionData.phosphorus}
                goal={limits.phosphorus}
                unit="mg"
                color="#8b5cf6"
              />
              <NutrientCard
                title="Protein"
                current={nutritionData.protein}
                goal={limits.protein}
                unit="g"
                color="#22c55e"
              />
              <NutrientCard
                title="Fiber"
                current={nutritionData.fiber}
                goal={limits.fiber}
                unit="g"
                color="#3b82f6" // blue
              />
              <NutrientCard
                title="Calories"
                current={nutritionData.calories}
                goal={limits.calories}
                unit="kcal"
                color="#ec4899" // pink
              />

            </View>
          </ScrollView>
        </View>

        {/* Medical Disclaimer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚕️ Important Medical Notice</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              <Text style={styles.boldText}>KidneyPlate is for informational purposes only and is NOT a medical device.</Text> Always consult with qualified healthcare professionals before making any health or dietary decisions. This app does not provide medical advice, diagnosis, or treatment.
            </Text>
          </View>
        </View>

        {/* Recent Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Meals</Text>
          {todaysMeals.length > 0 ? (
            todaysMeals.map((meal: any) => (
              <MealListItem
                key={meal.id}
                meal={meal}
                onPress={() => {
                  // TODO: Navigate to meal details or edit screen
                  console.log('Meal tapped:', meal.id);
                }}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No meals logged today</Text>
              <Text style={styles.emptyStateSubtext}>
                Tap the Meals tab to start tracking your nutrition
              </Text>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{Math.round(nutritionData.calories)}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{todaysMeals.length}</Text>
              <Text style={styles.statLabel}>Meals Logged</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{Math.round(nutritionData.fiber)}g</Text>
              <Text style={styles.statLabel}>Fiber</Text>
            </View>
          </View>
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
  header: {
    padding: 20,
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  dateText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  nutrientCards: {
    flexDirection: 'row',
    paddingLeft: 12,
  },
  tipCard: {
    backgroundColor: '#fff7ed',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    minWidth: 80,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#dc2626',
  },
});

export default HomeScreen;
