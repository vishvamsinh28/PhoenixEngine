'use client';
import { memo } from 'react';

function NavTabButton({ tab, isActive, onSelect, mobile = false }) {
    const Icon = tab.icon;
    const className = mobile
        ? `flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-200 ${isActive
            ? 'border-[#25bbe9] bg-[#123442] text-[#83dcfa]'
            : 'border-[#19313c] bg-[#0a1820] text-[#7e98a5] hover:bg-[#10242e] hover:text-[#b6c9d1]'}`
        : `flex min-w-[118px] items-center justify-center gap-2 rounded-full px-4 py-[10px] text-[15px] font-medium transition-all duration-200 ${isActive
            ? 'bg-[#133543] text-[#62d5fb] shadow-[inset_0_1px_0_rgba(77,205,246,0.18)]'
            : 'text-[#78929e] hover:bg-[#11252f] hover:text-[#c2d4da]'}`;

    return (<button onClick={() => onSelect(tab.id)} className={className}>
      <Icon className="h-4 w-4"/>
      <span>{tab.label}</span>
    </button>);
}

export default memo(NavTabButton);
