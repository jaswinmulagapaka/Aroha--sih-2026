// src/controllers/questController.js
//
// Quest Controller — wires together:
//   - src/data/users.js          (in-memory user storage)
//   - src/data/careers.js        (career -> required skills, for score recalculation)
//   - src/services/aiService.js  (generateRoadmap, generateQuests — built by teammate)
//
// NOTE: This file does NOT implement or mock aiService.js. It assumes
// generateRoadmap(missingSkills) and generateQuests(missingSkills) already
// exist and work as specified.

const users = require('../data/users');
const careers = require('../data/careers');
const { generateRoadmap, generateQuests } = require('../services/aiService');

/**
 * Finds a career by title (case-insensitive), supporting either shape of
 * careers.js: an array of { title, requiredSkills } objects, or an object
 * map of { "Title": [...skills] }.
 */
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

function normalizeSkill(skill) {
  return String(skill).trim().toLowerCase();
}

/**
 * Ensures user.analysis exists in the { matchedSkills, missingSkills, readinessScore }
 * shape, even if the user was created by a version of userController that stored
 * these fields flat on the user object instead. This keeps questController working
 * regardless of which shape your team's userController.js ends up using.
 */
function ensureAnalysisShape(user) {
  if (!user.analysis) {
    user.analysis = {
      matchedSkills: Array.isArray(user.matchedSkills) ? [...user.matchedSkills] : [],
      missingSkills: Array.isArray(user.missingSkills) ? [...user.missingSkills] : [],
      readinessScore: typeof user.readinessScore === 'number' ? user.readinessScore : 0,
    };
  }
  return user.analysis;
}

/**
 * GET /api/quests/roadmap/:userId
 * Returns the user's roadmap, generating it (via AI) on first request and
 * caching it on the user object for subsequent requests.
 */
async function getRoadmap(req, res) {
  const { userId } = req.params;
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: `User with id "${userId}" not found` });
  }

  if (user.roadmap) {
    return res.status(200).json(user.roadmap);
  }

  const analysis = ensureAnalysisShape(user);
  if (!Array.isArray(analysis.missingSkills) || analysis.missingSkills.length === 0) {
    return res.status(400).json({
      error: 'User has no missing skills to build a roadmap from (run skill-gap analysis first)',
    });
  }

  try {
    const roadmap = await generateRoadmap(analysis.missingSkills);
    user.roadmap = roadmap;
    return res.status(200).json(roadmap);
  } catch (err) {
    return res.status(500).json({ error: `Failed to generate roadmap: ${err.message}` });
  }
}

/**
 * GET /api/quests/:userId
 * Returns the user's quests, generating them (via AI) on first request and
 * caching them on the user object. Each generated quest gets a `completed: false`
 * flag added so completeQuest() has something to toggle later.
 */
async function getQuests(req, res) {
  const { userId } = req.params;
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: `User with id "${userId}" not found` });
  }

  if (user.quests) {
    return res.status(200).json(user.quests);
  }

  const analysis = ensureAnalysisShape(user);
  if (!Array.isArray(analysis.missingSkills) || analysis.missingSkills.length === 0) {
    return res.status(400).json({
      error: 'User has no missing skills to generate quests from (run skill-gap analysis first)',
    });
  }

  try {
    const generated = await generateQuests(analysis.missingSkills);
    user.quests = generated.map((quest) => ({ ...quest, completed: false }));
    return res.status(200).json(user.quests);
  } catch (err) {
    return res.status(500).json({ error: `Failed to generate quests: ${err.message}` });
  }
}

/**
 * POST /api/quests/complete
 * Body: { userId: string, questId: string }
 *
 * Marks a quest completed, moves it into user.completedQuests, updates the
 * user's matched/missing skills based on the quest's skillsCovered, and
 * recalculates the readiness score against the career's total required skills.
 */
function completeQuest(req, res) {
  const { userId, questId } = req.body || {};

  if (!userId || !questId) {
    return res.status(400).json({ error: 'userId and questId are required in the request body' });
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: `User with id "${userId}" not found` });
  }

  if (!Array.isArray(user.quests)) {
    return res.status(404).json({ error: 'This user has no quests yet — call GET /api/quests/:userId first' });
  }

  const quest = user.quests.find((q) => q.id === questId);
  if (!quest) {
    return res.status(404).json({ error: `Quest with id "${questId}" not found for this user` });
  }
  if (quest.completed) {
    return res.status(400).json({ error: 'This quest is already completed' });
  }

  // --- Mark completed and move it into completedQuests ---
  quest.completed = true;
  if (!Array.isArray(user.completedQuests)) {
    user.completedQuests = [];
  }
  user.completedQuests.push(quest);

  // --- Update matched/missing skills ---
  const analysis = ensureAnalysisShape(user);
  const matchedSet = new Set(analysis.matchedSkills.map(normalizeSkill));

  for (const skill of quest.skillsCovered || []) {
    const key = normalizeSkill(skill);
    if (!matchedSet.has(key)) {
      analysis.matchedSkills.push(skill);
      matchedSet.add(key);
    }
    analysis.missingSkills = analysis.missingSkills.filter((s) => normalizeSkill(s) !== key);
  }

  // --- Recalculate readiness score against the career's total required skills ---
  const career = findCareerByTitle(user.targetRole);
  const totalRequired =
    career && Array.isArray(career.requiredSkills)
      ? career.requiredSkills.length
      : analysis.matchedSkills.length + analysis.missingSkills.length; // fallback if career lookup fails

  const updatedScore =
    totalRequired > 0 ? Math.round((analysis.matchedSkills.length / totalRequired) * 100) : 0;

  analysis.readinessScore = updatedScore;
  // Keep flat mirrors in sync too, in case other code still reads
  // user.matchedSkills / user.missingSkills / user.readinessScore directly
  // instead of through user.analysis.
  user.matchedSkills = analysis.matchedSkills;
  user.missingSkills = analysis.missingSkills;
  user.readinessScore = updatedScore;

  return res.status(200).json({
    message: 'Quest marked as completed',
    updatedScore,
    completedQuest: quest,
  });
}

module.exports = { getRoadmap, getQuests, completeQuest };
