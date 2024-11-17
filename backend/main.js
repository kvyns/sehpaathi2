// // Quick test to verify keys are working
// const admin = require('./config/firebase');
// const { drive } = require('./config/googleDrive');

// async function testSetup() {
//   try {
//     // Test Firebase Admin
//     await admin.auth().listUsers(1);
//     console.log('Firebase Admin SDK working!');
    
//     // Test Google Drive
//     await drive.files.list({ pageSize: 1 });
//     console.log('Google Drive API working!');
//   } catch (error) {
//     console.error('Setup error:', error);
//   }
// }

// testSetup();

const Groq = require('groq-sdk');
require('dotenv').config();


async function testGroq() {
  const client = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  try {
    const response = await client.chat.completions.create({
      messages: [
        { role: 'system', content: 'Test system message' },
        { role: 'user', content: 'Test user message' }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 1024
    });
    // console.log('Response:', response);
  } catch (error) {
    console.error('Test Groq API error:', error);
  }
}

testGroq();
