const { GoogleGenerativeAI } = require('@google/generative-ai');

async function askGemini(prompt) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Check if API key exists
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error('GEMINI_API_KEY is not set or is using placeholder value. Please set a valid API key in your .env file.');
    }

    // Initialize the API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    if (!response || !response.text()) {
      throw new Error('Empty response from Gemini API');
    }

    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    
    // Provide more specific error messages
    if (error.message.includes('API_KEY')) {
      throw new Error('Invalid or missing Gemini API key. Please check your .env file.');
    } else if (error.message.includes('quota')) {
      throw new Error('Gemini API quota exceeded. Please check your usage limits.');
    } else if (error.message.includes('network')) {
      throw new Error('Network error connecting to Gemini API. Please check your internet connection.');
    } else {
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }
}

// MOCK RESPONSE for development when quota is exceeded
async function mockAskGemini() {
  return JSON.stringify([
    {
      question: "What is the largest planet in our solar system?",
      options: ["Mercury", "Earth", "Jupiter", "Mars"],
      answer: "Jupiter"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Saturn", "Neptune"],
      answer: "Mars"
    },
    {
      question: "What star is at the center of our solar system?",
      options: ["Alpha Centauri", "Betelgeuse", "The Sun", "Sirius"],
      answer: "The Sun"
    }
  ]);
}

module.exports = { askGemini, mockAskGemini };