import { MidiPattern, MidiNote, PatternStyle, InstrumentType } from '../types';

interface DrumMap {
  [key: string]: number;
}

interface PatternTemplate {
  name: string;
  notes: Array<{
    pitch: number | string;
    start: number;
    duration: number;
    velocity: number;
    probability?: number;
  }>;
  length: number;
  genre: string;
  complexity: number;
}

export class PatternGenerator {
  private drumMaps: { [kit: string]: DrumMap } = {
    'kit_rock': {
      kick: 36,      // C1
      snare: 38,     // D1
      hihat: 42,     // F#1
      openhat: 46,   // A#1
      crash: 49,     // C#2
      ride: 51,      // D#2
      tom1: 47,      // B1
      tom2: 45,      // A1
      tom3: 43       // G1
    },
    'kit_electronic': {
      kick: 36,
      snare: 40,
      hihat: 44,
      openhat: 46,
      crash: 52,
      ride: 53,
      clap: 39,
      shaker: 82
    }
  };

  private patternTemplates: { [instrument: string]: PatternTemplate[] } = {
    drums: [
      {
        name: 'Basic Rock',
        notes: [
          { pitch: 'kick', start: 0, duration: 0.1, velocity: 100 },
          { pitch: 'hihat', start: 0, duration: 0.05, velocity: 70 },
          { pitch: 'hihat', start: 0.5, duration: 0.05, velocity: 60 },
          { pitch: 'snare', start: 1, duration: 0.1, velocity: 90 },
          { pitch: 'hihat', start: 1, duration: 0.05, velocity: 70 },
          { pitch: 'hihat', start: 1.5, duration: 0.05, velocity: 60 },
          { pitch: 'kick', start: 2, duration: 0.1, velocity: 100 },
          { pitch: 'hihat', start: 2, duration: 0.05, velocity: 70 },
          { pitch: 'hihat', start: 2.5, duration: 0.05, velocity: 60 },
          { pitch: 'snare', start: 3, duration: 0.1, velocity: 90 },
          { pitch: 'hihat', start: 3, duration: 0.05, velocity: 70 },
          { pitch: 'hihat', start: 3.5, duration: 0.05, velocity: 60 }
        ],
        length: 4,
        genre: 'rock',
        complexity: 0.3
      },
      {
        name: 'Pop Groove',
        notes: [
          { pitch: 'kick', start: 0, duration: 0.1, velocity: 95 },
          { pitch: 'hihat', start: 0.25, duration: 0.05, velocity: 65 },
          { pitch: 'hihat', start: 0.75, duration: 0.05, velocity: 55 },
          { pitch: 'snare', start: 1, duration: 0.1, velocity: 85 },
          { pitch: 'hihat', start: 1.25, duration: 0.05, velocity: 65 },
          { pitch: 'kick', start: 1.5, duration: 0.1, velocity: 95 },
          { pitch: 'hihat', start: 1.75, duration: 0.05, velocity: 55 },
          { pitch: 'kick', start: 2, duration: 0.1, velocity: 95 },
          { pitch: 'hihat', start: 2.25, duration: 0.05, velocity: 65 },
          { pitch: 'hihat', start: 2.75, duration: 0.05, velocity: 55 },
          { pitch: 'snare', start: 3, duration: 0.1, velocity: 85 },
          { pitch: 'hihat', start: 3.25, duration: 0.05, velocity: 65 },
          { pitch: 'hihat', start: 3.75, duration: 0.05, velocity: 55 }
        ],
        length: 4,
        genre: 'pop',
        complexity: 0.4
      },
      {
        name: 'Jazz Swing',
        notes: [
          { pitch: 'kick', start: 0, duration: 0.1, velocity: 80 },
          { pitch: 'ride', start: 0, duration: 0.1, velocity: 70 },
          { pitch: 'ride', start: 0.67, duration: 0.1, velocity: 60 },
          { pitch: 'snare', start: 1, duration: 0.1, velocity: 75 },
          { pitch: 'ride', start: 1.33, duration: 0.1, velocity: 65 },
          { pitch: 'kick', start: 2, duration: 0.1, velocity: 80 },
          { pitch: 'ride', start: 2, duration: 0.1, velocity: 70 },
          { pitch: 'ride', start: 2.67, duration: 0.1, velocity: 60 },
          { pitch: 'snare', start: 3, duration: 0.1, velocity: 75 },
          { pitch: 'ride', start: 3.33, duration: 0.1, velocity: 65 }
        ],
        length: 4,
        genre: 'jazz',
        complexity: 0.5
      }
    ],
    bass: [
      {
        name: 'Root-Fifth',
        notes: [
          { pitch: 'root', start: 0, duration: 0.4, velocity: 85 },
          { pitch: 'fifth', start: 1, duration: 0.4, velocity: 80 },
          { pitch: 'root', start: 2, duration: 0.4, velocity: 85 },
          { pitch: 'fifth', start: 3, duration: 0.4, velocity: 80 }
        ],
        length: 4,
        genre: 'rock',
        complexity: 0.2
      },
      {
        name: 'Walking Bass',
        notes: [
          { pitch: 'root', start: 0, duration: 0.9, velocity: 80 },
          { pitch: 'third', start: 1, duration: 0.9, velocity: 75 },
          { pitch: 'fifth', start: 2, duration: 0.9, velocity: 80 },
          { pitch: 'seventh', start: 3, duration: 0.9, velocity: 75 }
        ],
        length: 4,
        genre: 'jazz',
        complexity: 0.7
      },
      {
        name: 'Syncopated',
        notes: [
          { pitch: 'root', start: 0, duration: 0.4, velocity: 90 },
          { pitch: 'root', start: 0.75, duration: 0.2, velocity: 70 },
          { pitch: 'fifth', start: 1.5, duration: 0.4, velocity: 85 },
          { pitch: 'third', start: 2.25, duration: 0.2, velocity: 75 },
          { pitch: 'root', start: 3, duration: 0.4, velocity: 90 }
        ],
        length: 4,
        genre: 'funk',
        complexity: 0.6
      }
    ],
    piano: [
      {
        name: 'Block Chords',
        notes: [
          { pitch: 'chord', start: 0, duration: 3.8, velocity: 75 },
          { pitch: 'chord', start: 2, duration: 1.8, velocity: 70 }
        ],
        length: 4,
        genre: 'pop',
        complexity: 0.2
      },
      {
        name: 'Arpeggios',
        notes: [
          { pitch: 'root', start: 0, duration: 0.4, velocity: 70 },
          { pitch: 'third', start: 0.5, duration: 0.4, velocity: 65 },
          { pitch: 'fifth', start: 1, duration: 0.4, velocity: 70 },
          { pitch: 'octave', start: 1.5, duration: 0.4, velocity: 75 },
          { pitch: 'fifth', start: 2, duration: 0.4, velocity: 70 },
          { pitch: 'third', start: 2.5, duration: 0.4, velocity: 65 },
          { pitch: 'root', start: 3, duration: 0.4, velocity: 70 },
          { pitch: 'third', start: 3.5, duration: 0.4, velocity: 65 }
        ],
        length: 4,
        genre: 'classical',
        complexity: 0.5
      },
      {
        name: 'Comping',
        notes: [
          { pitch: 'chord_upper', start: 0.25, duration: 0.2, velocity: 65 },
          { pitch: 'chord_upper', start: 0.75, duration: 0.2, velocity: 60 },
          { pitch: 'chord_upper', start: 1.5, duration: 0.2, velocity: 70 },
          { pitch: 'chord_upper', start: 2.25, duration: 0.2, velocity: 65 },
          { pitch: 'chord_upper', start: 3, duration: 0.2, velocity: 60 },
          { pitch: 'chord_upper', start: 3.75, duration: 0.2, velocity: 65 }
        ],
        length: 4,
        genre: 'jazz',
        complexity: 0.6
      }
    ]
  };

  generatePattern(
    instrumentType: InstrumentType,
    style: PatternStyle,
    chords: string[] = ['C'],
    bars: number = 4
  ): MidiPattern {
    const templates = this.patternTemplates[instrumentType] || [];
    const matchingTemplates = templates.filter(t =>
      t.genre === style.genre &&
      Math.abs(t.complexity - style.complexity) < 0.3
    );

    const template = matchingTemplates.length > 0
      ? matchingTemplates[Math.floor(Math.random() * matchingTemplates.length)]
      : templates[0];

    if (!template) {
      return this.generateEmptyPattern(bars);
    }

    const notes: MidiNote[] = [];
    const beatsPerBar = 4;
    const totalBeats = bars * beatsPerBar;

    for (let bar = 0; bar < bars; bar++) {
      const barOffset = bar * beatsPerBar;
      const currentChord = chords[bar % chords.length];

      for (const templateNote of template.notes) {
        if (templateNote.probability && Math.random() > templateNote.probability) {
          continue;
        }

        const pitch = this.resolvePitch(
          templateNote.pitch,
          currentChord,
          instrumentType,
          style
        );

        if (pitch !== null) {
          const note: MidiNote = {
            pitch,
            start: barOffset + templateNote.start,
            duration: templateNote.duration,
            velocity: this.applyHumanization(templateNote.velocity, style.humanization)
          };

          if (note.start < totalBeats) {
            notes.push(note);
          }
        }
      }
    }

    return {
      id: this.generateId(),
      name: `${template.name} - ${style.genre}`,
      notes: this.applySwing(notes, style.swing),
      length: totalBeats,
      velocity: 80
    };
  }

  private resolvePitch(
    pitchTemplate: number | string,
    chord: string,
    instrumentType: InstrumentType,
    style: PatternStyle
  ): number | null {
    if (typeof pitchTemplate === 'number') {
      return pitchTemplate;
    }

    const chordNotes = this.parseChord(chord);
    const baseOctave = this.getBaseOctave(instrumentType);

    switch (pitchTemplate) {
      case 'root':
        return this.noteToMidi(chordNotes[0], baseOctave);
      case 'third':
        return this.noteToMidi(chordNotes[1] || chordNotes[0], baseOctave);
      case 'fifth':
        return this.noteToMidi(chordNotes[2] || chordNotes[0], baseOctave);
      case 'seventh':
        return this.noteToMidi(chordNotes[3] || chordNotes[0], baseOctave);
      case 'octave':
        return this.noteToMidi(chordNotes[0], baseOctave + 1);
      case 'chord':
        return this.noteToMidi(chordNotes[0], baseOctave);
      case 'chord_upper':
        return this.noteToMidi(chordNotes[1] || chordNotes[0], baseOctave + 1);

      // Drum mapping
      case 'kick':
      case 'snare':
      case 'hihat':
      case 'openhat':
      case 'crash':
      case 'ride':
      case 'tom1':
      case 'tom2':
      case 'tom3':
      case 'clap':
      case 'shaker':
        const drumKit = instrumentType === 'drums' ? 'kit_rock' : 'kit_rock';
        return this.drumMaps[drumKit][pitchTemplate] || 36;

      default:
        return null;
    }
  }

  private parseChord(chord: string): string[] {
    const noteMap = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const match = chord.match(/^([A-G][#b]?)/);

    if (!match) return ['C', 'E', 'G'];

    const root = match[1];
    const rootIndex = noteMap.indexOf(root.replace('b', '#'));

    if (rootIndex === -1) return ['C', 'E', 'G'];

    if (chord.includes('m') && !chord.includes('maj')) {
      return [
        noteMap[rootIndex],
        noteMap[(rootIndex + 3) % 12],
        noteMap[(rootIndex + 7) % 12]
      ];
    }

    return [
      noteMap[rootIndex],
      noteMap[(rootIndex + 4) % 12],
      noteMap[(rootIndex + 7) % 12]
    ];
  }

  private noteToMidi(note: string, octave: number): number {
    const noteMap: { [key: string]: number } = {
      'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
      'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
    };

    const noteNumber = noteMap[note] || 0;
    return (octave + 1) * 12 + noteNumber;
  }

  private getBaseOctave(instrumentType: InstrumentType): number {
    const octaveMap: { [key in InstrumentType]: number } = {
      'drums': 1,
      'bass': 2,
      'piano': 4,
      'guitar': 3,
      'strings': 4,
      'brass': 4,
      'woodwinds': 4,
      'synth': 4
    };

    return octaveMap[instrumentType] || 4;
  }

  private applyHumanization(velocity: number, humanization: number): number {
    const variation = humanization * 20;
    const randomOffset = (Math.random() - 0.5) * variation;
    return Math.max(1, Math.min(127, Math.round(velocity + randomOffset)));
  }

  private applySwing(notes: MidiNote[], swingAmount: number): MidiNote[] {
    if (swingAmount === 0) return notes;

    return notes.map(note => {
      const beatPosition = note.start % 1;

      if (beatPosition >= 0.4 && beatPosition <= 0.6) {
        const swingOffset = swingAmount * 0.1;
        return {
          ...note,
          start: note.start + swingOffset
        };
      }

      return note;
    });
  }

  private generateEmptyPattern(bars: number): MidiPattern {
    return {
      id: this.generateId(),
      name: 'Empty Pattern',
      notes: [],
      length: bars * 4,
      velocity: 80
    };
  }

  generateFill(
    instrumentType: InstrumentType,
    style: PatternStyle,
    bars: number = 1
  ): MidiPattern {
    const fillTemplates: { [key: string]: PatternTemplate[] } = {
      drums: [
        {
          name: 'Tom Fill',
          notes: [
            { pitch: 'tom1', start: 0, duration: 0.2, velocity: 90 },
            { pitch: 'tom1', start: 0.5, duration: 0.2, velocity: 85 },
            { pitch: 'tom2', start: 1, duration: 0.2, velocity: 90 },
            { pitch: 'tom3', start: 1.5, duration: 0.2, velocity: 85 },
            { pitch: 'snare', start: 2, duration: 0.2, velocity: 100 },
            { pitch: 'crash', start: 3, duration: 0.5, velocity: 95 }
          ],
          length: 4,
          genre: 'rock',
          complexity: 0.8
        }
      ]
    };

    const templates = fillTemplates[instrumentType] || [];
    const template = templates[0];

    if (!template) {
      return this.generateEmptyPattern(bars);
    }

    const notes: MidiNote[] = template.notes.map(templateNote => ({
      pitch: this.resolvePitch(templateNote.pitch, 'C', instrumentType, style) || 36,
      start: templateNote.start,
      duration: templateNote.duration,
      velocity: this.applyHumanization(templateNote.velocity, style.humanization)
    }));

    return {
      id: this.generateId(),
      name: `${template.name} Fill`,
      notes,
      length: bars * 4,
      velocity: 90
    };
  }

  getAvailablePatterns(instrumentType: InstrumentType): string[] {
    const templates = this.patternTemplates[instrumentType] || [];
    return templates.map(t => t.name);
  }

  getAvailableGenres(): string[] {
    const genres = new Set<string>();

    Object.values(this.patternTemplates).forEach(templates => {
      templates.forEach(template => {
        genres.add(template.genre);
      });
    });

    return Array.from(genres);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  quantizePattern(pattern: MidiPattern, quantization: number = 0.25): MidiPattern {
    const quantizedNotes = pattern.notes.map(note => ({
      ...note,
      start: Math.round(note.start / quantization) * quantization
    }));

    return {
      ...pattern,
      notes: quantizedNotes
    };
  }

  scalePatternVelocity(pattern: MidiPattern, scale: number): MidiPattern {
    const scaledNotes = pattern.notes.map(note => ({
      ...note,
      velocity: Math.max(1, Math.min(127, Math.round(note.velocity * scale)))
    }));

    return {
      ...pattern,
      notes: scaledNotes
    };
  }

  transposePattern(pattern: MidiPattern, semitones: number): MidiPattern {
    const transposedNotes = pattern.notes.map(note => ({
      ...note,
      pitch: Math.max(0, Math.min(127, note.pitch + semitones))
    }));

    return {
      ...pattern,
      notes: transposedNotes
    };
  }
}