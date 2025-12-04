import React from 'react';
import { Button } from './Button';
import { GameState } from '../types';
import { Home, RotateCcw, Trophy, Star } from 'lucide-react';

interface GameOverProps {
  gameState: GameState;
  onPlayAgain: () => void;
  onHome: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ gameState, onPlayAgain, onHome }) => {
  const isPerfect = gameState.history.every(h => h.solved);
  const solvedCount = gameState.history.filter(h => h.solved).length;
  
  return (
    <div className="max-w-2xl mx-auto p-6 animate-pop text-center">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
        
        <div className="mb-8">
           {isPerfect ? (
             <div className="w-24 h-24 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-200">
               <Trophy size={48} />
             </div>
           ) : (
             <div className="w-24 h-24 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
               <Star size={48} />
             </div>
           )}
           
           <h2 className="text-4xl font-extrabold text-slate-900 mb-2">
             {isPerfect ? 'Perfect Run!' : 'Game Complete!'}
           </h2>
           <p className="text-slate-500 text-lg">
             You scored <span className="font-bold text-indigo-600">{gameState.score}</span> points
           </p>
        </div>

        <div className="grid gap-4 mb-8 text-left">
          <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-2">Word Summary</h3>
          {gameState.history.map((item, idx) => (
             <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-700">{item.word}</span>
                {item.solved ? (
                  <span className="text-green-600 text-sm font-bold px-2 py-1 bg-green-100 rounded-md">Solved</span>
                ) : (
                  <span className="text-rose-500 text-sm font-bold px-2 py-1 bg-rose-100 rounded-md">Missed</span>
                )}
             </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={onPlayAgain} size="lg" className="flex items-center gap-2">
            <RotateCcw size={20} />
            Play Again
          </Button>
          <Button onClick={onHome} variant="outline" size="lg" className="flex items-center gap-2">
            <Home size={20} />
            Main Menu
          </Button>
        </div>

      </div>
    </div>
  );
};