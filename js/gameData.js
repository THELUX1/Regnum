// Datos de la novela visual
const gameData = {
    title: "El Misterio del Castillo",
    startScene: "scene1",
    scenes: {
        "scene1": {
            background: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            characters: [
                { 
                    name: "narrador", 
                    position: "none",
                    image: null
                }
            ],
            text: "Te despiertas en una habitación desconocida. La luz del amanecer se filtra por la ventana. No recuerdas cómo llegaste aquí. El aire es frío y huele a polvo y madera vieja.",
            interactiveElements: [
                { 
                    id: "window",
                    name: "Ventana",
                    position: { top: "20%", left: "70%", width: "80px", height: "60px" },
                    nextScene: "scene2"
                },
                { 
                    id: "door",
                    name: "Puerta",
                    position: { top: "40%", left: "15%", width: "60px", height: "100px" },
                    nextScene: "scene3"
                },
                { 
                    id: "bed",
                    name: "Cama",
                    position: { bottom: "15%", right: "20%", width: "100px", height: "70px" },
                    nextScene: "scene4"
                }
            ]
        },
        "scene2": {
            background: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            characters: [
                { 
                    name: "narrador", 
                    position: "none",
                    image: null
                }
            ],
            text: "Desde la ventana ves un vasto jardín descuidado y, a lo lejos, las siluetas de montañas. Parece que estás en un castillo aislado. El jardín parece no haber sido cuidado durante años.",
            interactiveElements: [
                { 
                    id: "return",
                    name: "Volver",
                    position: { bottom: "10%", left: "10%", width: "70px", height: "40px" },
                    nextScene: "scene1"
                },
                { 
                    id: "examine",
                    name: "Examinar",
                    position: { top: "30%", right: "10%", width: "80px", height: "40px" },
                    nextScene: "scene4"
                }
            ]
        },
        "scene3": {
            background: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            characters: [
                { 
                    name: "narrador", 
                    position: "none",
                    image: null
                }
            ],
            text: "Sales a un pasillo largo y oscuro. Las paredes están adornadas con retratos antiguos cuyos ojos parecen seguir tus movimientos. El silencio es casi absoluto.",
            interactiveElements: [
                { 
                    id: "left",
                    name: "Izquierda",
                    position: { top: "50%", left: "10%", width: "80px", height: "40px" },
                    nextScene: "scene5"
                },
                { 
                    id: "right",
                    name: "Derecha",
                    position: { top: "50%", right: "10%", width: "80px", height: "40px" },
                    nextScene: "scene6"
                },
                { 
                    id: "back",
                    name: "Atrás",
                    position: { bottom: "10%", left: "50%", width: "70px", height: "40px" },
                    nextScene: "scene1"
                }
            ]
        },
        "scene4": {
            background: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            characters: [
                { 
                    name: "narrador", 
                    position: "none",
                    image: null
                }
            ],
            text: "Al examinar la habitación, encuentras un diario escondido debajo de la cama. En la primera página dice: 'Si estás leyendo esto, significa que él te ha traído aquí también. Ten cuidado con los retratos.'",
            interactiveElements: [
                { 
                    id: "read",
                    name: "Leer Diario",
                    position: { top: "40%", left: "50%", width: "90px", height: "50px" },
                    nextScene: "scene7"
                },
                { 
                    id: "leave",
                    name: "Dejar",
                    position: { bottom: "15%", right: "15%", width: "70px", height: "40px" },
                    nextScene: "scene3"
                }
            ]
        },
        "scene5": {
            background: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            characters: [
                { 
                    name: "Figura Misteriosa", 
                    position: "center",
                    image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                }
            ],
            text: "Una figura encapuchada aparece frente a ti. 'No deberías estar aquí', dice con voz grave. 'Pero ya que has venido, debes conocer la verdad sobre este lugar.'",
            interactiveElements: [
                { 
                    id: "ask",
                    name: "Preguntar",
                    position: { top: "60%", left: "40%", width: "80px", height: "40px" },
                    nextScene: "scene8"
                },
                { 
                    id: "flee",
                    name: "Huir",
                    position: { bottom: "20%", right: "20%", width: "70px", height: "40px" },
                    nextScene: "scene9"
                }
            ]
        }
        // Más escenas pueden agregarse aquí
    }
};