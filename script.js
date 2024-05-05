const container = document.querySelector('.container');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

// Fetch Pokemon data from the API with a limit of 1004
fetch('https://pokeapi.co/api/v2/pokemon?limit=1004')
    .then(response => response.json())
    .then(data => {
        const pokemonList = data.results;
        pokemonList.forEach(pokemon => {
            fetchPokemonDetails(pokemon.url);
        });
    });

// Function to fetch individual Pokemon details
function fetchPokemonDetails(url) {
    fetch(url)
        .then(response => response.json())
        .then(pokemonData => {
            displayPokemon(pokemonData);
        });
}

// Function to display Pokemon
function displayPokemon(pokemonData) {
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');

    const pokemonImage = document.createElement('img');
    pokemonImage.src = pokemonData.sprites.front_default;
    pokemonImage.alt = pokemonData.name;

    const pokemonName = document.createElement('h3');
    pokemonName.textContent = `Name: ${capitalizeFirstLetter(pokemonData.name)}`;

    const pokemonDetails = document.createElement('div');
    pokemonDetails.classList.add('pokemon-details');

    const pokemonWeight = document.createElement('p');
    pokemonWeight.classList.add('pokemon-weight');
    pokemonWeight.textContent = `Weight: ${pokemonData.weight / 10} kg`;

    const pokemonHeight = document.createElement('p');
    pokemonHeight.classList.add('pokemon-height');
    pokemonHeight.textContent = `Height: ${pokemonData.height / 10} m`;

    pokemonDetails.appendChild(pokemonWeight);
    pokemonDetails.appendChild(pokemonHeight);

    pokemonCard.appendChild(pokemonImage);
    pokemonCard.appendChild(pokemonName);
    pokemonCard.appendChild(pokemonDetails);

    // Add event listener to show more details when clicked
    pokemonCard.addEventListener('click', () => {
        showPokemonDetails(pokemonData);
    });

    container.appendChild(pokemonCard); 
}

// Add this CSS to style the detail containers
const style = document.createElement('style');
style.textContent = `
    .details-container {
        border: 2px solid white; /* White border */
        margin-top: 10px;
        padding: 10px;
        background-color: #333; /* Grey background color */
        transition: border-color 0.3s; /* Smooth transition for hover effect */
        width: 100%; /* Set the width to 100% */
        max-width: 800px; /* Set the maximum width */
    }

    .details-container:hover {
        border-color: transparent; /* Change border color to transparent on hover */
    }
`;
document.head.appendChild(style);


// Function to show more details when a Pokemon card is clicked
async function showPokemonDetails(pokemonData) {
    // Create elements to display detailed information
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('pokemon-details-container');

    const backButton = document.createElement('button');
    backButton.textContent = 'Back to List';
    backButton.addEventListener('click', () => {
        // Navigate back to the list page
        window.location.href = 'index.html'; 
    });

    const name = document.createElement('h2');
    name.textContent = capitalizeFirstLetter(pokemonData.name);

    const image = document.createElement('img');
    image.src = pokemonData.sprites.front_default;
    image.alt = pokemonData.name;

    const weight = document.createElement('p');
    weight.textContent = `Weight: ${pokemonData.weight / 10} kg`;

    const height = document.createElement('p');
    height.textContent = `Height: ${pokemonData.height / 10} m`;

    detailsContainer.appendChild(backButton);
    detailsContainer.appendChild(name);
    detailsContainer.appendChild(image);
    detailsContainer.appendChild(weight);
    detailsContainer.appendChild(height);

    container.innerHTML = '';
    container.appendChild(detailsContainer);

    // Fetch abilities data
    const abilitiesContainer = document.createElement('div');
    abilitiesContainer.classList.add('details-container');
    const abilitiesTitle = document.createElement('h3');
    abilitiesTitle.textContent = 'Abilities';
    abilitiesContainer.appendChild(abilitiesTitle);
    const abilitiesList = await getAbilities(pokemonData.abilities);
    const abilities = document.createElement('p');
    abilities.textContent = abilitiesList;
    abilitiesContainer.appendChild(abilities);
    container.appendChild(abilitiesContainer);

    // Fetch types data
    const typesContainer = document.createElement('div');
    typesContainer.classList.add('details-container');
    const typesTitle = document.createElement('h3');
    typesTitle.textContent = 'Types';
    typesContainer.appendChild(typesTitle);
    const typesList = await getTypes(pokemonData.types);
    const types = document.createElement('p');
    types.textContent = typesList;
    typesContainer.appendChild(types);
    container.appendChild(typesContainer);

    // Fetch evolution chain data
    const evolutionContainer = document.createElement('div');
    evolutionContainer.classList.add('details-container');
    const evolutionTitle = document.createElement('h3');
    evolutionTitle.textContent = 'Evolution Chain';
    evolutionContainer.appendChild(evolutionTitle);
    const evolutionChainData = await fetchEvolutionChain(pokemonData.species.url);
    const evolutionChain = document.createElement('p');
    evolutionChain.textContent = parseEvolutionChain(evolutionChainData.chain);
    evolutionContainer.appendChild(evolutionChain);
    container.appendChild(evolutionContainer);

    // Fetch moves data
    const movesContainer = document.createElement('div');
    movesContainer.classList.add('details-container');
    const movesTitle = document.createElement('h3');
    movesTitle.textContent = 'Moves';
    movesContainer.appendChild(movesTitle);
    const movesList = await getMoves(pokemonData.moves);
    const moves = document.createElement('p');
    moves.textContent = movesList;
    movesContainer.appendChild(moves);
    container.appendChild(movesContainer);
}

// Function to fetch abilities data
async function getAbilities(abilities) {
    const abilityNames = [];
    for (const ability of abilities) {
        const response = await fetch(ability.ability.url);
        const data = await response.json();
        abilityNames.push(data.name);
    }
    return `Abilities: ${abilityNames.join(', ')}`;
}

// Function to fetch types data
async function getTypes(types) {
    const typeNames = [];
    for (const type of types) {
        const response = await fetch(type.type.url);
        const data = await response.json();
        typeNames.push(data.name);
    }
    return `Types: ${typeNames.join(', ')}`;
}

// Function to fetch evolution chain data
async function fetchEvolutionChain(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Function to parse evolution chain data
function parseEvolutionChain(chain) {
    let evolutionChain = '';
    if (chain && chain.evolves_to.length > 0) {
        evolutionChain += capitalizeFirstLetter(chain.species.name);
        let evolvesTo = chain.evolves_to;
        while (evolvesTo.length > 0) {
            evolutionChain += ' -> ' + capitalizeFirstLetter(evolvesTo[0].species.name);
            evolvesTo = evolvesTo[0].evolves_to;
        }
    }
    return evolutionChain || 'No evolution chain found.';
}


// Function to fetch moves data
async function getMoves(moves) {
    const moveNames = moves.map(move => move.move.name);
    return `Moves: ${moveNames.join(', ')}`;
}


// Function to filter Pokemon based on search input
function filterPokemon(searchTerm) {
    const pokemonCards = document.querySelectorAll('.pokemon-card');
    pokemonCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        if (name.includes(searchTerm.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Event listener for search button click
searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    filterPokemon(searchTerm);
});

// Event listener for search input keyup (to filter in real-time)
searchInput.addEventListener('keyup', () => {
    const searchTerm = searchInput.value.trim();
    filterPokemon(searchTerm);
});