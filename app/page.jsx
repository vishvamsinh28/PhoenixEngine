'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import TopNav from '@/components/TopNav';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import MessageBubble from '@/components/MessageBubble';
import ChatInput from '@/components/ChatInput';
import AuthPanel from '@/components/AuthPanel';
import ConversationTools from '@/components/ConversationTools';
import ThermalWorkbench from '@/components/ThermalWorkbench';
import DomainWorkbench from '@/components/DomainWorkbench';
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
        stopGeneration,
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

    return (<div className="flex h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_84%_10%,rgba(43,96,179,0.22),transparent_34%),linear-gradient(130deg,#0b1421_0%,#111a2b_45%,#0b2230_100%)]">
      <TopNav user={user} onMenuToggle={toggleSidebar} onLogout={onLogout}/>
      <div className="flex flex-1 gap-4 overflow-hidden px-0 pb-0 pt-[4.75rem] md:px-4 md:pb-4 md:pt-[5.5rem]">
        <Sidebar projects={projectList} activeProjectId={activeProjectId} onSelectProject={setActiveProjectId} isOpen={sidebarOpen} onClose={closeSidebar}/>
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden md:rounded-[28px] md:bg-[#141f32]/72 md:shadow-[0_24px_64px_rgba(1,5,13,0.34)]">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#121c2e]/54 backdrop-blur-xl md:rounded-[28px]">
            <ChatHeader project={activeProject}/>
            <ConversationTools
              project={activeProject}
              messages={currentMessages}
              query={searchQuery}
              onQueryChange={setSearchQuery}
              onClear={clearConversation}
              disabled={isStreaming || isLoading}
            />
            <div className="no-scrollbar flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(16,27,44,0.16),rgba(11,21,35,0.34))] px-4 py-5 md:px-7 md:py-7">
              {activeProject.id === 'thermal-inverter' && <ThermalWorkbench disabled={isStreaming || isLoading} onDiscuss={sendMessage}/>}
              {activeProject.id !== 'thermal-inverter' && <DomainWorkbench key={activeProject.id} projectId={activeProject.id} disabled={isStreaming || isLoading} onDiscuss={sendMessage}/>}
              {isLoading && <p className="py-10 text-center text-sm text-[#91a1bd]">Loading saved conversation...</p>}
              {!isLoading && currentMessages.length === 0 && (<div className="mx-auto mt-16 max-w-lg text-center">
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#e4ebf6]">Start a {activeProject.name.toLowerCase()} analysis</h2>
                  <p className="mt-3 text-sm leading-7 text-[#95a4bf]">Describe geometry, materials, operating conditions, and the output you need.</p>
                </div>)}
              {!isLoading && currentMessages.length > 0 && visibleMessages.length === 0 && <p className="py-10 text-center text-sm text-[#91a1bd]">No messages match your search.</p>}
              {visibleMessages.map((message) => (<MessageBubble key={message.id} message={message}/>))}
              <div ref={messagesEndRef}/>
            </div>
            {error && <p className="mx-4 mb-3 rounded-xl bg-[#38202d]/90 px-4 py-3 text-sm text-[#f3a8ba] shadow-sm md:mx-6">{error}</p>}
            <ChatInput onSend={sendMessage} onStop={stopGeneration} isGenerating={isStreaming} isLoading={isLoading} projectName={activeProject?.name}/>
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
        return <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(130deg,#0b1421,#0c2230)] text-sm text-[#95a4bf]">Loading Phoenix Engine...</div>;
    }

    if (!user) {
        return <AuthPanel onAuthenticated={setUser}/>;
    }

    return <PhoenixWorkspace user={user} onLogout={logout}/>;
}
