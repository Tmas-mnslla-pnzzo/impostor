btnSiguiente.addEventListener('click', () => {
    jugadorActual++;
    viendoRol = false;

    // Resetear la tarjeta para el próximo jugador
    tarjeta.classList.remove('revelada', 'impostor');
    mensajeTarjeta.textContent = "Toca para ver tu rol";
    btnSiguiente.classList.add('hidden');

    if (jugadorActual >= totalJugadores) {
        // --- NUEVA LÓGICA: REVELAR IMPOSTORES AL FINAL ---
        
        // Buscamos en qué posición (jugador) estaban los impostores
        let indicesImpostores = [];
        roles.forEach((rol, i) => {
            if (rol === "¡SOS EL IMPOSTOR! 🥸") {
                indicesImpostores.push(i + 1); // +1 para que coincida con "Jugador X"
            }
        });

        // Cambiamos el texto para mostrar quiénes eran
        turnoText.textContent = "¡A debatir! 🫣";
        
        // En lugar de ocultar la tarjeta, la usamos para mostrar el resultado
        tarjeta.classList.remove('hidden'); 
        tarjeta.classList.add('revelada', 'impostor'); // Color rojo de alerta
        
        const textoImpostores = indicesImpostores.length > 1 ? 'Los impostores eran' : 'El impostor era';
        mensajeTarjeta.innerHTML = `${textoImpostores}:<br><strong>Jugador ${indicesImpostores.join(', ')}</strong>`;
        
        // Botón para reiniciar
        btnSiguiente.textContent = "Volver a jugar";
        btnSiguiente.classList.remove('hidden');
        btnSiguiente.onclick = () => location.reload();
        
    } else {
        actualizarUI();
    }
});
