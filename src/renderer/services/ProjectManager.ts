import { Project, ProjectSection, ProjectTrack, MidiNote, MidiPattern } from '../types';

interface AbletonLiveSet {
  version: string;
  creator: string;
  tracks: AbletonTrack[];
  masterTrack: AbletonMasterTrack;
  locators: AbletonLocator[];
  tempo: number;
  timeSignature: [number, number];
}

interface AbletonTrack {
  name: string;
  color: number;
  muted: boolean;
  solo: boolean;
  clips: AbletonClip[];
  deviceChain: AbletonDevice[];
}

interface AbletonClip {
  name: string;
  startTime: number;
  endTime: number;
  loopStart: number;
  loopEnd: number;
  notes: AbletonNote[];
}

interface AbletonNote {
  pitch: number;
  start: number;
  duration: number;
  velocity: number;
  muted: boolean;
}

interface AbletonDevice {
  name: string;
  parameters: { [key: string]: any };
}

interface AbletonMasterTrack {
  tempo: number;
  timeSignature: [number, number];
  volume: number;
}

interface AbletonLocator {
  name: string;
  time: number;
}

export class ProjectManager {
  private currentProject: Project | null = null;
  private projectHistory: Project[] = [];
  private maxHistorySize = 50;

  constructor() {}

  createNewProject(template?: Partial<Project>): Project {
    const defaultProject: Project = {
      version: '1.0',
      metadata: {
        title: 'Untitled Project',
        key: 'C',
        tempo: 120,
        timeSignature: '4/4',
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      },
      sections: [
        {
          id: this.generateId(),
          name: 'Intro',
          bars: 4,
          chords: ['C', 'F', 'G', 'C'],
          repeat: 1
        },
        {
          id: this.generateId(),
          name: 'Verse',
          bars: 8,
          chords: ['C', 'Am', 'F', 'G'],
          repeat: 2
        },
        {
          id: this.generateId(),
          name: 'Chorus',
          bars: 8,
          chords: ['F', 'C', 'G', 'Am'],
          repeat: 2
        }
      ],
      tracks: [
        this.createDefaultTrack('drums', 'Drums', 'kit_rock'),
        this.createDefaultTrack('bass', 'Bass', 'electric_bass'),
        this.createDefaultTrack('piano', 'Piano', 'acoustic_piano'),
        this.createDefaultTrack('guitar', 'Guitar', 'electric_guitar')
      ],
      mixerState: {},
      projectSettings: {}
    };

    const project = { ...defaultProject, ...template };
    this.currentProject = project;
    this.addToHistory(project);

    return project;
  }

  private createDefaultTrack(id: string, name: string, instrument: string): ProjectTrack {
    return {
      id,
      name,
      instrument,
      patterns: [],
      automation: {},
      muted: false,
      solo: false,
      volume: 0.8,
      pan: 0
    };
  }

  saveProject(project: Project): string {
    const projectData = JSON.stringify(project, null, 2);
    this.currentProject = { ...project };
    this.addToHistory(project);
    return projectData;
  }

  loadProject(projectData: string): Project {
    try {
      const project = JSON.parse(projectData) as Project;

      this.validateProject(project);

      project.metadata.modified = new Date().toISOString();

      this.currentProject = project;
      this.addToHistory(project);

      return project;
    } catch (error) {
      throw new Error(`Failed to load project: ${error}`);
    }
  }

  private validateProject(project: any): void {
    if (!project.version) {
      throw new Error('Invalid project: missing version');
    }

    if (!project.metadata || !project.metadata.title) {
      throw new Error('Invalid project: missing metadata');
    }

    if (!Array.isArray(project.sections)) {
      throw new Error('Invalid project: sections must be an array');
    }

    if (!Array.isArray(project.tracks)) {
      throw new Error('Invalid project: tracks must be an array');
    }

    for (const section of project.sections) {
      if (!section.id || !section.name || !Array.isArray(section.chords)) {
        throw new Error('Invalid project: invalid section structure');
      }
    }

    for (const track of project.tracks) {
      if (!track.id || !track.name || !track.instrument) {
        throw new Error('Invalid project: invalid track structure');
      }
    }
  }

  generateAbletonExport(project: Project): AbletonLiveSet {
    const abletonSet: AbletonLiveSet = {
      version: '12.0',
      creator: 'SongForge Studio',
      tracks: this.convertTracksToAbleton(project.tracks, project.sections),
      masterTrack: {
        tempo: project.metadata.tempo,
        timeSignature: this.parseTimeSignature(project.metadata.timeSignature),
        volume: 1.0
      },
      locators: this.createLocatorsFromSections(project.sections),
      tempo: project.metadata.tempo,
      timeSignature: this.parseTimeSignature(project.metadata.timeSignature)
    };

    return abletonSet;
  }

  private convertTracksToAbleton(tracks: ProjectTrack[], sections: ProjectSection[]): AbletonTrack[] {
    return tracks.map(track => ({
      name: track.name,
      color: this.getTrackColor(track.instrument),
      muted: track.muted,
      solo: track.solo,
      clips: this.createClipsFromPatterns(track.patterns, sections),
      deviceChain: this.createDeviceChain(track.instrument)
    }));
  }

  private createClipsFromPatterns(patterns: MidiPattern[], sections: ProjectSection[]): AbletonClip[] {
    const clips: AbletonClip[] = [];
    let currentTime = 0;

    for (const section of sections) {
      const sectionDuration = section.bars * 4; // Assuming 4/4 time

      for (const pattern of patterns) {
        const clip: AbletonClip = {
          name: `${section.name} - ${pattern.name}`,
          startTime: currentTime,
          endTime: currentTime + sectionDuration,
          loopStart: 0,
          loopEnd: pattern.length,
          notes: pattern.notes.map(note => this.convertNoteToAbleton(note))
        };
        clips.push(clip);
      }

      currentTime += sectionDuration * section.repeat;
    }

    return clips;
  }

  private convertNoteToAbleton(note: MidiNote): AbletonNote {
    return {
      pitch: note.pitch,
      start: note.start,
      duration: note.duration,
      velocity: note.velocity,
      muted: false
    };
  }

  private createDeviceChain(instrument: string): AbletonDevice[] {
    const deviceMappings: { [key: string]: AbletonDevice[] } = {
      'acoustic_piano': [
        { name: 'Operator', parameters: { oscillator: 'sine', envelope: 'piano' } }
      ],
      'electric_bass': [
        { name: 'Bass', parameters: { oscillator: 'sawtooth', filter: 'lowpass' } }
      ],
      'kit_rock': [
        { name: 'Drum Rack', parameters: { kit: 'rock' } }
      ],
      'electric_guitar': [
        { name: 'Amp', parameters: { type: 'clean', drive: 0.3 } },
        { name: 'Cabinet', parameters: { model: '4x12' } }
      ]
    };

    return deviceMappings[instrument] || [];
  }

  private createLocatorsFromSections(sections: ProjectSection[]): AbletonLocator[] {
    const locators: AbletonLocator[] = [];
    let currentTime = 0;

    for (const section of sections) {
      locators.push({
        name: section.name,
        time: currentTime
      });

      const sectionDuration = section.bars * 4; // Assuming 4/4 time
      currentTime += sectionDuration * section.repeat;
    }

    return locators;
  }

  private getTrackColor(instrument: string): number {
    const colorMap: { [key: string]: number } = {
      'kit_rock': 0xFF4444,      // Red
      'electric_bass': 0x44FF44,  // Green
      'acoustic_piano': 0x4444FF, // Blue
      'electric_guitar': 0xFFFF44, // Yellow
      'strings': 0xFF44FF,        // Purple
      'synth_lead': 0x44FFFF      // Cyan
    };

    return colorMap[instrument] || 0xFFFFFF;
  }

  private parseTimeSignature(timeSignature: string): [number, number] {
    const parts = timeSignature.split('/');
    return [parseInt(parts[0]), parseInt(parts[1])];
  }

  exportMidiFile(project: Project): Blob {
    const midiData = this.createMidiData(project);
    return new Blob([midiData], { type: 'audio/midi' });
  }

  private createMidiData(project: Project): ArrayBuffer {
    const tracks = project.tracks.filter(track => !track.muted);
    const ticksPerQuarter = 480;
    const tempo = project.metadata.tempo;

    const midiData = new ArrayBuffer(1024); // Simplified MIDI creation
    const view = new DataView(midiData);

    view.setUint32(0, 0x4D546864); // "MThd"
    view.setUint32(4, 6);          // Header length
    view.setUint16(8, 1);          // Format type 1
    view.setUint16(10, tracks.length); // Number of tracks
    view.setUint16(12, ticksPerQuarter); // Ticks per quarter note

    return midiData;
  }

  addToHistory(project: Project): void {
    this.projectHistory.push({ ...project });

    if (this.projectHistory.length > this.maxHistorySize) {
      this.projectHistory.shift();
    }
  }

  undo(): Project | null {
    if (this.projectHistory.length < 2) return null;

    this.projectHistory.pop(); // Remove current state
    const previousState = this.projectHistory[this.projectHistory.length - 1];

    return { ...previousState };
  }

  canUndo(): boolean {
    return this.projectHistory.length > 1;
  }

  getCurrentProject(): Project | null {
    return this.currentProject;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  validateChordProgression(chords: string[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (chords.length === 0) {
      errors.push('Chord progression cannot be empty');
    }

    for (let i = 0; i < chords.length; i++) {
      const chord = chords[i];
      if (!this.isValidChord(chord)) {
        errors.push(`Invalid chord at position ${i + 1}: ${chord}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private isValidChord(chord: string): boolean {
    const chordPattern = /^[A-G][#b]?(m|maj|min|dim|aug|sus[24]?|add[69]|maj?[679]|m[679]|[679])?(\/.+)?$/;
    return chordPattern.test(chord);
  }

  generateProjectStats(project: Project): {
    totalDuration: number;
    totalTracks: number;
    totalSections: number;
    totalNotes: number;
    keySignature: string;
    tempo: number;
  } {
    const totalDuration = project.sections.reduce((total, section) => {
      return total + (section.bars * section.repeat * 4); // Assuming 4/4 time
    }, 0);

    const totalNotes = project.tracks.reduce((total, track) => {
      return total + track.patterns.reduce((trackTotal, pattern) => {
        return trackTotal + pattern.notes.length;
      }, 0);
    }, 0);

    return {
      totalDuration,
      totalTracks: project.tracks.length,
      totalSections: project.sections.length,
      totalNotes,
      keySignature: project.metadata.key,
      tempo: project.metadata.tempo
    };
  }

  duplicateSection(project: Project, sectionId: string): ProjectSection | null {
    const section = project.sections.find(s => s.id === sectionId);
    if (!section) return null;

    const duplicatedSection: ProjectSection = {
      ...section,
      id: this.generateId(),
      name: `${section.name} (Copy)`
    };

    return duplicatedSection;
  }

  reorderSections(project: Project, fromIndex: number, toIndex: number): ProjectSection[] {
    const sections = [...project.sections];
    const [moved] = sections.splice(fromIndex, 1);
    sections.splice(toIndex, 0, moved);
    return sections;
  }

  validateTempo(tempo: number): boolean {
    return tempo >= 60 && tempo <= 200;
  }

  validateKey(key: string): boolean {
    const validKeys = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];
    return validKeys.includes(key);
  }
}