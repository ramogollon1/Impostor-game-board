
export enum GamePhase {
  CONFIG = 'config',
  ASSIGNMENT = 'assignment',
  DISCUSSION = 'discussion',
  VOTING = 'voting',
  RESULTS = 'results'
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  role: 'crew' | 'impostor';
  status: 'alive' | 'dead';
  votedFor?: string;
}

export interface GameSettings {
  category: string;
  impostorsCount: number;
  discussionMinutes: number;
  secretWord: string;
  isManualWord: boolean;
}
