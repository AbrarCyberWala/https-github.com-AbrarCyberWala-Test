import { Difficulty, TopicOption } from "./types";

export const TOPICS: TopicOption[] = [
  { id: 'general', label: 'General Knowledge', icon: '🧠', description: 'A mix of everything.' },
  { id: 'science', label: 'Science & Nature', icon: '🧬', description: 'Physics, biology, and the natural world.' },
  { id: 'technology', label: 'Technology', icon: '💻', description: 'Computers, gadgets, and innovation.' },
  { id: 'food', label: 'Food & Cooking', icon: '🍳', description: 'Delicious ingredients and dishes.' },
  { id: 'travel', label: 'World Travel', icon: '🌍', description: 'Countries, cities, and landmarks.' },
];

export const DIFFICULTY_LEVELS = [
  { value: Difficulty.EASY, label: 'Easy', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: Difficulty.MEDIUM, label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: Difficulty.HARD, label: 'Hard', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: Difficulty.EXPERT, label: 'Expert', color: 'bg-red-100 text-red-700 border-red-200' },
];

export const POINTS_PER_WORD = 100;
export const HINT_PENALTY = 25;
export const ROUNDS_PER_GAME = 5;