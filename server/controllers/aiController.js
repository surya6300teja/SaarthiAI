const OpenAI = require('openai');
const Resume = require('../models/Resume');
const Job = require('../models/Job');
const ErrorResponse = require('../utils/errorHandler');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.optimizeResume = async (req, res, next) => {
  try {
    const { resume, jobDescription } = req.body;

    const prompt = `
      Analyze this resume and job description, and provide specific suggestions
      for improvement to increase the match rate. Focus on:
      1. Keywords and skills alignment
      2. Experience descriptions
      3. Achievement metrics
      4. Overall formatting

      Resume:
      ${JSON.stringify(resume)}

      Job Description:
      ${jobDescription}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are an expert ATS system and resume optimization assistant."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.7,
    });

    // Parse and structure the AI suggestions
    const suggestions = parseSuggestions(completion.choices[0].message.content);

    res.status(200).json({
      success: true,
      suggestions,
      matchScore: calculateMatchScore(resume, jobDescription)
    });
  } catch (error) {
    next(error);
  }
};

exports.generateKeywords = async (req, res, next) => {
  try {
    const { jobDescription } = req.body;

    const prompt = `
      Extract the most important keywords and skills from this job description
      that should be included in a resume. Focus on:
      1. Technical skills
      2. Soft skills
      3. Industry-specific terminology
      4. Required qualifications

      Job Description:
      ${jobDescription}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing job descriptions and identifying key requirements."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const keywords = parseKeywords(completion.choices[0].message.content);

    res.status(200).json({
      success: true,
      keywords
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions
const parseSuggestions = (aiResponse) => {
  // Implementation to parse and structure AI suggestions
  // This would depend on the expected format of the AI response
};

const calculateMatchScore = (resume, jobDescription) => {
  // Implementation to calculate match score based on keyword matching
  // and other relevant factors
};

const parseKeywords = (aiResponse) => {
  // Implementation to parse and structure keywords from AI response
};

module.exports = exports; 