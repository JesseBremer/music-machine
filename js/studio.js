/**
 * Music Machine - Studio
 * Intelligent note and chord suggestion system
 */

// Studio state
const studioState = {
    selectedNote: null,
    selectedChord: null,
    audioContext: null
};

// Available notes
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Available chord types
const CHORD_TYPES = [
    { symbol: '', name: 'Major', suffix: '' },
    { symbol: 'm', name: 'Minor', suffix: 'm' },
    { symbol: '7', name: 'Dominant 7th', suffix: '7' },
    { symbol: 'maj7', name: 'Major 7th', suffix: 'maj7' },
    { symbol: 'm7', name: 'Minor 7th', suffix: 'm7' },
    { symbol: 'sus2', name: 'Suspended 2nd', suffix: 'sus2' },
    { symbol: 'sus4', name: 'Suspended 4th', suffix: 'sus4' },
    { symbol: 'dim', name: 'Diminished', suffix: 'dim' },
    { symbol: 'aug', name: 'Augmented', suffix: 'aug' },
    { symbol: '6', name: 'Major 6th', suffix: '6' },
    { symbol: 'm6', name: 'Minor 6th', suffix: 'm6' },
    { symbol: '9', name: '9th', suffix: '9' },
    { symbol: 'add9', name: 'Add 9th', suffix: 'add9' }
];

// Available scale types
const SCALE_TYPES = [
    'major', 'minor', 'harmonic minor', 'melodic minor',
    'dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian',
    'major pentatonic', 'minor pentatonic', 'blues'
];

/**
 * Initialize the Studio page
 */
function initStudio() {
    renderNoteGrid();
    renderChordRootSelect();
    renderChordTypeGrid();
    setupEventListeners();
}

/**
 * Render the note selection grid
 */
function renderNoteGrid() {
    const noteGrid = document.getElementById('note-grid');
    noteGrid.innerHTML = '';

    NOTES.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = 'option-card';
        noteCard.style.textAlign = 'center';
        noteCard.style.padding = 'var(--spacing-md)';

        noteCard.innerHTML = `
            <h4 style="font-size: var(--font-size-xxl); margin: 0; color: var(--secondary-color);">${note}</h4>
        `;

        noteCard.addEventListener('click', () => selectNote(note, noteCard));
        noteGrid.appendChild(noteCard);
    });
}

/**
 * Render the chord root note dropdown
 */
function renderChordRootSelect() {
    const select = document.getElementById('chord-root-select');

    NOTES.forEach(note => {
        const option = document.createElement('option');
        option.value = note;
        option.textContent = note;
        select.appendChild(option);
    });

    select.addEventListener('change', (e) => {
        const root = e.target.value;
        if (root) {
            // Enable chord type selection
            document.getElementById('chord-type-grid').style.opacity = '1';
            document.getElementById('chord-type-grid').style.pointerEvents = 'auto';
        } else {
            // Disable chord type selection
            document.getElementById('chord-type-grid').style.opacity = '0.5';
            document.getElementById('chord-type-grid').style.pointerEvents = 'none';

            // Clear chord type selection
            document.querySelectorAll('#chord-type-grid .option-card').forEach(card => {
                card.classList.remove('selected');
            });
        }
    });
}

/**
 * Render the chord type selection grid
 */
function renderChordTypeGrid() {
    const chordTypeGrid = document.getElementById('chord-type-grid');
    chordTypeGrid.innerHTML = '';
    chordTypeGrid.style.opacity = '0.5';
    chordTypeGrid.style.pointerEvents = 'none';

    CHORD_TYPES.forEach(type => {
        const typeCard = document.createElement('div');
        typeCard.className = 'option-card';
        typeCard.style.textAlign = 'center';
        typeCard.style.padding = 'var(--spacing-sm)';

        typeCard.innerHTML = `
            <h4 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-xs); color: var(--secondary-color);">${type.symbol || 'Major'}</h4>
            <p style="font-size: var(--font-size-small); color: var(--text-secondary); margin: 0;">${type.name}</p>
        `;

        typeCard.addEventListener('click', () => {
            const root = document.getElementById('chord-root-select').value;
            if (root) {
                selectChord(root, type, typeCard);
            }
        });

        chordTypeGrid.appendChild(typeCard);
    });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Any additional global event listeners can go here
}

/**
 * Handle note selection
 */
function selectNote(note, clickedCard) {
    // Clear chord selection
    studioState.selectedChord = null;
    document.getElementById('chord-root-select').value = '';
    document.querySelectorAll('#chord-type-grid .option-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Update note selection UI
    document.querySelectorAll('#note-grid .option-card').forEach(card => {
        card.classList.remove('selected');
    });
    clickedCard.classList.add('selected');

    // Update state
    studioState.selectedNote = note;

    // Show suggestions
    showNoteSuggestions(note);
}

/**
 * Handle chord selection
 */
function selectChord(root, type, clickedCard) {
    // Clear note selection
    studioState.selectedNote = null;
    document.querySelectorAll('#note-grid .option-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Update chord type selection UI
    document.querySelectorAll('#chord-type-grid .option-card').forEach(card => {
        card.classList.remove('selected');
    });
    clickedCard.classList.add('selected');

    // Build chord name
    const chordName = root + type.suffix;

    // Update state
    studioState.selectedChord = chordName;

    // Show suggestions
    showChordSuggestions(chordName);
}

/**
 * Show suggestions for a selected note
 */
function showNoteSuggestions(note) {
    // Show containers
    document.getElementById('suggestions-container').style.display = 'block';
    document.getElementById('note-suggestions').style.display = 'block';
    document.getElementById('chord-suggestions').style.display = 'none';

    // Update display
    document.getElementById('selected-note-display').textContent = note;

    // Generate and display suggestions
    generateChordsWithNote(note);
    generateCompatibleScales(note);
    generateHarmonizingNotes(note);
    generateMelodicNextNotes(note);

    // Scroll to suggestions
    document.getElementById('suggestions-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Show suggestions for a selected chord
 */
function showChordSuggestions(chord) {
    // Show containers
    document.getElementById('suggestions-container').style.display = 'block';
    document.getElementById('note-suggestions').style.display = 'none';
    document.getElementById('chord-suggestions').style.display = 'block';

    // Update display
    document.getElementById('selected-chord-display').textContent = chord;

    // Generate and display suggestions
    generateNextChordProgressions(chord);
    generateChordSubstitutions(chord);
    generateChordScaleMatches(chord);
    generateChordTonesAndExtensions(chord);

    // Scroll to suggestions
    document.getElementById('suggestions-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Generate chords that contain the selected note
 */
function generateChordsWithNote(note) {
    const container = document.getElementById('chords-with-note');
    container.innerHTML = '';

    const chords = [];

    // Check all possible chords
    NOTES.forEach(root => {
        CHORD_TYPES.forEach(type => {
            const chordName = root + type.suffix;
            try {
                const chordData = Tonal.Chord.get(chordName);
                if (chordData.notes && chordData.notes.length > 0) {
                    // Normalize notes for comparison
                    const normalizedChordNotes = chordData.notes.map(n => Tonal.Note.simplify(n));
                    const normalizedNote = Tonal.Note.simplify(note);

                    if (normalizedChordNotes.includes(normalizedNote)) {
                        chords.push({ name: chordName, notes: chordData.notes });
                    }
                }
            } catch (e) {
                // Skip invalid chords
            }
        });
    });

    // Limit to 12 chords for display
    chords.slice(0, 12).forEach(chord => {
        const chordCard = createSuggestionCard(
            chord.name,
            chord.notes.join(' - '),
            () => playChord(chord.notes)
        );
        container.appendChild(chordCard);
    });

    if (chords.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary);">No chords found</p>';
    }
}

/**
 * Generate compatible scales for the selected note
 */
function generateCompatibleScales(note) {
    const container = document.getElementById('compatible-scales');
    container.innerHTML = '';

    const scales = [];

    SCALE_TYPES.forEach(scaleType => {
        try {
            const scaleData = Tonal.Scale.get(`${note} ${scaleType}`);
            if (scaleData.notes && scaleData.notes.length > 0) {
                scales.push({
                    name: `${note} ${scaleType}`,
                    notes: scaleData.notes
                });
            }
        } catch (e) {
            // Skip invalid scales
        }
    });

    scales.forEach(scale => {
        const scaleCard = createSuggestionCard(
            scale.name,
            scale.notes.join(' - '),
            () => playScale(scale.notes)
        );
        container.appendChild(scaleCard);
    });
}

/**
 * Generate harmonizing notes for the selected note
 */
function generateHarmonizingNotes(note) {
    const container = document.getElementById('harmonizing-notes');
    container.innerHTML = '';

    // Get MIDI number for the note
    const midiNote = Tonal.Note.midi(note + '4') || 60;

    // Generate harmonizing intervals
    const intervals = [
        { name: 'Unison', semitones: 0 },
        { name: 'Minor 3rd', semitones: 3 },
        { name: 'Major 3rd', semitones: 4 },
        { name: 'Perfect 4th', semitones: 5 },
        { name: 'Perfect 5th', semitones: 7 },
        { name: 'Minor 6th', semitones: 8 },
        { name: 'Major 6th', semitones: 9 },
        { name: 'Octave', semitones: 12 }
    ];

    intervals.forEach(interval => {
        const harmonicMidi = midiNote + interval.semitones;
        const harmonicNote = Tonal.Note.fromMidi(harmonicMidi);
        const simplifiedNote = Tonal.Note.simplify(harmonicNote);

        const harmonyCard = createSuggestionCard(
            simplifiedNote,
            interval.name,
            () => playHarmony(midiNote, harmonicMidi)
        );
        container.appendChild(harmonyCard);
    });
}

/**
 * Generate melodic next notes for the selected note
 */
function generateMelodicNextNotes(note) {
    const container = document.getElementById('melodic-next-notes');
    container.innerHTML = '';

    // Get MIDI number for the note
    const midiNote = Tonal.Note.midi(note + '4') || 60;

    // Generate melodic intervals (common melodic movements)
    const movements = [
        { name: 'Minor 2nd up', semitones: 1 },
        { name: 'Major 2nd up', semitones: 2 },
        { name: 'Minor 3rd up', semitones: 3 },
        { name: 'Major 3rd up', semitones: 4 },
        { name: 'Perfect 4th up', semitones: 5 },
        { name: 'Perfect 5th up', semitones: 7 },
        { name: 'Minor 2nd down', semitones: -1 },
        { name: 'Major 2nd down', semitones: -2 }
    ];

    movements.forEach(movement => {
        const nextMidi = midiNote + movement.semitones;
        const nextNote = Tonal.Note.fromMidi(nextMidi);
        const simplifiedNote = Tonal.Note.simplify(nextNote);

        const melodicCard = createSuggestionCard(
            simplifiedNote,
            movement.name,
            () => playMelody([midiNote, nextMidi])
        );
        container.appendChild(melodicCard);
    });
}

/**
 * Generate next chord progressions for the selected chord
 */
function generateNextChordProgressions(chord) {
    const container = document.getElementById('next-chord-progressions');
    container.innerHTML = '';

    try {
        // Get the root note of the chord
        const chordData = Tonal.Chord.get(chord);
        const root = chordData.tonic;

        if (!root) {
            container.innerHTML = '<p style="color: var(--text-secondary);">Unable to analyze chord</p>';
            return;
        }

        // Common chord progressions based on root
        const progressions = [
            { from: chord, to: root + 'maj7', name: 'Add 7th', function: 'Color extension' },
            { from: chord, to: Tonal.Note.transpose(root, '5P'), name: 'Up 5th', function: 'Strong resolution (I-V)' },
            { from: chord, to: Tonal.Note.transpose(root, '4P'), name: 'Up 4th', function: 'Subdominant (I-IV)' },
            { from: chord, to: Tonal.Note.transpose(root, '2M'), name: 'Up major 2nd', function: 'Step-wise motion' },
            { from: chord, to: Tonal.Note.transpose(root, '3m') + 'm', name: 'Relative minor', function: 'Modal mixture' },
            { from: chord, to: Tonal.Note.transpose(root, '-2M'), name: 'Down major 2nd', function: 'Descending motion' },
            { from: chord, to: Tonal.Note.transpose(root, '6M') + 'm', name: 'Submediant', function: 'Deceptive cadence' },
            { from: chord, to: root + '7', name: 'Add dominant 7th', function: 'Blues/jazz color' }
        ];

        progressions.forEach(prog => {
            const nextChord = prog.to;
            const progCard = createSuggestionCard(
                `${chord} → ${nextChord}`,
                `${prog.name}: ${prog.function}`,
                () => playChordProgression([chord, nextChord])
            );
            container.appendChild(progCard);
        });
    } catch (e) {
        container.innerHTML = '<p style="color: var(--text-secondary);">Unable to generate progressions</p>';
    }
}

/**
 * Generate chord substitutions for the selected chord
 */
function generateChordSubstitutions(chord) {
    const container = document.getElementById('chord-substitutions');
    container.innerHTML = '';

    try {
        const chordData = Tonal.Chord.get(chord);
        const root = chordData.tonic;
        const quality = chordData.quality;

        if (!root) {
            container.innerHTML = '<p style="color: var(--text-secondary);">Unable to analyze chord</p>';
            return;
        }

        const substitutions = [];

        // Add extensions
        if (!chord.includes('7')) {
            substitutions.push({ name: root + '7', reason: 'Add dominant 7th' });
            substitutions.push({ name: root + 'maj7', reason: 'Add major 7th' });
        }
        if (!chord.includes('9')) {
            substitutions.push({ name: root + '9', reason: 'Add 9th extension' });
        }

        // Quality variations
        if (quality === 'Major') {
            substitutions.push({ name: root + 'm', reason: 'Parallel minor' });
            substitutions.push({ name: root + 'sus4', reason: 'Suspended 4th' });
        } else if (quality === 'Minor') {
            substitutions.push({ name: root, reason: 'Parallel major' });
            substitutions.push({ name: root + 'm7', reason: 'Add minor 7th' });
        }

        // Relative chords
        const relativeMinor = Tonal.Note.transpose(root, '3m') + 'm';
        const relativeMajor = Tonal.Note.transpose(root, '-3m');
        substitutions.push({ name: relativeMinor, reason: 'Relative minor' });
        substitutions.push({ name: relativeMajor, reason: 'Relative major' });

        // Tritone substitution
        const tritone = Tonal.Note.transpose(root, '4A') + '7';
        substitutions.push({ name: tritone, reason: 'Tritone substitution' });

        // Display substitutions
        substitutions.slice(0, 8).forEach(sub => {
            const subCard = createSuggestionCard(
                sub.name,
                sub.reason,
                () => playChordComparison(chord, sub.name)
            );
            container.appendChild(subCard);
        });
    } catch (e) {
        container.innerHTML = '<p style="color: var(--text-secondary);">Unable to generate substitutions</p>';
    }
}

/**
 * Generate compatible scales for the selected chord
 */
function generateChordScaleMatches(chord) {
    const container = document.getElementById('chord-scale-matches');
    container.innerHTML = '';

    try {
        const chordData = Tonal.Chord.get(chord);
        const chordNotes = chordData.notes.map(n => Tonal.Note.simplify(n));

        if (!chordNotes || chordNotes.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary);">Unable to analyze chord</p>';
            return;
        }

        const matchingScales = [];

        // Check each root note with each scale type
        NOTES.forEach(root => {
            SCALE_TYPES.forEach(scaleType => {
                try {
                    const scaleData = Tonal.Scale.get(`${root} ${scaleType}`);
                    if (scaleData.notes && scaleData.notes.length > 0) {
                        const scaleNotes = scaleData.notes.map(n => Tonal.Note.simplify(n));

                        // Check if all chord notes are in the scale
                        const allNotesMatch = chordNotes.every(note =>
                            scaleNotes.includes(note)
                        );

                        if (allNotesMatch) {
                            matchingScales.push({
                                name: `${root} ${scaleType}`,
                                notes: scaleData.notes
                            });
                        }
                    }
                } catch (e) {
                    // Skip invalid scales
                }
            });
        });

        // Display matching scales (limit to 12)
        matchingScales.slice(0, 12).forEach(scale => {
            const scaleCard = createSuggestionCard(
                scale.name,
                scale.notes.join(' - '),
                () => playScale(scale.notes)
            );
            container.appendChild(scaleCard);
        });

        if (matchingScales.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary);">No matching scales found</p>';
        }
    } catch (e) {
        container.innerHTML = '<p style="color: var(--text-secondary);">Unable to find matching scales</p>';
    }
}

/**
 * Generate chord tones and extensions for the selected chord
 */
function generateChordTonesAndExtensions(chord) {
    const container = document.getElementById('chord-tones-extensions');
    container.innerHTML = '';

    try {
        const chordData = Tonal.Chord.get(chord);

        if (!chordData.notes || chordData.notes.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary);">Unable to analyze chord</p>';
            return;
        }

        let html = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg);">';

        // Chord Tones
        html += '<div>';
        html += '<h4 style="color: var(--secondary-color); margin-bottom: var(--spacing-sm);">Chord Tones</h4>';
        html += '<div style="display: flex; flex-wrap: wrap; gap: var(--spacing-sm); margin-bottom: var(--spacing-md);">';
        chordData.notes.forEach(note => {
            html += `<span style="background: var(--primary-color); color: white; padding: var(--spacing-xs) var(--spacing-sm); border-radius: var(--border-radius); font-weight: bold;">${note}</span>`;
        });
        html += '</div>';
        html += `<button onclick="playChordByName('${chord}')" style="background: var(--secondary-color); color: white; border: none; padding: var(--spacing-sm) var(--spacing-md); border-radius: var(--border-radius); cursor: pointer; font-size: var(--font-size-base);">▶ Play Chord</button>`;
        html += '</div>';

        // Extensions
        html += '<div>';
        html += '<h4 style="color: var(--secondary-color); margin-bottom: var(--spacing-sm);">Possible Extensions</h4>';
        html += '<div style="display: flex; flex-direction: column; gap: var(--spacing-xs);">';

        const extensions = [
            { name: '7th', chord: chord + '7' },
            { name: 'Major 7th', chord: chord.replace(/7$/, '') + 'maj7' },
            { name: '9th', chord: chord.replace(/7$/, '') + '9' },
            { name: '11th', chord: chord.replace(/7$/, '') + '11' },
            { name: '13th', chord: chord.replace(/7$/, '') + '13' }
        ];

        extensions.forEach(ext => {
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-xs); background: var(--surface-elevated); border-radius: var(--border-radius);">
                    <span style="color: var(--text-primary);">${ext.name}: <strong style="color: var(--accent-color);">${ext.chord}</strong></span>
                    <button onclick="playChordByName('${ext.chord}')" style="background: var(--secondary-color); color: white; border: none; padding: var(--spacing-xs) var(--spacing-sm); border-radius: var(--border-radius); cursor: pointer; font-size: var(--font-size-small);">▶</button>
                </div>
            `;
        });

        html += '</div></div>';
        html += '</div>';

        // Chord Info
        html += '<div style="margin-top: var(--spacing-lg); padding-top: var(--spacing-lg); border-top: 1px solid var(--border-color);">';
        html += `<p style="color: var(--text-secondary); margin: 0;"><strong>Type:</strong> ${chordData.name || 'Unknown'}</p>`;
        html += `<p style="color: var(--text-secondary); margin: var(--spacing-xs) 0 0 0;"><strong>Quality:</strong> ${chordData.quality || 'Unknown'}</p>`;
        if (chordData.intervals && chordData.intervals.length > 0) {
            html += `<p style="color: var(--text-secondary); margin: var(--spacing-xs) 0 0 0;"><strong>Intervals:</strong> ${chordData.intervals.join(', ')}</p>`;
        }
        html += '</div>';

        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = '<p style="color: var(--text-secondary);">Unable to analyze chord tones</p>';
    }
}

/**
 * Create a suggestion card component
 */
function createSuggestionCard(title, description, playCallback) {
    const card = document.createElement('div');
    card.className = 'option-card';
    card.style.cursor = 'default';
    card.style.position = 'relative';

    card.innerHTML = `
        <h4 style="margin-bottom: var(--spacing-xs); color: var(--primary-color);">${title}</h4>
        <p style="font-size: var(--font-size-small); color: var(--text-secondary); margin: 0 0 var(--spacing-sm) 0;">${description}</p>
        <button class="play-btn" style="background: var(--secondary-color); color: white; border: none; padding: var(--spacing-xs) var(--spacing-sm); border-radius: var(--border-radius); cursor: pointer; font-size: var(--font-size-small); width: 100%;">▶ Play</button>
    `;

    const playBtn = card.querySelector('.play-btn');
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playCallback();
    });

    return card;
}

/**
 * Audio playback functions
 */

function playChord(notes) {
    if (!window.audioEngine) return;

    try {
        const midiNotes = notes.map(note => {
            const midi = Tonal.Note.midi(note + '4');
            return midi || 60;
        });
        window.audioEngine.playChord(midiNotes);
    } catch (e) {
        console.error('Error playing chord:', e);
    }
}

function playChordByName(chordName) {
    try {
        const chordData = Tonal.Chord.get(chordName);
        if (chordData.notes && chordData.notes.length > 0) {
            playChord(chordData.notes);
        }
    } catch (e) {
        console.error('Error playing chord:', e);
    }
}

function playScale(notes) {
    if (!window.audioEngine) return;

    try {
        const midiNotes = notes.map(note => {
            const midi = Tonal.Note.midi(note + '4');
            return midi || 60;
        });

        // Play scale as arpeggio
        window.audioEngine.playMelody(midiNotes);
    } catch (e) {
        console.error('Error playing scale:', e);
    }
}

function playHarmony(note1Midi, note2Midi) {
    if (!window.audioEngine) return;

    try {
        window.audioEngine.playChord([note1Midi, note2Midi]);
    } catch (e) {
        console.error('Error playing harmony:', e);
    }
}

function playMelody(midiNotes) {
    if (!window.audioEngine) return;

    try {
        window.audioEngine.playMelody(midiNotes);
    } catch (e) {
        console.error('Error playing melody:', e);
    }
}

function playChordProgression(chords) {
    if (!window.audioEngine) return;

    try {
        const allMidiNotes = [];

        chords.forEach(chordName => {
            const chordData = Tonal.Chord.get(chordName);
            if (chordData.notes && chordData.notes.length > 0) {
                chordData.notes.forEach(note => {
                    const midi = Tonal.Note.midi(note + '4');
                    if (midi) allMidiNotes.push(midi);
                });
            }
        });

        // Play as sequence
        if (allMidiNotes.length > 0) {
            window.audioEngine.playMelody(allMidiNotes);
        }
    } catch (e) {
        console.error('Error playing chord progression:', e);
    }
}

function playChordComparison(chord1, chord2) {
    if (!window.audioEngine) return;

    try {
        // Play first chord
        const chord1Data = Tonal.Chord.get(chord1);
        if (chord1Data.notes && chord1Data.notes.length > 0) {
            playChord(chord1Data.notes);

            // Play second chord after delay
            setTimeout(() => {
                const chord2Data = Tonal.Chord.get(chord2);
                if (chord2Data.notes && chord2Data.notes.length > 0) {
                    playChord(chord2Data.notes);
                }
            }, 1000);
        }
    } catch (e) {
        console.error('Error playing chord comparison:', e);
    }
}

// Make functions globally available
window.playChordByName = playChordByName;

// Initialize on page load
document.addEventListener('DOMContentLoaded', initStudio);
