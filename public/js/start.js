import { toast } from "./utils.js";
import { trickApi } from "../api/TrickApi.js";

function init() {
  const form = document.querySelector(".start__form");
  const select = document.querySelector(".start__form-select");
  const submitBtn = document.querySelector(".start__form-btn");
  const playersContainer = document.querySelector(".start__form-players");
  const tricksList = document.querySelector(".start__form-tricks");

  tricksList.addEventListener("click", handleTrickClick);
  select.addEventListener("change", handlePlayerCountChange);
  form.addEventListener("submit", handleFormSubmit);

  async function initializeApp() {
    try {
      const { tricks } = await trickApi.getAll();
      renderTricks([{ name: "get random" }, { name: "get all" }, ...tricks]);
    } catch (error) {
      console.error("Error initializing", error);
    }
  }

  function handleTrickClick(e) {
    const trickItem = e.target.closest(".trick__item");
    if (!trickItem) return;

    const { id } = trickItem;
    
    if (id === "get all") {
      const isChecked = !trickItem.classList.contains("checked");
      trickItem.classList.toggle("checked", isChecked);
      toggleAllTricks(isChecked);
      return;
    }

    if (id === "get random") {
      trickItem.classList.toggle("checked");
      return;
    }

    trickItem.classList.toggle("checked");
    updateControlButtonsState();
  }

  function toggleAllTricks(isChecked) {
    document.querySelectorAll(".trick__item").forEach(item => {
      if (!["get all", "get random"].includes(item.id)) {
        item.classList.toggle("checked", isChecked);
      }
    });
  }

  function updateControlButtonsState() {
    const allTricks = Array.from(document.querySelectorAll('.trick__item')).filter(item => !["get all", "get random"].includes(item.id));
    const selectedCount = [...allTricks].filter(item => item.classList.contains("checked")).length;
    
    document.getElementById("get all").classList.toggle("checked", selectedCount === allTricks.length);
  }

  function handlePlayerCountChange(e) {
    const playerCount = parseInt(e.target.value) || 0;
    playersContainer.innerHTML = "";
    
    if (playerCount > 0) {
      playersContainer.append(...createPlayerInputs(playerCount));
    }
    
    submitBtn.disabled = playerCount <= 0;
  }

  function createPlayerInputs(count) {
    return Array.from({ length: count }, (_, index) => {
      const div = document.createElement("div");
      div.className = "form-group";
      div.innerHTML = `
        <label class="player__label">Player ${index + 1}</label>
        <input 
          type="text" 
          class="player__name" 
          placeholder="Enter player name"
          required
        />
      `;
      return div;
    });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    
    const gameData = {
      players: getValidPlayers(),
      tricks: getSelectedTricks(),
      isRandom: document.getElementById("get random").classList.contains("checked")
    };

    if (!validateForm(gameData)) return;
    
    localStorage.setItem("game", JSON.stringify(gameData));
    window.location.href = "/game.html";
  }

  function getValidPlayers() {
    return [...document.querySelectorAll(".player__name")]
      .map(input => input.value.trim())
      .filter(name => name.length > 0);
  }

  function getSelectedTricks() {
    const isRandomMode = document.getElementById("get random").classList.contains("checked");
    const allTricks = Array.from(document.querySelectorAll('.trick__item')).filter(item => !["get all", "get random"].includes(item.id));
    
    if (isRandomMode) {
      return getRandomTricks(allTricks);
    }
    
    return allTricks
      .filter(item => item.classList.contains("checked"))
      .map(item => item.id);
  }

  function getRandomTricks(tricks) {
    const randomCount = Math.floor(Math.random() * tricks.length) + 1;
    return tricks
      .sort(() => Math.random() - 0.5)
      .slice(0, randomCount)
      .map(item => item.id);
  }

  function validateForm({ players, tricks }) {
    if (players.length === 0) {
      toast("Please enter at least two player names");
      return false;
    }
    
    if (tricks.length === 5) {
      toast({message:"Please select at least 5 tricks!", status: "error"});
      return false;
    }
    
    return true;
  }

  function renderTricks(tricks) {
    tricksList.innerHTML = tricks.map(({ name }) => `
      <li class="trick">
        <div id="${name}" class="trick__item">${name}</div>
      </li>
    `).join("");
  }

  document.addEventListener("DOMContentLoaded", initializeApp);
};

init();