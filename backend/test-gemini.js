require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key (first 10 chars):', apiKey ? apiKey.substring(0, 10) + '...' : 'NOT SET');
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.error('❌ GEMINI_API_KEY is not set or is using placeholder value');
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Try to list available models
    console.log('🔄 Checking available models...');
    try {
      const models = await genAI.listModels();
      console.log('✅ Available models:');
      models.forEach(model => {
        console.log(`   - ${model.name}`);
      });
    } catch (listError) {
      console.log('⚠️  Could not list models, trying common model names...');
    }

    // Try different model names
    const modelNames = ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.0-pro', 'gemini-pro-vision'];
    
    for (const modelName of modelNames) {
      try {
        console.log(`🔄 Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say "Hello World"');
        const response = await result.response;
        
        console.log(`✅ Model ${modelName} is working!`);
        console.log('Response:', response.text());
        
        // Update the .env file with the working model
        console.log(`💡 Update your gemini.js to use model: "${modelName}"`);
        return;
        
      } catch (error) {
        console.log(`❌ Model ${modelName} failed:`, error.message);
      }
    }
    
    console.error('❌ No working model found. Please check your API key and permissions.');
    
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    
    if (error.message.includes('API_KEY')) {
      console.error('💡 The API key appears to be invalid. Please check:');
      console.error('   1. The API key is correct');
      console.error('   2. The API key has the right permissions');
      console.error('   3. The API key is not expired');
    } else if (error.message.includes('quota')) {
      console.error('💡 API quota exceeded. Check your usage limits.');
    } else if (error.message.includes('network')) {
      console.error('💡 Network error. Check your internet connection.');
    } else {
      console.error('💡 Unknown error. Please check the Gemini API documentation.');
    }
  }
}

testGeminiAPI(); 