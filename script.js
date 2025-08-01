// Elementos del DOM
const newGameBtn = document.getElementById("new-game");
const continueBtn = document.getElementById("continue");
const optionsBtn = document.getElementById("options-btn");
const exitBtn = document.getElementById("exit");
const optionsMenu = document.getElementById("options-menu");
const closeOptionsBtn = document.getElementById("close-options");
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const bgMusic = document.getElementById("bg-music");
const musicVolume = document.getElementById("music-volume");
const saveSlots = document.querySelectorAll(".save-slot");
const loadSlots = document.querySelectorAll(".load-slot");
const warningModal = document.getElementById("warning-modal");
const acceptWarningBtn = document.getElementById("accept-warning");
const declineWarningBtn = document.getElementById("decline-warning");

// Estado del juego
let gameState = {
    currentScene: 0,
    volume: 0.7,
    savedGames: {},
    warningAccepted: false
};

// ==================== SISTEMA DE MENSAJES ==================== //
/**
 * Muestra un mensaje estilo medieval
 * @param {string} title - Título del mensaje
 * @param {string} message - Contenido del mensaje
 * @param {boolean} isError - Si es un mensaje de error
 */
function showMedievalMessage(title, message, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'medieval-message';
    if (isError) messageDiv.classList.add('error');
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <h3><i class="fas ${isError ? 'fa-skull' : 'fa-scroll'}"></i> ${title}</h3>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 1000);
    }, 3000);
}

/**
 * Muestra la confirmación de salida del juego
 */
function showExitConfirmation() {
    const exitDiv = document.createElement('div');
    exitDiv.className = 'exit-message';
    exitDiv.innerHTML = `
        <div class="exit-message-content">
            <h2><i class="fas fa-door-open"></i> ABANDONAR EL REINO</h2>
            <p>Si decides marcharte ahora, tu nombre será tachado de los registros reales...</p>
            <div class="exit-message-buttons">
                <button class="exit-message-btn confirm" id="confirm-exit">
                    <i class="fas fa-skull"></i> Abandonar
                </button>
                <button class="exit-message-btn cancel" id="cancel-exit">
                    <i class="fas fa-shield-alt"></i> Permanecer
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(exitDiv);

    document.getElementById('confirm-exit').addEventListener('click', () => {
        exitDiv.style.animation = "fadeToBlack 2s forwards";
        setTimeout(() => window.close(), 2000);
    });

    document.getElementById('cancel-exit').addEventListener('click', () => {
        exitDiv.classList.add('shake');
        setTimeout(() => exitDiv.remove(), 500);
    });
}

// ==================== SISTEMA DE ADVERTENCIAS ==================== //
function showWarningModal() {
    warningModal.style.display = "flex";
    bgMusic.pause();
    document.body.style.backgroundImage = "url('img/dark-castle.jpg')";
}

function hideWarningModal() {
    warningModal.style.display = "none";
    document.body.style.backgroundImage = "url('img/medieval-bg.jpg')";
    bgMusic.volume = gameState.volume;
    bgMusic.play().catch(e => console.log("Error al reanudar música:", e));
    localStorage.setItem('warningAccepted', 'true');
}

// ==================== SISTEMA DE JUEGO ==================== //
function startNewGame() {
    const messages = [
        "¡Que los dioses guíen tu camino!",
        "¡La leyenda comienza!",
        "¡El reino clama por un héroe!",
        "¡Que el valor guíe tu espada!"
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    showMedievalMessage("Nueva Crónica", randomMsg);
    // Aquí iría la lógica para iniciar el juego
}

function continueGame() {
    const savedData = localStorage.getItem('warGameSave_LAST');
    if (savedData) {
        gameState = JSON.parse(savedData);
        showMedievalMessage("Crónica Recuperada", "Retomando donde el destino te dejó...");
        // Aquí iría la lógica para continuar
    } else {
        showMedievalMessage("Sin Registros", "No hay crónicas anteriores para continuar.", true);
    }
}

// ==================== EVENT LISTENERS ==================== //
// Menú principal
newGameBtn.addEventListener("click", () => {
    if (!localStorage.getItem('warningAccepted')) {
        showWarningModal();
    } else {
        startNewGame();
    }
});

continueBtn.addEventListener("click", continueGame);

exitBtn.addEventListener("click", showExitConfirmation);

// Menú de opciones
optionsBtn.addEventListener("click", () => optionsMenu.style.display = "block");
closeOptionsBtn.addEventListener("click", () => optionsMenu.style.display = "none");

// Pestañas
tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));
        
        btn.classList.add("active");
        const tabId = btn.getAttribute("data-tab");
        document.getElementById(`${tabId}-tab`).classList.add("active");
    });
});

// Volumen
musicVolume.addEventListener("input", (e) => {
    bgMusic.volume = e.target.value;
    gameState.volume = e.target.value;
});

// Guardar partida
saveSlots.forEach(slot => {
    slot.addEventListener("click", () => {
        const slotNum = slot.getAttribute("data-slot");
        gameState.savedGames[slotNum] = { /* datos del juego */ };
        localStorage.setItem(`warGameSave_${slotNum}`, JSON.stringify(gameState));
        showMedievalMessage("Crónica Guardada", `Tomo ${slotNum} archivado en la biblioteca real`);
    });
});

// Cargar partida
loadSlots.forEach(slot => {
    slot.addEventListener("click", () => {
        const slotNum = slot.getAttribute("data-slot");
        const savedData = localStorage.getItem(`warGameSave_${slotNum}`);
        if (savedData) {
            gameState = JSON.parse(savedData);
            showMedievalMessage("Tomo Recuperado", `Crónica ${slotNum} despertada de su sueño`);
        } else {
            showMedievalMessage("Tomo Vacío", "Este pergamino está en blanco", true);
        }
    });
});

// Sistema de advertencias
acceptWarningBtn.addEventListener("click", () => {
    hideWarningModal();
    startNewGame();
});

declineWarningBtn.addEventListener("click", showExitConfirmation);

// Iniciar música después de interacción del usuario
document.body.addEventListener("click", () => {
    bgMusic.volume = gameState.volume;
    bgMusic.play().catch(e => console.log("Error al iniciar música:", e));
}, { once: true });

// Verificar advertencia al cargar
document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem('warningAccepted')) {
        setTimeout(showWarningModal, 1000);
    }
});

// Verificación de carga de imagen
const bg = new Image();
bg.src = 'img/medieval-bg.jpg';
bg.onload = () => console.log('Imagen cargada correctamente');
bg.onerror = () => console.error('Error al cargar imagen');