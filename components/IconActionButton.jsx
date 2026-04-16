'use client';
import { memo } from 'react';

function IconActionButton({ icon: Icon, title, onClick, active = false, rounded = 'lg', sizeClass = 'h-[14px] w-[14px]', buttonClassName = '' }) {
    return (<button title={title} onClick={onClick} className={`${rounded === 'full'
            ? 'rounded-full'
            : 'rounded-lg'} transition-colors ${active
            ? 'bg-white text-[#2f66ea]'
            : 'text-[#6f7b91] hover:bg-white hover:text-[#1f2a44]'} ${buttonClassName}`}>
      <Icon className={sizeClass}/>
    </button>);
}

export default memo(IconActionButton);
