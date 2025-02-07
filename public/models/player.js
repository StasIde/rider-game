class Player {
  constructor(name, tricksCompleted = [], letters = 0) {
    this.name = name;
    this.tricksCompleted = tricksCompleted;
    this.letters = letters;
  }

  performTrick(trick) {
    this.tricksCompleted.push(trick);
  }

  addLetter() {
    if (this.letters < 5) {
      this.letters++;
    }
  }

  isEliminated() {
    return this.letters >= 5;
  }
}

export default Player;
