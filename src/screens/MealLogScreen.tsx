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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FoodItem, MealEntry } from '../types';
import { nutritionAPI, mockFoodItems } from '../utils/mockData';

const MealLogScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = React.useState<FoodItem | null>(null);
  const [quantity, setQuantity] = React.useState('1');
  const [mealType, setMealType] = React.useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [isSearching, setIsSearching] = React.useState(false);

  const mealTypes = [
    { key: 'breakfast' as const, label: 'Breakfast', color: '#f59e0b' },
    { key: 'lunch' as const, label: 'Lunch', color: '#0ea5e9' },
    { key: 'dinner' as const, label: 'Dinner', color: '#8b5cf6' },
    { key: 'snack' as const, label: 'Snack', color: '#22c55e' },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // TODO: Replace with actual food database API call
      const results = await nutritionAPI.searchFoods(searchQuery);
      setSearchResults(results);
    } catch (error) {
      Alert.alert('Error', 'Failed to search foods. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const selectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setSearchResults([]);
    setSearchQuery('');
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

    const mealEntry: Omit<MealEntry, 'id'> = {
      foodItem: selectedFood,
      quantity: Number(quantity),
      timestamp: new Date(),
      mealType,
    };

    try {
      // TODO: Replace with actual API call
      const result = await nutritionAPI.logMeal(mealEntry);
      
      if (result.success) {
        Alert.alert('Success', 'Meal logged successfully!');
        setSelectedFood(null);
        setQuantity('1');
        setSearchQuery('');
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
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6b7280" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Search Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search Foods</Text>
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
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <FlatList
              data={searchResults}
              renderItem={renderFoodItem}
              keyExtractor={(item) => item.id}
              style={styles.searchResults}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* Selected Food Preview */}
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
        {selectedFood && (
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
        )}

        {/* Add to Log Button */}
        {selectedFood && (
          <View style={styles.section}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddMeal}>
              <Ionicons name="add-circle" size={24} color="white" />
              <Text style={styles.addButtonText}>Add to Food Log</Text>
            </TouchableOpacity>
          </View>
        )}
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
  searchResults: {
    maxHeight: 300,
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
});

export default MealLogScreen;
