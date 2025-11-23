import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-start select-none">
      <h1 className="text-3xl md:text-4xl font-light tracking-[0.3em] text-white uppercase" style={{ fontFamily: 'Manrope, sans-serif' }}>
        DORREN
      </h1>
      <div className="w-full h-[1px] bg-dorren-lightBlue mt-2 opacity-50"></div>
      <p className="text-[10px] md:text-xs tracking-[0.4em] text-dorren-lightBlue uppercase mt-1">
        Управление проемами
      </p>
    </div>
  );
};