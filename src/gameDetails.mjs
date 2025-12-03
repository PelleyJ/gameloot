import {
  fetchGameDetails,
  fetchGameScreenshots,
} from "./rawgService.mjs";
import { initModal, openModal } from "./modal.mjs";
import {
  searchGameOnCheapShark,
  getDealsForGameId,
  getStoreName,
} from "./cheapsharkService.mjs";
import {
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from "./wishlistStorage.mjs";

console.log("gameDetails.mjs loaded");

// Grab elements from the DOM
const titleEl = document.getElementById("game-title");
const metaEl = document.getElementById("game-meta");
const descriptionEl = document.getElementById("game-description");
const imageEl = document.getElementById("game-image");
const screenshotGrid = document.getElementById("screenshot-grid");
const dealInfoEl = document.getElementById("deal-info");
const wishlistBtn = document.getElementById("add-to-wishlist");

console.log("DOM refs:", {
  titleEl,
  metaEl,
  descriptionEl,
  imageEl,
  screenshotGrid,
  dealInfoEl,
  wishlistBtn,
});

let currentGame = null;

async function init() {
  console.log("init() running…");

  // Set up modal behavior
  initModal();
  setupWishlistButton(); // attach click handler

  // Get ?id= from the URL
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get("id");
  console.log("URL gameId =", gameId);

  if (!gameId) {
    titleEl.textContent = "No game selected";
    descriptionEl.textContent =
      "This page requires a game id in the URL, e.g. game.html?id=3498";
    return;
  }

  try {
    // Fetch details and screenshots at the same time
    const [game, screenshots] = await Promise.all([
      fetchGameDetails(gameId),
      fetchGameScreenshots(gameId),
    ]);

    console.log("RAWG game details:", game);
    console.log("RAWG screenshots:", screenshots);

    currentGame = game;

    renderGameDetails(game);
    renderScreenshots(screenshots);
    updateWishlistButton();   // reflect current wishlist state
    await loadDealInfo(game);
  } catch (error) {
    console.error(error);
    titleEl.textContent = "Error loading game";
    descriptionEl.textContent =
      "There was a problem loading the game details. Please try again later.";
  }
}

function renderGameDetails(game) {
  // Title
  titleEl.textContent = game.name;

  // Genres
  const genres = (game.genres || []).map((g) => g.name).join(", ");

  // Platforms
  const platforms = (game.platforms || [])
    .map((p) => p.platform?.name || "")
    .join(", ");

  // Release date
  const released = game.released || "Unknown release date";

  metaEl.textContent = `Released: ${released} | Genres: ${
    genres || "N/A"
  } | Platforms: ${platforms || "N/A"}`;

  // Main image
  if (imageEl) {
    imageEl.src = game.background_image || "";
    imageEl.alt = game.name || "Game cover";
  }

  // Description (RAWG description is HTML; description_raw is plain text)
  if (descriptionEl) {
    if (game.description_raw) {
      descriptionEl.textContent = game.description_raw;
    } else if (game.description) {
      descriptionEl.innerHTML = game.description;
    } else {
      descriptionEl.textContent = "No description available.";
    }
  }
}

function renderScreenshots(screenshots) {
  if (!screenshotGrid) return;
  screenshotGrid.innerHTML = "";

  if (!screenshots.length) {
    const p = document.createElement("p");
    p.textContent = "No screenshots available.";
    screenshotGrid.appendChild(p);
    return;
  }

  screenshots.forEach((shot) => {
    const img = document.createElement("img");
    img.src = shot.image;
    img.alt = "Game screenshot";
    img.classList.add("screenshot-thumb");
    img.loading = "lazy";

    img.addEventListener("click", () => {
      openModal(shot.image);
    });

    screenshotGrid.appendChild(img);
  });
}

// ===== Wishlist helpers =====

function updateWishlistButton() {
  if (!wishlistBtn || !currentGame) return;
  const inList = isInWishlist(currentGame.id);
  console.log("updateWishlistButton. In list?", inList);
  wishlistBtn.textContent = inList ? "Remove from Wishlist" : "Add to Wishlist";
  wishlistBtn.classList.toggle("in-wishlist", inList);
}

function setupWishlistButton() {
  if (!wishlistBtn) {
    console.log("wishlistBtn not found");
    return;
  }

  console.log("Setting up wishlist button click handler");

  wishlistBtn.addEventListener("click", () => {
    if (!currentGame) {
      console.log("No currentGame yet, ignoring click");
      return;
    }

    const inList = isInWishlist(currentGame.id);
    console.log("Wishlist button clicked. In list before click?", inList);

    if (inList) {
      removeFromWishlist(currentGame.id);
      console.log("Removed from wishlist:", currentGame.id);
    } else {
      addToWishlist({
        id: currentGame.id,
        name: currentGame.name,
        image: currentGame.background_image,
      });
      console.log("Added to wishlist:", currentGame.id);
    }

    updateWishlistButton();
  });
}

// ===== CheapShark best deal (unchanged from working version) =====

async function loadDealInfo(game) {
  console.log("loadDealInfo called with game:", game?.name);
  if (!dealInfoEl) {
    console.error("dealInfoEl NOT FOUND");
    return;
  }
  if (!game?.name) {
    console.error("Game has no name, cannot search CheapShark.");
    return;
  }

  dealInfoEl.textContent = "Searching for deals...";

  try {
    console.log("CheapShark: searching for deals for", game.name);

    const matches = await searchGameOnCheapShark(game.name);
    console.log("CheapShark matches:", matches);

    if (!Array.isArray(matches) || !matches.length) {
      dealInfoEl.textContent = "No deals found on CheapShark.";
      return;
    }

    const match = matches[0];
    console.log("Using CheapShark gameID:", match.gameID);

    const deals = await getDealsForGameId(match.gameID);
    console.log("Deals for game:", deals);

    if (!Array.isArray(deals) || !deals.length) {
      dealInfoEl.textContent = "No active deals found for this game.";
      return;
    }

    const bestDeal = deals.reduce((best, d) => {
      const bestSale = parseFloat(
        best.salePrice ?? best.price ?? best.dealPrice ?? Infinity
      );
      const currentSale = parseFloat(
        d.salePrice ?? d.price ?? d.dealPrice ?? Infinity
      );
      return currentSale < bestSale ? d : best;
    });

    console.log("Best CheapShark deal:", bestDeal);

    const storeName = await getStoreName(bestDeal.storeID);

    const salePriceRaw =
      bestDeal.salePrice ?? bestDeal.price ?? bestDeal.dealPrice ?? null;
    const normalPriceRaw =
      bestDeal.normalPrice ??
      bestDeal.retailPrice ??
      bestDeal.msrp ??
      null;

    const salePrice = salePriceRaw ? parseFloat(salePriceRaw) : null;
    const normalPrice = normalPriceRaw ? parseFloat(normalPriceRaw) : null;

    let savingsPercent = 0;
    if (normalPrice && salePrice) {
      savingsPercent = Math.round(
        ((normalPrice - salePrice) / normalPrice) * 100
      );
    } else if (bestDeal.savings != null) {
      savingsPercent = Math.round(parseFloat(bestDeal.savings));
    }

    const saleText =
      salePrice != null ? `$${salePrice.toFixed(2)}` : "Unknown price";
    const normalText =
      normalPrice != null ? `$${normalPrice.toFixed(2)}` : "Unknown";

    dealInfoEl.innerHTML = `
      <p><strong>Store:</strong> ${storeName}</p>
      <p><strong>Sale Price:</strong> ${saleText} (Normal: ${normalText})</p>
      <p><strong>You save:</strong> ${savingsPercent}%</p>
      <a href="https://www.cheapshark.com/redirect?dealID=${bestDeal.dealID}"
         target="_blank" rel="noopener">
        View Deal on CheapShark
      </a>
    `;
  } catch (error) {
    console.error("Error loading CheapShark deal:", error);
    dealInfoEl.textContent =
      "There was a problem loading deals from CheapShark.";
  }
}

// Kick things off when the DOM is ready
document.addEventListener("DOMContentLoaded", init);
