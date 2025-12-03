const CHEAPSHARK_API_BASE = "https://www.cheapshark.com/api/1.0";

// ---------- Helper for fetch + JSON ----------
async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `CheapShark error ${response.status} ${response.statusText} for ${url}`
    );
  }
  return response.json();
}

// ---------- Search a single game by title ----------
/**
 * Search CheapShark for a game by title.
 * Returns an array of matches (can be empty).
 */
export async function searchGameOnCheapShark(title) {
  if (!title) return [];
  const params = new URLSearchParams({
    title,
    pageSize: "10",
    exact: "0",
  });
  const url = `${CHEAPSHARK_API_BASE}/games?${params.toString()}`;
  return fetchJson(url);
}

// ---------- Deals for a specific CheapShark gameID ----------
/**
 * Get all deals for a specific CheapShark gameID.
 * Used on the game details page to find the best deal.
 */
export async function getDealsForGameId(gameID) {
  if (!gameID) return [];
  const params = new URLSearchParams({
    gameID: String(gameID),
  });
  const url = `${CHEAPSHARK_API_BASE}/deals?${params.toString()}`;
  return fetchJson(url);
}

// ---------- Store name lookup (cached) ----------
let storeCache = null;

/**
 * Load all CheapShark stores, cached in memory.
 */
async function loadStores() {
  if (storeCache) return storeCache;
  const url = `${CHEAPSHARK_API_BASE}/stores`;
  const stores = await fetchJson(url);
  const map = {};
  stores.forEach((store) => {
    map[store.storeID] = store.storeName;
  });
  storeCache = map;
  return storeCache;
}

/**
 * Get the store name from a CheapShark storeID.
 */
export async function getStoreName(storeID) {
  if (!storeID) return "Unknown store";
  const stores = await loadStores();
  return stores[storeID] || "Unknown store";
}

// ---------- Top deals list (for deals page) ----------
/**
 * Get a list of the top current deals, sorted by savings.
 * @param {number} limit - number of deals to return
 */
export async function getTopDeals(limit = 20) {
  const params = new URLSearchParams({
    pageSize: String(limit),
    sortBy: "Savings", // biggest discount first
  });
  const url = `${CHEAPSHARK_API_BASE}/deals?${params.toString()}`;
  return fetchJson(url);
}
