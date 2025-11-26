console.log("renderGames.mjs module loaded");

/**
 * Render a list of games into the given parent element.
 * @param {Array} games
 * @param {HTMLElement} parent
 */
export function renderGames(games, parent) {
  if (!parent) {
    console.error("renderGames: parent element is missing!");
    return;
  }

  // clear previous results
  parent.innerHTML = "";

  if (!games || games.length === 0) {
    parent.innerHTML = "<p>No games found. Try another search.</p>";
    return;
  }

  games.forEach((game) => {
    const card = document.createElement("article");
    card.className = "game-card";

    const imgSrc = game.background_image || "";
    const rating = game.rating ?? "N/A";

    card.innerHTML = `
      <img src="${imgSrc}" alt="${game.name}" />
      <h3>${game.name}</h3>
      <p>Rating: ${rating}</p>
    `;

    parent.appendChild(card);
  });
}

// ALSO export as default so BOTH styles work
export default renderGames;
