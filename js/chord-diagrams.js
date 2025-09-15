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
    'Bbm': { name: 'Bb Minor', frets: [null, 1, 3, 3, 2, 1], fingers: [null, 1, 4, 4, 2, 1] }
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

// Generate guitar chord diagram using SVGuitar
export function generateGuitarDiagram(chordName) {
    const chord = guitarChords[chordName] || guitarChords[chordName.replace('maj', '')] || null;

    if (!chord) {
        return `<div class="guitar-diagram">
            <div class="chord-name">${chordName}</div>
            <div class="diagram-placeholder">Guitar diagram not available</div>
        </div>`;
    }

    // Create unique ID for this chart
    const chartId = `guitar-chart-${chordName.replace(/[^a-zA-Z0-9]/g, '')}`;

    // Create container with SVG placeholder
    const container = `
        <div class="guitar-diagram">
            <div class="chord-name">${chord.name}</div>
            <div id="${chartId}" class="svg-guitar-container"></div>
        </div>
    `;

    // Generate SVGuitar chart after DOM is ready
    setTimeout(() => {
        const element = document.getElementById(chartId);
        if (element && window.svguitar) {
            // Convert chord data to SVGuitar format
            const fingers = [];

            chord.frets.forEach((fret, stringIndex) => {
                const guitarString = stringIndex + 1; // SVGuitar uses 1-6 indexing

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
                new window.svguitar.SVGuitarChord(element)
                    .configure({
                        style: 'normal',
                        orientation: 'vertical',
                        strings: 6,
                        frets: 5,
                        position: 0,
                        tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
                        strokeWidth: 2,
                        backgroundColor: 'transparent',
                        strokeColor: '#e0e0e0',
                        textColor: '#ffffff',
                        color: '#ffd93d',
                        fretColor: '#666666',
                        stringColor: '#888888',
                        mutedStringColor: '#ff6b6b',
                        openStringColor: '#4ecdc4',
                        fretLabelColor: '#ffffff',
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

// Generate piano diagram
export function generatePianoDiagram(chordName) {
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

    let html = `<div class="piano-diagram">
        <div class="chord-name">${chordName}</div>
        <div class="piano-keys">`;

    // Generate one octave of keys
    const keyOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    keyOrder.forEach(note => {
        const keyInfo = pianoKeys[note];
        const isPressed = chordNotes.some(chordNote =>
            chordNote.replace(/[0-9]/g, '') === note
        );

        const keyClass = `piano-key ${keyInfo.type}${isPressed ? ' pressed' : ''}`;

        html += `<div class="${keyClass}" data-note="${note}">
            <span class="note-label">${note}</span>
        </div>`;
    });

    html += `</div>
        <div class="chord-notes">Notes: ${chordNotes.join(', ')}</div>
    </div>`;

    return html;
}

// Generate bass fretboard diagram
export function generateBassDiagram(chordName) {
    // Get root note of the chord
    const rootNote = chordName.replace(/[^A-G#b]/g, '');

    let html = `<div class="bass-diagram">
        <div class="chord-name">${chordName} Bass</div>
        <div class="bass-fretboard">`;

    // Generate strings (4-string bass)
    bassFretboard.strings.forEach((stringNote, stringIndex) => {
        html += `<div class="bass-string" data-string="${stringNote}">
            <div class="string-label">${stringNote}</div>`;

        // Generate frets for this string
        for (let fret = 0; fret <= 5; fret++) {
            const fretNote = getNoteAtFret(stringNote, fret);
            const isRoot = fretNote === rootNote;
            const fretClass = `bass-fret${isRoot ? ' root-note' : ''}${fret === 0 ? ' open' : ''}`;

            html += `<div class="${fretClass}" data-fret="${fret}" data-note="${fretNote}">
                ${isRoot ? '●' : ''}
                <span class="fret-note">${fretNote}</span>
            </div>`;
        }

        html += `</div>`;
    });

    html += `</div>
        <div class="bass-info">Root note positions for ${rootNote}</div>
    </div>`;

    return html;
}

// Helper function to get basic chord notes
function getBasicChordNotes(chordName) {
    const root = chordName.replace(/[^A-G#b]/g, '');
    const isMinor = chordName.includes('m') && !chordName.includes('maj');

    // Simple triad construction
    const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const rootIndex = noteOrder.indexOf(root);

    if (rootIndex === -1) return [root];

    const third = isMinor ? 3 : 4; // Minor 3rd = 3 semitones, Major 3rd = 4 semitones
    const fifth = 7; // Perfect 5th = 7 semitones

    return [
        root,
        noteOrder[(rootIndex + third) % 12],
        noteOrder[(rootIndex + fifth) % 12]
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
export function generateChordDiagrams(chordName) {
    return {
        guitar: generateGuitarDiagram(chordName),
        piano: generatePianoDiagram(chordName),
        bass: generateBassDiagram(chordName)
    };
}

// Make functions available globally
window.generateGuitarDiagram = generateGuitarDiagram;
window.generatePianoDiagram = generatePianoDiagram;
window.generateBassDiagram = generateBassDiagram;
window.generateChordDiagrams = generateChordDiagrams;