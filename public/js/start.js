import { toast } from "./utils.js";
import { trickApi } from "../api/TrickApi.js";
import Game from "../modules/game.js";

const form = document.querySelector(".start__form");
const submitBtn = document.querySelector(".start__form-btn");
const playersContainer = document.querySelector(".start__form-players");
const tricksList = document.querySelector(".start__form-tricks-list");
const dropdown = document.querySelector(".start__form-dropdown");
const dropdownLabel = document.querySelector(".dropdown__label");
const dropdownItem = document.querySelectorAll(".dropdown__list-item");

document.addEventListener("click", e => {
  if (!e.target.classList.contains("dropdown__label")) {
    dropdown.classList.remove("active");
  }
})

tricksList.addEventListener("click", handleTrickClick);
form.addEventListener("submit", handleFormSubmit);
dropdownLabel.addEventListener("click", handleDropdownShow);
dropdownItem.forEach(item => item.addEventListener("click", handleDropdownItemClick));

async function initializeApp() {
  try {
    const { tricks } = await trickApi.getAll();
    renderTricks([{ name: "Get all" }, ...tricks]);
  } catch (error) {
    console.error("Error initializing", error);
  }
}

function handleTrickClick(e) {
  const trickItem = e.target.closest(".trick__item");
  if (!trickItem) return;

  const { id } = trickItem;

  if (id === "Get all") {
    const isChecked = !trickItem.classList.contains("active");
    trickItem.classList.toggle("active", isChecked);
    toggleAllTricks(isChecked);
    return;
  }

  if (id === "get random") {
    trickItem.classList.toggle("active");
    return;
  }

  trickItem.classList.toggle("active");
  updateControlButtonsState();
}

function toggleAllTricks(isChecked) {
  document.querySelectorAll(".trick__item").forEach(item => {
    if (!["Get all"].includes(item.id)) {
      item.classList.toggle("active", isChecked);
    }
  });
}

function updateControlButtonsState() {
  const allTricks = Array.from(
    document.querySelectorAll(".trick__item")
  ).filter(item => !["Get all"].includes(item.id));
  const selectedCount = [...allTricks].filter(item =>
    item.classList.contains("active")
  ).length;

  document
    .getElementById("Get all")
    .classList.toggle("active", selectedCount === allTricks.length);
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
    const input = document.createElement("input");
    input.className = "player__name";
    input.required = true;
    input.placeholder = `Player ${index + 1}`;
    input.type = "text";
    return input;
  });
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const { tricks } = await trickApi.getAll();
  const selectedTricks = tricks.filter(trick => getSelectedTricks().includes(trick.name));

  const gameData = {
    players: getValidPlayers(),
    tricks: selectedTricks,
  };

  if (!validateForm(gameData)) return;

  const game = new Game(gameData.players.map(player => ({ name: player })), gameData.tricks);

  localStorage.setItem("game", JSON.stringify(game));

  window.location.href = "/game.html";
}

function getValidPlayers() {
  return [...document.querySelectorAll(".player__name")]
    .map(input => input.value.trim())
    .filter(name => name.length > 0);
}

function getSelectedTricks() {
  const allTricks = Array.from( document.querySelectorAll(".trick__item")).filter(item => !["Get all"].includes(item.id));

  return allTricks
    .filter(item => item.classList.contains("active"))
    .map(item => item.id);
}

function validateForm({ players, tricks }) {
  if (players.length === 0) {
    toast({ message: "Please enter at least two player names"});
    return false;
  }

  if (tricks.length < 6) {
    toast({ message: "Please select at least 6 tricks!" });
    return false;
  }

  return true;
}

function renderTricks(tricks) {
  tricksList.innerHTML = tricks
    .map(
      ({ name }) => `
      <li class="trick">
        <div id="${name}" class="trick__item">${name}</div>
      </li>
    `
    )
    .join("");
}

function handleDropdownShow() {
  dropdown.classList.toggle("active");
}

function handleDropdownItemClick(e) {
  const playerCount = parseInt(e.target.textContent) || 0;
  dropdownLabel.innerHTML = playerCount;
  handlePlayerCountChange({ target: { value: playerCount } });
  dropdown.classList.remove("active");
}

document.addEventListener("DOMContentLoaded", initializeApp);
