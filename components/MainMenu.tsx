import React, { useState } from 'react';
import { Difficulty, TopicOption } from '../types';
import { TOPICS, DIFFICULTY_LEVELS } from '../constants';
import { Button } from './Button';
import { Brain, Trophy, Wand2 } from 'lucide-react';

interface MainMenuProps {
  onStartGame: (topic: string, difficulty: Difficulty) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>(TOPICS[0].id);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);

  return (
    <div className="max-w-4xl mx-auto p-6 animate-pop">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl mb-6 shadow-xl shadow-indigo-100">
          <Brain size={48} />
        </div>
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Scramble<span className="text-indigo-600">Genius</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-lg mx-auto">
          Unscramble AI-generated words across different topics. Challenge your vocabulary and speed!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Topics Section */}
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Wand2 className="text-purple-500" size={24} />
            Choose Topic
          </h2>
          <div className="grid gap-3">
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`
                  p-4 rounded-xl text-left flex items-center gap-4 transition-all
                  ${selectedTopic === topic.id 
                    ? 'bg-indigo-50 border-2 border-indigo-500 shadow-md' 
                    : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'}
                `}
              >
                <span className="text-2xl">{topic.icon}</span>
                <div>
                  <div className={`font-bold ${selectedTopic === topic.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {topic.label}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {topic.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Section */}
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Trophy className="text-amber-500" size={24} />
            Difficulty
          </h2>
          <div className="grid gap-3 flex-1">
            {DIFFICULTY_LEVELS.map((level) => (
              <button
                key={level.value}
                onClick={() => setSelectedDifficulty(level.value)}
                className={`
                  p-4 rounded-xl text-left transition-all
                  ${selectedDifficulty === level.value 
                    ? `${level.color} border-2 shadow-md font-bold ring-1 ring-offset-1` 
                    : 'bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100'}
                `}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          size="lg" 
          onClick={() => onStartGame(selectedTopic, selectedDifficulty)}
          className="w-full md:w-auto min-w-[300px] text-xl shadow-indigo-300 hover:shadow-indigo-400"
        >
          Start Game
        </Button>
      </div>
    </div>
  );
};