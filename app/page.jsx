'use client';
import { useState, useRef, useEffect } from 'react';
import TopNav from '@/components/TopNav';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import MessageBubble from '@/components/MessageBubble';
import ChatInput from '@/components/ChatInput';
import { chats as initialChats, messagesByChat, mockAssistantReplies } from '@/data/mockData';

const STREAM_START_DELAY_MS = 350;
const STREAM_STEP_MS = 40;

const formatPreview = (text) => text.length > 42 ? `${text.slice(0, 39)}...` : text;

const formatTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function Home() {
    const [activeTab, setActiveTab] = useState('chat');
    const [activeChatId, setActiveChatId] = useState('1');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [chatList, setChatList] = useState(initialChats);
    const [messages, setMessages] = useState(messagesByChat);
    const messagesEndRef = useRef(null);
    const streamStartTimeoutRef = useRef(null);
    const streamIntervalRef = useRef(null);
    const activeChat = chatList.find((c) => c.id === activeChatId);
    const currentMessages = messages[activeChatId] || [];
    const isChatTab = activeTab === 'chat';

    const clearStreamingTimers = () => {
        if (streamStartTimeoutRef.current) {
            clearTimeout(streamStartTimeoutRef.current);
            streamStartTimeoutRef.current = null;
        }
        if (streamIntervalRef.current) {
            clearInterval(streamIntervalRef.current);
            streamIntervalRef.current = null;
        }
    };

    const updateChatPreview = (chatId, preview) => {
        setChatList((prev) => prev.map((chat) => chat.id === chatId
            ? { ...chat, lastMessagePreview: formatPreview(preview) }
            : chat));
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages]);

    useEffect(() => () => {
        clearStreamingTimers();
    }, []);

    const handleSend = (text) => {
        clearStreamingTimers();
        const timestamp = formatTimestamp();
        const userMessageId = `m${Date.now()}`;
        const assistantMessageId = `${userMessageId}-assistant`;
        const chatId = activeChatId;
        const randomReply = mockAssistantReplies[Math.floor(Math.random() * mockAssistantReplies.length)];
        const responseParts = randomReply.split(/(\s+)/);
        let streamIndex = 0;
        const newMessage = {
            id: userMessageId,
            sender: 'user',
            message: text,
            timestamp,
        };
        setMessages((prev) => ({
            ...prev,
            [chatId]: [
                ...(prev[chatId] || []),
                newMessage,
                {
                    id: assistantMessageId,
                    sender: 'assistant',
                    message: '',
                    timestamp,
                },
            ],
        }));
        updateChatPreview(chatId, text);

        streamStartTimeoutRef.current = setTimeout(() => {
            streamIntervalRef.current = setInterval(() => {
                const nextChunkSize = Math.min(responseParts.length - streamIndex, Math.floor(Math.random() * 3) + 1);
                streamIndex += nextChunkSize;
                const partialMessage = responseParts.slice(0, streamIndex).join('');

                setMessages((prev) => ({
                    ...prev,
                    [chatId]: (prev[chatId] || []).map((message) => message.id === assistantMessageId
                        ? { ...message, message: partialMessage, timestamp: formatTimestamp() }
                        : message),
                }));
                updateChatPreview(chatId, partialMessage);

                if (streamIndex >= responseParts.length) {
                    clearStreamingTimers();
                }
            }, STREAM_STEP_MS);
        }, STREAM_START_DELAY_MS);
    };
    return (<div className="flex h-screen flex-col overflow-hidden bg-transparent">
      <TopNav activeTab={activeTab} onTabChange={setActiveTab} onMenuToggle={() => setSidebarOpen(true)}/>

      <div className="flex flex-1 overflow-hidden pt-[7.25rem] md:px-0 md:pb-4 md:pt-[5.5rem]">
        {isChatTab ? (<>
            <Sidebar chats={chatList} activeChatId={activeChatId} onSelectChat={setActiveChatId} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>

            <main className="flex min-w-0 flex-1 flex-col overflow-hidden md:pr-4">
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(251,250,255,0.98)_38%,rgba(244,250,255,0.98)_100%)] md:rounded-t-[28px] md:shadow-[0_10px_30px_rgba(31,42,68,0.05)]">
              <ChatHeader chat={activeChat}/>

              <div className="no-scrollbar flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(255,255,255,0.28)_0%,rgba(251,252,255,0.72)_100%)] px-4 py-5 md:px-6 md:py-6">
                {currentMessages.map((msg) => (<MessageBubble key={msg.id} message={msg}/>))}
                <div ref={messagesEndRef}/>
              </div>

              <ChatInput onSend={handleSend}/>
              </div>
            </main>
          </>) : (<main className="flex flex-1 items-center justify-center p-6">
            <div className="w-full max-w-2xl rounded-[28px] border border-white/80 bg-white px-8 py-14 text-center shadow-[0_20px_60px_rgba(31,42,68,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3f6df2]">
                {activeTab}
              </p>
              <h1 className="mt-4 text-3xl font-semibold text-[#1f2a44]">
                We are currently working on bringing this feature to you soon.
              </h1>
              <p className="mt-3 text-sm text-[#8a94a8]">
                Switch to the Chat tab to continue your conversations.
              </p>
            </div>
          </main>)}
      </div>
    </div>);
}
