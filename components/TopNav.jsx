'use client';
import { LayoutDashboard, TrendingUp, FileText, MessageCircle, Menu } from 'lucide-react';
const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'transcript', label: 'Transcript', icon: FileText },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
];
export default function TopNav({ activeTab, onTabChange, onMenuToggle }) {
    return (<header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="px-4 md:px-6">
        <div className="relative flex h-16 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={onMenuToggle} className="shrink-0 rounded-lg p-2 transition-colors hover:bg-gray-100 md:hidden">
          <Menu className="w-5 h-5 text-gray-600"/>
        </button>
            <img src="/logo.png" alt="Synthio Labs logo" className="h-9 w-auto max-w-[150px] object-contain sm:h-10 md:max-w-none"/>
          </div>

          <div className="hidden md:absolute md:left-1/2 md:flex md:-translate-x-1/2">
            <nav className="flex items-center gap-0.5 rounded-full bg-gray-100 p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (<button key={tab.id} onClick={() => onTabChange(tab.id)} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-500 hover:bg-white/60 hover:text-gray-700'}`}>
                    <Icon className="w-4 h-4"/>
                    <span className="hidden sm:block">{tab.label}</span>
                  </button>);
            })}
            </nav>
          </div>

          <div className="hidden md:block md:w-[150px] md:flex-shrink-0" aria-hidden="true"/>
        </div>

        <div className="pb-3 md:hidden">
          <nav className="no-scrollbar flex items-center gap-2 overflow-x-auto">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (<button key={tab.id} onClick={() => onTabChange(tab.id)} className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 ${isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'}`}>
                  <Icon className="h-4 w-4"/>
                  <span>{tab.label}</span>
                </button>);
            })}
          </nav>
        </div>
      </div>
    </header>);
}
