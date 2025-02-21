import api from './api';

const generatePrompts = {
  'basics.summary': (context = {}) => `
    Generate a professional summary${context.title ? ` for a ${context.title} position` : ''}.
    Include key professional qualities and core competencies.
    Keep it concise and impactful, around 25-30 words.
    Focus on career highlights and value proposition.
  `,

  'experience.description': (context = {}) => `
    Generate a 25 words detailed but concise description${context.position ? ` for the role of ${context.position}` : ''}${context.company ? ` at ${context.company}` : ''}.
    Focus on:
    - Key responsibilities
    - Achievements and impact
    - Technologies or skills used
    - Quantifiable results where possible
    Use points and action verbs.
    
  `,

  'education.description': (context = {}) => `
    Generate a description${context.degree ? ` for ${context.degree}` : ''}${context.school ? ` at ${context.school}` : ''}.
    Include:
    - Relevant coursework
    - Academic achievements
    - Projects or research
    - Extra-curricular activities
    Keep it concise and relevant to career goals.
  `,

  'skills.suggestions': (context = {}) => `
    Generate a list of relevant technical and soft skills${context.title ? ` for a ${context.title} position` : ''}.
    Include:
    - Technical skills specific to the role
    - Industry-standard tools and technologies
    - Relevant soft skills
    Return as a comma-separated list only 10 skills.
  `,

  'projects.description': (context = {}) => `
    Generate a 25 words detailed but concise 20 words description${context.title ? ` for ${context.title}` : ''}${context.technologies ? ` using ${context.technologies}` : ''}.
  `,

  'achievements.description': (context = {}) => `
    Generate an achievement description${context.title ? ` at ${context.organization}` : ''}.
    Focus on:
    - Specific accomplishment
    - Impact and results
    - Metrics where applicable
    - Recognition received
    Keep it concise and results-focused.
    do not include any other text. or blank
  `
};

export const aiService = {
  // Resume optimization
  optimizeResume: async (resumeData, jobDescription) => {
    try {
      const response = await api.post('/ai/optimize-resume', {
        resume: resumeData,
        jobDescription
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Generate ATS-friendly keywords
  generateKeywords: async (jobDescription) => {
    try {
      const response = await api.post('/ai/generate-keywords', {
        jobDescription
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Calculate job match score
  calculateMatchScore: async (resumeId, jobId) => {
    try {
      const response = await api.post('/ai/match-score', {
        resumeId,
        jobId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get AI suggestions for resume improvement
  getResumeSuggestions: async (resumeData) => {
    try {
      const response = await api.post('/ai/resume-suggestions', {
        resume: resumeData
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  generateContent: async ({ field, context = {}, currentValue = '' }) => {
    try {
      if (!generatePrompts[field]) {
        throw new Error(`No prompt generator found for field: ${field}`);
      }

      const prompt = generatePrompts[field](context);
      
      const response = await api.post('/ai/generate', {
        prompt,
        currentValue,
        field
      });

      if (!response.data || !response.data.content) {
        throw new Error('Invalid response from AI service');
      }

      return {
        content: response.data.content,
        suggestions: response.data.suggestions || []
      };
    } catch (error) {
      console.error('Error in generateContent:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  },

  // Additional AI helper functions
  improveContent: async (content, type) => {
    try {
      const response = await fetch('/api/v1/ai/improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content,
          type
        })
      });

      const data = await response.json();
      return data.improvedContent;
    } catch (error) {
      console.error('Error improving content:', error);
      throw error;
    }
  },

  suggestKeywords: async (jobDescription) => {
    try {
      const response = await fetch('/api/v1/ai/keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          jobDescription
        })
      });

      const data = await response.json();
      return data.keywords;
    } catch (error) {
      console.error('Error generating keywords:', error);
      throw error;
    }
  },

  generateBulletPoints: async (description, role) => {
    try {
      const response = await fetch('/api/v1/ai/bullet-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          description,
          role,
          options: {
            useActionVerbs: true,
            includeMetrics: true,
            maxPoints: 4
          }
        })
      });

      const data = await response.json();
      return data.bulletPoints;
    } catch (error) {
      console.error('Error generating bullet points:', error);
      throw error;
    }
  },

  tailorToJob: async (resumeContent, jobDescription) => {
    try {
      const response = await fetch('/api/v1/ai/tailor-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          resumeContent,
          jobDescription
        })
      });

      const data = await response.json();
      return {
        tailoredContent: data.content,
        matchScore: data.matchScore,
        suggestions: data.suggestions
      };
    } catch (error) {
      console.error('Error tailoring resume:', error);
      throw error;
    }
  },

  generateAchievements: async (experience) => {
    try {
      const response = await fetch('/api/v1/ai/achievements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          role: experience.position,
          company: experience.company,
          description: experience.description
        })
      });

      const data = await response.json();
      return data.achievements;
    } catch (error) {
      console.error('Error generating achievements:', error);
      throw error;
    }
  },

  suggestSkillImprovements: async (skills, targetRole) => {
    try {
      const response = await fetch('/api/v1/ai/skill-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentSkills: skills,
          targetRole
        })
      });

      const data = await response.json();
      return {
        suggestedSkills: data.suggestedSkills,
        skillGaps: data.skillGaps,
        learningResources: data.learningResources
      };
    } catch (error) {
      console.error('Error suggesting skills:', error);
      throw error;
    }
  },

  analyzeResumeStrength: async (resumeData) => {
    try {
      const response = await fetch('/api/v1/ai/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          resumeData
        })
      });

      const data = await response.json();
      return {
        score: data.score,
        sectionScores: data.sectionScores,
        improvements: data.improvements,
        strengths: data.strengths,
        weaknesses: data.weaknesses
      };
    } catch (error) {
      console.error('Error analyzing resume:', error);
      throw error;
    }
  }
}; 