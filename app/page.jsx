'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import TopNav from '@/components/TopNav';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import MessageBubble from '@/components/MessageBubble';
import ChatInput from '@/components/ChatInput';
import { usePhoenixChat } from '@/hooks/usePhoenixChat';

const tabContent = {
    overview: {
        title: 'Simulation intelligence at a glance',
        description: 'Track rapid engineering studies across thermal, fluid, material and process domains.',
        metrics: [['Active studies', '04'], ['Model coverage', '12 domains'], ['Median screening run', '< 30 sec']],
    },
    models: {
        title: 'Physics-informed model library',
        description: 'Configure surrogate models and validation gates before committing to expensive solver runs.',
        metrics: [['Thermal networks', 'Ready'], ['Aerodynamic surrogate', 'Calibrating'], ['FEA structural', 'Queued']],
    },
    datasets: {
        title: 'Experimental and geometry inputs',
        description: 'Bring CAD, test telemetry, and solver exports together for model calibration.',
        metrics: [['CAD assemblies', '18'], ['Telemetry sets', '43'], ['Validated runs', '09']],
    },
};

function WorkspacePanel({ tab }) {
    const content = tabContent[tab];
    return (<main className="flex flex-1 items-center justify-center p-5 md:p-8">
      <section className="w-full max-w-5xl rounded-[24px] border border-[#172e39] bg-[#091820] p-7 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#24b8ea]">{tab}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">{content.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#8aa2ae]">{content.description}</p>
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {content.metrics.map(([label, value]) => (<div key={label} className="rounded-2xl border border-[#172f3c] bg-[#0c1d26] p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-[#587583]">{label}</p>
              <p className="mt-3 text-2xl font-medium text-[#e4f1f5]">{value}</p>
            </div>))}
        </div>
      </section>
    </main>);
}

export default function Home() {
    const [activeTab, setActiveTab] = useState('copilot');
    const { activeProject, activeProjectId, currentMessages, isStreaming, projectList, runtime, sendMessage, setActiveProjectId, setSidebarOpen, sidebarOpen } = usePhoenixChat();
    const messagesEndRef = useRef(null);
    const isChatTab = activeTab === 'copilot';
    const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), [setSidebarOpen]);
    const closeSidebar = useCallback(() => setSidebarOpen(false), [setSidebarOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages]);

    return (<div className="flex h-screen flex-col overflow-hidden bg-[#061117]">
      <TopNav activeTab={activeTab} onTabChange={setActiveTab} onMenuToggle={toggleSidebar}/>

      <div className="flex flex-1 overflow-hidden pt-[7.25rem] md:pt-[4.55rem]">
        {isChatTab ? (<>
            <Sidebar projects={projectList} activeProjectId={activeProjectId} onSelectProject={setActiveProjectId} isOpen={sidebarOpen} onClose={closeSidebar}/>

            <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#07131a]">
              <ChatHeader project={activeProject} runtime={runtime}/>

              <div className="no-scrollbar flex-1 overflow-y-auto bg-[radial-gradient(circle_at_80%_0%,rgba(25,181,232,0.06),transparent_36%),#07131a] px-4 py-5 md:px-7 md:py-7">
                {currentMessages.map((msg) => (<MessageBubble key={msg.id} message={msg}/>))}
                <div ref={messagesEndRef}/>
              </div>

              <ChatInput onSend={sendMessage} disabled={isStreaming} projectName={activeProject?.name}/>
              </div>
            </main>
          </>) : (<WorkspacePanel tab={activeTab}/>)}
      </div>
    </div>);
}
