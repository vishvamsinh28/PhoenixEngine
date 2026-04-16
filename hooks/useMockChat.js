'use client';

import { useEffect, useRef, useState } from 'react';
import { chats as initialChats, messagesByChat, mockAssistantReplies } from '@/data/mockData';
import { STREAM_START_DELAY_MS, STREAM_STEP_MS, formatPreview } from '@/lib/chatUtils';

export function useMockChat() {
    const [activeChatId, setActiveChatId] = useState('1');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [chatList, setChatList] = useState(initialChats);
    const [messages, setMessages] = useState(messagesByChat);
    const [isStreaming, setIsStreaming] = useState(false);
    const streamStartTimeoutRef = useRef(null);
    const streamIntervalRef = useRef(null);

    const activeChat = chatList.find((chat) => chat.id === activeChatId) ?? chatList[0];
    const currentMessages = messages[activeChatId] || [];

    const clearStreamingTimers = () => {
        if (streamStartTimeoutRef.current) {
            clearTimeout(streamStartTimeoutRef.current);
            streamStartTimeoutRef.current = null;
        }
        if (streamIntervalRef.current) {
            clearInterval(streamIntervalRef.current);
            streamIntervalRef.current = null;
        }
        setIsStreaming(false);
    };

    const updateChatPreview = (chatId, preview) => {
        setChatList((prev) => prev.map((chat) => chat.id === chatId
            ? { ...chat, lastMessagePreview: formatPreview(preview) }
            : chat));
    };

    const sendMessage = (text) => {
        if (isStreaming)
            return;

        clearStreamingTimers();
        setIsStreaming(true);

        const chatId = activeChatId;
        const userMessageId = `m${Date.now()}`;
        const assistantMessageId = `${userMessageId}-assistant`;
        const randomReply = mockAssistantReplies[Math.floor(Math.random() * mockAssistantReplies.length)];
        const responseParts = randomReply.split(/(\s+)/);
        let streamIndex = 0;

        setMessages((prev) => ({
            ...prev,
            [chatId]: [
                ...(prev[chatId] || []),
                {
                    id: userMessageId,
                    sender: 'user',
                    message: text,
                },
                {
                    id: assistantMessageId,
                    sender: 'assistant',
                    message: '',
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
                        ? { ...message, message: partialMessage }
                        : message),
                }));
                updateChatPreview(chatId, partialMessage);

                if (streamIndex >= responseParts.length) {
                    clearStreamingTimers();
                }
            }, STREAM_STEP_MS);
        }, STREAM_START_DELAY_MS);
    };

    useEffect(() => () => {
        clearStreamingTimers();
    }, []);

    return {
        activeChat,
        activeChatId,
        chatList,
        currentMessages,
        isStreaming,
        sendMessage,
        setActiveChatId,
        setSidebarOpen,
        sidebarOpen,
    };
}
