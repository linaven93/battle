const summonBtn = document.getElementById("summonBtn");
const attackBtn = document.getElementById("attackBtn");

const fighter1Div = document.getElementById("fighter1");
const fighter2Div = document.getElementById("fighter2");
const logDiv = document.getElementById("log");

let characters = [];
let fighter1;
let fighter2;
let currentTurn = 1;

async function fetchCharacters() {
  try {
    const response = await fetch("https://hp-api.onrender.com/api/characters");
    const data = await response.json();

    characters = data.filter((character) => character.name && character.image);

    summonRandomFighters();
  } catch (error) {
    logDiv.innerHTML = "<p>Something went wrong.</p>";
  }
}

function summonRandomFighters() {
  let randomIndex1 = Math.floor(Math.random() * characters.length);
  let randomIndex2 = Math.floor(Math.random() * characters.length);

  while (randomIndex1 === randomIndex2) {
    randomIndex2 = Math.floor(Math.random() * characters.length);
  }

  fighter1 = { ...characters[randomIndex1], hp: 100 };
  fighter2 = { ...characters[randomIndex2], hp: 100 };
  currentTurn = 1;

  renderFighters();
  logDiv.innerHTML = `<p>${fighter1.name} and ${fighter2.name} are ready to battle!</p>`;
}

function renderFighters() {
  fighter1Div.innerHTML = `
    <h2>Wizard 1</h2>
    <img src="${fighter1.image}" alt="${fighter1.name}" width="150">
    <p>Name: ${fighter1.name}</p>
    <p>HP: ${fighter1.hp}</p>
  `;

  fighter2Div.innerHTML = `
    <h2>Wizard 2</h2>
    <img src="${fighter2.image}" alt="${fighter2.name}" width="150">
    <p>Name: ${fighter2.name}</p>
    <p>HP: ${fighter2.hp}</p>
  `;
}

summonBtn.addEventListener("click", () => {
  if (characters.length === 0) {
    fetchCharacters();
  } else {
    summonRandomFighters();
  }
});

attackBtn.addEventListener("click", () => {
  if (!fighter1 || !fighter2) return;

  if (fighter1.hp === 0 || fighter2.hp === 0) {
    logDiv.innerHTML = "<p>The battle is over. Summon new fighters.</p>";
    return;
  }

  const damage = Math.floor(Math.random() * 20) + 5;

  if (currentTurn === 1) {
    fighter2.hp -= damage;
    if (fighter2.hp < 0) fighter2.hp = 0;

    renderFighters();

    if (fighter2.hp === 0) {
      logDiv.innerHTML = `<p>${fighter1.name} hits ${fighter2.name} for ${damage} damage and wins!</p>`;
      return;
    }

    logDiv.innerHTML = `<p>${fighter1.name} hits ${fighter2.name} for ${damage} damage!</p>`;
    currentTurn = 2;
  } else {
    fighter1.hp -= damage;
    if (fighter1.hp < 0) fighter1.hp = 0;

    renderFighters();

    if (fighter1.hp === 0) {
      logDiv.innerHTML = `<p>${fighter2.name} hits ${fighter1.name} for ${damage} damage and wins!</p>`;
      return;
    }

    logDiv.innerHTML = `<p>${fighter2.name} hits ${fighter1.name} for ${damage} damage!</p>`;
    currentTurn = 1;
  }
});
