// src/controllers/chatController.js
//
// Matches the conventions used across careerController / questController /
// userController: getUsers() is async and returns the full array from
// database.json; users are looked up by `u.id`.

const { getUsers } = require('../data/users');
const { askAroha } = require('../services/aiService');

/**
 * POST /api/chat
 * Body: { userId: string, question: string }
 * Response: { answer: string }
 */
async function handleChat(req, res) {
  const { userId, question } = req.body || {};

  if (typeof userId !== 'string' || userId.trim().length === 0) {
    return res.status(400).json({ error: 'userId is required and must be a non-empty string' });
  }
  if (typeof question !== 'string' || question.trim().length === 0) {
    return res.status(400).json({ error: 'question is required and must be a non-empty string' });
  }

  let users;
  try {
    users = await getUsers();
  } catch (err) {
    return res.status(500).json({ error: `Failed to read users: ${err.message}` });
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: `User with id "${userId}" not found` });
  }

  try {
    const answer = await askAroha(question, user);
    return res.status(200).json({ answer });
  } catch (err) {
    return res.status(500).json({ error: `Failed to get a response from Aroha: ${err.message}` });
  }
}

module.exports = { handleChat };
