import { useEffect, useRef, useState } from 'react';
import './ChatWidget.css';

/**
 * ---------------------------------------------------------------------------
 * PREDEFINED KNOWLEDGE BASE
 * ---------------------------------------------------------------------------
 * Each entry has:
 *  - keywords: words/phrases that trigger this answer when found in the user's message
 *  - reply: the bot's response (use \n for line breaks — rendered via CSS white-space)
 *  - quick: optional label shown as a quick-reply suggestion button
 *  - forceSuggestions: if true, always show the suggestion buttons after this reply
 *    (useful for a "help/menu" style entry)
 *
 * IMPORTANT: order matters. entry.find() picks the FIRST entry whose keywords
 * match, so put more specific entries (e.g. "track") before generic ones
 * (e.g. "product") to avoid a generic keyword swallowing a more specific question.
 */
const KNOWLEDGE_BASE = [
  {
    id: 'delivery',
    quick: 'Delivery options',
    keywords: ['delivery', 'shipping', 'ship', 'how long', 'arrive'],
    reply:
      "We offer:\n🚚 Standard Delivery — 3-5 business days ($5.00)\n⚡ Express Delivery — 1-2 business days ($12.00)\n💵 Cash on Delivery is also available in most areas."
  },
  {
    id: 'returns',
    quick: 'Return policy',
    keywords: ['return', 'refund', 'exchange', 'send back'],
    reply:
      'No worries — we have a 7-day easy return policy from the date of delivery. Items must be unused and in original packaging. Want me to start a return for a recent order?'
  },
  {
    id: 'payment',
    quick: 'Payment methods',
    keywords: ['payment', 'pay', 'card', 'bkash', 'nagad', 'cash on delivery', 'cod'],
    reply:
      'We accept Cash on Delivery, major debit/credit cards, and mobile banking (bKash/Nagad) at checkout.'
  },
  {
    id: 'track',
    quick: 'Track my order',
    keywords: ['track', 'order status', 'where is my order', 'tracking'],
    reply:
      "You can check your order status anytime from Cart → My Orders. If you don't have an account yet, drop your order email here and our support team will follow up."
  },
  {
    id: 'discount',
    quick: 'Discounts & offers',
    keywords: ['discount', 'coupon', 'promo', 'sale', 'offer'],
    reply:
      'Great timing! Check the banner on our homepage for active sales, and discounted items show a "% Off" tag right on the product card.'
  },
  {
    id: 'stock',
    keywords: ['stock', 'available', 'in stock', 'out of stock'],
    reply:
      "Stock is shown live on every product page. If something's out of stock, check back soon — we restock regularly!"
  },
  {
    id: 'product_info',
    quick: 'About our products',
    keywords: ['product', 'item', 'quality', 'material', 'authentic', 'genuine', 'brand', 'fabric', 'size', 'variant'],
    reply:
      "All our products are 100% authentic and quality-checked before shipping. Each product page has full details — description, images, size/variant options, and live stock status. Looking for something specific? Try the search bar at the top!"
  },
  {
    id: 'contact',
    quick: 'Contact support',
    keywords: ['contact', 'human', 'agent', 'support', 'talk to someone', 'phone', 'call'],
    reply:
      '📞 +8801719615843\n✉️ srejonadas22@gmail.com\n\nOur team typically replies within a few hours during business days.'
  },
  {
    id: 'hours',
    keywords: ['hours', 'open', 'closing time', 'when are you open'],
    reply: 'Our store is open online 24/7 — customer support replies during business hours, 9 AM–8 PM.'
  },
  {
    id: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'yo', 'assalamualaikum'],
    reply: "Hey there! 👋 I'm the Magic Shop assistant. Ask me about delivery, returns, payments, or anything else!"
  },
  {
    id: 'thanks',
    keywords: ['thank', 'thanks', 'thank you', 'thx'],
    reply: "You're welcome! Anything else I can help with? 😊"
  },
  {
    id: 'help',
    keywords: ['help', 'menu', 'options', 'what can you do'],
    forceSuggestions: true,
    reply: "Sure! Here's what I can help with:"
  }
];

const FALLBACK_REPLIES = [
  "Hmm, I'm not totally sure about that one. Here are some things I can help with:",
  "I don't have an answer for that yet — but maybe one of these will help:"
];

// Topics offered as tappable buttons (only entries with a `quick` label)
const QUICK_REPLIES = KNOWLEDGE_BASE.filter((k) => k.quick);

/**
 * Looks up a reply for the user's free-text message.
 * Returns { text, showSuggestions } — showSuggestions is true whenever
 * we couldn't confidently match a question, or when the matched entry
 * explicitly asks for it (forceSuggestions), so the user always has a
 * way forward instead of hitting a dead end.
 */
function findReply(userText) {
  const text = userText.toLowerCase();
  const match = KNOWLEDGE_BASE.find((entry) => entry.keywords.some((kw) => text.includes(kw)));

  if (match) {
    return { text: match.reply, showSuggestions: !!match.forceSuggestions };
  }

  const fallback = FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
  return { text: fallback, showSuggestions: true };
}

// Simulated "thinking" delay so replies don't feel instant/robotic.
function typingDelayFor(text) {
  const base = 500;
  const perChar = 8;
  return Math.min(base + text.length * perChar, 1800);
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const scrollRef = useRef(null);
  const initializedRef = useRef(false);

  // Send the opening greeting once, the first time the widget is opened.
  useEffect(() => {
    if (isOpen && !initializedRef.current) {
      initializedRef.current = true;
      setIsTyping(true);
      const t = setTimeout(() => {
        setIsTyping(false);
        setMessages([
          {
            id: 'welcome',
            sender: 'bot',
            text: "Hi! 👋 I'm the Magic Shop assistant. How can I help you today?",
            showSuggestions: true
          }
        ]);
      }, 700);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const pushBotReply = (userText) => {
    const { text, showSuggestions } = findReply(userText);
    setIsTyping(true);
    const delay = typingDelayFor(text);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + '-bot', sender: 'bot', text, showSuggestions }
      ]);
      if (!isOpen) setHasUnread(true);
    }, delay);
  };

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { id: Date.now() + '-user', sender: 'user', text: trimmed }]);
    setInput('');
    pushBotReply(trimmed);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    setHasUnread(false);
  };

  return (
    <div className="chat-widget-root">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">🛍️</div>
              <div>
                <div className="chat-title">Magic Shop Assistant</div>
                <div className="chat-subtitle">
                  <span className="online-dot"></span> Online
                </div>
              </div>
            </div>
            <button className="chat-close-btn" onClick={toggleOpen} aria-label="Close chat">
              ✕
            </button>
          </div>

          <div className="chat-body" ref={scrollRef}>
            {messages.map((msg, idx) => {
              const isLastMessage = idx === messages.length - 1;
              return (
                <div key={msg.id}>
                  <div className={`chat-bubble-row ${msg.sender}`}>
                    <div className={`chat-bubble ${msg.sender}`}>{msg.text}</div>
                  </div>

                  {/* Suggested-question buttons appear under the most recent bot
                      message whenever it couldn't confidently answer, or when
                      the matched topic explicitly asks for them (e.g. "help"). */}
                  {msg.sender === 'bot' && msg.showSuggestions && isLastMessage && !isTyping && (
                    <div className="quick-replies">
                      <div className="quick-replies-label">Try one of these:</div>
                      {QUICK_REPLIES.map((q) => (
                        <button key={q.id} className="quick-reply-btn" onClick={() => sendMessage(q.quick)}>
                          {q.quick}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="chat-bubble-row bot">
                <div className="chat-bubble bot typing-bubble">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
          </div>

          <form className="chat-input-row" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              autoComplete="off"
            />
            <button type="submit" className="chat-send-btn" disabled={!input.trim()}>
              ➤
            </button>
          </form>
        </div>
      )}

      <button className="chat-fab" onClick={toggleOpen} aria-label="Open chat">
        {isOpen ? '✕' : '💬'}
        {!isOpen && hasUnread && <span className="chat-fab-badge"></span>}
      </button>
    </div>
  );
};

export default ChatWidget;