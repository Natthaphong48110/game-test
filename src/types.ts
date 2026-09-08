export type GameTab = 'navigator' | 'sequencer' | 'pattern' | 'abstraction' | 'sorting' | 'lessons';

export interface CommandBlock {
  id: string;
  type: 'forward' | 'turn_left' | 'turn_right' | 'jump' | 'collect';
  label: string;
  iconName: string;
  color: string;
}

export interface GridCell {
  x: number;
  y: number;
  type: 'empty' | 'wall' | 'obstacle' | 'gem' | 'target' | 'start';
}

export interface RoboLevel {
  id: number;
  title: string;
  story: string;
  gridSize: { rows: number; cols: number };
  start: { x: number; y: number; dir: 'up' | 'down' | 'left' | 'right' };
  target: { x: number; y: number };
  gems: { x: number; y: number }[];
  obstacles: { x: number; y: number; type: 'rock' | 'water' }[];
  allowedBlocks: ('forward' | 'turn_left' | 'turn_right' | 'jump' | 'collect')[];
  hint: string;
  maxBlocks?: number;
}

export interface SequenceStep {
  id: string;
  text: string;
  icon: string;
  order: number;
}

export interface SequenceTask {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: SequenceStep[];
  successExplanation: string;
}

export interface PatternQuestion {
  id: string;
  title: string;
  sequence: { label: string; icon: string; color: string }[];
  options: { label: string; icon: string; color: string }[];
  correctIndex: number;
  explanation: string;
}

export interface AbstractionItem {
  id: string;
  name: string;
  icon: string;
  isEssential: boolean;
  reason: string;
}

export interface AbstractionScenario {
  id: string;
  title: string;
  mission: string;
  targetCount: number; // number of essential items
  items: AbstractionItem[];
  tips: string;
}

export interface UserStats {
  stars: number;
  completedLevels: Record<string, boolean>;
  unlockedBadges: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  requirementStars: number;
}
