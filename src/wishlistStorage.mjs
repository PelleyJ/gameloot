// src/wishlistStorage.mjs

const STORAGE_KEY = "gameloot-wishlist";

function loadWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    // Make sure it’s an array
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error reading wishlist from localStorage:", err);
    return [];
  }
}

function saveWishlist(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Error saving wishlist to localStorage:", err);
  }
}

/**
 * Add a game to the wishlist.
 * Expects a RAWG game object (or at least id, name, background_image).
 */
export function addToWishlist(game) {
  if (!game || !game.id) return;

  const list = loadWishlist();

  // Avoid duplicates
  if (list.some((item) => item.id === game.id)) return;

  list.push({
    id: game.id,
    name: game.name,
    background_image: game.background_image || "",
    slug: game.slug || "",
  });

  saveWishlist(list);
}

/**
 * Remove a game from the wishlist by RAWG id.
 */
export function removeFromWishlist(id) {
  if (!id) return;
  const list = loadWishlist().filter((item) => item.id !== id);
  saveWishlist(list);
}

/**
 * Check if a game is already in the wishlist.
 */
export function isInWishlist(id) {
  if (!id) return false;
  const list = loadWishlist();
  return list.some((item) => item.id === id);
}

/**
 * Get the full wishlist array.
 */
export function getWishlist() {
  return loadWishlist();
}
