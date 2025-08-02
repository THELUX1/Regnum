// Variables globales
let currentScene = 0;
let textSpeed = 5;
let autoPlay = false;
let autoPlayTimeout;
let musicVolume = 0.5;
let bgMusic, clickSound;

// Elementos del DOM
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const settingsScreen = document.getElementById('settings-screen');
const creditsScreen = document.getElementById('credits-screen');

const startBtn = document.getElementById('start-btn');
const loadBtn = document.getElementById('load-btn');
const settingsBtn = document.getElementById('settings-btn');
const creditsBtn = document.getElementById('credits-btn');
const backBtn = document.getElementById('back-btn');
const creditsBackBtn = document.getElementById('credits-back-btn');

const volumeControl = document.getElementById('volume');
const textSpeedControl = document.getElementById('text-speed');
const autoPlayControl = document.getElementById('auto-play');

const nameDisplay = document.getElementById('name-display');
const textDisplay = document.getElementById('text-display');
const choicesContainer = document.getElementById('choices');
const nextBtn = document.getElementById('next-btn');
const menuBtn = document.getElementById('menu-btn');
const gameMenu = document.getElementById('game-menu');
const saveBtn = document.getElementById('save-btn');
const loadGameBtn = document.getElementById('load-game-btn');
const settingsGameBtn = document.getElementById('settings-game-btn');
const returnBtn = document.getElementById('return-btn');
const quitBtn = document.getElementById('quit-btn');

// Escenas de la novela
const scenes = [
    { // Capítulo 1: El Funeral de una Genio
        background: 'hospital',
        characters: [],
        name: '',
        text: 'Tokio, 18 de noviembre de 2025.\n\nEl cielo estaba tan gris como la expresión de los científicos que rodeaban la cama de hospital. Misaki Aoyama, con solo 28 años, había acumulado más conocimientos que la mayoría de los académicos de su país.',
        choices: []
    },
    {
        background: 'hospital',
        characters: [],
        name: '',
        text: 'En la habitación número 402 del Hospital Universitario de Tokio, Misaki firmaba su testamento.\n\n—Esto no es un adiós —susurró con voz temblorosa—. Esto es un cambio de estrategia.',
        choices: []
    },
    {
        background: 'hospital',
        characters: [],
        name: '',
        text: 'Sus últimas palabras fueron una declaración de guerra a un mundo que nunca supo aprovecharla. A las 2:43 a.m., su corazón se detuvo. Las máquinas sonaron durante unos segundos. Luego, el silencio.\n\nEl mundo perdió una genio.\n\nPero no del todo.',
        choices: []
    },
    { // Capítulo 2: Nacer en el Infierno
        background: 'dungeon',
        characters: ['lilianne'],
        name: 'Lilianne',
        text: 'Lo primero que sintió fue el frío. Luego el dolor. Un ardor en la garganta, en los pulmones. Dolor punzante en las muñecas, como si la piel se hubiera roto una y otra vez.',
        choices: []
    },
    {
        background: 'dungeon',
        characters: ['lilianne'],
        name: 'Lilianne',
        text: 'Abrió los ojos. Lodo. Sangre seca en la boca. Cadenas en los tobillos.\n\n—¡Despierta, escoria! —gritó una mujer, y un golpe seco le cruzó la mejilla. La niña rodó por el suelo.',
        choices: []
    },
    {
        background: 'dungeon',
        characters: ['lilianne'],
        name: 'Narrador',
        text: 'Una niña. Eso era ahora. Tenía el cuerpo de una niña de apenas siete u ocho años, desnutrida y cubierta de cicatrices. Pero su mente... seguía siendo la misma.\n\nMisaki había despertado en un mundo distinto.',
        choices: []
    },
    {
        background: 'dungeon',
        characters: ['lilianne'],
        name: 'Narrador',
        text: 'Su nuevo nombre: Lilianne Veilart. Hija bastarda de un duque. Vendida como esclava por su propio padre.\n\nDurante semanas, Lilianne observó. Callaba. Memorizaba los movimientos de los guardias, la rutina de los capataces, la estructura de la fortaleza.',
        choices: []
    },
    {
        background: 'dungeon',
        characters: ['lilianne'],
        name: 'Narrador',
        text: 'No lloraba. No gritaba. Planeaba.',
        choices: [
            { text: 'Observar más detenidamente', nextScene: 8 },
            { text: 'Intentar comunicarse con otros esclavos', nextScene: 9 }
        ]
    },
    { // Opción 1: Observar más
        background: 'dungeon',
        characters: ['lilianne'],
        name: 'Narrador',
        text: 'Lilianne pasó días enteros sin moverse de su rincón, observando cada detalle. Aprendió que los guardias cambiaban de turno a las 6 de la tarde, y que durante 10 minutos había solo un vigilante en la puerta principal.',
        choices: []
    },
    { // Opción 2: Comunicarse
        background: 'dungeon',
        characters: ['lilianne', 'slave'],
        name: 'Narrador',
        text: 'Lilianne se acercó sigilosamente a un esclavo anciano. Con mirada calculadora, le susurró:\n\n—¿Cuántos guardias hay en el patio por la noche?\n\nEl hombre la miró con sorpresa, pero respondió: "Dos... pero solo uno está atento".',
        choices: []
    },
    { // Continúa después de las opciones
        background: 'dungeon',
        characters: ['lilianne'],
        name: 'Narrador',
        text: 'Recordó una frase de su vida pasada:\n\n"El conocimiento no es poder. El conocimiento es munición."\n\nY ella estaba empezando a cargar el arma.',
        choices: []
    },
    { // Capítulo 4: El Primer Derramamiento
        background: 'fortress',
        characters: ['lilianne'],
        name: 'Narrador',
        text: 'Lilianne tenía doce años cuando todo cambió. Durante años había fingido obediencia, había aceptado los golpes, las humillaciones. Pero en secreto, estudiaba cada rincón de la fortaleza.',
        choices: []
    },
    {
        background: 'fortress',
        characters: ['lilianne'],
        name: 'Narrador',
        text: 'Sabía cuántos guardias dormían por turno. Sabía cómo funcionaba el pozo. Sabía cuáles plantas del bosque provocaban alucinaciones y muerte lenta.\n\nUna noche, mezcló hongos venenosos en la sopa de los soldados.',
        choices: []
    },
    {
        background: 'fortress',
        characters: ['lilianne'],
        name: 'Narrador',
        text: 'No todos murieron. Pero los que sobrevivieron... estaban demasiado débiles para luchar.\n\nLuego, inició la rebelión. Coordinó a un pequeño grupo de esclavos: usaron herramientas oxidadas como lanzas, incendiaron los barracones y bloquearon la salida con carretas.',
        choices: []
    },
    {
        background: 'fortress',
        characters: ['lilianne'],
        name: 'Narrador',
        text: 'La revuelta fue brutal, sangrienta. Murieron decenas de esclavos. Pero también murieron los capataces, uno por uno.\n\nLilianne fue capturada en el acto final, con las manos manchadas de sangre. La arrastraron ante el noble local. Su sentencia fue clara: muerte en la plaza, como advertencia.\n\nPero esa ejecución nunca se realizó.',
        choices: []
    },
    { // Final del Volumen 1
        background: 'throne',
        characters: ['lilianne_queen'],
        name: 'Narrador',
        text: 'Cien años más tarde, los mapas aún muestran el nombre de Névhar como el centro de una civilización nueva. Una utopía funcional, levantada sobre cadáveres y conocimiento.\n\nLa historia oficial llama a Lilianne una dictadora.\n\nPero los niños aprenden su legado con otra palabra:\n\nFundadora.',
        choices: [
            { text: 'Volver al inicio', nextScene: 0 },
            { text: 'Salir', action: 'quit' }
        ]
    }
];

// Precarga de recursos
function preloadResources() {
    const images = [
        'images/hospital.jpg',
        'images/dungeon.jpg',
        'images/fortress.jpg',
        'images/throne.jpg',
        'images/characters/lilianne.jpg',
        'images/characters/feyra.jpg',
        'images/characters/lilianne_queen.jpg',
        'images/characters/slave.jpg'
    ];
    
    images.forEach(img => {
        new Image().src = img;
    });
}

// Inicialización del juego
document.addEventListener('DOMContentLoaded', () => {
    preloadResources();
    
    // Elementos de audio
    bgMusic = document.getElementById('bg-music');
    clickSound = document.getElementById('click-sound');
    
    // Configuración inicial de audio
    bgMusic.volume = musicVolume;
    clickSound.volume = musicVolume;
    
    // Event listeners para el menú principal
    startBtn.addEventListener('click', startGame);
    loadBtn.addEventListener('click', () => showMessage('Funcionalidad de carga no implementada aún'));
    settingsBtn.addEventListener('click', showSettings);
    creditsBtn.addEventListener('click', showCredits);
    backBtn.addEventListener('click', hideSettings);
    creditsBackBtn.addEventListener('click', hideCredits);
    
    // Event listeners para los controles de configuración
    volumeControl.addEventListener('input', updateVolume);
    textSpeedControl.addEventListener('input', updateTextSpeed);
    autoPlayControl.addEventListener('change', updateAutoPlay);
    
    // Event listeners para el juego
    nextBtn.addEventListener('click', nextScene);
    menuBtn.addEventListener('click', toggleGameMenu);
    saveBtn.addEventListener('click', () => showMessage('Guardar no implementado aún'));
    loadGameBtn.addEventListener('click', () => showMessage('Cargar no implementado aún'));
    settingsGameBtn.addEventListener('click', showGameSettings);
    returnBtn.addEventListener('click', toggleGameMenu);
    quitBtn.addEventListener('click', quitToMenu);
});

// Funciones del menú principal
function startGame() {
    playClickSound();
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    // Intentar reproducir música
    playBackgroundMusic();
    loadScene(0);
}

function showSettings() {
    playClickSound();
    startScreen.classList.add('hidden');
    settingsScreen.classList.remove('hidden');
}

function showGameSettings() {
    playClickSound();
    gameMenu.classList.add('hidden');
    settingsScreen.classList.remove('hidden');
    // Actualizar los controles con los valores actuales
    volumeControl.value = musicVolume;
    textSpeedControl.value = textSpeed;
    autoPlayControl.checked = autoPlay;
}

function hideSettings() {
    playClickSound();
    settingsScreen.classList.add('hidden');
    
    if (gameScreen.classList.contains('hidden')) {
        startScreen.classList.remove('hidden');
    } else {
        gameMenu.classList.remove('hidden');
    }
}

function showCredits() {
    playClickSound();
    startScreen.classList.add('hidden');
    creditsScreen.classList.remove('hidden');
}

function hideCredits() {
    playClickSound();
    creditsScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

// Funciones de utilidad
function showMessage(message) {
    playClickSound();
    alert(message);
}

// Funciones de configuración
function updateVolume() {
    musicVolume = volumeControl.value;
    bgMusic.volume = musicVolume;
    clickSound.volume = musicVolume;
}

function updateTextSpeed() {
    textSpeed = textSpeedControl.value;
}

function updateAutoPlay() {
    autoPlay = autoPlayControl.checked;
    if (autoPlay) {
        autoPlayNextScene();
        gameScreen.classList.add('auto-play-active');
    } else {
        clearTimeout(autoPlayTimeout);
        gameScreen.classList.remove('auto-play-active');
    }
}

// Funciones de audio
function playBackgroundMusic() {
    bgMusic.currentTime = 0;
    const promise = bgMusic.play();
    
    if (promise !== undefined) {
        promise.catch(error => {
            console.log('Reproducción automática prevenida:', error);
            showMusicWarning();
        });
    }
}

function showMusicWarning() {
    const musicWarning = document.createElement('div');
    musicWarning.className = 'music-warning';
    musicWarning.innerHTML = `
        <p>La música no pudo reproducirse automáticamente debido a las políticas del navegador.</p>
        <button id="enable-music-btn" class="btn">Haz clic aquí para habilitar la música</button>
    `;
    gameScreen.appendChild(musicWarning);
    
    document.getElementById('enable-music-btn').addEventListener('click', () => {
        playClickSound();
        bgMusic.play()
            .then(() => musicWarning.remove())
            .catch(e => console.log('Error al reproducir:', e));
    });
}

function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log('Error al reproducir sonido:', e));
}

// Funciones del juego
function loadScene(sceneIndex) {
    currentScene = sceneIndex;
    const scene = scenes[sceneIndex];
    
    // Actualizar fondo
    updateBackground(scene.background);
    
    // Actualizar personajes
    updateCharacters(scene.characters);
    
    // Mostrar nombre y texto
    nameDisplay.textContent = scene.name;
    textDisplay.textContent = '';
    
    // Mostrar texto con efecto de escritura
    typeText(scene.text);
    
    // Mostrar opciones si las hay
    if (scene.choices && scene.choices.length > 0) {
        showChoices(scene.choices);
    } else {
        choicesContainer.classList.add('hidden');
    }
    
    // Auto-play si está activado
    if (autoPlay && scene.choices.length === 0) {
        autoPlayNextScene();
    }
}

function updateBackground(backgroundName) {
    const backgroundContainer = document.getElementById('background-container');
    backgroundContainer.style.backgroundImage = `url('images/${backgroundName}.jpg')`;
}

function updateCharacters(characterNames) {
    const characterContainer = document.getElementById('character-container');
    characterContainer.innerHTML = '';
    
    characterNames.forEach(character => {
        const img = document.createElement('img');
        img.src = `images/characters/${character}.jpg`;
        img.alt = character;
        img.className = 'character visible';
        characterContainer.appendChild(img);
    });
}

function typeText(text) {
    let i = 0;
    const speed = 100 - (textSpeed * 10); // Más rápido con mayor textSpeed
    
    function typing() {
        if (i < text.length) {
            textDisplay.textContent += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    
    textDisplay.textContent = '';
    typing();
}

function showChoices(choices) {
    choicesContainer.innerHTML = '';
    choicesContainer.classList.remove('hidden');
    
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice.text;
        button.className = 'choice-btn';
        button.addEventListener('click', () => {
            playClickSound();
            if (choice.action === 'quit') {
                quitToMenu();
            } else {
                loadScene(choice.nextScene);
            }
        });
        choicesContainer.appendChild(button);
    });
}

function nextScene() {
    playClickSound();
    clearTimeout(autoPlayTimeout);
    currentScene++;
    
    if (currentScene < scenes.length) {
        loadScene(currentScene);
    } else {
        // Fin del juego
        loadScene(0); // Volver al inicio
    }
}

function autoPlayNextScene() {
    if (autoPlay && scenes[currentScene].choices.length === 0) {
        clearTimeout(autoPlayTimeout);
        autoPlayTimeout = setTimeout(() => {
            nextScene();
        }, 5000); // 5 segundos entre escenas
    }
}

function toggleGameMenu() {
    playClickSound();
    gameMenu.classList.toggle('hidden');
}

function quitToMenu() {
    playClickSound();
    gameScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    clearTimeout(autoPlayTimeout);
}