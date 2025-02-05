import Game from "../models/game.js";

document.addEventListener("DOMContentLoaded", () => {
  const condition = localStorage.getItem("game");
  if (condition) {
    const game = new Game(
      JSON.parse(condition).players,
      JSON.parse(condition).tricks
    );

    const gamePlayers = document.querySelector(".game__players");

    for (let player of game.players) {
      console.log(player);
    }

    // game.playTurn();
  } else {
    window.location.href = "/pages/start.html";
  }
});

function renderPlayers(players) {
  for (let player of players) {
  }
}
