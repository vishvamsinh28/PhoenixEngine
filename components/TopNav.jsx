'use client';
import { Menu, Hexagon, Cpu } from 'lucide-react';

export default function TopNav({ user, onMenuToggle, onLogout }) {
  return (<header className="fixed left-0 right-0 top-0 z-50 bg-[#0c1625]/66 shadow-[0_5px_20px_rgba(1,5,14,0.15)] backdrop-blur-2xl">
    <div className="px-4 md:px-6">
      <div className="relative flex h-[72px] items-center justify-between gap-3 md:h-[76px]">
        <div className="flex min-w-0 items-center gap-3">
          <button onClick={onMenuToggle} className="shrink-0 rounded-xl p-2 transition-colors hover:bg-[#1a2639] md:hidden">
            <Menu className="h-5 w-5 text-[#a5b3ca]" />
          </button>
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

        <div className="flex items-center gap-3">
          <p className="hidden text-sm font-medium text-[#a4b2ca] sm:block">{user.name}</p>
          <button onClick={onLogout} className="rounded-xl bg-[#172437]/78 px-3.5 py-2 text-sm font-medium text-[#cad5e7] shadow-[0_5px_14px_rgba(0,0,0,0.14)] transition hover:bg-[#1d2c42]">
            Sign out
          </button>
        </div>
      </div>
    </div>
  </header>);
}
