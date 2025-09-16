import { ChordData, ScaleData } from '../types';

interface ChordDatabase {
  [key: string]: {
    intervals: number[];
    notes: (root: string) => string[];
    symbol: string;
  };
}

interface ScaleDatabase {
  [key: string]: {
    intervals: number[];
    modes: string[];
  };
}

interface ProgressionDatabase {
  [genre: string]: {
    [name: string]: string[];
  };
}

export class MusicTheoryEngine {
  private notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  private enharmonicMap: { [key: string]: string } = {
    'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
  };

  private chordDatabase: ChordDatabase = {
    'major': { intervals: [0, 4, 7], symbol: '', notes: (root) => this.buildChord(root, [0, 4, 7]) },
    'minor': { intervals: [0, 3, 7], symbol: 'm', notes: (root) => this.buildChord(root, [0, 3, 7]) },
    'major7': { intervals: [0, 4, 7, 11], symbol: 'maj7', notes: (root) => this.buildChord(root, [0, 4, 7, 11]) },
    'minor7': { intervals: [0, 3, 7, 10], symbol: 'm7', notes: (root) => this.buildChord(root, [0, 3, 7, 10]) },
    'dominant7': { intervals: [0, 4, 7, 10], symbol: '7', notes: (root) => this.buildChord(root, [0, 4, 7, 10]) },
    'diminished': { intervals: [0, 3, 6], symbol: 'dim', notes: (root) => this.buildChord(root, [0, 3, 6]) },
    'augmented': { intervals: [0, 4, 8], symbol: 'aug', notes: (root) => this.buildChord(root, [0, 4, 8]) },
    'sus2': { intervals: [0, 2, 7], symbol: 'sus2', notes: (root) => this.buildChord(root, [0, 2, 7]) },
    'sus4': { intervals: [0, 5, 7], symbol: 'sus4', notes: (root) => this.buildChord(root, [0, 5, 7]) },
    'add9': { intervals: [0, 4, 7, 14], symbol: 'add9', notes: (root) => this.buildChord(root, [0, 4, 7, 14]) },
    'minor6': { intervals: [0, 3, 7, 9], symbol: 'm6', notes: (root) => this.buildChord(root, [0, 3, 7, 9]) },
    'major6': { intervals: [0, 4, 7, 9], symbol: '6', notes: (root) => this.buildChord(root, [0, 4, 7, 9]) }
  };

  private scaleDatabase: ScaleDatabase = {
    'major': { intervals: [0, 2, 4, 5, 7, 9, 11], modes: ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'] },
    'natural_minor': { intervals: [0, 2, 3, 5, 7, 8, 10], modes: ['Aeolian'] },
    'harmonic_minor': { intervals: [0, 2, 3, 5, 7, 8, 11], modes: ['Harmonic Minor'] },
    'melodic_minor': { intervals: [0, 2, 3, 5, 7, 9, 11], modes: ['Melodic Minor'] },
    'pentatonic_major': { intervals: [0, 2, 4, 7, 9], modes: ['Pentatonic Major'] },
    'pentatonic_minor': { intervals: [0, 3, 5, 7, 10], modes: ['Pentatonic Minor'] },
    'blues': { intervals: [0, 3, 5, 6, 7, 10], modes: ['Blues'] },
    'dorian': { intervals: [0, 2, 3, 5, 7, 9, 10], modes: ['Dorian'] },
    'mixolydian': { intervals: [0, 2, 4, 5, 7, 9, 10], modes: ['Mixolydian'] }
  };

  private progressionDatabase: ProgressionDatabase = {
    'pop': {
      'vi-IV-I-V': ['vi', 'IV', 'I', 'V'],
      'I-V-vi-IV': ['I', 'V', 'vi', 'IV'],
      'I-vi-IV-V': ['I', 'vi', 'IV', 'V'],
      'I-IV-vi-V': ['I', 'IV', 'vi', 'V'],
      'vi-V-IV-V': ['vi', 'V', 'IV', 'V']
    },
    'jazz': {
      'ii-V-I': ['ii7', 'V7', 'Imaj7'],
      'iii-vi-ii-V': ['iii7', 'vi7', 'ii7', 'V7'],
      'I-vi-ii-V': ['Imaj7', 'vi7', 'ii7', 'V7'],
      'circle_of_fifths': ['Imaj7', 'VI7', 'ii7', 'V7']
    },
    'rock': {
      'I-VII-IV': ['I', 'VII', 'IV'],
      'i-VII-VI': ['i', 'VII', 'VI'],
      'I-V-IV': ['I', 'V', 'IV'],
      'vi-IV-I-V': ['vi', 'IV', 'I', 'V']
    },
    'folk': {
      'I-IV-V-I': ['I', 'IV', 'V', 'I'],
      'I-V-vi-IV': ['I', 'V', 'vi', 'IV'],
      'vi-IV-V-vi': ['vi', 'IV', 'V', 'vi']
    }
  };

  parseChord(chordSymbol: string): ChordData | null {
    const normalizedSymbol = this.normalizeNote(chordSymbol);

    const match = normalizedSymbol.match(/^([A-G][#b]?)(.*)$/);
    if (!match) return null;

    const [, root, quality] = match;
    const normalizedRoot = this.normalizeNote(root);

    let chordType = 'major';
    let extension = '';
    let bass = '';

    const bassMatch = quality.match(/\/([A-G][#b]?)/);
    if (bassMatch) {
      bass = this.normalizeNote(bassMatch[1]);
    }

    const cleanQuality = quality.replace(/\/[A-G][#b]?/, '');

    if (cleanQuality === '' || cleanQuality === 'maj') {
      chordType = 'major';
    } else if (cleanQuality === 'm' || cleanQuality === 'min') {
      chordType = 'minor';
    } else if (cleanQuality === 'maj7' || cleanQuality === 'M7') {
      chordType = 'major7';
    } else if (cleanQuality === 'm7' || cleanQuality === 'min7') {
      chordType = 'minor7';
    } else if (cleanQuality === '7' || cleanQuality === 'dom7') {
      chordType = 'dominant7';
    } else if (cleanQuality === 'dim' || cleanQuality === '°') {
      chordType = 'diminished';
    } else if (cleanQuality === 'aug' || cleanQuality === '+') {
      chordType = 'augmented';
    } else if (cleanQuality === 'sus2') {
      chordType = 'sus2';
    } else if (cleanQuality === 'sus4' || cleanQuality === 'sus') {
      chordType = 'sus4';
    } else if (cleanQuality === 'add9') {
      chordType = 'add9';
    } else if (cleanQuality === 'm6') {
      chordType = 'minor6';
    } else if (cleanQuality === '6') {
      chordType = 'major6';
    } else {
      chordType = 'major';
    }

    const chordData = this.chordDatabase[chordType];
    if (!chordData) return null;

    return {
      root: normalizedRoot,
      quality: chordType,
      extension,
      bass,
      notes: chordData.notes(normalizedRoot),
      intervals: chordData.intervals
    };
  }

  getScale(root: string, scaleType: string = 'major'): ScaleData | null {
    const normalizedRoot = this.normalizeNote(root);
    const scale = this.scaleDatabase[scaleType];

    if (!scale) return null;

    const notes = this.buildScale(normalizedRoot, scale.intervals);

    return {
      name: `${normalizedRoot} ${scaleType}`,
      notes,
      intervals: scale.intervals,
      modes: scale.modes
    };
  }

  getChordProgressions(key: string, genre: string = 'pop'): { [name: string]: string[] } {
    const progressions = this.progressionDatabase[genre];
    if (!progressions) return {};

    const result: { [name: string]: string[] } = {};

    for (const [name, romanNumerals] of Object.entries(progressions)) {
      result[name] = romanNumerals.map(numeral => this.romanToChord(numeral, key));
    }

    return result;
  }

  romanToChord(romanNumeral: string, key: string): string {
    const normalizedKey = this.normalizeNote(key);
    const scale = this.getScale(normalizedKey, 'major');
    if (!scale) return 'C';

    const romanMap: { [key: string]: number } = {
      'I': 0, 'ii': 1, 'iii': 2, 'IV': 3, 'V': 4, 'vi': 5, 'vii': 6,
      'i': 0, 'II': 1, 'III': 2, 'iv': 3, 'v': 4, 'VI': 5, 'VII': 6
    };

    let baseRoman = romanNumeral.replace(/[^IViv]/g, '');
    const modifiers = romanNumeral.replace(/[IViv]/g, '');

    const degree = romanMap[baseRoman];
    if (degree === undefined) return 'C';

    const root = scale.notes[degree];

    let chordSymbol = root;

    if (baseRoman === baseRoman.toLowerCase() && !modifiers.includes('maj')) {
      chordSymbol += 'm';
    }

    if (modifiers.includes('7')) {
      if (baseRoman === baseRoman.toUpperCase()) {
        chordSymbol += '7';
      } else {
        chordSymbol += '7';
      }
    }

    if (modifiers.includes('maj7')) {
      chordSymbol = chordSymbol.replace('7', 'maj7');
    }

    return chordSymbol;
  }

  chordToRoman(chordSymbol: string, key: string): string {
    const chord = this.parseChord(chordSymbol);
    const scale = this.getScale(key, 'major');

    if (!chord || !scale) return 'I';

    const degreeIndex = scale.notes.indexOf(chord.root);
    if (degreeIndex === -1) return 'I';

    const romanNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii'];
    let roman = romanNumerals[degreeIndex];

    if (chord.quality.includes('minor') || chord.quality === 'minor') {
      roman = roman.toLowerCase();
    }

    if (chord.quality.includes('7')) {
      roman += '7';
    }

    if (chord.quality === 'diminished') {
      roman = roman.toLowerCase() + '°';
    }

    return roman;
  }

  suggestSubstitutions(chordSymbol: string, key: string): string[] {
    const chord = this.parseChord(chordSymbol);
    if (!chord) return [];

    const suggestions: string[] = [];

    if (chord.quality === 'major') {
      suggestions.push(`${chord.root}maj7`);
      suggestions.push(`${chord.root}6`);
      suggestions.push(`${chord.root}add9`);

      const relativeMinorIndex = (this.notes.indexOf(chord.root) + 9) % 12;
      const relativeMinor = this.notes[relativeMinorIndex];
      suggestions.push(`${relativeMinor}m`);
    }

    if (chord.quality === 'minor') {
      suggestions.push(`${chord.root}m7`);
      suggestions.push(`${chord.root}m6`);

      const relativeMajorIndex = (this.notes.indexOf(chord.root) + 3) % 12;
      const relativeMajor = this.notes[relativeMajorIndex];
      suggestions.push(relativeMajor);
    }

    if (chord.quality === 'major' && chordSymbol === key) {
      const subDominant = this.notes[(this.notes.indexOf(chord.root) + 5) % 12];
      suggestions.push(subDominant);
    }

    return suggestions.slice(0, 3);
  }

  analyzeProgression(chords: string[], key: string): {
    romanNumerals: string[];
    functions: string[];
    suggestions: string[];
  } {
    const romanNumerals = chords.map(chord => this.chordToRoman(chord, key));
    const functions = romanNumerals.map(roman => this.getFunctionFromRoman(roman));

    const suggestions: string[] = [];

    if (chords.length > 0) {
      const lastChord = chords[chords.length - 1];
      const lastRoman = romanNumerals[romanNumerals.length - 1];

      if (lastRoman === 'V' || lastRoman === 'V7') {
        suggestions.push('Try resolving to I for a strong cadence');
      }

      if (lastRoman === 'IV') {
        suggestions.push('Follow with V-I for a plagal cadence');
      }

      if (lastRoman === 'vi') {
        suggestions.push('Try deceptive resolution to vi instead of I');
      }
    }

    return {
      romanNumerals,
      functions,
      suggestions
    };
  }

  private normalizeNote(note: string): string {
    const cleaned = note.replace(/[^A-Ga-g#b]/g, '').charAt(0).toUpperCase() + note.slice(1).replace(/[^#b]/g, '');
    return this.enharmonicMap[cleaned] || cleaned;
  }

  private buildChord(root: string, intervals: number[]): string[] {
    const rootIndex = this.notes.indexOf(this.normalizeNote(root));
    if (rootIndex === -1) return [];

    return intervals.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return this.notes[noteIndex];
    });
  }

  private buildScale(root: string, intervals: number[]): string[] {
    const rootIndex = this.notes.indexOf(this.normalizeNote(root));
    if (rootIndex === -1) return [];

    return intervals.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return this.notes[noteIndex];
    });
  }

  private getFunctionFromRoman(roman: string): string {
    const functions: { [key: string]: string } = {
      'I': 'Tonic', 'i': 'Tonic',
      'ii': 'Predominant', 'ii7': 'Predominant',
      'iii': 'Tonic', 'iii7': 'Tonic',
      'IV': 'Predominant', 'iv': 'Predominant',
      'V': 'Dominant', 'V7': 'Dominant',
      'vi': 'Tonic', 'VI': 'Dominant',
      'vii': 'Dominant', 'VII': 'Dominant'
    };

    return functions[roman] || 'Unknown';
  }

  getAvailableGenres(): string[] {
    return Object.keys(this.progressionDatabase);
  }

  getAvailableScales(): string[] {
    return Object.keys(this.scaleDatabase);
  }

  getAvailableChords(): string[] {
    return Object.keys(this.chordDatabase);
  }
}