const pdfParse = require('pdf-parse');
const aiService = require('../services/aiService');

const uploadResume = async (req, res) => {
  try {
    // Check if a file was actually uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded. Please upload a PDF resume." });
    }

    // pdf-parse natively accepts a file buffer to extract text
    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text;

    // Pass the extracted text to Gemini
    const skills = await aiService.extractSkillsFromResume(extractedText);

    // Return the successful JSON array
    res.status(200).json({ skills });
  } catch (error) {
    console.error("Error processing resume:", error);
    res.status(500).json({ error: "Internal server error while processing resume." });
  }
};

module.exports = {
  uploadResume
};