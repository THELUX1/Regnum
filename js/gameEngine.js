// Estado del juego
let gameState = {
    currentScene: gameData.startScene,
    playerName: "Jugador",
    saveSlots: Array(6).fill(null),
    settings: {
        masterVolume: 50,
        musicVolume: 50,
        textSpeed: 5,
        musicEnabled: true,
        fullscreen: false
    }
};

// Elementos DOM
const loadingScreen = document.getElementById('loading-screen');
const mainMenu = document.getElementById('main-menu');
const gameScreen = document.getElementById('game-screen');
const saveLoadScreen = document.getElementById('save-load-screen');
const settingsScreen = document.getElementById('settings-screen');

const sceneBackground = document.getElementById('scene-background');
const characterName = document.getElementById('character-name');
const dialogueText = document.getElementById('dialogue-text');

// Botones principales
const newGameBtn = document.getElementById('new-game-btn');
const loadGameBtn = document.getElementById('load-game-btn');
const settingsBtn = document.getElementById('settings-btn');
const saveGameBtn = document.getElementById('save-game-btn');
const openMenuBtn = document.getElementById('open-menu-btn');
const backToMenuBtn = document.getElementById('back-to-menu-btn');
const backFromSettingsBtn = document.getElementById('back-from-settings');
const resetSettingsBtn = document.getElementById('reset-settings');

// Controles de pantalla completa
const fullscreenBtn = document.getElementById('fullscreen-btn');
const fullscreenGameBtn = document.getElementById('fullscreen-btn-game');
const fullscreenSettingsBtn = document.getElementById('fullscreen-settings-btn');

// Controles de audio
const backgroundMusic = document.getElementById('background-music');
const musicToggleBtn = document.getElementById('music-toggle');
const musicToggleGameBtn = document.getElementById('music-toggle-game');
const volumeControl = document.getElementById('volume-control');
const volumeSlider = document.getElementById('volume-slider');

// Controles de configuración
const masterVolumeSlider = document.getElementById('master-volume');
const musicVolumeSlider = document.getElementById('music-volume');
const textSpeedSlider = document.getElementById('text-speed');
const masterVolumeValue = document.getElementById('master-volume-value');
const musicVolumeValue = document.getElementById('music-volume-value');
const textSpeedValue = document.getElementById('text-speed-value');

// Variables para control de animaciones
let isTransitioning = false;
let volumeControlTimeout = null;

// Inicialización del juego
function init() {
    // Cargar configuración guardada
    loadSettings();
    
    // Configurar audio
    setupAudio();
    
    // Configurar pantalla completa si estaba activada
    if (gameState.settings.fullscreen) {
        setTimeout(enterFullscreen, 500);
    }
    
    // Simular carga de recursos
    setTimeout(() => {
        hideLoadingScreen();
        showMainMenu();
        
        // Cargar estado guardado si existe
        const savedState = localStorage.getItem('visualNovelSave');
        if (savedState) {
            const savedGameState = JSON.parse(savedState);
            gameState.saveSlots = savedGameState.saveSlots || gameState.saveSlots;
            gameState.currentScene = savedGameState.currentScene || gameState.currentScene;
        }
        
        // Configurar event listeners
        setupEventListeners();
    }, 1500);
}

// Sistema de audio
function setupAudio() {
    // Configurar volumen inicial
    updateAudioVolumes();
    
    // Intentar reproducir música (puede requerir interacción del usuario)
    backgroundMusic.volume = gameState.settings.musicEnabled ? 
        (gameState.settings.musicVolume / 100) * (gameState.settings.masterVolume / 100) : 0;
    
    if (gameState.settings.musicEnabled) {
        backgroundMusic.play().catch(e => {
            console.log('La reproducción automática fue bloqueada. La música se reproducirá después de la interacción del usuario.');
        });
    }
}

function setupEventListeners() {
    // Navegación principal
    newGameBtn.addEventListener('click', startNewGame);
    loadGameBtn.addEventListener('click', showLoadScreen);
    settingsBtn.addEventListener('click', showSettingsScreen);
    backToMenuBtn.addEventListener('click', showMainMenu);
    backFromSettingsBtn.addEventListener('click', showMainMenu);
    resetSettingsBtn.addEventListener('click', resetSettings);
    
    // Controles de pantalla completa
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    fullscreenGameBtn.addEventListener('click', toggleFullscreen);
    fullscreenSettingsBtn.addEventListener('click', toggleFullscreen);
    
    // Controles de audio
    musicToggleBtn.addEventListener('click', toggleMusic);
    musicToggleGameBtn.addEventListener('click', toggleMusic);
    
    // Control de volumen hover
    musicToggleBtn.addEventListener('mouseenter', showVolumeControl);
    musicToggleBtn.addEventListener('mouseleave', hideVolumeControl);
    volumeControl.addEventListener('mouseenter', keepVolumeControl);
    volumeControl.addEventListener('mouseleave', hideVolumeControl);
    
    // Sliders de volumen
    volumeSlider.addEventListener('input', handleVolumeChange);
    masterVolumeSlider.addEventListener('input', handleMasterVolumeChange);
    musicVolumeSlider.addEventListener('input', handleMusicVolumeChange);
    textSpeedSlider.addEventListener('input', handleTextSpeedChange);
    
    // Event listeners para cambios de pantalla completa
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
}

// Sistema de pantalla completa
function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

function enterFullscreen() {
    const element = document.documentElement;
    
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }
    
    gameState.settings.fullscreen = true;
    saveSettings();
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
    
    gameState.settings.fullscreen = false;
    saveSettings();
}

function handleFullscreenChange() {
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
    gameState.settings.fullscreen = isFullscreen;
    saveSettings();
}

// Sistema de audio - Funciones principales
function toggleMusic() {
    gameState.settings.musicEnabled = !gameState.settings.musicEnabled;
    
    if (gameState.settings.musicEnabled) {
        backgroundMusic.volume = (gameState.settings.musicVolume / 100) * (gameState.settings.masterVolume / 100);
        backgroundMusic.play().catch(e => console.log('Error al reproducir música:', e));
    } else {
        backgroundMusic.volume = 0;
        backgroundMusic.pause();
    }
    
    updateMusicButtons();
    saveSettings();
}

function stopMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

function playMusic() {
    if (gameState.settings.musicEnabled) {
        backgroundMusic.volume = (gameState.settings.musicVolume / 100) * (gameState.settings.masterVolume / 100);
        backgroundMusic.play().catch(e => console.log('Error al reproducir música:', e));
    }
}

function updateMusicButtons() {
    const buttons = [musicToggleBtn, musicToggleGameBtn];
    buttons.forEach(btn => {
        if (btn) {
            if (gameState.settings.musicEnabled) {
                btn.classList.remove('muted');
            } else {
                btn.classList.add('muted');
            }
        }
    });
}

function showVolumeControl() {
    if (volumeControlTimeout) {
        clearTimeout(volumeControlTimeout);
    }
    volumeControl.classList.remove('hidden');
    volumeControl.classList.add('show');
}

function hideVolumeControl() {
    volumeControlTimeout = setTimeout(() => {
        volumeControl.classList.remove('show');
        setTimeout(() => {
            volumeControl.classList.add('hidden');
        }, 300);
    }, 500);
}

function keepVolumeControl() {
    if (volumeControlTimeout) {
        clearTimeout(volumeControlTimeout);
    }
}

function handleVolumeChange(e) {
    gameState.settings.musicVolume = parseInt(e.target.value);
    updateAudioVolumes();
    saveSettings();
}

function handleMasterVolumeChange(e) {
    gameState.settings.masterVolume = parseInt(e.target.value);
    masterVolumeValue.textContent = `${gameState.settings.masterVolume}%`;
    updateAudioVolumes();
    saveSettings();
}

function handleMusicVolumeChange(e) {
    gameState.settings.musicVolume = parseInt(e.target.value);
    musicVolumeValue.textContent = `${gameState.settings.musicVolume}%`;
    updateAudioVolumes();
    saveSettings();
}

function handleTextSpeedChange(e) {
    gameState.settings.textSpeed = parseInt(e.target.value);
    const speeds = ['Muy Lento', 'Lento', 'Normal', 'Rápido', 'Muy Rápido'];
    textSpeedValue.textContent = speeds[Math.floor((gameState.settings.textSpeed - 1) / 2)] || 'Normal';
    saveSettings();
}

function updateAudioVolumes() {
    const masterVolume = gameState.settings.masterVolume / 100;
    const musicVolume = gameState.settings.musicVolume / 100;
    
    backgroundMusic.volume = gameState.settings.musicEnabled ? masterVolume * musicVolume : 0;
    
    // Actualizar el slider de volumen rápido
    if (volumeSlider) {
        volumeSlider.value = gameState.settings.musicVolume;
    }
}

// Sistema de configuración
function showSettingsScreen() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    mainMenu.classList.remove('active');
    
    setTimeout(() => {
        mainMenu.classList.add('hidden');
        
        settingsScreen.classList.remove('hidden');
        setTimeout(() => {
            settingsScreen.classList.add('active');
            
            // Actualizar valores en la configuración
            masterVolumeSlider.value = gameState.settings.masterVolume;
            musicVolumeSlider.value = gameState.settings.musicVolume;
            textSpeedSlider.value = gameState.settings.textSpeed;
            
            masterVolumeValue.textContent = `${gameState.settings.masterVolume}%`;
            musicVolumeValue.textContent = `${gameState.settings.musicVolume}%`;
            
            const speeds = ['Muy Lento', 'Lento', 'Normal', 'Rápido', 'Muy Rápido'];
            textSpeedValue.textContent = speeds[Math.floor((gameState.settings.textSpeed - 1) / 2)] || 'Normal';
            
            isTransitioning = false;
        }, 50);
    }, 400);
}

function resetSettings() {
    gameState.settings = {
        masterVolume: 50,
        musicVolume: 50,
        textSpeed: 5,
        musicEnabled: true,
        fullscreen: gameState.settings.fullscreen // Mantener estado de pantalla completa
    };
    
    updateAudioVolumes();
    updateMusicButtons();
    saveSettings();
    
    // Actualizar la UI
    masterVolumeSlider.value = gameState.settings.masterVolume;
    musicVolumeSlider.value = gameState.settings.musicVolume;
    textSpeedSlider.value = gameState.settings.textSpeed;
    
    masterVolumeValue.textContent = `${gameState.settings.masterVolume}%`;
    musicVolumeValue.textContent = `${gameState.settings.musicVolume}%`;
    textSpeedValue.textContent = 'Normal';
    
    if (gameState.settings.musicEnabled) {
        backgroundMusic.play().catch(e => console.log('Error al reproducir música:', e));
    }
}

function loadSettings() {
    const savedSettings = localStorage.getItem('visualNovelSettings');
    if (savedSettings) {
        gameState.settings = { ...gameState.settings, ...JSON.parse(savedSettings) };
    }
    updateMusicButtons();
}

function saveSettings() {
    localStorage.setItem('visualNovelSettings', JSON.stringify(gameState.settings));
}

// Funciones de animación entre pantallas
function hideLoadingScreen() {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 600);
}

function showMainMenu() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    // Ocultar pantallas activas con animación
    const activeScreens = [gameScreen, saveLoadScreen, settingsScreen].filter(screen => !screen.classList.contains('hidden'));
    
    activeScreens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    setTimeout(() => {
        gameScreen.classList.add('hidden');
        saveLoadScreen.classList.add('hidden');
        settingsScreen.classList.add('hidden');
        
        mainMenu.classList.remove('hidden');
        setTimeout(() => {
            mainMenu.classList.add('active');
            playMusic();
            isTransitioning = false;
        }, 50);
    }, 400);
}

function showGameScreen() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    mainMenu.classList.remove('active');
    saveLoadScreen.classList.remove('active');
    settingsScreen.classList.remove('active');
    
    setTimeout(() => {
        mainMenu.classList.add('hidden');
        saveLoadScreen.classList.add('hidden');
        settingsScreen.classList.add('hidden');
        
        gameScreen.classList.remove('hidden');
        setTimeout(() => {
            gameScreen.classList.add('active');
            setupGameUIEventListeners();
            updateMusicButtons();
            stopMusic();
            isTransitioning = false;
        }, 50);
    }, 400);
}

function showLoadScreen() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    mainMenu.classList.remove('active');
    gameScreen.classList.remove('active');
    settingsScreen.classList.remove('active');
    
    setTimeout(() => {
        mainMenu.classList.add('hidden');
        gameScreen.classList.add('hidden');
        settingsScreen.classList.add('hidden');
        
        saveLoadScreen.classList.remove('hidden');
        setTimeout(() => {
            saveLoadScreen.classList.add('active');
            updateSaveSlots();
            isTransitioning = false;
        }, 50);
    }, 400);
}

function showSaveScreen() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    gameScreen.classList.remove('active');
    
    setTimeout(() => {
        gameScreen.classList.add('hidden');
        
        saveLoadScreen.classList.remove('hidden');
        setTimeout(() => {
            saveLoadScreen.classList.add('active');
            const screenTitle = document.querySelector('.screen-title');
            if (screenTitle) {
                screenTitle.textContent = 'GUARDAR PARTIDA';
            }
            updateSaveSlotsForSaving();
            isTransitioning = false;
        }, 50);
    }, 400);
}

// Configurar event listeners específicos de la UI del juego
function setupGameUIEventListeners() {
    const saveBtn = document.getElementById('save-game-btn');
    const menuBtn = document.getElementById('open-menu-btn');
    const musicBtn = document.getElementById('music-toggle-game');
    const fullscreenBtn = document.getElementById('fullscreen-btn-game');
    
    if (saveBtn) saveBtn.onclick = showSaveScreen;
    if (menuBtn) menuBtn.onclick = showMainMenu;
    if (musicBtn) musicBtn.onclick = toggleMusic;
    if (fullscreenBtn) fullscreenBtn.onclick = toggleFullscreen;
}

// Funciones de juego
function startNewGame() {
    if (isTransitioning) return;
    
    gameState.currentScene = gameData.startScene;
    showGameScreen();
    
    setTimeout(() => {
        loadScene(gameState.currentScene);
        autoSave();
    }, 500);
}

function loadScene(sceneId) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    const scene = gameData.scenes[sceneId];
    if (!scene) {
        console.error(`Escena no encontrada: ${sceneId}`);
        isTransitioning = false;
        return;
    }
    
    sceneBackground.style.opacity = '0.7';
    sceneBackground.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
        sceneBackground.style.backgroundImage = `url('${scene.background}')`;
        sceneBackground.innerHTML = '';
        
        scene.characters.forEach(char => {
            if (char.image) {
                const characterElement = document.createElement('img');
                characterElement.src = char.image;
                characterElement.alt = char.name;
                characterElement.classList.add('character', char.position);
                sceneBackground.appendChild(characterElement);
            }
        });
        
        scene.interactiveElements.forEach(element => {
            const interactiveElement = document.createElement('div');
            interactiveElement.classList.add('interactive-element');
            interactiveElement.textContent = element.name;
            interactiveElement.id = element.id;
            
            Object.keys(element.position).forEach(prop => {
                interactiveElement.style[prop] = element.position[prop];
            });
            
            interactiveElement.addEventListener('click', () => {
                if (isTransitioning) return;
                
                interactiveElement.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    interactiveElement.style.transform = 'scale(1)';
                    
                    setTimeout(() => {
                        gameState.currentScene = element.nextScene;
                        loadScene(element.nextScene);
                        autoSave();
                    }, 200);
                }, 150);
            });
            
            sceneBackground.appendChild(interactiveElement);
        });
        
        characterName.style.opacity = '0';
        dialogueText.style.opacity = '0';
        
        if (scene.characters[0].name !== "narrador") {
            characterName.textContent = scene.characters[0].name;
        } else {
            characterName.textContent = "";
        }
        
        dialogueText.textContent = scene.text;
        
        setTimeout(() => {
            sceneBackground.style.opacity = '1';
            sceneBackground.style.transform = 'scale(1)';
            
            setTimeout(() => {
                characterName.style.opacity = '1';
                dialogueText.style.opacity = '1';
                characterName.style.transition = 'opacity 0.4s ease';
                dialogueText.style.transition = 'opacity 0.4s ease';
                isTransitioning = false;
            }, 200);
        }, 100);
    }, 300);
}

// Sistema de guardado
function autoSave() {
    const currentScene = gameData.scenes[gameState.currentScene];
    if (currentScene) {
        // Solo guardar automáticamente si el slot 0 está vacío o es un auto-guardado viejo
        const shouldAutoSave = !gameState.saveSlots[0] || 
                              (gameState.saveSlots[0] && 
                               Date.now() - new Date(gameState.saveSlots[0].timestamp).getTime() > 300000); // 5 minutos
        
        if (shouldAutoSave) {
            gameState.saveSlots[0] = {
                scene: gameState.currentScene,
                timestamp: new Date().toLocaleString(),
                preview: currentScene.text.substring(0, 50) + '...',
                isAutoSave: true // Marcar como auto-guardado
            };
            
            localStorage.setItem('visualNovelSave', JSON.stringify(gameState));
        }
    }
}

function manualSave(slotIndex) {
    const currentScene = gameData.scenes[gameState.currentScene];
    if (currentScene) {
        gameState.saveSlots[slotIndex] = {
            scene: gameState.currentScene,
            timestamp: new Date().toLocaleString(),
            preview: currentScene.text.substring(0, 50) + '...'
        };
        
        localStorage.setItem('visualNovelSave', JSON.stringify(gameState));
        updateSaveSlots();
        
        const slotElements = document.querySelectorAll('.save-slot');
        if (slotElements[slotIndex]) {
            slotElements[slotIndex].style.backgroundColor = 'rgba(233, 69, 96, 0.3)';
            setTimeout(() => {
                slotElements[slotIndex].style.backgroundColor = '';
                // REMOVÍ: showMainMenu(); // Esto es lo que hacía volver al menú principal
                showGameScreen(); // En su lugar, volvemos al juego
            }, 600);
        }
    }
}

function loadFromSlot(slotIndex) {
    const slot = gameState.saveSlots[slotIndex];
    if (slot) {
        gameState.currentScene = slot.scene;
        showGameScreen();
        
        setTimeout(() => {
            loadScene(gameState.currentScene);
        }, 500);
    }
}

function updateSaveSlots() {
    const saveSlotsContainer = document.querySelector('.save-slots');
    if (!saveSlotsContainer) return;
    
    saveSlotsContainer.innerHTML = '';
    
    gameState.saveSlots.forEach((slot, index) => {
        const slotElement = document.createElement('div');
        slotElement.classList.add('save-slot');
        
        if (slot) {
            slotElement.innerHTML = `
                <div class="slot-title">Partida ${index + 1}</div>
                <div class="slot-info">${slot.timestamp}</div>
                <div class="slot-info">${slot.preview}</div>
            `;
            slotElement.addEventListener('click', () => loadFromSlot(index));
        } else {
            slotElement.classList.add('empty-slot');
            slotElement.textContent = 'Ranura Vacía';
            slotElement.addEventListener('click', () => manualSave(index));
        }
        
        saveSlotsContainer.appendChild(slotElement);
    });
}

function updateSaveSlotsForSaving() {
    const saveSlotsContainer = document.querySelector('.save-slots');
    if (!saveSlotsContainer) return;
    
    saveSlotsContainer.innerHTML = '';
    
    gameState.saveSlots.forEach((slot, index) => {
        const slotElement = document.createElement('div');
        slotElement.classList.add('save-slot');
        
        if (slot) {
            const saveType = slot.isAutoSave ? ' (Auto)' : ' (Manual)';
            slotElement.innerHTML = `
                <div class="slot-title">Partida ${index + 1}${saveType}</div>
                <div class="slot-info">${slot.timestamp}</div>
                <div class="slot-info">${slot.preview}</div>
                <div class="slot-info">Haz clic para sobreescribir</div>
            `;
        } else {
            slotElement.innerHTML = `
                <div class="slot-title">Partida ${index + 1}</div>
                <div class="slot-info">Ranura vacía</div>
                <div class="slot-info">Haz clic para guardar</div>
            `;
        }
        
        slotElement.addEventListener('click', () => manualSave(index));
        saveSlotsContainer.appendChild(slotElement);
    });
}

// Iniciar el juego cuando se carga la página
window.addEventListener('DOMContentLoaded', init);

// Permitir que la música se reproduzca después de cualquier interacción del usuario
document.addEventListener('click', function() {
    if (gameState.settings.musicEnabled && backgroundMusic.paused && mainMenu.classList.contains('active')) {
        backgroundMusic.play().catch(e => console.log('Error al reproducir música:', e));
    }
});

// Prevenir zoom en dispositivos móviles
document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);