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

    // Create container with standardized styling
    const container = `
        <div class="chord-diagram guitar-diagram">
            <div class="chord-name">${chordName} Guitar</div>
            <div id="${chartId}" class="svg-container svg-guitar-container"></div>
            <div class="chord-info">
                <span class="chord-notes">Fingering: ${chord.name}</span>
            </div>
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

// Generate enhanced piano diagram with custom SVG
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

    // Create container with standardized styling
    const container = `
        <div class="chord-diagram piano-diagram">
            <div class="chord-name">${chordName} Piano</div>
            <div id="${chartId}" class="svg-container svg-piano-container">
                ${generateEnhancedPianoSVG(chordName, chordNotes)}
            </div>
            <div class="chord-info">
                <span class="chord-notes">Notes: ${chordNotes.join(' • ')}</span>
            </div>
        </div>
    `;

    return container;
}

// Generate enhanced professional piano SVG
function generateEnhancedPianoSVG(chordName, chordNotes) {
    const chartId = chordName.replace(/[^a-zA-Z0-9]/g, '');
    const width = 240;  // More reasonable width
    const height = 120;
    const whiteKeyWidth = 24;
    const whiteKeyHeight = 80;
    const blackKeyWidth = 14;
    const blackKeyHeight = 50;

    // 9 white keys: C D E F G A B C D
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D'];
    const blackKeys = [
        { note: 'C#', position: 1 },
        { note: 'D#', position: 2 },
        { note: 'F#', position: 4 },
        { note: 'G#', position: 5 },
        { note: 'A#', position: 6 },
        { note: 'C#', position: 8 }
    ];

    let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="background: #f8f8f8; border-radius: 6px; border: 1px solid #ccc;">
        <defs>
            <filter id="dropShadow${chartId}" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="1" flood-color="#000" flood-opacity="0.15"/>
            </filter>
            <linearGradient id="whiteKeyGrad${chartId}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#f0f0f0;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="blackKeyGrad${chartId}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#2c2c2c;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
            </linearGradient>
            <radialGradient id="pressedWhiteGrad${chartId}" cx="50%" cy="30%" r="70%">
                <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:0.9" />
                <stop offset="100%" style="stop-color:#e55555;stop-opacity:1" />
            </radialGradient>
            <radialGradient id="pressedBlackGrad${chartId}" cx="50%" cy="30%" r="70%">
                <stop offset="0%" style="stop-color:#4ecdc4;stop-opacity:0.9" />
                <stop offset="100%" style="stop-color:#45b7b8;stop-opacity:1" />
            </radialGradient>
        </defs>`;

    const startX = 6;
    const startY = 10;

    console.log(`Drawing ${whiteKeys.length} white keys for ${chordName}`);

    // Draw all white keys first
    whiteKeys.forEach((note, index) => {
        const x = startX + index * whiteKeyWidth;
        const isPressed = chordNotes.some(chordNote =>
            chordNote.replace(/[0-9]/g, '') === note
        );

        console.log(`White key ${index + 1}: ${note} at x=${x}, pressed=${isPressed}`);

        const fillColor = isPressed ? `url(#pressedWhiteGrad${chartId})` : `url(#whiteKeyGrad${chartId})`;
        const strokeColor = isPressed ? '#ff6b6b' : '#ddd';
        const strokeWidth = isPressed ? '2' : '1';

        svgContent += `
            <rect x="${x}" y="${startY}" width="${whiteKeyWidth}" height="${whiteKeyHeight}"
                  fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"
                  filter="url(#dropShadow${chartId})" rx="2" ry="2" />`;
    });

    // Draw black keys on top
    blackKeys.forEach(({ note, position }) => {
        const x = startX + (position - 1) * whiteKeyWidth + whiteKeyWidth - blackKeyWidth/2;
        const isPressed = chordNotes.some(chordNote =>
            chordNote.replace(/[0-9]/g, '') === note
        );

        const fillColor = isPressed ? `url(#pressedBlackGrad${chartId})` : `url(#blackKeyGrad${chartId})`;
        const strokeColor = isPressed ? '#4ecdc4' : '#333';

        svgContent += `
            <rect x="${x}" y="${startY}" width="${blackKeyWidth}" height="${blackKeyHeight}"
                  fill="${fillColor}" stroke="${strokeColor}" stroke-width="1"
                  filter="url(#dropShadow${chartId})" rx="2" ry="2" />`;
    });

    // Draw white key labels (on top so they're visible)
    whiteKeys.forEach((note, index) => {
        const x = startX + index * whiteKeyWidth;
        const isPressed = chordNotes.some(chordNote =>
            chordNote.replace(/[0-9]/g, '') === note
        );

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
        const isPressed = chordNotes.some(chordNote =>
            chordNote.replace(/[0-9]/g, '') === note
        );

        svgContent += `
            <text x="${x + blackKeyWidth/2}" y="${startY + blackKeyHeight - 8}"
                  text-anchor="middle" font-family="Arial, sans-serif" font-size="9" font-weight="600"
                  fill="${isPressed ? '#000' : '#ccc'}">
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
        const isPressed = chordNotes.some(chordNote =>
            chordNote.replace(/[0-9]/g, '') === note
        );

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
        const isPressed = chordNotes.some(chordNote =>
            chordNote.replace(/[0-9]/g, '') === note
        );

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

    // Create container with standardized styling
    const container = `
        <div class="chord-diagram bass-diagram">
            <div class="chord-name">${chordName} Bass</div>
            <div id="${chartId}" class="svg-container svg-bass-container">
                ${generateBassSVG(chordName, chordNotes, rootNote)}
            </div>
            <div class="chord-info">
                <span class="chord-notes">Notes: ${chordNotes.join(' • ')}</span>
            </div>
        </div>
    `;

    return container;
}

// Generate bass fretboard diagram showing specific fingering positions
function generateBassSVG(chordName, chordNotes, rootNote) {
    const chartId = chordName.replace(/[^a-zA-Z0-9]/g, '');

    // Bass fingering patterns for common chords (4-string bass: E-A-D-G from bottom to top)
    const bassPatterns = {
        'C': {
            positions: [
                { string: 3, fret: 3, note: 'C', finger: 3 }, // Root
                { string: 2, fret: 2, note: 'E', finger: 2 }, // Third
                { string: 1, fret: 5, note: 'G', finger: 4 }  // Fifth
            ],
            root: 'C'
        },
        'G': {
            positions: [
                { string: 4, fret: 3, note: 'G', finger: 3 }, // Root
                { string: 3, fret: 2, note: 'B', finger: 2 }, // Third
                { string: 2, fret: 5, note: 'D', finger: 4 }  // Fifth
            ],
            root: 'G'
        },
        'Am': {
            positions: [
                { string: 3, fret: 0, note: 'A', finger: 0 }, // Root
                { string: 2, fret: 3, note: 'C', finger: 3 }, // Third
                { string: 2, fret: 2, note: 'E', finger: 2 }  // Fifth
            ],
            root: 'A'
        },
        'F': {
            positions: [
                { string: 4, fret: 1, note: 'F', finger: 1 }, // Root
                { string: 3, fret: 3, note: 'A', finger: 3 }, // Third
                { string: 2, fret: 3, note: 'C', finger: 3 }  // Fifth
            ],
            root: 'F'
        },
        'D': {
            positions: [
                { string: 2, fret: 5, note: 'D', finger: 4 }, // Root
                { string: 1, fret: 4, note: 'F#', finger: 3 }, // Third
                { string: 3, fret: 0, note: 'A', finger: 0 }   // Fifth
            ],
            root: 'D'
        },
        'Em': {
            positions: [
                { string: 4, fret: 0, note: 'E', finger: 0 }, // Root
                { string: 1, fret: 3, note: 'G', finger: 3 }, // Third
                { string: 3, fret: 2, note: 'B', finger: 2 }  // Fifth
            ],
            root: 'E'
        },
        'Dm': {
            positions: [
                { string: 2, fret: 5, note: 'D', finger: 4 }, // Root
                { string: 2, fret: 3, note: 'F', finger: 2 }, // Third
                { string: 3, fret: 0, note: 'A', finger: 0 }  // Fifth
            ],
            root: 'D'
        },
        'A': {
            positions: [
                { string: 3, fret: 0, note: 'A', finger: 0 }, // Root
                { string: 2, fret: 4, note: 'C#', finger: 4 }, // Third
                { string: 2, fret: 2, note: 'E', finger: 2 }   // Fifth
            ],
            root: 'A'
        },
        'E': {
            positions: [
                { string: 4, fret: 0, note: 'E', finger: 0 }, // Root
                { string: 1, fret: 4, note: 'G#', finger: 4 }, // Third
                { string: 3, fret: 2, note: 'B', finger: 2 }   // Fifth
            ],
            root: 'E'
        },
        'Bm': {
            positions: [
                { string: 3, fret: 2, note: 'B', finger: 2 }, // Root
                { string: 2, fret: 5, note: 'D', finger: 4 }, // Third
                { string: 1, fret: 4, note: 'F#', finger: 3 }  // Fifth
            ],
            root: 'B'
        }
    };

    const pattern = bassPatterns[chordName] || bassPatterns[chordName.replace('maj', '')] || null;

    if (!pattern) {
        return generateSimpleBassSVG(chordName, chordNotes, rootNote, chartId);
    }

    const width = 220;
    const height = 140;
    const fretboardWidth = 160;
    const fretboardHeight = 100;
    const stringSpacing = 20;
    const fretSpacing = 25;
    const startX = (width - fretboardWidth) / 2;
    const startY = 25;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background: #1a1a1a; border-radius: 8px;">
        <defs>
            <filter id="shadow${chartId}" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.3"/>
            </filter>
            <radialGradient id="rootNote${chartId}" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#e55555;stop-opacity:1" />
            </radialGradient>
            <radialGradient id="chordNote${chartId}" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color:#4ecdc4;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#45b7b8;stop-opacity:1" />
            </radialGradient>
        </defs>`;

    // Draw strings (4 strings: G-D-A-E from top to bottom)
    const stringNames = ['G', 'D', 'A', 'E'];
    for (let i = 0; i < 4; i++) {
        const y = startY + i * stringSpacing;
        svg += `<line x1="${startX}" y1="${y}" x2="${startX + fretboardWidth}" y2="${y}"
                stroke="#666" stroke-width="2" />`;

        // String labels
        svg += `<text x="${startX - 15}" y="${y + 4}" font-family="Inter, Arial, sans-serif"
                font-size="10" fill="#ccc" text-anchor="middle">${stringNames[i]}</text>`;
    }

    // Draw frets
    for (let i = 0; i <= 6; i++) {
        const x = startX + i * fretSpacing;
        const strokeWidth = i === 0 ? 4 : 1; // Nut is thicker
        const color = i === 0 ? '#fff' : '#555';
        svg += `<line x1="${x}" y1="${startY}" x2="${x}" y2="${startY + 3 * stringSpacing}"
                stroke="${color}" stroke-width="${strokeWidth}" />`;

        // Fret numbers
        if (i > 0) {
            svg += `<text x="${x - fretSpacing/2}" y="${startY + 3 * stringSpacing + 15}"
                    font-family="Inter, Arial, sans-serif" font-size="9" fill="#888" text-anchor="middle">${i}</text>`;
        }
    }

    // Draw finger positions
    pattern.positions.forEach(pos => {
        const x = startX + pos.fret * fretSpacing - fretSpacing/2;
        const y = startY + (pos.string - 1) * stringSpacing;
        const isRoot = pos.note === pattern.root;
        const gradient = isRoot ? `url(#rootNote${chartId})` : `url(#chordNote${chartId})`;
        const strokeColor = isRoot ? '#ff6b6b' : '#4ecdc4';

        if (pos.fret === 0) {
            // Open string indicator
            svg += `<circle cx="${startX - 10}" cy="${y}" r="6" fill="none" stroke="${strokeColor}" stroke-width="2" />`;
            svg += `<text x="${startX - 10}" y="${y + 3}" font-family="Inter, Arial, sans-serif"
                    font-size="8" fill="${strokeColor}" text-anchor="middle" font-weight="bold">O</text>`;
        } else {
            // Fretted note
            svg += `<circle cx="${x}" cy="${y}" r="8" fill="${gradient}" stroke="${strokeColor}" stroke-width="2"
                    filter="url(#shadow${chartId})" />`;
            svg += `<text x="${x}" y="${y + 3}" font-family="Inter, Arial, sans-serif"
                    font-size="10" fill="#fff" text-anchor="middle" font-weight="bold">${pos.finger || pos.note}</text>`;
        }
    });

    // Title and notes
    svg += `<text x="${width/2}" y="15" text-anchor="middle" font-family="Inter, Arial, sans-serif"
            font-size="12" fill="#e8e8e8" font-weight="600">Bass</text>`;

    svg += `<text x="${width/2}" y="${height - 5}" text-anchor="middle" font-family="Inter, Arial, sans-serif"
            font-size="9" fill="#4ecdc4">Notes: ${chordNotes.join(' • ')}</text>`;

    svg += '</svg>';
    return svg;
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