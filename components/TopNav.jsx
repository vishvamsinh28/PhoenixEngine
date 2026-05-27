'use client';
import { Menu, Hexagon, Cpu } from 'lucide-react';

export default function TopNav({ user, onMenuToggle, onLogout }) {
    return (<header className="fixed left-0 right-0 top-0 z-50 border-b border-white/80 bg-white/62 backdrop-blur-2xl">
      <div className="px-4 md:px-6">
        <div className="relative flex h-[72px] items-center justify-between gap-3 md:h-[76px]">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={onMenuToggle} className="shrink-0 rounded-xl p-2 transition-colors hover:bg-[#f0f4ff] md:hidden">
          <Menu className="h-5 w-5 text-[#60708f]"/>
        </button>
            <div className="relative flex h-10 w-10 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#346cf3,#63c5ff)] text-white shadow-[0_10px_24px_rgba(50,105,242,0.25)]">
              <Hexagon className="h-7 w-7"/>
              <Cpu className="absolute h-3.5 w-3.5"/>
            </div>
            <div>
              <p className="text-base font-semibold tracking-[-0.03em] text-[#172743]">Phoenix Engine</p>
              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8795b0] sm:block">Created by Vishvamsinh Vaghela</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <p className="hidden text-sm font-medium text-[#657491] sm:block">{user.name}</p>
            <button onClick={onLogout} className="rounded-xl border border-[#dee5f4] bg-white px-3.5 py-2 text-sm font-medium text-[#3c4d70] shadow-sm transition hover:bg-[#f5f7ff]">
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>);
}
