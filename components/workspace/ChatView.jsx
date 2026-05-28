'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import ChatHeader from '@/components/ChatHeader';
import ChatInput from '@/components/ChatInput';
import ConversationTools from '@/components/ConversationTools';
import MessageBubble from '@/components/MessageBubble';

export default function ChatView({
    activeProject,
    clearConversation,
    currentMessages,
    error,
    isLoading,
    isStreaming,
    searchQuery,
    sendMessage,
    setSearchQuery,
    stopGeneration,
    visibleMessages,
}) {
    const [showScrollControls, setShowScrollControls] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesScrollRef = useRef(null);
    const scrollControlsTimerRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages]);

    useEffect(() => () => {
        if (scrollControlsTimerRef.current) {
            clearTimeout(scrollControlsTimerRef.current);
        }
    }, []);

    const revealScrollControls = useCallback(() => {
        const scrollContainer = messagesScrollRef.current;

        if (!scrollContainer || scrollContainer.scrollHeight <= scrollContainer.clientHeight) {
            setShowScrollControls(false);
            return;
        }

        setShowScrollControls(true);

        if (scrollControlsTimerRef.current) {
            clearTimeout(scrollControlsTimerRef.current);
        }

        scrollControlsTimerRef.current = setTimeout(() => {
            setShowScrollControls(false);
        }, 900);
    }, []);

    const scrollChatToTop = useCallback(() => {
        messagesScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const scrollChatToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (
        <>
            <ChatHeader project={activeProject}/>
            <ConversationTools
                project={activeProject}
                messages={currentMessages}
                query={searchQuery}
                onQueryChange={setSearchQuery}
                onClear={clearConversation}
                disabled={isStreaming || isLoading}
            />
            <div ref={messagesScrollRef} onScroll={revealScrollControls} className="no-scrollbar flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(16,27,44,0.16),rgba(11,21,35,0.34))] px-4 py-4 pb-6 md:px-7 md:py-7">
                {isLoading && <p className="py-10 text-center text-sm text-[#91a1bd]">Loading saved conversation...</p>}
                {!isLoading && currentMessages.length === 0 && (
                    <div className="mx-auto mt-16 max-w-lg text-center">
                        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#e4ebf6]">Start a {activeProject.name.toLowerCase()} analysis</h2>
                        <p className="mt-3 text-sm leading-7 text-[#95a4bf]">Describe geometry, materials, operating conditions, and the output you need.</p>
                    </div>
                )}
                {!isLoading && currentMessages.length > 0 && visibleMessages.length === 0 && <p className="py-10 text-center text-sm text-[#91a1bd]">No messages match your search.</p>}
                {visibleMessages.map((message) => <MessageBubble key={message.id} message={message}/>)}
                <div ref={messagesEndRef}/>
            </div>
            <div className={`pointer-events-none absolute bottom-24 right-4 z-20 flex flex-col gap-2 transition duration-200 md:right-6 ${showScrollControls ? 'opacity-100' : 'opacity-0'}`}>
                <ScrollButton direction="top" visible={showScrollControls} onClick={scrollChatToTop}/>
                <ScrollButton direction="bottom" visible={showScrollControls} onClick={scrollChatToBottom}/>
            </div>
            {error && <p className="mx-4 mb-3 rounded-xl bg-[#38202d]/90 px-4 py-3 text-sm text-[#f3a8ba] shadow-sm md:mx-6">{error}</p>}
            <ChatInput onSend={sendMessage} onStop={stopGeneration} isGenerating={isStreaming} isLoading={isLoading} projectName={activeProject?.name}/>
        </>
    );
}

function ScrollButton({ direction, visible, onClick }) {
    const Icon = direction === 'top' ? ArrowUp : ArrowDown;
    return (
        <button
            type="button"
            onClick={onClick}
            title={direction === 'top' ? 'Go to top' : 'Go to bottom'}
            tabIndex={visible ? 0 : -1}
            className={`${visible ? 'pointer-events-auto' : 'pointer-events-none'} flex h-10 w-10 items-center justify-center rounded-xl border border-[#2f4563] bg-[#142238]/92 text-[#c7d5e8] shadow-[0_10px_24px_rgba(0,0,0,0.22)] backdrop-blur transition hover:bg-[#1d3048]`}
        >
            <Icon className="h-4 w-4"/>
        </button>
    );
}
