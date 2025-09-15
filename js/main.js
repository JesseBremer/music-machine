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
    const startOverBtn = document.getElementById('start-over');
    
    if (exportTextBtn) {
        exportTextBtn.addEventListener('click', exportAsText);
    }
    
    if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', exportAsJSON);
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
            break;
            
        case 'drum-pattern':
            const patternId = element.dataset.patternId;
            const patterns = MusicTheory.getDrumPatternsForGenre(
                appState.songData.genre,
                appState.loadedData.drumPatterns
            );
            appState.songData.drumPattern = patterns.find(p => p.id === patternId);
            break;
            
        case 'bass-complexity':
            appState.songData.bassComplexity = element.dataset.complexity;
            generateAndDisplayBassLine();
            break;
            
        case 'melody-idea':
            const melodyIndex = parseInt(element.dataset.melodyIndex);
            const melodyIdeas = MusicTheory.generateMelodyIdeas(
                appState.songData.key,
                appState.songData.chordProgression,
                appState.songData.scale
            );
            appState.songData.melodyIdea = melodyIdeas[melodyIndex];
            break;
            
        case 'song-structure':
            const structureIndex = parseInt(element.dataset.structureIndex);
            const structures = MusicTheory.getSongStructureForGenre(appState.songData.genre);
            appState.songData.songStructure = structures[structureIndex].sections;
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

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);