import Player from "./player.js";

class Game {
  constructor(players, tricks) {
    this.players = players.map(name => new Player(name));
    this.tricks = tricks;
    this.currentPlayerIndex = 0;
  }

  get currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  playTurn(trick, success) {
    const player = this.currentPlayer;

    if (success) {
      player.performTrick(trick);
    } else {
      player.addLetter();
    }

    if (player.isEliminated()) {
      console.log(`${player.name} wasted!`);
    }

    this.nextTurn();
  }

  nextTurn() {
    do {
      this.currentPlayerIndex =
        (this.currentPlayerIndex + 1) % this.players.length;
    } while (this.currentPlayer.isEliminated());
  }

  checkWinner() {
    const activePlayers = this.players.filter(player => !player.isEliminated());
    if (activePlayers.length === 1) {
      console.log(`The winner is: ${activePlayers[0].name}!`);
      return activePlayers[0];
    }
    return null;
  }
}

export default Game;
