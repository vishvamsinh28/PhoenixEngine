'use client';
import { Menu, Hexagon, Cpu } from 'lucide-react';

export default function TopNav({ user, onMenuToggle, onLogout }) {
    return (<header className="fixed left-0 right-0 top-0 z-50 border-b border-[#122630] bg-[#061117]/92 backdrop-blur-xl">
      <div className="px-4 md:px-5">
        <div className="relative flex h-[72px] items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={onMenuToggle} className="shrink-0 rounded-xl p-2 transition-colors hover:bg-[#10242e] md:hidden">
          <Menu className="h-5 w-5 text-[#91a6b2]"/>
        </button>
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#142d38] text-[#25c0ee]">
              <Hexagon className="h-7 w-7"/>
              <Cpu className="absolute h-3.5 w-3.5"/>
            </div>
            <div>
              <p className="text-base font-semibold tracking-[-0.03em] text-white">Phoenix Engine</p>
              <p className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-[#607d8a] sm:block">Created by Vishvamsinh Vaghela</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <p className="hidden text-sm text-[#9eb2bb] sm:block">{user.name}</p>
            <button onClick={onLogout} className="rounded-lg border border-[#1d3743] bg-[#0b1c25] px-3 py-2 text-sm text-[#c1d1d8] hover:bg-[#112a35]">
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>);
}
