import React from 'react';

interface LetterTileProps {
  char: string;
  onClick?: () => void;
  status?: 'default' | 'selected' | 'correct' | 'wrong' | 'placeholder';
  size?: 'sm' | 'md' | 'lg';
}

export const LetterTile: React.FC<LetterTileProps> = ({
  char,
  onClick,
  status = 'default',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: "w-10 h-10 text-lg",
    md: "w-14 h-14 text-2xl sm:w-16 sm:h-16 sm:text-3xl",
    lg: "w-20 h-20 text-4xl",
  };

  const statusClasses = {
    default: "bg-white text-slate-800 border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 shadow-sm hover:bg-slate-50",
    selected: "bg-indigo-100 text-indigo-700 border-b-4 border-indigo-300",
    correct: "bg-green-500 text-white border-b-4 border-green-700 shadow-green-200",
    wrong: "bg-rose-500 text-white border-b-4 border-rose-700 shadow-rose-200 animate-shake",
    placeholder: "bg-slate-200/50 border-2 border-dashed border-slate-300 text-transparent",
  };

  if (status === 'placeholder') {
    return (
      <div 
        className={`${sizeClasses[size]} rounded-xl flex items-center justify-center m-1`}
      />
    );
  }

  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        ${statusClasses[status]}
        rounded-xl flex items-center justify-center font-bold m-1
        transition-all duration-150 select-none
        shadow-md cursor-pointer
        animate-pop
      `}
    >
      {char}
    </button>
  );
};