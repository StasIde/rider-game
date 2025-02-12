import { toast } from "./utils.js";

import { trickApi } from "../api/TrickApi.js";
import Modal from "../modules/modal.js";

const createTrickBtn = document.querySelector(".header__item-create");
const trickForm = document.querySelector(".new-trick__form");
const tricksList = document.querySelector(".tricks__list");
const nameInput = document.querySelector("[name='name']");
const complexityInput = document.querySelector("[name='complexity']");
const descriptionInput = document.querySelector("[name='description']");
const modal = new Modal();

let tricks = [];

document.addEventListener("DOMContentLoaded", initializeModule);
createTrickBtn.addEventListener("click", openFormHandler);
// trickForm.addEventListener("submit", handleFormSubmit);
tricksList.addEventListener("click", handleListClick);

async function initializeModule() {
  try {
    const response = await trickApi.getAll();
    tricks = response.tricks || [];
    renderTricks();
  } catch (error) {
    toast({ message: "Error initializing, try again later" });
  }
}

function renderTricks() {
  tricksList.innerHTML =
    tricks.length > 0
      ? tricks.map(createTrickElement).join("")
      : "<p>No tricks yet</p>";
}

function createTrickElement(trick) {
  return `
      <li class="trick-item">
        <div class="trick__name">${trick.name}</div>
        <div class="trick__complexity">${trick.complexity}</div>
        <div class="trick__description">${trick.description}</div>
        <div class="trick__delete">
          <button class="trick__delete-btn" data-id="${trick._id}"><img src="../assets/icons/delete.svg" alt="delete"></button>
        </div>
      </li>
    `;
}

function modalForm() {
  return `
    <form class="new-trick__form">
      <div class="new-trick__form-group">
        <input class="new-trick__form-group-name" type="text" name="name" id="name" placeholder="Name" required>
        <input class="new-trick__form-group-complexity" type="number" name="complexity" max="10" min="1" id="complexity" placeholder="Complexity" required>
      </div>
      <textarea class="new-trick__form-group-description" type="text" name="description" id="description" placeholder="Description" required></textarea>
      <button class="form-submit-btn primary-btn" type="submit">Create</button>
    </form>
  `;
}

async function handleListClick(event) {
  const deleteBtn = event.target.closest(".trick__delete-btn");
  if (!deleteBtn) return;

  try {
    const { alert, tricks: updatedTricks } = await trickApi.delete({
      id: deleteBtn.dataset.id,
    });

    tricks = updatedTricks;
    renderTricks();
    toast(alert);
  } catch (error) {
    toast({ message: "Error deleting trick, try again later" });
  }
}

 function openFormHandler() {
 const formNode = modal.open({
    title: "Create trick",
    form: modalForm(),
    buttons: [
      { className: "close-btn", onClick: () => modal.close() },
    ],
  });
  formNode.formContainer.addEventListener("submit", handleFormSubmit);
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const name = event.target.querySelector("[name='name']");
  const complexity = event.target.querySelector("[name='complexity']");
  const description = event.target.querySelector("[name='description']");

  if (!validateForm(name, complexity)) {
    toast("Please fill all required fields");
    return;
  }

  const formData = {
    name: name.value.trim(),
    complexity: complexity.value.trim(),
    description: description.value.trim(),
  };

  try {
    const { alert, tricks: updatedTricks } = await trickApi.create(formData);

    tricks = updatedTricks;
    renderTricks();
    toast(alert);
    modal.close();
  } catch (error) {
    console.error(error);
  }
}

function validateForm(name, complexity) {
  return [name.value.trim(), complexity.value.trim()].every(Boolean);
}

function resetForm() {
  trickForm.reset();
  toggleFormVisibility();
}
