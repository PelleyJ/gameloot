const STORAGE_KEY = "gameloot-wishlist";

function readWishlist() {
  if (typeof localStorage === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeWishlist(list) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Get full wishlist
export function getWishlist() {
  return readWishlist();
}

// Check if a game is already in the wishlist
export function isInWishlist(id) {
  const list = readWishlist();
  return list.some((item) => String(item.id) === String(id));
}

// Add a game to the wishlist
export function addToWishlist(game) {
  const list = readWishlist();
  // avoid duplicates
  if (list.some((item) => String(item.id) === String(game.id))) {
    return;
  }
  list.push({
    id: game.id,
    name: game.name,
    image: game.image || "",
  });
  writeWishlist(list);
}

// Remove a game from the wishlist
export function removeFromWishlist(id) {
  const list = readWishlist();
  const filtered = list.filter((item) => String(item.id) !== String(id));
  writeWishlist(filtered);
}
