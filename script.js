let palabras = [];
let roles = [];
let jugadorActual = 0;
let totalJugadores = 0;
let viendoRol = false;
let faseDebate = false; // Agregamos esta variable para controlar el estado del juego

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
        errorMsg.textContent = "Demasiados impostores.";
        return;
    }
    if (palabras.length === 0) {
        errorMsg.textContent = "Cargando palabras, espera un segundo...";
        return;
    }

    errorMsg.textContent = "";
    const palabraSecreta = palabras[Math.floor(Math.random() * palabras.length)];

    roles = Array(totalJugadores).fill(palabraSecreta);
    for (let i = 0; i < numImpostores; i++) {
        roles[i] = "¡SOS EL IMPOSTOR! 🥸";
    }

    // Mezclar los roles
    roles.sort(() => Math.random() - 0.5);

    jugadorActual = 0;
    faseDebate = false; // Reiniciamos la fase por si es una partida nueva
    setupScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    actualizarUI();
});

tarjeta.addEventListener('click', () => {
    if (faseDebate || jugadorActual >= totalJugadores) return; 
    if (viendoRol) return; 
    viendoRol = true;

    const rol = roles[jugadorActual];
    mensajeTarjeta.textContent = rol;
    tarjeta.classList.add('revelada');

    if (rol === "¡SOS EL IMPOSTOR! 🥸") {
        tarjeta.classList.add('impostor');
    }

    btnSiguiente.classList.remove('hidden');
});

btnSiguiente.addEventListener('click', () => {
    // Si ya estábamos en la pantalla de debate, ahora sí mostramos el resultado
    if (faseDebate) {
        let indicesImpostores = [];
        roles.forEach((rol, i) => {
            if (rol === "¡SOS EL IMPOSTOR! 🥸") {
                indicesImpostores.push(i + 1);
            }
        });

        turnoText.textContent = "¡Fin del juego! 🚨";
        
        tarjeta.classList.remove('hidden'); 
        tarjeta.classList.add('revelada', 'impostor'); 
        
        const textoImpostores = indicesImpostores.length > 1 ? 'Los impostores eran' : 'El impostor era';
        mensajeTarjeta.innerHTML = `${textoImpostores}:<br><strong>Jugador ${indicesImpostores.join(', ')}</strong>`;
        
        btnSiguiente.textContent = "Volver a jugar";
        btnSiguiente.onclick = () => location.reload();
        return; // Cortamos la ejecución acá
    }

    // Lógica normal para pasar de un jugador al otro
    jugadorActual++;
    viendoRol = false;

    tarjeta.classList.remove('revelada', 'impostor');
    mensajeTarjeta.textContent = "Toca para ver tu rol";
    btnSiguiente.classList.add('hidden');

    if (jugadorActual >= totalJugadores) {
        // --- NUEVA PANTALLA: SOLO DEBATE ---
        faseDebate = true; // Activamos la pausa
        turnoText.textContent = "¡A debatir! 🗣️";
        
        tarjeta.classList.add('hidden'); // Escondemos el cuadrado para que no moleste
        
        btnSiguiente.textContent = "Revelar Impostores"; // Botón intermedio
        btnSiguiente.classList.remove('hidden');
    } else {
        actualizarUI();
    }
});

function actualizarUI() {
    turnoText.textContent = `Jugador ${jugadorActual + 1}`;
}
