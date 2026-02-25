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
  FlatList,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FoodItem, MealEntry, NutrientData } from '../types';

import { searchFoods } from '../api_chat/USDA';
import { logMeal, deleteMeal, addDataChangeListener, getHistoryData } from '../context/UserDataContext';
// Ensure you have this import for Firestore
const MealLogScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = React.useState<FoodItem | null>(null);
  const [quantity, setQuantity] = React.useState('1');
  const [mealType, setMealType] = React.useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [isSearching, setIsSearching] = React.useState(false);
  const [showFoodSelection, setShowFoodSelection] = React.useState(false);
  const [showMealHistory, setShowMealHistory] = React.useState(false);
  const [nutritionHistory, setNutritionHistory] = React.useState<any[]>([]);
  const [isLoadingMeals, setIsLoadingMeals] = React.useState(false);

  // Listen for data changes to refresh meal history
  React.useEffect(() => {
    const unsubscribe = addDataChangeListener(() => {
      console.log('🔄 MealLogScreen received data change notification');
      if (showMealHistory) {
        loadMealsHistory();
      }
    });

    return unsubscribe;
  }, [showMealHistory]);

  const mealTypes = [
    { key: 'breakfast' as const, label: 'Breakfast', color: '#f59e0b' },
    { key: 'lunch' as const, label: 'Lunch', color: '#0ea5e9' },
    { key: 'dinner' as const, label: 'Dinner', color: '#8b5cf6' },
    { key: 'snack' as const, label: 'Snack', color: '#22c55e' },
  ];

  // Load nutrition history by date
  const loadMealsHistory = async () => {
    setIsLoadingMeals(true);
    try {
      // Get history data which should be organized by date
      const historyData = await getHistoryData();
      
      // Convert history object to array format for display
      // Assuming historyData structure: { "2025-10-05": { nutrition: {...}, meals: [...] }, ... }
      const historyArray = Object.entries(historyData || {}).map(([date, dayData]: [string, any]) => ({
        date,
        calories: dayData.calories || 0,
        fiber: dayData.fiber || 0,
        phosphorus: dayData.phosphorus || 0,
        potassium: dayData.potassium || 0,
        protein: dayData.protein || 0,
        sodium: dayData.sodium || 0,
        meals: dayData.meals || []
      })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date, newest first
      
      setNutritionHistory(historyArray);
      console.log('📊 Loaded nutrition history for', historyArray.length, 'days');
    } catch (error) {
      Alert.alert('Error', 'Failed to load nutrition history');
      console.error('Failed to load nutrition history:', error);
    } finally {
      setIsLoadingMeals(false);
    }
  };

  // Show meals history modal
  const showMealsHistoryModal = () => {
    setShowMealHistory(true);
    loadMealsHistory();
  };

  // Hide meals history modal
  const hideMealsHistory = () => {
    setShowMealHistory(false);
  };

  // Handle meal deletion
  const handleDeleteMeal = async (mealId: string, mealName: string, mealTimestamp: Date) => {
    Alert.alert(
      'Delete Meal',
      `Are you sure you want to delete "${mealName}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Replace with actual API call
              const success = await deleteMeal(mealId, mealTimestamp);
              if (success) {
                // Reload meals history
                await loadMealsHistory();
                setShowMealHistory(false);
                Alert.alert('Success', 'Meal deleted successfully');
              } else {
                Alert.alert('Error', 'Failed to delete meal');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete meal. Please try again.');
              console.error('Delete meal error:', error);
            }
          }
        }
      ]
    );
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // TODO: Replace with actual food database API call
      const results = await searchFoods(searchQuery);
      setSearchResults(results);
    } catch (error) {
      Alert.alert('Error', 'Failed to search foods. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const selectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setShowFoodSelection(true);
    // Don't clear search results yet - let user see them
  };

  const goBackToSearch = () => {
    setSelectedFood(null);
    setShowFoodSelection(false);
    setQuantity('1');
  };

  const handleAddMeal = async () => {
    if (!selectedFood) {
      Alert.alert('Error', 'Please select a food item');
      return;
    }

    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    const mealEntry: MealEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate a simple unique id
      foodItem: selectedFood,
      quantity: Number(quantity),
      timestamp: new Date(),
      nutrients: {
        sodium: Math.round(selectedFood.nutrients.sodium * Number(quantity)),
        potassium: Math.round(selectedFood.nutrients.potassium * Number(quantity)),
        phosphorus: Math.round(selectedFood.nutrients.phosphorus * Number(quantity)),
        protein: Math.round(selectedFood.nutrients.protein * Number(quantity)),
        calories: Math.round(selectedFood.nutrients.calories * Number(quantity)),
        fiber: Math.round(selectedFood.nutrients.fiber * Number(quantity)),
        fat: Math.round(selectedFood.nutrients.fat * Number(quantity)),
        suger: Math.round(selectedFood.nutrients.suger * Number(quantity)),

      },
      mealType,
    };

    try {
      // TODO: Replace with actual API call
      const result = await logMeal(mealEntry);

      if (result == true) {
        Alert.alert('Success', 'Meal logged successfully!');

        // Refresh meal history if modal is open
        if (showMealHistory) {
          await loadMealsHistory();
        }

        setSelectedFood(null);
        setShowFoodSelection(false);
        setQuantity('1');
        setSearchQuery('');
        setSearchResults([]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to log meal. Please try again.');
    }
  };

  const calculateNutrients = () => {
    if (!selectedFood) return null;
    
    const qty = Number(quantity) || 1;
    return {
      sodium: Math.round(selectedFood.nutrients.sodium * qty),
      potassium: Math.round(selectedFood.nutrients.potassium * qty),
      phosphorus: Math.round(selectedFood.nutrients.phosphorus * qty),
      protein: Math.round(selectedFood.nutrients.protein * qty),
      calories: Math.round(selectedFood.nutrients.calories * qty),
      fiber: Math.round(selectedFood.nutrients.fiber * qty),
      fat: Math.round(selectedFood.nutrients.fat * qty),
      suger: Math.round(selectedFood.nutrients.suger * qty),
      
    };
  };

  React.useEffect(() => {
    if (searchQuery.length > 2) {
      const debounceTimer = setTimeout(handleSearch, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const renderFoodItem = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity style={styles.foodItem} onPress={() => selectFood(item)}>
      <View>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodCategory}>{item.category} • {item.servingSize}</Text>
        <View style={styles.foodNutrients}>
          <Text style={styles.nutrientText}>Na: {item.nutrients.sodium}mg</Text>
          <Text style={styles.nutrientText}>K: {item.nutrients.potassium}mg</Text>
          <Text style={styles.nutrientText}>P: {item.nutrients.phosphorus}mg</Text>
          <Text style={styles.nutrientText}>F: {item.nutrients.fiber}mg</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6b7280" />
    </TouchableOpacity>
  );

  const renderMealHistoryItem = ({ item }: { item: MealEntry }) => {
    const mealTypeColor = mealTypes.find(type => type.key === item.mealType)?.color || '#6b7280';
    
    // Handle different timestamp formats (Date, string, or Firestore Timestamp)
    let timeString = 'Unknown time';
    try {
      const timestamp = item.timestamp;
      let date: Date;
      
      if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      } else if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
        // Firestore Timestamp object
        date = (timestamp as any).toDate();
      } else if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
        // Firestore Timestamp-like object
        date = new Date((timestamp as any).seconds * 1000);
      } else {
        date = new Date(); // Fallback to current time
      }
      
      timeString = date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      timeString = 'Invalid time';
    }

    return (
      <View style={styles.mealHistoryItem}>
        <View style={styles.mealHistoryContent}>
          <View style={styles.mealHistoryHeader}>
            <View style={[styles.mealTypeBadge, { backgroundColor: mealTypeColor }]}>
              <Text style={styles.mealTypeBadgeText}>{item.mealType}</Text>
            </View>
            <Text style={styles.mealTimeText}>{timeString}</Text>
          </View>
          
          <Text style={styles.mealHistoryName}>{item.foodItem.name}</Text>
          <Text style={styles.mealHistoryQuantity}>
            Quantity: {item.quantity} {item.foodItem.servingSize}
          </Text>
          
          <View style={styles.mealHistoryNutrients}>
            <Text style={styles.mealNutrientText}>
              {Math.round(item.nutrients.calories)} cal
            </Text>
            <Text style={styles.mealNutrientText}>
              Na: {Math.round(item.nutrients.sodium)}mg
            </Text>
            <Text style={styles.mealNutrientText}>
              K: {Math.round(item.nutrients.potassium)}mg
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteMeal(item.id, item.foodItem.name, item.timestamp)}
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderNutritionHistoryItem = ({ item }: { item: any }) => (
    <View style={styles.nutritionHistoryItem}>
      <View style={styles.nutritionHistoryHeader}>
        <Text style={styles.nutritionHistoryDate}>
          {new Date(item.date).toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </Text>
        <View style={styles.nutritionHistoryBadge}>
          <Text style={styles.nutritionHistoryBadgeText}>
            {item.meals.length} meal{item.meals.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>
      
      <View style={styles.nutritionHistoryNutrients}>
        <View style={styles.nutrientRow}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{Math.round(item.calories)}</Text>
            <Text style={styles.nutritionLabel}>Calories</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{Math.round(item.protein)}g</Text>
            <Text style={styles.nutritionLabel}>Protein</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{Math.round(item.fiber)}g</Text>
            <Text style={styles.nutritionLabel}>Fiber</Text>
          </View>
        </View>
        
        <View style={styles.nutrientRow}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{Math.round(item.sodium)}mg</Text>
            <Text style={styles.nutritionLabel}>Sodium</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{Math.round(item.potassium)}mg</Text>
            <Text style={styles.nutritionLabel}>Potassium</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{Math.round(item.phosphorus)}mg</Text>
            <Text style={styles.nutritionLabel}>Phosphorus</Text>
          </View>
        </View>
      </View>

      {/* Meals for that day using existing renderMealHistoryItem */}
      {item.meals.length > 0 && (
        <View style={styles.dayMealsList}>
          <Text style={styles.mealsListTitle}>Meals for this day:</Text>
          <FlatList
            data={item.meals}
            renderItem={renderMealHistoryItem}
            keyExtractor={(meal) => meal.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );

  // Helper function to get meal type color
  const getMealTypeColor = (mealType: string) => {
    const type = mealTypes.find(t => t.key === mealType);
    return type ? type.color : '#6b7280';
  };

  

  return (
    <SafeAreaView style={styles.container}>
      {!showFoodSelection ? (
        // Search Mode
        <View style={styles.searchMode}>
          {/* Search Section - Fixed at top */}
          <View style={styles.searchSection}>
            <View style={styles.searchHeader}>
              <Text style={styles.sectionTitle}>Search Foods</Text>
              <TouchableOpacity 
                style={styles.historyButton} 
                onPress={showMealsHistoryModal}
              >
                <Ionicons name="time-outline" size={24} color="#0ea5e9" />
                <Text style={styles.historyButtonText}>History</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search for foods (e.g., chicken, rice, apple)"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Ionicons 
                  name={isSearching ? "hourglass-outline" : "search"} 
                  size={20} 
                  color="white" 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Search Results - Uses FlatList instead of nested in ScrollView */}
          {isSearching && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Searching foods...</Text>
            </View>
          )}
          
          {searchResults.length > 0 && !isSearching && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsHeader}>
                Found {searchResults.length} foods
              </Text>
              <FlatList
                data={searchResults}
                renderItem={renderFoodItem}
                keyExtractor={(item) => item.id}
                style={styles.searchResults}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.resultsContentContainer}
              />
            </View>
          )}
          
          {searchResults.length === 0 && searchQuery.length > 0 && !isSearching && (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search-outline" size={48} color="#9ca3af" />
              <Text style={styles.noResultsText}>No foods found for "{searchQuery}"</Text>
              <Text style={styles.noResultsSubtext}>Try a different search term</Text>
            </View>
          )}
        </View>
      ) : (
        // Food Selection Mode
        <View style={styles.selectionMode}>
          {/* Header with Back Button */}
          <View style={styles.selectionHeader}>
            <TouchableOpacity style={styles.backButton} onPress={goBackToSearch}>
              <Ionicons name="arrow-back" size={24} color="#0ea5e9" />
              <Text style={styles.backButtonText}>Back to Search</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* Selected Food Card */}
            {selectedFood && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Selected Food</Text>
                <View style={styles.selectedFoodCard}>
                  <Text style={styles.selectedFoodName}>{selectedFood.name}</Text>
                  <Text style={styles.selectedFoodServing}>{selectedFood.servingSize}</Text>
                  
                  {/* Quantity Input */}
                  <View style={styles.quantityContainer}>
                    <Text style={styles.quantityLabel}>Quantity:</Text>
                    <TextInput
                      style={styles.quantityInput}
                      value={quantity}
                      onChangeText={setQuantity}
                      keyboardType="numeric"
                      placeholder="1"
                    />
                  </View>

                  {/* Nutrient Preview */}
                  {calculateNutrients() && (
                    <View style={styles.nutrientPreview}>
                      <Text style={styles.previewTitle}>Nutrition for this serving:</Text>
                      <View style={styles.nutrientGrid}>
                        {Object.entries(calculateNutrients()!).map(([key, value]) => (
                          <View key={key} style={styles.nutrientItem}>
                            <Text style={styles.nutrientValue}>{value}</Text>
                            <Text style={styles.nutrientKey}>
                              {key === 'calories' ? 'kcal' : 
                               key === 'protein' ? 'g' : 'mg'}
                            </Text>
                            <Text style={styles.nutrientLabel}>{key}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Meal Type Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Meal Type</Text>
              <View style={styles.mealTypeContainer}>
                {mealTypes.map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    style={[
                      styles.mealTypeButton,
                      mealType === type.key && { backgroundColor: type.color },
                    ]}
                    onPress={() => setMealType(type.key)}
                  >
                    <Text
                      style={[
                        styles.mealTypeText,
                        mealType === type.key && styles.mealTypeTextSelected,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Add to Log Button */}
            <View style={styles.section}>
              <TouchableOpacity style={styles.addButton} onPress={handleAddMeal}>
                <Ionicons name="add-circle" size={24} color="white" />
                <Text style={styles.addButtonText}>Add to Food Log</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Meals History Modal */}
      <Modal
        visible={showMealHistory}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={hideMealsHistory}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nutrition History</Text>
            <TouchableOpacity style={styles.closeButton} onPress={hideMealsHistory}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {isLoadingMeals ? (
            <View style={styles.modalLoadingContainer}>
              <Text style={styles.modalLoadingText}>Loading meals...</Text>
            </View>
          ) : nutritionHistory.length === 0 ? (
            <View style={styles.emptyMealsContainer}>
              <Ionicons name="restaurant-outline" size={64} color="#9ca3af" />
              <Text style={styles.emptyMealsText}>No meals logged today</Text>
              <Text style={styles.emptyMealsSubtext}>Start by searching and adding foods</Text>
            </View>
          ) : (
            <FlatList
              data={nutritionHistory}
              renderItem={renderNutritionHistoryItem}
              keyExtractor={(item) => item.date}
              style={styles.mealsList}
              contentContainerStyle={styles.mealsListContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  searchMode: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  selectionMode: {
    flex: 1,
  },
  selectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0ea5e9',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  resultsContentContainer: {
    paddingBottom: 20,
  },
  resultsHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  searchResults: {
    flex: 1, // Remove maxHeight and use flex instead
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 12,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  foodItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  foodCategory: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  foodNutrients: {
    flexDirection: 'row',
    gap: 12,
  },
  nutrientText: {
    fontSize: 12,
    color: '#374151',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  selectedFoodCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedFoodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  selectedFoodServing: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginRight: 12,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
    width: 80,
    textAlign: 'center',
  },
  nutrientPreview: {
    marginTop: 16,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  nutrientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nutrientItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  nutrientValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  nutrientKey: {
    fontSize: 10,
    color: '#6b7280',
  },
  nutrientLabel: {
    fontSize: 12,
    color: '#374151',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  mealTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mealTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  mealTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  mealTypeTextSelected: {
    color: 'white',
  },
  addButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Meals History Styles
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  historyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0ea5e9',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  modalLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalLoadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  emptyMealsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyMealsText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyMealsSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  mealsList: {
    flex: 1,
  },
  mealsListContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  mealHistoryItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mealHistoryContent: {
    flex: 1,
    marginRight: 12,
  },
  mealHistoryHeader: {
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
  mealTypeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  mealTimeText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  mealHistoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  mealHistoryQuantity: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  mealHistoryNutrients: {
    flexDirection: 'row',
    gap: 12,
  },
  mealNutrientText: {
    fontSize: 12,
    color: '#374151',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  // Nutrition History Styles
  nutritionHistoryItem: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nutritionHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nutritionHistoryDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  nutritionHistoryBadge: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  nutritionHistoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  nutritionHistoryNutrients: {
    marginBottom: 16,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  nutritionItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  dayMealsList: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  mealsListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
});

export default MealLogScreen;
