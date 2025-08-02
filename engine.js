class NovelEngine {
    constructor() {
        this.currentScene = 0;
        this.scenes = [];
        this.characters = {};
        this.backgrounds = {};
        this.sounds = {};
        this.variables = {};
        this.history = [];
        this.currentBGM = null;
        this.typingInterval = null;
        this.currentBackground = '';
        
        // Elementos del DOM
        this.elements = {
            sceneContainer: null,
            textContainer: null,
            nameDisplay: null,
            textContent: null,
            characterImage: null,
            backgroundImage: null,
            choicesContainer: null,
            historyButton: null,
            historyLog: null,
            menuButton: null,
            settingsButton: null,
            backgroundEffects: null
        };
        
        // Estado del juego
        this.gameState = {
            autoMode: false,
            skipMode: false,
            textSpeed: 1.0,
            autoSpeed: 2.0,
            bgmVolume: 0.7,
            sfxVolume: 0.9,
            textSize: 'medium',
            transitionSpeed: 0.3 // en segundos
        };
        
        this.init();
    }
    
    init() {
        this.createUI();
        this.setupEventListeners();
    }
    
    createUI() {
        // Contenedor principal de la escena
        this.elements.sceneContainer = document.createElement('div');
        this.elements.sceneContainer.id = 'novel-container';
        document.body.appendChild(this.elements.sceneContainer);
        
        // Capa de efectos de fondo
        this.elements.backgroundEffects = document.createElement('div');
        this.elements.backgroundEffects.className = 'background-effects';
        this.elements.sceneContainer.appendChild(this.elements.backgroundEffects);
        
        // Fondo de la escena
        this.elements.backgroundImage = document.createElement('div');
        this.elements.backgroundImage.className = 'novel-background';
        this.elements.sceneContainer.appendChild(this.elements.backgroundImage);
        
        // Imagen del personaje
        this.elements.characterImage = document.createElement('div');
        this.elements.characterImage.className = 'character-image';
        this.elements.sceneContainer.appendChild(this.elements.characterImage);
        
        // Contenedor de texto
        this.elements.textContainer = document.createElement('div');
        this.elements.textContainer.className = 'text-container';
        
        // Nombre del personaje
        this.elements.nameDisplay = document.createElement('div');
        this.elements.nameDisplay.className = 'character-name';
        this.elements.textContainer.appendChild(this.elements.nameDisplay);
        
        // Contenido del texto
        this.elements.textContent = document.createElement('div');
        this.elements.textContent.className = 'text-content';
        this.elements.textContainer.appendChild(this.elements.textContent);
        
        this.elements.sceneContainer.appendChild(this.elements.textContainer);
        
        // Contenedor de opciones
        this.elements.choicesContainer = document.createElement('div');
        this.elements.choicesContainer.className = 'choices-container';
        this.elements.sceneContainer.appendChild(this.elements.choicesContainer);
        
        // Botones de control
        const controls = document.createElement('div');
        controls.className = 'novel-controls';
        
        this.elements.menuButton = document.createElement('button');
        this.elements.menuButton.className = 'control-btn menu-btn';
        this.elements.menuButton.innerHTML = '<i class="fas fa-crown"></i>';
        controls.appendChild(this.elements.menuButton);
        
        this.elements.historyButton = document.createElement('button');
        this.elements.historyButton.className = 'control-btn history-btn';
        this.elements.historyButton.innerHTML = '<i class="fas fa-history"></i>';
        controls.appendChild(this.elements.historyButton);
        
        this.elements.settingsButton = document.createElement('button');
        this.elements.settingsButton.className = 'control-btn settings-btn';
        this.elements.settingsButton.innerHTML = '<i class="fas fa-cog"></i>';
        controls.appendChild(this.elements.settingsButton);
        
        this.elements.sceneContainer.appendChild(controls);
        
        // Historial de diálogos
        this.elements.historyLog = document.createElement('div');
        this.elements.historyLog.className = 'history-log';
        document.body.appendChild(this.elements.historyLog);
        
        // Ocultar inicialmente
        this.hideNovelUI();
        this.updateTextSize();
    }
    
    setupEventListeners() {
        // Avanzar diálogo al hacer clic
        this.elements.textContainer.addEventListener('click', () => this.next());
        
        // Botones de control
        this.elements.historyButton.addEventListener('click', () => this.toggleHistory());
        this.elements.menuButton.addEventListener('click', () => this.showRoyalCouncil());
        this.elements.settingsButton.addEventListener('click', () => this.showSettings());
    }
    
    loadStory(data) {
        this.scenes = data.scenes;
        this.characters = data.characters;
        this.backgrounds = data.backgrounds;
        this.sounds = data.sounds;
    }
    
    start() {
        this.showNovelUI();
        this.currentScene = 0;
        this.showScene(this.currentScene);
    }
    
    showScene(sceneId) {
        // Limpiar intervalo de escritura anterior
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
        }
        
        const scene = this.scenes[sceneId];
        if (!scene) return;
        
        // Cambiar fondo si es diferente
        if (scene.background && scene.background !== this.currentBackground) {
            this.changeBackground(scene.background, scene.effect);
        } else if (scene.effect) {
            this.setBackgroundEffect(scene.effect);
        }
        
        // Mostrar texto
        this.displayText(scene.text, scene.character);
        
        // Mostrar personaje si corresponde
        if (scene.character && this.characters[scene.character]) {
            const char = this.characters[scene.character];
            this.elements.characterImage.style.backgroundImage = `url('${char.image}')`;
            this.elements.characterImage.style.display = 'block';
            
            // Efecto de aparición
            this.elements.characterImage.style.opacity = 0;
            setTimeout(() => {
                this.elements.characterImage.style.opacity = 1;
            }, 100);
        } else {
            this.elements.characterImage.style.display = 'none';
        }
        
        // Mostrar opciones si existen
        this.showChoices(scene.choices);
        
        // Reproducir música de fondo si está especificada
        if (scene.bgm) {
            this.playBGM(scene.bgm);
        }
    }
    
    changeBackground(backgroundId, effect = '') {
        if (!this.backgrounds[backgroundId]) {
            console.error(`Fondo no encontrado: ${backgroundId}`);
            return;
        }
        
        this.currentBackground = backgroundId;
        
        // Crear una imagen temporal para precargar
        const preloadImg = new Image();
        preloadImg.src = this.backgrounds[backgroundId];
        
        // Transición de fundido
        this.elements.backgroundImage.style.opacity = 0;
        
        setTimeout(() => {
            this.elements.backgroundImage.style.backgroundImage = `url('${this.backgrounds[backgroundId]}')`;
            this.elements.backgroundImage.style.opacity = 1;
            this.setBackgroundEffect(effect);
        }, this.gameState.transitionSpeed * 1000);
    }
    
    setBackgroundEffect(effect) {
        const effects = {
            'none': '',
            'blur': 'blur(2px)',
            'darken': 'brightness(0.5)',
            'darker': 'brightness(0.3)',
            'sepia': 'sepia(0.7)',
            'blood': 'brightness(0.7) hue-rotate(340deg)',
            'cold': 'brightness(0.8) hue-rotate(180deg) saturate(1.5)',
            'warm': 'brightness(0.9) hue-rotate(-20deg) saturate(1.2)'
        };
        
        this.elements.backgroundEffects.style.display = effect ? 'block' : 'none';
        
        if (effect === 'blood') {
            this.elements.backgroundEffects.style.background = 'radial-gradient(circle, rgba(200,0,0,0.2) 0%, rgba(80,0,0,0.5) 100%)';
        } else if (effect === 'darken') {
            this.elements.backgroundEffects.style.background = 'rgba(0, 0, 0, 0.5)';
        } else {
            this.elements.backgroundEffects.style.background = '';
        }
        
        this.elements.backgroundImage.style.filter = effects[effect] || '';
    }
    
    displayText(text, character) {
        // Limpiar contenido previo
        this.elements.textContent.innerHTML = '';
        
        if (character) {
            const charData = this.characters[character];
            this.elements.nameDisplay.textContent = charData.name;
            this.elements.nameDisplay.style.color = charData.color || '#fff';
        } else {
            this.elements.nameDisplay.textContent = '';
        }

        // Crear elemento de texto con estilos protegidos
        const textElement = document.createElement('div');
        textElement.style.whiteSpace = 'pre-wrap';
        textElement.style.wordWrap = 'break-word';
        textElement.style.fontFamily = 'inherit';
        textElement.style.fontSize = 'inherit';
        textElement.style.color = 'inherit';
        textElement.style.textShadow = 'inherit';

        // Convertir saltos de línea en el texto a elementos <br>
        const lines = text.split('\n');
        
        let i = 0;
        let currentLine = 0;
        let currentText = '';
        
        const speed = 30 / this.gameState.textSpeed;
        
        this.typingInterval = setInterval(() => {
            if (currentLine < lines.length) {
                if (i < lines[currentLine].length) {
                    currentText += lines[currentLine].charAt(i);
                    i++;
                    
                    // Actualizar solo el contenido actual
                    textElement.innerHTML = currentText.replace(/\n/g, '<br>');
                    
                    // Asegurar que el texto se muestre correctamente
                    for (let j = 0; j <= currentLine; j++) {
                        if (j < currentLine) {
                            textElement.innerHTML = lines[j] + '<br>' + (j === currentLine - 1 ? currentText : '');
                        }
                    }
                } else {
                    currentLine++;
                    if (currentLine < lines.length) {
                        currentText += '\n';
                        i = 0;
                    }
                }
            } else {
                clearInterval(this.typingInterval);
                this.typingInterval = null;
            }
            
            this.elements.textContent.innerHTML = '';
            this.elements.textContent.appendChild(textElement);
            
        }, speed);
        
        // Agregar al historial (versión sin formato)
        this.history.push({
            character: character ? this.characters[character].name : 'Narrador',
            text: text,
            timestamp: new Date()
        });
    }
    
    showChoices(choices) {
        this.elements.choicesContainer.innerHTML = '';
        
        if (!choices || choices.length === 0) return;
        
        choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                this.selectChoice(choice.nextScene);
            });
            this.elements.choicesContainer.appendChild(button);
        });
    }
    
    selectChoice(nextScene) {
        this.currentScene = nextScene;
        this.showScene(this.currentScene);
    }
    
    next() {
        // Si hay animación de texto, completarla inmediatamente
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
            const currentScene = this.scenes[this.currentScene];
            this.elements.textContent.innerHTML = currentScene.text.replace(/\n/g, '<br>');
            return;
        }
        
        // Si hay opciones, no avanzar automáticamente
        if (this.scenes[this.currentScene].choices) return;
        
        const next = this.scenes[this.currentScene].nextScene;
        if (typeof next === 'number') {
            this.currentScene = next;
            this.showScene(this.currentScene);
        } else if (typeof next === 'function') {
            this.currentScene = next(this.variables);
            this.showScene(this.currentScene);
        } else {
            console.log('Fin de la historia');
        }
    }
    
    toggleHistory() {
        if (this.elements.historyLog.style.display === 'block') {
            this.hideHistory();
        } else {
            this.showHistory();
        }
    }
    
    showHistory() {
        this.elements.historyLog.innerHTML = '';
        
        // Botón de cierre
        const closeBtn = document.createElement('button');
        closeBtn.className = 'history-close-btn';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.addEventListener('click', () => this.hideHistory());
        this.elements.historyLog.appendChild(closeBtn);
        
        // Título del historial
        const title = document.createElement('h2');
        title.className = 'history-title';
        title.textContent = 'Crónicas Pasadas';
        this.elements.historyLog.appendChild(title);
        
        // Entradas de historial
        const entriesContainer = document.createElement('div');
        entriesContainer.className = 'history-entries';
        
        this.history.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'history-entry';
            
            const charSpan = document.createElement('span');
            charSpan.className = 'history-character';
            charSpan.textContent = entry.character + ':';
            
            const textSpan = document.createElement('span');
            textSpan.className = 'history-text';
            textSpan.innerHTML = entry.text.replace(/\n/g, '<br>');
            
            entryDiv.appendChild(charSpan);
            entryDiv.appendChild(textSpan);
            entriesContainer.appendChild(entryDiv);
        });
        
        this.elements.historyLog.appendChild(entriesContainer);
        this.elements.historyLog.style.display = 'block';
    }
    
    hideHistory() {
        this.elements.historyLog.style.display = 'none';
    }
    
    showRoyalCouncil() {
        soundSystem.play("open");
        
        // Ocultar la UI de la novela
        this.elements.sceneContainer.style.display = 'none';
        
        // Mostrar el menú principal y el panel de opciones
        const menuContainer = document.querySelector('.menu-container');
        const optionsMenu = document.getElementById('options-menu');
        
        if (menuContainer && optionsMenu) {
            menuContainer.style.display = 'flex';
            optionsMenu.style.display = 'block';
            
            // Configurar el botón de cierre
            const closeOptions = document.getElementById('close-options');
            if (closeOptions) {
                // Guardar el manejador original si existe
                const originalHandler = closeOptions.onclick;
                
                closeOptions.onclick = (e) => {
                    soundSystem.play("close");
                    optionsMenu.style.display = 'none';
                    this.showNovelUI();
                    
                    // Restaurar el manejador original si existía
                    if (originalHandler) {
                        closeOptions.onclick = originalHandler;
                    }
                };
            }
        }
    }
    
    showSettings() {
        this.showRoyalCouncil();
        
        // Activar la pestaña de audio después de un breve retraso
        setTimeout(() => {
            const audioTab = document.querySelector('.tab-btn[data-tab="audio"]');
            if (audioTab) {
                audioTab.click();
            }
        }, 100);
    }
    
    updateTextSize() {
        const sizes = {
            small: '0.9em',
            medium: '1.1em',
            large: '1.3em'
        };
        document.documentElement.style.setProperty('--text-size', sizes[this.gameState.textSize]);
    }
    
    showNovelUI() {
        // Ocultar el menú de opciones si está visible
        const optionsMenu = document.getElementById('options-menu');
        if (optionsMenu) {
            optionsMenu.style.display = 'none';
        }
        
        // Ocultar el menú principal
        const menuContainer = document.querySelector('.menu-container');
        if (menuContainer) {
            menuContainer.style.display = 'none';
        }
        
        // Mostrar la UI de la novela
        this.elements.sceneContainer.style.display = 'block';
    }
    
    hideNovelUI() {
        this.elements.sceneContainer.style.display = 'none';
    }
    
    // Métodos para controlar el juego
    setVariable(name, value) {
        this.variables[name] = value;
    }
    
    getVariable(name) {
        return this.variables[name];
    }
    
    playSound(name) {
        if (this.sounds[name]) {
            const sound = new Audio(this.sounds[name]);
            sound.volume = this.gameState.sfxVolume;
            sound.play().catch(e => console.error("Error al reproducir sonido:", e));
        }
    }
    
    playBGM(name) {
        if (this.sounds[name]) {
            this.stopBGM();
            this.currentBGM = new Audio(this.sounds[name]);
            this.currentBGM.volume = this.gameState.bgmVolume;
            this.currentBGM.loop = true;
            this.currentBGM.play().catch(e => console.error("Error al reproducir música:", e));
        }
    }
    
    stopBGM() {
        if (this.currentBGM) {
            this.currentBGM.pause();
            this.currentBGM.currentTime = 0;
        }
    }
}

// Crear instancia global del motor
const novelEngine = new NovelEngine();