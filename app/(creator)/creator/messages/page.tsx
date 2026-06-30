'use client';

import { useState } from 'react';
import { ChevronLeft, Plus, Send, MessageCircle, AlertCircle, X, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  sender: 'user' | 'support';
  text: string;
  timestamp: string;
}

interface Chat {
  id: number;
  subject: string;
  status: 'Reject' | 'Active' | 'Pending' | 'Close';
  snippet: string;
  time: string;
  unreadCount?: number;
  messages: Message[];
}

const INITIAL_CHATS: Chat[] = [
  {
    id: 1,
    subject: 'Trendupp Support',
    status: 'Reject',
    snippet: "We've reviewed the brief and your submission...",
    time: '2h ago',
    messages: [
      { id: 1, sender: 'support', text: 'Campaign Brief review updates', timestamp: '3 days ago' },
      {
        id: 2,
        sender: 'support',
        text: "We've reviewed the brief and your submission. Revisions are needed.",
        timestamp: '2h ago',
      },
    ],
  },
  {
    id: 2,
    subject: 'Trendupp Support',
    status: 'Active',
    snippet: 'Thanks for reaching out! How can we help...',
    time: '3 days ago',
    unreadCount: 1,
    messages: [
      { id: 1, sender: 'support', text: 'Payment Issue', timestamp: '3 days ago' },
      {
        id: 2,
        sender: 'support',
        text: "Your message has been received. We'll respond shortly.",
        timestamp: '2h ago',
      },
    ],
  },
  {
    id: 3,
    subject: 'Trendupp Support',
    status: 'Pending',
    snippet: 'Thanks for reaching out! How can we help y...',
    time: '3 days ago',
    messages: [
      { id: 1, sender: 'support', text: 'Account Verification Request', timestamp: '3 days ago' },
    ],
  },
  {
    id: 4,
    subject: 'Trendupp Support',
    status: 'Close',
    snippet: 'Thanks for reaching out! How can we help y...',
    time: '3 days ago',
    messages: [
      { id: 1, sender: 'support', text: 'Escrow Release Assistance', timestamp: '4 days ago' },
      { id: 2, sender: 'support', text: 'Resolved successfully.', timestamp: '3 days ago' },
    ],
  },
];

export default function MessagesPage() {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [typedMessage, setTypedMessage] = useState('');

  // New chat modal/process states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [newMsgText, setNewMsgText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const activeChat = chats.find((c) => c.id === activeChatId);

  // Send a message in active chat thread
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeChatId) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: typedMessage,
      timestamp: 'Just now',
    };

    setChats((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId) {
          const updatedMsgs = [...c.messages, newMessage];
          return {
            ...c,
            snippet: typedMessage,
            time: 'Just now',
            messages: updatedMsgs,
          };
        }
        return c;
      }),
    );

    setTypedMessage('');

    // Simulate auto-admin reply
    setTimeout(() => {
      const replyMessage: Message = {
        id: Date.now() + 1,
        sender: 'support',
        text: 'Thank you for your message. A Trendupp admin will get back to you shortly.',
        timestamp: 'Just now',
      };
      setChats((prev) =>
        prev.map((c) => {
          if (c.id === activeChatId) {
            return {
              ...c,
              messages: [...c.messages, replyMessage],
            };
          }
          return c;
        }),
      );
    }, 1500);
  };

  // Submit new support request thread
  const handleCreateChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !newMsgText.trim()) return;

    setIsModalOpen(false);
    setShowSuccess(true);
  };

  const handleFinishSuccess = () => {
    // Add new chat to list
    const newChat: Chat = {
      id: Date.now(),
      subject: 'Trendupp Support',
      status: 'Pending',
      snippet: newMsgText,
      time: 'Just now',
      messages: [
        { id: 1, sender: 'support', text: subject, timestamp: 'Just now' },
        { id: 2, sender: 'support', text: newMsgText, timestamp: 'Just now' },
      ],
    };

    setChats([newChat, ...chats]);
    setSubject('');
    setNewMsgText('');
    setShowSuccess(false);
  };

  return (
    <div className="flex-1 flex overflow-hidden relative select-none h-full w-full">
      {/* 1. Chats List Pane (left column on desktop, hidden on mobile when chat detail is open) */}
      <div
        className={cn(
          'w-full md:w-[360px] md:border-r border-[#e8e6f0]/60 flex flex-col bg-white h-full shrink-0 relative transition-all duration-300',
          activeChatId !== null ? 'hidden md:flex' : 'flex',
        )}
      >
        {/* Header info */}
        <div className="p-6 border-b border-[#e8e6f0]/60 flex flex-col gap-1 text-left">
          <h2 className="text-xl font-bold text-[#1a1a2e]">Messages</h2>
          <p className="text-[11px] font-light text-[#7a7a9a]">
            Admin-activated campaign chats and support
          </p>
        </div>

        {/* Warning notification banner */}
        <div className="px-6 py-4">
          <div className="bg-[#fff0f5] border border-[#fcecf3] rounded-2xl p-4 flex gap-3 text-left">
            <MessageCircle className="w-5 h-5 text-brand-pink shrink-0 mt-0.5" />
            <span className="text-[10.5px] font-medium text-[#8b1a47] leading-relaxed">
              Campaign chats with advertisers are opened by Trendupp when needed. Tap + to message
              our support team.
            </span>
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto px-4 pb-20 flex flex-col gap-2.5 auth-scrollbar">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => {
                setActiveChatId(chat.id);
                // Clear unread count
                setChats((prev) =>
                  prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: undefined } : c)),
                );
              }}
              className={cn(
                'w-full text-left p-4 rounded-[20px] border transition-all flex items-start justify-between gap-3 cursor-pointer group',
                chat.id === activeChatId
                  ? 'bg-[#fcfafc] border-brand-pink/20 shadow-sm'
                  : 'bg-white border-[#e8e6f0]/50 hover:border-[#dcdbe6]',
              )}
            >
              <div className="flex gap-3 min-w-0">
                {/* Red Hashtag / Support Icon Circle */}
                <div className="w-10 h-10 rounded-full bg-brand-pink-light flex items-center justify-center text-brand-pink font-extrabold text-sm shrink-0">
                  #
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1a1a2e] group-hover:text-brand-pink transition-colors">
                      {chat.subject}
                    </span>
                    <span
                      className={cn(
                        'text-[9px] font-bold px-2 py-0.5 rounded-full leading-none',
                        chat.status === 'Active' && 'bg-green-100 text-green-700',
                        chat.status === 'Reject' && 'bg-red-100 text-red-700',
                        chat.status === 'Pending' && 'bg-blue-100 text-blue-700',
                        chat.status === 'Close' && 'bg-gray-100 text-gray-700',
                      )}
                    >
                      {chat.status}
                    </span>
                  </div>
                  <p className="text-[10.5px] font-light text-[#7a7a9a] truncate mt-1">
                    {chat.snippet}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[9px] font-medium text-[#9a99b0]">{chat.time}</span>
                {chat.unreadCount && (
                  <span className="w-4 h-4 rounded-full bg-brand-pink text-white text-[9px] font-extrabold flex items-center justify-center leading-none">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Floating action button (FAB) */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute bottom-6 right-6 w-12 h-12 bg-brand-pink hover:bg-brand-pink/90 text-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer z-10"
          aria-label="Message support admin"
        >
          <Plus size={22} />
        </button>
      </div>

      {/* 2. Messages Threads Chat Pane (right column on desktop, covers mobile when open) */}
      <div
        className={cn(
          'flex-1 flex flex-col bg-[#faf9fc] h-full transition-all duration-300 relative',
          activeChatId === null ? 'hidden md:flex' : 'flex',
        )}
      >
        {activeChat ? (
          <div className="flex flex-col h-full w-full">
            {/* Active chat header */}
            <div className="p-4 border-b border-[#e8e6f0]/60 bg-white flex items-center justify-between shadow-sm select-none shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveChatId(null)}
                  className="p-1 text-[#7a7a9a] hover:text-[#1a1a2e] md:hidden cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-brand-pink-light flex items-center justify-center text-brand-pink font-extrabold text-sm shrink-0">
                  #
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-[#1a1a2e]">{activeChat.subject}</span>
                  <span className="text-[9.5px] font-light text-[#7a7a9a]">Payment Issue</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#16a34a] bg-[#dcfce7] px-3 py-1 rounded-full uppercase tracking-wider leading-none">
                {activeChat.status}
              </span>
            </div>

            {/* Scrollable chat messages area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 auth-scrollbar">
              {activeChat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex flex-col max-w-[75%] gap-1.5',
                    msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start',
                  )}
                >
                  <div
                    className={cn(
                      'p-4 rounded-2xl text-xs font-light leading-relaxed text-left shadow-sm',
                      msg.sender === 'user'
                        ? 'bg-brand-pink text-white rounded-br-none'
                        : 'bg-white border border-[#e8e6f0]/50 text-[#1a1a2e] rounded-bl-none',
                    )}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-[#9a99b0] font-medium px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom text input footer */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-[#e8e6f0]/60 bg-white flex gap-3 select-none shrink-0"
            >
              <Input
                type="text"
                placeholder="Type a message..."
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                className="flex-1 border-[#e8e6f0] h-11 text-xs font-light px-4 focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink rounded-xl bg-[#fcfcfd]"
              />
              <button
                type="submit"
                disabled={!typedMessage.trim()}
                className="w-11 h-11 bg-brand-pink text-white rounded-full flex items-center justify-center shrink-0 hover:bg-brand-pink/90 active:scale-95 transition-all disabled:bg-brand-pink/45 cursor-pointer"
              >
                <Send size={15} className="text-white fill-current" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 select-none">
            <div className="w-14 h-14 rounded-full bg-[#f4f3f6] flex items-center justify-center text-[#9a99b0] mb-4">
              <MessageCircle size={24} />
            </div>
            <span className="text-xs font-bold text-[#1a1a2e]">No conversation selected</span>
            <p className="text-[11px] font-light text-[#7a7a9a] mt-1 text-center max-w-[240px]">
              Select a conversation from the sidebar or click + to contact support.
            </p>
          </div>
        )}
      </div>

      {/* 3. New Chat Modal Dialog Form (Screen 2) */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && setIsModalOpen(false)}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-[420px] rounded-[24px] bg-white border border-[#e8e6f0]/60 p-6 flex flex-col gap-5 shadow-xl scrollbar-hide select-none"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <DialogTitle className="text-[17px] font-bold text-[#1a1a2e]">
                Message Trendupp Admin
              </DialogTitle>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-7 h-7 rounded-full bg-[#f4f4f8] hover:bg-[#eaeaf0] flex items-center justify-center text-[#7a7a9a] transition-colors border-none cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* Blue Warning Block */}
          <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-2xl p-4 flex gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-[#2563eb] shrink-0 mt-0.5" />
            <span className="text-[11px] font-medium text-[#1e40af] leading-relaxed">
              Messages are reviewed by Trendupp admins. Chats with advertisers are opened by admin
              when needed for dispute resolution.
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateChat} className="flex flex-col gap-4">
            {/* Subject Input */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                Subject
              </Label>
              <Input
                type="text"
                placeholder="Payment Issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border-[#e8e6f0] h-11 text-xs font-light focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink"
                required
              />
            </div>

            {/* Messages Textarea */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                Messages
              </Label>
              <Textarea
                placeholder="Describe your query or issue in detail..."
                value={newMsgText}
                onChange={(e) => setNewMsgText(e.target.value)}
                className="border-[#e8e6f0] text-xs font-light min-h-[100px] focus-visible:ring-brand-pink/30 focus-visible:border-brand-pink rounded-xl p-3 resize-none"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-semibold text-xs h-11 rounded-2xl shadow-md transition-all active:scale-95"
            >
              Send Message
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* 4. Chat Request Sent Successfully Full-page Overlay (Screen 3) */}
      {showSuccess && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center select-none animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-[#dcfce7] border border-[#bbf7d0] text-[#16a34a] flex items-center justify-center mb-6">
            <Check size={32} strokeWidth={2.5} />
          </div>

          <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">Chat Request Sent Successfully</h3>
          <p className="text-xs font-light text-[#7a7a9a] leading-relaxed max-w-[280px] mb-8">
            We&apos;ve received your request and our support team will get back to you within 24
            hours.
          </p>

          <button
            onClick={handleFinishSuccess}
            className="bg-brand-pink hover:bg-brand-pink/90 text-white font-bold text-xs py-3.5 px-8 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer w-full max-w-[280px]"
          >
            Back to campaign
          </button>
        </div>
      )}
    </div>
  );
}
