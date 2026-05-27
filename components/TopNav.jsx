'use client';
import { BarChart3, BookOpen, Cpu, Hexagon, LayoutDashboard, Menu } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'tutorial', label: 'Tutorial', Icon: BookOpen },
  { id: 'workbench', label: 'Workbench', Icon: BarChart3 },
];

export default function TopNav({ activeView, canShowMenu, user, onMenuToggle, onLogout, onViewChange }) {
  return (<header className="fixed left-0 right-0 top-0 z-50 bg-[#0c1625]/66 shadow-[0_5px_20px_rgba(1,5,14,0.15)] backdrop-blur-2xl">
    <div className="px-4 md:px-6">
      <div className="relative flex h-[72px] items-center justify-between gap-3 md:h-[76px]">
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

        <nav className="hidden rounded-2xl border border-[#263a55] bg-[#111d2e]/78 p-1 md:flex">
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onViewChange(id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition ${activeView === id ? 'bg-[#244064] text-[#edf3fb] shadow-[0_8px_18px_rgba(0,0,0,0.16)]' : 'text-[#91a3bd] hover:bg-[#1a2a40] hover:text-[#dce7f5]'}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex rounded-xl border border-[#263a55] bg-[#111d2e]/78 p-1 md:hidden">
            {navItems.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                title={label}
                onClick={() => onViewChange(id)}
                className={`rounded-lg p-2 transition ${activeView === id ? 'bg-[#244064] text-[#edf3fb]' : 'text-[#91a3bd] hover:bg-[#1a2a40] hover:text-[#dce7f5]'}`}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
          <p className="hidden text-sm font-medium text-[#a4b2ca] sm:block">{user.name}</p>
          <button onClick={onLogout} className="rounded-xl bg-[#172437]/78 px-3.5 py-2 text-sm font-medium text-[#cad5e7] shadow-[0_5px_14px_rgba(0,0,0,0.14)] transition hover:bg-[#1d2c42]">
            Sign out
          </button>
        </div>
      </div>
    </div>
  </header>);
}
