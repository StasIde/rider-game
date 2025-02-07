import { trickApi } from "../api/TrickApi.js";
import { toast } from "./utils.js";

const createTrickBtn = document.querySelector(".new-trick__btn");
const trickForm = document.querySelector(".new-trick__form");
const tricksList = document.querySelector(".tricks__list");
const nameInput = document.querySelector("[name='name']");
const complexityInput = document.querySelector("[name='complexity']");
const descriptionInput = document.querySelector("[name='description']");

let tricks = [];

document.addEventListener("DOMContentLoaded", initializeModule);
createTrickBtn.addEventListener("click", toggleFormVisibility);
trickForm.addEventListener("submit", handleFormSubmit);
tricksList.addEventListener("click", handleListClick);

async function initializeModule() {
  try {
    const response = await trickApi.getAll();
    tricks = response.tricks || [];
    renderTricks();
  } catch (error) {
    console.error(error);
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
      <li class="trick">
        <div class="trick__info">
          <div class="trick__name">Name: ${trick.name}</div>
          <div class="trick__complexity">Complexity: ${trick.complexity}</div>
        </div>
        <div class="trick__description">Description: ${trick.description}</div>
        <button class="trick__delete" data-id="${trick._id}">Delete</button>
      </li>
    `;
}

async function handleListClick(event) {
  const deleteBtn = event.target.closest(".trick__delete");
  if (!deleteBtn) return;

  try {
    const { alert, tricks: updatedTricks } = await trickApi.delete({
      id: deleteBtn.dataset.id,
    });

    tricks = updatedTricks;
    renderTricks();
    toast(alert);
  } catch (error) {
    console.error(error);
  }
}

function toggleFormVisibility() {
  trickForm.classList.toggle("show");
  createTrickBtn.textContent = trickForm.classList.contains("show")
    ? "close form"
    : "create trick";
}

async function handleFormSubmit(event) {
  event.preventDefault();

  if (!validateForm()) {
    toast("Please fill all required fields");
    return;
  }

  const formData = {
    name: nameInput.value.trim(),
    complexity: complexityInput.value.trim(),
    description: descriptionInput.value.trim(),
  };

  try {
    const { alert, tricks: updatedTricks } = await trickApi.create(formData);

    tricks = updatedTricks;
    renderTricks();
    toast(alert);
    resetForm();
  } catch (error) {
    console.error(error);
  }
}

function validateForm() {
  return [nameInput.value.trim(), complexityInput.value.trim()].every(Boolean);
}

function resetForm() {
  trickForm.reset();
  toggleFormVisibility();
}
