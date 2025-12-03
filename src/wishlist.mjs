import { getWishlist, removeFromWishlist } from "./wishlistStorage.mjs";

const listEl = document.getElementById("wishlist-list");

function renderWishlist() {
  if (!listEl) return;

  const items = getWishlist();
  listEl.innerHTML = "";

  if (!items.length) {
    const p = document.createElement("p");
    p.textContent =
      "Your wishlist is empty. Search for a game and add it from the details page.";
    listEl.appendChild(p);
    return;
  }

  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "wishlist-item";

    const img = document.createElement("img");
    img.src = item.image || "";
    img.alt = item.name || "Game cover";
    img.loading = "lazy";

    const titleLink = document.createElement("a");
    titleLink.href = `game.html?id=${item.id}`;
    titleLink.textContent = item.name;

    const h3 = document.createElement("h3");
    h3.appendChild(titleLink);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      removeFromWishlist(item.id);
      renderWishlist();
    });

    article.appendChild(img);
    article.appendChild(h3);
    article.appendChild(removeBtn);

    listEl.appendChild(article);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("wishlist.mjs loaded");
  renderWishlist();
});
