import { FoodItem, MealEntry, LabValue, ChatMessage, DailyNutritionGoals, NutrientData } from '../types';

// TODO: Replace with actual API calls when backend is implemented

export const mockNutritionGoals: DailyNutritionGoals = {
  sodium: 2000,      // mg
  potassium: 2000,   // mg
  phosphorus: 800,   // mg
  protein: 60,       // g
  calories: 1800,    // kcal
  fluid: 1500,       // mL
};

export const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Grilled Chicken Breast (3 oz)',
    category: 'Protein',
    nutrients: {
      sodium: 65,
      potassium: 220,
      phosphorus: 196,
      protein: 26,
      calories: 140,
      fiber: 0,
    },
    servingSize: '3 oz (85g)',
  },
  {
    id: '2',
    name: 'White Rice (1/2 cup)',
    category: 'Grains',
    nutrients: {
      sodium: 1,
      potassium: 55,
      phosphorus: 43,
      protein: 2,
      calories: 103,
      fiber: 0.3,
    },
    servingSize: '1/2 cup cooked',
  },
  {
    id: '3',
    name: 'Green Beans (1/2 cup)',
    category: 'Vegetables',
    nutrients: {
      sodium: 3,
      potassium: 115,
      phosphorus: 19,
      protein: 1,
      calories: 17,
      fiber: 2,
    },
    servingSize: '1/2 cup',
  },
];

export const mockTodaysMeals: MealEntry[] = [
  {
    id: '1',
    foodItem: mockFoodItems[0],
    quantity: 1,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    mealType: 'lunch',
  },
  {
    id: '2',
    foodItem: mockFoodItems[1],
    quantity: 1,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    mealType: 'lunch',
  },
];

export const mockLabValues: LabValue[] = [
  {
    id: '1',
    type: 'eGFR',
    value: 45,
    unit: 'mL/min/1.73m²',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    normalRange: { min: 90, max: 120 },
  },
  {
    id: '2',
    type: 'creatinine',
    value: 1.8,
    unit: 'mg/dL',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    normalRange: { min: 0.7, max: 1.3 },
  },
  {
    id: '3',
    type: 'potassium',
    value: 4.2,
    unit: 'mEq/L',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    normalRange: { min: 3.5, max: 5.0 },
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    text: "What should I eat today?",
    isUser: true,
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
  },
  {
    id: '2',
    text: "Based on your CKD stage and recent lab values, I recommend a low-potassium meal like grilled chicken with white rice and green beans. This combination provides good protein while staying within your potassium limits.",
    isUser: false,
    timestamp: new Date(Date.now() - 9 * 60 * 1000), // 9 minutes ago
  },
];

// Calculate daily totals from meals
export const calculateDailyTotals = (meals: MealEntry[]): NutrientData => {
  return meals.reduce(
    (totals, meal) => {
      const nutrients = meal.foodItem.nutrients;
      const quantity = meal.quantity;
      
      return {
        sodium: totals.sodium + nutrients.sodium * quantity,
        potassium: totals.potassium + nutrients.potassium * quantity,
        phosphorus: totals.phosphorus + nutrients.phosphorus * quantity,
        protein: totals.protein + nutrients.protein * quantity,
        calories: totals.calories + nutrients.calories * quantity,
        fiber: totals.fiber + nutrients.fiber * quantity,
      };
    },
    {
      sodium: 0,
      potassium: 0,
      phosphorus: 0,
      protein: 0,
      calories: 0,
      fiber: 0,
    }
  );
};

// TODO: Replace with actual API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    // Mock login - replace with actual API call
    console.log('Mock login:', email, password);
    return { success: true, token: 'mock-token' };
  },
  
  signUp: async (email: string, password: string, name: string) => {
    // Mock sign up - replace with actual API call
    console.log('Mock sign up:', email, password, name);
    return { success: true, token: 'mock-token' };
  },
};

export const nutritionAPI = {
  searchFoods: async (query: string) => {
    // Mock food search - replace with actual nutrition API
    console.log('Mock food search:', query);
    return mockFoodItems.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  },
  
  logMeal: async (meal: Omit<MealEntry, 'id'>) => {
    // Mock meal logging - replace with actual API call
    console.log('Mock log meal:', meal);
    return { success: true, id: Date.now().toString() };
  },
};

export const labAPI = {
  saveLabValue: async (labValue: Omit<LabValue, 'id'>) => {
    // Mock lab value saving - replace with actual API call
    console.log('Mock save lab value:', labValue);
    return { success: true, id: Date.now().toString() };
  },
  
  getLabHistory: async (type: string) => {
    // Mock lab history - replace with actual API call
    console.log('Mock get lab history:', type);
    return mockLabValues.filter(lab => lab.type === type);
  },
};

export const aiAPI = {
  sendMessage: async (message: string) => {
    // Mock AI chat - replace with actual AI API call
    console.log('Mock AI message:', message);
    
    // Simple mock responses
    const responses = [
      "That's a great question! For CKD patients, portion control is key.",
      "I recommend consulting with your dietitian about your specific needs.",
      "Remember to monitor your potassium and phosphorus intake carefully.",
      "Staying hydrated within your fluid limits is important for kidney health.",
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return { response: randomResponse };
  },
};
