class Modal {
  constructor() {
    this.modal = document.createElement("div");
    this.modal.classList.add("modal");
    this.modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
          <h2 class="modal-title"></h2>
          <p class="modal-text"></p>
          <div class="modal-buttons">
          </div>
        </div>
      `;

    document.body.appendChild(this.modal);

    this.overlay = this.modal.querySelector(".modal-overlay");
    this.title = this.modal.querySelector(".modal-title");
    this.text = this.modal.querySelector(".modal-text");
    this.buttonsContainer = this.modal.querySelector(".modal-buttons");

    // this.overlay.addEventListener("click", () => this.close());
  }

  open({ title = "", text = "", buttons = [] }) {
    this.title.textContent = title;
    this.text.textContent = text;
    this.buttonsContainer.innerHTML = "";

    buttons.forEach(({ label, onClick, className = "" }) => {
      const button = document.createElement("button");
      button.textContent = label;
      button.className = `modal-button ${className}`;
      button.addEventListener("click", () => {
        onClick?.();
        this.close();
      });
      this.buttonsContainer.appendChild(button);
    });

    this.modal.classList.add("open");
  }

  close() {
    this.modal.classList.remove("open");
  }
}

export default Modal;
