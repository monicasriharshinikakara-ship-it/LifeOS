import React, { useEffect } from 'react';

const N8N_WEBHOOK_URL = 'https://harshini-27-h.app.n8n.cloud/webhook/d2016426-fbdd-4137-99d4-f1d5d36323e8/chat';

export const N8nFloatingWidget: React.FC = () => {
  useEffect(() => {
    // Prevent multiple initializations
    if ((window as any).__n8nChatInitialized) return;
    (window as any).__n8nChatInitialized = true;

    // Load official n8n chat styles
    if (!document.getElementById('n8n-chat-style')) {
      const link = document.createElement('link');
      link.id = 'n8n-chat-style';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
      document.head.appendChild(link);
    }

    // Inject module script to create chat
    const script = document.createElement('script');
    script.id = 'n8n-chat-script';
    script.type = 'module';
    script.innerHTML = `
      import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

      createChat({
        webhookUrl: '${N8N_WEBHOOK_URL}',
        mode: 'window',
        showWelcomeScreen: false,
        initialMessages: [
          'Hello! 👋',
          'I am your LifeOS n8n chatbot. How can I assist you with your plans or questions today?'
        ],
        i18n: {
          en: {
            title: 'LifeOS Assistant',
            subtitle: 'Powered by n8n Workflow',
            footer: 'Connected to harshini-27-h.app.n8n.cloud',
            getStarted: 'Start conversation',
            inputPlaceholder: 'Ask me anything...',
          },
        },
      });
    `;
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  return null;
};
