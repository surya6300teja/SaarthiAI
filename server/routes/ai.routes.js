const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

router.post('/generate', auth, async (req, res) => {
  try {
    const { prompt, currentValue, field } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    console.log('Generating content for:', { field, prompt });

    // Create the full prompt with context
    const fullPrompt = `As a professional resume writer, ${prompt}${
      currentValue ? `\nCurrent content: ${currentValue}` : ''
    }. Provide a concise and professional response without any additional formatting or explanations.`;

    // Generate content using Gemini
    const result = await model.generateContent(fullPrompt);
    const generatedContent = result.response.text().trim();

    console.log('Generated content length:', generatedContent.length);

    res.json({
      success: true,
      content: generatedContent,
      suggestions: []
    });

  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate content',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Test route to verify AI service is working
router.get('/status', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      configured: !!process.env.GEMINI_API_KEY,
      message: process.env.GEMINI_API_KEY ? 'AI service is ready' : 'AI service is not configured'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error checking AI service status'
    });
  }
});

module.exports = router; 
