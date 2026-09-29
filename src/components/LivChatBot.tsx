import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Minimize2,
  ExternalLink,
  Bot,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'liv' | 'user';
  text: string;
  timestamp: string;
  isInactiveWarning?: boolean;
}

const STORAGE_KEYS = {
  CHAT_MESSAGES: 'livora_liv_messages_v1',
  SESSION_ID: 'livora_liv_session_id_v1',
};

const INITIAL_GREETING: ChatMessage = {
  id: 'liv-init-msg',
  sender: 'liv',
  text: "Hello, I am LIV — your personal AI companion on LIVORA. I can guide you through choosing routines, surviving Life Twists, or navigating your Life Passport. What would you like to experience today?",
  timestamp: 'Just now',
};

const QUICK_PROMPTS = [
  'Recommend a 30-minute challenge',
  'How do Life Twists work?',
  'I want a peaceful Sunday routine',
  'Tell me about the 5 AM Athlete',
];

export const LivChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load chat history:', e);
    }
    return [INITIAL_GREETING];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
      if (saved) return saved;
      const created = `livora_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(STORAGE_KEYS.SESSION_ID, created);
      return created;
    } catch {
      return `livora_${Date.now()}`;
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  // Persist messages in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save messages to localStorage:', e);
    }
  }, [messages]);

  // Gentle teaser tooltip for new visitors
  useEffect(() => {
    const hasSeen = sessionStorage.getItem('livora_liv_teaser_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setShowTeaser(true);
        sessionStorage.setItem('livora_liv_teaser_seen', 'true');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    setShowTeaser(false);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/liv-chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatInput: query,
          sessionId,
          metadata: {
            app: 'LIVORA',
            page: window.location.pathname,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      const data = await response.json();

      if (data.isWorkflowInactive) {
        // n8n workflow isn't toggled active yet
        const inactiveMsg: ChatMessage = {
          id: `liv-${Date.now()}`,
          sender: 'liv',
          text: `⚠️ **n8n Workflow Notice:**\n${data.error}\n\n*Hint:* In your n8n cloud dashboard, open the workflow and toggle the switch in the top-right corner to **Active**. Once activated, LIV will immediately respond live!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isInactiveWarning: true,
        };
        setMessages((prev) => [...prev, inactiveMsg]);
      } else if (data.success && data.reply) {
        const livMsg: ChatMessage = {
          id: `liv-${Date.now()}`,
          sender: 'liv',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, livMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: `liv-err-${Date.now()}`,
          sender: 'liv',
          text: data.error || 'Sorry, I encountered an issue connecting to my n8n knowledge base. Please check the workflow status.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (error: any) {
      console.error('LIV chat error:', error);
      const networkErrorMsg: ChatMessage = {
        id: `liv-net-err-${Date.now()}`,
        sender: 'liv',
        text: 'Network error communicating with LIV backend. Please check your connection and retry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, networkErrorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConversation = () => {
    const newSession = `livora_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setSessionId(newSession);
    try {
      localStorage.setItem(STORAGE_KEYS.SESSION_ID, newSession);
    } catch {
      // ignore
    }
    setMessages([INITIAL_GREETING]);
  };

  return (
    <>
      {/* Floating Teaser Notification Tooltip */}
      {showTeaser && !isOpen && (
        <div className="fixed bottom-28 md:bottom-22 right-4 md:right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-xs">
          <div className="p-3.5 rounded-2xl bg-[#121424] border border-indigo-500/40 text-slate-100 shadow-2xl relative flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-sky-400 p-[1px] shrink-0">
              <div className="w-full h-full bg-[#0d0f18] rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-xs text-white">Meet LIV</span>
                <button
                  onClick={() => setShowTeaser(false)}
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Your built-in AI lifestyle companion. Ask anything about routines or challenges!
              </p>
              <button
                onClick={() => {
                  setShowTeaser(false);
                  setIsOpen(true);
                }}
                className="mt-2 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <span>Chat with LIV</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sleek Floating Action Button ("LIV") */}
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowTeaser(false);
          }}
          className={`group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl transition-all duration-300 shadow-2xl cursor-pointer ${
            isOpen
              ? 'bg-[#181a2e] border border-indigo-500/50 text-white shadow-indigo-500/20'
              : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white shadow-indigo-600/40 hover:scale-105'
          }`}
          aria-label="Open LIV AI Chatbot"
        >
          {/* Animated Glow Halo */}
          <span className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 opacity-30 group-hover:opacity-60 blur-md transition-opacity -z-10" />

          {/* Icon Orb */}
          <div className="relative flex items-center justify-center">
            {isOpen ? (
              <ChevronDown className="w-5 h-5 text-indigo-300 transition-transform duration-200" />
            ) : (
              <>
                <div className="w-7 h-7 rounded-xl bg-black/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-sky-300 animate-pulse" />
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-black absolute -top-0.5 -right-0.5" />
              </>
            )}
          </div>

          {/* Label */}
          <div className="flex flex-col text-left">
            <span className="font-display font-extrabold text-sm tracking-wider uppercase leading-none">
              LIV
            </span>
            <span className="text-[9px] font-mono text-indigo-100 opacity-90 tracking-widest uppercase mt-0.5">
              AI Companion
            </span>
          </div>
        </button>
      </div>

      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-36 md:bottom-22 right-3 md:right-6 z-50 w-[94vw] sm:w-[420px] h-[580px] max-h-[75vh] md:max-h-[82vh] rounded-3xl bg-[#0b0c16]/95 backdrop-blur-2xl border border-indigo-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-4 px-5 bg-gradient-to-r from-indigo-950/60 via-[#101222] to-slate-950/80 border-b border-white/8 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-[1px] shadow-sm">
                  <div className="w-full h-full bg-[#0d0f18] rounded-[11px] flex items-center justify-center">
                    <span className="font-display font-bold text-sm text-indigo-300">
                      L
                    </span>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0b0c16] absolute -bottom-0.5 -right-0.5" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-bold text-sm text-white tracking-wide">
                    LIV
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    LIVORA AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-light flex items-center gap-1">
                  <span>Built-in companion</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400">Live</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetConversation}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Close chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Webhook Connection Sub-banner */}
          <div className="py-1 px-4 bg-indigo-950/20 border-b border-indigo-500/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="truncate max-w-[280px]">
              Host: n8n webhook (f8d01049...240)
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Ready
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pr-3 scrollbar-thin">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-sm shadow-md'
                        : msg.isInactiveWarning
                        ? 'bg-amber-950/40 border border-amber-500/40 text-amber-200 rounded-bl-sm'
                        : 'bg-white/[0.04] border border-white/8 text-slate-200 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {/* Message Text with Simple Markdown Linebreaks */}
                    <div className="whitespace-pre-wrap font-light">
                      {msg.text}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Thinking / Typing Pulse */}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1 px-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                </div>
                <span className="font-mono text-[11px] text-indigo-300">
                  LIV is thinking...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-white/6 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  className="shrink-0 text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/8 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-[#0d0f1a] border-t border-white/8 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask LIV anything about routines..."
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all cursor-pointer shadow-md shadow-indigo-600/30"
                aria-label="Send message to LIV"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
              <span>LIVORA AI</span>
              <span>Press Enter to send</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
