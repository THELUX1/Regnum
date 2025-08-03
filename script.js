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

// Sistema de sonidos
const soundSystem = {
    sounds: {
        button: new Audio("sounds/button-click.mp3"),
        tab: new Audio("sounds/page-turn.mp3"),
        open: new Audio("sounds/door-open.mp3"),
        close: new Audio("sounds/door-close.mp3"),
        error: new Audio("sounds/error.mp3")
    },
    
    preloadSounds: function() {
        for (const key in this.sounds) {
            if (this.sounds.hasOwnProperty(key)) {
                this.sounds[key].preload = "auto";
                this.sounds[key].load();
                if (key === "button" || key === "tab") {
                    this.sounds[key].addEventListener('canplaythrough', () => {
                        this[`${key}Buffer`] = this.sounds[key].cloneNode();
                    });
                }
            }
        }
    },
    
    play: function(soundName, volume = 1) {
        try {
            const sound = (soundName === "button" && this.buttonBuffer) ? 
                this.buttonBuffer : 
                (soundName === "tab" && this.tabBuffer) ? 
                this.tabBuffer : 
                this.sounds[soundName];
            
            if (!sound) return;
            
            sound.volume = volume;
            sound.currentTime = 0;
            
            const promise = sound.play();
            
            if (promise !== undefined) {
                promise.catch(error => {
                    console.log("Fallback to normal sound playback");
                    this.sounds[soundName].currentTime = 0;
                    this.sounds[soundName].play();
                });
            }
        } catch (e) {
            console.log("Sound play error:", e);
        }
    }
};

// Precargar sonidos al iniciar
soundSystem.preloadSounds();

// Estado del juego
let gameState = {
    currentScene: 0,
    currentNovelScene: 0,
    volume: 0.7,
    savedGames: {},
    warningAccepted: localStorage.getItem('warningAccepted') === 'true'
};

// Manejar redimensionamiento
function handleResize() {
    const optionsMenu = document.getElementById("options-menu");
    if (window.innerWidth < 768) {
        optionsMenu.style.width = "95%";
        optionsMenu.style.height = "90vh";
    } else {
        optionsMenu.style.width = "80%";
        optionsMenu.style.height = "80vh";
    }
}

// Mostrar mensaje medieval
function showMedievalMessage(title, message, isError = false) {
    isError ? soundSystem.play("error", 0.7) : soundSystem.play("button", 0.5);
    
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

// Confirmación de salida
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
        soundSystem.play("close");
        exitDiv.style.animation = "fadeToBlack 2s forwards";
        setTimeout(() => window.close(), 2000);
    });

    document.getElementById('cancel-exit').addEventListener('click', () => {
        soundSystem.play("button");
        exitDiv.classList.add('shake');
        setTimeout(() => exitDiv.remove(), 500);
    });
}

// Mostrar advertencia
function showWarningModal() {
    if (!warningModal) {
        console.error("Elemento warning-modal no encontrado en el DOM");
        return;
    }
    
    warningModal.style.display = "flex";
    bgMusic.pause();
    soundSystem.play("error", 0.8);
    document.body.style.backgroundImage = "url('img/dark-castle.jpg')";
    
    const warningAmbience = new Audio("sounds/wind-howling.mp3");
    warningAmbience.volume = 0.5;
    warningAmbience.loop = true;
    warningAmbience.id = "warning-ambience";
    warningAmbience.play().catch(e => console.log("Error al reproducir ambiente:", e));
}

// Ocultar advertencia
function hideWarningModal() {
    if (!warningModal) return;
    
    warningModal.style.display = "none";
    document.body.style.backgroundImage = "url('img/medieval-bg.gif')";
    bgMusic.volume = gameState.volume;
    bgMusic.play().catch(e => console.log("Error al reanudar música:", e));
    localStorage.setItem('warningAccepted', 'true');
    gameState.warningAccepted = true;
    
    const warningAmbience = document.getElementById("warning-ambience");
    if (warningAmbience) {
        warningAmbience.pause();
        warningAmbience.currentTime = 0;
    }
}

// Continuar juego
function continueGame() {
    const savedData = localStorage.getItem('warGameSave_LAST');
    if (savedData) {
        gameState = JSON.parse(savedData);
        showMedievalMessage("Crónica Recuperada", "Retomando donde el destino te dejó...");
        
        // Cargar datos de la novela y continuar desde la escena guardada
        if (typeof novelEngine !== 'undefined') {
            novelEngine.loadStory(novelData);
            novelEngine.start();
            novelEngine.currentScene = gameState.currentNovelScene || 0;
        }
    } else {
        showMedievalMessage("Sin Registros", "No hay crónicas anteriores para continuar.", true);
    }
}

// Nuevo juego
function startNewGame() {
    gameState = {
        currentScene: 0,
        currentNovelScene: 0,
        volume: 0.7,
        savedGames: {},
        warningAccepted: true
    };
    
    // Ocultar menú principal y comenzar novela
    document.querySelector('.menu-container').style.display = 'none';
    
    // Iniciar la novela visual si el motor está disponible
    if (typeof novelEngine !== 'undefined') {
        novelEngine.loadStory(novelData);
        novelEngine.start();
    }
    
    showMedievalMessage("Nueva Crónica", "Que comience tu leyenda...");
}

// Guardar partida
function saveGame(slotNum) {
    // Actualizar el estado de la novela si está activa
    if (typeof novelEngine !== 'undefined') {
        gameState.currentNovelScene = novelEngine.currentScene;
    }
    
    gameState.savedGames[slotNum] = { 
        date: new Date().toISOString(),
        scene: gameState.currentNovelScene
    };
    
    localStorage.setItem(`warGameSave_${slotNum}`, JSON.stringify(gameState));
    localStorage.setItem('warGameSave_LAST', JSON.stringify(gameState));
    
    showMedievalMessage("Crónica Guardada", `Tomo ${slotNum} archivado en la biblioteca real`);
}

// Cargar partida
function loadGame(slotNum) {
    const savedData = localStorage.getItem(`warGameSave_${slotNum}`);
    if (savedData) {
        soundSystem.play("button");
        gameState = JSON.parse(savedData);
        
        // Continuar la novela desde el punto guardado
        if (typeof novelEngine !== 'undefined') {
            novelEngine.loadStory(novelData);
            novelEngine.start();
            novelEngine.currentScene = gameState.currentNovelScene || 0;
        }
        
        showMedievalMessage("Tomo Recuperado", `Crónica ${slotNum} despertada de su sueño`);
    } else {
        soundSystem.play("error");
        showMedievalMessage("Tomo Vacío", "Este pergamino está en blanco", true);
    }
}

// ===== EVENT LISTENERS ACTUALIZADOS =====

// Menú principal
newGameBtn.addEventListener("click", () => {
    soundSystem.play("button");
    if (!gameState.warningAccepted) {
        showWarningModal();
    } else {
        startNewGame();
    }
});

continueBtn.addEventListener("click", () => {
    soundSystem.play("button");
    continueGame();
});

exitBtn.addEventListener("click", () => {
    soundSystem.play("button");
    showExitConfirmation();
});

// Menú de opciones (Consejo Real)
optionsBtn.addEventListener("click", () => {
    soundSystem.play("open");
    
    // Si estamos en modo novela, usar el método del motor
    if (typeof novelEngine !== 'undefined' && 
        novelEngine.elements.sceneContainer.style.display === 'block') {
        novelEngine.showRoyalCouncil();
    } else {
        // Mostrar el menú normal
        optionsMenu.style.display = "block";
    }
});

closeOptionsBtn.addEventListener("click", () => {
    soundSystem.play("close");
    optionsMenu.style.display = "none";
    
    // Restaurar visibilidad si venimos de la novela
    if (typeof novelEngine !== 'undefined') {
        novelEngine.elements.sceneContainer.style.visibility = 'visible';
    }
});

// Pestañas
tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        soundSystem.play("tab");
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
    
    // Actualizar volumen en el motor de novela si existe
    if (typeof novelEngine !== 'undefined') {
        novelEngine.gameState.bgmVolume = e.target.value;
    }
});

// Guardar partida
saveSlots.forEach(slot => {
    slot.addEventListener("click", () => {
        soundSystem.play("button");
        const slotNum = slot.getAttribute("data-slot");
        saveGame(slotNum);
    });
});

// Cargar partida
loadSlots.forEach(slot => {
    slot.addEventListener("click", () => {
        const slotNum = slot.getAttribute("data-slot");
        loadGame(slotNum);
    });
});

// Sistema de advertencias
acceptWarningBtn.addEventListener("click", () => {
    soundSystem.play("button");
    hideWarningModal();
});

declineWarningBtn.addEventListener("click", () => {
    soundSystem.play("button");
    showExitConfirmation();
});
// ===== MANEJO DE INSTALACIÓN PWA - Versión GitHub compatible =====
let deferredPrompt;
const installBtn = document.getElementById('install-app');

// Detectar si estamos en GitHub Pages
const isGitHubPages = window.location.host.includes('github.io');

// Mostrar el botón manualmente después de 10 segundos si es GitHub Pages
if (isGitHubPages) {
    setTimeout(() => {
        installBtn.style.display = 'flex';
        setTimeout(() => {
            installBtn.classList.add('visible');
        }, 100);
    }, 10000);
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Solo mostrar automáticamente si NO es GitHub Pages
    if (!isGitHubPages) {
        installBtn.style.display = 'flex';
        setTimeout(() => {
            installBtn.classList.add('visible');
        }, 100);
    }
});

installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) {
        if (isGitHubPages) {
            showMedievalMessage("Instrucciones", "Para instalar: 1) Usa Chrome/Edge 2) Haz clic en 'Instalar' en la barra de direcciones", false);
        }
        return;
    }
    
    installBtn.innerHTML = '<i class="fas fa-cog fa-spin"></i> Preparando...';
    
    try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            showMedievalMessage("Instalación Exitosa", "La app ahora está instalada", false);
        } else {
            showMedievalMessage("Instalación Cancelada", "Puedes instalarla después", true);
        }
    } catch (err) {
        console.error("Error al instalar:", err);
        showMedievalMessage("Error", "No se pudo instalar: " + err.message, true);
    }
    
    installBtn.innerHTML = '<i class="fas fa-download"></i> Instalar App';
    installBtn.style.display = 'none';
    deferredPrompt = null;
});

// Verificar si ya está instalado
window.addEventListener('appinstalled', () => {
    installBtn.style.display = 'none';
    console.log('PWA instalada correctamente');
});
// Inicialización
document.addEventListener("DOMContentLoaded", function() {
    handleResize();
    
    if (!gameState.warningAccepted) {
        setTimeout(showWarningModal, 1000);
    }
    
    // Música al primer click
    document.body.addEventListener("click", function initMusic() {
        bgMusic.volume = gameState.volume;
        bgMusic.play().catch(e => console.log("Error al iniciar música:", e));
        document.body.removeEventListener("click", initMusic);
    }, { once: true });
    
    // Cargar motor de novela visual si existe
    if (typeof novelEngine !== 'undefined') {
        novelEngine.loadStory(novelData);
    }
});

window.addEventListener('resize', handleResize);

// Verificación de carga de imagen
const bg = new Image();
bg.src = 'img/medieval-bg.jpg';
bg.onload = () => console.log('Imagen de fondo cargada correctamente');
bg.onerror = () => console.error('Error al cargar imagen de fondo');
// Al final de tu script.js
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registrado con éxito:', registration.scope);
            })
            .catch(error => {
                console.log('Error al registrar ServiceWorker:', error);
            });
    });
    }
        
