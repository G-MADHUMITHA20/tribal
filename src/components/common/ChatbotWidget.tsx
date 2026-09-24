import React, { useState } from 'react';
import { Bot, ChevronDown, MessageCircle, X } from 'lucide-react';

type ChatMessage = {
  id: number;
  text: string;
  sender: 'bot' | 'user';
};

const predefinedQuestions = [
  {
    question: 'Which schemes am I eligible for?',
    answer: 'You can use our eligibility checker to find schemes based on your course, category, income, and academic details.',
  },
  {
    question: 'How do I apply for a scholarship?',
    answer: 'Open Schemes, select a scholarship, and choose Apply Now. You will need to register and upload the required documents.',
  },
  {
    question: 'How can I track my application?',
    answer: 'Sign in and open Dashboard or Track Application to view your current application status and timeline.',
  },
  {
    question: 'What documents are required?',
    answer: 'Common documents include your identity proof, caste certificate, income certificate, marksheets, bank details, and institute verification.',
  },
];

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      sender: 'bot',
      text: 'Namaste! I can help you find schemes, apply, and track your application.',
    },
  ]);

  const handleQuestion = (question: string, answer: string) => {
    setMessages((currentMessages) => [
      ...currentMessages,
      { id: Date.now(), sender: 'user', text: question },
      { id: Date.now() + 1, sender: 'bot', text: answer },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen && (
        <section
          aria-label="Tribal Affairs virtual assistant"
          className="flex h-[min(600px,calc(100vh-120px))] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          <header className="flex items-center justify-between bg-[#0b2853] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5a400] text-[#0b2853]">
                <Bot className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold leading-tight">Mota Sahayak</p>
                <p className="mt-0.5 text-xs text-blue-100">Ministry of Tribal Affairs</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
              className="rounded-md p-2 text-blue-100 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.sender === 'user'
                      ? 'rounded-br-sm bg-[#1d63b8] text-white'
                      : 'rounded-bl-sm border border-slate-200 bg-white text-slate-700 shadow-sm'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Common questions</p>
            <div className="flex max-h-28 flex-wrap gap-2 overflow-y-auto">
              {predefinedQuestions.map(({ question, answer }) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleQuestion(question, answer)}
                  className="rounded-full border border-[#1d63b8]/30 bg-blue-50 px-3 py-1.5 text-left text-xs font-medium text-[#0b458f] transition hover:border-[#1d63b8] hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-[#1d63b8] focus:ring-offset-1"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
        aria-expanded={isOpen}
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#f5a400] text-[#0b2853] shadow-lg ring-4 ring-white transition hover:bg-[#ffb81c] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#1d63b8]/40"
      >
        {isOpen ? <ChevronDown className="h-6 w-6" aria-hidden="true" /> : <MessageCircle className="h-7 w-7" aria-hidden="true" />}
        <span className="pointer-events-none absolute bottom-16 right-0 w-max rounded bg-[#0b2853] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-md transition group-hover:opacity-100 group-focus:opacity-100">
          {isOpen ? 'Minimize chat' : 'Chat with Mota Sahayak'}
        </span>
        {!isOpen && <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white bg-[#138808]" aria-hidden="true" />}
      </button>
    </div>
  );
};