class Player {
  constructor(name) {
    this.name = name;
    this.tricksCompleted = new Set();
    this.letters = "";
  }

  performTrick(trick) {
    this.tricksCompleted.add(trick);
  }

  addLetter() {
    if (this.letters.length < 5) {
      this.letters += "RIDER"[this.letters.length];
    }
  }

  isEliminated() {
    return this.letters.length >= 5;
  }
}

export default Player;
