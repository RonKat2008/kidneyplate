import React from 'react';
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
import { doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import {getDoc } from 'firebase/firestore';
import { mockTodaysMeals, mockNutritionGoals, calculateDailyTotals } from '../utils/mockData';
import { auth } from '../config/firebase';
import * as NutritionUtils from '../context/UserDataContext';


const HomeScreen: React.FC = async () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [todaysMeals] = React.useState(mockTodaysMeals);



  const dailyTotals = calculateDailyTotals(todaysMeals);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Fetch fresh data from API
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
                current={NutritionUtils.getSodium()}
                goal={NutritionUtils.getSodiumLimit()}
                unit="mg"
                color="#ef4444"
              />
              <NutrientCard
                title="Potassium"
                current={NutritionUtils.getPotassium()}
                goal={NutritionUtils.getPotassiumLimit()}
                unit="mg"
                color="#f59e0b"
              />
              <NutrientCard
                title="Phosphorus"
                current={NutritionUtils.getPhosphorus()}
                goal={NutritionUtils.getPhosphorusLimit()}
                unit="mg"
                color="#8b5cf6"
              />
              <NutrientCard
                title="Protein"
                current={NutritionUtils.getProtein()}
                goal={NutritionUtils.getProteinLimit()}
                unit="g"
                color="#22c55e"
              />
            </View>
          </ScrollView>
        </View>

        {/* AI Tip of the Day */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Tip of the Day</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              Remember to space out your protein intake throughout the day! 
              Eating smaller portions of protein at each meal helps reduce kidney workload.
            </Text>
            {/* TODO: Replace with actual AI-generated tips */}
          </View>
        </View>

        {/* Recent Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Meals</Text>
          {todaysMeals.length > 0 ? (
            todaysMeals.map((meal) => (
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
              <Text style={styles.statValue}>{dailyTotals.calories}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{todaysMeals.length}</Text>
              <Text style={styles.statLabel}>Meals Logged</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{Math.round(dailyTotals.fiber)}g</Text>
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
});

export default HomeScreen;
