// main.js - Application orchestrator and state management

import * as MusicTheory from './music-theory.js';
import * as UI from './ui.js';

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
        songStructure: null,
        arrangementTips: null,
        lyrics: '',
        title: 'My Song'
    },
    loadedData: {
        moods: [],
        genres: [],
        chordProgressions: {},
        drumPatterns: {}
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

// Load structure step
async function loadStructureStep() {
    if (!appState.songData.genre) {
        UI.showMessage('Please select a genre first', 'error');
        return;
    }
    
    const songStructures = MusicTheory.getSongStructureForGenre(appState.songData.genre);
    UI.renderSongStructure(songStructures, 'structure-builder');
    UI.showStep('step-structure');
}

// Load arrangement step
async function loadArrangementStep() {
    if (!appState.songData.genre || !appState.songData.songStructure) {
        UI.showMessage('Please select genre and song structure first', 'error');
        return;
    }
    
    const arrangementTips = MusicTheory.getArrangementSuggestions(
        appState.songData.genre,
        appState.songData.songStructure
    );
    
    appState.songData.arrangementTips = arrangementTips;
    UI.renderArrangementTips(arrangementTips, 'arrangement-tips');
    UI.showStep('step-arrangement');
    
    // Enable the next button since arrangement is informational
    UI.enableButton('arrangement-next');
}

// Load lyrics step
async function loadLyricsStep() {
    if (!appState.songData.mood) {
        UI.showMessage('Please select a mood first', 'error');
        return;
    }
    
    // Render thematic words based on mood
    const thematicWords = appState.songData.mood.themes || [];
    UI.renderThematicWords(thematicWords, 'thematic-words');
    
    UI.showStep('step-lyrics');
    
    // Enable the next button since lyrics are optional
    UI.enableButton('lyrics-next');
}

// Load export step
async function loadExportStep() {
    // Get lyrics from textarea
    const lyricsTextarea = document.getElementById('lyrics-text');
    if (lyricsTextarea) {
        appState.songData.lyrics = lyricsTextarea.value;
    }
    
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
    // Next buttons
    const nextButtons = {
        'mood-next': () => loadKeyTempoStep(),
        'key-tempo-next': () => loadChordsStep(),
        'chords-next': () => loadDrumsStep(),
        'drums-next': () => loadBassStep(),
        'bass-next': () => loadMelodyStep(),
        'melody-next': () => loadStructureStep(),
        'structure-next': () => loadArrangementStep(),
        'arrangement-next': () => loadLyricsStep(),
        'lyrics-next': () => loadExportStep()
    };
    
    Object.entries(nextButtons).forEach(([buttonId, handler]) => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', handler);
        }
    });
    
    // Back buttons
    const backButtons = {
        'key-tempo-back': () => loadMoodStep(),
        'chords-back': () => loadKeyTempoStep(),
        'drums-back': () => loadChordsStep(),
        'bass-back': () => loadDrumsStep(),
        'melody-back': () => loadBassStep(),
        'structure-back': () => loadMelodyStep(),
        'arrangement-back': () => loadStructureStep(),
        'lyrics-back': () => loadArrangementStep(),
        'export-back': () => loadLyricsStep()
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
        7: () => loadStructureStep(),
        8: () => loadArrangementStep(),
        9: () => loadLyricsStep(),
        10: () => loadExportStep()
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
            break;
            
        case 'scale':
            appState.songData.scale = element.dataset.scale;
            checkKeyTempoComplete();
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
            
        case 'bass-complexity':
            appState.songData.bassComplexity = element.dataset.complexity;
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
            appState.songData.bassComplexity
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
        // Check if MidiWriter is available, if not try to load it
        if (!window.MidiWriter) {
            UI.showMessage('Loading MIDI library...', 'info');
            try {
                await loadMidiWriter();
            } catch (error) {
                UI.showMessage('Failed to load MIDI library. Please refresh the page and try again.', 'error');
                return;
            }
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
        
        if (!window.MidiWriter) {
            try {
                await loadMidiWriter();
            } catch (error) {
                UI.showMessage('Failed to load MIDI library. Please refresh the page and try again.', 'error');
                return;
            }
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

function loadMidiWriter() {
    return new Promise((resolve, reject) => {
        if (window.MidiWriter) {
            resolve(window.MidiWriter);
            return;
        }
        
        // Try multiple CDN URLs as fallbacks
        const urls = [
            'https://cdn.jsdelivr.net/npm/midi-writer-js@2.0.5/build/browser/MidiWriter.min.js',
            'https://unpkg.com/midi-writer-js@2.0.5/build/browser/MidiWriter.min.js',
            'https://cdn.jsdelivr.net/npm/midi-writer-js@latest/build/browser/MidiWriter.min.js'
        ];
        
        let urlIndex = 0;
        
        function tryNextUrl() {
            if (urlIndex >= urls.length) {
                reject(new Error('All MidiWriter CDN URLs failed'));
                return;
            }
            
            const script = document.createElement('script');
            script.src = urls[urlIndex];
            
            script.onload = () => {
                if (window.MidiWriter) {
                    console.log(`MidiWriter loaded successfully from: ${urls[urlIndex]}`);
                    resolve(window.MidiWriter);
                } else {
                    console.warn(`Script loaded but MidiWriter not available from: ${urls[urlIndex]}`);
                    urlIndex++;
                    tryNextUrl();
                }
            };
            
            script.onerror = (error) => {
                console.warn(`Failed to load MidiWriter from: ${urls[urlIndex]}`, error);
                urlIndex++;
                tryNextUrl();
            };
            
            document.head.appendChild(script);
        }
        
        tryNextUrl();
    });
}

// Initialize all external libraries
async function initializeLibraries() {
    const loadPromises = [
        loadJSZip().catch(error => console.warn('Failed to load JSZip library:', error))
    ];
    
    // Check if MidiWriter is already loaded from HTML script tag
    if (!window.MidiWriter) {
        loadPromises.push(
            loadMidiWriter().catch(error => console.warn('Failed to load MidiWriter library:', error))
        );
    } else {
        console.log('MidiWriter already loaded from HTML script tag');
    }
    
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
    console.log('- MidiWriter.js:', !!window.MidiWriter ? '✅ Loaded' : '❌ Not loaded');
    console.log('- JSZip.js:', !!window.JSZip ? '✅ Loaded' : '❌ Not loaded');
    
    // Update MIDI export button text based on library availability
    const midiButton = document.getElementById('export-midi');
    if (midiButton) {
        if (!window.MidiWriter) {
            midiButton.textContent = 'Export MIDI Instructions';
            midiButton.title = 'MIDI library unavailable - will export text instructions instead';
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