'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import TopNav from '@/components/TopNav';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import MessageBubble from '@/components/MessageBubble';
import ChatInput from '@/components/ChatInput';
import AuthPanel from '@/components/AuthPanel';
import ConversationTools from '@/components/ConversationTools';
import { usePhoenixChat } from '@/hooks/usePhoenixChat';

function PhoenixWorkspace({ user, onLogout }) {
    const {
        activeProject,
        activeProjectId,
        clearConversation,
        currentMessages,
        error,
        isLoading,
        isStreaming,
        projectList,
        searchQuery,
        sendMessage,
        setSearchQuery,
        setActiveProjectId,
        setSidebarOpen,
        sidebarOpen,
        visibleMessages,
    } = usePhoenixChat();
    const messagesEndRef = useRef(null);
    const toggleSidebar = useCallback(() => setSidebarOpen((previous) => !previous), [setSidebarOpen]);
    const closeSidebar = useCallback(() => setSidebarOpen(false), [setSidebarOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages]);

    return (<div className="flex h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_84%_10%,rgba(108,173,255,0.16),transparent_32%),linear-gradient(130deg,#fcfbff_0%,#f5f6ff_45%,#ecf7ff_100%)]">
      <TopNav user={user} onMenuToggle={toggleSidebar} onLogout={onLogout}/>
      <div className="flex flex-1 gap-4 overflow-hidden px-0 pb-0 pt-[4.75rem] md:px-4 md:pb-4 md:pt-[5.5rem]">
        <Sidebar projects={projectList} activeProjectId={activeProjectId} onSelectProject={setActiveProjectId} isOpen={sidebarOpen} onClose={closeSidebar}/>
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden md:rounded-[28px] md:border md:border-white/90 md:bg-white/65 md:shadow-[0_20px_60px_rgba(37,56,102,0.08)]">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white/55 backdrop-blur-xl md:rounded-[28px]">
            <ChatHeader project={activeProject}/>
            <ConversationTools
              project={activeProject}
              messages={currentMessages}
              query={searchQuery}
              onQueryChange={setSearchQuery}
              onClear={clearConversation}
              disabled={isStreaming || isLoading}
            />
            <div className="no-scrollbar flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(255,255,255,0.26),rgba(245,248,255,0.64))] px-4 py-5 md:px-7 md:py-7">
              {isLoading && <p className="py-10 text-center text-sm text-[#7785a2]">Loading saved conversation...</p>}
              {!isLoading && currentMessages.length === 0 && (<div className="mx-auto mt-16 max-w-lg text-center">
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#192845]">Start a {activeProject.name.toLowerCase()} analysis</h2>
                  <p className="mt-3 text-sm leading-7 text-[#71809c]">Describe geometry, materials, operating conditions, and the output you need. Your questions and generated answers will be stored in this account.</p>
                </div>)}
              {!isLoading && currentMessages.length > 0 && visibleMessages.length === 0 && <p className="py-10 text-center text-sm text-[#7785a2]">No messages match your search.</p>}
              {visibleMessages.map((message) => (<MessageBubble key={message.id} message={message}/>))}
              <div ref={messagesEndRef}/>
            </div>
            {error && <p className="mx-4 mb-3 rounded-xl border border-[#ffd5dc] bg-[#fff2f4] px-4 py-3 text-sm text-[#bd4b5f] md:mx-6">{error}</p>}
            <ChatInput onSend={sendMessage} disabled={isStreaming || isLoading} projectName={activeProject?.name}/>
          </div>
        </main>
      </div>
    </div>);
}

export default function Home() {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        fetch('/api/auth/session')
            .then((response) => response.json())
            .then((payload) => setUser(payload.user || null))
            .catch(() => setUser(null));
    }, []);

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
    };

    if (user === undefined) {
        return <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(130deg,#fcfbff,#eef7ff)] text-sm text-[#71809c]">Loading Phoenix Engine...</div>;
    }

    if (!user) {
        return <AuthPanel onAuthenticated={setUser}/>;
    }

    return <PhoenixWorkspace user={user} onLogout={logout}/>;
}
