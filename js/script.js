const summonBtn = document.getElementById("summonBtn");
const attackBtn = document.getElementById("attackBtn");

const fighter1Div = document.getElementById("fighter1");
const fighter2Div = document.getElementById("fighter2");
const logDiv = document.getElementById("log");

let characters = [];
let fighter1;
let fighter2;
let currentTurn = 1;
let spells = [];

async function fetchCharacters() {
  try {
    const response = await fetch("https://hp-api.onrender.com/api/characters");
    const data = await response.json();

    characters = data.filter((character) => character.name && character.image);

    await fetchSpells();
    summonRandomFighters();
  } catch (error) {
    logDiv.innerHTML = "<p>Something went wrong.</p>";
  }
}

async function fetchSpells() {
  try {
    const response = await fetch("https://hp-api.onrender.com/api/spells");
    const data = await response.json();

    spells = data;
  } catch (error) {
    console.log("Error fetching spells:", error);
  }
}

function createFighter(character) {
  let type = "Student";
  let hp = 500;

  if (character.hogwartsStaff) {
    type = "Teacher";
    hp = 800;
  }

  return {
    ...character,
    type,
    hp,
  };
}

function summonRandomFighters() {
  let randomIndex1 = Math.floor(Math.random() * characters.length);
  let randomIndex2 = Math.floor(Math.random() * characters.length);

  while (randomIndex1 === randomIndex2) {
    randomIndex2 = Math.floor(Math.random() * characters.length);
  }

  fighter1 = createFighter(characters[randomIndex1]);
  fighter2 = createFighter(characters[randomIndex2]);

  currentTurn = 1;
  attackBtn.disabled = false;

  renderFighters();
  logDiv.innerHTML = `<p>${fighter1.name} and ${fighter2.name} are ready to battle!</p>`;
}

function renderFighters() {
  fighter1Div.innerHTML = `
    <h2>Wizard 1</h2>
    <img src="${fighter1.image}" alt="${fighter1.name}" width="150">
    <p>Name: ${fighter1.name}</p>
    <p>Type: ${fighter1.type}</p>
    <p>HP: ${fighter1.hp}</p>
  `;

  fighter2Div.innerHTML = `
    <h2>Wizard 2</h2>
    <img src="${fighter2.image}" alt="${fighter2.name}" width="150">
    <p>Name: ${fighter2.name}</p>
    <p>Type: ${fighter2.type}</p>
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
  if (!fighter1 || !fighter2) {
    logDiv.innerHTML = "<p>Summon fighters first.</p>";
    return;
  }

  if (fighter1.hp === 0 || fighter2.hp === 0) {
    logDiv.innerHTML = "<p>The battle is over. Summon new fighters.</p>";
    return;
  }

  if (spells.length === 0) {
    logDiv.innerHTML = "<p>Spells not loaded yet.</p>";
    return;
  }

  const randomSpell = spells[Math.floor(Math.random() * spells.length)];
  const isAvada = Math.random() < 0.05; // AVADA KEDAVRA

  let damage = Math.floor(Math.random() * 60) + 30;

  if (currentTurn === 1 && fighter1.type === "Teacher") {
    damage = Math.floor(damage * 1.1);
  }

  if (currentTurn === 2 && fighter2.type === "Teacher") {
    damage = Math.floor(damage * 1.1);
  }

  if (currentTurn === 1) {
    if (isAvada) {
      fighter2.hp = 0;
      renderFighters();
      logDiv.innerHTML = `<p>☠️ ${fighter1.name} casts AVADA KEDAVRA on ${fighter2.name}... instant death!</p>`;
      attackBtn.disabled = true;
      return;
    }

    fighter2.hp -= damage;
    if (fighter2.hp < 0) fighter2.hp = 0;

    renderFighters();

    if (fighter2.hp === 0) {
      logDiv.innerHTML = `<p>${fighter1.name} casts ${randomSpell.name} and hits ${fighter2.name} for ${damage} damage and wins!</p>`;
      attackBtn.disabled = true;
      return;
    }

    logDiv.innerHTML = `<p>${fighter1.name} casts ${randomSpell.name} and hits ${fighter2.name} for ${damage} damage!</p>`;
    currentTurn = 2;
  } else {
    if (isAvada) {
      fighter1.hp = 0;
      renderFighters();
      logDiv.innerHTML = `<p>☠️ ${fighter2.name} casts AVADA KEDAVRA on ${fighter1.name}... instant death!</p>`;
      attackBtn.disabled = true;
      return;
    }

    fighter1.hp -= damage;
    if (fighter1.hp < 0) fighter1.hp = 0;

    renderFighters();

    if (fighter1.hp === 0) {
      logDiv.innerHTML = `<p>${fighter2.name} casts ${randomSpell.name} and hits ${fighter1.name} for ${damage} damage and wins!</p>`;
      attackBtn.disabled = true;
      return;
    }

    logDiv.innerHTML = `<p>${fighter2.name} casts ${randomSpell.name} and hits ${fighter1.name} for ${damage} damage!</p>`;
    currentTurn = 1;
  }
});
