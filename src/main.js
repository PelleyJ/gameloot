import { searchGames } from "./rawgService.mjs";
import { renderGames } from "./renderGames.mjs";

console.log("main.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");

  const searchBtn = document.querySelector("#searchBtn");
  const searchInput = document.querySelector("#searchInput");
  const resultsSection = document.querySelector("#results");
  const recentSearchesContainer = document.querySelector("#recent-searches");

  if (!searchBtn || !searchInput || !resultsSection) {
    console.error("One or more DOM elements not found.");
    return;
  }

  // Save the user's recent search terms to localStorage
  function saveSearchTerm(query) {
    let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];

    if (!searches.includes(query)) {
      searches.unshift(query);
    }

    // keep only the last 5 searches
    searches = searches.slice(0, 5);

    localStorage.setItem("recentSearches", JSON.stringify(searches));
  }

  // Run a search: save term, call API, render results
  async function runSearch(query) {
    console.log("Search requested with query:", query);

    if (!query) {
      console.log("Empty query, aborting.");
      return;
    }

    saveSearchTerm(query);

    try {
      const results = await searchGames(query);
      console.log("Results from RAWG:", results);
      renderGames(results, resultsSection);
      loadRecentSearches();
    } catch (err) {
      console.error("Error during search:", err);
      resultsSection.innerHTML =
        "<p>Something went wrong. Check the console for details.</p>";
    }
  }

  // Load recent searches from localStorage and render them
  function loadRecentSearches() {
    if (!recentSearchesContainer) return;

    const searches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];

    recentSearchesContainer.innerHTML = "";

    searches.forEach((term) => {
      const item = document.createElement("button");
      item.type = "button";
      item.classList.add("recent-search-item");
      item.textContent = term;

      item.addEventListener("click", () => {
        searchInput.value = term;
        runSearch(term);
      });

      recentSearchesContainer.appendChild(item);
    });
  }

  // Button click -> run search
  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    runSearch(query);
  });

  // Press Enter in input -> run search
  searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      const query = searchInput.value.trim();
      runSearch(query);
    }
  });

  // Populate recent searches on first load
  loadRecentSearches();
});
