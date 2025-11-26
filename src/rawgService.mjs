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

// Give it a default export too, just in case somewhere uses `default`
export default searchGames;
