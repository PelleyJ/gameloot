console.log("deals.mjs loaded");

// Where we will render the deals
const dealsListEl = document.getElementById("deals-list");

if (!dealsListEl) {
  console.error("Could not find #deals-list element on the page.");
}

/**
 * Format a numeric price string to two decimals.
 */
function formatPrice(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  return num.toFixed(2);
}

/**
 * Render an array of deals into the page.
 * @param {Array} deals
 */
function renderDeals(deals) {
  if (!dealsListEl) return;

  if (!deals || deals.length === 0) {
    dealsListEl.innerHTML = "<p>No deals found right now. Try again later.</p>";
    return;
  }

  const html = deals
    .map((deal) => {
      const title = deal.title || "Unknown game";
      const salePrice = formatPrice(deal.salePrice);
      const normalPrice = formatPrice(deal.normalPrice);
      const savings = Math.round(Number(deal.savings) || 0);
      const storeID = deal.storeID;
      const storeName = deal.storeName || `Store #${storeID}`;
      const dealUrl = `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`;

      return `
        <article class="deal-card">
          <h3 class="deal-title">${title}</h3>
          <p class="deal-store"><strong>Store:</strong> ${storeName}</p>
          <p class="deal-price">
            <strong>Sale:</strong> $${salePrice}
            <span class="deal-normal">(Normal: $${normalPrice})</span>
          </p>
          <p class="deal-savings"><strong>You save:</strong> ${savings}%</p>
          <a class="deal-link" href="${dealUrl}" target="_blank" rel="noopener noreferrer">
            View Deal on CheapShark
          </a>
        </article>
      `;
    })
    .join("");

  dealsListEl.innerHTML = html;
}

/**
 * Load a list of top deals from CheapShark.
 */
async function loadTopDeals() {
  if (!dealsListEl) return;

  // You can tweak these query params if you want different deals
  const url =
    "https://www.cheapshark.com/api/1.0/deals?upperPrice=60&pageSize=12&sortBy=Savings";

  console.log("Fetching top deals from:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const deals = await response.json();
    console.log("Deals from API:", deals);

    renderDeals(deals);
  } catch (error) {
    console.error("Error loading top deals:", error);
    dealsListEl.innerHTML =
      "<p>Sorry, we couldn't load deals right now. Please try again later.</p>";
  }
}

// Kick things off once the DOM is ready
document.addEventListener("DOMContentLoaded", loadTopDeals);
