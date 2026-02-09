const cards = document.querySelectorAll(".card");
cards.forEach((card) => {
  const delay = Number(card.dataset.index) * 80;
  setTimeout(() => card.classList.add("show"), delay);
});
