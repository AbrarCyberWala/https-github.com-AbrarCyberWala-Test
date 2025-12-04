export enum GameStatus {
  MENU = 'MENU',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  VICTORY = 'VICTORY',
  GAME_OVER = 'GAME_OVER'
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
  EXPERT = 'Expert'
}

export interface WordData {
  word: string;
  hint: string;
}

export interface GameState {
  status: GameStatus;
  score: number;
  currentRound: number;
  maxRounds: number;
  topic: string;
  difficulty: Difficulty;
  history: { word: string; solved: boolean }[];
}

export interface Letter {
  id: string;
  char: string;
}

export interface TopicOption {
  id: string;
  label: string;
  icon: string;
  description: string;
}