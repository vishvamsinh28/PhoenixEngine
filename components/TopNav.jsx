'use client';
import { Menu, Hexagon, Cpu } from 'lucide-react';
import { NAV_TABS } from '@/data/uiConfig';
import NavTabButton from '@/components/NavTabButton';

export default function TopNav({ activeTab, onTabChange, onMenuToggle }) {
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
              <p className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-[#607d8a] sm:block">Physics intelligence platform</p>
            </div>
          </div>

          <div className="hidden md:absolute md:left-1/2 md:flex md:-translate-x-1/2">
            <nav className="flex items-center gap-1 rounded-full border border-[#19313c] bg-[#0b1921] p-[5px]">
              {NAV_TABS.map((tab) => (<NavTabButton key={tab.id} tab={tab} isActive={activeTab === tab.id} onSelect={onTabChange}/>))}
            </nav>
          </div>

          <div className="hidden items-center rounded-full border border-[#183846] bg-[#0b2029] px-3 py-2 text-xs text-[#69d7ff] md:flex">
            Solver beta
          </div>
        </div>

        <div className="pb-4 md:hidden">
          <nav className="no-scrollbar flex items-center gap-2 overflow-x-auto">
            {NAV_TABS.map((tab) => (<NavTabButton key={tab.id} tab={tab} isActive={activeTab === tab.id} onSelect={onTabChange} mobile/>))}
          </nav>
        </div>
      </div>
    </header>);
}
