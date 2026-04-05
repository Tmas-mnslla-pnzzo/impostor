let palabras = [];
let roles = [];
let jugadorActual = 0;
let totalJugadores = 0;
let viendoRol = false;

const setupScreen = document.getElementById('setup');
const gameScreen = document.getElementById('game');
const inputJugadores = document.getElementById('jugadores');
const inputImpostores = document.getElementById('impostores');
const btnJugar = document.getElementById('btn-jugar');
const errorMsg = document.getElementById('error-msg');
const turnoText = document.getElementById('turno-text');
const tarjeta = document.getElementById('tarjeta');
const mensajeTarjeta = document.getElementById('mensaje-tarjeta');
const btnSiguiente = document.getElementById('btn-siguiente');

// Cargar el listado de palabras desde el JSON
fetch('palabras.json')
    .then(response => response.json())
    .then(data => palabras = data.palabras)
    .catch(err => {
        console.error("Error cargando palabras", err);
        errorMsg.textContent = "Error al cargar las palabras.";
    });

btnJugar.addEventListener('click', () => {
    totalJugadores = parseInt(inputJugadores.value);
    const numImpostores = parseInt(inputImpostores.value);

    if (numImpostores >= totalJugadores) {
        errorMsg.textContent = "Debe haber menos impostores que jugadores.";
        return;
    }
    if (palabras.length === 0) {
        errorMsg.textContent = "Cargando palabras, espera un segundo...";
        return;
    }

    errorMsg.textContent = "";
    iniciarJuego(totalJugadores, numImpostores);
});

function iniciarJuego(jugadores, impostores) {
    // 1. Seleccionar una palabra aleatoria
    const palabraSecreta = palabras[Math.floor(Math.random() * palabras.length)];

    // 2. Crear el array de roles
    roles = Array(jugadores).fill(palabraSecreta);
    for (let i = 0; i < impostores; i++) {
        roles[i] = "¡SOS EL IMPOSTOR!";
    }

    // 3. Mezclar los roles aleatoriamente (Algoritmo Fisher-Yates)
    for (let i = roles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [roles[i], roles[j]] = [roles[j], roles[i]];
    }

    // 4. Cambiar de pantalla
    jugadorActual = 0;
    setupScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    actualizarUI();
}

// Usamos 'click' que en móviles modernos responde perfectamente al toque
tarjeta.addEventListener('click', () => {
    if (viendoRol) return; // Si ya lo está viendo, no hacer nada
    viendoRol = true;

    const rol = roles[jugadorActual];
    mensajeTarjeta.textContent = rol;
    tarjeta.classList.add('revelada');

    if (rol === "¡SOS EL IMPOSTOR!") {
        tarjeta.classList.add('impostor');
    }

    btnSiguiente.classList.remove('hidden');
});

btnSiguiente.addEventListener('click', () => {
    jugadorActual++;
    viendoRol = false;

    // Resetear la tarjeta para el próximo jugador
    tarjeta.classList.remove('revelada', 'impostor');
    mensajeTarjeta.textContent = "Toca para ver tu rol";
    btnSiguiente.classList.add('hidden');

    if (jugadorActual >= totalJugadores) {
        // Fin de los turnos
        turnoText.textContent = "¡A debatir!";
        tarjeta.classList.add('hidden');
        btnSiguiente.textContent = "Volver a jugar";
        btnSiguiente.classList.remove('hidden');
        btnSiguiente.onclick = () => location.reload();
    } else {
        actualizarUI();
    }
});

function actualizarUI() {
    turnoText.textContent = `Jugador ${jugadorActual + 1}`;
}
