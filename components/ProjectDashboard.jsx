'use client';

import { ArrowRight, BarChart3, CheckCircle2, Clock3, FolderKanban, MessageSquareText, ShieldCheck, Sparkles, Target } from 'lucide-react';

export default function ProjectDashboard({ projects, activeProjectId, onSelectProject, onOpenProject }) {
  const totalMessages = projects.reduce((sum, project) => sum + (project.messageCount || 0), 0);
  const activeProjects = projects.filter((project) => project.messageCount > 0).length;
  const activeProject = projects.find((project) => project.id === activeProjectId) || projects[0];
  const mostActiveProject = [...projects].sort((first, second) => (second.messageCount || 0) - (first.messageCount || 0))[0];
  const untouchedProjects = projects.filter((project) => !project.messageCount);

  const health = activeProject?.messageCount
    ? 'Conversation history available'
    : 'Ready for first screening run';

  return (
    <section className="mb-6 rounded-[22px] border border-[#273c58]/80 bg-[#121e31]/82 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.14)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#789ee8]">Project dashboard</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#eaf0fa]">Engineering command center</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#98a9c1]">
            Track active domains, recent conversations, deterministic screening status, and the next analysis area from one place.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#2b405d] bg-[#172438]/82 px-3 py-2 text-xs text-[#9fb0ca]">
          <ShieldCheck className="h-4 w-4 text-[#6de1b0]" />
          {health}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-[#263a55] bg-[#0f1a2a]/72 p-4">
          <FolderKanban className="h-5 w-5 text-[#65c6ff]" />
          <p className="mt-3 text-2xl font-semibold text-[#f1f6fd]">{projects.length}</p>
          <p className="mt-1 text-xs text-[#8da0bb]">analysis domains</p>
        </div>
        <div className="rounded-xl border border-[#263a55] bg-[#0f1a2a]/72 p-4">
          <MessageSquareText className="h-5 w-5 text-[#a78bfa]" />
          <p className="mt-3 text-2xl font-semibold text-[#f1f6fd]">{totalMessages}</p>
          <p className="mt-1 text-xs text-[#8da0bb]">saved messages</p>
        </div>
        <div className="rounded-xl border border-[#263a55] bg-[#0f1a2a]/72 p-4">
          <CheckCircle2 className="h-5 w-5 text-[#6de1b0]" />
          <p className="mt-3 text-2xl font-semibold text-[#f1f6fd]">{activeProjects}</p>
          <p className="mt-1 text-xs text-[#8da0bb]">domains in use</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-[#263a55] bg-[#0f1a2a]/72 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">
            <Target className="h-4 w-4" />
            Recommended next action
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[#edf3fb]">
            {activeProject?.messageCount ? `Continue ${activeProject.name}` : `Start ${activeProject?.name || 'a domain'} screening`}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#96a8c2]">
            {activeProject?.messageCount
              ? activeProject.lastMessagePreview
              : 'Open a workbench, run the deterministic model, then use chat to interpret the result and plan validation.'}
          </p>
          <button
            type="button"
            onClick={() => {
              if (activeProject)
                onSelectProject(activeProject.id);
              onOpenProject?.();
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[linear-gradient(135deg,#3f6df2,#55aef9)] px-4 py-2 text-sm font-medium text-white shadow-[0_9px_20px_rgba(63,109,242,0.22)]"
          >
            Open workbench
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-xl border border-[#263a55] bg-[#0f1a2a]/72 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#789ee8]">
            <Sparkles className="h-4 w-4" />
            Workspace signals
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#91a3bd]">Most active domain</span>
              <span className="font-semibold text-[#edf3fb]">{mostActiveProject?.messageCount ? mostActiveProject.name : 'None yet'}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#91a3bd]">Untouched domains</span>
              <span className="font-semibold text-[#edf3fb]">{untouchedProjects.length}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#91a3bd]">Current focus</span>
              <span className="font-semibold text-[#edf3fb]">{activeProject?.discipline || 'Select a project'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-4">
        {projects.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => {
              onSelectProject(project.id);
              onOpenProject?.();
            }}
            className={`rounded-xl border p-4 text-left transition ${project.id === activeProjectId ? 'border-[#5d8ff1] bg-[#1c3150]' : 'border-[#263a55] bg-[#0f1a2a]/72 hover:border-[#3e5f89] hover:bg-[#142238]'}`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[#edf3fb]">{project.name}</span>
              <BarChart3 className="h-4 w-4" style={{ color: project.color }} />
            </div>
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#91a3bd]">{project.lastMessagePreview}</p>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[#7488a6]">
              <Clock3 className="h-3.5 w-3.5" />
              {project.messageCount || 0} messages
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
