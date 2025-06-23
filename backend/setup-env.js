const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  const envContent = `# Environment Variables for Prashnn.ai Backend
# Replace these values with your actual credentials

# MongoDB Connection String
# For local MongoDB: mongodb://localhost:27017/prashnn_ai
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/prashnn_ai
MONGO_URI=mongodb://localhost:27017/prashnn_ai

# Google Gemini API Key
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port (optional, defaults to 5000)
PORT=5000
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📝 Please edit the .env file and add your actual MongoDB URI and Gemini API key.');
  console.log('🔑 Get your Gemini API key from: https://makersuite.google.com/app/apikey');
} else {
  console.log('ℹ️  .env file already exists.');
} 