import { searchGames } from "./rawgService.mjs";
import { renderGames } from "./renderGames.mjs";

console.log("main.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");

  const searchBtn = document.querySelector("#searchBtn");
  const searchInput = document.querySelector("#searchInput");
  const resultsSection = document.querySelector("#results");

  if (!searchBtn || !searchInput || !resultsSection) {
    console.error("One or more DOM elements not found.");
    return;
  }

  searchBtn.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    console.log("Search clicked with query:", query);

    if (!query) {
      console.log("Empty query, aborting.");
      return;
    }

    try {
      const results = await searchGames(query);
      console.log("Results from RAWG:", results);
      renderGames(results, resultsSection);
    } catch (err) {
      console.error("Error during search:", err);
      resultsSection.innerHTML =
        "<p>Something went wrong. Check the console for details.</p>";
    }
  });
});
