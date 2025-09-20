// ui.js - All DOM manipulation and rendering functions

export function showStep(stepId) {
    // Hide all steps
    document.querySelectorAll('.step-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the requested step
    const targetStep = document.getElementById(stepId);
    if (targetStep) {
        targetStep.classList.add('active');
    }
    
    // Update progress bar
    updateProgressBar(stepId);
}

export function updateProgressBar(currentStepId) {
    const stepMap = {
        'step-mood': 1,
        'step-key-tempo': 2,
        'step-chords': 3,
        'step-drums': 4,
        'step-bass': 5,
        'step-melody': 6,
        'step-structure': 7,
        'step-arrangement': 8,
        'step-lyrics': 9,
        'step-export': 10
    };
    
    const currentStepNumber = stepMap[currentStepId] || 1;
    
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber < currentStepNumber) {
            step.classList.add('completed');
        } else if (stepNumber === currentStepNumber) {
            step.classList.add('active');
        }
    });
}

export function renderMoods(moods, container) {
    const moodContainer = document.getElementById(container);
    if (!moodContainer) return;
    
    moodContainer.innerHTML = '';
    
    moods.forEach(mood => {
        const moodCard = document.createElement('div');
        moodCard.className = 'option-card';
        moodCard.dataset.moodId = mood.id;
        
        moodCard.innerHTML = `
            <h4>${mood.name}</h4>
            <p>${mood.description}</p>
        `;
        
        moodCard.addEventListener('click', () => selectOption(moodCard, 'mood'));
        moodContainer.appendChild(moodCard);
    });
}

export function renderGenres(genres, container) {
    const genreContainer = document.getElementById(container);
    if (!genreContainer) return;
    
    genreContainer.innerHTML = '';
    
    genres.forEach(genre => {
        const genreCard = document.createElement('div');
        genreCard.className = 'option-card';
        genreCard.dataset.genreId = genre.id;
        
        genreCard.innerHTML = `
            <h4>${genre.name}</h4>
            <p>${genre.description}</p>
        `;
        
        genreCard.addEventListener('click', () => selectOption(genreCard, 'genre'));
        genreContainer.appendChild(genreCard);
    });
}

export function renderKeys(keys, container) {
    const keyContainer = document.getElementById(container);
    if (!keyContainer) return;
    
    keyContainer.innerHTML = '';
    
    keys.forEach(key => {
        const keyCard = document.createElement('div');
        keyCard.className = 'option-card';
        keyCard.dataset.key = key;
        
        keyCard.innerHTML = `
            <h4>${key}</h4>
            <p>Musical Key</p>
        `;
        
        keyCard.addEventListener('click', () => selectOption(keyCard, 'key'));
        keyContainer.appendChild(keyCard);
    });
}

export function renderScales(scales, container) {
    const scaleContainer = document.getElementById(container);
    if (!scaleContainer) return;
    
    scaleContainer.innerHTML = '';
    
    scales.forEach(scale => {
        const scaleCard = document.createElement('div');
        scaleCard.className = 'option-card';
        scaleCard.dataset.scale = scale.type;
        
        scaleCard.innerHTML = `
            <h4>${scale.name}</h4>
            <p>${scale.description}</p>
        `;

        scaleCard.addEventListener('click', () => {
            selectOption(scaleCard, 'scale');
        });
        scaleContainer.appendChild(scaleCard);
    });
}

export function renderTempos(tempoRange, container) {
    const tempoContainer = document.getElementById(container);
    if (!tempoContainer) return;
    
    tempoContainer.innerHTML = '';
    
    const [minTempo, maxTempo] = tempoRange;
    const tempoOptions = [];
    
    // Generate tempo options in the range
    for (let tempo = minTempo; tempo <= maxTempo; tempo += 10) {
        tempoOptions.push(tempo);
    }
    
    // Ensure we have at least 3 options
    if (tempoOptions.length < 3) {
        tempoOptions.push(minTempo + 5, maxTempo - 5);
    }
    
    tempoOptions.sort((a, b) => a - b);
    
    tempoOptions.forEach(tempo => {
        const tempoCard = document.createElement('div');
        tempoCard.className = 'option-card';
        tempoCard.dataset.tempo = tempo;
        
        let description = 'Medium';
        if (tempo < 80) description = 'Slow';
        else if (tempo < 100) description = 'Relaxed';
        else if (tempo < 120) description = 'Moderate';
        else if (tempo < 140) description = 'Upbeat';
        else description = 'Fast';
        
        tempoCard.innerHTML = `
            <h4>${tempo} BPM</h4>
            <p>${description}</p>
        `;
        
        tempoCard.addEventListener('click', () => selectOption(tempoCard, 'tempo'));
        tempoContainer.appendChild(tempoCard);
    });
}

export function renderChordProgressions(progressions, container) {
    const chordContainer = document.getElementById(container);
    if (!chordContainer) return;
    
    chordContainer.innerHTML = '';
    
    progressions.forEach(progression => {
        const chordCard = document.createElement('div');
        chordCard.className = 'chord-card';
        chordCard.dataset.progressionId = progression.id;
        
        chordCard.innerHTML = `
            <h4>${progression.name}</h4>
            <p>${progression.description}</p>
            <div class="chord-preview">${progression.numerals.join(' - ')}</div>
        `;
        
        chordCard.addEventListener('click', () => {
            selectOption(chordCard, 'chord-progression');
            // Get the current key from appState if available
            const currentKey = window.appState?.songData?.key || progression.key || 'C';
            displayChords(progression, currentKey);
        });
        
        chordContainer.appendChild(chordCard);
    });
}

export function displayChords(chordProgression, key) {
    const chordDisplay = document.getElementById('chord-display');
    if (!chordDisplay || !chordProgression) return;


    // Generate chord diagrams grouped by instrument
    let chordDiagramsHTML = '';
    if (chordProgression.chords && chordProgression.chords.length > 0) {
        // Generate diagrams for all chords
        const allDiagrams = chordProgression.chords.map(chord => {
            if (window.generateChordDiagrams) {
                try {
                    const diagrams = window.generateChordDiagrams(chord);
                    return {
                        chord: chord,
                        diagrams: diagrams
                    };
                } catch (error) {
                    console.error(`Error generating diagrams for ${chord}:`, error);
                    return {
                        chord: chord,
                        diagrams: {
                            guitar: `<div class="diagram-error">Cannot display ${chord}</div>`,
                            piano: `<div class="diagram-error">Cannot display ${chord}</div>`,
                            bass: `<div class="diagram-error">Cannot display ${chord}</div>`
                        }
                    };
                }
            }
            return {
                chord: chord,
                diagrams: { guitar: '', piano: '', bass: '' }
            };
        });

        chordDiagramsHTML = `
            <div class="chord-diagrams">
                <h6>🎸 Visual Chord Guide</h6>

                <!-- Guitar Row -->
                <div class="instrument-section">
                    <h7 class="instrument-title">🎸 Guitar</h7>
                    <div class="instrument-diagrams-row">
                        ${allDiagrams.map(({ chord, diagrams }) => `
                            <div class="instrument-chord-diagram">
                                <div class="chord-name">${chord}</div>
                                <div class="svg-guitar-container">${diagrams.guitar}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Piano Row -->
                <div class="instrument-section">
                    <h7 class="instrument-title">🎹 Piano</h7>
                    <div class="instrument-diagrams-row">
                        ${allDiagrams.map(({ chord, diagrams }) => `
                            <div class="instrument-chord-diagram">
                                <div class="chord-name">${chord}</div>
                                <div class="svg-piano-container">${diagrams.piano}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Bass Row -->
                <div class="instrument-section">
                    <h7 class="instrument-title">🎸 Bass</h7>
                    <div class="instrument-diagrams-row">
                        ${allDiagrams.map(({ chord, diagrams }) => `
                            <div class="instrument-chord-diagram">
                                <div class="chord-name">${chord}</div>
                                <div class="svg-bass-container">${diagrams.bass}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Create individual chord enhancement interface
    const individualChordsHTML = chordProgression.chords.map((chord, index) => `
        <div class="individual-chord" data-chord-index="${index}">
            <div class="chord-header" onclick="playIndividualChord('${chord}')" title="Click to play chord">
                <span class="chord-name">${chord}</span>
                <span class="chord-numeral">${chordProgression.numerals[index]}</span>
            </div>
            <div class="chord-enhancement-options">
                <button class="mini-enhancement-btn" onclick="showChordOptions(${index}, 'inversions')" title="Inversions">
                    🔄
                </button>
                <button class="mini-enhancement-btn" onclick="showChordOptions(${index}, 'extensions')" title="Extensions">
                    ➕
                </button>
                <button class="mini-enhancement-btn" onclick="showChordOptions(${index}, 'substitutions')" title="Substitutions">
                    🔀
                </button>
                <button class="mini-enhancement-btn" onclick="showChordOptions(${index}, 'voicings')" title="Voicings">
                    🎹
                </button>
            </div>
        </div>
    `).join('');

    chordDisplay.innerHTML = `
        <div class="chord-progression">
            <h5>${chordProgression.name}</h5>

            <!-- Individual Chord Controls -->
            <div class="chord-enhancement-section">
                <h6>🎼 Individual Chord Enhancements</h6>
                <p class="enhancement-tip">Click icons below each chord to customize individually:</p>
                <div class="individual-chords-grid">
                    ${individualChordsHTML}
                </div>
            </div>

            <!-- Chord Options Panel -->
            <div id="chord-options-panel" class="chord-options-panel" style="display: none;">
                <div class="panel-header">
                    <h6 id="panel-title">Enhance Chord</h6>
                    <button class="close-panel-btn" onclick="closeChordOptionsPanel()">×</button>
                </div>
                <div id="panel-content" class="panel-content"></div>
            </div>

            <!-- Original Display -->
            <div class="progression-summary">
                <div class="chords" id="current-chords">${chordProgression.chords.join(' - ')}</div>
                <div class="numerals">${chordProgression.numerals.join(' - ')}</div>
            </div>

            <div class="audio-controls">
                <button class="play-btn" onclick="playChordProgression('${chordProgression.name}')">
                    ▶️ Play Progression
                </button>
                <button class="stop-btn" onclick="stopAudio()">
                    ⏹️ Stop
                </button>
                <button class="reset-btn" onclick="resetProgression()">
                    🔄 Reset All
                </button>
            </div>
            ${chordDiagramsHTML}
        </div>
    `;

    // Store the original progression for reset functionality
    if (!window.originalProgression) {
        window.originalProgression = {
            name: chordProgression.name,
            chords: [...chordProgression.chords],
            numerals: [...chordProgression.numerals]
        };
    }
}

export function renderDrumPatterns(patterns, container) {
    const drumContainer = document.getElementById(container);
    if (!drumContainer) return;
    
    drumContainer.innerHTML = '';
    
    patterns.forEach(pattern => {
        const drumCard = document.createElement('div');
        drumCard.className = 'drum-card';
        drumCard.dataset.patternId = pattern.id;
        
        drumCard.innerHTML = `
            <h4>${pattern.name}</h4>
            <p>${pattern.description}</p>
            <div class="pattern-preview">${pattern.pattern}</div>
        `;
        
        drumCard.addEventListener('click', () => {
            selectOption(drumCard, 'drum-pattern');
            displayDrumPattern(pattern);
        });
        
        drumContainer.appendChild(drumCard);
    });
}

export function displayDrumPattern(drumPattern) {
    const drumDisplay = document.getElementById('drum-display');
    if (!drumDisplay || !drumPattern) return;

    let gridHTML = '<div class="drum-grid-display">';
    drumPattern.grid.forEach(track => {
        gridHTML += `<div class="drum-track">`;
        gridHTML += `<span class="track-name">${track[0]}</span>`;
        for (let i = 1; i < track.length; i++) {
            gridHTML += `<span class="beat ${track[i] === 'x' ? 'active' : ''}">${track[i]}</span>`;
        }
        gridHTML += `</div>`;
    });
    gridHTML += '</div>';

    drumDisplay.innerHTML = `
        <div class="drum-pattern-display">
            <h5>${drumPattern.name}</h5>
            ${gridHTML}
            <div class="audio-controls">
                <button class="play-btn" onclick="playDrumPattern('${drumPattern.name}')">
                    🥁 Play Beat
                </button>
                <button class="stop-btn" onclick="stopAudio()">
                    ⏹️ Stop
                </button>
            </div>
            <button class="theory-toggle" onclick="toggleTheoryExplanation('rhythm-theory')">
                🎓 Learn the Rhythm Theory
            </button>
            <div id="rhythm-theory" class="theory-explanation" style="display: none;">
                <div class="loading">Loading rhythm explanation...</div>
            </div>
        </div>
    `;

    // Load rhythm theory explanation asynchronously
    if (window.MusicTheory && window.MusicTheory.explainRhythm) {
        setTimeout(() => {
            try {
                console.log('Explaining rhythm pattern:', drumPattern.name);
                const explanation = window.MusicTheory.explainRhythm(drumPattern);
                console.log('Generated rhythm explanation:', explanation);
                if (explanation) {
                    renderRhythmTheoryExplanation(explanation, 'rhythm-theory');
                } else {
                    document.getElementById('rhythm-theory').innerHTML = '<p>Could not generate rhythm explanation.</p>';
                }
            } catch (error) {
                console.error('Error generating rhythm theory:', error);
                document.getElementById('rhythm-theory').innerHTML = '<p>Error loading rhythm explanation.</p>';
            }
        }, 100);
    } else {
        console.log('Rhythm theory not available:', { MusicTheory: !!window.MusicTheory, func: !!window.MusicTheory?.explainRhythm });
        document.getElementById('rhythm-theory').innerHTML = '<p>Rhythm theory not available.</p>';
    }
}

export function renderBassOptions(bassLines, container) {
    const bassContainer = document.getElementById(container);
    if (!bassContainer) return;

    bassContainer.innerHTML = '';

    // Get all available bass patterns from music theory
    const bassPatterns = window.MusicTheory?.getAvailableBassPatterns?.() || [
        { id: 'simple', name: 'Simple Root', description: 'Root notes following chord changes' },
        { id: 'walking', name: 'Walking Bass', description: 'Jazz-style walking bass with passing tones' },
        { id: 'octave', name: 'Octave Bass', description: 'Root note played in different octaves' },
        { id: 'fifths', name: 'Root-Fifth', description: 'Alternating between root and fifth' },
        { id: 'triads', name: 'Triad Arpeggios', description: 'Playing through chord tones (1-3-5)' },
        { id: 'syncopated', name: 'Syncopated Funk', description: 'Funky syncopated bass rhythm' },
        { id: 'pedal', name: 'Pedal Tone', description: 'Sustained root note throughout' },
        { id: 'chromatic', name: 'Chromatic Walk', description: 'Chromatic passing tones between chords' },
        { id: 'reggae', name: 'Reggae One-Drop', description: 'Reggae-style bass with emphasis on off-beats' },
        { id: 'latin', name: 'Latin Montuno', description: 'Latin-style bass pattern with syncopation' }
    ];

    bassPatterns.forEach(pattern => {
        const bassCard = document.createElement('div');
        bassCard.className = 'bass-card';
        bassCard.dataset.patternId = pattern.id;

        bassCard.innerHTML = `
            <h4>${pattern.name}</h4>
            <p>${pattern.description}</p>
        `;

        bassCard.addEventListener('click', () => {
            selectOption(bassCard, 'bass-pattern');
            // Generate and display the bass line preview
            generateBassPreview(pattern.id);
        });
        bassContainer.appendChild(bassCard);
    });
}

// Generate a preview of the bass pattern
function generateBassPreview(patternId) {
    if (!window.appState?.songData?.chordProgression) return;

    try {
        const bassLine = window.MusicTheory.generateBassLine(
            window.appState.songData.chordProgression,
            patternId
        );
        window.appState.songData.bassLine = bassLine;
        window.appState.songData.bassPattern = patternId;
        displayBassLine(bassLine);
    } catch (error) {
        console.error('Error generating bass preview:', error);
    }
}

export function displayBassLine(bassLine) {
    const bassDisplay = document.getElementById('bass-display');
    if (!bassDisplay || !bassLine) return;

    const bassNotes = bassLine.map(note => note.note).join(' - ');

    bassDisplay.innerHTML = `
        <div class="bass-line-display">
            <h5>Bass Line</h5>
            <div class="bass-notes">${bassNotes}</div>
            <div class="audio-controls">
                <button class="play-btn" onclick="playBassLine()">
                    🎸 Play Bass
                </button>
                <button class="stop-btn" onclick="stopAudio()">
                    ⏹️ Stop
                </button>
            </div>
        </div>
    `;
}

export function renderMelodyIdeas(melodyIdeas, container) {
    const melodyContainer = document.getElementById(container);
    if (!melodyContainer) return;

    // Generate smart melody suggestions if chord progression and key are available
    let smartMelodyHTML = '';
    const currentChordProgression = window.appState?.currentProgression;
    const currentKey = window.appState?.currentKey;

    if (currentChordProgression && currentKey && window.MusicTheory?.generateSmartMelody) {
        smartMelodyHTML = `
            <div class="smart-melody-generator">
                <h6>🤖 AI Melody Generator</h6>
                <p>Generate melodies that follow voice leading principles with your chord progression</p>
                <div class="melody-styles">
                    <button class="melody-style-btn" onclick="generateSmartMelody('smooth')">
                        🎵 Smooth & Flowing
                    </button>
                    <button class="melody-style-btn" onclick="generateSmartMelody('angular')">
                        🎢 Angular & Dramatic
                    </button>
                    <button class="melody-style-btn" onclick="generateSmartMelody('pentatonic')">
                        🎯 Pentatonic & Safe
                    </button>
                </div>
                <div id="generated-melody" class="generated-melody" style="display: none;"></div>
            </div>
        `;
    }

    melodyContainer.innerHTML = `
        <div class="melody-ideas-wrapper">
            ${smartMelodyHTML}
            <div class="melody-options" id="melody-options"></div>
            <button class="theory-toggle" onclick="toggleTheoryExplanation('melody-theory')">
                🎓 Learn Melody Theory
            </button>
            <div id="melody-theory" class="theory-explanation" style="display: none;">
                <div class="loading">Loading melody theory...</div>
            </div>
        </div>
    `;

    const melodyOptionsContainer = document.getElementById('melody-options');

    melodyIdeas.forEach((idea, index) => {
        const melodyCard = document.createElement('div');
        melodyCard.className = 'melody-card';
        melodyCard.dataset.melodyIndex = index;

        // Add genre and difficulty classes for styling
        if (idea.genre) melodyCard.classList.add(`genre-${idea.genre}`);
        if (idea.difficulty) melodyCard.classList.add(`difficulty-${idea.difficulty}`);

        melodyCard.innerHTML = `
            <h4>${idea.name}</h4>
            <p>${idea.description}</p>
            <div class="melody-preview">${idea.pattern.join(' - ')}</div>
            <div class="melody-tags">
                ${idea.genre ? `<span class="genre-badge genre-${idea.genre}">${idea.genre}</span>` : ''}
                ${idea.difficulty ? `<span class="difficulty-badge difficulty-${idea.difficulty}">${idea.difficulty}</span>` : ''}
                ${idea.rhythm ? `<span class="rhythm-badge">${idea.rhythm}</span>` : ''}
            </div>
        `;

        melodyCard.addEventListener('click', () => {
            selectOption(melodyCard, 'melody-idea');
            displayMelody(idea);
        });

        melodyOptionsContainer.appendChild(melodyCard);
    });

    // Load melody theory explanation
    setTimeout(() => {
        renderMelodyTheoryTips(melodyIdeas, 'melody-theory');
    }, 100);
}

export function displayMelody(melodyIdea) {
    const melodyDisplay = document.getElementById('melody-display');
    if (!melodyDisplay || !melodyIdea) return;

    melodyDisplay.innerHTML = `
        <div class="melody-display">
            <h5>${melodyIdea.name}</h5>
            <div class="melody-notes">${melodyIdea.pattern.join(' - ')}</div>
            <div class="rhythm-info">Rhythm: ${melodyIdea.rhythm} notes</div>
            <div class="audio-controls">
                <button class="play-btn" onclick="playMelodyIdea()">
                    🎵 Play Melody
                </button>
                <button class="stop-btn" onclick="stopAudio()">
                    ⏹️ Stop
                </button>
            </div>
        </div>
    `;
}

export function renderSongStructure(structures, container) {
    const structureContainer = document.getElementById(container);
    if (!structureContainer) return;
    
    const templatesDiv = structureContainer.querySelector('.structure-templates');
    const editorDiv = structureContainer.querySelector('.structure-editor');
    
    if (!templatesDiv || !editorDiv) return;
    
    templatesDiv.innerHTML = '<h4>Choose a Template</h4>';
    editorDiv.innerHTML = '<h4>Your Song Structure</h4><div id="structure-sections"></div>';
    
    structures.forEach((structure, index) => {
        const structureCard = document.createElement('div');
        structureCard.className = 'option-card';
        structureCard.dataset.structureIndex = index;
        
        structureCard.innerHTML = `
            <h4>${structure.name}</h4>
            <p>${structure.sections.join(' → ')}</p>
        `;
        
        structureCard.addEventListener('click', () => {
            selectOption(structureCard, 'song-structure');
            displaySongStructure(structure);
        });
        
        templatesDiv.appendChild(structureCard);
    });
}

export function displaySongStructure(structure) {
    const sectionsContainer = document.getElementById('structure-sections');
    if (!sectionsContainer) return;
    
    sectionsContainer.innerHTML = '';
    
    structure.sections.forEach((section, index) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'structure-section';
        sectionDiv.innerHTML = `
            <span class="section-number">${index + 1}</span>
            <span class="section-name">${section}</span>
        `;
        sectionsContainer.appendChild(sectionDiv);
    });
}

export function renderArrangementTips(arrangementTips, container) {
    const arrangementContainer = document.getElementById(container);
    if (!arrangementContainer) return;
    
    arrangementContainer.innerHTML = '<h3>Arrangement Suggestions</h3>';
    
    Object.entries(arrangementTips).forEach(([section, tip]) => {
        const tipDiv = document.createElement('div');
        tipDiv.className = 'arrangement-tip';
        tipDiv.innerHTML = `
            <h4>${section}</h4>
            <p>${tip}</p>
        `;
        arrangementContainer.appendChild(tipDiv);
    });
}

export function renderThematicWords(words, container) {
    const wordsContainer = document.getElementById(container);
    if (!wordsContainer) return;
    
    wordsContainer.innerHTML = '';
    
    words.forEach(word => {
        const wordTag = document.createElement('span');
        wordTag.className = 'word-tag';
        wordTag.textContent = word;
        wordTag.addEventListener('click', () => addWordToLyrics(word));
        wordsContainer.appendChild(wordTag);
    });
}

function addWordToLyrics(word) {
    const lyricsTextarea = document.getElementById('lyrics-text');
    if (lyricsTextarea) {
        const currentText = lyricsTextarea.value;
        const caretPos = lyricsTextarea.selectionStart;
        const newText = currentText.substring(0, caretPos) + word + ' ' + currentText.substring(caretPos);
        lyricsTextarea.value = newText;
        lyricsTextarea.focus();
        lyricsTextarea.setSelectionRange(caretPos + word.length + 1, caretPos + word.length + 1);
    }
}

function generateBassLineForSection(chordProgression, bassBassLine, bassPattern) {
    if (!chordProgression) return '';

    // Parse the chord progression (e.g., "C - Am - F - G")
    const chords = chordProgression.split(' - ').map(chord => chord.trim());

    // Generate bass notes based on the selected bass pattern
    let bassNotes = [];

    if (bassPattern?.name === 'Octave Emphasis') {
        // Root + octave pattern
        bassNotes = chords.flatMap(chord => {
            const root = getChordRoot(chord);
            return [root, root.toLowerCase()]; // Root and octave (using lowercase to indicate higher octave)
        });
    } else if (bassPattern?.name === 'Fifth Movement') {
        // Root + fifth pattern
        bassNotes = chords.flatMap(chord => {
            const root = getChordRoot(chord);
            const fifth = getFifth(chord);
            return [root, fifth];
        });
    } else if (bassPattern?.name === 'Triad Arpeggio') {
        // Root + third + fifth pattern
        bassNotes = chords.flatMap(chord => {
            const root = getChordRoot(chord);
            const third = getThird(chord);
            const fifth = getFifth(chord);
            return [root, third, fifth];
        });
    } else if (bassPattern?.name === 'Walking Bass') {
        // Chromatic walking between roots
        bassNotes = [];
        for (let i = 0; i < chords.length; i++) {
            const currentRoot = getChordRoot(chords[i]);
            bassNotes.push(currentRoot);

            if (i < chords.length - 1) {
                const nextRoot = getChordRoot(chords[i + 1]);
                // Add a passing tone between roots
                bassNotes.push(getPassingTone(currentRoot, nextRoot));
            }
        }
    } else {
        // Default: just root notes
        bassNotes = chords.map(chord => getChordRoot(chord));
    }

    const bassLineText = bassNotes.join(' - ');
    const patternName = bassPattern?.name || 'Root Notes';

    return `<div class="bass-line"><strong>Bass (${patternName}):</strong> ${bassLineText}</div>`;
}

// Helper functions for bass note generation
function getChordRoot(chord) {
    // Extract root note from chord (handles things like Cm, C7, etc.)
    return chord.charAt(0).toUpperCase();
}

function getFifth(chord) {
    const root = getChordRoot(chord);
    const fifths = {
        'C': 'G', 'D': 'A', 'E': 'B', 'F': 'C', 'G': 'D', 'A': 'E', 'B': 'F#',
        'C#': 'G#', 'D#': 'A#', 'F#': 'C#', 'G#': 'D#', 'A#': 'F'
    };
    return fifths[root] || root;
}

function getThird(chord) {
    const root = getChordRoot(chord);
    const isMinor = chord.includes('m') && !chord.includes('maj');

    const majorThirds = {
        'C': 'E', 'D': 'F#', 'E': 'G#', 'F': 'A', 'G': 'B', 'A': 'C#', 'B': 'D#',
        'C#': 'F', 'D#': 'G', 'F#': 'A#', 'G#': 'C', 'A#': 'D'
    };

    const minorThirds = {
        'C': 'Eb', 'D': 'F', 'E': 'G', 'F': 'Ab', 'G': 'Bb', 'A': 'C', 'B': 'D',
        'C#': 'E', 'D#': 'F#', 'F#': 'A', 'G#': 'B', 'A#': 'C#'
    };

    return isMinor ? (minorThirds[root] || root) : (majorThirds[root] || root);
}

function getPassingTone(fromNote, toNote) {
    // Simple chromatic passing tone logic
    const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const fromIndex = noteOrder.indexOf(fromNote);
    const toIndex = noteOrder.indexOf(toNote);

    if (fromIndex === -1 || toIndex === -1) return fromNote;

    // Find a note between them
    if (fromIndex < toIndex) {
        return noteOrder[(fromIndex + 1) % 12];
    } else {
        return noteOrder[(fromIndex - 1 + 12) % 12];
    }
}

function renderSongStructureSummary(songSections) {
    if (!songSections || songSections.length === 0) {
        return '';
    }

    // Get bass line info from app state
    const songData = window.appState?.songData;
    const bassLine = songData?.bassLine;
    const bassPattern = songData?.bassPattern;

    return `
        <div class="song-structure-summary">
            <h3>Song Structure</h3>
            <div class="sections-preview">
                ${songSections.map((section, index) => `
                    <div class="section-preview">
                        <div class="section-preview-header">
                            <span class="section-number">${index + 1}</span>
                            <span class="section-preview-type">${section.type}</span>
                        </div>
                        ${section.chords ? `
                            <div class="section-chords">
                                <div class="chord-line"><strong>Chords:</strong> ${section.chords}</div>
                                ${generateBassLineForSection(section.chords, bassLine, bassPattern)}
                            </div>
                        ` : ''}
                        ${section.lyrics ? `<div class="section-lyrics">${section.lyrics.split('\n').slice(0, 2).join('\n')}${section.lyrics.split('\n').length > 2 ? '...' : ''}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

export function renderSongSummary(songData, container) {
    const summaryContainer = document.getElementById(container);
    if (!summaryContainer) return;
    
    summaryContainer.innerHTML = `
        <h3>Your Complete Song Plan</h3>
        <div class="summary-grid">
            <div class="summary-section">
                <h4>Foundation</h4>
                <p><strong>Mood:</strong> ${songData.mood?.name || 'Not set'}</p>
                <p><strong>Genre:</strong> ${songData.genre?.name || 'Not set'}</p>
                <p><strong>Key:</strong> ${songData.key || 'Not set'}</p>
                <p><strong>Scale:</strong> ${songData.scale || 'Not set'}</p>
                <p><strong>Tempo:</strong> ${songData.tempo || 'Not set'} BPM</p>
            </div>
            <div class="summary-section">
                <h4>Musical Elements</h4>
                <p><strong>Chords:</strong> ${songData.chordProgression?.chords.join(' - ') || 'Not set'}</p>
                <p><strong>Drum Pattern:</strong> ${songData.drumPattern?.name || 'Not set'}</p>
                <p><strong>Bass Line:</strong> ${songData.bassLine?.map(note => note.note).join(' - ') || 'Not set'}</p>
            </div>
            <div class="summary-section">
                <h4>Creative Elements</h4>
                <p><strong>Melody:</strong> ${songData.melodyIdea?.name || 'Not set'}</p>
                <p><strong>Song Sections:</strong> ${songData.songSections?.length || 0} sections created</p>
            </div>
        </div>

        ${renderSongStructureSummary(songData.songSections)}
    `;
}

export function selectOption(cardElement, optionType) {
    // Remove selection from siblings
    const siblings = cardElement.parentNode.querySelectorAll('.option-card, .chord-card, .drum-card, .bass-card, .melody-card');
    siblings.forEach(sibling => sibling.classList.remove('selected'));
    
    // Add selection to clicked card
    cardElement.classList.add('selected');
    
    // Enable next button if available
    const currentSection = cardElement.closest('.step-section');
    const nextButton = currentSection?.querySelector('.next-button');
    if (nextButton) {
        nextButton.disabled = false;
    }
    
    // Trigger custom event for the main app to handle
    document.dispatchEvent(new CustomEvent('optionSelected', {
        detail: {
            type: optionType,
            element: cardElement
        }
    }));
}

export function downloadFile(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===================================
// MUSIC THEORY UI FUNCTIONS
// ===================================

export function renderChordTheoryExplanation(explanation, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !explanation) return;

    container.innerHTML = `
        <div class="theory-content">
            <div class="theory-header">
                <h4>🎵 ${explanation.name} Theory</h4>
                <p class="key-info">Key: ${explanation.key}</p>
            </div>

            <div class="theory-section">
                <h5>Harmonic Function</h5>
                <div class="function-display">
                    <span class="function-sequence">${explanation.harmonicFunction.sequence}</span>
                    <p class="function-explanation">${explanation.harmonicFunction.explanation}</p>
                </div>
            </div>

            <div class="theory-section">
                <h5>Chord Analysis</h5>
                <div class="chord-analysis">
                    ${explanation.analysis.map(chord => `
                        <div class="chord-detail">
                            <div class="chord-name">${chord.chord} (${chord.numeral})</div>
                            <div class="chord-function">${chord.function}</div>
                            <div class="chord-explanation">${chord.explanation}</div>
                            ${chord.chordTones.length > 0 ?
                                `<div class="chord-tones">Notes: ${chord.chordTones.join(', ')}</div>` : ''
                            }
                        </div>
                    `).join('')}
                </div>
            </div>

            ${explanation.theoryNotes.length > 0 ? `
                <div class="theory-section">
                    <h5>Theory Notes</h5>
                    <ul class="theory-tips">
                        ${explanation.theoryNotes.map(note => `<li>${note}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            <div class="theory-section">
                <h5>Common Usage</h5>
                <p class="usage-info">${explanation.commonUse}</p>
            </div>
        </div>
    `;
}

export function renderScaleTheoryExplanation(explanation, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !explanation) return;

    container.innerHTML = `
        <div class="theory-content">
            <div class="theory-header">
                <h4>🎼 ${explanation.name} Scale</h4>
            </div>

            <div class="theory-section">
                <h5>Scale Notes</h5>
                <div class="scale-notes">
                    ${explanation.notes.map((note, index) => `
                        <span class="scale-note">
                            <span class="note-name">${note}</span>
                            <span class="degree-name">${explanation.degrees[index] || ''}</span>
                        </span>
                    `).join('')}
                </div>
            </div>

            <div class="theory-section">
                <h5>Character & Mood</h5>
                <p class="mood-character">${explanation.moodCharacter}</p>
            </div>

            ${explanation.commonChords.length > 0 ? `
                <div class="theory-section">
                    <h5>Common Chords in this Scale</h5>
                    <div class="scale-chords">
                        ${explanation.commonChords.map(chord => `
                            <span class="scale-chord">
                                <span class="chord-numeral">${chord.numeral}</span>
                                <span class="chord-name">${chord.chord}</span>
                            </span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="theory-section">
                <h5>Tips for Using This Scale</h5>
                <ul class="scale-tips">
                    ${explanation.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

export function renderRhythmTheoryExplanation(explanation, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !explanation) return;

    container.innerHTML = `
        <div class="theory-content">
            <div class="theory-header">
                <h4>🥁 ${explanation.name} Rhythm</h4>
                <div class="rhythm-info">
                    <span>Time: ${explanation.timeSignature}</span>
                    <span>Tempo: ${explanation.tempo}</span>
                </div>
            </div>

            <div class="theory-section">
                <h5>How This Rhythm Works</h5>
                <p class="rhythm-explanation">${explanation.explanation}</p>
            </div>

            ${explanation.techniques.length > 0 ? `
                <div class="theory-section">
                    <h5>Rhythmic Techniques</h5>
                    <ul class="rhythm-techniques">
                        ${explanation.techniques.map(technique => `<li>${technique}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            <div class="theory-section">
                <h5>Variations to Try</h5>
                <ul class="rhythm-variations">
                    ${explanation.variations.map(variation => `<li>${variation}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}

export function renderMelodyTheoryTips(melodyIdeas, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !melodyIdeas) return;

    container.innerHTML = `
        <div class="theory-content">
            <div class="theory-header">
                <h4>🎶 Melody Construction Tips</h4>
            </div>

            <div class="theory-section">
                <h5>About Your Melody Ideas</h5>
                <div class="melody-explanations">
                    ${melodyIdeas.map(idea => `
                        <div class="melody-idea-theory">
                            <h6>${idea.name}</h6>
                            <p>${idea.description}</p>
                            <span class="difficulty-badge difficulty-${idea.difficulty}">${idea.difficulty}</span>
                            <div class="melody-pattern">${idea.pattern.join(' - ')}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="theory-section">
                <h5>General Melody Tips</h5>
                <ul class="melody-tips">
                    <li><strong>Step vs. Leap:</strong> Mix stepwise motion (neighboring notes) with leaps for interest</li>
                    <li><strong>Chord Tones:</strong> Landing on chord tones (1st, 3rd, 5th) creates harmony</li>
                    <li><strong>Tension & Release:</strong> Use non-chord tones to create tension, resolve to chord tones</li>
                    <li><strong>Rhythm:</strong> Vary note lengths - don't make every note the same duration</li>
                    <li><strong>Range:</strong> Use your instrument's full range, but don't jump around randomly</li>
                    <li><strong>Repetition:</strong> Repeat melodic phrases with small variations for memorability</li>
                </ul>
            </div>
        </div>
    `;
}

// Global function for theory toggle buttons
window.toggleTheoryExplanation = function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';

        // Update button text
        const button = element.previousElementSibling;
        if (button && button.classList.contains('theory-toggle')) {
            const isVisible = element.style.display === 'block';
            button.textContent = isVisible ? '🎓 Hide Theory' : '🎓 Learn the Theory';
        }
    }
};

// Show scale theory modal
export function showScaleTheoryModal(explanation) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'theory-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(4px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.2s ease-out;
    `;

    // Create modal content with studio styling
    const modal = document.createElement('div');
    modal.className = 'theory-modal';
    modal.style.cssText = `
        background: var(--gradient-surface);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius-lg);
        max-width: 85vw;
        max-height: 85vh;
        overflow-y: auto;
        padding: var(--spacing-lg);
        position: relative;
        box-shadow: var(--box-shadow-lg), var(--glow-secondary);
        color: var(--text-primary);
        animation: slideInUp 0.3s ease-out;
    `;

    // Add close button with studio styling
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '⨯';
    closeButton.style.cssText = `
        position: absolute;
        top: var(--spacing-sm);
        right: var(--spacing-sm);
        background: var(--gradient-button);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        width: 28px;
        height: 28px;
        font-size: var(--font-size-large);
        cursor: pointer;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;
        font-family: var(--font-family-mono);
    `;
    closeButton.addEventListener('click', () => document.body.removeChild(overlay));

    // Create a container for the explanation
    const container = document.createElement('div');
    container.id = 'scale-theory-modal-content';

    modal.appendChild(closeButton);
    modal.appendChild(container);
    overlay.appendChild(modal);

    // Close modal when clicking overlay
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });

    // Add to document
    document.body.appendChild(overlay);

    // Render the explanation
    renderScaleTheoryExplanation(explanation, 'scale-theory-modal-content');
}

// ===================================
// AUDIO PLAYBACK FUNCTIONS
// ===================================

// Global functions for theory display
window.showKeyScaleTheory = function() {
    const appState = window.appState;
    if (!appState || !appState.songData.key || !appState.songData.scale) {
        showMessage('Please select both a key and scale first', 'warning');
        return;
    }

    if (window.MusicTheory && window.MusicTheory.explainScale) {
        const explanation = window.MusicTheory.explainScale(appState.songData.key, appState.songData.scale);
        if (explanation) {
            showScaleTheoryModal(explanation);
        }
    }
};

window.updateScaleTheoryButton = function() {
    const appState = window.appState;
    const theoryBtn = document.getElementById('scale-theory-btn');

    if (theoryBtn && appState && appState.songData.key && appState.songData.scale) {
        theoryBtn.style.display = 'block';
    } else if (theoryBtn) {
        theoryBtn.style.display = 'none';
    }
};

// Global audio control functions

window.playChordProgression = async function(progressionName) {
    const appState = window.appState;

    if (!appState || !appState.songData || !appState.songData.chordProgression) {
        showMessage('No chord progression selected. Please select a chord progression first.', 'warning');
        return;
    }

    const tempo = appState.songData.tempo || 120;
    const key = appState.songData.key || 'C';

    if (window.audioEngine) {
        try {
            await window.audioEngine.playChordProgression(appState.songData.chordProgression, tempo, key);
            showMessage('Playing chord progression...', 'info');
        } catch (error) {
            console.error('Error playing chord progression:', error);
            showMessage('Error playing audio. Please check your browser audio settings.', 'error');
        }
    } else {
        showMessage('Audio engine not available', 'error');
    }
};

window.playIndividualChord = async function(chordName) {
    console.log(`Playing chord: ${chordName}`);

    // Try the new guitar audio first (sounds much better)
    if (window.playGuitarChord) {
        try {
            await window.playGuitarChord(chordName, 2.0);
            showMessage(`Playing ${chordName} on guitar...`, 'info');
            return;
        } catch (error) {
            console.warn('Guitar audio failed, falling back to basic audio:', error);
        }
    }

    // Fallback to the old audio engine if guitar audio fails
    const appState = window.appState;
    const key = appState?.songData?.key || 'C';

    if (window.audioEngine) {
        try {
            await window.audioEngine.playChordProgressionImmediate([chordName], 2.0, key);
            showMessage(`Playing ${chordName}...`, 'info');
        } catch (error) {
            console.error('Error playing chord:', error);
            showMessage('Error playing audio. Please check your browser audio settings.', 'error');
        }
    } else {
        showMessage('Audio engine not available', 'error');
    }
};

window.playDrumPattern = function(patternName) {
    const appState = window.appState;
    if (!appState || !appState.songData.drumPattern) {
        console.warn('No drum pattern available to play');
        return;
    }

    const tempo = appState.songData.tempo || 120;

    console.log('Playing drum pattern:', patternName, 'at tempo:', tempo);

    if (window.audioEngine) {
        try {
            window.audioEngine.playDrumPattern(appState.songData.drumPattern, tempo, 2); // 2 bars
            showMessage('Playing drum pattern...', 'info');
        } catch (error) {
            console.error('Error playing drum pattern:', error);
            showMessage('Error playing audio. Please check your browser audio settings.', 'error');
        }
    } else {
        showMessage('Audio engine not available', 'error');
    }
};

window.playBassLine = function() {
    const appState = window.appState;
    if (!appState || !appState.songData.bassLine) {
        console.warn('No bass line available to play');
        return;
    }

    const tempo = appState.songData.tempo || 120;

    if (window.audioEngine) {
        try {
            window.audioEngine.playBassLine(appState.songData.bassLine, tempo);
            showMessage('Playing bass line...', 'info');
        } catch (error) {
            console.error('Error playing bass line:', error);
            showMessage('Error playing audio. Please check your browser audio settings.', 'error');
        }
    }
};

window.playMelodyIdea = function() {
    const appState = window.appState;
    if (!appState || !appState.songData.melodyIdea) {
        console.warn('No melody idea available to play');
        return;
    }

    const tempo = appState.songData.tempo || 120;

    if (window.audioEngine) {
        try {
            window.audioEngine.playMelodyIdea(appState.songData.melodyIdea, tempo);
            showMessage('Playing melody idea...', 'info');
        } catch (error) {
            console.error('Error playing melody:', error);
            showMessage('Error playing audio. Please check your browser audio settings.', 'error');
        }
    }
};

window.playFullArrangement = function() {
    const appState = window.appState;
    if (!appState || !appState.songData) {
        console.warn('No song data available to play');
        return;
    }

    if (window.audioEngine) {
        try {
            const duration = window.audioEngine.playFullArrangement(appState.songData, {
                bars: 4,
                tempo: appState.songData.tempo || 120
            });
            showMessage(`Playing full arrangement... (${Math.round(duration)}s)`, 'info');
        } catch (error) {
            console.error('Error playing full arrangement:', error);
            showMessage('Error playing audio. Please check your browser audio settings.', 'error');
        }
    }
};

window.stopAudio = function() {
    if (window.audioEngine) {
        try {
            window.audioEngine.stop();
            showMessage('Audio stopped', 'info');
        } catch (error) {
            console.error('Error stopping audio:', error);
        }
    }
};

export function enableButton(buttonId) {
    // Enable both bottom and top versions of the button
    const button = document.getElementById(buttonId);
    const topButton = document.getElementById(buttonId + '-top');

    if (button) {
        button.disabled = false;
    }
    if (topButton) {
        topButton.disabled = false;
    }
}

export function disableButton(buttonId) {
    // Disable both bottom and top versions of the button
    const button = document.getElementById(buttonId);
    const topButton = document.getElementById(buttonId + '-top');

    if (button) {
        button.disabled = true;
    }
    if (topButton) {
        topButton.disabled = true;
    }
}

export function showMessage(message, type = 'info') {
    // Create a simple toast message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    let backgroundColor = 'var(--primary-color)';
    let textColor = 'white';

    if (type === 'error') {
        backgroundColor = 'var(--error-color)';
        textColor = 'white';
    } else if (type === 'success') {
        backgroundColor = 'var(--success-color)';
        textColor = 'white';
    } else if (type === 'warning') {
        backgroundColor = 'var(--warning-color)';
        textColor = 'var(--background-color)'; // Use dark text on warning background
    }

    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        background: ${backgroundColor};
        color: ${textColor};
        border-radius: var(--border-radius);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
        box-shadow: var(--box-shadow-lg);
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// =====================================
// SONGCRAFT WORKSPACE FUNCTIONS
// =====================================

export function initializeSongcraftWorkspace(songData) {
    // Initialize template listeners
    setupTemplateListeners();

    // Initialize section management
    setupSectionManagement();

    // Initialize thematic words
    renderThematicWords(songData.mood?.themes || [], 'thematic-words');

    // Set up generate words button
    const generateWordsBtn = document.getElementById('generate-words');
    if (generateWordsBtn) {
        generateWordsBtn.addEventListener('click', () => {
            if (songData.mood?.themes) {
                const shuffledWords = [...songData.mood.themes].sort(() => Math.random() - 0.5).slice(0, 8);
                renderThematicWords(shuffledWords, 'thematic-words');
            }
        });
    }
}

function setupTemplateListeners() {
    const templateCards = document.querySelectorAll('.template-card');

    templateCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected class from all cards
            templateCards.forEach(c => c.classList.remove('selected'));

            // Add selected class to clicked card
            card.classList.add('selected');

            // Apply template structure
            const template = card.getAttribute('data-template');
            applyTemplate(template);
        });
    });
}

function setupSectionManagement() {
    const addSectionBtn = document.getElementById('add-section');
    const clearBtn = document.getElementById('clear-structure');

    if (addSectionBtn) {
        addSectionBtn.addEventListener('click', () => {
            addSongSection();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            clearAllSections();
        });
    }
}

function generateSectionChords(sectionType, baseChords, songData) {
    if (!baseChords || !songData?.key) return baseChords;

    const key = songData.key;
    const genre = songData.genre?.name || 'pop';

    // Common chord progressions by section type and key
    const chordVariations = {
        'Intro': {
            'C': ['C - Am - F - C', 'C - F - G - C', 'Am - F - C - G'],
            'G': ['G - Em - C - G', 'G - C - D - G', 'Em - C - G - D'],
            'D': ['D - Bm - G - D', 'D - G - A - D', 'Bm - G - D - A'],
            'A': ['A - F#m - D - A', 'A - D - E - A', 'F#m - D - A - E'],
            'E': ['E - C#m - A - E', 'E - A - B - E', 'C#m - A - E - B'],
            'F': ['F - Dm - Bb - F', 'F - Bb - C - F', 'Dm - Bb - F - C']
        },
        'Chorus': {
            'C': ['F - G - Am - F', 'Am - F - C - G', 'F - Am - G - C'],
            'G': ['C - D - Em - C', 'Em - C - G - D', 'C - Em - D - G'],
            'D': ['G - A - Bm - G', 'Bm - G - D - A', 'G - Bm - A - D'],
            'A': ['D - E - F#m - D', 'F#m - D - A - E', 'D - F#m - E - A'],
            'E': ['A - B - C#m - A', 'C#m - A - E - B', 'A - C#m - B - E'],
            'F': ['Bb - C - Dm - Bb', 'Dm - Bb - F - C', 'Bb - Dm - C - F']
        },
        'Bridge': {
            'C': ['Am - Em - F - G', 'Dm - G - Em - Am', 'F - Em - Dm - G'],
            'G': ['Em - Bm - C - D', 'Am - D - Bm - Em', 'C - Bm - Am - D'],
            'D': ['Bm - F#m - G - A', 'Em - A - F#m - Bm', 'G - F#m - Em - A'],
            'A': ['F#m - C#m - D - E', 'Bm - E - C#m - F#m', 'D - C#m - Bm - E'],
            'E': ['C#m - G#m - A - B', 'F#m - B - G#m - C#m', 'A - G#m - F#m - B'],
            'F': ['Dm - Am - Bb - C', 'Gm - C - Am - Dm', 'Bb - Am - Gm - C']
        },
        'Pre-Chorus': {
            'C': ['Am - F - G - G', 'Dm - G - C - C', 'F - G - Am - Am'],
            'G': ['Em - C - D - D', 'Am - D - G - G', 'C - D - Em - Em'],
            'D': ['Bm - G - A - A', 'Em - A - D - D', 'G - A - Bm - Bm'],
            'A': ['F#m - D - E - E', 'Bm - E - A - A', 'D - E - F#m - F#m'],
            'E': ['C#m - A - B - B', 'F#m - B - E - E', 'A - B - C#m - C#m'],
            'F': ['Dm - Bb - C - C', 'Gm - C - F - F', 'Bb - C - Dm - Dm']
        },
        'Outro': {
            'C': ['F - G - C - C', 'Am - F - G - C', 'F - C - G - C'],
            'G': ['C - D - G - G', 'Em - C - D - G', 'C - G - D - G'],
            'D': ['G - A - D - D', 'Bm - G - A - D', 'G - D - A - D'],
            'A': ['D - E - A - A', 'F#m - D - E - A', 'D - A - E - A'],
            'E': ['A - B - E - E', 'C#m - A - B - E', 'A - E - B - E'],
            'F': ['Bb - C - F - F', 'Dm - Bb - C - F', 'Bb - F - C - F']
        }
    };

    // Get variations for this section type and key
    const variations = chordVariations[sectionType]?.[key];
    if (!variations || variations.length === 0) {
        return baseChords; // Fallback to base progression
    }

    // Return a random variation
    return variations[Math.floor(Math.random() * variations.length)];
}

function applyTemplate(templateType) {
    const songData = window.appState?.songData;
    const baseChords = songData?.chordProgression?.chords?.join(' - ') || '';

    const templatesMap = {
        'verse-chorus': [
            { type: 'Verse', chords: baseChords, lyrics: '' },
            { type: 'Chorus', chords: generateSectionChords('Chorus', baseChords, songData), lyrics: '' },
            { type: 'Verse', chords: baseChords, lyrics: '' },
            { type: 'Chorus', chords: generateSectionChords('Chorus', baseChords, songData), lyrics: '' },
            { type: 'Bridge', chords: generateSectionChords('Bridge', baseChords, songData), lyrics: '' },
            { type: 'Chorus', chords: generateSectionChords('Chorus', baseChords, songData), lyrics: '' }
        ],
        'aaba': [
            { type: 'Verse', chords: baseChords, lyrics: '' },
            { type: 'Verse', chords: baseChords, lyrics: '' },
            { type: 'Bridge', chords: generateSectionChords('Bridge', baseChords, songData), lyrics: '' },
            { type: 'Verse', chords: baseChords, lyrics: '' }
        ],
        'pop': [
            { type: 'Intro', chords: generateSectionChords('Intro', baseChords, songData), lyrics: '' },
            { type: 'Verse', chords: baseChords, lyrics: '' },
            { type: 'Pre-Chorus', chords: generateSectionChords('Pre-Chorus', baseChords, songData), lyrics: '' },
            { type: 'Chorus', chords: generateSectionChords('Chorus', baseChords, songData), lyrics: '' },
            { type: 'Verse', chords: baseChords, lyrics: '' },
            { type: 'Pre-Chorus', chords: generateSectionChords('Pre-Chorus', baseChords, songData), lyrics: '' },
            { type: 'Chorus', chords: generateSectionChords('Chorus', baseChords, songData), lyrics: '' },
            { type: 'Bridge', chords: generateSectionChords('Bridge', baseChords, songData), lyrics: '' },
            { type: 'Chorus', chords: generateSectionChords('Chorus', baseChords, songData), lyrics: '' },
            { type: 'Outro', chords: generateSectionChords('Outro', baseChords, songData), lyrics: '' }
        ],
        'custom': []
    };

    const sectionsContainer = document.getElementById('song-sections');
    if (!sectionsContainer) return;

    // Clear existing sections
    sectionsContainer.innerHTML = '';

    // Add template sections
    const template = templatesMap[templateType] || [];
    template.forEach(section => {
        createSongSection(section.type, section.chords, section.lyrics);
    });
}

function addSongSection(type = 'Verse', chords = '', lyrics = '') {
    // Auto-populate with base chord progression if no chords provided
    if (!chords) {
        const songData = window.appState?.songData;
        const baseChords = songData?.chordProgression?.chords?.join(' - ') || '';

        if (type === 'Verse') {
            chords = baseChords;
        } else {
            chords = generateSectionChords(type, baseChords, songData);
        }
    }

    createSongSection(type, chords, lyrics);
}

function createSongSection(type, chords, lyrics) {
    const sectionsContainer = document.getElementById('song-sections');
    if (!sectionsContainer) return;

    const sectionId = `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'song-section';
    sectionDiv.id = sectionId;

    sectionDiv.innerHTML = `
        <div class="section-header">
            <div class="section-title">
                <select class="section-type" onchange="updateSectionType('${sectionId}', this.value)">
                    <option value="Intro" ${type === 'Intro' ? 'selected' : ''}>Intro</option>
                    <option value="Verse" ${type === 'Verse' ? 'selected' : ''}>Verse</option>
                    <option value="Pre-Chorus" ${type === 'Pre-Chorus' ? 'selected' : ''}>Pre-Chorus</option>
                    <option value="Chorus" ${type === 'Chorus' ? 'selected' : ''}>Chorus</option>
                    <option value="Bridge" ${type === 'Bridge' ? 'selected' : ''}>Bridge</option>
                    <option value="Outro" ${type === 'Outro' ? 'selected' : ''}>Outro</option>
                </select>
            </div>
            <div class="section-controls">
                <button class="refresh-chords-btn" onclick="refreshSectionChords('${sectionId}')" title="Get New Chord Suggestions">🔄</button>
                <button class="move-up-btn" onclick="moveSectionUp('${sectionId}')" title="Move Up">↑</button>
                <button class="move-down-btn" onclick="moveSectionDown('${sectionId}')" title="Move Down">↓</button>
                <button class="delete-section-btn" onclick="deleteSection('${sectionId}')" title="Delete">×</button>
            </div>
        </div>
        <div class="chord-input-container">
            <textarea class="chord-progression-input" placeholder="Enter chord progression (e.g., C - Am - F - G)" rows="2">${chords}</textarea>
            <div class="chord-suggestions" id="suggestions-${sectionId}"></div>
        </div>
        <textarea class="lyrics-input" placeholder="Write your lyrics here..." rows="4">${lyrics}</textarea>
    `;

    sectionsContainer.appendChild(sectionDiv);
}

function clearAllSections() {
    const sectionsContainer = document.getElementById('song-sections');
    if (sectionsContainer) {
        sectionsContainer.innerHTML = '';
    }
}

// Global functions for section management (called from HTML)
window.updateSectionType = function(sectionId, newType) {
    // Auto-update chord progression when section type changes
    refreshSectionChords(sectionId);
};

window.refreshSectionChords = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const sectionTypeSelect = section.querySelector('.section-type');
    const chordInput = section.querySelector('.chord-progression-input');
    const suggestionsDiv = section.querySelector('.chord-suggestions');

    if (!sectionTypeSelect || !chordInput) return;

    const sectionType = sectionTypeSelect.value;
    const songData = window.appState?.songData;
    const baseChords = songData?.chordProgression?.chords?.join(' - ') || '';

    // Generate multiple suggestions for this section type
    const suggestions = [];

    if (sectionType === 'Verse') {
        suggestions.push(baseChords);
    } else {
        // Generate 3 different variations
        for (let i = 0; i < 3; i++) {
            const variation = generateSectionChords(sectionType, baseChords, songData);
            if (variation && !suggestions.includes(variation)) {
                suggestions.push(variation);
            }
        }
    }

    // Update the input with the first suggestion
    if (suggestions.length > 0) {
        chordInput.value = suggestions[0];
    }

    // Display clickable suggestions
    if (suggestionsDiv) {
        suggestionsDiv.innerHTML = suggestions.map(suggestion =>
            `<span class="chord-suggestion" onclick="applySuggestion('${sectionId}', '${suggestion}')">${suggestion}</span>`
        ).join('');
    }
};

window.moveSectionUp = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section && section.previousElementSibling) {
        section.parentNode.insertBefore(section, section.previousElementSibling);
    }
};

window.moveSectionDown = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section && section.nextElementSibling) {
        section.parentNode.insertBefore(section.nextElementSibling, section);
    }
};

window.deleteSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.remove();
    }
};

window.applySuggestion = function(sectionId, chordProgression) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const chordInput = section.querySelector('.chord-progression-input');
    if (chordInput) {
        chordInput.value = chordProgression;
    }
};

// Individual Chord Enhancement Functions

window.showChordOptions = function(chordIndex, enhancementType) {
    const currentProgression = window.appState?.songData?.chordProgression || window.appState?.selectedChordProgression;
    if (!currentProgression || !currentProgression.chords) {
        showMessage('No chord progression selected', 'warning');
        return;
    }

    const chord = currentProgression.chords[chordIndex];
    const numeral = currentProgression.numerals[chordIndex];
    const panel = document.getElementById('chord-options-panel');
    const panelTitle = document.getElementById('panel-title');
    const panelContent = document.getElementById('panel-content');

    if (!panel || !panelTitle || !panelContent) return;

    // Set panel title
    const typeNames = {
        'inversions': '🔄 Inversions',
        'extensions': '➕ Extensions',
        'substitutions': '🔀 Substitutions',
        'voicings': '🎹 Voicings'
    };

    panelTitle.textContent = `${typeNames[enhancementType]} for ${chord} (${numeral})`;

    // Generate options based on type
    let options = [];
    let description = '';

    switch (enhancementType) {
        case 'inversions':
            options = generateSingleChordInversions(chord);
            description = 'Smooth bass movement by changing which note is in the bass:';
            break;
        case 'extensions':
            options = generateSingleChordExtensions(chord);
            description = 'Add color and sophistication:';
            break;
        case 'substitutions':
            options = generateSingleChordSubstitutions(chord, numeral);
            description = 'Alternative chords with similar function:';
            break;
        case 'voicings':
            options = generateSingleChordVoicings(chord);
            description = 'Different arrangements and textures:';
            break;
    }

    panelContent.innerHTML = `
        <p class="panel-description">${description}</p>
        <div class="chord-options-list">
            ${options.map(option => `
                <div class="chord-option" data-chord-index="${chordIndex}">
                    <div class="option-info">
                        <div class="option-chord">${option.chord}</div>
                        <div class="option-name">${option.name}</div>
                        <div class="option-description">${option.description}</div>
                    </div>
                    <button class="apply-option-btn" onclick="applyChordOption(${chordIndex}, '${option.chord}')">
                        Apply
                    </button>
                </div>
            `).join('')}
        </div>
    `;

    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

window.applyChordOption = function(chordIndex, newChord) {
    console.log('applyChordOption called:', { chordIndex, newChord });

    const currentProgression = window.appState?.songData?.chordProgression || window.appState?.selectedChordProgression;
    if (!currentProgression || !currentProgression.chords) {
        console.error('No current progression found in applyChordOption');
        return;
    }

    console.log('Before update:', currentProgression.chords);

    // Update the specific chord
    currentProgression.chords[chordIndex] = newChord;

    // Update both possible locations in app state
    if (window.appState.songData?.chordProgression) {
        window.appState.songData.chordProgression.chords[chordIndex] = newChord;
    }
    if (window.appState.selectedChordProgression) {
        window.appState.selectedChordProgression.chords[chordIndex] = newChord;
    }

    // Update the display
    updateProgressionDisplay(currentProgression.chords);

    // Update the individual chord display
    const chordElement = document.querySelector(`[data-chord-index="${chordIndex}"] .chord-name`);
    if (chordElement) {
        chordElement.textContent = newChord;
    }

    // Update the onclick handler for the chord header to use the new chord name
    const chordHeader = document.querySelector(`[data-chord-index="${chordIndex}"] .chord-header`);
    if (chordHeader) {
        // Remove the old onclick attribute
        chordHeader.removeAttribute('onclick');

        // Add a new event listener instead of using onclick attribute
        // First, remove any existing listeners by cloning the element
        const newChordHeader = chordHeader.cloneNode(true);
        chordHeader.parentNode.replaceChild(newChordHeader, chordHeader);

        // Add the new event listener with the updated chord name
        newChordHeader.addEventListener('click', () => {
            console.log(`Chord header clicked: ${newChord}`);
            window.playIndividualChord(newChord);
        });

        newChordHeader.setAttribute('title', `Click to play ${newChord}`);
        console.log(`Updated click handler for chord ${chordIndex} to play: ${newChord}`);
    }

    // Regenerate chord diagrams for the updated progression
    console.log('About to call updateChordDiagrams with:', {
        currentProgression: currentProgression,
        hasChords: currentProgression?.chords,
        chordCount: currentProgression?.chords?.length
    });
    updateChordDiagrams(currentProgression);

    // Log for debugging
    console.log('Updated chord diagrams after applying enhancement:', {
        chordIndex,
        newChord,
        fullProgression: currentProgression.chords
    });

    closeChordOptionsPanel();
    showMessage(`Chord ${chordIndex + 1} updated to ${newChord}`, 'success');
};

window.closeChordOptionsPanel = function() {
    const panel = document.getElementById('chord-options-panel');
    if (panel) {
        panel.style.display = 'none';
    }
};

window.resetProgression = function() {
    if (!window.originalProgression) return;

    const currentProgression = window.appState?.songData?.chordProgression || window.appState?.selectedChordProgression;
    if (!currentProgression) return;

    // Reset to original chords
    currentProgression.chords = [...window.originalProgression.chords];

    // Update both possible locations in app state
    if (window.appState.songData?.chordProgression) {
        window.appState.songData.chordProgression.chords = [...window.originalProgression.chords];
    }
    if (window.appState.selectedChordProgression) {
        window.appState.selectedChordProgression.chords = [...window.originalProgression.chords];
    }

    // Update displays
    updateProgressionDisplay(window.originalProgression.chords);

    // Update individual chord displays
    window.originalProgression.chords.forEach((chord, index) => {
        const chordElement = document.querySelector(`[data-chord-index="${index}"] .chord-name`);
        if (chordElement) {
            chordElement.textContent = chord;
        }
    });

    // Regenerate chord diagrams for the original progression
    const originalProgression = {
        name: window.originalProgression.name,
        chords: window.originalProgression.chords,
        numerals: window.originalProgression.numerals
    };
    updateChordDiagrams(originalProgression);

    closeChordOptionsPanel();
    showMessage('Progression reset to original', 'success');
};

function updateProgressionDisplay(chords) {
    const currentChordsElement = document.getElementById('current-chords');
    if (currentChordsElement) {
        currentChordsElement.textContent = chords.join(' - ');
    }
}

function updateChordDiagrams(chordProgression) {
    if (!chordProgression || !chordProgression.chords) {
        console.warn('No chord progression or chords provided to updateChordDiagrams');
        return;
    }

    console.log('Updating chord diagrams for:', chordProgression.chords);
    console.log('generateChordDiagrams available:', !!window.generateChordDiagrams);

    // Instead of trying to selectively update the diagrams, let's regenerate the entire chord display
    // This ensures consistency with how displayChords() works
    console.log('Regenerating entire chord display with updated progression');
    displayChords(chordProgression);
}

// Helper functions for individual chord variations

function generateSingleChordInversions(chord) {
    const inversions = [];

    // Parse the chord to get the root and remove any existing bass notes
    const baseChord = chord.replace(/\/.*$/, ''); // Remove existing /bass notation
    const rootNote = baseChord.match(/^([A-G][#b]?)/)?.[1];
    if (!rootNote) return inversions;

    // Original position (for context)
    inversions.push({
        chord: baseChord,
        name: 'Root Position',
        description: 'Original chord with root in bass'
    });

    // Get third and fifth notes
    const thirdNote = getChordThird(rootNote, baseChord.includes('m') && !baseChord.includes('maj'));
    const fifthNote = getChordFifth(rootNote);

    // First inversion
    if (thirdNote) {
        inversions.push({
            chord: `${baseChord}/${thirdNote}`,
            name: 'First Inversion',
            description: `${thirdNote} in bass - smooth voice leading`
        });
    }

    // Second inversion
    if (fifthNote) {
        inversions.push({
            chord: `${baseChord}/${fifthNote}`,
            name: 'Second Inversion',
            description: `${fifthNote} in bass - strong, stable sound`
        });
    }

    return inversions;
}

// Helper function to get the third of a chord
function getChordThird(rootNote, isMinor) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const rootIndex = notes.indexOf(rootNote);
    if (rootIndex === -1) return null;

    const thirdInterval = isMinor ? 3 : 4; // Minor 3rd = 3 semitones, Major 3rd = 4 semitones
    const thirdIndex = (rootIndex + thirdInterval) % 12;
    return notes[thirdIndex];
}

// Helper function to get the fifth of a chord
function getChordFifth(rootNote) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const rootIndex = notes.indexOf(rootNote);
    if (rootIndex === -1) return null;

    const fifthIndex = (rootIndex + 7) % 12; // Perfect 5th = 7 semitones
    return notes[fifthIndex];
}

function generateSingleChordExtensions(chord) {
    const extensions = [];
    const baseChord = chord.replace(/\/.*$/, ''); // Remove any existing bass notes
    const root = baseChord.match(/^([A-G][#b]?)/)?.[1];

    if (!root) return extensions;

    // 7th extensions using proper Tonal.js notation
    if (baseChord.includes('m') && !baseChord.includes('maj')) {
        // Minor chord extensions
        extensions.push({
            chord: `${baseChord}7`,
            name: 'Minor 7th',
            description: 'Adds smooth, jazzy quality'
        });
        extensions.push({
            chord: `${baseChord}9`,
            name: 'Minor 9th',
            description: 'Rich, sophisticated color'
        });
        extensions.push({
            chord: `${baseChord}11`,
            name: 'Minor 11th',
            description: 'Complex, modern harmony'
        });
        extensions.push({
            chord: `${baseChord}6`,
            name: 'Minor 6th',
            description: 'Sophisticated minor color'
        });
    } else {
        // Major chord extensions
        extensions.push({
            chord: `${root}7`,
            name: 'Dominant 7th',
            description: 'Blues, jazz standard'
        });
        extensions.push({
            chord: `${root}maj7`,
            name: 'Major 7th',
            description: 'Dreamy, lush sound'
        });
        extensions.push({
            chord: `${root}9`,
            name: 'Dominant 9th',
            description: 'Funky, soulful'
        });
        extensions.push({
            chord: `${root}maj9`,
            name: 'Major 9th',
            description: 'Open, spacious feel'
        });
        extensions.push({
            chord: `${root}add9`,
            name: 'Add 9th',
            description: 'Bright, modern sound'
        });
        extensions.push({
            chord: `${root}6`,
            name: 'Major 6th',
            description: 'Vintage, nostalgic quality'
        });
        extensions.push({
            chord: `${root}maj13`,
            name: 'Major 13th',
            description: 'Very lush, sophisticated'
        });
    }

    // Sus chords (work with any root)
    extensions.push({
        chord: `${root}sus2`,
        name: 'Sus2',
        description: 'Floaty, unresolved feeling'
    });
    extensions.push({
        chord: `${root}sus4`,
        name: 'Sus4',
        description: 'Tension that wants to resolve'
    });
    extensions.push({
        chord: `${root}7sus4`,
        name: '7sus4',
        description: 'Suspended dominant - wants resolution'
    });

    // Altered chords
    extensions.push({
        chord: `${root}aug`,
        name: 'Augmented',
        description: 'Mysterious, unstable sound'
    });
    extensions.push({
        chord: `${root}o`,
        name: 'Diminished',
        description: 'Dark, tense atmosphere'
    });
    extensions.push({
        chord: `${root}o7`,
        name: 'Diminished 7th',
        description: 'Very tense, transitional'
    });

    return extensions;
}

function generateSingleChordSubstitutions(chord, numeral) {
    const substitutions = [];
    const baseChord = chord.replace(/\/.*$/, ''); // Remove bass notes

    // Relative major/minor
    if (baseChord.includes('m') && !baseChord.includes('maj')) {
        const relativeMajor = baseChord.replace(/m/, '');
        substitutions.push({
            chord: relativeMajor,
            name: 'Relative Major',
            description: 'Brighter, more uplifting version'
        });
    } else {
        const relativeMinor = baseChord + 'm';
        substitutions.push({
            chord: relativeMinor,
            name: 'Relative Minor',
            description: 'Darker, more emotional version'
        });
    }

    // Function-based substitutions
    switch (numeral) {
        case 'I':
            substitutions.push({
                chord: baseChord.replace(/[A-G]/, match => getRelativeMinor(match)),
                name: 'vi substitute',
                description: 'Classic relative minor substitution'
            });
            break;
        case 'V':
            const root = baseChord.charAt(0);
            substitutions.push({
                chord: `${getTritoneSubstitute(root)}7`,
                name: 'Tritone Sub',
                description: 'Jazz substitution with chromatic bass movement'
            });
            break;
        case 'IV':
            substitutions.push({
                chord: baseChord.replace(/[A-G]/, match => match + 'm'),
                name: 'Minor iv',
                description: 'Modal interchange - adds melancholy'
            });
            break;
    }

    // Diminished passing chords
    if (numeral === 'V') {
        const root = baseChord.charAt(0);
        substitutions.push({
            chord: `${root}o7`,
            name: 'Diminished 7th',
            description: 'Creates strong pull to next chord'
        });
    }

    return substitutions;
}

function generateSingleChordVoicings(chord) {
    const voicings = [];
    const baseChord = chord.replace(/\/.*$/, '');
    const root = baseChord.match(/^([A-G][#b]?)/)?.[1];

    if (!root) return voicings;

    // Use alternative chord voicings that Tonal.js can understand
    voicings.push({
        chord: baseChord,
        name: 'Root Position',
        description: 'Standard chord arrangement'
    });

    // If it's a major chord, offer different inversions and related chords
    if (!baseChord.includes('m')) {
        // Use actual chord variations instead of voicing descriptions
        voicings.push({
            chord: `${root}6/9`,
            name: '6/9 Voicing',
            description: 'Jazz voicing - rich and colorful'
        });

        if (baseChord.includes('maj7') || baseChord.includes('7')) {
            voicings.push({
                chord: `${root}maj7#11`,
                name: 'Lydian Voicing',
                description: 'Bright, sophisticated color'
            });
        } else {
            voicings.push({
                chord: `${root}maj7`,
                name: 'Major 7th Voicing',
                description: 'Smooth, jazzy alternative'
            });
        }

        voicings.push({
            chord: `${root}add2`,
            name: 'Add2 Voicing',
            description: 'Open, contemporary sound'
        });
    } else {
        // Minor chord voicings
        voicings.push({
            chord: `${baseChord}add9`,
            name: 'Minor Add9',
            description: 'Rich minor color'
        });

        voicings.push({
            chord: `${baseChord}maj7`,
            name: 'Minor/Major 7',
            description: 'Dreamy, ethereal quality'
        });

        voicings.push({
            chord: `${baseChord}6`,
            name: 'Minor 6th',
            description: 'Sophisticated minor voicing'
        });
    }

    // Power chord (for any chord type)
    voicings.push({
        chord: `${root}5`,
        name: 'Power Chord',
        description: 'Strong, guitar-friendly voicing'
    });

    return voicings;
}

function getTritoneSubstitute(note) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const index = notes.indexOf(note);
    if (index === -1) return note;

    const tritoneIndex = (index + 6) % 12;
    return notes[tritoneIndex];
}

function getRelativeMinor(majorNote) {
    const majorToMinor = {
        'C': 'Am', 'C#': 'A#m', 'D': 'Bm', 'D#': 'Cm', 'E': 'C#m', 'F': 'Dm',
        'F#': 'D#m', 'G': 'Em', 'G#': 'Fm', 'A': 'F#m', 'A#': 'Gm', 'B': 'G#m'
    };
    return majorToMinor[majorNote] || majorNote + 'm';
}