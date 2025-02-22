const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/auth');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

  
  // Route for file upload
  router.post('/upload-pdf', upload.single('pdfFile'), async (req, res) => {
    console.log("hit");
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded or the file format is incorrect. Please upload a PDF.'
      });
    }
    try {
      const pdfFilePath = req.file.path;
      const dataBuffer = fs.readFileSync(pdfFilePath);
      
      // Parse the PDF
      const data = await pdfParse(dataBuffer);
      const extractedText = data.text;
  
      // Delete the uploaded file after processing
      fs.unlinkSync(pdfFilePath);
  
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('API key is missing.');
      }
  
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
      // Define the prompt
      const prompt = `Take the provided resume data, identify the most relevant job title, and generate a job description based on that title. Compare the skills and experience in the resume against the generated job description. Return the comparison result as a JSON object with three key parameters: recommended_skills (a list of market-trending skills that would significantly improve the candidate's score, with each skill accompanied by an estimated score increase if the user learns it), score (an overall percentage score reflecting how well the resume matches the job description), and total_possible_score (the estimated score if all recommended skills are learned).
      The output should not include any explanation or job description, only the recommended_skills, score, and total_possible_score in JSON format. Resume Data: ${extractedText}`;
  
      // Send request to Gemini API
      const airesult = await model.generateContent(prompt);
      
      // Clean the response text by removing unwanted characters like backticks and markdown
      let responseText = airesult.response.text();
      
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim(); // Remove markdown and extra backticks
      
      // Parse the cleaned response as JSON
      const responseJson = JSON.parse(responseText);
      
      // Extract the score and recommended_skills from the response
      const { recommended_skills, score, total_possible_score } = responseJson;
  
      // Send the score and recommended_skills as a response
      return res.status(200).json({
        recommended_skills,
        score,
        total_possible_score
      });
    } catch (error) {
      console.error('Error processing the file:', error);
      return res.status(500).json({
        message: 'Error processing the file.',
        error: error.message
      });
    }
  });
  

// Analyze Resume
router.post('/analyze-resume', upload.single('pdfFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded or the file format is incorrect. Please upload a PDF.'
      });
    }

    const pdfFilePath = req.file.path;
    const dataBuffer = fs.readFileSync(pdfFilePath);
    
    // Parse the PDF
    pdfParse(dataBuffer).then(async (data) => {
      const extractedText = data.text;

      // Delete the uploaded file after processing
      fs.unlinkSync(pdfFilePath);

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('API key is missing.');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Take the provided resume data, identify the most relevant job title, and generate a job description based on that title. Compare the skills and experience in the resume against the generated job description. Return the comparison result as a JSON object with three key parameters: recommended_skills (a list of market-trending skills that would significantly improve the candidate's score, with each skill accompanied by an estimated score increase if the user learns it), score (an overall percentage score reflecting how well the resume matches the job description), and total_possible_score (the estimated score if all recommended skills are learned). Resume Data: ${extractedText}`;

      const airesult = await model.generateContent(prompt);
      let responseText = airesult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      const responseJson = JSON.parse(responseText);

      res.status(200).json({
        success: true,
        ...responseJson
      });
    }).catch(error => {
      console.error('Error processing the file:', error);
      res.status(500).json({
        success: false,
        error: 'Error processing the file.',
        details: error.message
      });
    });

  } catch (error) {
    console.error('Error processing the file:', error);
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(500).json({
      success: false,
      error: 'Error processing the file.',
      details: error.message
    });
  }
});

// Get Course Recommendations
router.post('/courses', async (req, res) => {
    console.log("hit fc");
    try {
      const receivedList = req.body.list;
      console.log('Received List:', receivedList);
  
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('API key is missing.');
      }
  
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
      // Define the prompt
      const prompt = `Given the following list of skills, provide a JSON object containing a list of relevant courses for each skill along with their links. Each entry should include the course name, provider, and URL. Ensure that all links are verified and working. Do not include any additional explanations or information. List of skills: ${receivedList}`;
  
      // Send request to Gemini API
      const coursesresult = await model.generateContent(prompt);
      
      // Clean the response text by removing unwanted characters like backticks and markdown
      let responseCourses = coursesresult.response.text();
      
      responseCourses = responseCourses.replace(/```json/g, '').replace(/```/g, '').trim(); // Remove markdown and extra backticks
      
      // Parse the cleaned response as JSON
      const responseCoursesJson = JSON.parse(responseCourses);
      console.log(responseCoursesJson);
  
      res.status(200).json({ Courses: responseCoursesJson });
    } catch (error) {
      console.error('Error processing the request:', error);
      return res.status(500).json({
        message: 'Error processing the request.',
        error: error.message
      });
    }
});

module.exports = router; 