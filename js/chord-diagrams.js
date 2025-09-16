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
                // Calculate position based on the lowest fret
                const activeFrets = chord.frets.filter(f => f !== null && f !== 0);
                const minFret = activeFrets.length > 0 ? Math.min(...activeFrets) : 1;
                const position = Math.max(1, minFret > 4 ? minFret - 1 : 1);

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

// Generate piano diagram with professional SVG
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

    // Create unique ID for this chart
    const chartId = `piano-chart-${chordName.replace(/[^a-zA-Z0-9]/g, '')}`;

    // Create container with SVG
    const container = `
        <div class="piano-diagram">
            <div class="chord-name">${chordName}</div>
            <div id="${chartId}" class="svg-piano-container">
                ${generatePianoSVG(chordName, chordNotes)}
            </div>
            <div class="chord-notes">Notes: ${chordNotes.join(', ')}</div>
        </div>
    `;

    return container;
}

// Generate professional piano SVG
function generatePianoSVG(chordName, chordNotes) {
    const chartId = chordName.replace(/[^a-zA-Z0-9]/g, '');
    const width = 280;
    const height = 120;
    const whiteKeyWidth = 40;
    const whiteKeyHeight = 100;
    const blackKeyWidth = 24;
    const blackKeyHeight = 65;

    // Define piano layout for one octave
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const blackKeys = [
        { note: 'C#', position: 1 },
        { note: 'D#', position: 2 },
        { note: 'F#', position: 4 },
        { note: 'G#', position: 5 },
        { note: 'A#', position: 6 }
    ];

    let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="whiteKeyGradient${chartId}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#f0f0f0;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="blackKeyGradient${chartId}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#2c2c2c;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="pressedWhiteGradient${chartId}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#ffd93d;stop-opacity:0.8" />
                <stop offset="100%" style="stop-color:#ffcc02;stop-opacity:0.9" />
            </linearGradient>
            <linearGradient id="pressedBlackGradient${chartId}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:0.9" />
                <stop offset="100%" style="stop-color:#e55656;stop-opacity:1" />
            </linearGradient>
        </defs>`;

    // Draw white keys
    whiteKeys.forEach((note, index) => {
        const x = index * whiteKeyWidth;
        const isPressed = chordNotes.some(chordNote =>
            chordNote.replace(/[0-9]/g, '') === note
        );

        const fillColor = isPressed ? `url(#pressedWhiteGradient${chartId})` : `url(#whiteKeyGradient${chartId})`;
        const strokeColor = isPressed ? '#ffd93d' : '#cccccc';
        const strokeWidth = isPressed ? '2' : '1';

        svgContent += `
            <rect x="${x}" y="0" width="${whiteKeyWidth}" height="${whiteKeyHeight}"
                  fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />
            <text x="${x + whiteKeyWidth/2}" y="${whiteKeyHeight - 10}"
                  text-anchor="middle" font-family="Arial, sans-serif" font-size="12"
                  fill="${isPressed ? '#000' : '#666'}" font-weight="${isPressed ? 'bold' : 'normal'}">
                ${note}
            </text>`;
    });

    // Draw black keys
    blackKeys.forEach(({ note, position }) => {
        const x = (position - 1) * whiteKeyWidth + whiteKeyWidth - blackKeyWidth/2;
        const isPressed = chordNotes.some(chordNote =>
            chordNote.replace(/[0-9]/g, '') === note
        );

        const fillColor = isPressed ? `url(#pressedBlackGradient${chartId})` : `url(#blackKeyGradient${chartId})`;
        const strokeColor = isPressed ? '#ff6b6b' : '#999999';

        svgContent += `
            <rect x="${x}" y="0" width="${blackKeyWidth}" height="${blackKeyHeight}"
                  fill="${fillColor}" stroke="${strokeColor}" stroke-width="1" />
            <text x="${x + blackKeyWidth/2}" y="${blackKeyHeight - 8}"
                  text-anchor="middle" font-family="Arial, sans-serif" font-size="10"
                  fill="${isPressed ? '#fff' : '#ccc'}" font-weight="${isPressed ? 'bold' : 'normal'}">
                ${note}
            </text>`;
    });

    svgContent += '</svg>';
    return svgContent;
}

// Generate bass fretboard diagram with professional SVG
export function generateBassDiagram(chordName) {
    // Get chord notes using Tonal.js if available
    let chordNotes = [];
    const rootNote = chordName.replace(/[^A-G#b]/g, '');

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
    const chartId = `bass-chart-${chordName.replace(/[^a-zA-Z0-9]/g, '')}`;

    // Create container with SVG
    const container = `
        <div class="bass-diagram">
            <div class="chord-name">${chordName} Bass</div>
            <div id="${chartId}" class="svg-bass-container">
                ${generateBassSVG(chordName, chordNotes, rootNote)}
            </div>
            <div class="bass-info">Chord tones: ${chordNotes.join(', ')}</div>
        </div>
    `;

    return container;
}

// Generate professional bass fretboard SVG
function generateBassSVG(chordName, chordNotes, rootNote) {
    const chartId = chordName.replace(/[^a-zA-Z0-9]/g, '');
    const width = 300;
    const height = 160;
    const fretWidth = 45;
    const stringSpacing = 30;
    const startY = 20;
    const numFrets = 5;

    // 4-string bass tuning (from top to bottom visually)
    const bassStrings = ['G', 'D', 'A', 'E'];

    let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="neckGradient${chartId}" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#8B4513;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#A0522D;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#8B4513;stop-opacity:1" />
            </linearGradient>
            <radialGradient id="rootNoteGradient${chartId}" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color:#ffd93d;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ffcc02;stop-opacity:1" />
            </radialGradient>
            <radialGradient id="chordNoteGradient${chartId}" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color:#4ecdc4;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#45b7b8;stop-opacity:1" />
            </radialGradient>
        </defs>`;

    // Draw fretboard background
    svgContent += `<rect x="0" y="${startY}" width="${width}" height="${bassStrings.length * stringSpacing}"
                        fill="url(#neckGradient${chartId})" stroke="#654321" stroke-width="2" />`;

    // Draw fret lines
    for (let fret = 1; fret <= numFrets; fret++) {
        const x = fret * fretWidth;
        svgContent += `<line x1="${x}" y1="${startY}" x2="${x}" y2="${startY + bassStrings.length * stringSpacing}"
                            stroke="#666" stroke-width="2" />`;
    }

    // Draw strings and fret markers
    bassStrings.forEach((stringNote, stringIndex) => {
        const y = startY + (stringIndex + 0.5) * stringSpacing;

        // Draw string line
        svgContent += `<line x1="0" y1="${y}" x2="${width}" y2="${y}"
                            stroke="#C0C0C0" stroke-width="2" />`;

        // Draw string label
        svgContent += `<text x="10" y="${y - 5}" font-family="Arial, sans-serif" font-size="12"
                            fill="#fff" font-weight="bold">${stringNote}</text>`;

        // Draw fret positions
        for (let fret = 0; fret <= numFrets; fret++) {
            const fretNote = getNoteAtFret(stringNote, fret);
            const x = fret === 0 ? 25 : fret * fretWidth + fretWidth/2;

            // Check if this note is in the chord
            const isRoot = fretNote === rootNote;
            const isChordTone = chordNotes.some(note => note.replace(/[0-9]/g, '') === fretNote);

            if (isRoot || isChordTone) {
                const radius = isRoot ? 12 : 8;
                const fill = isRoot ? `url(#rootNoteGradient${chartId})` : `url(#chordNoteGradient${chartId})`;
                const stroke = isRoot ? '#ffd93d' : '#4ecdc4';

                // Draw note circle
                svgContent += `<circle cx="${x}" cy="${y}" r="${radius}"
                                    fill="${fill}" stroke="${stroke}" stroke-width="2" />`;

                // Draw note label
                svgContent += `<text x="${x}" y="${y + 4}" text-anchor="middle"
                                    font-family="Arial, sans-serif" font-size="10"
                                    fill="#000" font-weight="bold">${fretNote}</text>`;

                // Draw fret number below for non-open strings
                if (fret > 0) {
                    svgContent += `<text x="${x}" y="${startY + bassStrings.length * stringSpacing + 15}"
                                        text-anchor="middle" font-family="Arial, sans-serif" font-size="10"
                                        fill="#ccc">${fret}</text>`;
                }
            }
        }
    });

    // Add fret position indicators
    svgContent += `<text x="25" y="${startY + bassStrings.length * stringSpacing + 15}"
                        text-anchor="middle" font-family="Arial, sans-serif" font-size="10"
                        fill="#ccc">0</text>`;

    // Add legend
    svgContent += `<circle cx="20" cy="${height - 25}" r="6" fill="url(#rootNoteGradient${chartId})" stroke="#ffd93d" stroke-width="1" />`;
    svgContent += `<text x="35" y="${height - 20}" font-family="Arial, sans-serif" font-size="10" fill="#ccc">Root</text>`;
    svgContent += `<circle cx="80" cy="${height - 25}" r="4" fill="url(#chordNoteGradient${chartId})" stroke="#4ecdc4" stroke-width="1" />`;
    svgContent += `<text x="90" y="${height - 20}" font-family="Arial, sans-serif" font-size="10" fill="#ccc">Chord Tone</text>`;

    svgContent += '</svg>';
    return svgContent;
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