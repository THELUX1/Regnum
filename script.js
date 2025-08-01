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

// Estado del juego
let gameState = {
    currentScene: 0,
    volume: 0.7,
    savedGames: {}
};

// Mostrar/ocultar menú de opciones
optionsBtn.addEventListener("click", () => {
    optionsMenu.style.display = "block";
});

closeOptionsBtn.addEventListener("click", () => {
    optionsMenu.style.display = "none";
});

// Cambiar entre pestañas
tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));
        
        btn.classList.add("active");
        const tabId = btn.getAttribute("data-tab");
        document.getElementById(`${tabId}-tab`).classList.add("active");
    });
});

// Control de volumen
musicVolume.addEventListener("input", (e) => {
    bgMusic.volume = e.target.value;
    gameState.volume = e.target.value;
});

// Guardar partida
saveSlots.forEach(slot => {
    slot.addEventListener("click", () => {
        const slotNum = slot.getAttribute("data-slot");
        gameState.savedGames[slotNum] = { /* datos de juego */ };
        localStorage.setItem(`warGameSave_${slotNum}`, JSON.stringify(gameState));
        alert(`Partida guardada en posición ${slotNum}`);
    });
});

// Cargar partida
loadSlots.forEach(slot => {
    slot.addEventListener("click", () => {
        const slotNum = slot.getAttribute("data-slot");
        const savedData = localStorage.getItem(`warGameSave_${slotNum}`);
        if (savedData) {
            gameState = JSON.parse(savedData);
            alert(`Batalla reanudada desde posición ${slotNum}`);
        } else {
            alert("¡No hay registros de batalla en esta posición!");
        }
    });
});

// Iniciar música después de interacción del usuario
document.body.addEventListener("click", () => {
    bgMusic.volume = gameState.volume;
    bgMusic.play().catch(e => console.log("Error al iniciar música:", e));
}, { once: true });

// Botones principales
newGameBtn.addEventListener("click", () => {
    alert("¡Nueva campaña iniciada!");
});

continueBtn.addEventListener("click", () => {
    alert("Continuando última batalla...");
});

exitBtn.addEventListener("click", () => {
    if (confirm("¿Retirarse del campo de batalla?")) {
        window.close();
    }
});
// En script.js, prueba esto para verificar carga:
const bg = new Image();
bg.src = 'img/medieval-bg.jpg';
bg.onload = () => console.log('Imagen cargada correctamente');
bg.onerror = () => console.error('Error al cargar imagen');