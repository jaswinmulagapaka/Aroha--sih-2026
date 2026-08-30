// src/controllers/portfolioController.js
//
// UPDATED — required alongside the users.js change. This wasn't explicitly
// asked for, but users.js no longer exports a plain array (it now exports
// getUsers/saveUsers functions), so this file would crash on the old code
// (`users.find is not a function`) without this update.

const { getUsers } = require('../data/users');

/**
 * GET /api/portfolio/:userId
 */
async function getPortfolio(req, res) {
  const { userId } = req.params;

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

  return res.status(200).json({ portfolio: user.completedQuests || [] });
}

module.exports = { getPortfolio };
