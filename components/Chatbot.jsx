import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Send, X } from 'lucide-react';
import '../chatbot.css';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  async function sendMessage(event) {
    event?.preventDefault();
    const message = input.trim();
    if (!message || loading) return;
    setInput('');
    setHistory((current) => [...current, { role: 'user', content: message }]);
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversationHistory: history }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.details || data.error || 'Failed to get response');
      const reply = data.success && data.reply ? data.reply : 'Sorry, I encountered an error. Please try again.';
      setHistory((current) => [...current, { role: 'assistant', content: reply }]);
    } catch (error) {
      const reply = error.message.includes('GEMINI_API_KEY')
        ? 'The chatbot is not configured yet. Add GEMINI_API_KEY in Netlify, redeploy, and try again.'
        : `Sorry, I hit an error: ${error.message}`;
      setHistory((current) => [...current, { role: 'assistant', content: reply }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.aside className="chatbot-widget active" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} aria-label="Ask Arone chatbot">
            <div className="chatbot-header"><div className="chatbot-title"><Bot size={18} /><span>Ask Arone</span></div><button className="chatbot-close" type="button" onClick={() => setOpen(false)} aria-label="Close chatbot"><X size={18} /></button></div>
            <div className="chatbot-messages">
              <div className="chat-message bot-message"><p>Hi! I&apos;m Arone&apos;s AI assistant. Ask me about experience, projects, or working together.</p></div>
              {history.map((message, index) => <div className={`chat-message ${message.role === 'user' ? 'user-message' : 'bot-message'}`} key={`${message.role}-${index}`}><p>{message.content}</p></div>)}
              {loading && <div className="chat-message bot-message"><p>Thinking...</p></div>}
            </div>
            <form className="chatbot-input-area" onSubmit={sendMessage}><input className="chatbot-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type your message..." autoComplete="off" disabled={loading} /><button className="chatbot-send" type="submit" aria-label="Send message" disabled={loading}><Send size={17} /></button></form>
          </motion.aside>
        )}
      </AnimatePresence>
      {!open && <button className="chatbot-toggle" type="button" onClick={() => setOpen(true)} aria-label="Open chatbot"><Bot size={24} /></button>}
    </>
  );
}
