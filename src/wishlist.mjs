// src/wishlist.mjs

import { getWishlist, removeFromWishlist } from "./wishlistStorage.mjs";

function renderEmptyMessage(container) {
  container.innerHTML = `
    <p class="wishlist-empty">
      Your wishlist is empty. Go back to the search page and add some games!
    </p>
  `;
}

/**
 * Build a single wishlist card element for a game.
 */
function createWishlistCard(game) {
  const article = document.createElement("article");
  article.className = "wishlist-item";

  const imgSrc = game.background_image || "";

  article.innerHTML = `
    <img
      class="wishlist-item__image"
      src="${imgSrc}"
      alt="${game.name}"
      loading="lazy"
    />
    <div class="wishlist-item__content">
      <h2 class="wishlist-item__title">${game.name}</h2>
      <div class="wishlist-item__actions">
        <a class="btn btn-view" href="game.html?id=${game.id}">
          View Details
        </a>
        <button class="btn btn-remove" type="button">
          Remove
        </button>
      </div>
    </div>
  `;

  // Hook up remove button
  const removeBtn = article.querySelector(".btn-remove");
  removeBtn.addEventListener("click", () => {
    removeFromWishlist(game.id);
    article.remove();

    // If nothing left, show empty message
    const container = document.getElementById("wishlist-list");
    if (container && !container.querySelector(".wishlist-item")) {
      renderEmptyMessage(container);
    }
  });

  return article;
}

/**
 * Render the entire wishlist on page load.
 */
function renderWishlist() {
  const container = document.getElementById("wishlist-list");
  if (!container) {
    console.error("wishlist-list container not found");
    return;
  }

  const wishlist = getWishlist();

  if (!wishlist.length) {
    renderEmptyMessage(container);
    return;
  }

  container.innerHTML = "";
  wishlist.forEach((game) => {
    const card = createWishlistCard(game);
    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", renderWishlist);
