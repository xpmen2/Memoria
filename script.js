document.addEventListener('DOMContentLoaded', () => {
    // --- Configuración y Variables ---
    const symbols = ['🍎', '🍌', '🍒', '🍓', ' G', ' H', ' M', ' P']; // 8 símbolos base
    let cardSymbols = [...symbols, ...symbols]; // Duplica para tener parejas
    const gameBoard = document.getElementById('gameBoard');
    const statusDiv = document.getElementById('status');
    const resetButton = document.getElementById('resetButton');
    const totalPairs = symbols.length;

    let flippedCards = []; // Almacena las 2 cartas volteadas temporalmente
    let matchedPairs = 0;  // Contador de parejas encontradas
    let attempts = 0;      // Contador de intentos
    let canFlip = true;    // Controla si el jugador puede voltear cartas

    // --- Funciones del Juego ---

    // Función para barajar un array (Algoritmo Fisher-Yates)
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Intercambio
        }
        return array;
    }

    // Función para crear y mostrar el tablero
    function createBoard() {
        gameBoard.innerHTML = ''; // Limpia el tablero anterior
        flippedCards = [];
        matchedPairs = 0;
        attempts = 0;
        canFlip = true;
        updateStatus(); // Actualiza el estado inicial

        const shuffledSymbols = shuffle([...cardSymbols]); // Baraja una copia

        shuffledSymbols.forEach(symbol => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.value = symbol; // Guarda el símbolo en un atributo data-*

            // NO mostramos el símbolo aquí, solo en el volteo

            card.addEventListener('click', handleCardClick);
            gameBoard.appendChild(card);
        });
    }

    // Manejador de clic en una carta
    function handleCardClick(event) {
        const clickedCard = event.target;

        // Condiciones para NO voltear:
        // 1. No se puede voltear ahora (esperando animación o ya hay 2)
        // 2. La carta ya está volteada o ya es parte de una pareja
        // 3. Ya hay 2 cartas volteadas esperando comparación
        if (!canFlip ||
            clickedCard.classList.contains('flipped') ||
            clickedCard.classList.contains('matched') ||
            flippedCards.length >= 2) {
            return;
        }

        // Voltear la carta
        clickedCard.classList.add('flipped');
        clickedCard.textContent = clickedCard.dataset.value; // Muestra el símbolo
        flippedCards.push(clickedCard);

        // Si se han volteado 2 cartas, comprobar si son pareja
        if (flippedCards.length === 2) {
            canFlip = false; // Bloquea más clics temporalmente
            attempts++;      // Incrementa el contador de intentos
            updateStatus();
            checkForMatch();
        }
    }

    // Comprueba si las dos cartas volteadas son pareja
    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.value === card2.dataset.value;

        if (isMatch) {
            handleMatch(card1, card2);
        } else {
            handleMismatch(card1, card2);
        }
    }

    // Maneja el caso de encontrar una pareja
    function handleMatch(card1, card2) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        // Opcional: quitar la clase 'flipped' si 'matched' tiene su propio estilo
        // card1.classList.remove('flipped');
        // card2.classList.remove('flipped');

        matchedPairs++;
        flippedCards = []; // Resetea las cartas volteadas
        canFlip = true;    // Permite voltear de nuevo
        updateStatus();

        // Comprueba si se ha ganado el juego
        if (matchedPairs === totalPairs) {
            setTimeout(() => { // Pequeña pausa antes de la alerta
                 alert(`¡Felicidades! ¡Has encontrado todas las parejas en ${attempts} intentos!`);
             }, 500);
        }
    }

    // Maneja el caso de NO encontrar una pareja
    function handleMismatch(card1, card2) {
        // Espera un tiempo antes de volver a ocultarlas
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = ''; // Oculta el símbolo
            card2.textContent = ''; // Oculta el símbolo
            flippedCards = []; // Resetea las cartas volteadas
            canFlip = true;    // Permite voltear de nuevo
        }, 1000); // 1000 ms = 1 segundo
    }

    // Actualiza el texto de estado
    function updateStatus() {
        statusDiv.textContent = `Intentos: ${attempts} | Parejas encontradas: ${matchedPairs} / ${totalPairs}`;
    }

    // --- Inicialización ---
    resetButton.addEventListener('click', createBoard); // Asigna función al botón
    createBoard(); // Crea el tablero por primera vez al cargar la página

}); // Fin del DOMContentLoaded