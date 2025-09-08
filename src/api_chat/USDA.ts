import { Config } from "../config/environment";

const API_KEY = Config.USDA_API_KEY;

const BASE_URL = Config.USDA_BASE_URL;


interface USDANutrient {
    nutrientId: number;
    nutrientName: string;
    value: number;
}


interface USDAFoodItem {
    fdcId: number;
    description: string;
    brandOwner?: string;
    brandName?: string;
    servingSize?: string;
    servingSizeUnit?: string;
    householdServingFullText?: string;
    foodNutrients: USDANutrient[];
    foodCategory?: string;
    dataType?: string;
}

interface USDASearchResponse {
    totalHits: number;
    foods: USDAFoodItem[];
}



export async function searchFoods(query: string): Promise<import('../types').FoodItem[]> {
    try{
        if(!query.trim()){
            return [];
        }
        const searchParams = new URLSearchParams({
            api_key: API_KEY,
            query: query.trim(),
            pageNumber: '1',
            pageSize: '25',
            dataType: 'Branded'
        });


        searchParams.append('dataType', 'Foundation');
        searchParams.append('dataType', 'SR Legacy');

        const url = `${BASE_URL}/foods/search?${searchParams.toString()}`;

        console.log("Searching for foods with query:", query);

        const response = await fetch(url);
        const data: USDASearchResponse = await response.json();

        console.log("USDA search response hits:", data.totalHits);
        const foodItems = data.foods.map(usdaFood => {
            const nutrients = usdaFood.foodNutrients;
            const nutritionData = {
                calories: 0,
                protein: 0,
                sodium: 0,
                potassium: 0,
                phosphorus: 0,
                fiber: 0
            };
            nutrients.forEach(nutrient => {
                switch(nutrient.nutrientId){
                    case 1008: // Energy
                        nutritionData.calories = Math.round(nutrient.value || 0);
                        break;
                    case 1003: // Protein
                        nutritionData.protein = Math.round(nutrient.value || 0);
                        break;
                    case 1093: // Sodium
                        nutritionData.sodium = Math.round(nutrient.value || 0);
                        break;
                    case 1092: // Potassium
                        nutritionData.potassium = Math.round(nutrient.value || 0);
                        break;
                    case 1091: // Phosphorus
                        nutritionData.phosphorus = Math.round(nutrient.value || 0);
                        break;
                    case 1079: // Fiber
                        nutritionData.fiber = Math.round(nutrient.value || 0);
                        break;
                }
            });

            let servingInfo = '100g';
            if (usdaFood.householdServingFullText) {
                servingInfo = usdaFood.householdServingFullText;
            } else if (usdaFood.servingSize && usdaFood.servingSizeUnit) {
                servingInfo = `${usdaFood.servingSize}${usdaFood.servingSizeUnit}`;
            }

            return {
                id: usdaFood.fdcId.toString(),
                name: usdaFood.description,
                category: usdaFood.foodCategory || 'Unknown',
                servingSize: servingInfo,
                nutrients: nutritionData
            };
        });
        return foodItems;

    } catch (error) {
        console.error("Error searching USDA foods:", error);
        return [];
    }
}