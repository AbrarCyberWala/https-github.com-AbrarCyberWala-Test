import React, { useState, useEffect, useCallback } from 'react';
import { WordData, Letter } from '../types';
import { LetterTile } from './LetterTile';
import { Button } from './Button';
import { Lightbulb, RefreshCcw, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { HINT_PENALTY, POINTS_PER_WORD } from '../constants';

interface GameProps {
  wordData: WordData;
  roundIndex: number;
  totalRounds: number;
  score: number;
  onRoundComplete: (scoreDelta: number, solved: boolean) => void;
  onQuit: () => void;
}

export const Game: React.FC<GameProps> = ({
  wordData,
  roundIndex,
  totalRounds,
  score,
  onRoundComplete,
  onQuit
}) => {
  const [availableLetters, setAvailableLetters] = useState<Letter[]>([]);
  const [placedLetters, setPlacedLetters] = useState<(Letter | null)[]>([]);
  const [feedback, setFeedback] = useState<'none' | 'success' | 'error'>('none');
  const [hintUsed, setHintUsed] = useState(false);
  const [revealHint, setRevealHint] = useState(false);

  // Initialize the round
  useEffect(() => {
    const letters = wordData.word.split('').map((char, index) => ({
      id: `${char}-${index}-${Math.random()}`,
      char
    }));
    
    // Shuffle
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    
    setAvailableLetters(shuffled);
    setPlacedLetters(new Array(letters.length).fill(null));
    setFeedback('none');
    setHintUsed(false);
    setRevealHint(false);
  }, [wordData]);

  const handlePlaceLetter = (letter: Letter) => {
    if (feedback === 'success') return; // Locked if won

    // Find first empty slot
    const emptyIndex = placedLetters.findIndex(l => l === null);
    if (emptyIndex !== -1) {
      const newPlaced = [...placedLetters];
      newPlaced[emptyIndex] = letter;
      setPlacedLetters(newPlaced);

      setAvailableLetters(prev => prev.filter(l => l.id !== letter.id));
      setFeedback('none'); // Reset error state on move
    }
  };

  const handleRemoveLetter = (letter: Letter, index: number) => {
    if (feedback === 'success') return;

    const newPlaced = [...placedLetters];
    newPlaced[index] = null;
    setPlacedLetters(newPlaced);

    setAvailableLetters(prev => [...prev, letter]);
    setFeedback('none');
  };

  const handleCheck = useCallback(() => {
    const currentWord = placedLetters.map(l => l?.char || '').join('');
    
    if (currentWord.length !== wordData.word.length) {
      // Not full yet
      return; 
    }

    if (currentWord === wordData.word) {
      setFeedback('success');
      // Calculate score
      let points = POINTS_PER_WORD;
      if (hintUsed) points -= HINT_PENALTY;
      
      // Delay before moving to next round
      setTimeout(() => {
        onRoundComplete(points, true);
      }, 1500);
    } else {
      setFeedback('error');
      // Clear error after animation
      setTimeout(() => setFeedback('none'), 1000);
    }
  }, [placedLetters, wordData.word, hintUsed, onRoundComplete]);

  // Auto-check when filled? Maybe too aggressive. Let's stick to manual or auto if full.
  // Let's do auto-check when full for better UX.
  useEffect(() => {
    const isFull = placedLetters.every(l => l !== null);
    if (isFull && feedback === 'none') {
      handleCheck();
    }
  }, [placedLetters, handleCheck, feedback]);

  const useHint = () => {
    if (!hintUsed) {
      setHintUsed(true);
    }
    setRevealHint(true);
  };

  const giveUp = () => {
    setFeedback('error'); // Show red briefly
    setTimeout(() => {
      onRoundComplete(0, false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col items-center min-h-[80vh] justify-center animate-pop">
      
      {/* Header Info */}
      <div className="w-full flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-bold">
            Round {roundIndex + 1}/{totalRounds}
          </div>
          <div className="text-slate-500 font-medium hidden sm:block">
            Find the word!
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm uppercase tracking-wider font-bold">Score</span>
          <span className="text-2xl font-black text-slate-800">{score}</span>
        </div>
      </div>

      {/* Answer Slots */}
      <div className="flex flex-wrap justify-center gap-2 mb-12 min-h-[80px]">
        {placedLetters.map((letter, i) => (
          <div key={`slot-${i}`} className="relative">
            {letter ? (
              <LetterTile 
                char={letter.char} 
                status={feedback === 'success' ? 'correct' : feedback === 'error' ? 'wrong' : 'selected'}
                onClick={() => handleRemoveLetter(letter, i)}
              />
            ) : (
              <LetterTile char="" status="placeholder" />
            )}
          </div>
        ))}
      </div>

      {/* Available Letters Pool */}
      <div className="flex flex-wrap justify-center gap-2 mb-12 p-6 bg-slate-100 rounded-3xl w-full max-w-2xl min-h-[120px]">
        {availableLetters.map((letter) => (
          <LetterTile 
            key={letter.id} 
            char={letter.char} 
            onClick={() => handlePlaceLetter(letter)}
          />
        ))}
        {availableLetters.length === 0 && placedLetters.every(l => l !== null) && feedback !== 'success' && (
           <div className="flex items-center text-slate-400 font-medium italic h-14">
             Checking...
           </div>
        )}
      </div>

      {/* Controls & Hints */}
      <div className="w-full max-w-2xl space-y-6">
        
        {/* Hint Box */}
        <div className={`
          relative overflow-hidden rounded-xl border-2 transition-all duration-300
          ${revealHint ? 'bg-amber-50 border-amber-200 p-4' : 'bg-white border-dashed border-slate-200 p-0 h-0 opacity-0'}
        `}>
           <div className="flex gap-3">
             <Lightbulb className="text-amber-500 shrink-0" />
             <div>
               <h4 className="font-bold text-amber-800 text-sm uppercase mb-1">Hint</h4>
               <p className="text-amber-900 font-medium">{wordData.hint}</p>
             </div>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            variant="outline" 
            onClick={useHint} 
            disabled={revealHint || feedback === 'success'}
            className="flex items-center gap-2"
          >
            <Lightbulb size={18} />
            Hint {-HINT_PENALTY}
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => {
              // Reset board
              const allLetters = [...availableLetters, ...placedLetters.filter((l): l is Letter => l !== null)];
              setAvailableLetters(allLetters.sort(() => Math.random() - 0.5));
              setPlacedLetters(new Array(wordData.word.length).fill(null));
              setFeedback('none');
            }}
            disabled={feedback === 'success'}
            className="flex items-center gap-2"
          >
            <RefreshCcw size={18} />
            Shuffle
          </Button>

          <Button 
            variant="danger" 
            className="md:col-start-4"
            onClick={onQuit}
          >
            Quit
          </Button>
          
           {/* Skip/Next is handled automatically by win, but maybe a 'Give Up' button? */}
          <Button 
             variant="ghost"
             className="text-rose-500 hover:bg-rose-50 hover:text-rose-600"
             onClick={giveUp}
             disabled={feedback === 'success'}
          >
             Give Up
          </Button>
        </div>
      </div>

      {/* Feedback Overlay (Optional, for big success moments) */}
      {feedback === 'success' && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl animate-pop border-4 border-green-100 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-black text-slate-800 mb-2">Excellent!</h2>
            <p className="text-slate-500 font-medium">Next word coming up...</p>
          </div>
        </div>
      )}
    </div>
  );
};