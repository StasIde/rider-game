import Player from "./player.js";

class Game {
  constructor(players, tricks) {
    this.players = players.map(player => new Player(player.name, player.tricksCompleted, player.letters));
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

    this.currentPlayerIndex++;

    if (this.players.length < this.currentPlayerIndex + 1) {
      this.currentPlayerIndex = 0;
    }
  }

  checkWinner() {
    const activePlayers = this.players.filter(player => !player.isEliminated());
    if (activePlayers.length === 1) {
      return activePlayers[0];
    }
    return null;
  }
}

export default Game;
