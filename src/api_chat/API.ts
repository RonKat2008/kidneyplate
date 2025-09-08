import { Config } from "../config/environment";

const api_url = Config.API_URL;

interface UserContext {
  ckdStage: number | string;
  fluidLimit: number | null;
  dietaryPreferences: string[];
  egfrValue: number | null;
  doctorNotes: string;
}

interface DailyNutrition {
  calories: number;
  protein: number;
  sodium: number;
  potassium: number;
  phosphorus: number;
  fiber: number;
}

export const chatBot = async (message: string): Promise<string> => {
    try {
        const response = await fetch(`${api_url}chatbot`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
        });
    
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
    
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error in chatBot:', error);
        throw error;
    }
};

export const chatBotWithContext = async (
    message: string, 
    userContext: UserContext, 
    dailyNutrition: DailyNutrition
): Promise<string> => {
    try {
        const contextualMessage = {
            message,
            userContext: {
                ckdStage: userContext.ckdStage,
                fluidLimit: userContext.fluidLimit,
                dietaryPreferences: userContext.dietaryPreferences,
                egfrValue: userContext.egfrValue,
                doctorNotes: userContext.doctorNotes,
            },
            dailyNutrition: {
                calories: dailyNutrition.calories,
                protein: dailyNutrition.protein,
                sodium: dailyNutrition.sodium,
                potassium: dailyNutrition.potassium,
                phosphorus: dailyNutrition.phosphorus,
                fiber: dailyNutrition.fiber,
            },
            timestamp: new Date().toISOString(),
        };

        const response = await fetch(`${api_url}chatbot-context`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contextualMessage),
        });
    
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error in chatBotWithContext:', error);
        // Fallback to basic chatbot if context API fails
        return await chatBot(message);
    }
};