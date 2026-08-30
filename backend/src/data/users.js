// src/data/users.js
//
// Persistent local "database" for user profiles, backed by a JSON file
// instead of an in-memory array. Survives nodemon restarts and server crashes.
//
// Uses only Node's native fs/promises + path — no extra packages needed.

const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.json');

/**
 * Reads and parses the user database file.
 * Returns an empty array if the file doesn't exist yet (first run),
 * or if it exists but is empty/corrupted (defensive — avoids crashing
 * the whole app over a bad file).
 *
 * @returns {Promise<Array>} the array of user objects
 */
async function getUsers() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    if (!raw || raw.trim().length === 0) {
      return [];
    }
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File doesn't exist yet — treat as "no users yet", not an error.
      return [];
    }
    if (err instanceof SyntaxError) {
      // File exists but contains invalid JSON — log it, but don't crash.
      console.error('[users.js] database.json contains invalid JSON. Returning empty array.', err.message);
      return [];
    }
    throw err;
  }
}

/**
 * Writes the given users array back to database.json, pretty-printed
 * with 2-space indentation for readability/debugging.
 *
 * @param {Array} usersArray
 * @returns {Promise<void>}
 */
async function saveUsers(usersArray) {
  const json = JSON.stringify(usersArray, null, 2);
  await fs.writeFile(DB_PATH, json, 'utf8');
}

module.exports = { getUsers, saveUsers };
