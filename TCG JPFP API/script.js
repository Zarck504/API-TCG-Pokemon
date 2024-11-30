// API key y URL base de la API de Pokémon TCG
const apiKey = '703699c7-9163-4d2a-bf70-847c6e29ca68';
const baseUrl = 'https://api.pokemontcg.io/v2/cards';
let loadedCardIds = new Set(); // Conjunto para rastrear los ID de cartas ya cargadas
let allCards = []; // Array global para almacenar todas las cartas cargadas

// Función para cargar cartas de la API
async function fetchCards(limit = 10) {
  try {
    const response = await fetch(`${baseUrl}?limit=100`, {
      headers: {
        'X-Api-Key': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener las cartas');
    }

    const data = await response.json();
    const cardData = data.data;
    const newCards = [];

    // Filtrar cartas para asegurarse de que no se repitan
    while (newCards.length < limit) {
      const randomCard = cardData[Math.floor(Math.random() * cardData.length)];
      if (!loadedCardIds.has(randomCard.id)) {
        loadedCardIds.add(randomCard.id);
        newCards.push(randomCard);
      }
    }

    // Añadir las nuevas cartas al array global `allCards`
    allCards = allCards.concat(newCards);
    displayCards(newCards);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Función para mostrar las cartas en la página
function displayCards(cards) {
  const main = document.querySelector('main');
  cards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.innerHTML = `
      <img src="${card.images.small}" alt="${card.name}" />
      <h3>${card.name}</h3>
    `;
    cardElement.addEventListener('click', () => showDetails(card));
    main.appendChild(cardElement);
  });
}

// Mostrar detalles de una carta específica al hacer clic
function showDetails(card) {
  const modal = document.querySelector('.modal');
  const modalContent = document.querySelector('.modal-content');
  modalContent.innerHTML = `
    <button class="close-button" onclick="closeModal()">×</button>
    <img src="${card.images.large}" alt="${card.name}" />
    <h2>${card.name}</h2>
    <p>${card.desc || 'albion online es un mmorpg no lineal en el que escribes tu propia historia sin limitarte a seguir un camino prefijado, explora un amplio mundo abierto con cinco biomas unicos, todo cuanto hagas tendra su repercusíon en el mundo, con su economia orientada al jugador de albion los jugadores crean practicamente todo el equipo a partir de los recursos que consiguen, el equipo que llevas define quien eres, cambia de arma y armadura para pasar de caballero a mago o juego como una mezcla de ambas clases, aventurate en el mundo abierto y haz frente a los habitantes y las criaturas de albion, inicia expediciones o adentrate en mazmorras en las que encontraras enemigos aun mas dificiles, enfrentate a otros jugadores en encuentros en el mundo abierto, lucha por los territorios o por ciudades enteras en batallas tacticas, relajate en tu isla privada donde podras construir un hogar, cultivar cosechas, criar animales, unete a un gremio, todo es mejor cuando se trabaja en grupo [musica] adentrate ya en el mundo de albion y escribe tu propia historia.'}</p>
  `;
  modal.style.display = 'block';
}

// Cerrar el modal
function closeModal() {
  document.querySelector('.modal').style.display = 'none';
}

// Cargar más cartas al hacer clic en el botón
document.getElementById('load-more').addEventListener('click', () => {
  fetchCards(10);
});

// Cargar las cartas iniciales al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  fetchCards(10);
});

// Función de búsqueda para filtrar y mostrar cartas según la consulta
document.getElementById('search-btn').addEventListener('click', () => {
  const query = document.getElementById('search-input').value.toLowerCase();
  console.log('Búsqueda:', query); // Depuración para ver el valor de la búsqueda
  searchCards(query);
});

function searchCards(query) {
  const main = document.querySelector('main');
  main.innerHTML = ''; // Limpiar las cartas mostradas

  // Filtrar las cartas según la entrada de búsqueda
  const filteredCards = allCards.filter(card => card.name.toLowerCase().includes(query));

  // Mostrar las cartas filtradas
  if (filteredCards.length > 0) {
    displayCards(filteredCards);
  } else {
    main.innerHTML = '<p>No se encontraron cartas que coincidan con la búsqueda.</p>';
  }
}
