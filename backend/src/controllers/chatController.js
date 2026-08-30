const { getUsers } = require('../data/users');
const { askAroha } = require('../services/aiService');

const handleChat = async (req, res) => {
  try {
    const { userId, question } = req.body;

    if (!userId || !question) {
      return res.status(400).json({ error: "userId and question are required." });
    }

    const users = await getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const answer = await askAroha(question, user);

    res.status(200).json({ answer });
  } catch (error) {
    console.error("Error in handleChat controller:", error);
    res.status(500).json({ error: "Internal server error during chat." });
  }
};

module.exports = { handleChat };