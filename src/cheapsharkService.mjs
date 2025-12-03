const CHEAPSHARK_BASE = "https://www.cheapshark.com/api/1.0";

async function handleResponse(response) {
  if (!response.ok) {
    throw new Error(
      `CheapShark error: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
}

/**
 * Search CheapShark for a game by title.
 * Returns an array of matches.
 */
export async function searchGameOnCheapShark(title) {
  if (!title) return [];
  const url = `${CHEAPSHARK_BASE}/games?title=${encodeURIComponent(
    title
  )}&limit=10`;
  const response = await fetch(url);
  const data = await handleResponse(response);
  console.log("CheapShark search results:", data);
  return data;
}

/**
 * Get all deals for a specific CheapShark gameID.
 * NOTE: /games?id=GAMEID returns an object with a "deals" array.
 */
export async function getDealsForGameId(gameId) {
  if (!gameId) return [];
  const url = `${CHEAPSHARK_BASE}/games?id=${gameId}`;
  const response = await fetch(url);
  const data = await handleResponse(response);
  console.log("CheapShark game details:", data);
  return data.deals || [];
}

/**
 * Get top deals for the Deals page (we'll use this later).
 */
export async function getTopDeals(number = 20) {
  const url = `${CHEAPSHARK_BASE}/deals?storeID=1,7,8,25&upperPrice=60&pageSize=${number}`;
  const response = await fetch(url);
  const data = await handleResponse(response);
  console.log("CheapShark top deals:", data);
  return data;
}

// Simple in-memory cache of store data so we only fetch it once.
let storesCache = null;

async function fetchStores() {
  if (storesCache) return storesCache;
  const url = `${CHEAPSHARK_BASE}/stores`;
  const response = await fetch(url);
  const stores = await handleResponse(response);

  storesCache = {};
  stores.forEach((store) => {
    storesCache[store.storeID] = store.storeName;
  });
  console.log("CheapShark stores:", storesCache);
  return storesCache;
}

/**
 * Helper to turn a storeID into its human-readable name.
 */
export async function getStoreName(storeID) {
  const stores = await fetchStores();
  return stores[storeID] || "Unknown Store";
}
