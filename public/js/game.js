import { Wheel } from "https://cdn.jsdelivr.net/npm/spin-wheel@5.0.2/dist/spin-wheel-esm.js";

import { isNonEmptyArray } from "./utils.js";

import Player from "../modules/player.js";
import Game from "../modules/game.js";
import Modal from "../modules/modal.js";

const playersList = document.querySelector(".game__players");
const wheelContainer = document.querySelector(".game__wheel-container");
const gameData = JSON.parse(localStorage.getItem("game")) || null;
const spinButton = document.querySelector(".game__wheel-btn");
const modal = new Modal();

let game;
let wheel;

if (Boolean(gameData)) {
  game = new Game(gameData.players, gameData.tricks);
} else {
  window.location.href = "/start.html";
}

spinButton.addEventListener("click", handleSpin);

function initializeGame() {
  const trickOptions = getLimitedTricks(game.tricks, 10).map(trick => ({
    label: trick.name,
  }));

  const image = new Image();
  image.src = "../assets/icons/arrow-wheel.svg";
  image.classList.add("game__wheel-arrow");

  renderPlayers(game.players);

  const color = "#b55bff";

  const wheelProps = {
    items: trickOptions,
    borderWidth: 7,
    borderColor: color,
    itemLabelColors: [color, "#fff"],
    lineColor: color,
    itemBackgroundColors: ["#fff", color],
  };

  wheel = new Wheel(wheelContainer, wheelProps);
  wheelContainer.appendChild(image)
}

function renderPlayers(players) {
  if (!isNonEmptyArray(players)) {
    return null;
  }

  playersList.innerHTML = players
    .map(player => {
      if (player instanceof Player) {
        const { name, letters } = player;

        return `
        <li class="game__players-item">
          <div id="${name}" class="game__players-item-name">
            <span class="game__players-item-name-text">${name}</span>
            <span class="game__players-item-name-letters">${letters}</span>
          </div>
        </li>
      `;
      }
    })
    .join("");
}

async function handleSpin() {
  const duration = Math.floor(Math.random() * 10000);

  wheel.spinTo(duration, 1000);
  spinButton.disabled = true;

  wheel.onRest = async function (event) {
    const currentTrickIndex = event.currentIndex;
    const trick = game.tricks[currentTrickIndex];

    for (const [playerIndex, player] of game.players.entries()) {
      if (player.isEliminated()) {
        continue;
      }

      const result = await getTrickResult(player, trick);
      game.playTurn(trick, playerIndex, result);

      renderPlayers(game.players);
      localStorage.setItem("game", JSON.stringify(game));
    }

    const winner = game.checkWinner();
    if (winner) {
      modal.open({
        title: "Winner",
        text: `${winner.name} won the game!`,
        buttons: [
          { label: "Play again", className: "secondary-btn", onClick: startNewGame },
          { label: "Exit", className: "primary-btn", onClick: exitGame },
        ],
      });
    }

    spinButton.disabled = false;
  };
}

function startNewGame() {
  localStorage.removeItem("game");
  window.location.href = "/start.html";
}

function exitGame() {
  localStorage.removeItem("game");
  window.location.href = "/index.html";
}

function getLimitedTricks(tricks, limit) {
  const limitedTricks = [];

  for (const trick of tricks) {
    if (limitedTricks.length < limit) {
      limitedTricks.push(trick);
    }
  }
  if (limitedTricks.length % 2 !== 0) {
    limitedTricks.pop(tricks[limitedTricks.length - 1]);
  }
  
  return limitedTricks;
}

function getTrickResult(player, trick) {
  return new Promise(resolve => {
    modal.open({
      title: "Confirmation of the trick",
      text: `Did ${player.name} perform ${trick.name}?`,
      buttons: [
        { label: "No", className: "secondary-btn", onClick: () => resolve(false) },
        { label: "Yes", className: "primary-btn", onClick: () => resolve(true) },
      ],
    });
  });
}

document.addEventListener("DOMContentLoaded", initializeGame);
