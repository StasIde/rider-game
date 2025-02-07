import Game from "../models/game.js";
import { Wheel } from "https://cdn.jsdelivr.net/npm/spin-wheel@5.0.2/dist/spin-wheel-esm.js";
import Player from "../models/player.js";

import { isNonEmptyArray } from "./utils.js";

const playersList = document.querySelector(".game__players");
const wheelContainer = document.querySelector(".game__wheel-container");
const gameData = JSON.parse(localStorage.getItem("game")) || null;
const spinButton = document.querySelector(".game__wheel-btn");

let game;
let wheel;

if (Boolean(gameData)) {
  game = new Game(gameData.players, gameData.tricks);
  // console.log(game);
} else {
  window.location.href = "/start.html";
}

spinButton.addEventListener("click", handleSpin);

function initializeGame() {
  const trickOptions = game.tricks.map(trick => ({ label: trick.name }));

  renderPlayers(game.players);

  wheel = new Wheel(wheelContainer, { items: trickOptions });
}

function renderPlayers(players) {
  if (!isNonEmptyArray(players)) {
    return null;
  }

  playersList.innerHTML = players.map(player => {
    if (player instanceof Player) {
      const { name, letters } = player;

      return (`
        <li class="trick">
        <div id="${name}" class="game__players-item"><span>${name}</span><span> - ${letters}</span></div>
        </li>
      `)
    }

  }).join("");
}

async function handleSpin() {
  const duration = Math.floor(Math.random() * 10000);

  wheel.spinTo(duration, 3000);
  spinButton.disabled = true;

  wheel.onRest = async function (event) {
    const currentTrickIndex = event.currentIndex;
    const trick = game.tricks[currentTrickIndex];

    game.players.forEach(async (player) => {
      if (player.isEliminated()) return;
      
      const result = await getTrickResult(player, trick);
      game.playTurn(trick, result);
      game.checkWinner();

      renderPlayers(game.players);
      localStorage.setItem("game", JSON.stringify(game));
    });

    spinButton.disabled = false;
  };
}

function getTrickResult(player, trick) {
  return new Promise(resolve => {
    setTimeout(() => {
      const result = confirm(`${player.name} performed "${trick.name}"?`);
      resolve(result);
    }, 1000);
  });
}

document.addEventListener("DOMContentLoaded", initializeGame);
