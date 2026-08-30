const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to strip markdown code blocks
const cleanJsonResponse = (text) => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\n?/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\n?/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\n?```$/, '');
  }
  return cleaned.trim();
};

// Function 1: Generate Roadmap
const generateRoadmap = async (missingSkills) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Act as a senior engineering mentor. Your student needs to learn these specific skills: ${missingSkills.join(', ')}.
      
      Create a sequential learning roadmap.
      
      You must return ONLY a raw JSON array containing exactly 5 objects. Do not include markdown formatting, backticks, or conversational text.
      Each object must strictly adhere to this schema:
      {
        "stepNumber": 1,
        "title": "A concise step title",
        "description": "Exactly one sentence explaining what to focus on in this step."
      }
    `;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const cleanText = cleanJsonResponse(rawText);
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error generating roadmap with Gemini:", error);
    throw new Error("Failed to generate AI roadmap.");
  }
};

// Function 2: Generate Quests
const generateQuests = async (missingSkills) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Act as an expert engineering mentor. Your student needs to learn these missing skills: ${missingSkills.join(', ')}.
      
      Generate exactly 3 project-based quests to help them master these specific skills.
      
      You must return ONLY a raw JSON array containing exactly 3 objects. Do not include markdown formatting, backticks, or conversational text.
      Each object must strictly adhere to this schema:
      {
        "id": "A unique string (e.g., quest-123)",
        "title": "A concise, action-oriented title",
        "objective": "1-2 sentences describing exactly what the student will build.",
        "skillsCovered": ["Skill A", "Skill B"],
        "difficulty": "Beginner or Intermediate",
        "estimatedHours": 5
      }
    `;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const cleanText = cleanJsonResponse(rawText);
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error generating quests with Gemini:", error);
    throw new Error("Failed to generate AI quests.");
  }
};

// Function 3: Extract Skills from Resume
const extractSkillsFromResume = async (pdfText) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Extract the technical skills (e.g., C, Python, React, Git, Data Analysis) from the following resume text.
      
      You must return ONLY a raw JSON array containing strings of the extracted skills. Do not include markdown formatting, backticks, or conversational text.
      Example format: ["C", "Python", "React", "Git"]
      
      Resume Text:
      ${pdfText}
    `;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const cleanText = cleanJsonResponse(rawText);
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error extracting skills with Gemini:", error);
    throw new Error("Failed to extract skills from resume.");
  }
};

// Export all three functions
module.exports = {
  generateRoadmap,
  generateQuests,
  extractSkillsFromResume
};