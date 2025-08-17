class ChatApp {
    constructor() {
        this.chatContainer = document.getElementById('chat-container');
        this.messageInput = document.getElementById('message-input');
        this.sendButton = document.getElementById('send-button');
        this.modelSelect = document.getElementById('ai-model');
        
        this.isTyping = false;
        this.apiURL = 'https://reallyopen-ai.onrender.com';
        this.apiKey = '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';
        
        this.init();
    }

    init() {
        // Event listeners
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.messageInput.addEventListener('input', () => this.handleInputChange());
        this.modelSelect.addEventListener('change', () => this.handleModelChange());

        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => this.autoResizeTextarea());
        
        // Initial button state
        this.updateSendButton();
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    }

    handleInputChange() {
        this.updateSendButton();
    }

    handleModelChange() {
        const selectedModel = this.modelSelect.value;
        this.addSystemMessage(`Switched to ${selectedModel} model`);
    }

    updateSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendButton.disabled = !hasText || this.isTyping;
    }

    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 200) + 'px';
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;

        const selectedModel = this.modelSelect.value;

        // Add user message to chat
        this.addMessage(message, 'user');

        // Clear input
        this.messageInput.value = '';
        this.autoResizeTextarea();
        this.updateSendButton();

        // Set typing state
        this.isTyping = true;

        // Show typing indicator
        const typingElement = this.showTypingIndicator();

        try {
            const response = await fetch(`${this.apiURL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    message: message,
                    model: selectedModel
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            this.removeTypingIndicator(typingElement);
            this.addMessageWithTyping(data.response, 'bot');

        } catch (error) {
            console.error('Error sending message:', error);
            this.removeTypingIndicator(typingElement);
            this.addMessage('Sorry, there was an error processing your message. Please try again.', 'bot');
        } finally {
            this.isTyping = false;
            this.updateSendButton();
        }
    }

    addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message fade-in`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = this.formatMessage(content);

        messageDiv.appendChild(contentDiv);
        this.chatContainer.appendChild(messageDiv);

        this.scrollToBottom();
    }

    async addMessageWithTyping(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message fade-in`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        messageDiv.appendChild(contentDiv);
        this.chatContainer.appendChild(messageDiv);

        await this.typeText(contentDiv, content);
        this.scrollToBottom();
    }

    async typeText(element, text) {
        const words = text.split(' ');
        let currentText = '';

        for (let i = 0; i < words.length; i++) {
            currentText += (i > 0 ? ' ' : '') + words[i];
            element.innerHTML = this.formatMessage(currentText);
            this.scrollToBottom();

            const delay = Math.random() * 100 + 50;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-message';

        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <span>Thinking</span>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;

        typingDiv.appendChild(indicator);
        this.chatContainer.appendChild(typingDiv);
        this.scrollToBottom();

        return typingDiv;
    }

    removeTypingIndicator(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    addSystemMessage(content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message fade-in';
        messageDiv.style.opacity = '0.7';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.style.fontStyle = 'italic';
        contentDiv.style.fontSize = '0.9rem';
        contentDiv.textContent = content;

        messageDiv.appendChild(contentDiv);
        this.chatContainer.appendChild(messageDiv);

        this.scrollToBottom();
    }

    formatMessage(content) {
        return content.replace(/\n/g, '<br>');
    }

    scrollToBottom() {
        requestAnimationFrame(() => {
            this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log('Chat app is now visible');
    }
});
