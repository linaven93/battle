const summonBtn = document.getElementById("summonBtn");
const attackBtn = document.getElementById("attackBtn");

const fighter1Div = document.getElementById("fighter1");
const fighter2Div = document.getElementById("fighter2");
const logDiv = document.getElementById("log");

let characters = [];

async function fetchCharacters() {
  try {
    const response = await fetch("https://hp-api.onrender.com/api/characters");
    const data = await response.json();

    characters = data.filter((character) => character.name && character.image);
    console.log(characters);

    summonRandomFighters();
  } catch (error) {
    console.log("Error:", error);
    logDiv.innerHTML = "<p>Something went wrong.</p>";
  }
}

function summonRandomFighters() {
  const randomIndex1 = Math.floor(Math.random() * characters.length);
  const randomIndex2 = Math.floor(Math.random() * characters.length);

  const fighter1 = characters[randomIndex1];
  const fighter2 = characters[randomIndex2];

  fighter1Div.innerHTML = `
    <h2>Wizard 1</h2>
    <img src="${fighter1.image}" alt="${fighter1.name}" width="150">
    <p>Name: ${fighter1.name}</p>
    <p>HP: 100</p>
  `;

  fighter2Div.innerHTML = `
    <h2>Wizard 2</h2>
    <img src="${fighter2.image}" alt="${fighter2.name}" width="150">
    <p>Name: ${fighter2.name}</p>
    <p>HP: 100</p>
  `;

  logDiv.innerHTML = `<p>${fighter1.name} and ${fighter2.name} are ready to battle!</p>`;
}

summonBtn.addEventListener("click", fetchCharacters);

attackBtn.addEventListener("click", () => {
  console.log("Attack clicked");
});
