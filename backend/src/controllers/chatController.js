const { getUsers } = require('../data/users');
const aiService = require('../services/aiService');

const chatWithAroha = async (req, res) => {
  try {
    const { userId, question } = req.body;

    if (!userId || !question) {
      return res.status(400).json({ error: "Both userId and question are required." });
    }

    const users = await getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const answer = await aiService.askAroha(question, user);

    res.status(200).json({ answer });
  } catch (error) {
    console.error("Chat Controller Error:", error);
    res.status(500).json({ error: "Internal server error while communicating with Aroha." });
  }
};

module.exports = {
  chatWithAroha
};