// src/controllers/userController.js
//
// STEP 3 — User Onboarding      (POST /api/users)
// STEP 4 — Skill-Gap Analysis   (via matchSkills)
// STEP 5 — Readiness Score      (matchedSkills / requiredSkills * 100)
//
// This controller ties together:
//   - src/data/careers.js      (career -> required skills)
//   - src/services/skillService.js (matchSkills — Dev 2's matching engine)
//   - src/data/users.js        (in-memory user storage)

const careers = require('../data/careers');
const { matchSkills } = require('../services/skillService');
const users = require('../data/users');

/**
 * Finds a career by title (case-insensitive, whitespace-tolerant).
 *
 * Supports BOTH shapes of careers.js so this doesn't break depending on
 * how Dev 1's Career API ends up structuring the data:
 *
 *   Array shape:  [ { title: "Frontend Developer", requiredSkills: [...] }, ... ]
 *   Object shape: { "Frontend Developer": [...skills] }
 *
 * Always returns the normalized shape { title, requiredSkills } (or undefined).
 */
function findCareerByTitle(targetRole) {
  if (typeof targetRole !== 'string' || targetRole.trim().length === 0) {
    return undefined;
  }
  const normalizedTarget = targetRole.trim().toLowerCase();

  if (Array.isArray(careers)) {
    return careers.find(
      (career) => career.title && career.title.trim().toLowerCase() === normalizedTarget
    );
  }

  // Object-map shape: { "Frontend Developer": [...skills] }
  const matchedKey = Object.keys(careers).find(
    (key) => key.trim().toLowerCase() === normalizedTarget
  );
  if (!matchedKey) return undefined;

  return { title: matchedKey, requiredSkills: careers[matchedKey] };
}

/**
 * Calculates readiness score as a whole-number percentage.
 * Guards against division by zero if a career somehow has 0 required skills.
 */
function calculateReadinessScore(matchedCount, requiredCount) {
  if (requiredCount === 0) return 0;
  return Math.round((matchedCount / requiredCount) * 100);
}

/**
 * POST /api/users
 * Body: { name: string, currentSkills: string[], targetRole: string }
 *
 * Onboards a new user: runs skill-gap analysis against their target career,
 * calculates a readiness score, and stores the resulting profile in-memory.
 */
function createUser(req, res) {
  const { name, currentSkills, targetRole } = req.body || {};

  // --- Basic validation ---
  if (typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'name is required and must be a non-empty string' });
  }
  if (typeof targetRole !== 'string' || targetRole.trim().length === 0) {
    return res.status(400).json({ error: 'targetRole is required and must be a non-empty string' });
  }
  if (!Array.isArray(currentSkills)) {
    return res.status(400).json({ error: 'currentSkills must be an array of strings' });
  }

  // --- Find the target career ---
  const career = findCareerByTitle(targetRole);
  if (!career) {
    return res.status(404).json({
      error: `Career "${targetRole}" not found`,
    });
  }

  // --- Skill-gap analysis (Step 4) ---
  let matchedSkills;
  let missingSkills;
  try {
    ({ matchedSkills, missingSkills } = matchSkills(currentSkills, career.requiredSkills));
  } catch (err) {
    // matchSkills throws TypeError on malformed input (e.g. empty strings, non-strings)
    return res.status(400).json({ error: `Invalid currentSkills: ${err.message}` });
  }

  // --- Readiness score (Step 5) ---
  const readinessScore = calculateReadinessScore(
    matchedSkills.length,
    career.requiredSkills.length
  );

  // --- Build and store the new user profile ---
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

  users.push(newUser);

  return res.status(201).json(newUser);
}

/**
 * GET /api/users/:id/dashboard
 *
 * Returns a single user's full profile (skills, gaps, readiness score, quests).
 */
function getUserDashboard(req, res) {
  const { id } = req.params;

  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: `User with id "${id}" not found` });
  }

  return res.status(200).json(user);
}

module.exports = { createUser, getUserDashboard };
