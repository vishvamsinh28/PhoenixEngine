'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import TopNav from '@/components/TopNav';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import MessageBubble from '@/components/MessageBubble';
import ChatInput from '@/components/ChatInput';
import AuthPanel from '@/components/AuthPanel';
import { usePhoenixChat } from '@/hooks/usePhoenixChat';

function PhoenixWorkspace({ user, onLogout }) {
    const {
        activeProject,
        activeProjectId,
        currentMessages,
        error,
        isLoading,
        isStreaming,
        projectList,
        sendMessage,
        setActiveProjectId,
        setSidebarOpen,
        sidebarOpen,
    } = usePhoenixChat();
    const messagesEndRef = useRef(null);
    const toggleSidebar = useCallback(() => setSidebarOpen((previous) => !previous), [setSidebarOpen]);
    const closeSidebar = useCallback(() => setSidebarOpen(false), [setSidebarOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages]);

    return (<div className="flex h-screen flex-col overflow-hidden bg-[#061117]">
      <TopNav user={user} onMenuToggle={toggleSidebar} onLogout={onLogout}/>
      <div className="flex flex-1 overflow-hidden pt-[4.55rem]">
        <Sidebar projects={projectList} activeProjectId={activeProjectId} onSelectProject={setActiveProjectId} isOpen={sidebarOpen} onClose={closeSidebar}/>
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#07131a]">
            <ChatHeader project={activeProject}/>
            <div className="no-scrollbar flex-1 overflow-y-auto bg-[radial-gradient(circle_at_80%_0%,rgba(25,181,232,0.06),transparent_36%),#07131a] px-4 py-5 md:px-7 md:py-7">
              {isLoading && <p className="py-10 text-center text-sm text-[#78929e]">Loading saved conversation...</p>}
              {!isLoading && currentMessages.length === 0 && (<div className="mx-auto mt-16 max-w-lg text-center">
                  <h2 className="text-2xl font-semibold text-white">Start a {activeProject.name.toLowerCase()} analysis</h2>
                  <p className="mt-3 text-sm leading-7 text-[#839ba7]">Describe geometry, materials, operating conditions, and the output you need. Your questions and generated answers will be stored in this account.</p>
                </div>)}
              {currentMessages.map((message) => (<MessageBubble key={message.id} message={message}/>))}
              <div ref={messagesEndRef}/>
            </div>
            {error && <p className="mx-4 mb-3 rounded-xl border border-[#63343a] bg-[#27171b] px-4 py-3 text-sm text-[#f1a4a8] md:mx-6">{error}</p>}
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
        return <div className="flex min-h-screen items-center justify-center bg-[#061117] text-sm text-[#8199a5]">Loading Phoenix Engine...</div>;
    }

    if (!user) {
        return <AuthPanel onAuthenticated={setUser}/>;
    }

    return <PhoenixWorkspace user={user} onLogout={logout}/>;
}
