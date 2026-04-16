'use client';
import { memo } from 'react';

function NavTabButton({ tab, isActive, onSelect, mobile = false }) {
    const Icon = tab.icon;
    const className = mobile
        ? `flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-200 ${isActive
            ? 'border-[#2f66ea] bg-[#2f66ea] text-white shadow-[0_10px_18px_rgba(47,102,234,0.24)]'
            : 'border-[#e5eaf3] bg-white text-[#7b8599] hover:bg-[#f5f7fc] hover:text-[#5f687d]'}`
        : `flex min-w-[118px] items-center justify-center gap-2 rounded-full px-4 py-[10px] text-[15px] font-medium transition-all duration-200 ${isActive
            ? 'bg-[#2f66ea] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_18px_rgba(47,102,234,0.28)]'
            : 'text-[#8c95a8] hover:bg-[#f5f7fc] hover:text-[#5f687d]'}`;

    return (<button onClick={() => onSelect(tab.id)} className={className}>
      <Icon className="h-4 w-4"/>
      <span>{tab.label}</span>
    </button>);
}

export default memo(NavTabButton);
