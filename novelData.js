// Datos de la novela - novelData.js
const novelData = {
    characters: {
        lilianne: {
            name: "Lilianne Veilart",
            image: "img/characters/lilianne.png",
            color: "#8b0000"
        },
        feyra: {
            name: "Feyra",
            image: "img/characters/feyra.png",
            color: "#4b8b00"
        },
        narrator: {
            name: "Narrador",
            image: "",
            color: "#e0d0b5"
        }
    },
    
    backgrounds: {
        hospital: "img/backgrounds/hospital.jpg",
        dungeon: "img/backgrounds/dungeon.jpg",
        fortress: "img/backgrounds/fortress.jpg",
        throne_room: "img/backgrounds/throne_room.jpg",
        city: "img/backgrounds/city.jpg",
        black: "img/backgrounds/black.jpg" // Para pantallas negras/transiciones
    },

    scenes: [
        // Capítulo 1: El Funeral de una Genio
        {
            background: "hospital", // Usa la clave del fondo
            character: null,
            text: "Tokio, 18 de noviembre de 2025. El cielo estaba tan gris como la expresión de los científicos que rodeaban la cama de hospital.",
            nextScene: 1
        },
        {
            background: "hospital", // Mismo fondo para continuidad
            character: null,
            text: "Misaki Aoyama, con solo 28 años, había acumulado más conocimientos que la mayoría de los académicos de su país.",
            nextScene: 2
        },
        {
            background: "hospital_closeup", // Primer plano de cama de hospital
            character: "misaki",
            text: "Esto no es un adiós... Esto es un cambio de estrategia.",
            nextScene: 3
        },
        {
            background: "black", // Transición a negro
            character: null,
            text: "A las 2:43 a.m., su corazón se detuvo. Las máquinas sonaron durante unos segundos. Luego, el silencio.",
            nextScene: 4
        },
        {
            background: "black",
            character: null,
            text: "El mundo perdió una genio. Pero no del todo.",
            nextScene: 5,
            choices: [
                {
                    text: "Continuar la historia",
                    nextScene: 5
                },
                {
                    text: "Leer prólogo nuevamente",
                    nextScene: 0
                }
            ]
        },
        
        // Capítulo 2: Nacer en el Infierno
        {
            background: "dungeon",
            character: "narrator",
            text: "Lo primero que sintió fue el frío. Luego el dolor. Un ardor en la garganta, en los pulmones. Dolor punzante en las muñecas...",
            nextScene: 6
        },
        {
            background: "dungeon",
            character: "lilianne",
            text: "¿Dónde... estoy? Este cuerpo... no es el mío.",
            nextScene: 7
        },
        {
            background: "dungeon",
            character: "narrator",
            text: "Misaki había despertado en un mundo distinto. Uno donde no existía la electricidad, ni el conocimiento científico.",
            nextScene: 8
        },
        {
            background: "dungeon",
            character: "narrator",
            text: "Su nuevo nombre: Lilianne Veilart. Hija bastarda de un duque. Vendida como esclava por su propio padre.",
            nextScene: 9
        },
        {
            background: "dungeon",
            character: "lilianne",
            text: "No lloraré. No gritaré. Voy a planear mi venganza.",
            nextScene: 10
        }
    ]
};

// Cargar datos en el motor cuando esté listo
document.addEventListener('DOMContentLoaded', () => {
    novelEngine.loadStory(novelData);
});