import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  RotateCcw, 
  ChevronDown, 
  ExternalLink, 
  ShieldCheck, 
  Satellite, 
  Building2, 
  Zap, 
  Check, 
  Copy,
  FileText,
  Phone
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  {
    icon: Building2,
    label: 'IPA Company Registration',
    text: 'What are the required documents and steps to register a new SME company with the Investment Promotion Authority (IPA) in Papua New Guinea?',
  },
  {
    icon: Satellite,
    label: 'Starlink Installation Quote',
    text: 'Can you explain KILSTA’s turnkey Starlink installation service, cyclone-rated mounting, and off-grid solar power integration for Milne Bay?',
  },
  {
    icon: FileText,
    label: 'IRC TIN & Tax Compliance',
    text: 'How does KILSTA assist with obtaining an IRC Tax Identification Number (TIN), GST registrations, and Certificates of Compliance?',
  },
  {
    icon: Zap,
    label: 'Rural LAN & Wi-Fi Mesh',
    text: 'What network solutions does KILSTA deploy for remote schools, health centers, or island eco-resorts across Milne Bay Province?',
  },
];

const INITIAL_MESSAGE = {
  role: 'model',
  text: `Hello and welcome! I am the **KILSTA AI Advisory Assistant**, your digital guide to corporate compliance and high-speed ICT infrastructure in Papua New Guinea.

How can I assist your organization today?
- **Section A: Corporate Services**: IPA Incorporations, IRC TIN & GST registrations, SME bookkeeping seminars, and formal tender compliance.
- **Section B: ICT & Connectivity**: Turnkey Starlink satellite deployments, cyclone-rated mast engineering, rural Wi-Fi mesh, and local staff digital training.

Select a question below or describe your requirements!`,
  timestamp: new Date(),
  modelUsed: 'gemini-3.8-flash',
};

export default function GeminiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState('general'); // 'general' | 'fast' | 'complex'
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [errorNotice, setErrorNotice] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setErrorNotice(null);
    const userTimestamp = new Date();
    const newHistory = [
      ...messages,
      { role: 'user', text, timestamp: userTimestamp },
    ];

    setMessages(newHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Map existing messages to history payload (excluding the very initial prompt greeting if preferred or keep clean)
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          mode: activeMode,
        }),
      });

      // Safely read raw text first to avoid "Failed to execute 'json' on 'Response'" crash
      let rawText = '';
      try {
        rawText = await res.text();
      } catch (readErr) {
        console.warn('Could not read response text:', readErr);
      }

      let data = null;
      if (rawText && rawText.trim()) {
        try {
          data = JSON.parse(rawText);
        } catch (jsonErr) {
          console.warn('Response was not valid JSON:', rawText);
        }
      }

      if (data && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            text: data.reply,
            timestamp: new Date(),
            modelUsed: data.modelUsed || (activeMode === 'fast' ? 'gemini-3.1-flash-lite' : activeMode === 'complex' ? 'gemini-4-argon' : 'gemini-3.8-flash'),
          },
        ]);
      } else {
        // Fallback response with official KILSTA guidance if upstream API is busy
        const fallbackText = "### **KILSTA Advisory Desk | Live Response**\n\nThank you for reaching out to **KILSTA Business & ICT Consultants**.\n\nOur AI advisory engine is currently operating under high demand. For urgent assistance with **IPA Company Registrations (IPA: 6-129295384)**, **IRC TIN Numbers (TIN: 502603269)**, or **Starlink Low-Earth Orbit Satellite Installations** across Milne Bay:\n\n- **Principal Director:** Stallone Yabom\n- **Direct Hotline / WhatsApp:** +675 82545274\n- **Email:** kilsta2023@gmail.com\n- **Office Location:** Gumini Village, Huhu LLG, Alotau District\n\nPlease submit an inquiry form below or re-send your question!";
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            text: fallbackText,
            timestamp: new Date(),
            modelUsed: 'kilsta-advisory-desk',
          },
        ]);
      }
    } catch (err) {
      console.error('Chat send error:', err);
      setErrorNotice('The advisory connection experienced a momentary delay. Please try again or call our Alotau office at +675 82545274.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetConversation = () => {
    setMessages([
      {
        ...INITIAL_MESSAGE,
        timestamp: new Date(),
      },
    ]);
    setErrorNotice(null);
  };

  const copyMessageToClipboard = (text, idx) => {
    navigator.clipboard?.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper to format simple markdown-like text (bolding, lists, linebreaks)
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;

    const lines = rawText.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed text-xs sm:text-sm">
        {lines.map((line, lineIdx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={lineIdx} className="h-1.5" />;
          }

          // Bullet point line
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const bulletContent = trimmed.substring(2);
            return (
              <div key={lineIdx} className="flex items-start gap-2 pl-1 my-0.5">
                <span className="text-blue-600 font-bold shrink-0 mt-0.5">•</span>
                <span>{renderInlineStyles(bulletContent)}</span>
              </div>
            );
          }

          // Numbered list line (e.g. 1. 2.)
          const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numberedMatch) {
            return (
              <div key={lineIdx} className="flex items-start gap-2 pl-1 my-0.5">
                <span className="text-blue-700 font-bold font-mono text-[11px] shrink-0 mt-0.5">
                  {numberedMatch[1]}.
                </span>
                <span>{renderInlineStyles(numberedMatch[2])}</span>
              </div>
            );
          }

          // Heading line (e.g. ### or ##)
          if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
            const headingText = trimmed.replace(/^#+\s+/, '');
            return (
              <h4 key={lineIdx} className="font-extrabold text-slate-900 mt-2 mb-1 text-xs sm:text-sm">
                {renderInlineStyles(headingText)}
              </h4>
            );
          }

          return (
            <p key={lineIdx} className="my-0.5">
              {renderInlineStyles(line)}
            </p>
          );
        })}
      </div>
    );
  };

  // Inline styles for bold (**text**)
  const renderInlineStyles = (str) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Action Button Launcher (Bottom Right) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {/* Subtle Callout Badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-white border border-blue-200 py-1.5 px-3 rounded-full shadow-md text-xs font-bold text-slate-800 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Ask KILSTA AI</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open KILSTA AI Advisory Assistant"
            className="group relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0047BA] via-blue-600 to-[#00A651] text-white shadow-xl hover:shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-blue-300"
          >
            {/* Sparkle Accent */}
            <span className="absolute -top-1 -right-1 text-amber-300 animate-spin-slow w-4 h-4 pointer-events-none">
              <Sparkles className="w-full h-full" />
            </span>

            <MessageSquare className="w-6 h-6 group-hover:rotate-6 transition-transform" />

            {/* Notification Dot */}
            <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
          </button>
        </div>
      )}

      {/* Expandable Chat Modal Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[460px] md:w-[500px] h-[640px] max-h-[90vh] bg-white border border-blue-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] animate-in fade-in slide-in-from-bottom-6 duration-300">
          
          {/* 1. Chat Header */}
          <div className="p-4 bg-gradient-to-r from-blue-50/80 via-white to-emerald-50/60 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/assets/aistudio/Kilsta_Business_ICT_Consultancy_Emblem_5a8c1ec5.png"
                  alt="KILSTA Emblem"
                  className="w-10 h-10 object-contain rounded-full border border-blue-200 shadow-2xs"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                    KILSTA AI Advisor
                  </h3>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    Gemini
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>IPA: 6-129295384</span>
                  </span>
                  <span>•</span>
                  <span>Alotau, PNG</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={resetConversation}
                title="Restart conversation"
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close AI Chat"
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. Model Mode Selector Strip */}
          <div className="px-4 py-2 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
            <span className="font-medium text-[11px] text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Model Mode:</span>
            </span>
            <div className="inline-flex p-0.5 rounded-lg bg-slate-200/70 text-[11px] font-semibold">
              <button
                onClick={() => setActiveMode('general')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  activeMode === 'general'
                    ? 'bg-white text-blue-800 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Gemini 3.8 Flash - General corporate & ICT inquiries"
              >
                General (3.8 Flash)
              </button>
              <button
                onClick={() => setActiveMode('fast')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  activeMode === 'fast'
                    ? 'bg-white text-blue-800 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Gemini 3.1 Flash Lite - Fast response mode"
              >
                Fast (Lite)
              </button>
              <button
                onClick={() => setActiveMode('complex')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  activeMode === 'complex'
                    ? 'bg-white text-blue-800 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Gemini 4 Argon - Complex regulatory & strategic analysis"
              >
                Complex (Argon)
              </button>
            </div>
          </div>

          {/* 3. Scrollable Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white via-slate-50/40 to-white">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={index}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 shadow-2xs relative group ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-xs font-medium'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                    }`}
                  >
                    {isUser ? (
                      <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </p>
                    ) : (
                      renderFormattedText(msg.text)
                    )}

                    {/* Metadata & Actions Footer */}
                    <div
                      className={`mt-2 pt-1 flex items-center justify-between text-[10px] ${
                        isUser ? 'text-blue-100' : 'text-slate-500 border-t border-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {!isUser && msg.modelUsed && (
                          <span className="font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {msg.modelUsed}
                          </span>
                        )}
                        <span>
                          {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {!isUser && (
                        <button
                          onClick={() => copyMessageToClipboard(msg.text, index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-blue-600 text-slate-500 flex items-center gap-1 cursor-pointer"
                          title="Copy answer"
                        >
                          {copiedIndex === index ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-4 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-500" />
                    <span>Consulting KILSTA advisory engine...</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {errorNotice && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center justify-between">
                <span>{errorNotice}</span>
                <button
                  onClick={() => setErrorNotice(null)}
                  className="font-bold underline text-red-800 ml-2 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 4. Suggested Questions Carousel (shown when message count is small) */}
          {messages.length <= 3 && !isLoading && (
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 shrink-0">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Suggested Advisory Prompts:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {SUGGESTED_QUESTIONS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(item.text)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer shadow-2xs"
                    >
                      <Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Input Bar & Actions */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <div className="relative flex items-center gap-2">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask about IPA registration, Starlink kit installation, IRC TIN..."
                className="w-full resize-none py-2.5 pl-3.5 pr-12 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                className="absolute right-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 transition-all cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                title="Send inquiry"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Contact Desk Link & Phone */}
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1 text-blue-700 hover:text-blue-800 font-semibold transition-colors"
              >
                <span>Submit Official Inquiry Form</span>
                <ExternalLink className="w-3 h-3 text-blue-600" />
              </a>
              <a
                href="tel:+67582545274"
                className="flex items-center gap-1 text-slate-600 hover:text-emerald-700 font-mono transition-colors"
              >
                <Phone className="w-3 h-3 text-emerald-600" />
                <span>+675 82545274</span>
              </a>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
