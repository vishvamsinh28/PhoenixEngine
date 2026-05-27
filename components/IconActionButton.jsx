'use client';
import { memo } from 'react';

function IconActionButton({ icon: Icon, title, onClick, active = false, rounded = 'lg', sizeClass = 'h-[14px] w-[14px]', buttonClassName = '' }) {
    return (<button title={title} onClick={onClick} className={`${rounded === 'full'
            ? 'rounded-full'
            : 'rounded-lg'} transition-colors ${active
            ? 'bg-[#123442] text-[#22b7e8]'
            : 'text-[#63808d] hover:bg-[#112631] hover:text-[#bdd1d8]'} ${buttonClassName}`}>
      <Icon className={sizeClass}/>
    </button>);
}

export default memo(IconActionButton);
