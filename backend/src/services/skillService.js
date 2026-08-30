// src/services/skillService.js
//
// STEP 2B — Skill Matching Engine
//
// Purpose:
//   Compare a student's current skills against a career's required skills,
//   and split the required skills into "matchedSkills" and "missingSkills".
//
// This is intentionally pure, deterministic, dependency-free logic.
// No AI, no database, no network calls — just a reusable function.
//
// Later, readiness score will be calculated elsewhere as:
//   (matchedSkills.length / requiredSkills.length) * 100
// That is NOT implemented here on purpose.

/**
 * Cleans up a single skill string so it can be compared reliably:
 * - trims leading/trailing whitespace
 * - lowercases it
 *
 * "  HTML  " -> "html"
 * "JavaScript" -> "javascript"
 */
function normalizeSkill(skill) {
  return String(skill).trim().toLowerCase();
}

/**
 * Validates that a value is an array of non-empty strings.
 * Throws a descriptive error if not — we want loud, clear failures here,
 * not silently-wrong output.
 *
 * @param {*} value
 * @param {string} fieldName - used in the error message (e.g. "studentSkills")
 */
function validateSkillArray(value, fieldName) {
  if (!Array.isArray(value)) {
    throw new TypeError(`${fieldName} must be an array (got ${typeof value})`);
  }

  value.forEach((skill, index) => {
    if (typeof skill !== 'string' || skill.trim().length === 0) {
      throw new TypeError(
        `${fieldName}[${index}] must be a non-empty string (got ${JSON.stringify(skill)})`
      );
    }
  });
}

/**
 * Removes duplicate skills from an array, treating different casing/whitespace
 * as the same skill. Keeps the FIRST original spelling encountered.
 *
 * ["C", "c", " C "] -> ["C"]
 */
function dedupeSkills(skills) {
  const seen = new Set();
  const result = [];

  for (const skill of skills) {
    const key = normalizeSkill(skill);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(skill);
    }
  }

  return result;
}

/**
 * Compares a student's skills against a career's required skills.
 *
 * @param {string[]} studentSkills - skills the student currently has
 * @param {string[]} requiredSkills - skills required for the target career
 * @returns {{ matchedSkills: string[], missingSkills: string[] }}
 *
 * Matching rules:
 * - Case-insensitive: "javascript" matches "JavaScript"
 * - Whitespace-tolerant: "  HTML  " matches "HTML"
 * - Deterministic: same inputs always produce the same output
 * - Duplicate-safe: repeated student skills are only counted once
 *
 * Output preserves the ORIGINAL spelling/casing from requiredSkills,
 * and follows the same order as requiredSkills, so results look clean
 * and predictable regardless of how the student typed their skills.
 */
function matchSkills(studentSkills, requiredSkills) {
  validateSkillArray(studentSkills, 'studentSkills');
  validateSkillArray(requiredSkills, 'requiredSkills');

  // Dedupe student skills first (case/whitespace-insensitive)
  const uniqueStudentSkills = dedupeSkills(studentSkills);
  const studentSet = new Set(uniqueStudentSkills.map(normalizeSkill));

  const matchedSkills = [];
  const missingSkills = [];

  for (const required of requiredSkills) {
    if (studentSet.has(normalizeSkill(required))) {
      matchedSkills.push(required);
    } else {
      missingSkills.push(required);
    }
  }

  return { matchedSkills, missingSkills };
}

module.exports = {
  matchSkills,
  normalizeSkill,
  dedupeSkills,
};
