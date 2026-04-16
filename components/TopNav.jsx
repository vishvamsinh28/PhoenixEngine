'use client';
import { LayoutDashboard, TrendingUp, FileText, MessageCircle, Menu } from 'lucide-react';
const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'transcript', label: 'Transcript', icon: FileText },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
];
export default function TopNav({ activeTab, onTabChange, onMenuToggle }) {
    return (<header className="fixed left-0 right-0 top-0 z-50 border-b border-[#e6ebf4] bg-white/88 backdrop-blur-xl">
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
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (<button key={tab.id} onClick={() => onTabChange(tab.id)} className={`flex min-w-[118px] items-center justify-center gap-2 rounded-full px-4 py-[10px] text-[15px] font-medium transition-all duration-200 ${isActive
                        ? 'bg-[#2f66ea] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_18px_rgba(47,102,234,0.28)]'
                        : 'text-[#8c95a8] hover:bg-[#f5f7fc] hover:text-[#5f687d]'}`}>
                    <Icon className="h-4 w-4"/>
                    <span>{tab.label}</span>
                  </button>);
            })}
            </nav>
          </div>

          <div className="hidden md:block md:w-[132px] md:flex-shrink-0" aria-hidden="true"/>
        </div>

        <div className="pb-4 md:hidden">
          <nav className="no-scrollbar flex items-center gap-2 overflow-x-auto">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (<button key={tab.id} onClick={() => onTabChange(tab.id)} className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-200 ${isActive
                        ? 'border-[#2f66ea] bg-[#2f66ea] text-white shadow-[0_10px_18px_rgba(47,102,234,0.24)]'
                        : 'border-[#e5eaf3] bg-white text-[#7b8599] hover:bg-[#f5f7fc] hover:text-[#5f687d]'}`}>
                  <Icon className="h-4 w-4"/>
                  <span>{tab.label}</span>
                </button>);
            })}
          </nav>
        </div>
      </div>
    </header>);
}
