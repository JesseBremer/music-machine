// studio.js - Studio Mode Controller
// Smart songwriter's studio with chord suggestions and melody guidance

import * as MusicTheory from './music-theory.js';

// ================================
// COMPREHENSIVE CHORD DATABASE
// ================================
const CHORD_DATA = {
    // Major chords
    'C': { notes: ['C', 'E', 'G'], type: 'major', mood: 'bright' },
    'C#': { notes: ['C#', 'E#', 'G#'], type: 'major', mood: 'bright' },
    'Db': { notes: ['Db', 'F', 'Ab'], type: 'major', mood: 'bright' },
    'D': { notes: ['D', 'F#', 'A'], type: 'major', mood: 'bright' },
    'D#': { notes: ['D#', 'G', 'A#'], type: 'major', mood: 'bright' },
    'Eb': { notes: ['Eb', 'G', 'Bb'], type: 'major', mood: 'bright' },
    'E': { notes: ['E', 'G#', 'B'], type: 'major', mood: 'bright' },
    'F': { notes: ['F', 'A', 'C'], type: 'major', mood: 'bright' },
    'F#': { notes: ['F#', 'A#', 'C#'], type: 'major', mood: 'bright' },
    'Gb': { notes: ['Gb', 'Bb', 'Db'], type: 'major', mood: 'bright' },
    'G': { notes: ['G', 'B', 'D'], type: 'major', mood: 'bright' },
    'G#': { notes: ['G#', 'C', 'D#'], type: 'major', mood: 'bright' },
    'Ab': { notes: ['Ab', 'C', 'Eb'], type: 'major', mood: 'bright' },
    'A': { notes: ['A', 'C#', 'E'], type: 'major', mood: 'bright' },
    'A#': { notes: ['A#', 'D', 'F'], type: 'major', mood: 'bright' },
    'Bb': { notes: ['Bb', 'D', 'F'], type: 'major', mood: 'bright' },
    'B': { notes: ['B', 'D#', 'F#'], type: 'major', mood: 'bright' },

    // Minor chords
    'Cm': { notes: ['C', 'Eb', 'G'], type: 'minor', mood: 'sad' },
    'C#m': { notes: ['C#', 'E', 'G#'], type: 'minor', mood: 'sad' },
    'Dm': { notes: ['D', 'F', 'A'], type: 'minor', mood: 'sad' },
    'D#m': { notes: ['D#', 'F#', 'A#'], type: 'minor', mood: 'sad' },
    'Ebm': { notes: ['Eb', 'Gb', 'Bb'], type: 'minor', mood: 'sad' },
    'Em': { notes: ['E', 'G', 'B'], type: 'minor', mood: 'sad' },
    'Fm': { notes: ['F', 'Ab', 'C'], type: 'minor', mood: 'sad' },
    'F#m': { notes: ['F#', 'A', 'C#'], type: 'minor', mood: 'sad' },
    'Gm': { notes: ['G', 'Bb', 'D'], type: 'minor', mood: 'sad' },
    'G#m': { notes: ['G#', 'B', 'D#'], type: 'minor', mood: 'sad' },
    'Am': { notes: ['A', 'C', 'E'], type: 'minor', mood: 'sad' },
    'A#m': { notes: ['A#', 'C#', 'F'], type: 'minor', mood: 'sad' },
    'Bbm': { notes: ['Bb', 'Db', 'F'], type: 'minor', mood: 'sad' },
    'Bm': { notes: ['B', 'D', 'F#'], type: 'minor', mood: 'sad' },

    // Seventh chords
    'C7': { notes: ['C', 'E', 'G', 'Bb'], type: 'dominant7', mood: 'tension' },
    'D7': { notes: ['D', 'F#', 'A', 'C'], type: 'dominant7', mood: 'tension' },
    'E7': { notes: ['E', 'G#', 'B', 'D'], type: 'dominant7', mood: 'tension' },
    'F7': { notes: ['F', 'A', 'C', 'Eb'], type: 'dominant7', mood: 'tension' },
    'G7': { notes: ['G', 'B', 'D', 'F'], type: 'dominant7', mood: 'tension' },
    'A7': { notes: ['A', 'C#', 'E', 'G'], type: 'dominant7', mood: 'tension' },
    'B7': { notes: ['B', 'D#', 'F#', 'A'], type: 'dominant7', mood: 'tension' },

    // Major 7th chords
    'Cmaj7': { notes: ['C', 'E', 'G', 'B'], type: 'major7', mood: 'dreamy' },
    'Dmaj7': { notes: ['D', 'F#', 'A', 'C#'], type: 'major7', mood: 'dreamy' },
    'Emaj7': { notes: ['E', 'G#', 'B', 'D#'], type: 'major7', mood: 'dreamy' },
    'Fmaj7': { notes: ['F', 'A', 'C', 'E'], type: 'major7', mood: 'dreamy' },
    'Gmaj7': { notes: ['G', 'B', 'D', 'F#'], type: 'major7', mood: 'dreamy' },
    'Amaj7': { notes: ['A', 'C#', 'E', 'G#'], type: 'major7', mood: 'dreamy' },
    'Bmaj7': { notes: ['B', 'D#', 'F#', 'A#'], type: 'major7', mood: 'dreamy' },

    // Minor 7th chords
    'Cm7': { notes: ['C', 'Eb', 'G', 'Bb'], type: 'minor7', mood: 'mellow' },
    'Dm7': { notes: ['D', 'F', 'A', 'C'], type: 'minor7', mood: 'mellow' },
    'Em7': { notes: ['E', 'G', 'B', 'D'], type: 'minor7', mood: 'mellow' },
    'Fm7': { notes: ['F', 'Ab', 'C', 'Eb'], type: 'minor7', mood: 'mellow' },
    'Gm7': { notes: ['G', 'Bb', 'D', 'F'], type: 'minor7', mood: 'mellow' },
    'Am7': { notes: ['A', 'C', 'E', 'G'], type: 'minor7', mood: 'mellow' },
    'Bm7': { notes: ['B', 'D', 'F#', 'A'], type: 'minor7', mood: 'mellow' },

    // Suspended chords
    'Csus4': { notes: ['C', 'F', 'G'], type: 'sus4', mood: 'open' },
    'Dsus4': { notes: ['D', 'G', 'A'], type: 'sus4', mood: 'open' },
    'Esus4': { notes: ['E', 'A', 'B'], type: 'sus4', mood: 'open' },
    'Gsus4': { notes: ['G', 'C', 'D'], type: 'sus4', mood: 'open' },
    'Asus4': { notes: ['A', 'D', 'E'], type: 'sus4', mood: 'open' },

    'Csus2': { notes: ['C', 'D', 'G'], type: 'sus2', mood: 'open' },
    'Dsus2': { notes: ['D', 'E', 'A'], type: 'sus2', mood: 'open' },
    'Esus2': { notes: ['E', 'F#', 'B'], type: 'sus2', mood: 'open' },
    'Gsus2': { notes: ['G', 'A', 'D'], type: 'sus2', mood: 'open' },
    'Asus2': { notes: ['A', 'B', 'E'], type: 'sus2', mood: 'open' },

    // Diminished
    'Cdim': { notes: ['C', 'Eb', 'Gb'], type: 'dim', mood: 'dark' },
    'Ddim': { notes: ['D', 'F', 'Ab'], type: 'dim', mood: 'dark' },
    'Edim': { notes: ['E', 'G', 'Bb'], type: 'dim', mood: 'dark' },
    'Fdim': { notes: ['F', 'Ab', 'B'], type: 'dim', mood: 'dark' },
    'Gdim': { notes: ['G', 'Bb', 'Db'], type: 'dim', mood: 'dark' },
    'Adim': { notes: ['A', 'C', 'Eb'], type: 'dim', mood: 'dark' },
    'Bdim': { notes: ['B', 'D', 'F'], type: 'dim', mood: 'dark' },

    // Add9 chords
    'Cadd9': { notes: ['C', 'E', 'G', 'D'], type: 'add9', mood: 'bright' },
    'Dadd9': { notes: ['D', 'F#', 'A', 'E'], type: 'add9', mood: 'bright' },
    'Eadd9': { notes: ['E', 'G#', 'B', 'F#'], type: 'add9', mood: 'bright' },
    'Gadd9': { notes: ['G', 'B', 'D', 'A'], type: 'add9', mood: 'bright' },
    'Aadd9': { notes: ['A', 'C#', 'E', 'B'], type: 'add9', mood: 'bright' }
};

// Key signatures and their diatonic chords
const KEY_CHORDS = {
    'C': {
        major: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'],
        minor: ['Cm', 'Ddim', 'Eb', 'Fm', 'Gm', 'Ab', 'Bb']
    },
    'G': {
        major: ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim'],
        minor: ['Gm', 'Adim', 'Bb', 'Cm', 'Dm', 'Eb', 'F']
    },
    'D': {
        major: ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim'],
        minor: ['Dm', 'Edim', 'F', 'Gm', 'Am', 'Bb', 'C']
    },
    'A': {
        major: ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim'],
        minor: ['Am', 'Bdim', 'C', 'Dm', 'Em', 'F', 'G']
    },
    'E': {
        major: ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#dim'],
        minor: ['Em', 'F#dim', 'G', 'Am', 'Bm', 'C', 'D']
    },
    'F': {
        major: ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim'],
        minor: ['Fm', 'Gdim', 'Ab', 'Bbm', 'Cm', 'Db', 'Eb']
    },
    'Bb': {
        major: ['Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm', 'Adim'],
        minor: ['Bbm', 'Cdim', 'Db', 'Ebm', 'Fm', 'Gb', 'Ab']
    },
    'Eb': {
        major: ['Eb', 'Fm', 'Gm', 'Ab', 'Bb', 'Cm', 'Ddim'],
        minor: ['Ebm', 'Fdim', 'Gb', 'Abm', 'Bbm', 'B', 'Db']
    }
};

// Smart progression patterns based on starting chord function
const PROGRESSION_PATTERNS = {
    'I': [
        { pattern: ['I', 'V', 'vi', 'IV'], name: 'Pop Anthem', style: 'uplifting' },
        { pattern: ['I', 'IV', 'V', 'I'], name: 'Classic Rock', style: 'driving' },
        { pattern: ['I', 'vi', 'IV', 'V'], name: '50s Doo-Wop', style: 'nostalgic' },
        { pattern: ['I', 'iii', 'vi', 'IV'], name: 'Emotional Pop', style: 'emotional' },
        { pattern: ['I', 'V', 'IV', 'V'], name: 'Country Roads', style: 'country' },
        { pattern: ['I', 'IV', 'vi', 'V'], name: 'Modern Pop', style: 'contemporary' }
    ],
    'vi': [
        { pattern: ['vi', 'IV', 'I', 'V'], name: 'Sensitive Pop', style: 'emotional' },
        { pattern: ['vi', 'V', 'IV', 'V'], name: 'Dramatic Build', style: 'intense' },
        { pattern: ['vi', 'ii', 'V', 'I'], name: 'Jazz Turnaround', style: 'sophisticated' },
        { pattern: ['vi', 'IV', 'V', 'I'], name: 'Resolution', style: 'hopeful' }
    ],
    'IV': [
        { pattern: ['IV', 'V', 'I', 'I'], name: 'Plagal Build', style: 'anthemic' },
        { pattern: ['IV', 'I', 'V', 'vi'], name: 'Chorus Hook', style: 'catchy' },
        { pattern: ['IV', 'vi', 'I', 'V'], name: 'Floating', style: 'dreamy' }
    ],
    'ii': [
        { pattern: ['ii', 'V', 'I', 'I'], name: 'Jazz Standard', style: 'jazz' },
        { pattern: ['ii', 'V', 'I', 'vi'], name: 'Jazz Extended', style: 'jazz' },
        { pattern: ['ii', 'IV', 'V', 'I'], name: 'Gospel Build', style: 'gospel' }
    ],
    'V': [
        { pattern: ['V', 'IV', 'I', 'I'], name: 'Reverse Pop', style: 'fresh' },
        { pattern: ['V', 'vi', 'IV', 'I'], name: 'Descending', style: 'melancholic' }
    ],
    'i': [
        { pattern: ['i', 'VII', 'VI', 'V'], name: 'Andalusian', style: 'dramatic' },
        { pattern: ['i', 'iv', 'V', 'i'], name: 'Minor Blues', style: 'bluesy' },
        { pattern: ['i', 'VI', 'III', 'VII'], name: 'Epic Minor', style: 'cinematic' },
        { pattern: ['i', 'iv', 'VII', 'III'], name: 'Dark Pop', style: 'moody' }
    ]
};

// Melody note suggestions based on chord
const MELODY_PATTERNS = {
    'verse': {
        description: 'Start with chord tones, use passing notes',
        rhythm: 'moderate movement, space for lyrics',
        range: 'mid-range, comfortable'
    },
    'chorus': {
        description: 'Strong chord tones, memorable hook',
        rhythm: 'more active, catchy rhythm',
        range: 'higher register for impact'
    },
    'bridge': {
        description: 'Explore different notes, create contrast',
        rhythm: 'varied, break from pattern',
        range: 'can go higher or lower for drama'
    }
};

// ================================
// STUDIO STATE
// ================================
const studioState = {
    selectedKey: 'C',
    selectedScale: 'major',
    tempo: 120,
    selectedChord: null,
    currentProgression: [],
    suggestedProgressions: [],
    melodyNotes: [],
    currentSection: 'verse',
    songSections: []
};

// ================================
// INITIALIZATION
// ================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Smart Studio...');
    initializeStudio();
});

function initializeStudio() {
    // Setup all event listeners
    setupKeySelector();
    setupChordPicker();
    setupProgressionBuilder();
    setupMelodySuggestions();
    setupSectionControls();
    setupGlobalControls();

    // Initial render
    renderChordPicker();
    updateScaleInfo();
    loadSavedState();

    console.log('Smart Studio ready!');
}

// ================================
// KEY & SCALE SELECTOR
// ================================
function setupKeySelector() {
    const keySelect = document.getElementById('global-key');
    const scaleSelect = document.getElementById('global-scale');

    if (keySelect) {
        keySelect.addEventListener('change', (e) => {
            studioState.selectedKey = e.target.value;
            onKeyChange();
        });
    }

    if (scaleSelect) {
        scaleSelect.addEventListener('change', (e) => {
            studioState.selectedScale = e.target.value;
            onKeyChange();
        });
    }
}

function onKeyChange() {
    renderChordPicker();
    updateScaleInfo();
    updateProgressionSuggestions();
    updateMelodySuggestions();
    saveState();
}

function updateScaleInfo() {
    const scaleNotesEl = document.getElementById('scale-notes');
    const currentScaleEl = document.getElementById('current-scale-name');

    if (currentScaleEl) {
        currentScaleEl.textContent = `${studioState.selectedKey} ${studioState.selectedScale}`;
    }

    if (scaleNotesEl && window.Tonal) {
        try {
            const scale = window.Tonal.Scale.get(`${studioState.selectedKey} ${studioState.selectedScale}`);
            if (scale.notes) {
                scaleNotesEl.innerHTML = scale.notes.map((note, i) =>
                    `<span class="scale-note ${i === 0 ? 'root' : ''}">${note}</span>`
                ).join('');
            }
        } catch (e) {
            console.log('Scale info error:', e);
        }
    }

    // Update diatonic chords
    renderDiatonicChords();
}

function renderDiatonicChords() {
    const container = document.getElementById('diatonic-grid');
    if (!container) return;

    const keyData = KEY_CHORDS[studioState.selectedKey];
    if (!keyData) return;

    const chords = keyData[studioState.selectedScale] || keyData.major;
    const numerals = studioState.selectedScale === 'minor'
        ? ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']
        : ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];

    container.innerHTML = chords.map((chord, i) => `
        <div class="diatonic-chord" data-chord="${chord}" data-function="${numerals[i]}">
            <div class="diatonic-chord-name">${chord}</div>
            <div class="diatonic-chord-numeral">${numerals[i]}</div>
        </div>
    `).join('');

    // Add click handlers
    container.querySelectorAll('.diatonic-chord').forEach(el => {
        el.addEventListener('click', () => {
            selectChord(el.dataset.chord, el.dataset.function);
        });
    });
}

// ================================
// CHORD PICKER - Main Interface
// ================================
function setupChordPicker() {
    // Root note buttons
    document.querySelectorAll('.root-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.root-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderChordPicker(btn.dataset.root);
        });
    });

    // Chord type filter
    const typeFilter = document.getElementById('chord-type-filter');
    if (typeFilter) {
        typeFilter.addEventListener('change', () => renderChordPicker());
    }
}

function renderChordPicker(rootFilter = null) {
    const container = document.getElementById('chord-results');
    if (!container) return;

    const activeRoot = rootFilter || document.querySelector('.root-btn.active')?.dataset.root || 'C';
    const typeFilter = document.getElementById('chord-type-filter')?.value || 'all';

    // Get chords for this root
    const matchingChords = Object.entries(CHORD_DATA).filter(([name, data]) => {
        const chordRoot = name.replace(/m|7|maj|dim|sus|add|aug/g, '').replace(/[0-9]/g, '');
        const matchesRoot = chordRoot === activeRoot || chordRoot === activeRoot.replace('#', 'b');

        if (!matchesRoot) return false;

        if (typeFilter === 'all') return true;
        if (typeFilter === 'major' && data.type === 'major') return true;
        if (typeFilter === 'minor' && data.type === 'minor') return true;
        if (typeFilter === '7' && data.type === 'dominant7') return true;
        if (typeFilter === 'maj7' && data.type === 'major7') return true;
        if (typeFilter === 'm7' && data.type === 'minor7') return true;
        if (typeFilter === 'sus' && (data.type === 'sus2' || data.type === 'sus4')) return true;
        if (typeFilter === 'dim' && data.type === 'dim') return true;
        if (typeFilter === 'add' && data.type === 'add9') return true;

        return false;
    });

    if (matchingChords.length === 0) {
        container.innerHTML = `<div class="no-chords">No ${typeFilter} chords for ${activeRoot}</div>`;
        return;
    }

    container.innerHTML = matchingChords.map(([name, data]) => `
        <div class="chord-card ${studioState.selectedChord === name ? 'selected' : ''}" data-chord="${name}">
            <div class="chord-card-name">${name}</div>
            <div class="chord-card-notes">${data.notes.join(' - ')}</div>
            <div class="chord-card-type">${data.type}</div>
            <div class="chord-card-actions">
                <button class="chord-action-btn play" data-chord="${name}" title="Play chord">&#9658;</button>
                <button class="chord-action-btn add" data-chord="${name}" title="Add to progression">+</button>
            </div>
        </div>
    `).join('');

    // Add event listeners
    container.querySelectorAll('.chord-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('chord-action-btn')) {
                selectChord(card.dataset.chord);
            }
        });
    });

    container.querySelectorAll('.chord-action-btn.play').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            playChord(btn.dataset.chord);
        });
    });

    container.querySelectorAll('.chord-action-btn.add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToProgression(btn.dataset.chord);
        });
    });
}

// ================================
// CHORD SELECTION & SUGGESTIONS
// ================================
function selectChord(chordName, chordFunction = null) {
    studioState.selectedChord = chordName;

    // Update UI to show selection
    document.querySelectorAll('.chord-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.chord === chordName);
    });

    // Generate suggestions based on this chord
    generateProgressionSuggestions(chordName, chordFunction);
    generateMelodySuggestions(chordName);

    // Show suggestions panel
    showSuggestionsPanel();
}

function generateProgressionSuggestions(chordName, chordFunction = null) {
    const suggestionsContainer = document.getElementById('progression-suggestions');
    if (!suggestionsContainer) return;

    // Determine chord function if not provided
    if (!chordFunction) {
        chordFunction = getChordFunction(chordName);
    }

    const patterns = PROGRESSION_PATTERNS[chordFunction] || PROGRESSION_PATTERNS['I'];
    const key = studioState.selectedKey;
    const scale = studioState.selectedScale;

    // Convert patterns to actual chords
    const suggestions = patterns.map(p => {
        const chords = p.pattern.map(numeral => numeralToChord(numeral, key, scale));
        return {
            name: p.name,
            style: p.style,
            numerals: p.pattern,
            chords: chords
        };
    });

    studioState.suggestedProgressions = suggestions;

    suggestionsContainer.innerHTML = `
        <h4>Progressions starting with ${chordName}</h4>
        <div class="suggestion-list">
            ${suggestions.map((s, i) => `
                <div class="progression-suggestion" data-index="${i}">
                    <div class="suggestion-header">
                        <span class="suggestion-name">${s.name}</span>
                        <span class="suggestion-style">${s.style}</span>
                    </div>
                    <div class="suggestion-numerals">${s.numerals.join(' - ')}</div>
                    <div class="suggestion-chords">${s.chords.join(' - ')}</div>
                    <div class="suggestion-actions">
                        <button class="sugg-btn play-sugg" data-index="${i}">&#9658; Play</button>
                        <button class="sugg-btn use-sugg" data-index="${i}">Use This</button>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="variation-section">
            <h4>Section Variations</h4>
            <div class="variation-buttons">
                <button class="variation-btn" data-type="chorus">Chorus Variation</button>
                <button class="variation-btn" data-type="bridge">Bridge Variation</button>
                <button class="variation-btn" data-type="breakdown">Breakdown</button>
            </div>
            <div id="variation-result" class="variation-result"></div>
        </div>
    `;

    // Add event listeners
    suggestionsContainer.querySelectorAll('.play-sugg').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index);
            playProgression(studioState.suggestedProgressions[idx].chords);
        });
    });

    suggestionsContainer.querySelectorAll('.use-sugg').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index);
            useProgression(studioState.suggestedProgressions[idx].chords);
        });
    });

    suggestionsContainer.querySelectorAll('.variation-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            generateVariation(btn.dataset.type);
        });
    });
}

function generateVariation(type) {
    const resultContainer = document.getElementById('variation-result');
    if (!resultContainer) return;

    const currentProg = studioState.currentProgression;
    if (currentProg.length === 0) {
        resultContainer.innerHTML = '<p class="hint">Add chords to your progression first</p>';
        return;
    }

    let variation = [];
    let description = '';

    switch(type) {
        case 'chorus':
            // Chorus: Start on IV or V, more energy
            variation = generateChorusVariation(currentProg);
            description = 'Chorus: Starts on a strong chord for lift, more energy';
            break;
        case 'bridge':
            // Bridge: Different starting point, unexpected chords
            variation = generateBridgeVariation(currentProg);
            description = 'Bridge: Contrasting section with unexpected harmony';
            break;
        case 'breakdown':
            // Breakdown: Simplified, often just 2 chords
            variation = generateBreakdownVariation(currentProg);
            description = 'Breakdown: Stripped back for dynamic contrast';
            break;
    }

    resultContainer.innerHTML = `
        <div class="variation-output">
            <p class="variation-desc">${description}</p>
            <div class="variation-chords">${variation.join(' - ')}</div>
            <div class="variation-actions">
                <button class="var-action-btn" onclick="playProgression(${JSON.stringify(variation)})">&#9658; Play</button>
                <button class="var-action-btn" onclick="useProgressionForSection('${type}', ${JSON.stringify(variation)})">Add as ${type}</button>
            </div>
        </div>
    `;
}

function generateChorusVariation(verseProg) {
    const key = studioState.selectedKey;
    const scale = studioState.selectedScale;

    // Common chorus patterns: start on IV or V
    const chorusStarts = ['IV', 'V', 'I'];
    const startNumeral = chorusStarts[Math.floor(Math.random() * chorusStarts.length)];

    // Get different chords than verse for contrast
    const patterns = [
        ['IV', 'V', 'I', 'I'],
        ['IV', 'I', 'V', 'V'],
        ['V', 'IV', 'I', 'V'],
        ['I', 'V', 'IV', 'V']
    ];

    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    return pattern.map(n => numeralToChord(n, key, scale));
}

function generateBridgeVariation(verseProg) {
    const key = studioState.selectedKey;
    const scale = studioState.selectedScale;

    // Bridge: Often starts on vi or ii, different feel
    const patterns = [
        ['vi', 'IV', 'V', 'V'],
        ['ii', 'V', 'vi', 'IV'],
        ['iii', 'vi', 'IV', 'V'],
        ['IV', 'iv', 'I', 'V'],  // Borrowed chord for color
        ['vi', 'iii', 'IV', 'V']
    ];

    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    return pattern.map(n => numeralToChord(n, key, scale));
}

function generateBreakdownVariation(verseProg) {
    const key = studioState.selectedKey;
    const scale = studioState.selectedScale;

    // Breakdown: Just 2 chords, often I and V or I and IV
    const patterns = [
        ['I', 'V'],
        ['I', 'IV'],
        ['vi', 'IV'],
        ['I', 'vi']
    ];

    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    return pattern.map(n => numeralToChord(n, key, scale));
}

// ================================
// MELODY SUGGESTIONS
// ================================
function setupMelodySuggestions() {
    const generateBtn = document.getElementById('generate-melody-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const style = document.getElementById('melody-style')?.value || 'smooth';
            generateMelodyForProgression(style);
        });
    }
}

function generateMelodySuggestions(chordName) {
    const melodyContainer = document.getElementById('melody-result');
    if (!melodyContainer) return;

    const chordData = CHORD_DATA[chordName];
    if (!chordData) return;

    // Get scale notes
    let scaleNotes = [];
    if (window.Tonal) {
        const scale = window.Tonal.Scale.get(`${studioState.selectedKey} ${studioState.selectedScale}`);
        scaleNotes = scale.notes || [];
    }

    // Chord tones are the strongest melody notes
    const chordTones = chordData.notes;

    // Passing notes from scale
    const passingNotes = scaleNotes.filter(n => !chordTones.includes(n));

    melodyContainer.innerHTML = `
        <div class="melody-suggestion">
            <h5>Melody Notes for ${chordName}</h5>

            <div class="note-category">
                <span class="category-label">Strong (Chord Tones):</span>
                <div class="note-pills">
                    ${chordTones.map(n => `<span class="note-pill strong">${n}</span>`).join('')}
                </div>
                <p class="note-hint">Land on these for stability</p>
            </div>

            <div class="note-category">
                <span class="category-label">Passing Notes:</span>
                <div class="note-pills">
                    ${passingNotes.slice(0, 4).map(n => `<span class="note-pill passing">${n}</span>`).join('')}
                </div>
                <p class="note-hint">Use between chord tones for movement</p>
            </div>

            <div class="melody-tips">
                <h6>Tips for ${studioState.currentSection}:</h6>
                <p>${MELODY_PATTERNS[studioState.currentSection]?.description || 'Follow your instincts!'}</p>
            </div>
        </div>
    `;

    // Show actions
    const actionsEl = document.getElementById('melody-actions');
    if (actionsEl) {
        actionsEl.style.display = 'flex';
    }
}

function generateMelodyForProgression(style) {
    if (studioState.currentProgression.length === 0) {
        alert('Add chords to your progression first!');
        return;
    }

    const melodyWorkspace = document.getElementById('melody-workspace');
    if (!melodyWorkspace) return;

    // Generate melody based on chord progression
    const melody = [];
    const key = studioState.selectedKey;

    studioState.currentProgression.forEach(chordName => {
        const chordData = CHORD_DATA[chordName];
        if (chordData) {
            // Pick 2-4 notes per chord
            const numNotes = Math.floor(Math.random() * 3) + 2;
            for (let i = 0; i < numNotes; i++) {
                if (style === 'smooth' || Math.random() > 0.3) {
                    // Prefer chord tones
                    const note = chordData.notes[Math.floor(Math.random() * chordData.notes.length)];
                    melody.push({ note, isChordTone: true, chord: chordName });
                } else {
                    // Use scale note
                    if (window.Tonal) {
                        const scale = window.Tonal.Scale.get(`${key} ${studioState.selectedScale}`);
                        if (scale.notes) {
                            const note = scale.notes[Math.floor(Math.random() * scale.notes.length)];
                            melody.push({ note, isChordTone: false, chord: chordName });
                        }
                    }
                }
            }
        }
    });

    studioState.melodyNotes = melody;

    melodyWorkspace.innerHTML = `
        <div class="generated-melody">
            <div class="melody-notes-display">
                ${melody.map(m => `
                    <span class="melody-note ${m.isChordTone ? 'chord-tone' : 'scale-tone'}"
                          title="Over ${m.chord}">
                        ${m.note}
                    </span>
                `).join('')}
            </div>
            <div class="melody-legend">
                <span class="legend-item"><span class="dot chord-tone"></span> Chord Tone</span>
                <span class="legend-item"><span class="dot scale-tone"></span> Scale Tone</span>
            </div>
        </div>
    `;

    // Enable play button
    const playBtn = document.getElementById('play-canvas-melody-btn');
    if (playBtn) playBtn.disabled = false;
}

// ================================
// PROGRESSION BUILDER
// ================================
function setupProgressionBuilder() {
    const builder = document.getElementById('progression-builder');
    if (!builder) return;

    // Drag and drop
    builder.addEventListener('dragover', (e) => {
        e.preventDefault();
        builder.classList.add('drag-over');
    });

    builder.addEventListener('dragleave', () => {
        builder.classList.remove('drag-over');
    });

    builder.addEventListener('drop', (e) => {
        e.preventDefault();
        builder.classList.remove('drag-over');
        const chord = e.dataTransfer.getData('text/plain');
        if (chord) addToProgression(chord);
    });

    // Control buttons
    document.getElementById('play-progression-btn')?.addEventListener('click', () => {
        playProgression(studioState.currentProgression);
    });

    document.getElementById('clear-progression-btn')?.addEventListener('click', clearProgression);
}

function addToProgression(chordName) {
    studioState.currentProgression.push(chordName);
    renderProgression();
    updateProgressionSuggestions();
    saveState();
}

function removeFromProgression(index) {
    studioState.currentProgression.splice(index, 1);
    renderProgression();
    saveState();
}

function useProgression(chords) {
    studioState.currentProgression = [...chords];
    renderProgression();
    saveState();
}

function clearProgression() {
    studioState.currentProgression = [];
    renderProgression();
    saveState();
}

function renderProgression() {
    const builder = document.getElementById('progression-builder');
    if (!builder) return;

    const prog = studioState.currentProgression;

    if (prog.length === 0) {
        builder.innerHTML = `
            <div class="empty-builder">
                <p>Click a chord to get suggestions, or add chords here</p>
                <p class="hint">Select a chord to see progression ideas</p>
            </div>
        `;
        builder.classList.remove('has-chords');
        return;
    }

    builder.classList.add('has-chords');
    builder.innerHTML = prog.map((chord, i) => `
        <div class="progression-chord" data-index="${i}">
            <span class="progression-chord-name">${chord}</span>
            <span class="progression-chord-numeral">${getChordFunction(chord)}</span>
            <button class="remove-chord" onclick="removeFromProgression(${i})">&times;</button>
        </div>
    `).join('');

    // Update info
    const infoEl = document.getElementById('progression-info');
    if (infoEl) {
        const numerals = prog.map(c => getChordFunction(c));
        infoEl.innerHTML = `<span>Analysis: ${numerals.join(' - ')}</span>`;
    }
}

function updateProgressionSuggestions() {
    if (studioState.currentProgression.length > 0) {
        const lastChord = studioState.currentProgression[studioState.currentProgression.length - 1];
        generateProgressionSuggestions(lastChord);
    }
}

// ================================
// SONG SECTIONS
// ================================
function setupSectionControls() {
    document.getElementById('add-verse-btn')?.addEventListener('click', () => addSection('verse'));
    document.getElementById('add-chorus-btn')?.addEventListener('click', () => addSection('chorus'));
    document.getElementById('add-bridge-btn')?.addEventListener('click', () => addSection('bridge'));
}

function addSection(type) {
    const section = {
        id: Date.now(),
        type: type,
        chords: [...studioState.currentProgression],
        lyrics: ''
    };
    studioState.songSections.push(section);
    renderSections();
    saveState();
}

function renderSections() {
    const container = document.getElementById('song-sections');
    if (!container) return;

    if (studioState.songSections.length === 0) {
        container.innerHTML = '<div class="empty-sections"><p>Add sections to build your song structure</p></div>';
        return;
    }

    container.innerHTML = studioState.songSections.map(s => `
        <div class="song-section" data-id="${s.id}">
            <div class="song-section-header">
                <span class="section-type">${s.type}</span>
                <button class="remove-section" onclick="removeSection(${s.id})">&times;</button>
            </div>
            <div class="section-chords">${s.chords.join(' | ') || 'No chords'}</div>
            <textarea class="section-lyrics" placeholder="Add lyrics..."
                onchange="updateSectionLyrics(${s.id}, this.value)">${s.lyrics}</textarea>
        </div>
    `).join('');
}

window.removeSection = function(id) {
    studioState.songSections = studioState.songSections.filter(s => s.id !== id);
    renderSections();
    saveState();
};

window.updateSectionLyrics = function(id, lyrics) {
    const section = studioState.songSections.find(s => s.id === id);
    if (section) {
        section.lyrics = lyrics;
        saveState();
    }
};

window.useProgressionForSection = function(type, chords) {
    const section = {
        id: Date.now(),
        type: type,
        chords: chords,
        lyrics: ''
    };
    studioState.songSections.push(section);
    renderSections();
    saveState();
};

// ================================
// HELPER FUNCTIONS
// ================================
function getChordFunction(chordName) {
    const key = studioState.selectedKey;
    const scale = studioState.selectedScale;
    const keyChords = KEY_CHORDS[key];

    if (!keyChords) return '?';

    const diatonic = keyChords[scale] || keyChords.major;
    const numerals = scale === 'minor'
        ? ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']
        : ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];

    const idx = diatonic.indexOf(chordName);
    return idx >= 0 ? numerals[idx] : '?';
}

function numeralToChord(numeral, key, scale) {
    const keyChords = KEY_CHORDS[key];
    if (!keyChords) return numeral;

    const diatonic = keyChords[scale] || keyChords.major;
    const numerals = scale === 'minor'
        ? ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']
        : ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];

    const idx = numerals.indexOf(numeral);
    return idx >= 0 ? diatonic[idx] : numeral;
}

function showSuggestionsPanel() {
    // Make sure suggestions are visible
    const panel = document.getElementById('progression-suggestions');
    if (panel) {
        panel.classList.add('active');
    }
}

// ================================
// AUDIO PLAYBACK
// ================================
async function playChord(chordName) {
    console.log('Playing:', chordName);
    if (window.playGuitarChord) {
        window.playGuitarChord(chordName);
    }
}

window.playProgression = async function(chords) {
    if (!chords || chords.length === 0) return;

    const tempo = studioState.tempo;
    const beatDuration = (60 / tempo) * 1000 * 2; // 2 beats per chord

    for (const chord of chords) {
        await playChord(chord);
        await new Promise(r => setTimeout(r, beatDuration));
    }
};

// ================================
// GLOBAL CONTROLS
// ================================
function setupGlobalControls() {
    document.getElementById('global-tempo')?.addEventListener('change', (e) => {
        studioState.tempo = parseInt(e.target.value) || 120;
    });

    document.getElementById('new-song-btn')?.addEventListener('click', newSong);
    document.getElementById('save-song-btn')?.addEventListener('click', () => {
        saveState();
        alert('Song saved!');
    });
    document.getElementById('export-btn')?.addEventListener('click', exportSong);
}

function newSong() {
    if (confirm('Start a new song? This will clear your current work.')) {
        studioState.currentProgression = [];
        studioState.songSections = [];
        studioState.melodyNotes = [];
        document.getElementById('song-title').value = '';
        renderProgression();
        renderSections();
        localStorage.removeItem('studioState');
    }
}

function exportSong() {
    const title = document.getElementById('song-title')?.value || 'Untitled';

    let text = `SONG: ${title}\n`;
    text += `Key: ${studioState.selectedKey} ${studioState.selectedScale}\n`;
    text += `Tempo: ${studioState.tempo} BPM\n\n`;
    text += `PROGRESSION: ${studioState.currentProgression.join(' | ')}\n\n`;

    if (studioState.songSections.length > 0) {
        text += 'STRUCTURE:\n';
        studioState.songSections.forEach(s => {
            text += `\n[${s.type.toUpperCase()}]\n`;
            text += `Chords: ${s.chords.join(' | ')}\n`;
            if (s.lyrics) text += `${s.lyrics}\n`;
        });
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// ================================
// STATE PERSISTENCE
// ================================
function saveState() {
    const state = {
        selectedKey: studioState.selectedKey,
        selectedScale: studioState.selectedScale,
        tempo: studioState.tempo,
        currentProgression: studioState.currentProgression,
        songSections: studioState.songSections,
        songTitle: document.getElementById('song-title')?.value || ''
    };
    localStorage.setItem('studioState', JSON.stringify(state));
}

function loadSavedState() {
    try {
        const saved = localStorage.getItem('studioState');
        if (saved) {
            const state = JSON.parse(saved);
            Object.assign(studioState, state);

            // Update UI
            const keyEl = document.getElementById('global-key');
            const scaleEl = document.getElementById('global-scale');
            const tempoEl = document.getElementById('global-tempo');
            const titleEl = document.getElementById('song-title');

            if (keyEl) keyEl.value = studioState.selectedKey;
            if (scaleEl) scaleEl.value = studioState.selectedScale;
            if (tempoEl) tempoEl.value = studioState.tempo;
            if (titleEl && state.songTitle) titleEl.value = state.songTitle;

            renderProgression();
            renderSections();
        }
    } catch (e) {
        console.error('Error loading state:', e);
    }
}

// ================================
// EXPOSE TO WINDOW FOR ONCLICK
// ================================
window.removeFromProgression = removeFromProgression;
window.selectChord = selectChord;
window.addToProgression = addToProgression;
