import { getWishlist, removeFromWishlist } from "./wishlistStorage.mjs";
import { fetchGameDetails } from "./rawgService.mjs";

/**
 * Render message when the wishlist is empty
 */
function renderEmptyMessage(container) {
  container.innerHTML = `
    <p class="wishlist-empty" style="text-align:center; margin-top:2rem;">
      Your wishlist is empty. Go back to the search page and add some games!
    </p>
  `;
}

/**
 * Creates a wishlist card that matches the search result cards
 */
function createWishlistCard(game) {
  const article = document.createElement("article");
  article.className = "game-card fade-in"; // matches search cards

  const imgSrc =
    game.background_image ||
    game.image ||
    "https://via.placeholder.com/420x236?text=No+Image";

  article.innerHTML = `
    <img 
      src="${imgSrc}" 
      alt="${game.name}"
      loading="lazy"
    />

    <a href="game.html?id=${game.id}" class="game-card-title">
      ${game.name}
    </a>

    <p class="game-card-rating">
      Rating: ${
        typeof game.rating === "number" ? game.rating.toFixed(2) : "N/A"
      }
    </p>

    <div class="wishlist-actions">
      <a class="btn-view" href="game.html?id=${game.id}">
        View Details
      </a>
      <button class="btn-remove" type="button">
        Remove
      </button>
    </div>
  `;

  // Remove button listener
  const removeBtn = article.querySelector(".btn-remove");
  removeBtn.addEventListener("click", () => {
    removeFromWishlist(game.id);
    article.remove();

    const container = document.getElementById("wishlist-list");
    if (container && container.children.length === 0) {
      renderEmptyMessage(container);
    }
  });

  return article;
}

/**
 * Renders the entire wishlist when page loads,
 * fetching fresh details from RAWG so we always have a real image.
 */
async function renderWishlist() {
  const container = document.getElementById("wishlist-list");
  if (!container) {
    console.error("wishlist-list container not found");
    return;
  }

  const savedWishlist = getWishlist();

  if (!savedWishlist.length) {
    renderEmptyMessage(container);
    return;
  }

  container.innerHTML = "";

  // Fetch details for each wishlist game to repair / complete data
  const detailedGames = await Promise.all(
    savedWishlist.map(async (item) => {
      try {
        const details = await fetchGameDetails(item.id);

        const image =
          item.background_image && !item.background_image.includes("No+Image")
            ? item.background_image
            : details.background_image ||
              details.background_image_additional ||
              (details.short_screenshots?.length
                ? details.short_screenshots[0].image
                : null) ||
              item.background_image || // fallback to whatever we had
              "";

        return {
          ...item,
          name: item.name || details.name,
          background_image: image,
          rating:
            typeof item.rating === "number"
              ? item.rating
              : typeof details.rating === "number"
              ? details.rating
              : null,
        };
      } catch (err) {
        console.error("Error fetching details for wishlist item", item.id, err);
        // Fall back to what we already have
        return item;
      }
    })
  );

  detailedGames.forEach((game) =>
    container.appendChild(createWishlistCard(game))
  );
}

document.addEventListener("DOMContentLoaded", () => {
  renderWishlist().catch((err) =>
    console.error("Error rendering wishlist:", err)
  );
});
