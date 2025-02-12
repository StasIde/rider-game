import Player from "./player.js";

class Game {
  constructor(players, tricks) {
    this.players = players.map( player => new Player(player.name, player.tricksCompleted, player.letters));
    this.tricks = tricks;
  }

  playTurn(trick, playerIndex, success) {
    if (this.players[playerIndex]) {
      const player = this.players[playerIndex];

      if (success) {
        player.performTrick(trick);
      } else {
        player.addLetter();
      }
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
