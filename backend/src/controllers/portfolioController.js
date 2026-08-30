// src/controllers/portfolioController.js
//
// Portfolio Controller — exposes a user's completed quests as their
// "proof" of demonstrated skills. No AI involved, purely reads from
// the in-memory users array.

const users = require('../data/users');

/**
 * GET /api/portfolio/:userId
 * Returns a user's completedQuests as their portfolio/proof-of-skills.
 */
function getPortfolio(req, res) {
  const { userId } = req.params;

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: `User with id "${userId}" not found` });
  }

  return res.status(200).json({ portfolio: user.completedQuests || [] });
}

module.exports = { getPortfolio };
