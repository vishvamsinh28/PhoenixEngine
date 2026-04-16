'use client';
import { LayoutDashboard, TrendingUp, FileText, MessageCircle, Menu } from 'lucide-react';
const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'transcript', label: 'Transcript', icon: FileText },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
];
export default function TopNav({ activeTab, onTabChange, onMenuToggle }) {
    return (<header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center px-4 md:px-6">
      <div className="flex items-center gap-3 min-w-[180px]">
        <button onClick={onMenuToggle} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Menu className="w-5 h-5 text-gray-600"/>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          <span className="font-semibold text-gray-900 text-sm hidden sm:block">Synthio Labs</span>
        </div>
      </div>

      <div className="flex-1 flex justify-center">
        <nav className="bg-gray-100 rounded-full p-1 flex items-center gap-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (<button key={tab.id} onClick={() => onTabChange(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'}`}>
                <Icon className="w-4 h-4"/>
                <span className="hidden sm:block">{tab.label}</span>
              </button>);
        })}
        </nav>
      </div>

      <div className="min-w-[180px] flex justify-end">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 text-xs font-semibold">SL</span>
        </div>
      </div>
    </header>);
}
