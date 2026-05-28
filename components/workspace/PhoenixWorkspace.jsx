'use client';

import { useCallback, useState } from 'react';
import ProjectDashboard from '@/components/ProjectDashboard';
import Sidebar from '@/components/Sidebar';
import SimulationStudio from '@/components/SimulationStudio';
import TopNav from '@/components/TopNav';
import TutorialPage from '@/components/TutorialPage';
import ChatView from '@/components/workspace/ChatView';
import WorkbenchView from '@/components/workspace/WorkbenchView';
import { usePhoenixChat } from '@/hooks/usePhoenixChat';

export default function PhoenixWorkspace({ user, onLogout }) {
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
    const disabled = isStreaming || isLoading;
    const canShowSidebar = activeView === 'workbench' || activeView === 'chat';
    const toggleSidebar = useCallback(() => setSidebarOpen((previous) => !previous), [setSidebarOpen]);
    const closeSidebar = useCallback(() => setSidebarOpen(false), [setSidebarOpen]);
    const selectProject = useCallback((projectId) => {
        setActiveProjectId(projectId);
        closeSidebar();
    }, [closeSidebar, setActiveProjectId]);
    const discussRunInChat = useCallback((prompt) => {
        setActiveView('chat');
        sendMessage(prompt);
    }, [sendMessage]);

    return (
        <div className="flex h-[100dvh] flex-col overflow-hidden bg-[radial-gradient(circle_at_84%_10%,rgba(43,96,179,0.22),transparent_34%),linear-gradient(130deg,#0b1421_0%,#111a2b_45%,#0b2230_100%)]">
            <TopNav
                activeView={activeView}
                canShowMenu={canShowSidebar}
                user={user}
                onMenuToggle={toggleSidebar}
                onLogout={onLogout}
                onViewChange={setActiveView}
            />
            <div className="flex flex-1 gap-4 overflow-hidden px-0 pb-0 pt-[7.75rem] md:px-4 md:pb-4 md:pt-[5.5rem]">
                {canShowSidebar && <Sidebar projects={projectList} activeProjectId={activeProjectId} onSelectProject={selectProject} isOpen={sidebarOpen} onClose={closeSidebar}/>}
                <main className="flex min-w-0 flex-1 flex-col overflow-hidden md:rounded-[28px] md:bg-[#141f32]/72 md:shadow-[0_24px_64px_rgba(1,5,13,0.34)]">
                    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#121c2e]/54 backdrop-blur-xl md:rounded-[28px]">
                        {activeView === 'dashboard' && (
                            <DashboardView
                                projects={projectList}
                                activeProjectId={activeProjectId}
                                onSelectProject={setActiveProjectId}
                                onOpenProject={() => setActiveView('workbench')}
                            />
                        )}
                        {activeView === 'tutorial' && (
                            <TutorialView
                                onOpenWorkbench={() => setActiveView('workbench')}
                                onOpenSimulations={() => setActiveView('simulations')}
                            />
                        )}
                        {activeView === 'simulations' && <SimulationStudio disabled={disabled} onDiscuss={discussRunInChat}/>}
                        {activeView === 'workbench' && (
                            <WorkbenchView
                                activeProject={activeProject}
                                disabled={disabled}
                                onDiscuss={discussRunInChat}
                                onOpenChat={() => setActiveView('chat')}
                            />
                        )}
                        {activeView === 'chat' && (
                            <ChatView
                                activeProject={activeProject}
                                clearConversation={clearConversation}
                                currentMessages={currentMessages}
                                error={error}
                                isLoading={isLoading}
                                isStreaming={isStreaming}
                                searchQuery={searchQuery}
                                sendMessage={sendMessage}
                                setSearchQuery={setSearchQuery}
                                stopGeneration={stopGeneration}
                                visibleMessages={visibleMessages}
                            />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

function DashboardView({ projects, activeProjectId, onSelectProject, onOpenProject }) {
    return (
        <div className="no-scrollbar flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(16,27,44,0.16),rgba(11,21,35,0.34))] px-4 py-5 md:px-7 md:py-7">
            <ProjectDashboard
                projects={projects}
                activeProjectId={activeProjectId}
                onSelectProject={onSelectProject}
                onOpenProject={onOpenProject}
            />
        </div>
    );
}

function TutorialView({ onOpenWorkbench, onOpenSimulations }) {
    return (
        <div className="no-scrollbar flex-1 overflow-y-auto bg-[#111b2c]">
            <TutorialPage onOpenWorkbench={onOpenWorkbench} onOpenSimulations={onOpenSimulations} />
        </div>
    );
}
