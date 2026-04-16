'use client';
import { Menu } from 'lucide-react';
import { NAV_TABS } from '@/data/uiConfig';
import NavTabButton from '@/components/NavTabButton';

export default function TopNav({ activeTab, onTabChange, onMenuToggle }) {
    return (<header className="fixed left-0 right-0 top-0 z-50 bg-white/72 backdrop-blur-xl">
      <div className="px-4 md:px-5">
        <div className="relative flex h-[72px] items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={onMenuToggle} className="shrink-0 rounded-xl p-2 transition-colors hover:bg-[#eff3fb] md:hidden">
          <Menu className="h-5 w-5 text-[#657089]"/>
        </button>
            <img src="/logo.png" alt="Synthio Labs logo" className="h-8 w-auto object-contain md:h-9"/>
          </div>

          <div className="hidden md:absolute md:left-1/2 md:flex md:-translate-x-1/2">
            <nav className="flex items-center gap-1 rounded-full border border-white/90 bg-white/90 p-[5px] shadow-[0_8px_22px_rgba(31,42,68,0.08),0_2px_6px_rgba(31,42,68,0.05)]">
              {NAV_TABS.map((tab) => (<NavTabButton key={tab.id} tab={tab} isActive={activeTab === tab.id} onSelect={onTabChange}/>))}
            </nav>
          </div>

          <div className="hidden md:block md:w-[132px] md:flex-shrink-0" aria-hidden="true"/>
        </div>

        <div className="pb-4 md:hidden">
          <nav className="no-scrollbar flex items-center gap-2 overflow-x-auto">
            {NAV_TABS.map((tab) => (<NavTabButton key={tab.id} tab={tab} isActive={activeTab === tab.id} onSelect={onTabChange} mobile/>))}
          </nav>
        </div>
      </div>
    </header>);
}
