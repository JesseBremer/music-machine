export interface ElectronAPI {
  saveProject: (projectData: any, filePath?: string) => Promise<string | null>;
  loadProject: (filePath?: string) => Promise<{ data: any; filePath: string } | null>;
  exportAbleton: (exportData: any) => Promise<string | null>;
  onMenuAction: (callback: (action: string, data?: any) => void) => void;
  removeMenuListener: () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export interface ProjectSection {
  id: string;
  name: string;
  bars: number;
  chords: string[];
  repeat: number;
}

export interface ProjectTrack {
  id: string;
  name: string;
  instrument: string;
  patterns: MidiPattern[];
  automation: Record<string, any>;
  muted: boolean;
  solo: boolean;
  volume: number;
  pan: number;
}

export interface MidiPattern {
  id: string;
  name: string;
  notes: MidiNote[];
  length: number;
  velocity: number;
}

export interface MidiNote {
  pitch: number;
  start: number;
  duration: number;
  velocity: number;
}

export interface Project {
  version: string;
  metadata: {
    title: string;
    key: string;
    tempo: number;
    timeSignature: string;
    created: string;
    modified: string;
  };
  sections: ProjectSection[];
  tracks: ProjectTrack[];
  mixerState: Record<string, any>;
  projectSettings: Record<string, any>;
}

export interface ChordData {
  root: string;
  quality: string;
  extension?: string;
  bass?: string;
  notes: string[];
  intervals: number[];
}

export interface ScaleData {
  name: string;
  notes: string[];
  intervals: number[];
  modes: string[];
}

export interface TransportState {
  isPlaying: boolean;
  currentPosition: number;
  isLooping: boolean;
  loopStart: number;
  loopEnd: number;
}

export type InstrumentType = 'drums' | 'bass' | 'piano' | 'guitar' | 'strings' | 'brass' | 'woodwinds' | 'synth';

export interface PatternStyle {
  name: string;
  complexity: number;
  swing: number;
  humanization: number;
  genre: string;
}