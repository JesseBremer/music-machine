/**
 * Music Machine Studio Pro
 * Industry-standard music composition tool
 */

// ============================================================
// STUDIO STATE
// ============================================================

const studioState = {
    // Musical context
    key: 'C',
    scale: 'major',
    tempo: 120,

    // Chord progression
    chordProgression: [], // [{ measure: 0, chord: 'C', notes: [...] }, ...]
    measures: 4,

    // Melody
    melodyNotes: [], // [{ measure: 0, beat: 0, pitch: 60, duration: 0.5 }, ...]

    // Playback
    isPlaying: false,
    isRecording: false,
    isLooping: true,
    currentBeat: 0,

    // UI state
    selectedMeasure: null,
    currentChordInTimeline: null,
    noteLength: 0.5,
    keyboardOctave: 4,
    highlightScale: true,
    highlightChords: true,

    // Tap tempo
    tapTimes: []
};

// ============================================================
// CONSTANTS
// ============================================================

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_NAMES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Black key positions (relative to white keys)
const BLACK_KEY_POSITIONS = {
    1: 'C#',  // Between C and D
    3: 'D#',  // Between D and E
    6: 'F#',  // Between F and G
    8: 'G#',  // Between G and A
    10: 'A#'  // Between A and B
};

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', initStudio);

function initStudio() {
    console.log('Initializing Studio Pro...');

    // Initialize components
    initKeyScaleSelector();
    initChordPalette();
    initChordTimeline();
    initPianoRoll();
    initVisualKeyboard();
    initTransportControls();
    initQuickActions();

    // Update UI
    updateTheoryInfo();
    updateKeyDisplay();

    console.log('Studio Pro initialized!');
}

// ============================================================
// KEY & SCALE SELECTOR
// ============================================================

function initKeyScaleSelector() {
    const keyRootSelect = document.getElementById('key-root-select');
    const scaleTypeSelect = document.getElementById('scale-type-select');

    keyRootSelect.addEventListener('change', (e) => {
        studioState.key = e.target.value;
        onKeyScaleChange();
    });

    scaleTypeSelect.addEventListener('change', (e) => {
        studioState.scale = e.target.value;
        onKeyScaleChange();
    });
}

function onKeyScaleChange() {
    updateKeyDisplay();
    updateChordPalette();
    updateTheoryInfo();
    updateVisualKeyboard();
    updateSmartSuggestions();
}

function updateKeyDisplay() {
    const keyDisplay = document.getElementById('current-key-display');
    const scaleTypeSelect = document.getElementById('scale-type-select');
    const scaleName = scaleTypeSelect.options[scaleTypeSelect.selectedIndex].text;
    keyDisplay.textContent = `${studioState.key} ${scaleName}`;
}

// ============================================================
// CHORD PALETTE
// ============================================================

function initChordPalette() {
    updateChordPalette();
}

function updateChordPalette() {
    const palette = document.getElementById('chord-palette');
    palette.innerHTML = '';

    // Get chords in key
    const chords = getChordsInKey(studioState.key, studioState.scale);

    chords.forEach(chordInfo => {
        const chip = document.createElement('div');
        chip.className = `chord-chip function-${chordInfo.function}`;
        chip.textContent = chordInfo.chord;
        chip.draggable = true;
        chip.dataset.chord = chordInfo.chord;
        chip.dataset.function = chordInfo.function;

        // Drag events
        chip.addEventListener('dragstart', onChordDragStart);

        // Click to play
        chip.addEventListener('click', () => {
            playChordByName(chordInfo.chord);
        });

        palette.appendChild(chip);
    });
}

function getChordsInKey(key, scale) {
    try {
        const scaleData = Tonal.Scale.get(`${key} ${scale}`);
        const chords = [];

        if (scaleData.notes && scaleData.notes.length > 0) {
            const scaleNotes = scaleData.notes;

            // Build triads for each scale degree
            const romanNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii'];
            const qualities = scale.includes('major') ?
                ['', 'm', 'm', '', '', 'm', 'dim'] :
                ['m', 'dim', '', 'm', 'm', '', ''];

            scaleNotes.forEach((root, index) => {
                if (index < 7) {
                    const quality = qualities[index];
                    const chord = root + quality;
                    chords.push({
                        chord: chord,
                        function: romanNumerals[index],
                        root: root
                    });
                }
            });
        }

        return chords;
    } catch (e) {
        console.error('Error getting chords in key:', e);
        return [];
    }
}

// ============================================================
// CHORD TIMELINE
// ============================================================

function initChordTimeline() {
    renderChordTimeline();
}

function renderChordTimeline() {
    const timeline = document.getElementById('chord-timeline');
    timeline.innerHTML = '';

    for (let i = 0; i < studioState.measures; i++) {
        const measure = document.createElement('div');
        measure.className = 'timeline-measure';
        measure.dataset.measure = i;

        // Measure number
        const number = document.createElement('div');
        number.className = 'measure-number';
        number.textContent = i + 1;
        measure.appendChild(number);

        // Check if this measure has a chord
        const chordInMeasure = studioState.chordProgression.find(c => c.measure === i);
        if (chordInMeasure) {
            measure.classList.add('has-chord');

            const chordLabel = document.createElement('div');
            chordLabel.className = 'measure-chord';
            chordLabel.textContent = chordInMeasure.chord;
            measure.appendChild(chordLabel);

            const numeralLabel = document.createElement('div');
            numeralLabel.className = 'measure-numeral';
            numeralLabel.textContent = getChordNumeral(chordInMeasure.chord);
            measure.appendChild(numeralLabel);

            // Remove button
            const removeBtn = document.createElement('button');
            removeBtn.className = 'measure-remove';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeChordFromMeasure(i);
            });
            measure.appendChild(removeBtn);
        }

        // Drag and drop
        measure.addEventListener('dragover', onTimelineDragOver);
        measure.addEventListener('drop', onTimelineDrop);

        // Click to select
        measure.addEventListener('click', () => {
            selectMeasure(i);
        });

        timeline.appendChild(measure);
    }

    updateMeasureCount();
}

function onChordDragStart(e) {
    e.dataTransfer.setData('chord', e.target.dataset.chord);
    e.target.style.opacity = '0.5';
}

function onTimelineDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.background = '#333';
}

function onTimelineDrop(e) {
    e.preventDefault();
    e.currentTarget.style.background = '';

    const chord = e.dataTransfer.getData('chord');
    const measure = parseInt(e.currentTarget.dataset.measure);

    addChordToMeasure(measure, chord);
}

function addChordToMeasure(measure, chordName) {
    try {
        const chordData = Tonal.Chord.get(chordName);

        if (!chordData.notes || chordData.notes.length === 0) {
            console.error('Invalid chord:', chordName);
            return;
        }

        // Remove existing chord in this measure
        studioState.chordProgression = studioState.chordProgression.filter(c => c.measure !== measure);

        // Add new chord
        studioState.chordProgression.push({
            measure: measure,
            chord: chordName,
            notes: chordData.notes
        });

        // Sort by measure
        studioState.chordProgression.sort((a, b) => a.measure - b.measure);

        renderChordTimeline();
        updateSmartSuggestions();
        updateProgressionAnalysis();

        // Play the chord
        playChordByName(chordName);
    } catch (e) {
        console.error('Error adding chord:', e);
    }
}

function removeChordFromMeasure(measure) {
    studioState.chordProgression = studioState.chordProgression.filter(c => c.measure !== measure);
    renderChordTimeline();
    updateSmartSuggestions();
    updateProgressionAnalysis();
}

function selectMeasure(measure) {
    studioState.selectedMeasure = measure;

    // Update visual selection
    document.querySelectorAll('.timeline-measure').forEach(m => {
        m.style.boxShadow = '';
    });

    const selectedMeasure = document.querySelector(`[data-measure="${measure}"]`);
    if (selectedMeasure) {
        selectedMeasure.style.boxShadow = '0 0 12px rgba(78, 205, 196, 0.6)';
    }

    // Update keyboard highlighting if measure has a chord
    const chordInMeasure = studioState.chordProgression.find(c => c.measure === measure);
    if (chordInMeasure) {
        studioState.currentChordInTimeline = chordInMeasure.chord;
        updateVisualKeyboard();
    } else {
        studioState.currentChordInTimeline = null;
        updateVisualKeyboard();
    }
}

function getChordNumeral(chordName) {
    try {
        const chordData = Tonal.Chord.get(chordName);
        const root = chordData.tonic;

        if (!root) return '';

        // Get scale notes
        const scaleData = Tonal.Scale.get(`${studioState.key} ${studioState.scale}`);
        if (!scaleData.notes) return '';

        const scaleNotes = scaleData.notes.map(n => Tonal.Note.simplify(n));
        const simplifiedRoot = Tonal.Note.simplify(root);

        const index = scaleNotes.indexOf(simplifiedRoot);
        if (index === -1) return '';

        const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
        const roman = romanNumerals[index];

        // Lowercase for minor chords
        if (chordName.includes('m') && !chordName.includes('maj')) {
            return roman.toLowerCase();
        }

        return roman;
    } catch (e) {
        return '';
    }
}

function updateMeasureCount() {
    document.getElementById('measure-count').textContent = studioState.measures;
}

// ============================================================
// PIANO ROLL (Melody Editor)
// ============================================================

function initPianoRoll() {
    renderPianoRoll();

    // Note length selector
    document.getElementById('note-length-select').addEventListener('change', (e) => {
        studioState.noteLength = parseFloat(e.target.value);
    });

    // Clear button
    document.getElementById('melody-clear-btn').addEventListener('click', () => {
        studioState.melodyNotes = [];
        renderPianoRoll();
    });
}

function renderPianoRoll() {
    const pianoRoll = document.getElementById('piano-roll');
    pianoRoll.innerHTML = '';

    // Create piano keys column
    const keysColumn = document.createElement('div');
    keysColumn.className = 'piano-keys';

    // Create note grid
    const noteGrid = document.createElement('div');
    noteGrid.className = 'note-grid';

    // Generate 2 octaves (24 notes)
    const startNote = 60; // Middle C
    for (let i = 23; i >= 0; i--) {
        const midiNote = startNote + i;
        const noteName = Tonal.Note.fromMidi(midiNote);
        const isBlack = noteName.includes('#') || noteName.includes('b');

        // Key label
        const keyLabel = document.createElement('div');
        keyLabel.className = `piano-key-label ${isBlack ? 'black-key' : ''}`;
        keyLabel.textContent = noteName;
        keysColumn.appendChild(keyLabel);

        // Note cells for this pitch
        for (let beat = 0; beat < 16; beat++) {
            const cell = document.createElement('div');
            cell.className = 'note-cell';
            cell.dataset.pitch = midiNote;
            cell.dataset.beat = beat;

            // Check if there's a note here
            const hasNote = studioState.melodyNotes.find(
                n => n.pitch === midiNote && Math.floor(n.beat * 4) === beat
            );

            if (hasNote) {
                cell.classList.add('has-note');
            }

            cell.addEventListener('click', () => toggleNote(midiNote, beat / 4));

            noteGrid.appendChild(cell);
        }
    }

    pianoRoll.appendChild(keysColumn);
    pianoRoll.appendChild(noteGrid);
}

function toggleNote(pitch, beat) {
    const existingIndex = studioState.melodyNotes.findIndex(
        n => n.pitch === pitch && n.beat === beat
    );

    if (existingIndex >= 0) {
        // Remove note
        studioState.melodyNotes.splice(existingIndex, 1);
    } else {
        // Add note
        studioState.melodyNotes.push({
            pitch: pitch,
            beat: beat,
            duration: studioState.noteLength,
            measure: Math.floor(beat)
        });

        // Play note
        if (window.audioEngine) {
            window.audioEngine.playMelody([pitch], 0.2);
        }
    }

    renderPianoRoll();
}

// ============================================================
// VISUAL KEYBOARD
// ============================================================

function initVisualKeyboard() {
    renderVisualKeyboard();

    // Highlight toggles
    document.getElementById('keyboard-highlight-scale').addEventListener('change', (e) => {
        studioState.highlightScale = e.target.checked;
        updateVisualKeyboard();
    });

    document.getElementById('keyboard-highlight-chords').addEventListener('change', (e) => {
        studioState.highlightChords = e.target.checked;
        updateVisualKeyboard();
    });

    document.getElementById('keyboard-octave').addEventListener('change', (e) => {
        studioState.keyboardOctave = parseInt(e.target.value);
        renderVisualKeyboard();
    });
}

function renderVisualKeyboard() {
    const keyboard = document.getElementById('visual-keyboard');
    keyboard.innerHTML = '';

    // Create container for proper positioning
    const keyboardInner = document.createElement('div');
    keyboardInner.className = 'keyboard-inner';

    const octave = studioState.keyboardOctave;
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

    // Create white keys first
    whiteKeys.forEach((note, index) => {
        const key = document.createElement('div');
        key.className = 'piano-key white';
        key.dataset.note = note;
        key.dataset.midi = Tonal.Note.midi(note + octave);

        const label = document.createElement('div');
        label.className = 'key-note-label';
        label.textContent = note;
        key.appendChild(label);

        key.addEventListener('mousedown', () => playKeyboardNote(note + octave));

        keyboardInner.appendChild(key);
    });

    // Add black keys with proper positioning
    // Black keys between: C-D, D-E, F-G, G-A, A-B
    const blackKeysLayout = [
        { note: 'C#', left: 28 },   // Between C (0) and D (1)
        { note: 'D#', left: 69 },   // Between D (1) and E (2)
        { note: 'F#', left: 151 },  // Between F (3) and G (4)
        { note: 'G#', left: 192 },  // Between G (4) and A (5)
        { note: 'A#', left: 233 }   // Between A (5) and B (6)
    ];

    blackKeysLayout.forEach(({ note, left }) => {
        const key = document.createElement('div');
        key.className = 'piano-key black';
        key.dataset.note = note;
        key.dataset.midi = Tonal.Note.midi(note + octave);
        key.style.left = `${left}px`;

        const label = document.createElement('div');
        label.className = 'key-note-label';
        label.textContent = note;
        key.appendChild(label);

        key.addEventListener('mousedown', () => playKeyboardNote(note + octave));

        keyboardInner.appendChild(key);
    });

    keyboard.appendChild(keyboardInner);
    updateVisualKeyboard();
}

function updateVisualKeyboard() {
    const scaleNotes = getScaleNotes();
    const chordNotes = getCurrentChordNotes();

    document.querySelectorAll('.piano-key').forEach(key => {
        const note = key.dataset.note;
        key.classList.remove('in-scale', 'in-chord');

        if (studioState.highlightScale && scaleNotes.includes(note)) {
            key.classList.add('in-scale');
        }

        if (studioState.highlightChords && chordNotes.includes(note)) {
            key.classList.add('in-chord');
        }
    });
}

function getScaleNotes() {
    try {
        const scaleData = Tonal.Scale.get(`${studioState.key} ${studioState.scale}`);
        if (scaleData.notes) {
            return scaleData.notes.map(n => {
                const noteName = Tonal.Note.get(n).pc;
                return noteName;
            });
        }
    } catch (e) {
        console.error('Error getting scale notes:', e);
    }
    return [];
}

function getCurrentChordNotes() {
    if (!studioState.currentChordInTimeline) return [];

    try {
        const chordData = Tonal.Chord.get(studioState.currentChordInTimeline);
        if (chordData.notes) {
            return chordData.notes.map(n => {
                const noteName = Tonal.Note.get(n).pc;
                return noteName;
            });
        }
    } catch (e) {
        console.error('Error getting chord notes:', e);
    }
    return [];
}

function playKeyboardNote(note) {
    try {
        const midi = Tonal.Note.midi(note);
        if (midi && window.audioEngine) {
            window.audioEngine.playMelody([midi], 0.3);
        }
    } catch (e) {
        console.error('Error playing note:', e);
    }
}

// ============================================================
// THEORY INFO
// ============================================================

function updateTheoryInfo() {
    // Key
    document.getElementById('info-key').textContent =
        `${studioState.key} ${studioState.scale}`;

    // Scale notes
    const scaleData = Tonal.Scale.get(`${studioState.key} ${studioState.scale}`);
    if (scaleData.notes) {
        document.getElementById('info-scale-notes').textContent = scaleData.notes.join(' ');
    }

    // Chords in key
    const chords = getChordsInKey(studioState.key, studioState.scale);
    const container = document.getElementById('info-key-chords');
    container.innerHTML = '';

    chords.forEach(chordInfo => {
        const tag = document.createElement('span');
        tag.className = 'key-chord-tag';
        tag.textContent = chordInfo.chord;
        container.appendChild(tag);
    });
}

// ============================================================
// SMART SUGGESTIONS
// ============================================================

function updateSmartSuggestions() {
    const container = document.getElementById('smart-suggestions');

    if (studioState.chordProgression.length === 0) {
        container.innerHTML = '<p class="panel-hint">Add chords to see suggestions...</p>';
        return;
    }

    const lastChord = studioState.chordProgression[studioState.chordProgression.length - 1];
    const suggestions = getNextChordSuggestions(lastChord.chord);

    container.innerHTML = '';

    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';

        const chordLabel = document.createElement('div');
        chordLabel.className = 'suggestion-chord';
        chordLabel.textContent = suggestion.chord;
        item.appendChild(chordLabel);

        const reason = document.createElement('div');
        reason.className = 'suggestion-reason';
        reason.textContent = suggestion.reason;
        item.appendChild(reason);

        item.addEventListener('click', () => {
            // Add to next empty measure
            const nextMeasure = findNextEmptyMeasure();
            if (nextMeasure !== -1) {
                addChordToMeasure(nextMeasure, suggestion.chord);
            }
        });

        container.appendChild(item);
    });
}

function getNextChordSuggestions(currentChord) {
    const suggestions = [];

    try {
        const chordData = Tonal.Chord.get(currentChord);
        const root = chordData.tonic;

        if (!root) return suggestions;

        // Common progressions
        const nextChords = [
            { interval: '4P', reason: 'Subdominant (IV)' },
            { interval: '5P', reason: 'Dominant (V)' },
            { interval: '3m', reason: 'Relative minor (vi)' },
            { interval: '2M', reason: 'Supertonic (ii)' },
            { interval: '-2M', reason: 'Descending step' },
            { interval: '6M', reason: 'Submediant (vi)' }
        ];

        nextChords.forEach(({ interval, reason }) => {
            const nextRoot = Tonal.Note.transpose(root, interval);

            // Try major and minor
            suggestions.push({ chord: nextRoot, reason: `${reason} - Major` });
            suggestions.push({ chord: nextRoot + 'm', reason: `${reason} - Minor` });
        });

        // Return first 6
        return suggestions.slice(0, 6);
    } catch (e) {
        console.error('Error generating suggestions:', e);
        return [];
    }
}

function findNextEmptyMeasure() {
    for (let i = 0; i < studioState.measures; i++) {
        const hasChord = studioState.chordProgression.find(c => c.measure === i);
        if (!hasChord) return i;
    }
    return -1;
}

// ============================================================
// PROGRESSION ANALYSIS
// ============================================================

function updateProgressionAnalysis() {
    const container = document.getElementById('progression-analysis');

    if (studioState.chordProgression.length === 0) {
        container.innerHTML = '<p class="panel-hint">Add chords to analyze...</p>';
        return;
    }

    let analysis = '<div>';

    // Show progression with numerals
    const progressionStr = studioState.chordProgression
        .map(c => {
            const numeral = getChordNumeral(c.chord);
            return `<span class="analysis-numeral">${c.chord}</span> (${numeral})`;
        })
        .join(' → ');

    analysis += `<p><strong>Progression:</strong><br>${progressionStr}</p>`;

    // Suggest common patterns
    const pattern = identifyPattern();
    if (pattern) {
        analysis += `<p><strong>Pattern:</strong> ${pattern}</p>`;
    }

    analysis += '</div>';

    container.innerHTML = analysis;
}

function identifyPattern() {
    const numerals = studioState.chordProgression.map(c => getChordNumeral(c.chord)).join('-');

    const patterns = {
        'I-V-vi-IV': 'Pop progression (Axis)',
        'I-IV-V': 'Classic rock progression',
        'ii-V-I': 'Jazz turnaround',
        'I-vi-IV-V': '50s progression (Doo-wop)',
        'vi-IV-I-V': 'Sensitive progression',
        'I-V-IV': 'Three-chord song'
    };

    for (const [pattern, name] of Object.entries(patterns)) {
        if (numerals.includes(pattern)) {
            return name;
        }
    }

    return null;
}

// ============================================================
// TRANSPORT CONTROLS
// ============================================================

function initTransportControls() {
    document.getElementById('play-btn').addEventListener('click', togglePlay);
    document.getElementById('stop-btn').addEventListener('click', stopPlayback);
    document.getElementById('record-btn').addEventListener('click', toggleRecord);
    document.getElementById('loop-btn').addEventListener('click', toggleLoop);

    document.getElementById('tempo-input').addEventListener('change', (e) => {
        studioState.tempo = parseInt(e.target.value);
        if (window.audioEngine) {
            window.audioEngine.setTempo(studioState.tempo);
        }
    });

    document.getElementById('tap-tempo').addEventListener('click', tapTempo);

    // Clear button
    document.getElementById('clear-btn').addEventListener('click', clearAll);

    // Export buttons
    document.getElementById('export-midi-btn').addEventListener('click', exportMIDI);
    document.getElementById('save-project-btn').addEventListener('click', saveProject);
}

function togglePlay() {
    studioState.isPlaying = !studioState.isPlaying;

    const playBtn = document.getElementById('play-btn');
    if (studioState.isPlaying) {
        playBtn.classList.add('active');
        playBtn.textContent = '⏸';
        startPlayback();
    } else {
        playBtn.classList.remove('active');
        playBtn.textContent = '▶';
        pausePlayback();
    }
}

function stopPlayback() {
    studioState.isPlaying = false;
    studioState.currentBeat = 0;

    const playBtn = document.getElementById('play-btn');
    playBtn.classList.remove('active');
    playBtn.textContent = '▶';

    if (window.audioEngine) {
        window.audioEngine.stopAudio();
    }
}

function startPlayback() {
    if (studioState.chordProgression.length === 0) {
        alert('Add chords to the timeline first!');
        stopPlayback();
        return;
    }

    playProgression();
}

function pausePlayback() {
    // Pause logic
    if (window.audioEngine) {
        window.audioEngine.stopAudio();
    }
}

function playProgression() {
    if (!window.audioEngine) return;

    // Play each chord in sequence
    const chordDuration = (60 / studioState.tempo) * 4; // 4 beats per measure

    studioState.chordProgression.forEach((chordInfo, index) => {
        setTimeout(() => {
            if (studioState.isPlaying) {
                playChordByName(chordInfo.chord);
            }
        }, index * chordDuration * 1000);
    });

    // Loop if enabled
    if (studioState.isLooping) {
        const totalDuration = studioState.chordProgression.length * chordDuration * 1000;
        setTimeout(() => {
            if (studioState.isPlaying) {
                playProgression();
            }
        }, totalDuration);
    }
}

function toggleRecord() {
    studioState.isRecording = !studioState.isRecording;

    const recordBtn = document.getElementById('record-btn');
    if (studioState.isRecording) {
        recordBtn.classList.add('active');
        // Start recording logic
    } else {
        recordBtn.classList.remove('active');
        // Stop recording logic
    }
}

function toggleLoop() {
    studioState.isLooping = !studioState.isLooping;

    const loopBtn = document.getElementById('loop-btn');
    if (studioState.isLooping) {
        loopBtn.style.color = 'var(--accent-color)';
    } else {
        loopBtn.style.color = '';
    }
}

function tapTempo() {
    const now = Date.now();
    studioState.tapTimes.push(now);

    // Keep only last 4 taps
    if (studioState.tapTimes.length > 4) {
        studioState.tapTimes.shift();
    }

    // Calculate BPM from intervals
    if (studioState.tapTimes.length >= 2) {
        const intervals = [];
        for (let i = 1; i < studioState.tapTimes.length; i++) {
            intervals.push(studioState.tapTimes[i] - studioState.tapTimes[i - 1]);
        }

        const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
        const bpm = Math.round(60000 / avgInterval);

        if (bpm >= 40 && bpm <= 240) {
            studioState.tempo = bpm;
            document.getElementById('tempo-input').value = bpm;

            if (window.audioEngine) {
                window.audioEngine.setTempo(bpm);
            }
        }
    }
}

function clearAll() {
    if (confirm('Clear all chords and melody?')) {
        studioState.chordProgression = [];
        studioState.melodyNotes = [];
        renderChordTimeline();
        renderPianoRoll();
        updateSmartSuggestions();
        updateProgressionAnalysis();
    }
}

// ============================================================
// QUICK ACTIONS
// ============================================================

function initQuickActions() {
    document.getElementById('generate-progression-btn').addEventListener('click', generateProgression);
    document.getElementById('suggest-melody-btn').addEventListener('click', suggestMelody);
    document.getElementById('add-variation-btn').addEventListener('click', addVariation);
}

function generateProgression() {
    // Clear existing
    studioState.chordProgression = [];

    // Get common progression for key
    const chords = getChordsInKey(studioState.key, studioState.scale);

    if (chords.length === 0) return;

    // Generate I-V-vi-IV pattern (pop progression)
    const pattern = ['I', 'V', 'vi', 'IV'];

    pattern.forEach((numeral, index) => {
        const chord = chords.find(c => c.function === numeral);
        if (chord && index < studioState.measures) {
            addChordToMeasure(index, chord.chord);
        }
    });
}

function suggestMelody() {
    // Simple melody generation based on scale
    const scaleNotes = getScaleNotes();
    if (scaleNotes.length === 0) return;

    const baseOctave = 4;
    studioState.melodyNotes = [];

    // Generate 8 random notes from scale
    for (let i = 0; i < 8; i++) {
        const randomNote = scaleNotes[Math.floor(Math.random() * scaleNotes.length)];
        const midi = Tonal.Note.midi(randomNote + baseOctave);

        studioState.melodyNotes.push({
            pitch: midi,
            beat: i * 0.5,
            duration: 0.5,
            measure: Math.floor(i * 0.5)
        });
    }

    renderPianoRoll();
}

function addVariation() {
    // Duplicate and modify last measure's chord
    if (studioState.chordProgression.length === 0) return;

    const lastChord = studioState.chordProgression[studioState.chordProgression.length - 1];
    const nextMeasure = findNextEmptyMeasure();

    if (nextMeasure !== -1) {
        // Add variation (7th, sus, etc.)
        const variations = [lastChord.chord + '7', lastChord.chord + 'sus4', lastChord.chord + 'add9'];
        const variation = variations[Math.floor(Math.random() * variations.length)];

        addChordToMeasure(nextMeasure, variation);
    }
}

// ============================================================
// AUDIO PLAYBACK
// ============================================================

function playChordByName(chordName) {
    try {
        const chordData = Tonal.Chord.get(chordName);
        if (chordData.notes && chordData.notes.length > 0 && window.audioEngine) {
            const midiNotes = chordData.notes.map(note => {
                const midi = Tonal.Note.midi(note + '4');
                return midi || 60;
            });
            window.audioEngine.playChord(midiNotes, 1.0);
        }
    } catch (e) {
        console.error('Error playing chord:', e);
    }
}

// ============================================================
// EXPORT & SAVE
// ============================================================

function exportMIDI() {
    alert('MIDI export coming soon! This will export your chord progression and melody as a MIDI file.');
    // TODO: Implement MIDI export using js-midi library
}

function saveProject() {
    const project = {
        key: studioState.key,
        scale: studioState.scale,
        tempo: studioState.tempo,
        chordProgression: studioState.chordProgression,
        melodyNotes: studioState.melodyNotes,
        measures: studioState.measures,
        timestamp: new Date().toISOString()
    };

    const json = JSON.stringify(project, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `music-machine-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Project saved! You can load it later by importing the JSON file.');
}

// ============================================================
// MAKE FUNCTIONS GLOBAL
// ============================================================

window.playChordByName = playChordByName;
window.studioState = studioState;
