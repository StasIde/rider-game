document.addEventListener("DOMContentLoaded", () => {
  const game = localStorage.getItem("game");
  const linksList = document.querySelectorAll(".main__item");

  if (game && linksList.length > 0) {
    linksList[0].classList.add("active");
  } else {
    linksList[0].classList.remove("active");
  }
});
