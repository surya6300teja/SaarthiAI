const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const OpenAI = require('openai');

// Initialize OpenAI with error handling
let openai;
try {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('Warning: OPENAI_API_KEY not set. AI features will be disabled.');
  } else {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY.trim()
    });
  }
} catch (error) {
  console.error('Error initializing OpenAI:', error);
}

// Middleware to check if OpenAI is configured
const checkOpenAI = (req, res, next) => {
  if (!openai) {
    return res.status(503).json({
      success: false,
      error: 'AI service is not configured'
    });
  }
  next();
};

router.post('/generate', auth, checkOpenAI, async (req, res) => {
  try {
    const { prompt, currentValue, field } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    console.log('Generating content for:', { field, prompt });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer helping to create compelling resume content."
        },
        {
          role: "user",
          content: prompt + (currentValue ? `\nCurrent content: ${currentValue}` : '')
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const generatedContent = completion.choices[0].message.content.trim();
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
  res.json({
    success: true,
    configured: !!openai,
    message: openai ? 'AI service is ready' : 'AI service is not configured'
  });
});

module.exports = router; 