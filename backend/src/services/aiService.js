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

 backend-dev-2
// Function 4: Ask Aroha (chatbot mentor Q&A, grounded in the student's profile)
const askAroha = async (question, userProfile) => {
  try {
    // No responseMimeType here on purpose — this endpoint must return
    // plain conversational text, not JSON, unlike the functions above.
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const {
      readinessScore = 0,
      matchedSkills = [],
      missingSkills = []
    } = userProfile || {};

    const prompt = `
      Act as Aroha, a supportive and knowledgeable engineering mentor helping a student
      navigate their learning path. Be warm, direct, and encouraging — never generic.

      STUDENT PROFILE:
      - Readiness Score: ${readinessScore}/100
      - Skills already matched: ${matchedSkills.length ? matchedSkills.join(', ') : 'None recorded yet'}
      - Missing / gap skills: ${missingSkills.length ? missingSkills.join(', ') : 'None recorded'}

      STUDENT'S QUESTION:
      "${question}"

      INSTRUCTIONS:
      - Answer the student's question directly and specifically. Do not deflect or give a generic answer.
      - Explicitly reference their current skill gaps or progress (mention at least one matched skill or missing skill by name) to ground your advice in their real profile.
      - Keep your entire response under 4 sentences.
      - Respond in plain text only. Do NOT return JSON, markdown formatting, or bullet lists.
    `;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    return rawText.trim();
  } catch (error) {
    console.error("Error getting response from Aroha:", error);
    throw new Error("Failed to get a response from Aroha.");
  }
};

// Export all four functions

const askAroha = async (question, userProfile) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Act as a supportive engineering mentor named Aroha.
      Your student has asked the following question: "${question}"
      
      Here is their current profile context:
      - Readiness Score: ${userProfile.readinessScore || 0}%
      - Matched Skills: ${(userProfile.matchedSkills || []).join(', ') || 'None yet'}
      - Missing Skills: ${(userProfile.missingSkills || []).join(', ') || 'None yet'}
      
      Answer the question directly. Keep your response under 4 sentences. 
      You must explicitly reference their current skill gaps or progress in your answer based on the profile context provided.
      Return plain text only without markdown formatting.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Error in askAroha AI service:", error);
    throw new Error("Failed to generate mentor response.");
  }
};

 main
module.exports = {
  generateRoadmap,
  generateQuests,
  extractSkillsFromResume,
  askAroha
 backend-dev-2
};

};
 main
