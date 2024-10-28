// Función para enviar el mensaje del usuario y mostrar la respuesta del bot
function sendMessage() {
    const userInput = document.getElementById("user-input");
    const chatMessages = document.getElementById("chat-messages");

    // Obtiene el mensaje del usuario
    const userMessage = userInput.value.trim();
    if (userMessage === "") return;

    // Muestra el mensaje del usuario en el chat
    const userMessageElement = document.createElement("div");
    userMessageElement.classList.add("message", "user-message");
    userMessageElement.textContent = userMessage;
    chatMessages.appendChild(userMessageElement);

    // Limpia el campo de entrada
    userInput.value = "";

    // Respuesta automática del bot
    const botMessageElement = document.createElement("div");
    botMessageElement.classList.add("message", "bot-message");
    
    // Generar una respuesta basada en la pregunta
    botMessageElement.textContent = getBotResponse(userMessage);
    
    chatMessages.appendChild(botMessageElement);

    // Desplaza el chat hacia abajo
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Función para generar respuestas automáticas del bot
function getBotResponse(message) {
    message = message.toLowerCase();
    
    // Respuestas automáticas básicas
    if (message.includes("hola")) {
        return "¡Hola! ¿En qué puedo ayudarte hoy?";
    } else if (message.includes("soporte") || message.includes("ayuda")) {
        return "Estamos aquí para ayudarte. ¿Cuál es tu consulta?";
    } else if (message.includes("precio") || message.includes("costo")) {
        return "Para más detalles de precios, visita nuestra página de productos o déjanos saber en qué artículo estás interesado.";
    } else {
        return "Lo siento, no tengo una respuesta para esa pregunta, pero nuestro equipo de soporte te ayudará pronto.";
    }
}

// Función para manejar la tecla Enter para enviar mensajes
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
