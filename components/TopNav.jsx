'use client';
import { BarChart3, BookOpen, Box, Cpu, Hexagon, LayoutDashboard, Menu, MessageSquareText } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'workbench', label: 'Workbench', Icon: BarChart3 },
  { id: 'simulations', label: 'Simulations', Icon: Box },
  { id: 'chat', label: 'Chat', Icon: MessageSquareText },
  { id: 'tutorial', label: 'Tutorial', Icon: BookOpen },
];

export default function TopNav({ activeView, canShowMenu, user, onMenuToggle, onLogout, onViewChange }) {
  return (<header className="fixed left-0 right-0 top-0 z-50 bg-[#0c1625]/66 shadow-[0_5px_20px_rgba(1,5,14,0.15)] backdrop-blur-2xl">
    <div className="px-3 py-3 md:px-6 md:py-0">
      <div className="relative flex flex-wrap items-center justify-between gap-3 md:h-[76px] md:flex-nowrap">
        <div className="flex min-w-0 items-center gap-3">
          {canShowMenu && (
            <button onClick={onMenuToggle} className="shrink-0 rounded-xl p-2 transition-colors hover:bg-[#1a2639] md:hidden">
              <Menu className="h-5 w-5 text-[#a5b3ca]" />
            </button>
          )}
          <div className="relative flex h-10 w-10 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#346cf3,#63c5ff)] text-white shadow-[0_10px_24px_rgba(50,105,242,0.25)]">
            <Hexagon className="h-7 w-7" />
            <Cpu className="absolute h-3.5 w-3.5" />
          </div>
          <div>
            <p className="text-base font-semibold tracking-[-0.03em] text-[#e8eff8]">Phoenix Engine</p>
            <a
              href="https://www.linkedin.com/in/vishvamsinh-vaghela-591695217/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-[#798ba8] transition hover:text-[#9dc5ff] sm:block"
            >
              Created by Vishvamsinh Vaghela
            </a>
          </div>
        </div>

        <nav className="order-3 flex w-full gap-1 overflow-x-auto rounded-2xl border border-[#263a55] bg-[#111d2e]/78 p-1 md:order-none md:w-auto md:overflow-visible">
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onViewChange(id)}
              className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition md:flex-none md:px-3.5 md:text-sm ${activeView === id ? 'bg-[#244064] text-[#edf3fb] shadow-[0_8px_18px_rgba(0,0,0,0.16)]' : 'text-[#91a3bd] hover:bg-[#1a2a40] hover:text-[#dce7f5]'}`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden min-[430px]:inline md:inline">{label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <p className="hidden text-sm font-medium text-[#a4b2ca] sm:block">{user.name}</p>
          <button onClick={onLogout} className="rounded-xl bg-[#172437]/78 px-3 py-2 text-xs font-medium text-[#cad5e7] shadow-[0_5px_14px_rgba(0,0,0,0.14)] transition hover:bg-[#1d2c42] sm:text-sm md:px-3.5">
            Sign out
          </button>
        </div>
      </div>
    </div>
  </header>);
}
