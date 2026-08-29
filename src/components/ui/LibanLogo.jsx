import React from 'react';

export const LibanLogo = ({ theme = 'light', size = 'md' }) => {
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' };
  const color = theme === 'dark' ? 'text-white' : 'text-liban-dark';
  return (
    <div className={'flex items-center gap-1 font-black tracking-tight ' + sizes[size] + ' ' + color}>
      <span>LIB</span>
      <span className="text-brand-red">AN</span>
    </div>
  );
};
