const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

/**
 * Search games using the RAWG API.
 * @param {string} query
 * @returns {Promise<Array>}
 */
export async function searchGames(query) {
  if (!API_KEY) {
    console.warn(
      "RAWG API key missing (VITE_RAWG_API_KEY). Returning empty list."
    );
    return [];
  }

  const url = `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(
    query
  )}`;

  console.log("Fetching RAWG URL:", url);

  const response = await fetch(url);
  if (!response.ok) {
    console.error("RAWG error:", response.status, response.statusText);
    return [];
  }

  const data = await response.json();
  console.log("RAWG data:", data);
  return data.results || [];
}

// ===== Week 6 additions: game details + screenshots =====

const RAWG_API_BASE = "https://api.rawg.io/api";

/**
 * Fetch detailed info for a single game by RAWG ID.
 */
export async function fetchGameDetails(id) {
  if (!id) throw new Error("No RAWG game id provided");
  if (!API_KEY) throw new Error("RAWG API key missing");

  const url = `${RAWG_API_BASE}/games/${id}?key=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `RAWG details error: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
}

/**
 * Fetch screenshots for a game.
 * Returns an array of screenshot objects from RAWG.
 */
export async function fetchGameScreenshots(id) {
  if (!id || !API_KEY) return [];
  const url = `${RAWG_API_BASE}/games/${id}/screenshots?key=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `RAWG screenshots error: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json();
  return data.results || [];
}

// Keep default export so existing imports still work
export default searchGames;
