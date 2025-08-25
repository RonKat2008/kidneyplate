const api_url = "http://192.168.1.71:8000/";

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