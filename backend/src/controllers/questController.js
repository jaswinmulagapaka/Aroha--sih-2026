// src/controllers/questController.js
//
// UPDATED to use the persistent JSON database. Every function that used to
// mutate the shared in-memory `users` array now:
//   1. await getUsers()      -> load fresh from disk
//   2. find + mutate the user in memory (same logic as before)
//   3. await saveUsers(users) -> write the change back to disk
//
// This file does NOT implement or mock aiService.js.

const { getUsers, saveUsers } = require('../data/users');
const careers = require('../data/careers');
const { generateRoadmap, generateQuests } = require('../services/aiService');

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
 */
async function getRoadmap(req, res) {
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
    await saveUsers(users); // persist the newly generated roadmap
    return res.status(200).json(roadmap);
  } catch (err) {
    return res.status(500).json({ error: `Failed to generate roadmap: ${err.message}` });
  }
}

/**
 * GET /api/quests/:userId
 */
async function getQuests(req, res) {
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
    await saveUsers(users); // persist the newly generated quests
    return res.status(200).json(user.quests);
  } catch (err) {
    return res.status(500).json({ error: `Failed to generate quests: ${err.message}` });
  }
}

/**
 * POST /api/quests/complete
 * Body: { userId, questId }
 */
async function completeQuest(req, res) {
  const { userId, questId } = req.body || {};

  if (!userId || !questId) {
    return res.status(400).json({ error: 'userId and questId are required in the request body' });
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

  quest.completed = true;
  if (!Array.isArray(user.completedQuests)) {
    user.completedQuests = [];
  }
  user.completedQuests.push(quest);

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

  const career = findCareerByTitle(user.targetRole);
  const totalRequired =
    career && Array.isArray(career.requiredSkills)
      ? career.requiredSkills.length
      : analysis.matchedSkills.length + analysis.missingSkills.length;

  const updatedScore =
    totalRequired > 0 ? Math.round((analysis.matchedSkills.length / totalRequired) * 100) : 0;

  analysis.readinessScore = updatedScore;
  user.matchedSkills = analysis.matchedSkills;
  user.missingSkills = analysis.missingSkills;
  user.readinessScore = updatedScore;

  try {
    await saveUsers(users); // persist the completion + updated skills/score
  } catch (err) {
    return res.status(500).json({ error: `Failed to save quest completion: ${err.message}` });
  }

  return res.status(200).json({
    message: 'Quest marked as completed',
    updatedScore,
    completedQuest: quest,
  });
}

module.exports = { getRoadmap, getQuests, completeQuest };
