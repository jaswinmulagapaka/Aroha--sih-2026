// src/services/careerService.js
//
// Single source of truth for "look up a career by its title" — this used to
// be copy-pasted into userController.js AND questController.js, and both
// copies had the same bug (see below). Centralizing it means the bug only
// needs fixing once, and future controllers can just import this.

const careers = require('../data/careers');

/**
 * Looks up a career definition by its title (case/whitespace-insensitive).
 *
 * careers.js exports an object shaped like:
 *   { "Frontend Developer": { requiredSkills: [...] }, ... }
 *
 * BUG THAT USED TO EXIST HERE:
 *   `careers[matchedKey]` is the whole `{ requiredSkills: [...] }` object,
 *   not the array. Returning `{ title, requiredSkills: careers[matchedKey] }`
 *   silently set `requiredSkills` to an OBJECT instead of an ARRAY, which
 *   broke matchSkills() (and getUsers/getQuests' readiness math wherever
 *   they read career.requiredSkills). Fixed below by unwrapping
 *   `.requiredSkills` explicitly.
 *
 * @param {string} targetRole
 * @returns {{ title: string, requiredSkills: string[] }|undefined}
 */
function findCareerByTitle(targetRole) {
  if (typeof targetRole !== 'string' || targetRole.trim().length === 0) return undefined;
  const normalized = targetRole.trim().toLowerCase();

  if (Array.isArray(careers)) {
    // Defensive branch in case careers.js is ever changed to an array shape.
    return careers.find((c) => c.title && c.title.trim().toLowerCase() === normalized);
  }

  const matchedKey = Object.keys(careers).find((k) => k.trim().toLowerCase() === normalized);
  if (!matchedKey) return undefined;

  return { title: matchedKey, requiredSkills: careers[matchedKey].requiredSkills };
}

module.exports = { findCareerByTitle };
