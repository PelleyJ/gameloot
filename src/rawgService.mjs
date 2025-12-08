const API_KEY = "009f06ca3e0e4ffbb8d93f7739609191"; 
const RAWG_API_BASE = "https://api.rawg.io/api";

/**
 * Search games using the RAWG API.
 * @param {string} query
 * @returns {Promise<Array>}
 */
export async function searchGames(query) {
  if (!API_KEY) {
    console.warn("RAWG API key missing. Returning empty list.");
    return [];
  }

  const url = `${RAWG_API_BASE}/games?key=${API_KEY}&search=${encodeURIComponent(
    query
  )}`;

  console.log("Fetching RAWG URL:", url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        "RAWG Search Error:",
        response.status,
        response.statusText
      );
      return [];
    }

    const data = await response.json();
    console.log("RAWG search results:", data);

    return data.results || [];
  } catch (err) {
    console.error("Network error during RAWG search:", err);
    return [];
  }
}

/**
 * Fetch detailed info for a single game by RAWG ID.
 */
export async function fetchGameDetails(id) {
  if (!id) throw new Error("No RAWG game id provided");
  if (!API_KEY) throw new Error("RAWG API key missing");

  const url = `${RAWG_API_BASE}/games/${id}?key=${API_KEY}`;
  console.log("Fetching RAWG details URL:", url);

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
  console.log("Fetching RAWG screenshots URL:", url);

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
