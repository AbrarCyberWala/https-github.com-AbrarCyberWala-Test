import React, { useState } from 'react';
import { GameStatus, GameState, Difficulty, WordData } from './types';
import { MainMenu } from './components/MainMenu';
import { Game } from './components/Game';
import { GameOver } from './components/GameOver';
import { generateWords } from './services/geminiService';
import { ROUNDS_PER_GAME } from './constants';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.MENU);
  const [gameState, setGameState] = useState<GameState>({
    status: GameStatus.MENU,
    score: 0,
    currentRound: 0,
    maxRounds: ROUNDS_PER_GAME,
    topic: '',
    difficulty: Difficulty.MEDIUM,
    history: []
  });
  const [currentWords, setCurrentWords] = useState<WordData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const startGame = async (topic: string, difficulty: Difficulty) => {
    setIsLoading(true);
    setStatus(GameStatus.LOADING);
    
    try {
      const words = await generateWords(topic, difficulty, ROUNDS_PER_GAME);
      setCurrentWords(words);
      setGameState({
        status: GameStatus.PLAYING,
        score: 0,
        currentRound: 0,
        maxRounds: words.length,
        topic,
        difficulty,
        history: []
      });
      setStatus(GameStatus.PLAYING);
    } catch (error) {
      console.error("Failed to start game", error);
      setStatus(GameStatus.MENU); // Fallback to menu on critical error
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoundComplete = (scoreDelta: number, solved: boolean) => {
    const currentWord = currentWords[gameState.currentRound].word;
    
    setGameState(prev => ({
      ...prev,
      score: prev.score + scoreDelta,
      history: [...prev.history, { word: currentWord, solved }]
    }));

    if (gameState.currentRound + 1 >= gameState.maxRounds) {
      setStatus(GameStatus.GAME_OVER);
    } else {
      setGameState(prev => ({ ...prev, currentRound: prev.currentRound + 1 }));
    }
  };

  const handleQuit = () => {
    setStatus(GameStatus.MENU);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 font-sans">
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-pop">
           <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
           <h3 className="text-xl font-bold text-indigo-900">Generating Level...</h3>
           <p className="text-slate-500">Gemini is curating your words</p>
        </div>
      )}

      {status === GameStatus.MENU && (
        <MainMenu onStartGame={startGame} />
      )}

      {status === GameStatus.PLAYING && currentWords.length > 0 && (
        <Game
          wordData={currentWords[gameState.currentRound]}
          roundIndex={gameState.currentRound}
          totalRounds={gameState.maxRounds}
          score={gameState.score}
          onRoundComplete={handleRoundComplete}
          onQuit={handleQuit}
        />
      )}

      {status === GameStatus.GAME_OVER && (
        <GameOver 
          gameState={gameState} 
          onPlayAgain={() => startGame(gameState.topic, gameState.difficulty)}
          onHome={() => setStatus(GameStatus.MENU)}
        />
      )}
      
      {/* Footer / Credits */}
      <footer className="fixed bottom-4 left-0 right-0 text-center text-slate-400 text-xs pointer-events-none">
        Powered by Gemini API
      </footer>
    </div>
  );
};

export default App;