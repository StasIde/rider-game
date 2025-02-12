class Player {
  constructor(name, tricksCompleted = [], letters = "") {
    this.name = name;
    this.tricksCompleted = tricksCompleted;
    this.letters = letters;
    this.maxLetters = "RIDER";
  }

  performTrick(trick) {
    this.tricksCompleted.push(trick);
  }

  addLetter() {
    if (this.letters.length < this.maxLetters.length) {
      this.letters += this.maxLetters[this.letters.length];
    }
  }

  isEliminated() {
    return this.letters.length >= this.maxLetters.length;
  }
}

export default Player;
