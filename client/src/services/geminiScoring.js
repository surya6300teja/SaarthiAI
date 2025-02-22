import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI('AIzaSyCSCOvg-HI0goallfKXIHhuR6asZ_kjeBw');

const SCORING_PROMPT = `
You are an expert AI recruiter. Analyze the candidate's profile and job requirements, then provide a detailed scoring analysis.
Return only a JSON object with the following structure:
{
  "educationScore": number,
  "experienceScore": number,
  "skillsScore": number,
  "projectScore": number,
  "overallMatch": number,
  "keyStrengths": string[],
  "areasForImprovement": string[],
  "recommendation": string
}
`;

export const scoreCandidate = async (candidate, jobRequirements) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using more stable model

    const prompt = `
${SCORING_PROMPT}

Job Requirements:
${JSON.stringify(jobRequirements, null, 2)}

Candidate Profile:
${JSON.stringify(candidate, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response text to ensure valid JSON
    const jsonStr = text.replace(/```json\n|\n```/g, '').trim();
    
    try {
      const scoring = JSON.parse(jsonStr);
      return {
        ...scoring,
        // Ensure all required fields exist with default values
        educationScore: scoring.educationScore || 0,
        experienceScore: scoring.experienceScore || 0,
        skillsScore: scoring.skillsScore || 0,
        projectScore: scoring.projectScore || 0,
        overallMatch: scoring.overallMatch || 0,
        keyStrengths: scoring.keyStrengths || [],
        areasForImprovement: scoring.areasForImprovement || [],
        recommendation: scoring.recommendation || 'No recommendation available'
      };
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return generateFallbackScoring(candidate, jobRequirements);
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    return generateFallbackScoring(candidate, jobRequirements);
  }
};

// Fallback scoring function when API fails
const generateFallbackScoring = (candidate, jobRequirements) => {
  // Simple scoring based on skills match
  const skillsMatch = candidate.skills?.filter(skill => 
    jobRequirements.skills.includes(skill)
  ).length || 0;
  
  const skillsScore = (skillsMatch / jobRequirements.skills.length) * 100;
  
  return {
    educationScore: 70,
    experienceScore: 75,
    skillsScore: Math.round(skillsScore),
    projectScore: 65,
    overallMatch: Math.round((70 + 75 + skillsScore + 65) / 4),
    keyStrengths: candidate.skills?.slice(0, 3) || [],
    areasForImprovement: ['Unable to perform detailed analysis'],
    recommendation: 'Basic match based on skills overlap'
  };
};

export const rankCandidates = async (candidates, jobRequirements) => {
  try {
    // Process candidates in smaller batches to avoid rate limits
    const batchSize = 3;
    const rankedCandidates = [];
    
    for (let i = 0; i < candidates.length; i += batchSize) {
      const batch = candidates.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (candidate) => {
          const scoring = await scoreCandidate(candidate, jobRequirements);
          return {
            ...candidate,
            aiScoring: scoring
          };
        })
      );
      rankedCandidates.push(...batchResults);
      
      // Add delay between batches
      if (i + batchSize < candidates.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return rankedCandidates.sort((a, b) => 
      b.aiScoring.overallMatch - a.aiScoring.overallMatch
    );
  } catch (error) {
    console.error('Ranking Error:', error);
    // Return candidates with fallback scoring
    return candidates.map(candidate => ({
      ...candidate,
      aiScoring: generateFallbackScoring(candidate, jobRequirements)
    }));
  }
}; 