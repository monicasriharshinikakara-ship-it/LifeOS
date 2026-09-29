import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, RefreshCw, Zap, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';

const N8N_WEBHOOK_URL = 'https://harshini-27-h.app.n8n.cloud/webhook/d2016426-fbdd-4137-99d4-f1d5d36323e8/chat';

interface N8nMessage {
  id: string;
  sender: 'user' | 'n8n';
  text: string;
  timestamp: string;
}

export const N8nChatView: React.FC = () => {
  const [messages, setMessages] = useState<N8nMessage[]>([
    {
      id: 'm-1',
      sender: 'n8n',
      text: 'Hello! I am connected to your live n8n workflow at harshini-27-h.app.n8n.cloud. How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: N8nMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: text,
          action: 'sendMessage',
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      let botReply = '';
      if (typeof data === 'string') {
        botReply = data;
      } else if (data.output) {
        botReply = data.output;
      } else if (data.text) {
        botReply = data.text;
      } else if (data.message) {
        botReply = data.message;
      } else {
        botReply = JSON.stringify(data, null, 2);
      }

      const n8nMessage: N8nMessage = {
        id: `n8n-${Date.now()}`,
        sender: 'n8n',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, n8nMessage]);
    } catch (err: any) {
      console.error('Error communicating with n8n webhook:', err);
      setErrorMsg(`Failed to connect to n8n webhook: ${err.message}`);

      const fallbackMsg: N8nMessage = {
        id: `err-${Date.now()}`,
        sender: 'n8n',
        text: `⚠️ I encountered an error connecting to your n8n workflow (${err.message}). Please check that the workflow is active in your n8n dashboard at harshini-27-h.app.n8n.cloud.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(N8N_WEBHOOK_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickPrompts = [
    'Hello, what can you do?',
    'I have college exams coming up for 2 weeks.',
    'I completed my Python course milestone.',
    'What should I prioritize this week?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-4">
      {/* Webhook Connection Info Banner */}
      <div className="p-4 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FBE4D5] to-[#E9DDFB] flex items-center justify-center border border-amber-200 shadow-2xs">
            <Zap className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-stone-900 tracking-tight">n8n Live Workflow Chatbot</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Webhook Online
              </span>
            </div>
            <p className="text-xs text-stone-500 font-mono truncate max-w-sm sm:max-w-md">
              harshini-27-h.app.n8n.cloud
            </p>
          </div>
        </div>

        <button
          onClick={copyWebhookUrl}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          title="Copy webhook URL"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
          <span>{copied ? 'Copied' : 'Copy Webhook URL'}</span>
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 whitespace-nowrap pl-1">
          Suggestions:
        </span>
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 transition-all whitespace-nowrap shadow-2xs hover:scale-102"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 bg-white rounded-3xl border border-stone-200/80 shadow-xs p-5 overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}>
              <div
                className={`max-w-2xl p-4 rounded-3xl text-sm leading-relaxed ${
                  isUser
                    ? 'bg-stone-900 text-white rounded-br-xs shadow-xs'
                    : 'bg-[#FFF9F2] text-stone-900 border border-amber-200/70 rounded-bl-xs shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1 opacity-70 text-[11px] font-semibold">
                  <span>{isUser ? 'You' : 'n8n Chatbot'}</span>
                  <span>{m.timestamp}</span>
                </div>
                <p className="whitespace-pre-line">{m.text}</p>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50/60 border border-amber-200 max-w-sm animate-pulse">
            <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
              <Zap className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-800">Waiting for n8n workflow execution...</p>
              <p className="text-[10px] text-stone-500">Executing node chain at harshini-27-h</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message to n8n chatbot..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-2xl bg-white border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 shadow-2xs"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-transform hover:scale-102 shrink-0"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
