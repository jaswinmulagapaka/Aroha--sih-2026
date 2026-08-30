// src/controllers/userController.js
//
// UPDATED to use the persistent JSON database instead of an in-memory array.
// Key change: instead of `users.push(newUser)`, we now:
//   1. await getUsers()      -> load the current array from disk
//   2. mutate it in memory   -> same as before
//   3. await saveUsers(...)  -> write the whole array back to disk

const careers = require('../data/careers');
const { matchSkills } = require('../services/skillService');
const { getUsers, saveUsers } = require('../data/users');

function findCareerByTitle(targetRole) {
  if (typeof targetRole !== 'string' || targetRole.trim().length === 0) return undefined;
  const normalized = targetRole.trim().toLowerCase();

  if (Array.isArray(careers)) {
    return careers.find((c) => c.title && c.title.trim().toLowerCase() === normalized);
  }

  const matchedKey = Object.keys(careers).find((k) => k.trim().toLowerCase() === normalized);
  if (!matchedKey) return undefined;
  return { title: matchedKey, requiredSkills: careers[matchedKey] };
}

function calculateReadinessScore(matchedCount, requiredCount) {
  if (requiredCount === 0) return 0;
  return Math.round((matchedCount / requiredCount) * 100);
}

/**
 * POST /api/users
 * Now async: loads users from disk, appends the new one, saves back to disk.
 */
async function createUser(req, res) {
  const { name, currentSkills, targetRole } = req.body || {};

  if (typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'name is required and must be a non-empty string' });
  }
  if (typeof targetRole !== 'string' || targetRole.trim().length === 0) {
    return res.status(400).json({ error: 'targetRole is required and must be a non-empty string' });
  }
  if (!Array.isArray(currentSkills)) {
    return res.status(400).json({ error: 'currentSkills must be an array of strings' });
  }

  const career = findCareerByTitle(targetRole);
  if (!career) {
    return res.status(404).json({ error: `Career "${targetRole}" not found` });
  }

  let matchedSkills;
  let missingSkills;
  try {
    ({ matchedSkills, missingSkills } = matchSkills(currentSkills, career.requiredSkills));
  } catch (err) {
    return res.status(400).json({ error: `Invalid currentSkills: ${err.message}` });
  }

  const readinessScore = calculateReadinessScore(matchedSkills.length, career.requiredSkills.length);

  const newUser = {
    id: Date.now().toString(),
    name: name.trim(),
    targetRole: career.title,
    currentSkills,
    matchedSkills,
    missingSkills,
    readinessScore,
    completedQuests: [],
    createdAt: new Date().toISOString(),
  };

  try {
    const users = await getUsers();       // 1. load current array from disk
    users.push(newUser);                   // 2. mutate in memory, same as before
    await saveUsers(users);                // 3. persist the whole array back to disk
  } catch (err) {
    return res.status(500).json({ error: `Failed to save user: ${err.message}` });
  }

  return res.status(201).json(newUser);
}

/**
 * GET /api/users/:id/dashboard
 * Now async: loads the full array from disk, then finds the user in memory.
 */
async function getUserDashboard(req, res) {
  const { id } = req.params;

  let users;
  try {
    users = await getUsers();
  } catch (err) {
    return res.status(500).json({ error: `Failed to read users: ${err.message}` });
  }

  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: `User with id "${id}" not found` });
  }

  return res.status(200).json(user);
}

module.exports = { createUser, getUserDashboard };
