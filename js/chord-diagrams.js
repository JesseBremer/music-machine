// chord-diagrams.js - Visual chord diagram generators for guitar, piano, and bass

// Guitar chord fingerings database
const guitarChords = {
    // Major chords
    'C': { name: 'C Major', frets: [null, 3, 2, 0, 1, 0], fingers: [null, 3, 2, null, 1, null] },
    'D': { name: 'D Major', frets: [null, null, 0, 2, 3, 2], fingers: [null, null, null, 1, 3, 2] },
    'E': { name: 'E Major', frets: [0, 2, 2, 1, 0, 0], fingers: [null, 2, 3, 1, null, null] },
    'F': { name: 'F Major', frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1] },
    'G': { name: 'G Major', frets: [3, 2, 0, 0, 3, 3], fingers: [3, 1, null, null, 4, 4] },
    'A': { name: 'A Major', frets: [null, 0, 2, 2, 2, 0], fingers: [null, null, 1, 2, 3, null] },
    'B': { name: 'B Major', frets: [null, 2, 4, 4, 4, 2], fingers: [null, 1, 3, 4, 4, 2] },

    // Sharp/Flat major chords
    'C#': { name: 'C# Major', frets: [null, null, 3, 1, 2, 1], fingers: [null, null, 4, 1, 3, 2] },
    'Db': { name: 'Db Major', frets: [null, null, 3, 1, 2, 1], fingers: [null, null, 4, 1, 3, 2] },
    'D#': { name: 'D# Major', frets: [null, null, 5, 3, 4, 3], fingers: [null, null, 3, 1, 4, 2] },
    'Eb': { name: 'Eb Major', frets: [null, null, 5, 3, 4, 3], fingers: [null, null, 3, 1, 4, 2] },
    'F#': { name: 'F# Major', frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1] },
    'Gb': { name: 'Gb Major', frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1] },
    'G#': { name: 'G# Major', frets: [4, 6, 6, 5, 4, 4], fingers: [1, 3, 4, 2, 1, 1] },
    'Ab': { name: 'Ab Major', frets: [4, 6, 6, 5, 4, 4], fingers: [1, 3, 4, 2, 1, 1] },
    'A#': { name: 'A# Major', frets: [null, 1, 3, 3, 3, 1], fingers: [null, 1, 3, 4, 4, 2] },
    'Bb': { name: 'Bb Major', frets: [null, 1, 3, 3, 3, 1], fingers: [null, 1, 3, 4, 4, 2] },

    // Minor chords
    'Am': { name: 'A Minor', frets: [null, 0, 2, 2, 1, 0], fingers: [null, null, 2, 3, 1, null] },
    'Bm': { name: 'B Minor', frets: [null, 2, 4, 4, 3, 2], fingers: [null, 1, 3, 4, 2, 1] },
    'Cm': { name: 'C Minor', frets: [null, 3, 5, 5, 4, 3], fingers: [null, 1, 3, 4, 2, 1] },
    'Dm': { name: 'D Minor', frets: [null, null, 0, 2, 3, 1], fingers: [null, null, null, 2, 3, 1] },
    'Em': { name: 'E Minor', frets: [0, 2, 2, 0, 0, 0], fingers: [null, 2, 3, null, null, null] },
    'Fm': { name: 'F Minor', frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1] },
    'Gm': { name: 'G Minor', frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1] },

    // Sharp/Flat minor chords
    'C#m': { name: 'C# Minor', frets: [null, null, 2, 1, 2, 0], fingers: [null, null, 3, 1, 4, null] },
    'D#m': { name: 'D# Minor', frets: [null, null, 4, 3, 4, 2], fingers: [null, null, 3, 1, 4, 2] },
    'F#m': { name: 'F# Minor', frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1] },
    'G#m': { name: 'G# Minor', frets: [4, 6, 6, 4, 4, 4], fingers: [1, 3, 4, 1, 1, 1] },
    'A#m': { name: 'A# Minor', frets: [null, 1, 3, 3, 2, 1], fingers: [null, 1, 4, 4, 2, 1] },
    'Bbm': { name: 'Bb Minor', frets: [null, 1, 3, 3, 2, 1], fingers: [null, 1, 4, 4, 2, 1] },

    // Dominant 7th chords
    'C7': { name: 'C Dominant 7th', frets: [null, 3, 2, 3, 1, 0], fingers: [null, 3, 2, 4, 1, null] },
    'C#7': { name: 'C# Dominant 7th', frets: [null, null, 3, 4, 2, 4], fingers: [null, null, 2, 4, 1, 3] },
    'Db7': { name: 'Db Dominant 7th', frets: [null, null, 3, 4, 2, 4], fingers: [null, null, 2, 4, 1, 3] },
    'D7': { name: 'D Dominant 7th', frets: [null, null, 0, 2, 1, 2], fingers: [null, null, null, 2, 1, 3] },
    'D#7': { name: 'D# Dominant 7th', frets: [null, null, 1, 3, 2, 3], fingers: [null, null, 1, 4, 2, 3] },
    'Eb7': { name: 'Eb Dominant 7th', frets: [null, null, 1, 3, 2, 3], fingers: [null, null, 1, 4, 2, 3] },
    'E7': { name: 'E Dominant 7th', frets: [0, 2, 0, 1, 0, 0], fingers: [null, 2, null, 1, null, null] },
    'F7': { name: 'F Dominant 7th', frets: [1, 3, 1, 2, 1, 1], fingers: [1, 3, 1, 2, 1, 1] },
    'F#7': { name: 'F# Dominant 7th', frets: [2, 4, 2, 3, 2, 2], fingers: [1, 3, 1, 2, 1, 1] },
    'Gb7': { name: 'Gb Dominant 7th', frets: [2, 4, 2, 3, 2, 2], fingers: [1, 3, 1, 2, 1, 1] },
    'G7': { name: 'G Dominant 7th', frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, null, null, null, 1] },
    'G#7': { name: 'G# Dominant 7th', frets: [4, 6, 4, 5, 4, 4], fingers: [1, 3, 1, 2, 1, 1] },
    'Ab7': { name: 'Ab Dominant 7th', frets: [4, 6, 4, 5, 4, 4], fingers: [1, 3, 1, 2, 1, 1] },
    'A7': { name: 'A Dominant 7th', frets: [null, 0, 2, 0, 2, 0], fingers: [null, null, 2, null, 3, null] },
    'A#7': { name: 'A# Dominant 7th', frets: [null, 1, 3, 1, 3, 1], fingers: [null, 1, 3, 1, 4, 1] },
    'Bb7': { name: 'Bb Dominant 7th', frets: [null, 1, 3, 1, 3, 1], fingers: [null, 1, 3, 1, 4, 1] },
    'B7': { name: 'B Dominant 7th', frets: [null, 2, 1, 2, 0, 2], fingers: [null, 2, 1, 3, null, 4] },

    // Major 7th chords
    'Cmaj7': { name: 'C Major 7th', frets: [null, 3, 2, 0, 0, 0], fingers: [null, 3, 2, null, null, null] },
    'Dmaj7': { name: 'D Major 7th', frets: [null, null, 0, 2, 2, 2], fingers: [null, null, null, 1, 2, 3] },
    'Emaj7': { name: 'E Major 7th', frets: [0, 2, 1, 1, 0, 0], fingers: [null, 2, 1, 1, null, null] },
    'Fmaj7': { name: 'F Major 7th', frets: [1, 3, 3, 2, 1, 0], fingers: [1, 3, 4, 2, 1, null] },
    'Gmaj7': { name: 'G Major 7th', frets: [3, 2, 0, 0, 0, 2], fingers: [3, 2, null, null, null, 4] },
    'Amaj7': { name: 'A Major 7th', frets: [null, 0, 2, 1, 2, 0], fingers: [null, null, 2, 1, 3, null] },
    'Bmaj7': { name: 'B Major 7th', frets: [null, 2, 4, 3, 4, 2], fingers: [null, 1, 3, 2, 4, 1] },

    // Minor 7th chords
    'Am7': { name: 'A Minor 7th', frets: [null, 0, 2, 0, 1, 0], fingers: [null, null, 2, null, 1, null] },
    'Bm7': { name: 'B Minor 7th', frets: [null, 2, 0, 2, 0, 2], fingers: [null, 2, null, 3, null, 4] },
    'Cm7': { name: 'C Minor 7th', frets: [null, 3, 1, 3, 1, 1], fingers: [null, 3, 1, 4, 1, 1] },
    'Dm7': { name: 'D Minor 7th', frets: [null, null, 0, 2, 1, 1], fingers: [null, null, null, 2, 1, 1] },
    'Em7': { name: 'E Minor 7th', frets: [0, 2, 0, 0, 0, 0], fingers: [null, 2, null, null, null, null] },
    'Fm7': { name: 'F Minor 7th', frets: [1, 3, 1, 1, 1, 1], fingers: [1, 3, 1, 1, 1, 1] },
    'Gm7': { name: 'G Minor 7th', frets: [3, 5, 3, 3, 3, 3], fingers: [1, 3, 1, 1, 1, 1] },

    // Suspended chords
    'Csus2': { name: 'C Suspended 2nd', frets: [null, 3, 0, 0, 1, 0], fingers: [null, 3, null, null, 1, null] },
    'Csus4': { name: 'C Suspended 4th', frets: [null, 3, 3, 0, 1, 1], fingers: [null, 2, 3, null, 1, 1] },
    'Dsus2': { name: 'D Suspended 2nd', frets: [null, null, 0, 2, 3, 0], fingers: [null, null, null, 1, 2, null] },
    'Dsus4': { name: 'D Suspended 4th', frets: [null, null, 0, 2, 3, 3], fingers: [null, null, null, 1, 2, 3] },
    'Esus2': { name: 'E Suspended 2nd', frets: [0, 2, 2, 4, 0, 0], fingers: [null, 1, 2, 4, null, null] },
    'Esus4': { name: 'E Suspended 4th', frets: [0, 2, 2, 2, 0, 0], fingers: [null, 1, 2, 3, null, null] },
    'Fsus2': { name: 'F Suspended 2nd', frets: [1, 3, 3, 0, 1, 1], fingers: [1, 3, 4, null, 1, 1] },
    'Fsus4': { name: 'F Suspended 4th', frets: [1, 3, 3, 3, 1, 1], fingers: [1, 2, 3, 4, 1, 1] },
    'Gsus2': { name: 'G Suspended 2nd', frets: [3, 0, 0, 0, 3, 3], fingers: [2, null, null, null, 3, 4] },
    'Gsus4': { name: 'G Suspended 4th', frets: [3, 3, 0, 0, 1, 3], fingers: [3, 4, null, null, 1, 4] },
    'Asus2': { name: 'A Suspended 2nd', frets: [null, 0, 2, 2, 0, 0], fingers: [null, null, 1, 2, null, null] },
    'Asus4': { name: 'A Suspended 4th', frets: [null, 0, 2, 2, 3, 0], fingers: [null, null, 1, 2, 3, null] },
    'Bsus2': { name: 'B Suspended 2nd', frets: [null, 2, 4, 4, 2, 2], fingers: [null, 1, 3, 4, 1, 1] },
    'Bsus4': { name: 'B Suspended 4th', frets: [null, 2, 4, 4, 5, 2], fingers: [null, 1, 2, 3, 4, 1] },

    // 6th chords
    'C6': { name: 'C Major 6th', frets: [null, 3, 2, 2, 1, 0], fingers: [null, 3, 2, 2, 1, null] },
    'D6': { name: 'D Major 6th', frets: [null, null, 0, 2, 0, 2], fingers: [null, null, null, 2, null, 3] },
    'E6': { name: 'E Major 6th', frets: [0, 2, 2, 1, 2, 0], fingers: [null, 2, 3, 1, 4, null] },
    'F6': { name: 'F Major 6th', frets: [1, 3, 3, 2, 3, 1], fingers: [1, 2, 3, 1, 4, 1] },
    'G6': { name: 'G Major 6th', frets: [3, 2, 0, 0, 0, 0], fingers: [3, 2, null, null, null, null] },
    'A6': { name: 'A Major 6th', frets: [null, 0, 2, 2, 2, 2], fingers: [null, null, 1, 2, 3, 4] },

    // Minor 6th chords
    'Am6': { name: 'A Minor 6th', frets: [null, 0, 2, 2, 1, 2], fingers: [null, null, 2, 3, 1, 4] },
    'Dm6': { name: 'D Minor 6th', frets: [null, null, 0, 2, 0, 1], fingers: [null, null, null, 2, null, 1] },
    'Em6': { name: 'E Minor 6th', frets: [0, 2, 2, 0, 2, 0], fingers: [null, 1, 2, null, 3, null] },

    // Augmented and Diminished
    'Caug': { name: 'C Augmented', frets: [null, 3, 2, 1, 1, 0], fingers: [null, 4, 3, 1, 2, null] },
    'Co': { name: 'C Diminished', frets: [null, 3, 1, 2, 1, 2], fingers: [null, 4, 1, 3, 2, 4] },
    'Co7': { name: 'C Diminished 7th', frets: [null, 3, 1, 2, 1, 2], fingers: [null, 4, 1, 3, 2, 4] },

    // 9th chords
    'C9': { name: 'C Dominant 9th', frets: [null, 3, 2, 3, 3, 0], fingers: [null, 2, 1, 3, 4, null] },
    'D9': { name: 'D Dominant 9th', frets: [null, null, 0, 2, 1, 0], fingers: [null, null, null, 3, 2, null] },
    'E9': { name: 'E Dominant 9th', frets: [0, 2, 0, 1, 0, 2], fingers: [null, 2, null, 1, null, 3] },
    'G9': { name: 'G Dominant 9th', frets: [3, 2, 0, 2, 0, 1], fingers: [4, 2, null, 3, null, 1] },
    'A9': { name: 'A Dominant 9th', frets: [null, 0, 2, 4, 2, 3], fingers: [null, null, 1, 3, 2, 4] },

    // Major 9th chords
    'Cmaj9': { name: 'C Major 9th', frets: [null, 3, 2, 4, 3, 0], fingers: [null, 2, 1, 4, 3, null] },
    'Dmaj9': { name: 'D Major 9th', frets: [null, null, 0, 2, 2, 0], fingers: [null, null, null, 2, 3, null] },
    'Emaj9': { name: 'E Major 9th', frets: [0, 2, 1, 1, 0, 2], fingers: [null, 3, 1, 2, null, 4] },
    'Gmaj9': { name: 'G Major 9th', frets: [3, 2, 0, 2, 0, 2], fingers: [3, 2, null, 4, null, 4] },
    'Amaj9': { name: 'A Major 9th', frets: [null, 0, 2, 1, 0, 2], fingers: [null, null, 3, 1, null, 4] },

    // Add9 chords
    'Cadd9': { name: 'C Add 9th', frets: [null, 3, 2, 0, 3, 0], fingers: [null, 2, 1, null, 3, null] },
    'Dadd9': { name: 'D Add 9th', frets: [null, null, 0, 2, 3, 0], fingers: [null, null, null, 1, 2, null] },
    'Eadd9': { name: 'E Add 9th', frets: [0, 2, 2, 1, 0, 2], fingers: [null, 2, 3, 1, null, 4] },
    'Fadd9': { name: 'F Add 9th', frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1] },
    'Gadd9': { name: 'G Add 9th', frets: [3, 2, 0, 2, 0, 3], fingers: [2, 1, null, 3, null, 4] },
    'Aadd9': { name: 'A Add 9th', frets: [null, 0, 2, 4, 2, 0], fingers: [null, null, 1, 3, 2, null] },

    // Minor add9 chords
    'Amadd9': { name: 'A Minor Add 9th', frets: [null, 0, 2, 4, 1, 0], fingers: [null, null, 2, 4, 1, null] },
    'Dmadd9': { name: 'D Minor Add 9th', frets: [null, null, 0, 2, 1, 0], fingers: [null, null, null, 3, 1, null] },
    'Emadd9': { name: 'E Minor Add 9th', frets: [0, 2, 2, 0, 0, 2], fingers: [null, 1, 2, null, null, 3] },

    // Minor 9th chords
    'Am9': { name: 'A Minor 9th', frets: [null, 0, 2, 4, 1, 3], fingers: [null, null, 1, 3, 1, 4] },
    'Dm9': { name: 'D Minor 9th', frets: [null, null, 0, 2, 1, 0], fingers: [null, null, null, 3, 2, null] },
    'Em9': { name: 'E Minor 9th', frets: [0, 2, 0, 0, 0, 2], fingers: [null, 2, null, null, null, 3] },

    // 7sus4 chords
    'C7sus4': { name: 'C 7sus4', frets: [null, 3, 3, 3, 1, 1], fingers: [null, 2, 3, 4, 1, 1] },
    'D7sus4': { name: 'D 7sus4', frets: [null, null, 0, 2, 1, 3], fingers: [null, null, null, 2, 1, 3] },
    'E7sus4': { name: 'E 7sus4', frets: [0, 2, 0, 2, 0, 0], fingers: [null, 2, null, 3, null, null] },
    'G7sus4': { name: 'G 7sus4', frets: [3, 3, 0, 0, 1, 1], fingers: [3, 4, null, null, 1, 2] },
    'A7sus4': { name: 'A 7sus4', frets: [null, 0, 2, 0, 3, 0], fingers: [null, null, 2, null, 3, null] },

    // 11th chords (simplified versions)
    'Am11': { name: 'A Minor 11th', frets: [null, 0, 0, 0, 1, 0], fingers: [null, null, null, null, 1, null] },
    'Dm11': { name: 'D Minor 11th', frets: [null, null, 0, 0, 1, 1], fingers: [null, null, null, null, 1, 2] },
    'Em11': { name: 'E Minor 11th', frets: [0, 0, 0, 0, 0, 0], fingers: [null, null, null, null, null, null] },

    // 13th chords (simplified)
    'Cmaj13': { name: 'C Major 13th', frets: [null, 3, 2, 2, 1, 0], fingers: [null, 4, 2, 3, 1, null] },
    'Gmaj13': { name: 'G Major 13th', frets: [3, 2, 0, 0, 0, 0], fingers: [3, 2, null, null, null, null] },
    'Amaj13': { name: 'A Major 13th', frets: [null, 0, 2, 1, 2, 2], fingers: [null, null, 2, 1, 3, 4] },

    // Add2 chords
    'Cadd2': { name: 'C Add 2nd', frets: [null, 3, 0, 0, 1, 0], fingers: [null, 3, null, null, 1, null] },
    'Dadd2': { name: 'D Add 2nd', frets: [null, null, 0, 2, 3, 0], fingers: [null, null, null, 1, 2, null] },
    'Gadd2': { name: 'G Add 2nd', frets: [3, 0, 0, 0, 3, 3], fingers: [2, null, null, null, 3, 4] },
    'Aadd2': { name: 'A Add 2nd', frets: [null, 0, 2, 2, 0, 0], fingers: [null, null, 1, 2, null, null] },

    // 6/9 chords
    'C6/9': { name: 'C 6/9', frets: [null, 3, 2, 2, 3, 0], fingers: [null, 2, 1, 1, 3, null] },
    'D6/9': { name: 'D 6/9', frets: [null, null, 0, 2, 0, 0], fingers: [null, null, null, 2, null, null] },
    'E6/9': { name: 'E 6/9', frets: [0, 2, 2, 1, 2, 2], fingers: [null, 2, 3, 1, 4, 4] },
    'F6/9': { name: 'F 6/9', frets: [1, 3, 3, 2, 3, 3], fingers: [1, 2, 3, 1, 4, 4] },
    'G6/9': { name: 'G 6/9', frets: [3, 2, 0, 2, 0, 0], fingers: [3, 2, null, 4, null, null] },
    'A6/9': { name: 'A 6/9', frets: [null, 0, 2, 4, 2, 2], fingers: [null, null, 1, 4, 2, 3] },
    'B6/9': { name: 'B 6/9', frets: [null, 2, 1, 3, 2, 2], fingers: [null, 2, 1, 4, 2, 3] },

    // Altered dominant chords (simplified)
    'Cmaj7#11': { name: 'C Major 7#11', frets: [null, 3, 2, 4, 4, 0], fingers: [null, 2, 1, 3, 4, null] },
    'Gmaj7#11': { name: 'G Major 7#11', frets: [3, 2, 0, 0, 3, 2], fingers: [3, 2, null, null, 4, 1] },

    // Power chords (5th chords)
    'C5': { name: 'C Power Chord', frets: [null, 3, 5, 5, null, null], fingers: [null, 1, 3, 4, null, null] },
    'D5': { name: 'D Power Chord', frets: [null, null, 0, 2, 3, null], fingers: [null, null, null, 1, 2, null] },
    'E5': { name: 'E Power Chord', frets: [0, 2, 2, null, null, null], fingers: [null, 1, 2, null, null, null] },
    'F5': { name: 'F Power Chord', frets: [1, 3, 3, null, null, null], fingers: [1, 3, 4, null, null, null] },
    'G5': { name: 'G Power Chord', frets: [3, 5, 5, null, null, null], fingers: [1, 3, 4, null, null, null] },
    'A5': { name: 'A Power Chord', frets: [null, 0, 2, 2, null, null], fingers: [null, null, 1, 2, null, null] },
    'B5': { name: 'B Power Chord', frets: [null, 2, 4, 4, null, null], fingers: [null, 1, 3, 4, null, null] },

    // Common chord inversions (slash chords)
    'C/E': { name: 'C Major/E', frets: [0, 3, 2, 0, 1, 0], fingers: [null, 3, 2, null, 1, null] },
    'C/G': { name: 'C Major/G', frets: [3, 3, 2, 0, 1, 0], fingers: [3, 4, 2, null, 1, null] },
    'Am/C': { name: 'A Minor/C', frets: [null, 3, 2, 2, 1, 0], fingers: [null, 3, 2, 2, 1, null] },
    'Am/E': { name: 'A Minor/E', frets: [0, 0, 2, 2, 1, 0], fingers: [null, null, 2, 3, 1, null] },
    'F/A': { name: 'F Major/A', frets: [null, 0, 3, 2, 1, 1], fingers: [null, null, 3, 2, 1, 1] },
    'F/C': { name: 'F Major/C', frets: [null, 3, 3, 2, 1, 1], fingers: [null, 3, 4, 2, 1, 1] },
    'G/B': { name: 'G Major/B', frets: [null, 2, 0, 0, 3, 3], fingers: [null, 2, null, null, 3, 4] },
    'G/D': { name: 'G Major/D', frets: [null, null, 0, 0, 3, 3], fingers: [null, null, null, null, 1, 2] },
    'Dm/A': { name: 'D Minor/A', frets: [null, 0, 0, 2, 3, 1], fingers: [null, null, null, 2, 3, 1] },
    'Dm/F': { name: 'D Minor/F', frets: [1, null, 0, 2, 3, 1], fingers: [1, null, null, 2, 3, 1] },
    'Em/B': { name: 'E Minor/B', frets: [null, 2, 2, 0, 0, 0], fingers: [null, 2, 3, null, null, null] },
    'Em/G': { name: 'E Minor/G', frets: [3, 2, 2, 0, 0, 0], fingers: [3, 2, 2, null, null, null] },

    // Extended C Family Chords
    'Cm6': { name: 'C Minor 6th', frets: [null, null, 1, 2, 1, 3], fingers: [null, null, 1, 3, 2, 4] },
    'Cm9': { name: 'C Minor 9th', frets: [null, 3, 1, 3, 3, 3], fingers: [null, 2, 1, 3, 4, 4] },
    'C11': { name: 'C 11th', frets: [null, 3, 3, 2, 1, 1], fingers: [null, 3, 4, 2, 1, 1] },
    'C13': { name: 'C 13th', frets: [null, 3, 2, 2, 3, 0], fingers: [null, 3, 1, 2, 4, null] },

    // C# Extended Chords
    'C#maj7': { name: 'C# Major 7th', frets: [null, null, 3, 1, 1, 1], fingers: [null, null, 4, 1, 2, 3] },
    'C#m7': { name: 'C# Minor 7th', frets: [null, null, 2, 4, 2, 4], fingers: [null, null, 1, 3, 2, 4] },
    'C#sus2': { name: 'C# Suspended 2nd', frets: [null, null, 3, 3, 1, 1], fingers: [null, null, 3, 4, 1, 2] },
    'C#sus4': { name: 'C# Suspended 4th', frets: [null, null, 3, 3, 4, 1], fingers: [null, null, 2, 3, 4, 1] },
    'C#6': { name: 'C# 6th', frets: [null, null, 3, 3, 2, 4], fingers: [null, null, 2, 3, 1, 4] },
    'C#m6': { name: 'C# Minor 6th', frets: [null, null, 2, 3, 2, 4], fingers: [null, null, 1, 3, 2, 4] },
    'C#add9': { name: 'C# Add 9th', frets: [null, null, 3, 3, 1, 4], fingers: [null, null, 2, 3, 1, 4] },
    'C#9': { name: 'C# 9th', frets: [null, null, 3, 4, 3, 4], fingers: [null, null, 2, 4, 1, 3] },
    'C#maj9': { name: 'C# Major 9th', frets: [null, null, 3, 1, 0, 1], fingers: [null, null, 4, 2, null, 1] },
    'C#m9': { name: 'C# Minor 9th', frets: [null, null, 2, 4, 0, 4], fingers: [null, null, 1, 3, null, 4] },
    'C#11': { name: 'C# 11th', frets: [null, null, 3, 4, 1, 4], fingers: [null, null, 2, 4, 1, 3] },
    'C#13': { name: 'C# 13th', frets: [null, null, 3, 3, 3, 4], fingers: [null, null, 1, 2, 3, 4] },
    'C#aug': { name: 'C# Augmented', frets: [null, null, 3, 2, 2, 1], fingers: [null, null, 4, 2, 3, 1] },
    'C#o': { name: 'C# Diminished', frets: [null, null, 2, 3, 2, 3], fingers: [null, null, 1, 3, 2, 4] },
    'C#o7': { name: 'C# Diminished 7th', frets: [null, null, 2, 3, 2, 3], fingers: [null, null, 1, 3, 2, 4] },
    'C#5': { name: 'C# Power Chord', frets: [null, null, 3, 1, 2, null], fingers: [null, null, 3, 1, 2, null] },

    // Db Extended Chords
    'Dbm': { name: 'Db Minor', frets: [null, null, 2, 1, 2, 0], fingers: [null, null, 3, 1, 4, null] },
    'Dbmaj7': { name: 'Db Major 7th', frets: [null, null, 3, 1, 1, 1], fingers: [null, null, 4, 1, 2, 3] },
    'Dbm7': { name: 'Db Minor 7th', frets: [null, null, 2, 4, 2, 4], fingers: [null, null, 1, 3, 2, 4] },
    'Dbsus2': { name: 'Db Suspended 2nd', frets: [null, null, 3, 3, 1, 1], fingers: [null, null, 3, 4, 1, 2] },
    'Dbsus4': { name: 'Db Suspended 4th', frets: [null, null, 3, 3, 4, 1], fingers: [null, null, 2, 3, 4, 1] },
    'Db6': { name: 'Db 6th', frets: [null, null, 3, 3, 2, 4], fingers: [null, null, 2, 3, 1, 4] },
    'Dbm6': { name: 'Db Minor 6th', frets: [null, null, 2, 3, 2, 4], fingers: [null, null, 1, 3, 2, 4] },
    'Dbadd9': { name: 'Db Add 9th', frets: [null, null, 3, 3, 1, 4], fingers: [null, null, 2, 3, 1, 4] },
    'Db9': { name: 'Db 9th', frets: [null, null, 3, 4, 3, 4], fingers: [null, null, 2, 4, 1, 3] },
    'Dbmaj9': { name: 'Db Major 9th', frets: [null, null, 3, 1, 0, 1], fingers: [null, null, 4, 2, null, 1] },
    'Dbm9': { name: 'Db Minor 9th', frets: [null, null, 2, 4, 0, 4], fingers: [null, null, 1, 3, null, 4] },
    'Db11': { name: 'Db 11th', frets: [null, null, 3, 4, 1, 4], fingers: [null, null, 2, 4, 1, 3] },
    'Db13': { name: 'Db 13th', frets: [null, null, 3, 3, 3, 4], fingers: [null, null, 1, 2, 3, 4] },
    'Dbaug': { name: 'Db Augmented', frets: [null, null, 3, 2, 2, 1], fingers: [null, null, 4, 2, 3, 1] },
    'Dbo': { name: 'Db Diminished', frets: [null, null, 2, 3, 2, 3], fingers: [null, null, 1, 3, 2, 4] },
    'Dbo7': { name: 'Db Diminished 7th', frets: [null, null, 2, 3, 2, 3], fingers: [null, null, 1, 3, 2, 4] },
    'Db5': { name: 'Db Power Chord', frets: [null, null, 3, 1, 2, null], fingers: [null, null, 3, 1, 2, null] },

    // D Extended Chords
    'D11': { name: 'D 11th', frets: [null, null, 0, 2, 1, 0], fingers: [null, null, null, 2, 1, null] },
    'D13': { name: 'D 13th', frets: [null, null, 0, 2, 0, 2], fingers: [null, null, null, 2, null, 3] },
    'Daug': { name: 'D Augmented', frets: [null, null, 0, 3, 3, 2], fingers: [null, null, null, 2, 3, 1] },
    'Do': { name: 'D Diminished', frets: [null, null, 0, 1, 0, 1], fingers: [null, null, null, 1, null, 2] },
    'Do7': { name: 'D Diminished 7th', frets: [null, null, 0, 1, 0, 1], fingers: [null, null, null, 1, null, 2] },

    // D# Extended Chords
    'D#maj7': { name: 'D# Major 7th', frets: [null, null, 1, 3, 3, 3], fingers: [null, null, 1, 2, 3, 4] },
    'D#m7': { name: 'D# Minor 7th', frets: [null, null, 1, 3, 2, 2], fingers: [null, null, 1, 4, 2, 3] },
    'D#sus2': { name: 'D# Suspended 2nd', frets: [null, null, 1, 3, 4, 1], fingers: [null, null, 1, 2, 4, 1] },
    'D#sus4': { name: 'D# Suspended 4th', frets: [null, null, 1, 3, 4, 4], fingers: [null, null, 1, 2, 3, 4] },
    'D#6': { name: 'D# 6th', frets: [null, null, 1, 3, 1, 3], fingers: [null, null, 1, 4, 2, 3] },
    'D#m6': { name: 'D# Minor 6th', frets: [null, null, 1, 3, 1, 2], fingers: [null, null, 1, 4, 2, 3] },
    'D#add9': { name: 'D# Add 9th', frets: [null, null, 1, 3, 2, 1], fingers: [null, null, 1, 4, 3, 2] },
    'D#9': { name: 'D# 9th', frets: [null, null, 1, 0, 2, 1], fingers: [null, null, 1, null, 3, 2] },
    'D#maj9': { name: 'D# Major 9th', frets: [null, null, 1, 3, 1, 1], fingers: [null, null, 1, 4, 2, 3] },
    'D#m9': { name: 'D# Minor 9th', frets: [null, null, 1, 3, 1, 2], fingers: [null, null, 1, 4, 2, 3] },
    'D#11': { name: 'D# 11th', frets: [null, null, 1, 3, 2, 4], fingers: [null, null, 1, 3, 2, 4] },
    'D#13': { name: 'D# 13th', frets: [null, null, 1, 3, 1, 3], fingers: [null, null, 1, 4, 2, 3] },
    'D#aug': { name: 'D# Augmented', frets: [null, null, 1, 0, 0, 3], fingers: [null, null, 1, null, null, 4] },
    'D#o': { name: 'D# Diminished', frets: [null, null, 1, 2, 1, 2], fingers: [null, null, 1, 3, 2, 4] },
    'D#o7': { name: 'D# Diminished 7th', frets: [null, null, 1, 2, 1, 2], fingers: [null, null, 1, 3, 2, 4] },
    'D#5': { name: 'D# Power Chord', frets: [null, null, 1, 3, 4, null], fingers: [null, null, 1, 3, 4, null] },

    // E Extended Chords
    'Esus2': { name: 'E Suspended 2nd', frets: [0, 2, 4, 4, 0, 0], fingers: [null, 1, 3, 4, null, null] },
    'Esus4': { name: 'E Suspended 4th', frets: [0, 2, 2, 2, 0, 0], fingers: [null, 2, 3, 4, null, null] },
    'E6': { name: 'E 6th', frets: [0, 2, 2, 1, 2, 0], fingers: [null, 2, 3, 1, 4, null] },
    'Em6': { name: 'E Minor 6th', frets: [0, 2, 2, 0, 2, 0], fingers: [null, 2, 3, null, 4, null] },
    'Eadd9': { name: 'E Add 9th', frets: [0, 2, 4, 1, 0, 0], fingers: [null, 2, 4, 1, null, null] },
    'E9': { name: 'E 9th', frets: [0, 2, 0, 1, 0, 2], fingers: [null, 2, null, 1, null, 3] },
    'Emaj9': { name: 'E Major 9th', frets: [0, 2, 1, 1, 0, 2], fingers: [null, 3, 1, 2, null, 4] },
    'Em9': { name: 'E Minor 9th', frets: [0, 2, 0, 0, 0, 2], fingers: [null, 2, null, null, null, 3] },
    'E11': { name: 'E 11th', frets: [0, 2, 2, 2, 3, 0], fingers: [null, 1, 2, 3, 4, null] },
    'E13': { name: 'E 13th', frets: [0, 2, 2, 1, 2, 2], fingers: [null, 2, 3, 1, 4, 4] },
    'Eaug': { name: 'E Augmented', frets: [0, 3, 2, 1, 1, 0], fingers: [null, 4, 3, 1, 2, null] },
    'Eo': { name: 'E Diminished', frets: [0, 1, 2, 0, 2, 0], fingers: [null, 1, 3, null, 4, null] },
    'Eo7': { name: 'E Diminished 7th', frets: [0, 1, 2, 0, 2, 0], fingers: [null, 1, 3, null, 4, null] },

    // F Extended Chords
    'Fsus2': { name: 'F Suspended 2nd', frets: [1, 3, 3, 0, 1, 1], fingers: [1, 3, 4, null, 1, 1] },
    'Fsus4': { name: 'F Suspended 4th', frets: [1, 3, 3, 3, 1, 1], fingers: [1, 2, 3, 4, 1, 1] },
    'F6': { name: 'F 6th', frets: [1, 3, 3, 2, 3, 1], fingers: [1, 2, 3, 1, 4, 1] },
    'Fm6': { name: 'F Minor 6th', frets: [1, 3, 3, 1, 3, 1], fingers: [1, 2, 3, 1, 4, 1] },
    'Fadd9': { name: 'F Add 9th', frets: [1, 0, 3, 2, 1, 1], fingers: [1, null, 4, 3, 1, 1] },
    'F9': { name: 'F 9th', frets: [1, 3, 1, 2, 1, 1], fingers: [1, 4, 1, 3, 1, 1] },
    'Fmaj9': { name: 'F Major 9th', frets: [1, 0, 3, 0, 1, 0], fingers: [1, null, 4, null, 2, null] },
    'Fm9': { name: 'F Minor 9th', frets: [1, 3, 1, 1, 1, 1], fingers: [1, 4, 1, 1, 1, 1] },
    'F11': { name: 'F 11th', frets: [1, 3, 3, 3, 4, 1], fingers: [1, 2, 3, 3, 4, 1] },
    'F13': { name: 'F 13th', frets: [1, 3, 1, 2, 3, 1], fingers: [1, 3, 1, 2, 4, 1] },
    'Faug': { name: 'F Augmented', frets: [1, 4, 3, 2, 2, 1], fingers: [1, 4, 3, 2, 2, 1] },
    'Fo': { name: 'F Diminished', frets: [1, 2, 3, 1, 3, 1], fingers: [1, 2, 4, 1, 3, 1] },
    'Fo7': { name: 'F Diminished 7th', frets: [1, 2, 3, 1, 3, 1], fingers: [1, 2, 4, 1, 3, 1] },

    // F# Extended Chords
    'F#sus2': { name: 'F# Suspended 2nd', frets: [2, 4, 4, 1, 2, 2], fingers: [1, 3, 4, null, 1, 1] },
    'F#sus4': { name: 'F# Suspended 4th', frets: [2, 4, 4, 4, 2, 2], fingers: [1, 2, 3, 4, 1, 1] },
    'F#6': { name: 'F# 6th', frets: [2, 4, 4, 3, 4, 2], fingers: [1, 2, 3, 1, 4, 1] },
    'F#m6': { name: 'F# Minor 6th', frets: [2, 4, 4, 2, 4, 2], fingers: [1, 2, 3, 1, 4, 1] },
    'F#add9': { name: 'F# Add 9th', frets: [2, 1, 4, 3, 2, 2], fingers: [1, null, 4, 3, 1, 1] },
    'F#9': { name: 'F# 9th', frets: [2, 4, 2, 3, 2, 2], fingers: [1, 4, 1, 3, 1, 1] },
    'F#maj9': { name: 'F# Major 9th', frets: [2, 1, 4, 1, 2, 1], fingers: [1, null, 4, null, 2, null] },
    'F#m9': { name: 'F# Minor 9th', frets: [2, 4, 2, 2, 2, 2], fingers: [1, 4, 1, 1, 1, 1] },
    'F#11': { name: 'F# 11th', frets: [2, 4, 4, 4, 5, 2], fingers: [1, 2, 3, 3, 4, 1] },
    'F#13': { name: 'F# 13th', frets: [2, 4, 2, 3, 4, 2], fingers: [1, 3, 1, 2, 4, 1] },
    'F#aug': { name: 'F# Augmented', frets: [2, 5, 4, 3, 3, 2], fingers: [1, 4, 3, 2, 2, 1] },
    'F#o': { name: 'F# Diminished', frets: [2, 3, 4, 2, 4, 2], fingers: [1, 2, 4, 1, 3, 1] },
    'F#o7': { name: 'F# Diminished 7th', frets: [2, 3, 4, 2, 4, 2], fingers: [1, 2, 4, 1, 3, 1] },

    // G Extended Chords
    'Gsus2': { name: 'G Suspended 2nd', frets: [3, 0, 0, 0, 3, 3], fingers: [1, null, null, null, 2, 3] },
    'Gsus4': { name: 'G Suspended 4th', frets: [3, 3, 0, 0, 1, 3], fingers: [3, 4, null, null, 1, 4] },
    'G6': { name: 'G 6th', frets: [3, 2, 0, 0, 0, 0], fingers: [3, 2, null, null, null, null] },
    'Gm6': { name: 'G Minor 6th', frets: [3, 1, 0, 0, 3, 0], fingers: [3, 1, null, null, 4, null] },
    'Gadd9': { name: 'G Add 9th', frets: [3, 0, 0, 2, 3, 3], fingers: [2, null, null, 1, 3, 4] },
    'G9': { name: 'G 9th', frets: [3, 0, 0, 2, 0, 1], fingers: [3, null, null, 2, null, 1] },
    'Gmaj9': { name: 'G Major 9th', frets: [3, 0, 4, 0, 3, 0], fingers: [2, null, 4, null, 3, null] },
    'Gm9': { name: 'G Minor 9th', frets: [3, 1, 0, 3, 3, 3], fingers: [2, 1, null, 3, 4, 4] },
    'G11': { name: 'G 11th', frets: [3, 3, 0, 2, 1, 1], fingers: [3, 4, null, 2, 1, 1] },
    'G13': { name: 'G 13th', frets: [3, 0, 0, 2, 0, 0], fingers: [3, null, null, 2, null, null] },
    'Gaug': { name: 'G Augmented', frets: [3, 2, 1, 0, 0, 3], fingers: [4, 3, 2, null, null, 4] },
    'Go': { name: 'G Diminished', frets: [3, 4, 5, 3, 5, 3], fingers: [1, 2, 4, 1, 3, 1] },
    'Go7': { name: 'G Diminished 7th', frets: [3, 4, 5, 3, 5, 3], fingers: [1, 2, 4, 1, 3, 1] },

    // A Extended Chords
    'Asus2': { name: 'A Suspended 2nd', frets: [null, 0, 2, 2, 0, 0], fingers: [null, null, 1, 2, null, null] },
    'Asus4': { name: 'A Suspended 4th', frets: [null, 0, 2, 2, 3, 0], fingers: [null, null, 1, 2, 3, null] },
    'A6': { name: 'A 6th', frets: [null, 0, 2, 2, 2, 2], fingers: [null, null, 1, 2, 3, 4] },
    'Am6': { name: 'A Minor 6th', frets: [null, 0, 2, 2, 1, 2], fingers: [null, null, 2, 3, 1, 4] },
    'Aadd9': { name: 'A Add 9th', frets: [null, 0, 2, 4, 2, 0], fingers: [null, null, 1, 4, 2, null] },
    'A9': { name: 'A 9th', frets: [null, 0, 2, 4, 2, 3], fingers: [null, null, 1, 3, 2, 4] },
    'Amaj9': { name: 'A Major 9th', frets: [null, 0, 2, 1, 0, 0], fingers: [null, null, 2, 1, null, null] },
    'Am9': { name: 'A Minor 9th', frets: [null, 0, 2, 4, 1, 3], fingers: [null, null, 1, 4, 1, 3] },
    'A11': { name: 'A 11th', frets: [null, 0, 0, 0, 2, 0], fingers: [null, null, null, null, 1, null] },
    'A13': { name: 'A 13th', frets: [null, 0, 2, 0, 2, 2], fingers: [null, null, 1, null, 2, 3] },
    'Aaug': { name: 'A Augmented', frets: [null, 0, 3, 2, 2, 1], fingers: [null, null, 4, 2, 3, 1] },
    'Ao': { name: 'A Diminished', frets: [null, 0, 1, 2, 1, 2], fingers: [null, null, 1, 3, 2, 4] },
    'Ao7': { name: 'A Diminished 7th', frets: [null, 0, 1, 2, 1, 2], fingers: [null, null, 1, 3, 2, 4] },

    // B Extended Chords
    'Bsus2': { name: 'B Suspended 2nd', frets: [null, 2, 4, 4, 2, 2], fingers: [null, 1, 3, 4, 1, 1] },
    'Bsus4': { name: 'B Suspended 4th', frets: [null, 2, 4, 4, 5, 2], fingers: [null, 1, 2, 3, 4, 1] },
    'B6': { name: 'B 6th', frets: [null, 2, 4, 4, 4, 4], fingers: [null, 1, 2, 3, 4, 4] },
    'Bm6': { name: 'B Minor 6th', frets: [null, 2, 4, 4, 3, 4], fingers: [null, 1, 3, 4, 2, 4] },
    'Badd9': { name: 'B Add 9th', frets: [null, 2, 4, 6, 4, 2], fingers: [null, 1, 2, 4, 3, 1] },
    'B9': { name: 'B 9th', frets: [null, 2, 1, 2, 2, 2], fingers: [null, 2, 1, 3, 4, 4] },
    'Bmaj9': { name: 'B Major 9th', frets: [null, 2, 4, 3, 2, 2], fingers: [null, 1, 4, 3, 1, 1] },
    'Bm9': { name: 'B Minor 9th', frets: [null, 2, 0, 2, 2, 2], fingers: [null, 1, null, 2, 3, 4] },
    'B11': { name: 'B 11th', frets: [null, 2, 2, 2, 4, 2], fingers: [null, 1, 1, 1, 4, 1] },
    'B13': { name: 'B 13th', frets: [null, 2, 4, 2, 4, 4], fingers: [null, 1, 3, 2, 4, 4] },
    'Baug': { name: 'B Augmented', frets: [null, 2, 5, 4, 4, 3], fingers: [null, 1, 4, 2, 3, 1] },
    'Bo': { name: 'B Diminished', frets: [null, 2, 3, 4, 3, 4], fingers: [null, 1, 2, 4, 3, 4] },
    'Bo7': { name: 'B Diminished 7th', frets: [null, 2, 3, 4, 3, 4], fingers: [null, 1, 2, 4, 3, 4] },

    // Missing Eb Extended Chords
    'Ebmaj7': { name: 'Eb Major 7th', frets: [null, null, 1, 3, 3, 3], fingers: [null, null, 1, 2, 3, 4] },
    'Ebm': { name: 'Eb Minor', frets: [null, null, 4, 3, 4, 2], fingers: [null, null, 3, 1, 4, 2] },
    'Ebm7': { name: 'Eb Minor 7th', frets: [null, null, 1, 3, 2, 2], fingers: [null, null, 1, 4, 2, 3] },
    'Ebsus2': { name: 'Eb Suspended 2nd', frets: [null, null, 1, 3, 4, 1], fingers: [null, null, 1, 2, 4, 1] },
    'Ebsus4': { name: 'Eb Suspended 4th', frets: [null, null, 1, 3, 4, 4], fingers: [null, null, 1, 2, 3, 4] },
    'Eb6': { name: 'Eb 6th', frets: [null, null, 1, 3, 1, 3], fingers: [null, null, 1, 4, 2, 3] },
    'Ebm6': { name: 'Eb Minor 6th', frets: [null, null, 1, 3, 1, 2], fingers: [null, null, 1, 4, 2, 3] },
    'Ebadd9': { name: 'Eb Add 9th', frets: [null, null, 1, 3, 2, 1], fingers: [null, null, 1, 4, 3, 2] },
    'Eb9': { name: 'Eb 9th', frets: [null, null, 1, 0, 2, 1], fingers: [null, null, 1, null, 3, 2] },
    'Ebmaj9': { name: 'Eb Major 9th', frets: [null, null, 1, 3, 1, 1], fingers: [null, null, 1, 4, 2, 3] },
    'Ebm9': { name: 'Eb Minor 9th', frets: [null, null, 1, 3, 1, 2], fingers: [null, null, 1, 4, 2, 3] },
    'Eb11': { name: 'Eb 11th', frets: [null, null, 1, 3, 2, 4], fingers: [null, null, 1, 3, 2, 4] },
    'Eb13': { name: 'Eb 13th', frets: [null, null, 1, 3, 1, 3], fingers: [null, null, 1, 4, 2, 3] },
    'Ebaug': { name: 'Eb Augmented', frets: [null, null, 1, 0, 0, 3], fingers: [null, null, 1, null, null, 4] },
    'Ebo': { name: 'Eb Diminished', frets: [null, null, 1, 2, 1, 2], fingers: [null, null, 1, 3, 2, 4] },
    'Ebo7': { name: 'Eb Diminished 7th', frets: [null, null, 1, 2, 1, 2], fingers: [null, null, 1, 3, 2, 4] },
    'Eb5': { name: 'Eb Power Chord', frets: [null, null, 1, 3, 4, null], fingers: [null, null, 1, 3, 4, null] },

    // Missing Gb Extended Chords
    'Gbmaj7': { name: 'Gb Major 7th', frets: [2, 4, 4, 3, 2, 1], fingers: [1, 3, 4, 2, 1, 1] },
    'Gbm': { name: 'Gb Minor', frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1] },
    'Gbm7': { name: 'Gb Minor 7th', frets: [2, 4, 2, 2, 2, 2], fingers: [1, 4, 1, 1, 1, 1] },
    'Gbsus2': { name: 'Gb Suspended 2nd', frets: [2, 4, 4, 1, 2, 2], fingers: [1, 3, 4, null, 1, 1] },
    'Gbsus4': { name: 'Gb Suspended 4th', frets: [2, 4, 4, 4, 2, 2], fingers: [1, 2, 3, 4, 1, 1] },
    'Gb6': { name: 'Gb 6th', frets: [2, 4, 4, 3, 4, 2], fingers: [1, 2, 3, 1, 4, 1] },
    'Gbm6': { name: 'Gb Minor 6th', frets: [2, 4, 4, 2, 4, 2], fingers: [1, 2, 3, 1, 4, 1] },
    'Gbadd9': { name: 'Gb Add 9th', frets: [2, 1, 4, 3, 2, 2], fingers: [1, null, 4, 3, 1, 1] },
    'Gb9': { name: 'Gb 9th', frets: [2, 4, 2, 3, 2, 2], fingers: [1, 4, 1, 3, 1, 1] },
    'Gbmaj9': { name: 'Gb Major 9th', frets: [2, 1, 4, 1, 2, 1], fingers: [1, null, 4, null, 2, null] },
    'Gbm9': { name: 'Gb Minor 9th', frets: [2, 4, 2, 2, 2, 2], fingers: [1, 4, 1, 1, 1, 1] },
    'Gb11': { name: 'Gb 11th', frets: [2, 4, 4, 4, 5, 2], fingers: [1, 2, 3, 3, 4, 1] },
    'Gb13': { name: 'Gb 13th', frets: [2, 4, 2, 3, 4, 2], fingers: [1, 3, 1, 2, 4, 1] },
    'Gbaug': { name: 'Gb Augmented', frets: [2, 5, 4, 3, 3, 2], fingers: [1, 4, 3, 2, 2, 1] },
    'Gbo': { name: 'Gb Diminished', frets: [2, 3, 4, 2, 4, 2], fingers: [1, 2, 4, 1, 3, 1] },
    'Gbo7': { name: 'Gb Diminished 7th', frets: [2, 3, 4, 2, 4, 2], fingers: [1, 2, 4, 1, 3, 1] },
    'Gb5': { name: 'Gb Power Chord', frets: [2, 4, 4, null, null, null], fingers: [1, 3, 4, null, null, null] },

    // Missing Ab Extended Chords
    'Abmaj7': { name: 'Ab Major 7th', frets: [4, 6, 6, 5, 4, 3], fingers: [1, 3, 4, 2, 1, 1] },
    'Abm': { name: 'Ab Minor', frets: [4, 6, 6, 4, 4, 4], fingers: [1, 3, 4, 1, 1, 1] },
    'Abm7': { name: 'Ab Minor 7th', frets: [4, 6, 4, 4, 4, 4], fingers: [1, 4, 1, 1, 1, 1] },
    'Absus2': { name: 'Ab Suspended 2nd', frets: [4, 6, 6, 3, 4, 4], fingers: [1, 3, 4, null, 1, 1] },
    'Absus4': { name: 'Ab Suspended 4th', frets: [4, 6, 6, 6, 4, 4], fingers: [1, 2, 3, 4, 1, 1] },
    'Ab6': { name: 'Ab 6th', frets: [4, 6, 6, 5, 6, 4], fingers: [1, 2, 3, 1, 4, 1] },
    'Abm6': { name: 'Ab Minor 6th', frets: [4, 6, 6, 4, 6, 4], fingers: [1, 2, 3, 1, 4, 1] },
    'Abadd9': { name: 'Ab Add 9th', frets: [4, 3, 6, 5, 4, 4], fingers: [1, null, 4, 3, 1, 1] },
    'Ab9': { name: 'Ab 9th', frets: [4, 6, 4, 5, 4, 4], fingers: [1, 4, 1, 3, 1, 1] },
    'Abmaj9': { name: 'Ab Major 9th', frets: [4, 3, 6, 3, 4, 3], fingers: [1, null, 4, null, 2, null] },
    'Abm9': { name: 'Ab Minor 9th', frets: [4, 6, 4, 4, 4, 4], fingers: [1, 4, 1, 1, 1, 1] },
    'Ab11': { name: 'Ab 11th', frets: [4, 6, 6, 6, 7, 4], fingers: [1, 2, 3, 3, 4, 1] },
    'Ab13': { name: 'Ab 13th', frets: [4, 6, 4, 5, 6, 4], fingers: [1, 3, 1, 2, 4, 1] },
    'Abaug': { name: 'Ab Augmented', frets: [4, 7, 6, 5, 5, 4], fingers: [1, 4, 3, 2, 2, 1] },
    'Abo': { name: 'Ab Diminished', frets: [4, 5, 6, 4, 6, 4], fingers: [1, 2, 4, 1, 3, 1] },
    'Abo7': { name: 'Ab Diminished 7th', frets: [4, 5, 6, 4, 6, 4], fingers: [1, 2, 4, 1, 3, 1] },
    'Ab5': { name: 'Ab Power Chord', frets: [4, 6, 6, null, null, null], fingers: [1, 3, 4, null, null, null] },

    // Missing Bb Extended Chords
    'Bbmaj7': { name: 'Bb Major 7th', frets: [null, 1, 3, 2, 3, 1], fingers: [null, 1, 3, 2, 4, 1] },
    'Bbsus2': { name: 'Bb Suspended 2nd', frets: [null, 1, 3, 3, 1, 1], fingers: [null, 1, 3, 4, 1, 1] },
    'Bbsus4': { name: 'Bb Suspended 4th', frets: [null, 1, 3, 3, 4, 1], fingers: [null, 1, 2, 3, 4, 1] },
    'Bb6': { name: 'Bb 6th', frets: [null, 1, 3, 3, 3, 3], fingers: [null, 1, 2, 3, 4, 4] },
    'Bbm6': { name: 'Bb Minor 6th', frets: [null, 1, 3, 3, 2, 3], fingers: [null, 1, 3, 4, 2, 4] },
    'Bbadd9': { name: 'Bb Add 9th', frets: [null, 1, 0, 3, 3, 1], fingers: [null, 1, null, 3, 4, 1] },
    'Bb9': { name: 'Bb 9th', frets: [null, 1, 0, 1, 1, 1], fingers: [null, 1, null, 2, 3, 4] },
    'Bbmaj9': { name: 'Bb Major 9th', frets: [null, 1, 0, 2, 1, 0], fingers: [null, 1, null, 3, 2, null] },
    'Bbm9': { name: 'Bb Minor 9th', frets: [null, 1, 0, 1, 2, 1], fingers: [null, 1, null, 1, 3, 1] },
    'Bb11': { name: 'Bb 11th', frets: [null, 1, 3, 3, 4, 4], fingers: [null, 1, 2, 3, 4, 4] },
    'Bb13': { name: 'Bb 13th', frets: [null, 1, 3, 1, 3, 3], fingers: [null, 1, 3, 1, 4, 4] },
    'Bbaug': { name: 'Bb Augmented', frets: [null, 1, 4, 3, 3, 2], fingers: [null, 1, 4, 2, 3, 1] },
    'Bbo': { name: 'Bb Diminished', frets: [null, 1, 2, 3, 2, 3], fingers: [null, 1, 2, 4, 3, 4] },
    'Bbo7': { name: 'Bb Diminished 7th', frets: [null, 1, 2, 3, 2, 3], fingers: [null, 1, 2, 4, 3, 4] },
    'Bb5': { name: 'Bb Power Chord', frets: [null, 1, 3, 3, null, null], fingers: [null, 1, 3, 4, null, null] }
};

// Piano key positions (for visual reference)
const pianoKeys = {
    'C': { white: 0, type: 'white' },
    'C#': { white: 0.5, type: 'black' },
    'Db': { white: 0.5, type: 'black' },
    'D': { white: 1, type: 'white' },
    'D#': { white: 1.5, type: 'black' },
    'Eb': { white: 1.5, type: 'black' },
    'E': { white: 2, type: 'white' },
    'F': { white: 3, type: 'white' },
    'F#': { white: 3.5, type: 'black' },
    'Gb': { white: 3.5, type: 'black' },
    'G': { white: 4, type: 'white' },
    'G#': { white: 4.5, type: 'black' },
    'Ab': { white: 4.5, type: 'black' },
    'A': { white: 5, type: 'white' },
    'A#': { white: 5.5, type: 'black' },
    'Bb': { white: 5.5, type: 'black' },
    'B': { white: 6, type: 'white' }
};

// Bass fretboard positions (4-string bass: E-A-D-G)
const bassFretboard = {
    strings: ['G', 'D', 'A', 'E'], // From top to bottom (visual representation)
    frets: 12
};

// Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
function getPositionSuffix(num) {
    if (num >= 11 && num <= 13) return 'th';
    switch (num % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

// Helper function to find a transposable chord when exact match isn't found
function findTransposableChord(targetChord) {
    // Extract chord type and root
    const chordInfo = parseEnhancedChordName(targetChord);
    const targetRoot = chordInfo.root;
    const chordType = targetChord.replace(/^[A-G][#b]?/, ''); // Remove root, keep extensions

    // List of roots to try in order of preference (easier fingerings first)
    const rootsToTry = ['C', 'G', 'A', 'D', 'E', 'F', 'Am', 'Em', 'Dm'];

    // Try to find the same chord type with a different root
    for (const tryRoot of rootsToTry) {
        const candidateChord = tryRoot + chordType;
        if (guitarChords[candidateChord]) {
            // Found a similar chord, we could potentially transpose it
            // For now, just return it directly as a reasonable substitute
            return guitarChords[candidateChord];
        }
    }

    // If chord type not found, try simplified versions
    const simplifiedTypes = ['', 'm', '7', 'maj7', 'sus4', 'sus2'];
    for (const tryRoot of rootsToTry) {
        for (const simpleType of simplifiedTypes) {
            const candidateChord = tryRoot + simpleType;
            if (guitarChords[candidateChord]) {
                return guitarChords[candidateChord];
            }
        }
    }

    return null;
}

// Generate guitar chord diagram using SVGuitar
function generateGuitarDiagram(chordName) {
    // Parse the chord to handle slash chords and other variations
    const chordInfo = parseEnhancedChordName(chordName);

    // First, try to find the exact chord name (including slash chords like C/E)
    let chord = guitarChords[chordName] || guitarChords[chordName.replace('maj', '')] || null;

    // If slash chord not found, try the base chord
    if (!chord && chordInfo.isInversion) {
        const baseChord = chordInfo.chord;
        chord = guitarChords[baseChord] || guitarChords[baseChord.replace('maj', '')] || null;
    }

    // If still not found, try the base chord for non-slash chords
    if (!chord) {
        const baseChord = chordInfo.chord;
        chord = guitarChords[baseChord] || guitarChords[baseChord.replace('maj', '')] || null;
    }

    // If still not found, try without modifiers (keep only root and m for minor)
    if (!chord) {
        const baseChord = chordInfo.chord;
        const simplifiedName = baseChord.replace(/[^A-G#bm]/g, '');
        chord = guitarChords[simplifiedName] || null;
    }

    // If still not found, try to transpose from a similar chord
    if (!chord) {
        const baseChord = chordInfo.chord;
        chord = findTransposableChord(baseChord);
    }

    if (!chord) {
        return `<div class="guitar-diagram">
            <div class="chord-name">${chordName}</div>
            <div class="diagram-placeholder">Guitar diagram not available</div>
        </div>`;
    }

    // Create unique ID for this chart
    const chartId = `guitar-chart-${chordName.replace(/[^a-zA-Z0-9]/g, '')}`;

    // Calculate position early so we can use it in the template
    const activeFrets = chord.frets.filter(f => f !== null && f !== 0);
    const minFret = activeFrets.length > 0 ? Math.min(...activeFrets) : 1;
    const maxFret = activeFrets.length > 0 ? Math.max(...activeFrets) : 1;

    // Better position calculation for different chord ranges
    let position = 1;
    if (minFret > 1) {
        if (minFret >= 5) {
            position = Math.max(1, minFret - 1); // For high frets, start one fret before
        } else {
            position = 1; // For frets 2-4, still show from fret 1 but indicate the position
        }
    }

    // Create container with standardized styling
    // Generate fret number labels
    const fretLabels = [];
    for (let i = 1; i <= 5; i++) {
        const fretNumber = position + i - 1;
        fretLabels.push(`<div class="fret-label" data-fret="${i}">${fretNumber}</div>`);
    }

    const container = `
        <div class="chord-diagram-wrapper">
            <div class="fret-labels-overlay">
                ${fretLabels.join('')}
            </div>
            <div id="${chartId}" class="svg-container svg-guitar-container"></div>
        </div>
    `;

    // Generate SVGuitar chart after DOM is ready
    setTimeout(() => {
        const element = document.getElementById(chartId);
        if (element && window.svguitar) {
            // Convert chord data to SVGuitar format
            const fingers = [];

            chord.frets.forEach((fret, stringIndex) => {
                // Reverse string order: our data is [6th,5th,4th,3rd,2nd,1st] but SVGuitar expects [1st,2nd,3rd,4th,5th,6th]
                const guitarString = 6 - stringIndex; // Reverse the string order for right-handed view

                if (fret === null) {
                    // Muted string
                    fingers.push([guitarString, 'x']);
                } else if (fret === 0) {
                    // Open string
                    fingers.push([guitarString, 0]);
                } else {
                    // Fretted note with finger number
                    const fingerNum = chord.fingers[stringIndex] || '';
                    fingers.push([guitarString, fret, fingerNum.toString()]);
                }
            });

            try {
                // Position was already calculated above

                new window.svguitar.SVGuitarChord(element)
                    .configure({
                        style: 'normal',
                        orientation: 'vertical',
                        strings: 6,
                        frets: 5,
                        position: position,
                        tuning: ['E', 'B', 'G', 'D', 'A', 'E'], // Reversed for right-handed view: 1st to 6th string
                        strokeWidth: 2,
                        backgroundColor: 'transparent',
                        strokeColor: '#e0e0e0',
                        textColor: '#ffffff',
                        color: '#2a2a2a',
                        fretColor: '#999999',
                        stringColor: '#bbbbbb',
                        mutedStringColor: '#ff6b6b',
                        openStringColor: '#4ecdc4',
                        fretLabelColor: '#ffffff',
                        fretLabelFontSize: 14,
                        showFretLabels: true,
                        fretLabelPosition: 'left',
                        showPosition: true,
                        positionText: position + 'fr',
                        fretNumbers: true,
                        fretNumbersPosition: 'right',
                        showNut: position === 1,
                        nutText: position === 1 ? 'Nut' : '',
                        nutColor: '#333333',
                        nutSize: 0.75,
                        circleRadius: 0.35,
                        fontFamily: 'Arial, sans-serif',
                        fontSize: 12,
                        watermark: '',
                        title: '',
                        titleFontSize: 20,
                        titleBottomMargin: 0
                    })
                    .chord({
                        fingers: fingers,
                        barres: []
                    })
                    .draw();
            } catch (error) {
                console.error('Error generating SVGuitar chart:', error);
                element.innerHTML = '<div class="diagram-placeholder">Error loading guitar diagram</div>';
            }
        }
    }, 100);

    return container;
}

// Generate piano diagram using piano-chart library
function generatePianoDiagram(chordName) {
    // Get chord notes using Tonal.js if available
    let chordNotes = [];

    if (window.Tonal && window.Tonal.Chord) {
        try {
            const chordInfo = window.Tonal.Chord.get(chordName);
            chordNotes = chordInfo.notes || [];
        } catch (error) {
            console.warn('Error getting chord notes:', error);
        }
    }

    // Fallback to basic triads if Tonal.js fails
    if (chordNotes.length === 0) {
        chordNotes = getBasicChordNotes(chordName);
    }

    // Create unique ID for this chart
    const chartId = `piano-chart-${chordName.replace(/[^a-zA-Z0-9]/g, '')}`;

    // Return just the SVG content directly for embedding in existing containers
    return generateEnhancedPianoSVG(chordName, chordNotes);
}

// Initialize piano chart with chord notes
function initializePianoChart(containerId, chordNotes) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn('Piano chart container not available:', containerId);
        return;
    }

    // Check for various possible piano chart library patterns
    const PianoChart = window.PianoChart || window.pianoChart || window.Piano || window.Instrument;

    if (!PianoChart) {
        console.warn('Piano chart library not available, using fallback SVG for:', containerId);
        // Use the enhanced SVG fallback instead
        const chordName = containerId.replace('piano-chart-', '');
        container.innerHTML = generateEnhancedPianoSVG(chordName, chordNotes);
        return;
    }

    try {
        // Clear any existing content
        container.innerHTML = '';

        // Try different API patterns
        let piano;

        // Pattern 1: PianoChart.Instrument
        if (PianoChart.Instrument) {
            piano = new PianoChart.Instrument(container, {
                startOctave: 3,
                endOctave: 5,
                showNoteNames: true,
                highlightedNotes: chordNotes
            });
        }
        // Pattern 2: Direct PianoChart constructor
        else if (typeof PianoChart === 'function') {
            piano = new PianoChart(container, {
                startOctave: 3,
                endOctave: 5,
                showNoteNames: true,
                highlightedNotes: chordNotes
            });
        }
        else {
            throw new Error('Unknown piano chart API pattern');
        }

        // Create the piano keyboard
        if (piano && piano.create) {
            piano.create();
        }

        // Highlight chord notes with octave numbers
        if (piano && piano.keyDown) {
            chordNotes.forEach(note => {
                // Try different octaves to ensure visibility
                const octaves = [3, 4, 5];
                octaves.forEach(octave => {
                    try {
                        piano.keyDown(`${note}${octave}`);
                    } catch (e) {
                        // Ignore if note+octave combination doesn't exist
                    }
                });
            });
        }

        console.log(`Piano chart initialized for chord: ${chordNotes.join(', ')}`);
    } catch (error) {
        console.error('Error initializing piano chart:', error);
        // Fallback to SVG piano diagram
        const chordName = containerId.replace('piano-chart-', '');
        container.innerHTML = generateEnhancedPianoSVG(chordName, chordNotes);
    }
}

// Generate enhanced professional piano SVG
function generateEnhancedPianoSVG(chordName, chordNotes) {
    const chartId = chordName.replace(/[^a-zA-Z0-9]/g, '');
    const width = 200;  // Increased width to ensure no cut-off
    const height = 120;
    const whiteKeyWidth = 24;
    const whiteKeyHeight = 80;
    const blackKeyWidth = 14;
    const blackKeyHeight = 50;

    // 7 white keys: C D E F G A B (one octave)
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const blackKeys = [
        { note: 'C#', position: 1 },
        { note: 'D#', position: 2 },
        { note: 'F#', position: 4 },
        { note: 'G#', position: 5 },
        { note: 'A#', position: 6 }
    ];

    // Match guitar chord styling - dark theme with same colors
    let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="background: transparent; border-radius: 6px;">
        <defs>
            <filter id="dropShadow${chartId}" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="1" flood-color="#000" flood-opacity="0.3"/>
            </filter>
            <linearGradient id="whiteKeyGrad${chartId}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#f0f0f0;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#e0e0e0;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="blackKeyGrad${chartId}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#2a2a2a;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
            </linearGradient>
            <radialGradient id="pressedWhiteGrad${chartId}" cx="50%" cy="30%" r="70%">
                <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:0.9" />
                <stop offset="100%" style="stop-color:#d63031;stop-opacity:1" />
            </radialGradient>
            <radialGradient id="pressedBlackGrad${chartId}" cx="50%" cy="30%" r="70%">
                <stop offset="0%" style="stop-color:#4ecdc4;stop-opacity:0.9" />
                <stop offset="100%" style="stop-color:#00b894;stop-opacity:1" />
            </radialGradient>
        </defs>`;

    const startX = 6;
    const startY = 10;

    console.log(`Drawing ${whiteKeys.length} white keys for ${chordName}`);

    // Draw all white keys first
    whiteKeys.forEach((note, index) => {
        const x = startX + index * whiteKeyWidth;
        const isPressed = chordNotes.some(chordNote => {
            const cleanChordNote = chordNote.replace(/[0-9]/g, '');
            // Check for enharmonic equivalents
            const enharmonicEquivalents = {
                'C#': 'Db', 'Db': 'C#',
                'D#': 'Eb', 'Eb': 'D#',
                'F#': 'Gb', 'Gb': 'F#',
                'G#': 'Ab', 'Ab': 'G#',
                'A#': 'Bb', 'Bb': 'A#'
            };
            return cleanChordNote === note || enharmonicEquivalents[cleanChordNote] === note;
        });

        console.log(`White key ${index + 1}: ${note} at x=${x}, pressed=${isPressed}`);

        const fillColor = isPressed ? `url(#pressedWhiteGrad${chartId})` : `url(#whiteKeyGrad${chartId})`;
        const strokeColor = isPressed ? '#ff6b6b' : '#e0e0e0';
        const strokeWidth = isPressed ? '2' : '1';

        svgContent += `
            <rect x="${x}" y="${startY}" width="${whiteKeyWidth}" height="${whiteKeyHeight}"
                  fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"
                  filter="url(#dropShadow${chartId})" rx="2" ry="2" />`;
    });

    // Draw black keys on top
    blackKeys.forEach(({ note, position }) => {
        const x = startX + (position - 1) * whiteKeyWidth + whiteKeyWidth - blackKeyWidth/2;
        const isPressed = chordNotes.some(chordNote => {
            const cleanChordNote = chordNote.replace(/[0-9]/g, '');
            // Check for enharmonic equivalents
            const enharmonicEquivalents = {
                'C#': 'Db', 'Db': 'C#',
                'D#': 'Eb', 'Eb': 'D#',
                'F#': 'Gb', 'Gb': 'F#',
                'G#': 'Ab', 'Ab': 'G#',
                'A#': 'Bb', 'Bb': 'A#'
            };
            return cleanChordNote === note || enharmonicEquivalents[cleanChordNote] === note;
        });

        const fillColor = isPressed ? `url(#pressedBlackGrad${chartId})` : `url(#blackKeyGrad${chartId})`;
        const strokeColor = isPressed ? '#4ecdc4' : '#bbbbbb';

        svgContent += `
            <rect x="${x}" y="${startY}" width="${blackKeyWidth}" height="${blackKeyHeight}"
                  fill="${fillColor}" stroke="${strokeColor}" stroke-width="1"
                  filter="url(#dropShadow${chartId})" rx="2" ry="2" />`;
    });

    // Draw white key labels (on top so they're visible)
    whiteKeys.forEach((note, index) => {
        const x = startX + index * whiteKeyWidth;
        const isPressed = chordNotes.some(chordNote => {
            const cleanChordNote = chordNote.replace(/[0-9]/g, '');
            // Check for enharmonic equivalents
            const enharmonicEquivalents = {
                'C#': 'Db', 'Db': 'C#',
                'D#': 'Eb', 'Eb': 'D#',
                'F#': 'Gb', 'Gb': 'F#',
                'G#': 'Ab', 'Ab': 'G#',
                'A#': 'Bb', 'Bb': 'A#'
            };
            return cleanChordNote === note || enharmonicEquivalents[cleanChordNote] === note;
        });

        svgContent += `
            <text x="${x + whiteKeyWidth/2}" y="${startY + whiteKeyHeight - 10}"
                  text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="600"
                  fill="${isPressed ? '#fff' : '#333'}" stroke="${isPressed ? '#000' : 'none'}" stroke-width="0.5">
                ${note}
            </text>`;
    });

    // Draw black key labels
    blackKeys.forEach(({ note, position }) => {
        const x = startX + (position - 1) * whiteKeyWidth + whiteKeyWidth - blackKeyWidth/2;
        const isPressed = chordNotes.some(chordNote => {
            const cleanChordNote = chordNote.replace(/[0-9]/g, '');
            // Check for enharmonic equivalents
            const enharmonicEquivalents = {
                'C#': 'Db', 'Db': 'C#',
                'D#': 'Eb', 'Eb': 'D#',
                'F#': 'Gb', 'Gb': 'F#',
                'G#': 'Ab', 'Ab': 'G#',
                'A#': 'Bb', 'Bb': 'A#'
            };
            return cleanChordNote === note || enharmonicEquivalents[cleanChordNote] === note;
        });

        svgContent += `
            <text x="${x + blackKeyWidth/2}" y="${startY + blackKeyHeight - 8}"
                  text-anchor="middle" font-family="Arial, sans-serif" font-size="9" font-weight="600"
                  fill="${isPressed ? '#000' : '#ffffff'}">
                ${note}
            </text>`;
    });

    svgContent += '</svg>';
    console.log(`Generated piano SVG with width=${width}, showing ${whiteKeys.length} keys`);
    return svgContent;
}

// Generate professional piano SVG (fallback function)
function generatePianoSVG(chordName, chordNotes) {
    const chartId = chordName.replace(/[^a-zA-Z0-9]/g, '');
    const width = 240;
    const height = 110;
    const whiteKeyWidth = 34;
    const whiteKeyHeight = 90;
    const blackKeyWidth = 20;
    const blackKeyHeight = 58;

    // Define piano layout for one octave
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const blackKeys = [
        { note: 'C#', position: 1 },
        { note: 'D#', position: 2 },
        { note: 'F#', position: 4 },
        { note: 'G#', position: 5 },
        { note: 'A#', position: 6 }
    ];

    let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background: #f8f8f8; border-radius: 8px;">
        <defs>
            <filter id="dropShadow${chartId}" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.15"/>
            </filter>
            <linearGradient id="whiteKeyGradient${chartId}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#f8f8f8;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="blackKeyGradient${chartId}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#2c2c2c;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
            </linearGradient>
            <radialGradient id="pressedWhiteGradient${chartId}" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:0.9" />
                <stop offset="100%" style="stop-color:#e55555;stop-opacity:1" />
            </radialGradient>
            <radialGradient id="pressedBlackGradient${chartId}" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color:#4ecdc4;stop-opacity:0.9" />
                <stop offset="100%" style="stop-color:#45b7b8;stop-opacity:1" />
            </radialGradient>
        </defs>`;

    // Draw white keys
    whiteKeys.forEach((note, index) => {
        const x = index * whiteKeyWidth;
        const isPressed = chordNotes.some(chordNote => {
            const cleanChordNote = chordNote.replace(/[0-9]/g, '');
            // Check for enharmonic equivalents
            const enharmonicEquivalents = {
                'C#': 'Db', 'Db': 'C#',
                'D#': 'Eb', 'Eb': 'D#',
                'F#': 'Gb', 'Gb': 'F#',
                'G#': 'Ab', 'Ab': 'G#',
                'A#': 'Bb', 'Bb': 'A#'
            };
            return cleanChordNote === note || enharmonicEquivalents[cleanChordNote] === note;
        });

        const fillColor = isPressed ? `url(#pressedWhiteGradient${chartId})` : `url(#whiteKeyGradient${chartId})`;
        const strokeColor = isPressed ? '#ff6b6b' : '#ddd';
        const strokeWidth = isPressed ? '2' : '1';

        svgContent += `
            <rect x="${x}" y="0" width="${whiteKeyWidth}" height="${whiteKeyHeight}"
                  fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"
                  filter="url(#dropShadow${chartId})" rx="3" ry="3" />
            <text x="${x + whiteKeyWidth/2}" y="${whiteKeyHeight - 12}"
                  text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="11"
                  fill="${isPressed ? '#fff' : '#666'}" font-weight="${isPressed ? '700' : '500'}">
                ${note}
            </text>`;
    });

    // Draw black keys
    blackKeys.forEach(({ note, position }) => {
        const x = (position - 1) * whiteKeyWidth + whiteKeyWidth - blackKeyWidth/2;
        const isPressed = chordNotes.some(chordNote => {
            const cleanChordNote = chordNote.replace(/[0-9]/g, '');
            // Check for enharmonic equivalents
            const enharmonicEquivalents = {
                'C#': 'Db', 'Db': 'C#',
                'D#': 'Eb', 'Eb': 'D#',
                'F#': 'Gb', 'Gb': 'F#',
                'G#': 'Ab', 'Ab': 'G#',
                'A#': 'Bb', 'Bb': 'A#'
            };
            return cleanChordNote === note || enharmonicEquivalents[cleanChordNote] === note;
        });

        const fillColor = isPressed ? `url(#pressedBlackGradient${chartId})` : `url(#blackKeyGradient${chartId})`;
        const strokeColor = isPressed ? '#4ecdc4' : '#666';

        svgContent += `
            <rect x="${x}" y="0" width="${blackKeyWidth}" height="${blackKeyHeight}"
                  fill="${fillColor}" stroke="${strokeColor}" stroke-width="1"
                  filter="url(#dropShadow${chartId})" rx="2" ry="2" />
            <text x="${x + blackKeyWidth/2}" y="${blackKeyHeight - 10}"
                  text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="9"
                  fill="${isPressed ? '#000' : '#ccc'}" font-weight="${isPressed ? '700' : '500'}">
                ${note}
            </text>`;
    });

    svgContent += '</svg>';
    return svgContent;
}

// Generate bass fretboard diagram with professional SVG
function generateBassDiagram(chordName) {
    // Parse the chord to handle slash chords correctly
    const chordInfo = parseEnhancedChordName(chordName);
    const rootNote = chordInfo.bassNote || chordInfo.root || chordName.charAt(0);

    // Get the basic chord notes for reference
    const chordNotes = getBasicChordNotes(chordName);
    const fifth = chordNotes.length > 2 ? chordNotes[2] : null;

    // Return just the SVG content for embedding in existing containers
    return generateBassLineSVG(chordName, rootNote, fifth);
}

// Generate practical bass line reference SVG
function generateBassLineSVG(chordName, rootNote, fifth) {
    const width = 200;
    const height = 120;
    const chartId = chordName.replace(/[^a-zA-Z0-9]/g, '');

    // Bass tuning: E A D G (4-string bass)
    const strings = ['G', 'D', 'A', 'E']; // Top to bottom on diagram
    const stringPositions = [20, 40, 60, 80]; // Y positions

    // Find root note positions on each string
    const rootPositions = findNotePositions(rootNote, strings);
    const fifthPositions = fifth ? findNotePositions(fifth, strings) : [];

    let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="background: transparent;">
        <defs>
            <linearGradient id="rootGrad${chartId}" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#d63031;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="fifthGrad${chartId}" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#4ecdc4;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#00b894;stop-opacity:1" />
            </linearGradient>
        </defs>

        <!-- Bass neck representation -->
        <rect x="40" y="15" width="120" height="70" fill="none" stroke="#e0e0e0" stroke-width="1" rx="4"/>

        <!-- Fret lines -->`;

    for (let fret = 1; fret <= 4; fret++) {
        const x = 40 + (fret * 24);
        svgContent += `<line x1="${x}" y1="15" x2="${x}" y2="85" stroke="#bbbbbb" stroke-width="1"/>`;
    }

    // String lines
    strings.forEach((stringNote, index) => {
        const y = stringPositions[index];
        svgContent += `
            <line x1="40" y1="${y}" x2="160" y2="${y}" stroke="#999" stroke-width="2"/>
            <text x="30" y="${y + 4}" font-family="Arial, sans-serif" font-size="10" fill="#ffffff" text-anchor="end">${stringNote}</text>`;
    });

    // Mark root note positions
    rootPositions.forEach(pos => {
        if (pos.fret <= 4) {
            const x = 40 + (pos.fret === 0 ? 0 : pos.fret * 24);
            const y = stringPositions[pos.stringIndex];

            if (pos.fret === 0) {
                // Open string - circle
                svgContent += `<circle cx="35" cy="${y}" r="6" fill="url(#rootGrad${chartId})" stroke="#ffffff" stroke-width="1"/>`;
            } else {
                // Fretted note - circle on fret
                svgContent += `<circle cx="${x}" cy="${y}" r="6" fill="url(#rootGrad${chartId})" stroke="#ffffff" stroke-width="1"/>`;
            }
            svgContent += `<text x="${pos.fret === 0 ? 35 : x}" y="${y + 3}" font-family="Arial, sans-serif" font-size="8" fill="#ffffff" text-anchor="middle" font-weight="bold">${rootNote}</text>`;
        }
    });

    // Mark fifth positions (if available)
    fifthPositions.forEach(pos => {
        if (pos.fret <= 4 && pos.fret > 0) { // Skip open strings for fifths to avoid clutter
            const x = 40 + (pos.fret * 24);
            const y = stringPositions[pos.stringIndex];

            svgContent += `<circle cx="${x}" cy="${y}" r="5" fill="url(#fifthGrad${chartId})" stroke="#ffffff" stroke-width="1"/>`;
            svgContent += `<text x="${x}" y="${y + 2}" font-family="Arial, sans-serif" font-size="7" fill="#000000" text-anchor="middle" font-weight="bold">${fifth}</text>`;
        }
    });

    // Add legend
    svgContent += `
        <text x="${width/2}" y="105" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#ffffff" font-weight="bold">${chordName} Bass Notes</text>
        <circle cx="20" cy="110" r="4" fill="url(#rootGrad${chartId})"/>
        <text x="30" y="114" font-family="Arial, sans-serif" font-size="8" fill="#ffffff">Root (${rootNote})</text>`;

    if (fifth) {
        svgContent += `
            <circle cx="120" cy="110" r="4" fill="url(#fifthGrad${chartId})"/>
            <text x="130" y="114" font-family="Arial, sans-serif" font-size="8" fill="#ffffff">Fifth (${fifth})</text>`;
    }

    svgContent += '</svg>';
    return svgContent;
}

// Helper function to find note positions on bass strings
function findNotePositions(targetNote, strings) {
    const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const enharmonics = {
        'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
    };

    const normalizedTarget = enharmonics[targetNote] || targetNote;
    const targetIndex = noteOrder.indexOf(normalizedTarget);

    if (targetIndex === -1) return [];

    const positions = [];

    strings.forEach((stringNote, stringIndex) => {
        const stringIndex_notes = noteOrder.indexOf(stringNote);
        if (stringIndex_notes === -1) return;

        // Find positions up to 5th fret
        for (let fret = 0; fret <= 4; fret++) {
            const noteAtFret = (stringIndex_notes + fret) % 12;
            if (noteAtFret === targetIndex) {
                positions.push({ stringIndex, fret, note: targetNote });
            }
        }
    });

    return positions;
}

// Helper function to parse enhanced chord names (inversions, extensions, etc.)
function parseEnhancedChordName(chordName) {
    // Handle slash chords (inversions)
    const slashMatch = chordName.match(/^([A-G][#b]?[^/]*?)\/([A-G][#b]?)$/);
    if (slashMatch) {
        return {
            root: slashMatch[1].replace(/[^A-G#b]/, '').charAt(0),
            chord: slashMatch[1],
            bassNote: slashMatch[2],
            isInversion: true
        };
    }

    // Regular chord
    const rootMatch = chordName.match(/^([A-G][#b]?)/);
    return {
        root: rootMatch ? rootMatch[1] : chordName.charAt(0),
        chord: chordName,
        bassNote: null,
        isInversion: false
    };
}

// Get bass position for any note (4-string bass: E-A-D-G from bottom to top)
function getBassPosition(noteName) {
    const bassPositions = {
        // E string (4th string)
        'E': { string: 4, fret: 0 },
        'F': { string: 4, fret: 1 },
        'F#': { string: 4, fret: 2 },
        'Gb': { string: 4, fret: 2 },
        'G': { string: 4, fret: 3 },
        'G#': { string: 4, fret: 4 },
        'Ab': { string: 4, fret: 4 },

        // A string (3rd string)
        'A': { string: 3, fret: 0 },
        'A#': { string: 3, fret: 1 },
        'Bb': { string: 3, fret: 1 },
        'B': { string: 3, fret: 2 },
        'C': { string: 3, fret: 3 },
        'C#': { string: 3, fret: 4 },
        'Db': { string: 3, fret: 4 },

        // D string (2nd string) - for higher notes
        'D': { string: 2, fret: 0 },
        'D#': { string: 2, fret: 1 },
        'Eb': { string: 2, fret: 1 }
    };

    return bassPositions[noteName] || null;
}

// Enhanced bass diagram generation with support for inversions and extensions
function generateBassSVG(chordName, chordNotes, rootNote) {
    const chartId = chordName.replace(/[^a-zA-Z0-9]/g, '');

    // Parse chord name for better understanding
    const chordInfo = parseEnhancedChordName(chordName);
    const bassNote = chordInfo.bassNote || chordInfo.root;

    // Find the best bass position for the bass note
    const bassPosition = getBassPosition(bassNote);

    if (!bassPosition) {
        return generateSimpleBassSVG(chordName, chordNotes, rootNote, chartId);
    }

    // Create clean, focused bass diagram
    const width = 200;
    const height = 120;

    // Determine display info based on chord type
    let displayText = bassNote;
    let roleText = chordInfo.isInversion ? 'Bass Note' : 'Root';
    let description = '';

    if (chordInfo.isInversion) {
        description = `${chordInfo.chord} with ${bassNote} in bass`;
    } else {
        description = `${chordName} root position`;
    }

    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background: #1a1a1a; border-radius: 8px;">
        <defs>
            <radialGradient id="bassNote${chartId}" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#e55555;stop-opacity:1" />
            </radialGradient>
            <radialGradient id="bassInversion${chartId}" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color:#4ecdc4;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#45b7b8;stop-opacity:1" />
            </radialGradient>
        </defs>

        <!-- Header -->
        <text x="${width/2}" y="18" text-anchor="middle" font-family="Inter, Arial, sans-serif"
              font-size="11" fill="#e8e8e8" font-weight="600">Bass</text>

        <!-- Main bass note circle -->
        <circle cx="${width/2}" cy="50" r="18"
                fill="url(#${chordInfo.isInversion ? 'bassInversion' : 'bassNote'}${chartId})"
                stroke="${chordInfo.isInversion ? '#4ecdc4' : '#ff6b6b'}" stroke-width="2" />

        <!-- Bass note -->
        <text x="${width/2}" y="57" text-anchor="middle" font-family="Inter, Arial, sans-serif"
              font-size="16" fill="#fff" font-weight="700">${displayText}</text>

        <!-- Role indicator -->
        <text x="${width/2}" y="75" text-anchor="middle" font-family="Inter, Arial, sans-serif"
              font-size="9" fill="#ccc" font-weight="500">${roleText}</text>

        <!-- String and fret info -->
        <text x="${width/2}" y="88" text-anchor="middle" font-family="Inter, Arial, sans-serif"
              font-size="8" fill="#999">String ${bassPosition.string} • Fret ${bassPosition.fret}</text>

        <!-- Description -->
        <text x="${width/2}" y="105" text-anchor="middle" font-family="Inter, Arial, sans-serif"
              font-size="8" fill="#888">${description}</text>
    </svg>`;
}

// Fallback simple bass diagram for unknown chords
function generateSimpleBassSVG(chordName, chordNotes, rootNote, chartId) {
    const width = 200;
    const height = 100;

    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background: #1a1a1a; border-radius: 8px;">
        <defs>
            <radialGradient id="rootGrad${chartId}" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#e55555;stop-opacity:1" />
            </radialGradient>
        </defs>

        <text x="${width/2}" y="18" text-anchor="middle" font-family="Inter, Arial, sans-serif"
              font-size="12" fill="#e8e8e8" font-weight="600">Bass</text>

        <circle cx="${width/2}" cy="45" r="16" fill="url(#rootGrad${chartId})" stroke="#ff6b6b" stroke-width="2" />
        <text x="${width/2}" y="51" text-anchor="middle" font-family="Inter, Arial, sans-serif"
              font-size="14" fill="#fff" font-weight="700">${rootNote}</text>

        <text x="${width/2}" y="72" text-anchor="middle" font-family="Inter, Arial, sans-serif"
              font-size="10" fill="#ccc">Root Note</text>

        <text x="${width/2}" y="88" text-anchor="middle" font-family="Inter, Arial, sans-serif"
              font-size="9" fill="#4ecdc4">${chordNotes.join(' • ')}</text>
    </svg>`;
}

// Helper function to get basic chord notes
function getBasicChordNotes(chordName) {
    // Handle slash chords (e.g., C/E) - extract base chord before the slash
    let baseChord = chordName.split('/')[0];

    // Extract root note properly (handle sharps and flats)
    let root = '';
    if (baseChord.length >= 2 && (baseChord[1] === '#' || baseChord[1] === 'b')) {
        root = baseChord.substring(0, 2);
    } else {
        root = baseChord[0];
    }

    const isMinor = baseChord.includes('m') && !baseChord.includes('maj');

    // Simple triad construction with proper enharmonic equivalents
    const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    // Handle flat notes - convert to sharps for calculation
    const enharmonics = {
        'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
    };

    // Reverse mapping for proper enharmonic spelling in results
    const preferredSpelling = {
        'C#': 'C#', 'D#': 'Eb', 'F#': 'F#', 'G#': 'Ab', 'A#': 'Bb'
    };

    const normalizedRoot = enharmonics[root] || root;
    const rootIndex = noteOrder.indexOf(normalizedRoot);

    if (rootIndex === -1) return [root];

    const third = isMinor ? 3 : 4; // Minor 3rd = 3 semitones, Major 3rd = 4 semitones
    const fifth = 7; // Perfect 5th = 7 semitones

    // Calculate chord tones
    const thirdNote = noteOrder[(rootIndex + third) % 12];
    const fifthNote = noteOrder[(rootIndex + fifth) % 12];

    // Use preferred enharmonic spelling for common readability
    const displayThird = preferredSpelling[thirdNote] || thirdNote;
    const displayFifth = preferredSpelling[fifthNote] || fifthNote;

    return [
        root, // Keep original root notation
        displayThird,
        displayFifth
    ];
}

// Helper function to calculate note at specific fret
function getNoteAtFret(openString, fret) {
    const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const openIndex = noteOrder.indexOf(openString);

    if (openIndex === -1) return openString;

    return noteOrder[(openIndex + fret) % 12];
}

// Generate all three diagrams for a chord
function generateChordDiagrams(chordName) {
    return {
        guitar: generateGuitarDiagram(chordName),
        piano: generatePianoDiagram(chordName),
        bass: generateBassDiagram(chordName)
    };
}

// Make functions and data available globally
window.generateGuitarDiagram = generateGuitarDiagram;
window.generatePianoDiagram = generatePianoDiagram;
window.generateBassDiagram = generateBassDiagram;
window.generateChordDiagrams = generateChordDiagrams;
window.initializePianoChart = initializePianoChart;
window.guitarChords = guitarChords;