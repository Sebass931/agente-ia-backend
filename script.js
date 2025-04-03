document.getElementById('send-button').addEventListener('click', function() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    // Mostrar mensaje del usuario en el chat
    const chatMessages = document.getElementById('chat-messages');
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.textContent = `Tú: ${userInput}`;
    chatMessages.appendChild(userMessage);

    // Simular respuesta del agente (luego lo conectaremos a D-ID y n8n)
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot-message';
        botMessage.textContent = "Agente: Estoy procesando tu mensaje... (esto será una respuesta real con D-ID)";
        chatMessages.appendChild(botMessage);
    }, 1000);

    // Limpiar el input
    document.getElementById('user-input').value = '';
});