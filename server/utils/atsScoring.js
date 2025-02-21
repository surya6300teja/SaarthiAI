class ATSScorer {
  static calculateScore(resume, jobDescription) {
    const scores = {
      keywordMatch: this.calculateKeywordMatch(resume, jobDescription),
      formatScore: this.evaluateFormat(resume),
      experienceMatch: this.evaluateExperienceMatch(resume, jobDescription),
      skillsMatch: this.evaluateSkillsMatch(resume, jobDescription)
    };

    return {
      totalScore: this.calculateTotalScore(scores),
      breakdown: scores,
      suggestions: this.generateSuggestions(scores, resume, jobDescription)
    };
  }

  static calculateKeywordMatch(resume, jobDescription) {
    const jobKeywords = this.extractKeywords(jobDescription.toLowerCase());
    const resumeContent = JSON.stringify(resume).toLowerCase();
    
    let matches = 0;
    jobKeywords.forEach(keyword => {
      if (resumeContent.includes(keyword)) matches++;
    });

    return (matches / jobKeywords.length) * 100;
  }

  static evaluateFormat(resume) {
    let score = 100;
    const penalties = {
      noEmail: 10,
      noPhone: 5,
      noLocation: 5,
      noSummary: 10,
      poorStructure: 15
    };

    // Check for basic contact information
    if (!resume.basics?.email) score -= penalties.noEmail;
    if (!resume.basics?.phone) score -= penalties.noPhone;
    if (!resume.basics?.location) score -= penalties.noLocation;
    if (!resume.basics?.summary) score -= penalties.noSummary;

    // Check structure
    if (!resume.workExperience?.length) score -= penalties.poorStructure;

    return Math.max(0, score);
  }

  static extractKeywords(text) {
    // Simple keyword extraction (could be enhanced with NLP)
    const commonWords = new Set(['and', 'the', 'or', 'in', 'at', 'to', 'for']);
    return text
      .split(/\W+/)
      .filter(word => word.length > 2 && !commonWords.has(word))
      .map(word => word.toLowerCase());
  }

  static calculateTotalScore(scores) {
    const weights = {
      keywordMatch: 0.4,
      formatScore: 0.2,
      experienceMatch: 0.2,
      skillsMatch: 0.2
    };

    return Object.entries(scores).reduce((total, [key, value]) => {
      return total + (value * weights[key]);
    }, 0);
  }

  static generateSuggestions(scores, resume, jobDescription) {
    const suggestions = [];

    if (scores.keywordMatch < 70) {
      suggestions.push({
        type: 'keyword',
        message: 'Consider adding more relevant keywords from the job description',
        priority: 'high'
      });
    }

    if (scores.formatScore < 80) {
      suggestions.push({
        type: 'format',
        message: 'Improve resume format by adding missing sections',
        priority: 'medium'
      });
    }

    return suggestions;
  }
}

module.exports = ATSScorer; 