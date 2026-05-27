'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import TopNav from '@/components/TopNav';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import MessageBubble from '@/components/MessageBubble';
import ChatInput from '@/components/ChatInput';
import AuthPanel from '@/components/AuthPanel';
import LandingPage from '@/components/LandingPage';
import ConversationTools from '@/components/ConversationTools';
import ProjectDashboard from '@/components/ProjectDashboard';
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
    const [activeView, setActiveView] = useState('dashboard');
    const messagesTopRef = useRef(null);
    const messagesEndRef = useRef(null);
    const messagesScrollRef = useRef(null);
    const toggleSidebar = useCallback(() => setSidebarOpen((previous) => !previous), [setSidebarOpen]);
    const closeSidebar = useCallback(() => setSidebarOpen(false), [setSidebarOpen]);
    const openWorkbenchProject = useCallback((projectId) => {
        setActiveProjectId(projectId);
        setActiveView('workbench');
        closeSidebar();
    }, [closeSidebar, setActiveProjectId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages]);

    const scrollChatToTop = useCallback(() => {
        messagesScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const scrollChatToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (<div className="flex h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_84%_10%,rgba(43,96,179,0.22),transparent_34%),linear-gradient(130deg,#0b1421_0%,#111a2b_45%,#0b2230_100%)]">
      <TopNav
        activeView={activeView}
        canShowMenu={activeView === 'workbench'}
        user={user}
        onMenuToggle={toggleSidebar}
        onLogout={onLogout}
        onViewChange={setActiveView}
      />
      <div className="flex flex-1 gap-4 overflow-hidden px-0 pb-0 pt-[4.75rem] md:px-4 md:pb-4 md:pt-[5.5rem]">
        {activeView === 'workbench' && <Sidebar projects={projectList} activeProjectId={activeProjectId} onSelectProject={openWorkbenchProject} isOpen={sidebarOpen} onClose={closeSidebar}/>}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden md:rounded-[28px] md:bg-[#141f32]/72 md:shadow-[0_24px_64px_rgba(1,5,13,0.34)]">
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#121c2e]/54 backdrop-blur-xl md:rounded-[28px]">
            {activeView === 'dashboard' && (
              <div className="no-scrollbar flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(16,27,44,0.16),rgba(11,21,35,0.34))] px-4 py-5 md:px-7 md:py-7">
                <ProjectDashboard
                  projects={projectList}
                  activeProjectId={activeProjectId}
                  onSelectProject={setActiveProjectId}
                  onOpenProject={() => setActiveView('workbench')}
                />
              </div>
            )}
            {activeView === 'workbench' && (<>
              <ChatHeader project={activeProject}/>
              <ConversationTools
                project={activeProject}
                messages={currentMessages}
                query={searchQuery}
                onQueryChange={setSearchQuery}
                onClear={clearConversation}
                disabled={isStreaming || isLoading}
              />
              <div ref={messagesScrollRef} className="no-scrollbar flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(16,27,44,0.16),rgba(11,21,35,0.34))] px-4 py-5 md:px-7 md:py-7">
                <div ref={messagesTopRef}/>
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
              <div className="pointer-events-none absolute bottom-24 right-4 z-20 flex flex-col gap-2 md:right-6">
                <button
                  type="button"
                  onClick={scrollChatToTop}
                  title="Go to top"
                  className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-xl border border-[#2f4563] bg-[#142238]/92 text-[#c7d5e8] shadow-[0_10px_24px_rgba(0,0,0,0.22)] backdrop-blur transition hover:bg-[#1d3048]"
                >
                  <ArrowUp className="h-4 w-4"/>
                </button>
                <button
                  type="button"
                  onClick={scrollChatToBottom}
                  title="Go to bottom"
                  className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-xl border border-[#2f4563] bg-[#142238]/92 text-[#c7d5e8] shadow-[0_10px_24px_rgba(0,0,0,0.22)] backdrop-blur transition hover:bg-[#1d3048]"
                >
                  <ArrowDown className="h-4 w-4"/>
                </button>
              </div>
              {error && <p className="mx-4 mb-3 rounded-xl bg-[#38202d]/90 px-4 py-3 text-sm text-[#f3a8ba] shadow-sm md:mx-6">{error}</p>}
              <ChatInput onSend={sendMessage} onStop={stopGeneration} isGenerating={isStreaming} isLoading={isLoading} projectName={activeProject?.name}/>
            </>)}
          </div>
        </main>
      </div>
    </div>);
}

export default function Home() {
    const [user, setUser] = useState(undefined);
    const [showAuth, setShowAuth] = useState(false);

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
        if (showAuth) {
            return <AuthPanel onAuthenticated={setUser} onBack={() => setShowAuth(false)}/>;
        }

        return <LandingPage onGetStarted={() => setShowAuth(true)}/>;
    }

    return <PhoenixWorkspace user={user} onLogout={logout}/>;
}
