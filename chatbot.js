// Chatbot functionality
class PortfolioChatbot {
    constructor() {
        this.conversationHistory = [];
        this.isOpen = false;
        this.isLoading = false;
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.toggle = document.getElementById('chatbot-toggle');
        this.widget = document.getElementById('chatbot-widget');
        this.closeBtn = document.getElementById('chatbot-close');
        this.input = document.getElementById('chatbot-input');
        this.sendBtn = document.getElementById('chatbot-send');
        this.messagesContainer = document.getElementById('chatbot-messages');
    }

    attachEventListeners() {
        this.toggle.addEventListener('click', () => this.toggleWidget());
        this.closeBtn.addEventListener('click', () => this.closeWidget());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    toggleWidget() {
        if (this.isOpen) {
            this.closeWidget();
        } else {
            this.openWidget();
        }
    }

    openWidget() {
        this.isOpen = true;
        this.widget.classList.add('active');
        this.toggle.classList.add('hidden');
        this.input.focus();
    }

    closeWidget() {
        this.isOpen = false;
        this.widget.classList.remove('active');
        this.toggle.classList.remove('hidden');
    }

    async sendMessage() {
        const message = this.input.value.trim();

        if (!message || this.isLoading) return;

        // Add user message to UI
        this.addMessageToUI(message, 'user');
        this.input.value = '';
        this.input.disabled = true;
        this.sendBtn.disabled = true;
        this.isLoading = true;

        try {
            // Add to conversation history
            this.conversationHistory.push({
                role: 'user',
                content: message,
            });

            // Call the Netlify function
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversationHistory: this.conversationHistory,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || data.error || 'Failed to get response');
            }

            if (data.success && data.reply) {
                // Add bot response to history and UI
                this.conversationHistory.push({
                    role: 'assistant',
                    content: data.reply,
                });
                this.addMessageToUI(data.reply, 'bot');
            } else {
                this.addMessageToUI(
                    'Sorry, I encountered an error. Please try again.',
                    'bot'
                );
            }
        } catch (error) {
            console.error('Chatbot error:', error);
            const fallbackMessage = error.message.includes('GEMINI_API_KEY')
                ? 'The chatbot is not configured yet. Add GEMINI_API_KEY in Netlify, redeploy, and try again.'
                : `Sorry, I hit an error: ${error.message}`;

            this.addMessageToUI(fallbackMessage, 'bot');
        } finally {
            this.input.disabled = false;
            this.sendBtn.disabled = false;
            this.isLoading = false;
            this.input.focus();
        }
    }

    addMessageToUI(message, sender) {
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${sender}-message`;

        const textEl = document.createElement('p');
        textEl.textContent = message;

        messageEl.appendChild(textEl);
        this.messagesContainer.appendChild(messageEl);

        // Auto-scroll to bottom
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioChatbot();
});
