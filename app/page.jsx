'use client';
import { useState, useRef, useEffect } from 'react';
import TopNav from '@/components/TopNav';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import MessageBubble from '@/components/MessageBubble';
import ChatInput from '@/components/ChatInput';
import { chats, messagesByChat } from '@/data/mockData';
export default function Home() {
    const [activeTab, setActiveTab] = useState('chat');
    const [activeChatId, setActiveChatId] = useState('1');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [messages, setMessages] = useState(messagesByChat);
    const messagesEndRef = useRef(null);
    const activeChat = chats.find((c) => c.id === activeChatId);
    const currentMessages = messages[activeChatId] || [];
    const isChatTab = activeTab === 'chat';
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages]);
    const handleSend = (text) => {
        const newMessage = {
            id: `m${Date.now()}`,
            sender: 'user',
            message: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), newMessage],
        }));
    };
    return (<div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <TopNav activeTab={activeTab} onTabChange={setActiveTab} onMenuToggle={() => setSidebarOpen(true)}/>

      <div className="flex flex-1 overflow-hidden pt-[6.5rem] md:pt-16">
        {isChatTab ? (<>
            <Sidebar chats={chats} activeChatId={activeChatId} onSelectChat={setActiveChatId} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>

            <main className="flex-1 flex flex-col overflow-hidden min-w-0">
              <ChatHeader chat={activeChat}/>

              <div className="flex-1 overflow-y-auto py-4 space-y-1">
                {currentMessages.map((msg) => (<MessageBubble key={msg.id} message={msg}/>))}
                <div ref={messagesEndRef}/>
              </div>

              <ChatInput onSend={handleSend}/>
            </main>
          </>) : (<main className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white px-8 py-14 text-center shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                {activeTab}
              </p>
              <h1 className="mt-4 text-3xl font-semibold text-gray-900">
                We are currently working on bringing this feature to you soon.
              </h1>
              <p className="mt-3 text-sm text-gray-500">
                Switch to the Chat tab to continue your conversations.
              </p>
            </div>
          </main>)}
      </div>
    </div>);
}
