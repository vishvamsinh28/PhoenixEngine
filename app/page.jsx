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
        <Sidebar chats={chats} activeChatId={activeChatId} onSelectChat={setActiveChatId} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>

        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          <ChatHeader chat={activeChat}/>

          <div className="flex-1 overflow-y-auto py-4 space-y-1">
            {currentMessages.map((msg) => (<MessageBubble key={msg.id} message={msg}/>))}
            <div ref={messagesEndRef}/>
          </div>

          <ChatInput onSend={handleSend}/>
        </main>
      </div>
    </div>);
}
