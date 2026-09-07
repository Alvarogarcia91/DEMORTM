import React from 'react';

interface LogoProps {
  variant?: 'full' | 'mark' | 'light';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md',
  showBadge = true,
}) => {
  const heights = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-11',
  };

  const markSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  if (variant === 'mark') {
    return (
      <div className={`flex items-center gap-2.5 select-none ${className}`}>
        <img
          src="/assets/rtm-mark.svg"
          alt="Impresos RTM"
          className={`${markSizes[size]} object-contain rounded-lg shadow-sm`}
        />
        {showBadge && (
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-sm text-surface-900 dark:text-white tracking-tight">Impresos RTM</span>
            <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">ERP</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <img
        src="/assets/logo-rtm.svg"
        alt="Impresos RTM"
        className={`${heights[size]} w-auto object-contain drop-shadow-sm`}
      />
      {showBadge && (
        <span className="text-[11px] font-bold tracking-[0.2em] text-surface-400 uppercase border-l border-surface-200 dark:border-surface-800 pl-3">
          ERP
        </span>
      )}
    </div>
  );
};
