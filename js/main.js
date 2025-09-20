// main.js - Application orchestrator and state management

import * as MusicTheory from './music-theory.js';
import * as UI from './ui.js';
import audioEngine from './audio-engine.js';

// Application state
const appState = {
    currentStep: 'step-mood',
    songData: {
        mood: null,
        genre: null,
        key: null,
        scale: null,
        tempo: null,
        chordProgression: null,
        drumPattern: null,
        bassLine: null,
        bassComplexity: 'simple',
        melodyIdea: null,
        songStructure: [],
        songSections: [],
        lyrics: '',
        title: 'My Song',
        lastSaved: null,
        id: null
    },
    loadedData: {
        moods: [],
        genres: [],
        chordProgressions: {},
        drumPatterns: {}
    }
};

// Make appState and MusicTheory globally available for theory explanations
window.appState = appState;
window.MusicTheory = MusicTheory;

// Global function for playing chord voicings
window.playVoicing = function(midiNotesStr) {
    try {
        const midiNotes = JSON.parse(midiNotesStr);
        if (window.audioEngine && window.audioEngine.playChord) {
            // Play the chord voicing using the audio engine
            window.audioEngine.playChord(midiNotes);
        } else {
            console.warn('Audio engine not available for voicing playback');
        }
    } catch (error) {
        console.error('Error playing voicing:', error);
    }
};

// Global function for generating smart melodies
window.generateSmartMelody = function(style) {
    try {
        const currentChordProgression = window.appState?.currentProgression;
        const currentKey = window.appState?.currentKey;

        if (!currentChordProgression || !currentKey || !window.MusicTheory?.generateSmartMelody) {
            console.warn('Smart melody generation not available');
            return;
        }

        // Configure generation options based on style
        const options = {
            style: style,
            preferChordTones: style !== 'pentatonic',
            avoidLargeLeaps: style === 'smooth',
            octave: 5
        };

        const melodyResult = window.MusicTheory.generateSmartMelody(currentChordProgression, currentKey, options);

        if (melodyResult) {
            displayGeneratedMelody(melodyResult, style);
        } else {
            console.error('Failed to generate melody');
        }
    } catch (error) {
        console.error('Error generating smart melody:', error);
    }
};

function displayGeneratedMelody(melodyResult, style) {
    const generatedMelodyDiv = document.getElementById('generated-melody');
    if (!generatedMelodyDiv) return;

    const melodyNotes = melodyResult.melody.map(note => `${note.note}${note.octave}`);

    generatedMelodyDiv.innerHTML = `
        <div class="generated-melody-content">
            <h7>Generated ${style.charAt(0).toUpperCase() + style.slice(1)} Melody</h7>
            <div class="melody-sequence">
                ${melodyResult.melody.map((note, i) => `
                    <span class="melody-note ${note.isChordTone ? 'chord-tone' : 'scale-tone'}">
                        ${note.note}${note.octave}
                        <small>${note.chord}</small>
                    </span>
                `).join('')}
            </div>
            <div class="melody-analysis">
                ${melodyResult.analysis.map(tip => `<div class="analysis-tip">${tip}</div>`).join('')}
            </div>
            <div class="melody-controls">
                <button class="play-btn" onclick="playGeneratedMelody('${JSON.stringify(melodyResult.melody.map(n => n.midiNote)).replace(/"/g, '&quot;')}')">
                    🎵 Play Generated Melody
                </button>
                <button class="regenerate-btn" onclick="generateSmartMelody('${style}')">
                    🔄 Generate New Variation
                </button>
            </div>
        </div>
    `;

    generatedMelodyDiv.style.display = 'block';
}

window.playGeneratedMelody = function(midiNotesStr) {
    try {
        const midiNotes = JSON.parse(midiNotesStr);
        if (window.audioEngine && window.audioEngine.playMelody) {
            window.audioEngine.playMelody(midiNotes);
        } else {
            console.warn('Audio engine melody playback not available');
        }
    } catch (error) {
        console.error('Error playing generated melody:', error);
    }
};

// Initialize the application
async function initializeApp() {
    try {
        // Load all data
        appState.loadedData.moods = await MusicTheory.getMoodsData();
        appState.loadedData.genres = await MusicTheory.getGenresData();
        appState.loadedData.chordProgressions = await MusicTheory.getChordProgressionsData();
        appState.loadedData.drumPatterns = await MusicTheory.getDrumPatternsData();
        
        // Render initial step
        await loadMoodStep();
        
        // Set up event listeners
        setupEventListeners();
        
        console.log('Music Machine initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Music Machine:', error);
        UI.showMessage('Failed to load application data', 'error');
    }
}

// Load mood selection step
async function loadMoodStep() {
    UI.renderMoods(appState.loadedData.moods, 'mood-options');
    UI.renderGenres(appState.loadedData.genres, 'genre-options');
    UI.showStep('step-mood');
}

// Load key & tempo step
async function loadKeyTempoStep() {
    if (!appState.songData.mood || !appState.songData.genre) {
        UI.showMessage('Please select both mood and genre first', 'error');
        return;
    }
    
    // Get suggested keys
    const suggestedKeys = MusicTheory.getSuggestedKeysForMoodAndGenre(
        appState.songData.mood,
        appState.songData.genre
    );
    
    // Get suggested tempo range
    const tempoRange = MusicTheory.getSuggestedTempo(
        appState.songData.mood,
        appState.songData.genre
    );
    
    // Get suggested scales based on mood and genre
    const suggestedScales = MusicTheory.getSuggestedScalesForMoodAndGenre(
        appState.songData.mood,
        appState.songData.genre
    );
    
    // Render keys
    UI.renderKeys(suggestedKeys, 'key-options');
    
    // Render scales with enhanced options
    UI.renderScales(suggestedScales, 'scale-options');
    
    // Render tempos
    UI.renderTempos(tempoRange, 'tempo-options');
    
    UI.showStep('step-key-tempo');
}

// Load chord progression step
async function loadChordsStep() {
    if (!appState.songData.key || !appState.songData.scale || !appState.songData.genre) {
        UI.showMessage('Please select key, scale, and genre first', 'error');
        return;
    }
    
    const chordProgressions = MusicTheory.getChordProgressionsForKeyAndGenre(
        appState.songData.key,
        appState.songData.scale,
        appState.songData.genre,
        appState.loadedData.chordProgressions
    );
    
    UI.renderChordProgressions(chordProgressions, 'chord-progressions');
    UI.showStep('step-chords');
}

// Load drum pattern step
async function loadDrumsStep() {
    if (!appState.songData.genre) {
        UI.showMessage('Please select a genre first', 'error');
        return;
    }
    
    const drumPatterns = MusicTheory.getDrumPatternsForGenre(
        appState.songData.genre,
        appState.loadedData.drumPatterns
    );
    
    UI.renderDrumPatterns(drumPatterns, 'drum-patterns');
    UI.showStep('step-drums');
}

// Load bass line step
async function loadBassStep() {
    if (!appState.songData.chordProgression) {
        UI.showMessage('Please select a chord progression first', 'error');
        return;
    }
    
    UI.renderBassOptions([], 'bass-options');
    UI.showStep('step-bass');
}

// Load melody step
async function loadMelodyStep() {
    if (!appState.songData.key || !appState.songData.chordProgression) {
        UI.showMessage('Please select key and chord progression first', 'error');
        return;
    }
    
    const melodyIdeas = MusicTheory.generateMelodyIdeas(
        appState.songData.key,
        appState.songData.chordProgression,
        appState.songData.scale
    );
    
    UI.renderMelodyIdeas(melodyIdeas, 'melody-suggestions');
    UI.showStep('step-melody');
}

// Load songcraft step
async function loadSongcraftStep() {
    if (!appState.songData.chordProgression) {
        UI.showMessage('Please select a chord progression first', 'error');
        return;
    }

    // Initialize songcraft workspace
    UI.initializeSongcraftWorkspace(appState.songData);
    UI.showStep('step-songcraft');

    // Enable the next button since songcraft is optional
    UI.enableButton('songcraft-next');
}

// Load export step
async function loadExportStep() {
    // Collect song sections data from songcraft workspace
    const songSections = document.querySelectorAll('.song-section');
    appState.songData.songSections = Array.from(songSections).map(section => {
        const sectionTypeSelect = section.querySelector('.section-type');
        const chordInput = section.querySelector('.chord-progression-input');
        const lyricsInput = section.querySelector('.lyrics-input');

        return {
            type: sectionTypeSelect?.value || 'Verse',
            chords: chordInput?.value || '',
            lyrics: lyricsInput?.value || ''
        };
    });

    UI.renderSongSummary(appState.songData, 'song-summary');
    UI.showStep('step-export');
}

// Set up all event listeners
function setupEventListeners() {
    // Navigation button listeners
    setupNavigationListeners();
    
    // Progress bar click listeners
    setupProgressBarListeners();
    
    // Option selection listener
    document.addEventListener('optionSelected', handleOptionSelection);
    
    // Generate thematic words button
    const generateWordsBtn = document.getElementById('generate-words');
    if (generateWordsBtn) {
        generateWordsBtn.addEventListener('click', generateMoreThematicWords);
    }
    
    // Export buttons
    const exportTextBtn = document.getElementById('export-text');
    const exportJsonBtn = document.getElementById('export-json');
    const exportMidiBtn = document.getElementById('export-midi');
    const exportAbletonBtn = document.getElementById('export-ableton');
    const generateMidiBtn = document.getElementById('generate-midi');
    const startOverBtn = document.getElementById('start-over');
    
    if (exportTextBtn) {
        exportTextBtn.addEventListener('click', exportAsText);
    }
    
    if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', exportAsJSON);
    }
    
    if (exportMidiBtn) {
        exportMidiBtn.addEventListener('click', showMidiExportOptions);
    }
    
    if (exportAbletonBtn) {
        exportAbletonBtn.addEventListener('click', exportAbletonTemplate);
    }
    
    if (generateMidiBtn) {
        generateMidiBtn.addEventListener('click', generateMIDIFiles);
    }
    
    if (startOverBtn) {
        startOverBtn.addEventListener('click', startOver);
    }
}

function setupNavigationListeners() {
    // Next buttons (both top and bottom)
    const nextButtons = {
        'mood-next': () => loadKeyTempoStep(),
        'mood-next-top': () => loadKeyTempoStep(),
        'key-tempo-next': () => loadChordsStep(),
        'key-tempo-next-top': () => loadChordsStep(),
        'chords-next': () => loadDrumsStep(),
        'chords-next-top': () => loadDrumsStep(),
        'drums-next': () => loadBassStep(),
        'drums-next-top': () => loadBassStep(),
        'bass-next': () => loadMelodyStep(),
        'bass-next-top': () => loadMelodyStep(),
        'melody-next': () => loadSongcraftStep(),
        'melody-next-top': () => loadSongcraftStep(),
        'songcraft-next': () => loadExportStep(),
        'songcraft-next-top': () => loadExportStep()
    };
    
    Object.entries(nextButtons).forEach(([buttonId, handler]) => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', handler);
        }
    });
    
    // Back buttons (both top and bottom)
    const backButtons = {
        'key-tempo-back': () => loadMoodStep(),
        'key-tempo-back-top': () => loadMoodStep(),
        'chords-back': () => loadKeyTempoStep(),
        'chords-back-top': () => loadKeyTempoStep(),
        'drums-back': () => loadChordsStep(),
        'drums-back-top': () => loadChordsStep(),
        'bass-back': () => loadDrumsStep(),
        'bass-back-top': () => loadDrumsStep(),
        'melody-back': () => loadBassStep(),
        'melody-back-top': () => loadBassStep(),
        'songcraft-back': () => loadMelodyStep(),
        'songcraft-back-top': () => loadMelodyStep(),
        'export-back': () => loadSongcraftStep()
    };
    
    Object.entries(backButtons).forEach(([buttonId, handler]) => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', handler);
        }
    });
}

function setupProgressBarListeners() {
    // Add click listeners to progress bar steps
    const stepMapping = {
        1: () => loadMoodStep(),
        2: () => loadKeyTempoStep(),
        3: () => loadChordsStep(),
        4: () => loadDrumsStep(),
        5: () => loadBassStep(),
        6: () => loadMelodyStep(),
        7: () => loadSongcraftStep(),
        8: () => loadExportStep()
    };
    
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.addEventListener('click', () => {
            // Only allow navigation to completed steps or current step
            if (step.classList.contains('completed') || step.classList.contains('active')) {
                const handler = stepMapping[stepNumber];
                if (handler) {
                    handler();
                }
            } else {
                UI.showMessage('Please complete the current step first', 'warning');
            }
        });
    });
}

// Handle option selections
function handleOptionSelection(event) {
    const { type, element } = event.detail;
    
    switch (type) {
        case 'mood':
            const moodId = element.dataset.moodId;
            appState.songData.mood = appState.loadedData.moods.find(m => m.id === moodId);
            checkMoodGenreComplete();
            break;
            
        case 'genre':
            const genreId = element.dataset.genreId;
            appState.songData.genre = appState.loadedData.genres.find(g => g.id === genreId);
            checkMoodGenreComplete();
            break;
            
        case 'key':
            appState.songData.key = element.dataset.key;
            checkKeyTempoComplete();
            if (window.updateScaleTheoryButton) window.updateScaleTheoryButton();
            break;

        case 'scale':
            appState.songData.scale = element.dataset.scale;
            checkKeyTempoComplete();
            if (window.updateScaleTheoryButton) window.updateScaleTheoryButton();
            break;
            
        case 'tempo':
            appState.songData.tempo = parseInt(element.dataset.tempo);
            checkKeyTempoComplete();
            break;
            
        case 'chord-progression':
            const progressionId = element.dataset.progressionId;
            const progressions = MusicTheory.getChordProgressionsForKeyAndGenre(
                appState.songData.key,
                appState.songData.scale,
                appState.songData.genre,
                appState.loadedData.chordProgressions
            );
            appState.songData.chordProgression = progressions.find(p => p.id === progressionId);
            UI.enableButton('chords-next');
            break;
            
        case 'drum-pattern':
            const patternId = element.dataset.patternId;
            const patterns = MusicTheory.getDrumPatternsForGenre(
                appState.songData.genre,
                appState.loadedData.drumPatterns
            );
            appState.songData.drumPattern = patterns.find(p => p.id === patternId);
            UI.enableButton('drums-next');
            break;
            
        case 'bass-pattern':
            appState.songData.bassPattern = element.dataset.patternId;
            generateAndDisplayBassLine();
            UI.enableButton('bass-next');
            break;
            
        case 'melody-idea':
            const melodyIndex = parseInt(element.dataset.melodyIndex);
            const melodyIdeas = MusicTheory.generateMelodyIdeas(
                appState.songData.key,
                appState.songData.chordProgression,
                appState.songData.scale
            );
            appState.songData.melodyIdea = melodyIdeas[melodyIndex];
            UI.enableButton('melody-next');
            break;
            
        case 'song-structure':
            const structureIndex = parseInt(element.dataset.structureIndex);
            const structures = MusicTheory.getSongStructureForGenre(appState.songData.genre);
            appState.songData.songStructure = structures[structureIndex].sections;
            UI.enableButton('structure-next');
            break;
    }
}

function checkMoodGenreComplete() {
    if (appState.songData.mood && appState.songData.genre) {
        UI.enableButton('mood-next');
    }
}

function checkKeyTempoComplete() {
    if (appState.songData.key && appState.songData.scale && appState.songData.tempo) {
        UI.enableButton('key-tempo-next');
    }
}

function generateAndDisplayBassLine() {
    if (appState.songData.chordProgression) {
        appState.songData.bassLine = MusicTheory.generateBassLine(
            appState.songData.chordProgression,
            appState.songData.bassPattern || 'simple'
        );
        UI.displayBassLine(appState.songData.bassLine);
    }
}

function generateMoreThematicWords() {
    if (!appState.songData.mood) return;
    
    // Shuffle and show different words from the mood themes
    const allWords = [...appState.songData.mood.themes];
    const shuffledWords = allWords.sort(() => Math.random() - 0.5);
    UI.renderThematicWords(shuffledWords, 'thematic-words');
}

function exportAsText() {
    const textContent = MusicTheory.exportAsText(appState.songData);
    const filename = `${appState.songData.title.replace(/[^a-zA-Z0-9]/g, '_')}_song_plan.txt`;
    UI.downloadFile(textContent, filename, 'text/plain');
    UI.showMessage('Song plan exported as text file', 'success');
}

function exportAsJSON() {
    const jsonData = MusicTheory.exportSongData(appState.songData);
    const jsonContent = JSON.stringify(jsonData, null, 2);
    const filename = `${appState.songData.title.replace(/[^a-zA-Z0-9]/g, '_')}_song_data.json`;
    UI.downloadFile(jsonContent, filename, 'application/json');
    UI.showMessage('Song data exported as JSON file', 'success');
}

function startOver() {
    // Reset app state
    appState.currentStep = 'step-mood';
    appState.songData = {
        mood: null,
        genre: null,
        key: null,
        scale: null,
        tempo: null,
        chordProgression: null,
        drumPattern: null,
        bassLine: null,
        bassComplexity: 'simple',
        melodyIdea: null,
        songStructure: null,
        arrangementTips: null,
        lyrics: '',
        title: 'My Song'
    };
    
    // Clear lyrics textarea
    const lyricsTextarea = document.getElementById('lyrics-text');
    if (lyricsTextarea) {
        lyricsTextarea.value = '';
    }
    
    // Go back to first step
    loadMoodStep();
    UI.showMessage('Starting new song creation', 'info');
}

// Show MIDI export options panel
function showMidiExportOptions() {
    const midiPanel = document.getElementById('midi-export-options');
    if (midiPanel) {
        midiPanel.style.display = midiPanel.style.display === 'none' ? 'block' : 'none';
    }
}

// Generate MIDI files based on selected options
async function generateMIDIFiles() {
    try {
        // Use our custom SimpleMIDI generator
        if (!window.SimpleMIDI) {
            UI.showMessage('MIDI generator not available. Please refresh the page and try again.', 'error');
            return;
        }
        
        // Get export options from checkboxes
        const options = {
            exportChords: document.getElementById('export-chords')?.checked || false,
            exportBass: document.getElementById('export-bass')?.checked || false,
            exportMelody: document.getElementById('export-melody')?.checked || false,
            exportDrums: document.getElementById('export-drums')?.checked || false,
            exportHarmony: document.getElementById('export-harmony')?.checked || false,
            exportPads: document.getElementById('export-pads')?.checked || false,
            songLength: document.getElementById('song-length')?.value || 'medium',
            variations: parseInt(document.getElementById('midi-variations')?.value) || 2
        };
        
        if (!Object.values(options).some(val => val === true)) {
            UI.showMessage('Please select at least one track to export', 'warning');
            return;
        }
        
        UI.showMessage('Generating MIDI files...', 'info');
        
        const midiData = await MusicTheory.generateMIDITracks(appState.songData, options);
        
        // Generate downloadable MIDI files
        const midiFiles = MusicTheory.exportMIDIFiles(midiData);
        
        if (midiFiles.length === 0) {
            UI.showMessage('No MIDI tracks were generated. Please complete more song elements.', 'warning');
            return;
        }
        
        // Download all MIDI files
        MusicTheory.downloadMIDIFiles(midiFiles);
        
        if (midiData.fallback) {
            UI.showMessage(`✅ Exported ${midiFiles.length} MIDI instruction files! Open the text files for step-by-step DAW import instructions with exact note data.`, 'info');
        } else {
            UI.showMessage(`Successfully exported ${midiFiles.length} MIDI files`, 'success');
        }
        
    } catch (error) {
        console.error('MIDI export failed:', error);
        UI.showMessage('MIDI export failed. Please try again.', 'error');
    }
}


// Export Ableton Live template
async function exportAbletonTemplate() {
    try {
        if (!appState.songData.genre || !appState.songData.key) {
            UI.showMessage('Please complete the song creation process first', 'warning');
            return;
        }
        
        // Check if required libraries are available
        if (!window.JSZip) {
            UI.showMessage('Loading required libraries...', 'info');
            try {
                await loadJSZip();
            } catch (error) {
                UI.showMessage('Failed to load ZIP library. Please refresh the page and try again.', 'error');
                return;
            }
        }
        
        if (!window.SimpleMIDI) {
            UI.showMessage('MIDI generator not available. Please refresh the page and try again.', 'error');
            return;
        }
        
        UI.showMessage('Generating Ableton Live template...', 'info');
        
        const templateData = MusicTheory.exportAbletonTemplate(appState.songData);
        const projectName = (appState.songData.title || 'Music Machine Song').replace(/[^a-zA-Z0-9]/g, '_');
        
        // Create a ZIP file structure
        const zip = new JSZip();
        
        // Add files to ZIP
        Object.entries(templateData).forEach(([filename, content]) => {
            if (typeof content === 'string') {
                // Regular text file
                zip.file(filename, content);
            } else if (typeof content === 'object' && content !== null) {
                // Handle folders
                Object.entries(content).forEach(([subfile, subcontent]) => {
                    if (subcontent instanceof Uint8Array || subcontent instanceof ArrayBuffer) {
                        // MIDI file - binary data
                        zip.file(`${filename}${subfile}`, subcontent);
                    } else if (typeof subcontent === 'string') {
                        // Text file in subfolder
                        zip.file(`${filename}${subfile}`, subcontent);
                    } else if (typeof subcontent === 'object') {
                        // Nested folder structure
                        Object.entries(subcontent).forEach(([subsubfile, subsubcontent]) => {
                            zip.file(`${filename}${subfile}${subsubfile}`, subsubcontent);
                        });
                    }
                });
            }
        });
        
        // Generate and download ZIP
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${projectName}_Ableton_Template.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        UI.showMessage('Ableton MIDI template downloaded successfully - check Instructions.txt for setup guide', 'success');
        
    } catch (error) {
        console.error('Ableton template export failed:', error);
        UI.showMessage('Failed to generate Ableton template. JSZip library may be missing.', 'error');
    }
}

// Load external libraries dynamically
function loadJSZip() {
    return new Promise((resolve, reject) => {
        if (window.JSZip) {
            resolve(window.JSZip);
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
        script.onload = () => resolve(window.JSZip);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}


// Initialize all external libraries
async function initializeLibraries() {
    const loadPromises = [
        loadJSZip().catch(error => console.warn('Failed to load JSZip library:', error))
    ];

    try {
        await Promise.all(loadPromises);
        console.log('All libraries loaded successfully');
    } catch (error) {
        console.warn('Some libraries failed to load:', error);
    }
}

// Check library status (for debugging)
function checkLibraries() {
    console.log('Library Status:');
    console.log('- Tonal.js:', !!window.Tonal ? '✅ Loaded' : '❌ Not loaded');
    console.log('- SimpleMIDI:', !!window.SimpleMIDI ? '✅ Loaded' : '❌ Not loaded');
    console.log('- JSZip.js:', !!window.JSZip ? '✅ Loaded' : '❌ Not loaded');

    // Update MIDI export button text based on library availability
    const midiButton = document.getElementById('export-midi');
    if (midiButton) {
        if (!window.SimpleMIDI) {
            midiButton.textContent = 'Export MIDI Instructions';
            midiButton.title = 'MIDI generator unavailable - will export text instructions instead';
        } else {
            midiButton.textContent = 'Export MIDI Files';
            midiButton.title = 'Export binary MIDI files';
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize the main app immediately
    initializeApp();
    
    // Load libraries in parallel (non-blocking)
    await initializeLibraries();
    
    // Log library status for debugging immediately and after delay
    checkLibraries();
    setTimeout(() => {
        console.log('--- Library Status After 2 seconds ---');
        checkLibraries();
    }, 2000);
});

// Expose library check function to global scope for debugging
window.checkLibraries = checkLibraries;

// Song Management Functions
function saveSong() {
    try {
        const songTitle = document.getElementById('song-title').value.trim() || 'My Song';
        const songData = {
            title: songTitle,
            timestamp: Date.now(),
            version: '2.0',
            mood: appState.selectedMood,
            genre: appState.selectedGenre,
            key: appState.selectedKey,
            scale: appState.selectedScale,
            tempo: appState.selectedTempo,
            chordProgression: appState.selectedChordProgression,
            drumPattern: appState.selectedDrumPattern,
            bassPattern: appState.selectedBassPattern,
            melody: appState.selectedMelody,
            songSections: appState.songSections || []
        };

        // Get existing songs
        const savedSongs = JSON.parse(localStorage.getItem('musicMachineSongs') || '{}');

        // Save song with title as key
        savedSongs[songTitle] = songData;
        localStorage.setItem('musicMachineSongs', JSON.stringify(savedSongs));

        // Update save status
        updateSaveStatus('Saved');
        console.log('Song saved successfully:', songTitle);

        return true;
    } catch (error) {
        console.error('Error saving song:', error);
        updateSaveStatus('Save failed');
        return false;
    }
}

function loadSong(songTitle) {
    try {
        const savedSongs = JSON.parse(localStorage.getItem('musicMachineSongs') || '{}');
        const songData = savedSongs[songTitle];

        if (!songData) {
            console.error('Song not found:', songTitle);
            return false;
        }

        // Load all song data into appState
        appState.selectedMood = songData.mood;
        appState.selectedGenre = songData.genre;
        appState.selectedKey = songData.key;
        appState.selectedScale = songData.scale;
        appState.selectedTempo = songData.tempo;
        appState.selectedChordProgression = songData.chordProgression;
        appState.selectedDrumPattern = songData.drumPattern;
        appState.selectedBassPattern = songData.bassPattern;
        appState.selectedMelody = songData.melody;
        appState.songSections = songData.songSections || [];

        // Update UI to reflect loaded data
        document.getElementById('song-title').value = songData.title;

        // Refresh all UI sections
        refreshAllSections();

        // Close load modal
        closeLoadModal();

        updateSaveStatus('Loaded');
        console.log('Song loaded successfully:', songTitle);

        return true;
    } catch (error) {
        console.error('Error loading song:', error);
        return false;
    }
}

function createNewSong() {
    if (confirm('Create a new song? All unsaved changes will be lost.')) {
        // Reset app state
        Object.keys(appState).forEach(key => {
            if (key.startsWith('selected')) {
                appState[key] = null;
            }
        });
        appState.songSections = [];

        // Reset UI
        document.getElementById('song-title').value = 'My Song';
        refreshAllSections();

        // Go to first step
        showStep(1);

        updateSaveStatus('New song');
        console.log('New song created');
    }
}

function duplicateSong() {
    const currentTitle = document.getElementById('song-title').value.trim() || 'My Song';
    const newTitle = prompt('Enter name for the copy:', currentTitle + ' (Copy)');

    if (newTitle && newTitle.trim()) {
        document.getElementById('song-title').value = newTitle.trim();
        saveSong();
        updateSaveStatus('Duplicated');
    }
}

function autoSave() {
    if (appState.selectedMood || appState.selectedGenre) {
        saveSong();
        updateSaveStatus('Auto-saved');
    }
}

function updateSaveStatus(message) {
    const statusElement = document.getElementById('save-status');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.style.opacity = '1';

        // Fade out after 2 seconds
        setTimeout(() => {
            statusElement.style.opacity = '0.6';
        }, 2000);
    }
}

function showLoadModal() {
    const modal = document.getElementById('load-song-modal');
    const songsList = document.getElementById('saved-songs-list');

    try {
        const savedSongs = JSON.parse(localStorage.getItem('musicMachineSongs') || '{}');
        const songTitles = Object.keys(savedSongs);

        if (songTitles.length === 0) {
            songsList.innerHTML = '<p class="no-songs">No saved songs found. Create and save a song first!</p>';
        } else {
            songsList.innerHTML = songTitles.map(title => {
                const song = savedSongs[title];
                const date = new Date(song.timestamp).toLocaleDateString();
                return `
                    <div class="saved-song-item" onclick="loadSong('${title}')">
                        <div class="song-info">
                            <h4>${title}</h4>
                            <p>${song.mood || 'Unknown'} • ${song.genre || 'Unknown'} • ${song.key || 'Unknown'}</p>
                            <small>Saved: ${date}</small>
                        </div>
                        <button class="delete-song-btn" onclick="event.stopPropagation(); deleteSong('${title}')" title="Delete song">🗑️</button>
                    </div>
                `;
            }).join('');
        }

        modal.style.display = 'block';
    } catch (error) {
        console.error('Error loading saved songs:', error);
        songsList.innerHTML = '<p class="no-songs">Error loading saved songs.</p>';
        modal.style.display = 'block';
    }
}

function closeLoadModal() {
    const modal = document.getElementById('load-song-modal');
    modal.style.display = 'none';
}

function deleteSong(songTitle) {
    if (confirm(`Delete "${songTitle}"? This cannot be undone.`)) {
        try {
            const savedSongs = JSON.parse(localStorage.getItem('musicMachineSongs') || '{}');
            delete savedSongs[songTitle];
            localStorage.setItem('musicMachineSongs', JSON.stringify(savedSongs));
            showLoadModal(); // Refresh the modal
            console.log('Song deleted:', songTitle);
        } catch (error) {
            console.error('Error deleting song:', error);
        }
    }
}

function refreshAllSections() {
    // Refresh mood/genre options
    if (appState.selectedMood) {
        const moodOption = document.querySelector(`[data-mood="${appState.selectedMood}"]`);
        if (moodOption) moodOption.click();
    }
    if (appState.selectedGenre) {
        const genreOption = document.querySelector(`[data-genre="${appState.selectedGenre}"]`);
        if (genreOption) genreOption.click();
    }

    // Refresh key/tempo options
    if (appState.selectedKey) {
        const keyOption = document.querySelector(`[data-key="${appState.selectedKey}"]`);
        if (keyOption) keyOption.click();
    }
    if (appState.selectedScale) {
        const scaleOption = document.querySelector(`[data-scale="${appState.selectedScale}"]`);
        if (scaleOption) scaleOption.click();
    }
    if (appState.selectedTempo) {
        const tempoOption = document.querySelector(`[data-tempo="${appState.selectedTempo}"]`);
        if (tempoOption) tempoOption.click();
    }

    // Refresh chord progression
    if (appState.selectedChordProgression) {
        const chordOption = document.querySelector(`[data-progression="${appState.selectedChordProgression.name}"]`);
        if (chordOption) chordOption.click();
    }

    // Refresh drum pattern
    if (appState.selectedDrumPattern) {
        const drumOption = document.querySelector(`[data-pattern="${appState.selectedDrumPattern.name}"]`);
        if (drumOption) drumOption.click();
    }

    // Refresh bass pattern
    if (appState.selectedBassPattern) {
        const bassOption = document.querySelector(`[data-bass="${appState.selectedBassPattern.name}"]`);
        if (bassOption) bassOption.click();
    }

    // Refresh melody
    if (appState.selectedMelody) {
        const melodyOption = document.querySelector(`[data-melody="${appState.selectedMelody.name}"]`);
        if (melodyOption) melodyOption.click();
    }

    // Refresh song sections
    if (appState.songSections && appState.songSections.length > 0) {
        // This would need to be implemented in ui.js to rebuild the songcraft sections
        console.log('Song sections to restore:', appState.songSections);
    }
}

// Auto-save timer
let autoSaveTimer;
function scheduleAutoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(autoSave, 5000); // Auto-save after 5 seconds of inactivity
}

// Set up event listeners for song management
document.addEventListener('DOMContentLoaded', () => {
    // Song management buttons
    const newSongBtn = document.getElementById('new-song');
    const saveSongBtn = document.getElementById('save-song');
    const loadSongBtn = document.getElementById('load-song');
    const duplicateSongBtn = document.getElementById('duplicate-song');

    if (newSongBtn) newSongBtn.addEventListener('click', createNewSong);
    if (saveSongBtn) saveSongBtn.addEventListener('click', saveSong);
    if (loadSongBtn) loadSongBtn.addEventListener('click', showLoadModal);
    if (duplicateSongBtn) duplicateSongBtn.addEventListener('click', duplicateSong);

    // Auto-save on song title change
    const songTitleInput = document.getElementById('song-title');
    if (songTitleInput) {
        songTitleInput.addEventListener('input', scheduleAutoSave);
    }

    // Close modal when clicking outside
    const modal = document.getElementById('load-song-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeLoadModal();
            }
        });
    }
});

// Expose functions to global scope for onclick handlers
window.loadSong = loadSong;
window.deleteSong = deleteSong;
window.closeLoadModal = closeLoadModal;
window.checkLibraries = checkLibraries;