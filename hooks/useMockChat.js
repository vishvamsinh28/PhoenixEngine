'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { chats as initialChats, messagesByChat, mockAssistantReplies } from '@/data/mockData';
import { STREAM_START_DELAY_MS, STREAM_STEP_MS, formatPreview } from '@/lib/chatUtils';

const getRandomReply = () => mockAssistantReplies[Math.floor(Math.random() * mockAssistantReplies.length)];

const buildStreamingMessages = (existingMessages, userMessageId, assistantMessageId, text) => [
    ...existingMessages,
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
];

const updateStreamingMessage = (messages, assistantMessageId, partialMessage) => messages.map((message) => message.id === assistantMessageId
    ? { ...message, message: partialMessage }
    : message);

export function useMockChat() {
    const [activeChatId, setActiveChatId] = useState(initialChats[0]?.id ?? '');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [messages, setMessages] = useState(messagesByChat);
    const [isStreaming, setIsStreaming] = useState(false);
    const streamStartTimeoutRef = useRef(null);
    const streamIntervalRef = useRef(null);

    const chatList = useMemo(() => initialChats.map((chat) => {
        const chatMessages = messages[chat.id] || [];
        const lastMessage = chatMessages[chatMessages.length - 1];
        return {
            ...chat,
            lastMessagePreview: lastMessage ? formatPreview(lastMessage.message) : chat.lastMessagePreview,
        };
    }), [messages]);

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

    const sendMessage = (text) => {
        if (isStreaming)
            return;

        clearStreamingTimers();
        setIsStreaming(true);

        const chatId = activeChatId;
        const userMessageId = `m${Date.now()}`;
        const assistantMessageId = `${userMessageId}-assistant`;
        const randomReply = getRandomReply();
        const responseParts = randomReply.split(/(\s+)/);
        let streamIndex = 0;

        setMessages((prev) => ({
            ...prev,
            [chatId]: buildStreamingMessages(prev[chatId] || [], userMessageId, assistantMessageId, text),
        }));

        streamStartTimeoutRef.current = setTimeout(() => {
            streamIntervalRef.current = setInterval(() => {
                const nextChunkSize = Math.min(responseParts.length - streamIndex, Math.floor(Math.random() * 3) + 1);
                streamIndex += nextChunkSize;
                const partialMessage = responseParts.slice(0, streamIndex).join('');

                setMessages((prev) => ({
                    ...prev,
                    [chatId]: updateStreamingMessage(prev[chatId] || [], assistantMessageId, partialMessage),
                }));

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
