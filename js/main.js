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
        strummingPattern: null,
        rhythmTemplate: null,
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
        const currentChordProgression = window.appState?.songData?.chordProgression || window.appState?.selectedChordProgression;
        const currentKey = window.appState?.songData?.key;

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
                <button class="use-melody-btn" onclick="useGeneratedMelody('${style}', '${JSON.stringify(melodyResult).replace(/"/g, '&quot;')}')">
                    ✅ Use This Melody
                </button>
                <button class="regenerate-btn" onclick="generateSmartMelody('${style}')">
                    🔄 Generate New Variation
                </button>
            </div>
        </div>
    `;

    generatedMelodyDiv.style.display = 'block';
}

// Global function for showing melody generator (redesigned melody page)
window.showMelodyGenerator = function() {
    const generatorSection = document.getElementById('melody-generator-section');
    if (generatorSection) {
        generatorSection.style.display = 'block';
        generatorSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
};

// Global function for generating simple melodies with style presets
window.generateSimpleMelody = function(style) {
    try {
        // Ensure we have the required data
        let currentChordProgression = appState?.songData?.chordProgression;
        let currentKey = appState?.songData?.key;

        // Provide defaults if not available
        if (!currentChordProgression) {
            currentChordProgression = {
                id: 'I-V-vi-IV',
                name: 'Pop Magic',
                numerals: ['I', 'V', 'vi', 'IV'],
                chords: ['C', 'G', 'Am', 'F']
            };
            appState.songData.chordProgression = currentChordProgression;
        }

        if (!currentKey) {
            currentKey = 'C';
            appState.songData.key = currentKey;
        }

        if (!MusicTheory?.generateSmartMelody) {
            console.warn('Melody generation not available');
            const resultDiv = document.getElementById('melody-result');
            if (resultDiv) {
                resultDiv.innerHTML = `
                    <div class="error-message">
                        <p>❌ Melody generation is not available. Please make sure all required scripts are loaded.</p>
                    </div>
                `;
                resultDiv.style.display = 'block';
            }
            return;
        }

        // Map simple style names to generation options
        const styleConfig = {
            'simple': {
                style: 'balanced',
                preferChordTones: true,
                avoidLargeLeaps: true,
                octave: 5
            },
            'flowing': {
                style: 'smooth',
                preferChordTones: false,
                avoidLargeLeaps: true,
                stepwiseMotion: true,
                octave: 5
            },
            'dramatic': {
                style: 'angular',
                preferChordTones: true,
                avoidLargeLeaps: false,
                allowLargeLeaps: true,
                octave: 5
            },
            'rhythmic': {
                style: 'rhythmic',
                preferChordTones: true,
                avoidLargeLeaps: false,
                emphasisOnRhythm: true,
                octave: 5
            }
        };

        const options = styleConfig[style] || styleConfig['simple'];

        const melodyResult = MusicTheory.generateSmartMelody(currentChordProgression, currentKey, options);

        if (melodyResult) {
            displaySimpleMelody(melodyResult, style);
        } else {
            console.error('Failed to generate melody');
            const resultDiv = document.getElementById('melody-result');
            if (resultDiv) {
                resultDiv.innerHTML = `
                    <div class="error-message">
                        <p>❌ Failed to generate melody. Please try again.</p>
                    </div>
                `;
                resultDiv.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error generating simple melody:', error);
        const resultDiv = document.getElementById('melody-result');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="error-message">
                    <p>❌ Error: ${error.message}</p>
                </div>
            `;
            resultDiv.style.display = 'block';
        }
    }
};

// Display function for simple melody generator
function displaySimpleMelody(melodyResult, style) {
    const resultDiv = document.getElementById('melody-result');
    if (!resultDiv) return;

    const styleNames = {
        'simple': 'Simple & Catchy',
        'flowing': 'Smooth & Flowing',
        'dramatic': 'Bold & Dramatic',
        'rhythmic': 'Rhythmic & Punchy'
    };

    resultDiv.innerHTML = `
        <div class="generated-melody-content">
            <h4>✨ ${styleNames[style] || style} Melody</h4>
            <div class="melody-sequence">
                ${melodyResult.melody.map((note, i) => `
                    <span class="melody-note ${note.isChordTone ? 'chord-tone' : 'scale-tone'}" title="${note.isChordTone ? 'Chord Tone' : 'Scale Tone'}">
                        ${note.note}${note.octave}
                        <small>${note.chord}</small>
                    </span>
                `).join('')}
            </div>
            ${melodyResult.analysis && melodyResult.analysis.length > 0 ? `
                <div class="melody-analysis">
                    ${melodyResult.analysis.map(tip => `<div class="analysis-tip">💡 ${tip}</div>`).join('')}
                </div>
            ` : ''}
            <div class="melody-controls">
                <button class="play-btn" onclick="playGeneratedMelody('${JSON.stringify(melodyResult.melody.map(n => n.midiNote)).replace(/"/g, '&quot;')}')">
                    🎵 Play Melody
                </button>
                <button class="use-melody-btn" onclick="useGeneratedMelody('${style}', '${JSON.stringify(melodyResult).replace(/"/g, '&quot;')}')">
                    ✅ Use This Melody
                </button>
                <button class="regenerate-btn" onclick="generateSimpleMelody('${style}')">
                    🔄 Try Another
                </button>
            </div>
        </div>
    `;

    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

// Advanced melody generation with all new features
window.generateAdvancedMelody = function() {
    try {
        const currentChordProgression = window.appState?.songData?.chordProgression || window.appState?.selectedChordProgression;
        const currentKey = window.appState?.songData?.key;
        const currentScale = window.appState?.songData?.scale || 'major';

        if (!currentChordProgression || !currentKey || !window.MusicTheory?.generateAdvancedMelody) {
            console.warn('Advanced melody generation not available');
            return;
        }

        // Get user preferences from UI
        const genre = document.getElementById('melody-genre')?.value || 'pop';
        const phraseStructure = document.getElementById('phrase-structure')?.value || 'question-answer';
        const lyrics = document.getElementById('melody-lyrics')?.value || null;
        const useMotifs = document.getElementById('use-motifs')?.checked !== false;
        const callResponse = document.getElementById('call-response')?.checked !== false;

        // Configure advanced generation options
        const options = {
            genre: genre,
            phraseStructure: callResponse ? 'question-answer' : phraseStructure,
            lyrics: lyrics && lyrics.trim() ? lyrics.trim() : null,
            useMotifs: useMotifs,
            developmentTechniques: ['sequence', 'inversion', 'augmentation'],
            notesPerChord: genre === 'jazz' ? 6 : genre === 'classical' ? 8 : 4,
            style: genre === 'rock' ? 'angular' : genre === 'classical' ? 'smooth' : 'mixed',
            vocalRange: { low: 'C4', high: 'C6' },
            scale: currentScale // Pass the selected scale
        };

        console.log('Generating advanced melody with options:', options);

        const melodyResult = window.MusicTheory.generateAdvancedMelody(currentChordProgression, currentKey, options);

        if (melodyResult) {
            displayAdvancedMelody(melodyResult, options);
        } else {
            console.error('Failed to generate advanced melody');
        }
    } catch (error) {
        console.error('Error generating advanced melody:', error);
    }
};

function displayAdvancedMelody(melodyResult, options) {
    const generatedMelodyDiv = document.getElementById('generated-melody');
    if (!generatedMelodyDiv) return;

    const melodyNotes = melodyResult.melody.map(note => `${note.note}${note.octave}`);

    // Create enhanced display with phrase structure and development info
    const phraseInfo = melodyResult.phrases ? melodyResult.phrases.map(phrase =>
        `<span class="phrase-marker phrase-${phrase.type}">${phrase.type}</span>`
    ).join(' ') : '';

    generatedMelodyDiv.innerHTML = `
        <div class="generated-melody-content advanced">
            <h7>🌟 Advanced ${options.genre.charAt(0).toUpperCase() + options.genre.slice(1)} Melody</h7>

            ${phraseInfo ? `<div class="phrase-structure">
                <small>Phrase Structure: ${phraseInfo}</small>
            </div>` : ''}

            ${options.lyrics ? `<div class="lyrics-info">
                <small>📝 Adapted to lyrics: "${options.lyrics}"</small>
            </div>` : ''}

            <div class="melody-sequence advanced">
                ${melodyResult.melody.map((note, i) => {
                    let noteClasses = ['melody-note'];
                    if (note.isChordTone) noteClasses.push('chord-tone');
                    if (note.isStrongBeat) noteClasses.push('strong-beat');
                    if (note.isDownbeat) noteClasses.push('downbeat');
                    if (note.isHookSection) noteClasses.push('hook-section');
                    if (note.allowMelisma) noteClasses.push('melisma');

                    return `
                        <span class="${noteClasses.join(' ')}" title="${note.selectionReason || ''}">
                            ${note.note}${note.octave}
                            <small>${note.chord}</small>
                            ${note.isStrongBeat ? '<sup>●</sup>' : ''}
                            ${note.isDownbeat ? '<sup>▼</sup>' : ''}
                        </span>
                    `;
                }).join('')}
            </div>

            <div class="melody-features">
                <div class="feature-tags">
                    ${melodyResult.features?.chordToneAware ? '<span class="feature-tag">🎯 Chord-Tone Aware</span>' : ''}
                    ${melodyResult.features?.motifDevelopment ? '<span class="feature-tag">🎵 Motif Development</span>' : ''}
                    ${melodyResult.features?.callAndResponse ? '<span class="feature-tag">💬 Call & Response</span>' : ''}
                    ${melodyResult.features?.lyricalAdaptation ? '<span class="feature-tag">🎤 Lyrical Adaptation</span>' : ''}
                    ${melodyResult.features?.genreSpecific ? `<span class="feature-tag">🎼 ${options.genre} Style</span>` : ''}
                </div>
            </div>

            <div class="melody-analysis advanced">
                ${melodyResult.analysis.map(tip => `<div class="analysis-tip">${tip}</div>`).join('')}
            </div>

            <div class="melody-controls">
                <button class="play-btn" onclick="playGeneratedMelody('${JSON.stringify(melodyResult.melody.map(n => n.midiNote)).replace(/"/g, '&quot;')}')">
                    🎵 Play Advanced Melody
                </button>
                <button class="use-melody-btn" onclick="useAdvancedMelody('${JSON.stringify(melodyResult).replace(/"/g, '&quot;')}', '${JSON.stringify(options).replace(/"/g, '&quot;')}')">
                    ✅ Use This Melody
                </button>
                <button class="regenerate-btn" onclick="generateAdvancedMelody()">
                    🔄 Generate New Variation
                </button>
                <button class="export-btn" onclick="exportMelodyToClipboard('${JSON.stringify(melodyResult.melody.map(n => `${n.note}${n.octave}`)).replace(/"/g, '&quot;')}')">
                    📋 Copy Melody Notes
                </button>
            </div>
        </div>
    `;

    generatedMelodyDiv.style.display = 'block';
}

// Export melody to clipboard
window.exportMelodyToClipboard = function(melodyNotesStr) {
    try {
        const melodyNotes = JSON.parse(melodyNotesStr);
        const melodyText = melodyNotes.join(' - ');

        if (navigator.clipboard) {
            navigator.clipboard.writeText(melodyText).then(() => {
                // Visual feedback
                const btn = event.target;
                const originalText = btn.textContent;
                btn.textContent = '✅ Copied!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = melodyText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = '✅ Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }
    } catch (error) {
        console.error('Error copying melody to clipboard:', error);
    }
};

// Use generated smart melody as the song's melody
window.useGeneratedMelody = function(style, melodyResultStr) {
    try {
        // Fix HTML entity decoding
        const decodedStr = melodyResultStr.replace(/&quot;/g, '"');
        const melodyResult = JSON.parse(decodedStr);

        // Store the generated melody as the selected melody in app state
        appState.songData.melodyIdea = {
            name: `Generated ${style.charAt(0).toUpperCase() + style.slice(1)} Melody`,
            type: 'generated',
            style: style,
            melody: melodyResult.melody,
            analysis: melodyResult.analysis,
            features: melodyResult.features || {},
            midiNotes: melodyResult.melody.map(n => n.midiNote),
            noteNames: melodyResult.melody.map(n => `${n.note}${n.octave}`)
        };

        // Enable the next step button
        UI.enableButton('melody-next-top');

        // Visual feedback
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ Selected!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 3000);

        // Show success message
        UI.showMessage(`${style.charAt(0).toUpperCase() + style.slice(1)} melody selected for your song!`, 'success');

        console.log('Generated melody selected:', appState.songData.melodyIdea);
    } catch (error) {
        console.error('Error using generated melody:', error);
        console.error('Melody result string:', melodyResultStr);
        UI.showMessage('Error selecting melody. Please try again.', 'error');
    }
};

// Use advanced generated melody as the song's melody
window.useAdvancedMelody = function(melodyResultStr, optionsStr) {
    try {
        // Fix HTML entity decoding
        const decodedMelodyStr = melodyResultStr.replace(/&quot;/g, '"');
        const decodedOptionsStr = optionsStr.replace(/&quot;/g, '"');
        const melodyResult = JSON.parse(decodedMelodyStr);
        const options = JSON.parse(decodedOptionsStr);

        // Store the advanced melody as the selected melody in app state
        appState.songData.melodyIdea = {
            name: `Advanced ${options.genre.charAt(0).toUpperCase() + options.genre.slice(1)} Melody`,
            type: 'advanced',
            genre: options.genre,
            phraseStructure: options.phraseStructure,
            lyrics: options.lyrics,
            melody: melodyResult.melody,
            phrases: melodyResult.phrases,
            analysis: melodyResult.analysis,
            features: melodyResult.features || {},
            midiNotes: melodyResult.melody.map(n => n.midiNote),
            noteNames: melodyResult.melody.map(n => `${n.note}${n.octave}`)
        };

        // Enable the next step button
        UI.enableButton('melody-next-top');

        // Visual feedback
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ Selected!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 3000);

        // Show success message
        UI.showMessage(`Advanced ${options.genre} melody selected for your song!`, 'success');

        console.log('Advanced melody selected:', appState.songData.melodyIdea);
    } catch (error) {
        console.error('Error using advanced melody:', error);
        console.error('Melody result string:', melodyResultStr);
        console.error('Options string:', optionsStr);
        UI.showMessage('Error selecting melody. Please try again.', 'error');
    }
};

// Generate melody for specific song section
window.generateSectionMelody = function(sectionId) {
    try {
        const sectionElement = document.getElementById(sectionId);
        if (!sectionElement) return;

        const chordInput = sectionElement.querySelector('.chord-progression-input');
        const lyricsInput = sectionElement.querySelector('.lyrics-input');
        const styleSelect = sectionElement.querySelector('.section-melody-style');
        const useLyricsCheckbox = sectionElement.querySelector('.use-section-lyrics');
        const melodyDisplay = sectionElement.querySelector('.section-melody-display');

        // Get section data
        const chordText = chordInput?.value?.trim();
        const lyrics = useLyricsCheckbox?.checked ? lyricsInput?.value?.trim() : null;
        const style = styleSelect?.value || 'verse';
        const key = window.appState?.songData?.key;
        const scale = window.appState?.songData?.scale || 'major';

        if (!chordText || !key) {
            alert('Please ensure the section has chord progression and a key is selected.');
            return;
        }

        // Parse chord progression
        const chords = chordText.split(/[-–—\s]+/).map(c => c.trim()).filter(c => c);
        const chordProgression = { chords: chords };

        // Map style to genre and options
        let genre = window.appState?.songData?.genre?.name || 'pop';
        let phraseStructure = 'question-answer';
        let developmentTechniques = ['sequence', 'inversion'];

        // Section-specific adjustments
        switch(style) {
            case 'verse':
                phraseStructure = 'free';
                developmentTechniques = ['sequence'];
                break;
            case 'chorus':
                genre = 'pop'; // Force hook-focused approach
                phraseStructure = 'question-answer';
                developmentTechniques = ['sequence', 'inversion'];
                break;
            case 'bridge':
                phraseStructure = 'arch';
                developmentTechniques = ['inversion', 'augmentation'];
                break;
        }

        // Calculate appropriate number of notes based on lyrics
        let notesPerChord = 4; // Default

        if (lyrics && lyrics.length > 0) {
            // Count syllables in lyrics
            const syllableCount = countSyllablesInText(lyrics);
            const chordCount = chords.length;

            // Calculate notes per chord to match syllables (with some musical flexibility)
            notesPerChord = Math.max(1, Math.round(syllableCount / chordCount));

            // Cap at reasonable limits
            notesPerChord = Math.min(8, Math.max(1, notesPerChord));

            console.log('Lyrical adaptation:', { lyrics, syllableCount, chordCount, notesPerChord });
        }

        // Configure advanced generation options
        const options = {
            genre: genre,
            phraseStructure: phraseStructure,
            lyrics: lyrics,
            useMotifs: true,
            developmentTechniques: developmentTechniques,
            notesPerChord: notesPerChord,
            style: style === 'angular' ? 'angular' : 'smooth',
            vocalRange: { low: 'C4', high: 'C6' },
            scale: scale // Pass the selected scale
        };

        console.log('Generating section melody:', { sectionId, chords, lyrics, style, options });

        const melodyResult = window.MusicTheory.generateAdvancedMelody(chordProgression, key, options);

        if (melodyResult) {
            displaySectionMelody(melodyResult, options, melodyDisplay, sectionId);
        } else {
            console.error('Failed to generate section melody');
        }
    } catch (error) {
        console.error('Error generating section melody:', error);
    }
};

function displaySectionMelody(melodyResult, options, melodyDisplay, sectionId) {
    if (!melodyDisplay) return;

    melodyDisplay.innerHTML = `
        <div class="section-melody-content">
            <div class="melody-header">
                <h5>🎵 Generated Melody - ${options.genre.charAt(0).toUpperCase() + options.genre.slice(1)} Style</h5>
                ${options.lyrics ? `<p class="lyrics-adapted">📝 Adapted to: "${options.lyrics}"</p>` : ''}
            </div>

            <div class="melody-sequence section">
                ${melodyResult.melody.map((note, i) => {
                    let noteClasses = ['melody-note'];
                    if (note.isChordTone) noteClasses.push('chord-tone');
                    if (note.isStrongBeat) noteClasses.push('strong-beat');
                    if (note.isDownbeat) noteClasses.push('downbeat');

                    return `
                        <span class="${noteClasses.join(' ')}" title="${note.selectionReason || ''}">
                            ${note.note}${note.octave}
                            <small>${note.chord}</small>
                            ${note.isStrongBeat ? '<sup>●</sup>' : ''}
                        </span>
                    `;
                }).join('')}
            </div>

            <div class="section-melody-analysis">
                ${melodyResult.analysis.slice(0, 3).map(tip => `<div class="analysis-tip-small">${tip}</div>`).join('')}
            </div>

            <div class="section-melody-controls">
                <button class="play-section-melody-btn" onclick="playGeneratedMelody('${JSON.stringify(melodyResult.melody.map(n => n.midiNote)).replace(/"/g, '&quot;')}')">
                    🎵 Play
                </button>
                <button class="use-as-main-melody-btn" onclick="promoteToMainMelody('${sectionId}', '${JSON.stringify(melodyResult).replace(/"/g, '&quot;')}', '${JSON.stringify(options).replace(/"/g, '&quot;')}')">
                    ⭐ Use as Main Melody
                </button>
                <button class="regenerate-section-btn" onclick="generateSectionMelody('${sectionId}')">
                    🔄 New Variation
                </button>
                <button class="copy-section-melody-btn" onclick="copySectionMelody('${sectionId}')">
                    📋 Copy Notes
                </button>
                <button class="remove-section-melody-btn" onclick="removeSectionMelody('${sectionId}')">
                    🗑️ Remove
                </button>
            </div>
        </div>
    `;

    melodyDisplay.style.display = 'block';
}

// Count syllables in text for melody adaptation
function countSyllablesInText(text) {
    if (!text) return 0;

    const words = text.toLowerCase().split(/\s+/);
    let totalSyllables = 0;

    words.forEach(word => {
        // Remove punctuation
        word = word.replace(/[^a-z]/g, '');
        if (!word) return;

        let syllableCount = 0;
        let wasVowel = false;

        for (let i = 0; i < word.length; i++) {
            const isVowel = 'aeiouy'.includes(word[i]);
            if (isVowel && !wasVowel) {
                syllableCount++;
            }
            wasVowel = isVowel;
        }

        // Handle silent e
        if (word.endsWith('e') && syllableCount > 1) {
            syllableCount--;
        }

        // Minimum of 1 syllable per word
        totalSyllables += Math.max(1, syllableCount);
    });

    return totalSyllables;
}

// Copy section melody to clipboard
window.copySectionMelody = function(sectionId) {
    try {
        const melodyDisplay = document.querySelector(`#melody-${sectionId}`);
        const melodyNotes = Array.from(melodyDisplay.querySelectorAll('.melody-note')).map(note => {
            return note.textContent.split(' ')[0]; // Get just the note name
        });

        const melodyText = melodyNotes.join(' - ');

        if (navigator.clipboard) {
            navigator.clipboard.writeText(melodyText).then(() => {
                const btn = event.target;
                const originalText = btn.textContent;
                btn.textContent = '✅ Copied!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            });
        }
    } catch (error) {
        console.error('Error copying section melody:', error);
    }
};

// Remove section melody
window.removeSectionMelody = function(sectionId) {
    try {
        const sectionElement = document.getElementById(sectionId);
        const melodyDisplay = sectionElement?.querySelector('.section-melody-display');

        if (melodyDisplay) {
            // Hide the melody display
            melodyDisplay.style.display = 'none';
            melodyDisplay.innerHTML = '';

            // Show success message
            UI.showMessage('Section melody removed', 'info');

            console.log('Section melody removed from:', sectionId);
        }
    } catch (error) {
        console.error('Error removing section melody:', error);
    }
};

// Promote section melody to main melody
window.promoteToMainMelody = function(sectionId, melodyResultStr, optionsStr) {
    try {
        // Fix HTML entity decoding
        const decodedMelodyStr = melodyResultStr.replace(/&quot;/g, '"');
        const decodedOptionsStr = optionsStr.replace(/&quot;/g, '"');
        const melodyResult = JSON.parse(decodedMelodyStr);
        const options = JSON.parse(decodedOptionsStr);

        // Get section type for better naming
        const sectionElement = document.getElementById(sectionId);
        const sectionTypeElement = sectionElement?.querySelector('.section-header h4');
        const sectionType = sectionTypeElement?.textContent?.split(' ')[0] || 'Section';

        // Store as the main melody in app state
        appState.songData.melodyIdea = {
            name: `${sectionType} ${options.genre.charAt(0).toUpperCase() + options.genre.slice(1)} Melody`,
            type: 'promoted-section',
            originalSection: sectionId,
            sectionType: sectionType,
            genre: options.genre,
            phraseStructure: options.phraseStructure,
            lyrics: options.lyrics,
            melody: melodyResult.melody,
            phrases: melodyResult.phrases,
            analysis: melodyResult.analysis,
            features: melodyResult.features || {},
            midiNotes: melodyResult.melody.map(n => n.midiNote),
            noteNames: melodyResult.melody.map(n => `${n.note}${n.octave}`)
        };

        // Visual feedback for the button
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ Now Main Melody!';
        btn.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 3000);

        // Show success message
        UI.showMessage(`${sectionType} melody promoted to main song melody!`, 'success');

        // Update the main melody step display if it exists
        updateMainMelodyDisplay();

        console.log('Section melody promoted to main melody:', appState.songData.melodyIdea);
    } catch (error) {
        console.error('Error promoting section melody:', error);
        console.error('Melody result string:', melodyResultStr);
        console.error('Options string:', optionsStr);
        UI.showMessage('Error promoting melody. Please try again.', 'error');
    }
};

// Update main melody display when a section melody is promoted
window.updateMainMelodyDisplay = function() {
    // Update the melody step if user goes back to it
    if (document.getElementById('step-melody')?.style.display !== 'none') {
        // Show a banner indicating the current main melody
        const melodyContainer = document.getElementById('melody-suggestions');
        if (melodyContainer) {
            const existingBanner = melodyContainer.querySelector('.current-main-melody-banner');
            if (existingBanner) {
                existingBanner.remove();
            }

            if (appState.songData.melodyIdea) {
                const banner = document.createElement('div');
                banner.className = 'current-main-melody-banner';
                banner.innerHTML = `
                    <div class="main-melody-status">
                        <h4>⭐ Current Primary Melody: ${appState.songData.melodyIdea.name}</h4>
                        <p>This melody will be used in song exports and full arrangements.</p>
                        ${appState.songData.melodyIdea.type === 'promoted-section' ?
                          `<small>📍 Promoted from ${appState.songData.melodyIdea.sectionType} section</small>` :
                          ''}
                    </div>
                `;
                melodyContainer.insertBefore(banner, melodyContainer.firstChild);
            }
        }
    }
}

// Initialize the application
async function initializeApp() {
    try {
        // Load all data
        appState.loadedData.moods = await MusicTheory.getMoodsData();
        appState.loadedData.genres = await MusicTheory.getGenresData();
        appState.loadedData.chordProgressions = await MusicTheory.getChordProgressionsData();
        appState.loadedData.drumPatterns = await MusicTheory.getDrumPatternsData();

        // Initialize rhythm engine
        if (window.rhythmEngine) {
            console.log('Initializing rhythm engine...');
            await window.rhythmEngine.initialize();
            console.log('Rhythm engine initialized');
        }

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
    // Mood and genre are optional - if not selected, show all options
    const allKeysObj = MusicTheory.getAllKeys();
    const allKeysArray = allKeysObj.all;

    // Default mood/genre for when they're not selected
    const defaultMood = { suggestedKeys: allKeysArray, tempoRange: [60, 180], suggestedScales: ['major', 'minor'] };
    const mood = appState.songData.mood || defaultMood;
    const genre = appState.songData.genre || null;

    // Get suggested keys
    const suggestedKeys = MusicTheory.getSuggestedKeysForMoodAndGenre(mood, genre);

    // Get suggested tempo range
    const tempoRange = MusicTheory.getSuggestedTempo(mood, genre);

    // Get suggested scales based on mood and genre
    const suggestedScales = MusicTheory.getSuggestedScalesForMoodAndGenre(mood, genre);

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
    if (!appState.songData.key || !appState.songData.scale) {
        UI.showMessage('Please select key and scale first', 'error');
        return;
    }

    const chordProgressions = MusicTheory.getChordProgressionsForKeyAndGenre(
        appState.songData.key,
        appState.songData.scale,
        appState.songData.genre, // Can be null/undefined
        appState.loadedData.chordProgressions
    );

    UI.renderChordProgressions(chordProgressions, 'chord-progressions');

    // Load strumming patterns
    loadStrummingPatterns();

    // Setup chord guide toggle
    setupChordGuideToggle();

    UI.showStep('step-chords');
}

// Load strumming patterns for the chord step
function loadStrummingPatterns() {
    try {
        if (!window.strummingPatterns || !window.strummingPatterns.patterns) {
            console.warn('Strumming patterns not loaded, showing placeholder');
            // Show placeholder message instead of breaking
            const grid = document.getElementById('strumming-patterns-grid');
            if (grid) {
                grid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: var(--spacing-lg);">Strumming patterns loading...</p>';
            }
            return;
        }

        const patterns = window.strummingPatterns.patterns;
        const suggestedPatterns = getStrummingPatternsForGenre(patterns, appState.songData.genre);

        renderStrummingPatternsGrid(suggestedPatterns);
        setupStrummingPatternFilters(patterns);
    } catch (error) {
        console.error('Error loading strumming patterns:', error);
        // Don't break the app - just show a message
        const grid = document.getElementById('strumming-patterns-grid');
        if (grid) {
            grid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: var(--spacing-lg);">Strumming patterns temporarily unavailable</p>';
        }
    }
}

// Get strumming patterns that match the selected genre
function getStrummingPatternsForGenre(patterns, genre) {
    const genreMappings = {
        'rock': ['Basic', 'Rock'],
        'pop': ['Basic', 'Folk/Pop'],
        'folk': ['Basic', 'Folk/Pop'],
        'country': ['Basic', 'Country', 'Folk/Pop'],
        'blues': ['Basic', 'Rock', 'Country'],
        'jazz': ['Jazz', 'Basic'],
        'reggae': ['Reggae/Ska'],
        'funk': ['Funk/R&B'],
        'latin': ['Latin'],
        'world': ['World'],
        'acoustic': ['Basic', 'Folk/Pop'],
        'electronic': ['Basic'],
        'classical': ['Specialty']
    };

    // If no genre is selected, show all patterns
    if (!genre) {
        return Object.entries(patterns);
    }

    const genreKey = (genre?.name || genre?.id || genre || '').toLowerCase();
    const relevantCategories = genreMappings[genreKey] || ['Basic', 'Folk/Pop'];

    return Object.entries(patterns).filter(([id, pattern]) =>
        relevantCategories.includes(pattern.category)
    );
}

// Render strumming patterns grid
function renderStrummingPatternsGrid(patternEntries) {
    const grid = document.getElementById('strumming-patterns-grid');
    if (!grid) return;

    const getStrokeSymbol = (stroke) => {
        switch (stroke) {
            case 'D': return '↓';
            case 'U': return '↑';
            case 'X': return '×';
            case '-': return '•';
            default: return stroke;
        }
    };

    grid.innerHTML = patternEntries.map(([id, pattern]) => `
        <div class="strumming-pattern-card" onclick="selectStrummingPattern('${id}')" data-pattern-id="${id}">
            <div class="pattern-card-header">
                <div class="pattern-card-name">${pattern.name}</div>
                <span class="pattern-card-difficulty ${pattern.difficulty.toLowerCase()}">${pattern.difficulty}</span>
            </div>
            <div class="pattern-card-preview">
                ${pattern.pattern.slice(0, 8).map(stroke => `
                    <div class="pattern-card-stroke ${stroke === '-' ? 'rest' : stroke.toLowerCase()}">${getStrokeSymbol(stroke)}</div>
                `).join('')}
            </div>
            <div class="pattern-card-meta">
                <span>${pattern.timeSignature}</span>
                <span>${pattern.bpm[0]}-${pattern.bpm[1]} BPM</span>
            </div>
        </div>
    `).join('');
}

// Setup strumming pattern filter functionality
function setupStrummingPatternFilters(patterns) {
    const categoryFilter = document.getElementById('strumming-category-filter');
    const difficultyFilter = document.getElementById('strumming-difficulty-filter');

    if (!categoryFilter || !difficultyFilter) return;

    const filterPatterns = () => {
        const category = categoryFilter.value;
        const difficulty = difficultyFilter.value;

        const filteredPatterns = Object.entries(patterns).filter(([id, pattern]) => {
            const categoryMatch = category === 'all' || pattern.category === category;
            const difficultyMatch = difficulty === 'all' || pattern.difficulty === difficulty;
            return categoryMatch && difficultyMatch;
        });

        renderStrummingPatternsGrid(filteredPatterns);
    };

    categoryFilter.addEventListener('change', filterPatterns);
    difficultyFilter.addEventListener('change', filterPatterns);
}

// Select a strumming pattern
window.selectStrummingPattern = function(patternId) {
    if (!window.strummingPatterns || !window.strummingPatterns.patterns) {
        console.warn('Strumming patterns not loaded');
        return;
    }

    const pattern = window.strummingPatterns.patterns[patternId];
    if (!pattern) return;

    // Update app state
    appState.songData.strummingPattern = pattern;

    // Update visual selection
    document.querySelectorAll('.strumming-pattern-card').forEach(card => {
        card.classList.remove('selected');
    });

    const selectedCard = document.querySelector(`[data-pattern-id="${patternId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    // Update pattern display
    displaySelectedStrummingPattern(pattern);

    // Check if we can proceed (both chord progression and strumming pattern selected)
    checkChordsStepCompletion();
}

// Display the selected strumming pattern details
function displaySelectedStrummingPattern(pattern) {
    const display = document.getElementById('strumming-pattern-display');
    if (!display) return;

    const getStrokeSymbol = (stroke) => {
        switch (stroke) {
            case 'D': return '↓';
            case 'U': return '↑';
            case 'X': return '×';
            case '-': return '•';
            default: return stroke;
        }
    };

    const convertTimingToCount = (timing, timeSignature) => {
        if (timeSignature === '3/4') {
            const countMap = {
                1: '1', 1.5: '&', 2: '2', 2.5: '&', 3: '3', 3.5: '&'
            };
            return countMap[timing] || timing.toString();
        } else if (timeSignature === '6/8') {
            const countMap = {
                1: '1', 1.5: '&', 2: '2', 2.5: '&', 3: '3', 3.5: '&',
                4: '4', 4.5: '&', 5: '5', 5.5: '&', 6: '6', 6.5: '&'
            };
            return countMap[timing] || timing.toString();
        } else {
            const countMap = {
                1: '1', 1.5: '&', 2: '2', 2.5: '&', 3: '3', 3.5: '&', 4: '4', 4.5: '&',
                1.25: '1e', 1.75: '1a', 2.25: '2e', 2.75: '2a',
                3.25: '3e', 3.75: '3a', 4.25: '4e', 4.75: '4a'
            };
            return countMap[timing] || timing.toString();
        }
    };

    display.innerHTML = `
        <div class="strumming-pattern-details">
            <div class="strumming-pattern-header">
                <div class="strumming-pattern-name">${pattern.name}</div>
                <div class="strumming-pattern-category">${pattern.category}</div>
            </div>
            <div class="strumming-pattern-visualization">
                <div class="strumming-pattern-beats">
                    ${pattern.timing.map((beat, index) => `
                        <div class="strumming-beat">
                            <div class="strumming-beat-count">${convertTimingToCount(beat, pattern.timeSignature)}</div>
                            <div class="strumming-beat-stroke ${pattern.pattern[index] === '-' ? 'rest' : pattern.pattern[index].toLowerCase()}">
                                ${getStrokeSymbol(pattern.pattern[index])}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <p style="color: var(--text-secondary); font-style: italic; margin-top: var(--spacing-sm);">
                ${pattern.description}
            </p>
        </div>
    `;

    display.classList.add('has-pattern');
}

// Setup chord guide toggle functionality
function setupChordGuideToggle() {
    const toggleButton = document.getElementById('toggle-chord-guide');
    const toggleText = document.getElementById('chord-guide-toggle-text');
    const chordDisplay = document.getElementById('chord-display');

    if (!toggleButton || !toggleText || !chordDisplay) return;

    // Default state is hidden (only hide the chord diagrams, not the whole chord-display)
    let isVisible = false;

    // Find or create the chord diagrams container within chord-display
    let chordDiagrams = chordDisplay.querySelector('.chord-diagrams');

    const updateVisibility = () => {
        if (chordDiagrams) {
            if (isVisible) {
                chordDiagrams.style.display = 'block';
                toggleText.textContent = '🙈 Hide Visual Chord Guide';
                toggleButton.style.background = 'var(--secondary-color)';
            } else {
                chordDiagrams.style.display = 'none';
                toggleText.textContent = '👁️ Show Visual Chord Guide';
                toggleButton.style.background = 'var(--primary-color)';
            }
        }
    };

    toggleButton.addEventListener('click', () => {
        isVisible = !isVisible;
        // Re-find chord diagrams in case chord display was updated
        chordDiagrams = chordDisplay.querySelector('.chord-diagrams');
        updateVisibility();
    });

    // Set initial state - hide chord diagrams by default
    updateVisibility();

    // Watch for changes in chord-display content and update accordingly
    const observer = new MutationObserver(() => {
        chordDiagrams = chordDisplay.querySelector('.chord-diagrams');
        updateVisibility();
    });

    observer.observe(chordDisplay, { childList: true, subtree: true });
}

// Check if the chords step is complete
function checkChordsStepCompletion() {
    const nextButtons = [
        document.getElementById('chords-next-top')
    ];

    // Chord progression is required, strumming pattern is optional (in case strumming patterns fail to load)
    const hasRequiredData = appState.songData.chordProgression;
    const hasStrummingPatterns = window.strummingPatterns && window.strummingPatterns.patterns;

    // If strumming patterns are available, require selection. Otherwise, just chord progression is enough.
    const isComplete = hasRequiredData && (!hasStrummingPatterns || appState.songData.strummingPattern);

    nextButtons.forEach(btn => {
        if (btn) {
            btn.disabled = !isComplete;
            if (isComplete) {
                btn.textContent = btn.textContent.replace('disabled', '');
            }
        }
    });

    if (isComplete) {
        UI.markStepComplete(3);
    }
}

// Load rhythm section step
async function loadRhythmStep() {
    if (!appState.songData.strummingPattern) {
        UI.showMessage('Please select a chord progression and strumming pattern first', 'error');
        return;
    }

    // Update rhythm context display
    updateRhythmContext();

    // Generate rhythm templates based on current song data
    const rhythmTemplates = generateRhythmTemplates();
    renderRhythmTemplates(rhythmTemplates);

    UI.showStep('step-rhythm');
}

// Generate rhythm templates based on current song context using enhanced rhythm engine
function generateRhythmTemplates() {
    const genre = appState.songData.genre;
    const strummingPattern = appState.songData.strummingPattern;
    const tempo = appState.songData.tempo;

    // Map genres to drum styles
    const genreToStyleMap = {
        'rock': 'rock',
        'pop': 'pop',
        'jazz': 'jazz',
        'blues': 'blues',
        'funk': 'funk',
        'disco': 'disco',
        'electronic': 'electronic',
        'edm': 'electronic',
        'hip hop': 'hiphop',
        'hiphop': 'hiphop',
        'reggae': 'reggae',
        'latin': 'latin'
    };

    const genreName = (genre?.name || genre?.id || '').toLowerCase();

    const templates = [
        {
            id: 'rock',
            name: 'Rock Beat',
            drumStyle: 'rock',
            bassStyle: 'root',
            compatibility: getCompatibilityRating(genre, strummingPattern, 'rock'),
            description: 'Classic rock beat with driving kick, snare, and hi-hats',
            genreMatch: ['rock', 'alternative', 'punk'],
            tempoRange: [80, 140],
            pattern: '🥁 x-x-x-x- | 🎸 Root Notes'
        },
        {
            id: 'pop',
            name: 'Pop Groove',
            drumStyle: 'pop',
            bassStyle: 'rootFifth',
            compatibility: getCompatibilityRating(genre, strummingPattern, 'pop'),
            description: 'Modern pop groove with syncopated kicks and claps',
            genreMatch: ['pop', 'indie', 'alternative'],
            tempoRange: [100, 130],
            pattern: '🥁 Syncopated | 🎸 Root-Fifth'
        },
        {
            id: 'disco',
            name: 'Disco Four-on-Floor',
            drumStyle: 'disco',
            bassStyle: 'disco',
            compatibility: getCompatibilityRating(genre, strummingPattern, 'electronic'),
            description: 'Four-on-the-floor kick with open hi-hats',
            genreMatch: ['disco', 'dance', 'electronic'],
            tempoRange: [110, 130],
            pattern: '🥁 Four-on-Floor | 🎸 Disco Bass'
        },
        {
            id: 'funk',
            name: 'Funk Groove',
            drumStyle: 'funk',
            bassStyle: 'funky',
            compatibility: getCompatibilityRating(genre, strummingPattern, 'funk'),
            description: 'Syncopated funk groove with 16th note hi-hats',
            genreMatch: ['funk', 'soul', 'r&b'],
            tempoRange: [95, 115],
            pattern: '🥁 Syncopated 16ths | 🎸 Funky Bass'
        },
        {
            id: 'hiphop',
            name: 'Hip Hop Beat',
            drumStyle: 'hiphop',
            bassStyle: 'root',
            compatibility: getCompatibilityRating(genre, strummingPattern, 'hiphop'),
            description: 'Hip hop beat with heavy kicks and snappy snares',
            genreMatch: ['hip hop', 'trap', 'urban'],
            tempoRange: [80, 100],
            pattern: '🥁 Boom Bap | 🎸 Sub Bass'
        },
        {
            id: 'reggae',
            name: 'Reggae Riddim',
            drumStyle: 'reggae',
            bassStyle: 'reggae',
            compatibility: getCompatibilityRating(genre, strummingPattern, 'reggae'),
            description: 'Laid-back reggae with offbeat kicks',
            genreMatch: ['reggae', 'ska', 'dub'],
            tempoRange: [70, 90],
            pattern: '🥁 One Drop | 🎸 Offbeat Bass'
        },
        {
            id: 'electronic',
            name: 'Electronic Dance',
            drumStyle: 'electronic',
            bassStyle: 'syncopated',
            compatibility: getCompatibilityRating(genre, strummingPattern, 'electronic'),
            description: 'High-energy electronic beat with fast hi-hats',
            genreMatch: ['electronic', 'edm', 'house', 'techno'],
            tempoRange: [120, 140],
            pattern: '🥁 4/4 Dance | 🎸 Synth Bass'
        },
        {
            id: 'jazz',
            name: 'Jazz Swing',
            drumStyle: 'jazz',
            bassStyle: 'walking',
            compatibility: getCompatibilityRating(genre, strummingPattern, 'jazz'),
            description: 'Swinging jazz rhythm with walking bass',
            genreMatch: ['jazz', 'swing', 'blues'],
            tempoRange: [100, 160],
            pattern: '🥁 Swing | 🎸 Walking Bass'
        },
        {
            id: 'latin',
            name: 'Latin Groove',
            drumStyle: 'latin',
            bassStyle: 'latin',
            compatibility: getCompatibilityRating(genre, strummingPattern, 'latin'),
            description: 'Energetic Latin rhythm with toms and syncopation',
            genreMatch: ['latin', 'salsa', 'bossa nova'],
            tempoRange: [100, 130],
            pattern: '🥁 Tumbao | 🎸 Latin Bass'
        },
        {
            id: 'blues',
            name: 'Blues Shuffle',
            drumStyle: 'blues',
            bassStyle: 'root',
            compatibility: getCompatibilityRating(genre, strummingPattern, 'blues'),
            description: 'Shuffling blues groove with laid-back feel',
            genreMatch: ['blues', 'rock', 'country'],
            tempoRange: [70, 110],
            pattern: '🥁 Shuffle | 🎸 Blues Bass'
        }
    ];

    // Sort by compatibility rating
    return templates.sort((a, b) => {
        const ratingOrder = { 'perfect': 3, 'good': 2, 'fair': 1 };
        return ratingOrder[b.compatibility] - ratingOrder[a.compatibility];
    });
}

// Get compatibility rating based on genre and context
function getCompatibilityRating(genre, strummingPattern, templateStyle) {
    const genreName = (genre?.name || genre?.id || genre || '').toLowerCase();
    const strummingCategory = strummingPattern?.category?.toLowerCase() || '';

    const compatibilityMatrix = {
        'rock': {
            genres: ['rock', 'alternative', 'metal', 'punk', 'grunge'],
            categories: ['rock', 'basic'],
            perfect: ['rock', 'alternative', 'punk', 'metal'],
            good: ['pop', 'indie', 'grunge'],
            fair: ['folk', 'country', 'jazz']
        },
        'pop': {
            genres: ['pop', 'indie', 'alternative', 'r&b'],
            categories: ['folk/pop', 'basic'],
            perfect: ['pop', 'indie'],
            good: ['alternative', 'r&b', 'electronic'],
            fair: ['rock', 'jazz', 'country']
        },
        'electronic': {
            genres: ['electronic', 'edm', 'house', 'techno', 'trance', 'dubstep', 'disco'],
            categories: ['basic', 'funk/r&b'],
            perfect: ['electronic', 'edm', 'house', 'techno', 'disco'],
            good: ['pop', 'trance', 'dubstep'],
            fair: ['rock', 'jazz', 'folk']
        },
        'funk': {
            genres: ['funk', 'soul', 'r&b', 'disco'],
            categories: ['funk/r&b', 'basic'],
            perfect: ['funk', 'soul', 'r&b'],
            good: ['disco', 'pop', 'jazz'],
            fair: ['rock', 'country', 'folk']
        },
        'hiphop': {
            genres: ['hip hop', 'hiphop', 'rap', 'trap', 'urban'],
            categories: ['basic', 'funk/r&b'],
            perfect: ['hip hop', 'hiphop', 'rap', 'trap'],
            good: ['urban', 'r&b', 'electronic'],
            fair: ['pop', 'rock', 'jazz']
        },
        'reggae': {
            genres: ['reggae', 'ska', 'dub'],
            categories: ['reggae/ska', 'world', 'basic'],
            perfect: ['reggae', 'ska', 'dub'],
            good: ['world', 'folk'],
            fair: ['rock', 'pop', 'jazz']
        },
        'jazz': {
            genres: ['jazz', 'swing', 'bebop', 'blues'],
            categories: ['jazz', 'basic'],
            perfect: ['jazz', 'swing', 'bebop'],
            good: ['blues', 'soul', 'funk'],
            fair: ['rock', 'pop', 'country']
        },
        'latin': {
            genres: ['latin', 'salsa', 'bossa nova', 'samba'],
            categories: ['latin', 'world', 'basic'],
            perfect: ['latin', 'salsa', 'bossa nova'],
            good: ['samba', 'world', 'jazz'],
            fair: ['pop', 'rock', 'funk']
        },
        'blues': {
            genres: ['blues', 'rock', 'country', 'jazz'],
            categories: ['basic', 'rock', 'country'],
            perfect: ['blues'],
            good: ['rock', 'country', 'jazz'],
            fair: ['pop', 'funk', 'folk']
        }
    };

    const matrix = compatibilityMatrix[templateStyle];
    if (!matrix) return 'fair';

    if (matrix.perfect.includes(genreName)) return 'perfect';
    if (matrix.good.includes(genreName)) return 'good';
    return 'fair';
}

// Update rhythm context display
function updateRhythmContext() {
    document.getElementById('rhythm-genre-display').textContent =
        appState.songData.genre?.name || 'Not set';
    document.getElementById('rhythm-time-display').textContent =
        appState.songData.strummingPattern?.timeSignature || 'Not set';
    document.getElementById('rhythm-tempo-display').textContent =
        `${appState.songData.tempo || 'Not set'} BPM`;
    document.getElementById('rhythm-strum-display').textContent =
        appState.songData.strummingPattern?.name || 'Not set';
}

// Create mini drum pattern visualization for template cards
function createMiniDrumPattern(drumStyle) {
    if (!window.rhythmEngine) return '';

    const drumPattern = window.rhythmEngine.getDrumPatterns(drumStyle);

    // Show only kick, snare, hihat for compact view
    const mainDrums = [
        { key: 'kick', icon: '🦶', color: '#ff6b6b' },
        { key: 'snare', icon: '👋', color: '#4ecdc4' },
        { key: 'hihat', icon: '🎩', color: '#ffd93d' }
    ];

    let html = '<div class="mini-drum-pattern">';

    mainDrums.forEach(drum => {
        const pattern = drumPattern[drum.key];
        if (!pattern) return;

        html += `<div class="mini-drum-row">`;
        html += `<span class="mini-drum-icon" style="color: ${drum.color};">${drum.icon}</span>`;

        // Show 8 steps (half measure) for compact view
        for (let i = 0; i < 8; i++) {
            const isActive = pattern[i] && (pattern[i] === 'x' || pattern[i] === 'X');
            html += `<span class="mini-step ${isActive ? 'active' : ''}" style="${isActive ? `background: ${drum.color};` : ''}"></span>`;
        }

        html += '</div>';
    });

    html += '</div>';
    return html;
}

// Render rhythm templates
function renderRhythmTemplates(templates) {
    const grid = document.getElementById('rhythm-templates-grid');
    if (!grid) return;

    grid.innerHTML = templates.map(template => {
        const miniPattern = createMiniDrumPattern(template.drumStyle);

        return `
        <div class="rhythm-template-card" onclick="selectRhythmTemplate('${template.id}', '${template.drumStyle}', '${template.bassStyle}')" data-template-id="${template.id}">
            <div class="template-header">
                <div class="template-name">${template.name}</div>
                <span class="template-compatibility ${template.compatibility}">${template.compatibility}</span>
            </div>
            <div class="template-pattern-preview">
                ${miniPattern}
            </div>
            <div class="template-components">
                <div class="template-component">
                    <div class="component-label">Drum Style</div>
                    <div class="component-name">${template.drumStyle.charAt(0).toUpperCase() + template.drumStyle.slice(1)}</div>
                </div>
                <div class="template-component">
                    <div class="component-label">Bass Style</div>
                    <div class="component-name">${formatBassStyle(template.bassStyle)}</div>
                </div>
            </div>
            <div class="template-actions">
                <button class="preview-btn" onclick="event.stopPropagation(); previewRhythmTemplate('${template.drumStyle}')">
                    🔊 Preview Drums
                </button>
            </div>
            <div class="template-description">${template.description}</div>
        </div>`;
    }).join('');
}

// Format bass style name for display
function formatBassStyle(style) {
    const styleNames = {
        'root': 'Root Notes',
        'rootFifth': 'Root-Fifth',
        'walking': 'Walking Bass',
        'arpeggio': 'Arpeggio',
        'octaves': 'Octaves',
        'funky': 'Funky 16ths',
        'disco': 'Disco Groove',
        'reggae': 'Offbeat',
        'latin': 'Tumbao',
        'syncopated': 'Syncopated'
    };
    return styleNames[style] || style;
}

// Preview rhythm template
window.previewRhythmTemplate = async function(drumStyle) {
    if (!window.rhythmEngine) {
        console.error('Rhythm engine not available');
        return;
    }

    const tempo = appState.songData.tempo || 120;
    await window.rhythmEngine.previewDrumPattern(drumStyle, tempo);
}

// Select rhythm template
window.selectRhythmTemplate = async function(templateId, drumStyle, bassStyle) {
    const templates = generateRhythmTemplates();
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    // Update app state with enhanced rhythm data
    appState.songData.rhythmTemplate = {
        ...template,
        drumStyle: drumStyle,
        bassStyle: bassStyle
    };
    appState.songData.drumPattern = {
        name: template.name,
        style: drumStyle
    };
    appState.songData.bassLine = {
        style: bassStyle,
        notes: [] // Will be generated when playing
    };

    // Update visual selection
    document.querySelectorAll('.rhythm-template-card').forEach(card => {
        card.classList.remove('selected');
    });

    const selectedCard = document.querySelector(`[data-template-id="${templateId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }

    // Update rhythm preview with full playback
    await displayEnhancedRhythmPreview(template, drumStyle, bassStyle);

    // Check completion
    checkRhythmStepCompletion();
}

// Create visual drum pattern grid (like a drum machine)
function createDrumPatternGrid(drumStyle) {
    if (!window.rhythmEngine) return '<p>Loading drum patterns...</p>';

    const drumPattern = window.rhythmEngine.getDrumPatterns(drumStyle);

    // Define drum instruments with icons and colors
    const drums = [
        { key: 'kick', name: 'Kick', icon: '🦶', color: '#ff6b6b' },
        { key: 'snare', name: 'Snare', icon: '👋', color: '#4ecdc4' },
        { key: 'hihat', name: 'Hi-Hat', icon: '🎩', color: '#ffd93d' },
        { key: 'openHihat', name: 'Open HH', icon: '💫', color: '#a8dadc' },
        { key: 'clap', name: 'Clap', icon: '👏', color: '#f1faee' },
        { key: 'tom', name: 'Tom', icon: '🥁', color: '#e76f51' }
    ];

    // Filter to only drums that exist in this pattern
    const activeDrums = drums.filter(drum => drumPattern[drum.key] && drumPattern[drum.key] !== '');

    if (activeDrums.length === 0) {
        return '<p>No drum pattern available</p>';
    }

    // Create 16-step grid (one measure in 16th notes)
    const steps = 16;
    const beatsPerMeasure = 4;

    let gridHTML = '<div class="drum-grid-container">';

    // Add beat markers (1, 2, 3, 4)
    gridHTML += '<div class="drum-grid-header">';
    gridHTML += '<div class="drum-name-header"></div>'; // Empty corner
    for (let beat = 0; beat < beatsPerMeasure; beat++) {
        gridHTML += `<div class="beat-marker" style="grid-column: span 4;">${beat + 1}</div>`;
    }
    gridHTML += '</div>';

    // Add each drum row
    activeDrums.forEach(drum => {
        const pattern = drumPattern[drum.key];
        gridHTML += '<div class="drum-row">';

        // Drum name/icon
        gridHTML += `<div class="drum-name" style="color: ${drum.color};">
            <span class="drum-icon">${drum.icon}</span>
            <span class="drum-label">${drum.name}</span>
        </div>`;

        // 16 steps
        for (let step = 0; step < steps; step++) {
            const isActive = pattern[step] && (pattern[step] === 'x' || pattern[step] === 'X');
            const isDownbeat = step % 4 === 0;
            const stepClass = isActive ? 'step active' : 'step';
            const downbeatClass = isDownbeat ? ' downbeat' : '';

            gridHTML += `<div class="${stepClass}${downbeatClass}" style="${isActive ? `background-color: ${drum.color};` : ''}" title="${drum.name} - Step ${step + 1}">
                ${isActive ? '●' : ''}
            </div>`;
        }

        gridHTML += '</div>';
    });

    gridHTML += '</div>';

    // Add legend
    gridHTML += '<div class="drum-legend">';
    gridHTML += '<small><strong>Legend:</strong> ● = Hit | Numbers = Beats (1-4) | Each box = 16th note</small>';
    gridHTML += '</div>';

    return gridHTML;
}

// Display enhanced rhythm preview with actual playback
async function displayEnhancedRhythmPreview(template, drumStyle, bassStyle) {
    const previewDisplay = document.getElementById('rhythm-preview-display');
    if (!previewDisplay) return;

    const chords = appState.songData.chordProgression?.chords || ['C', 'Am', 'F', 'G'];
    const key = appState.songData.key || 'C';
    const tempo = appState.songData.tempo || 120;

    // Generate bass notes to display
    let bassNotes = [];
    if (window.rhythmEngine) {
        bassNotes = window.rhythmEngine.generateBassLine(chords, key, bassStyle);
    }

    // Create visual representation of bass notes
    const bassNotesDisplay = bassNotes.length > 0 ?
        bassNotes.map((note, i) => {
            const chordIndex = Math.floor(i / (bassNotes.length / chords.length));
            const chordLabel = chords[chordIndex] || chords[chords.length - 1];
            return `<span class="bass-note" title="Note ${i + 1} - For ${chordLabel}">${note}</span>`;
        }).join(' ') :
        'Bass notes will be generated...';

    // Calculate note distribution
    const notesPerChord = (bassNotes.length / chords.length).toFixed(1);
    const bassStyleInfo = {
        'root': 'Simple root notes (1 per chord)',
        'rootFifth': 'Root and fifth alternating (2 per chord)',
        'walking': 'Walking bass with chromatic approaches (3-4 per chord)',
        'arpeggio': 'Full chord arpeggios (4 per chord)',
        'octaves': 'Root notes in octaves (2 per chord)'
    };
    const styleDescription = bassStyleInfo[bassStyle] || `${notesPerChord} notes per chord`;

    // Create drum grid visualization
    const drumGridHTML = createDrumPatternGrid(drumStyle);

    previewDisplay.innerHTML = `
        <div class="rhythm-preview-content">
            <h4>${template.name}</h4>
            <p class="preview-description">${template.description}</p>

            <div class="rhythm-details">
                <div class="detail-item">
                    <span class="detail-label">Drum Style:</span>
                    <span class="detail-value">${drumStyle.charAt(0).toUpperCase() + drumStyle.slice(1)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Bass Style:</span>
                    <span class="detail-value">${formatBassStyle(bassStyle)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Tempo:</span>
                    <span class="detail-value">${tempo} BPM</span>
                </div>
            </div>

            <div class="rhythm-pattern-visual">
                <div class="pattern-section">
                    <h5>🥁 Drum Pattern (One Measure)</h5>
                    ${drumGridHTML}
                </div>
                <div class="pattern-section">
                    <h5>🎸 Bass Line (${bassNotes.length} notes across ${chords.length} chords)</h5>
                    <div class="bass-style-info">
                        <small>${styleDescription}</small>
                    </div>
                    <div class="bass-notes-display">
                        ${bassNotesDisplay}
                    </div>
                    <div class="bass-chord-mapping">
                        <small style="margin-right: 0.5rem; color: var(--text-secondary);">Chord progression:</small>
                        ${chords.map((chord, i) => `<span class="chord-label">${chord}</span>`).join(' → ')}
                    </div>
                </div>
            </div>

            <div class="rhythm-controls">
                <button class="play-rhythm-btn" onclick="playCurrentRhythm()">
                    ▶️ Play Full Rhythm (Drums + Bass)
                </button>
                <button class="stop-rhythm-btn" onclick="stopCurrentRhythm()">
                    ⏹️ Stop
                </button>
            </div>

            <div class="rhythm-tips">
                <p><strong>💡 Tip:</strong> This rhythm will work great with your ${chords.join(' → ')} progression!</p>
                <p><strong>🎸 Bass Pattern:</strong> All ${bassNotes.length} bass notes will play in sequence (${notesPerChord} notes per chord average)</p>
                <p><strong>🥁 Drum Pattern:</strong> ${drumStyle.charAt(0).toUpperCase() + drumStyle.slice(1)} beat at ${tempo} BPM (16th note resolution)</p>
            </div>
        </div>
    `;
}

// Display rhythm preview
function displayRhythmPreview(template) {
    const display = document.getElementById('rhythm-preview-display');
    if (!display) return;

    const strummingPattern = appState.songData.strummingPattern;
    if (!strummingPattern) return;

    // Generate bass line for preview
    const previewBassLine = generateBassLine(appState.songData.chordProgression, template.bassStyle);

    display.innerHTML = `
        <div class="rhythm-visualization">
            <h4>${template.name} - Rhythm Timeline</h4>
            <div class="rhythm-timeline">
                ${generateRhythmTimeline(strummingPattern, template, previewBassLine)}
            </div>
            <div style="margin-top: var(--spacing-md); color: var(--text-secondary);">
                <p><strong>Compatibility:</strong> ${template.compatibility} match for ${appState.songData.genre?.name}</p>
                <p><strong>Description:</strong> ${template.description}</p>
                <p><strong>Bass Notes:</strong> ${previewBassLine.map(note => note.note).join(' → ')}</p>
            </div>
        </div>
    `;

    display.classList.add('has-content');
}

// Generate rhythm timeline visualization
function generateRhythmTimeline(strummingPattern, template, bassLine = null) {
    const beats = ['1', '&', '2', '&', '3', '&', '4', '&'];

    const getStrumSymbol = (stroke) => {
        switch (stroke) {
            case 'D': return '↓';
            case 'U': return '↑';
            case 'X': return '×';
            case '-': return '•';
            default: return '•';
        }
    };

    const strumRow = beats.map((beat, index) => {
        const stroke = strummingPattern.pattern[index] || '-';
        const symbol = getStrumSymbol(stroke);
        const className = stroke === '-' ? '' : 'strum-active';
        return `<div class="timeline-beat ${className}">${symbol}</div>`;
    }).join('');

    const kickRow = beats.map((beat, index) => {
        let hasKick = false;

        if (template && template.drumPattern) {
            switch (template.drumPattern) {
                case 'Acoustic Kit':
                    hasKick = (index === 0 || index === 4); // Simple 1 and 3
                    break;
                case 'Rock Kit':
                    hasKick = (index === 0 || index === 2 || index === 4 || index === 6); // All beats
                    break;
                case 'Brushed Kit':
                    hasKick = (index === 0 || index === 4); // Gentle 1 and 3
                    break;
                case 'Electronic Kit':
                    hasKick = (index === 0 || index === 3 || index === 4 || index === 7); // Syncopated
                    break;
                case 'Light Kit':
                    hasKick = (index === 0); // Just on 1
                    break;
                default:
                    hasKick = (index === 0 || index === 4); // Default
            }
        } else {
            hasKick = (index === 0 || index === 4); // Default
        }

        const className = hasKick ? 'active' : '';
        const symbol = hasKick ? '●' : '•';
        return `<div class="timeline-beat ${className}">${symbol}</div>`;
    }).join('');

    const snareRow = beats.map((beat, index) => {
        let hasSnare = false;

        if (template && template.drumPattern) {
            switch (template.drumPattern) {
                case 'Acoustic Kit':
                    hasSnare = (index === 2 || index === 6); // 2 and 4
                    break;
                case 'Rock Kit':
                    hasSnare = (index === 2 || index === 6); // Strong 2 and 4
                    break;
                case 'Brushed Kit':
                    hasSnare = (index === 2 || index === 6); // Subtle 2 and 4
                    break;
                case 'Electronic Kit':
                    hasSnare = (index === 2 || index === 5 || index === 6); // Electronic pattern
                    break;
                case 'Light Kit':
                    hasSnare = (index === 2); // Just on 2
                    break;
                default:
                    hasSnare = (index === 2 || index === 6); // Default
            }
        } else {
            hasSnare = (index === 2 || index === 6); // Default
        }

        const className = hasSnare ? 'secondary' : '';
        const symbol = hasSnare ? '◆' : '•';
        return `<div class="timeline-beat ${className}">${symbol}</div>`;
    }).join('');

    const hihatRow = beats.map((beat, index) => {
        let hasHihat = false;

        if (template && template.drumPattern) {
            switch (template.drumPattern) {
                case 'Acoustic Kit':
                    hasHihat = (index % 2 === 0); // On beats (1, 2, 3, 4)
                    break;
                case 'Rock Kit':
                    hasHihat = true; // Eighth notes on all beats
                    break;
                case 'Brushed Kit':
                    hasHihat = (index % 2 === 0); // Gentle on beats
                    break;
                case 'Electronic Kit':
                    hasHihat = (index % 2 === 1); // Off-beats (syncopated)
                    break;
                case 'Light Kit':
                    hasHihat = (index === 0 || index === 4); // Minimal - just 1 and 3
                    break;
                default:
                    hasHihat = (index % 2 === 0); // Default on beats
            }
        } else {
            hasHihat = (index % 2 === 0); // Default on beats
        }

        const className = hasHihat ? 'tertiary' : '';
        const symbol = hasHihat ? '◇' : '•';
        return `<div class="timeline-beat ${className}">${symbol}</div>`;
    }).join('');

    const bassRow = beats.map((beat, index) => {
        // Use passed bassLine parameter or fall back to app state
        const activeBassLine = bassLine || appState.songData.bassLine?.notes;
        let className = '';
        let symbol = '•';

        // Determine if this beat should have bass based on the bass style
        const beatIndex = index; // 0,1,2,3,4,5,6,7 for 1,&,2,&,3,&,4,&
        let hasBass = false;

        if (template && template.bassStyle) {
            switch (template.bassStyle) {
                case 'Root Notes':
                    hasBass = (index === 0 || index === 2 || index === 4 || index === 6); // On beats
                    break;
                case 'Power Bass':
                    hasBass = (index === 0 || index === 2 || index === 4 || index === 6); // Strong on beats
                    break;
                case 'Walking Bass':
                    hasBass = (index % 2 === 0); // On every beat and off-beat
                    break;
                case 'Synth Bass':
                    hasBass = (index === 0 || index === 1 || index === 4 || index === 5); // Syncopated
                    break;
                case 'Melodic Bass':
                    hasBass = (index === 0 || index === 3 || index === 4 || index === 7); // Varied pattern
                    break;
                default:
                    hasBass = (index === 0 || index === 2 || index === 4 || index === 6); // Default on beats
            }
        } else {
            hasBass = (index === 0 || index === 2 || index === 4 || index === 6); // Default on beats
        }

        if (hasBass) {
            className = 'bass-active';

            // Try to show actual bass notes if available
            if (activeBassLine && activeBassLine.length > 0) {
                if (template?.bassStyle === 'Walking Bass') {
                    // For walking bass, show notes more frequently
                    const noteIndex = Math.floor(index / 2); // Each chord spans 2 beats
                    const bassNote = activeBassLine[noteIndex % activeBassLine.length];
                    symbol = bassNote ? bassNote.note[0] : '■';
                } else {
                    // For other styles, show root notes on main beats
                    const chordIndex = Math.floor(index / 2);
                    const bassNote = activeBassLine[chordIndex % activeBassLine.length];
                    symbol = bassNote ? bassNote.note[0] : '■';
                }
            } else {
                symbol = '■';
            }
        }

        return `<div class="timeline-beat ${className}">${symbol}</div>`;
    }).join('');

    return `
        <div class="timeline-row">
            <div class="timeline-label">Beat:</div>
            <div class="timeline-beats">${beats.map(b => `<div class="timeline-beat">${b}</div>`).join('')}</div>
        </div>
        <div class="timeline-row">
            <div class="timeline-label">Strum:</div>
            <div class="timeline-beats">${strumRow}</div>
        </div>
        <div class="timeline-row">
            <div class="timeline-label">Kick:</div>
            <div class="timeline-beats">${kickRow}</div>
        </div>
        <div class="timeline-row">
            <div class="timeline-label">Snare:</div>
            <div class="timeline-beats">${snareRow}</div>
        </div>
        <div class="timeline-row">
            <div class="timeline-label">Hi-hat:</div>
            <div class="timeline-beats">${hihatRow}</div>
        </div>
        <div class="timeline-row">
            <div class="timeline-label">Bass:</div>
            <div class="timeline-beats">${bassRow}</div>
        </div>
    `;
}

// Generate bass line based on chord progression and bass style
function generateBassLine(chordProgression, bassStyle) {
    if (!chordProgression || !chordProgression.chords) {
        return [];
    }

    const chords = chordProgression.chords;

    switch (bassStyle) {
        case 'Root Notes':
            return chords.map(chord => ({
                note: chord.split('/')[0], // Get root note (handle slash chords)
                duration: 'whole',
                timing: 'downbeat'
            }));

        case 'Power Bass':
            return chords.map(chord => ({
                note: chord.split('/')[0],
                duration: 'quarter',
                timing: 'driving',
                style: 'punchy'
            }));

        case 'Walking Bass':
            // Create walking bass line with connecting notes
            const walkingNotes = [];
            chords.forEach((chord, index) => {
                const root = chord.split('/')[0];
                walkingNotes.push({
                    note: root,
                    duration: 'quarter',
                    timing: 'downbeat'
                });

                // Add walking notes between chords
                if (index < chords.length - 1) {
                    walkingNotes.push({
                        note: getConnectingNote(chord, chords[index + 1]),
                        duration: 'quarter',
                        timing: 'walkup'
                    });
                }
            });
            return walkingNotes;

        case 'Synth Bass':
            return chords.map(chord => ({
                note: chord.split('/')[0],
                duration: 'eighth',
                timing: 'syncopated',
                style: 'electronic'
            }));

        case 'Melodic Bass':
            return chords.map(chord => ({
                note: chord.split('/')[0],
                duration: 'varied',
                timing: 'melodic',
                style: 'expressive'
            }));

        default:
            return chords.map(chord => ({
                note: chord.split('/')[0],
                duration: 'whole',
                timing: 'basic'
            }));
    }
}

// Get connecting note for walking bass
function getConnectingNote(currentChord, nextChord) {
    // Simplified - in a real app you'd use music theory
    const connectingNotes = {
        'C': 'B', 'G': 'F#', 'Am': 'G#', 'F': 'E',
        'D': 'C#', 'Em': 'D#', 'A': 'G#', 'E': 'D#'
    };

    return connectingNotes[currentChord] || currentChord.split('/')[0];
}

// Play current rhythm with rhythm engine
window.playCurrentRhythm = async function() {
    if (!window.rhythmEngine) {
        console.error('Rhythm engine not initialized');
        return;
    }

    const chords = appState.songData.chordProgression?.chords || ['C', 'Am', 'F', 'G'];
    const key = appState.songData.key || 'C';
    const tempo = appState.songData.tempo || 120;
    const rhythmTemplate = appState.songData.rhythmTemplate;

    if (!rhythmTemplate) {
        console.warn('No rhythm template selected');
        return;
    }

    const drumStyle = rhythmTemplate.drumStyle || 'rock';
    const bassStyle = rhythmTemplate.bassStyle || 'root';

    try {
        await window.rhythmEngine.playRhythmSection(chords, key, tempo, drumStyle, bassStyle);
        console.log('Playing rhythm:', drumStyle, bassStyle, tempo);
    } catch (error) {
        console.error('Error playing rhythm:', error);
    }
}

// Stop current rhythm
window.stopCurrentRhythm = function() {
    if (window.rhythmEngine) {
        window.rhythmEngine.stop();
    }
}

// Check rhythm step completion
function checkRhythmStepCompletion() {
    const nextButtons = [
        document.getElementById('rhythm-next-top')
    ];

    const isComplete = appState.songData.rhythmTemplate;

    nextButtons.forEach(btn => {
        if (btn) {
            btn.disabled = !isComplete;
        }
    });

    if (isComplete) {
        UI.markStepComplete(4);
    }
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

// Generate random chord progression
function getRandomChordProgression() {
    const keys = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm'];
    const progressions = [
        { name: 'Pop Magic', chords: ['I', 'V', 'vi', 'IV'] },
        { name: 'Four Chords', chords: ['vi', 'IV', 'I', 'V'] },
        { name: 'Canon', chords: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V'] },
        { name: 'Blues', chords: ['I', 'I', 'I', 'I', 'IV', 'IV', 'I', 'I', 'V', 'IV', 'I', 'V'] },
        { name: 'Royal Road', chords: ['IV', 'V', 'iii', 'vi'] },
        { name: 'Sensitive', chords: ['vi', 'IV', 'V', 'I'] },
        { name: '50s Progression', chords: ['I', 'vi', 'IV', 'V'] },
        { name: 'Circle', chords: ['vi', 'ii', 'V', 'I'] },
        { name: 'Andalusian', chords: ['i', 'VII', 'VI', 'V'] },
        { name: 'Jazz Turnaround', chords: ['I', 'VI', 'ii', 'V'] }
    ];

    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomProg = progressions[Math.floor(Math.random() * progressions.length)];
    const isMinor = randomKey.includes('m');
    const cleanKey = randomKey.replace('m', '');
    const scale = isMinor ? 'minor' : 'major';

    // Convert Roman numerals to actual chords
    const actualChords = randomProg.chords.map(numeral => {
        if (window.MusicTheory && window.MusicTheory.convertNumeralsToChords) {
            const converted = window.MusicTheory.convertNumeralsToChords([numeral], cleanKey, scale);
            return converted[0] || 'C';
        }
        return 'C'; // Fallback
    });

    return {
        key: cleanKey,
        scale: scale,
        progression: {
            name: randomProg.name,
            chords: actualChords
        }
    };
}

// Load songcraft step
async function loadSongcraftStep() {
    // Don't require chord progression - user can enter manually
    // Generate random defaults if missing
    if (!appState.songData.chordProgression) {
        const random = getRandomChordProgression();
        appState.songData.key = random.key;
        appState.songData.scale = random.scale;
        appState.songData.chordProgression = random.progression;
        console.log('Generated random progression:', random);
    }

    // Set fallback key/scale if still missing
    if (!appState.songData.key) appState.songData.key = 'C';
    if (!appState.songData.scale) appState.songData.scale = 'major';

    // Show the step first so DOM elements are visible
    UI.showStep('step-songcraft');

    // Then initialize songcraft workspace (needs visible DOM)
    UI.initializeSongcraftWorkspace(appState.songData);

    // Enable the next button since songcraft is optional
    UI.enableButton('songcraft-next-top');
}

// Load export step
async function loadExportStep() {
    // Collect song sections data from songcraft workspace
    const songSections = document.querySelectorAll('.song-section');
    appState.songData.songSections = Array.from(songSections).map(section => {
        const sectionTypeSelect = section.querySelector('.section-type');
        const chordInput = section.querySelector('.chord-progression-input');
        const lyricsInput = section.querySelector('.lyrics-input');

        // Note: Section melody generation has been removed to keep the interface focused
        // Melody work should be done in the dedicated Melody step
        let sectionMelody = null;

        // Legacy code: Check if this section has a generated melody (from old saves)
        const melodyDisplay = section.querySelector('.section-melody-display');
        if (melodyDisplay && melodyDisplay.style.display !== 'none') {
            // Extract melody information from the display
            const melodyHeader = melodyDisplay.querySelector('.melody-header h5');
            const melodyNotes = Array.from(melodyDisplay.querySelectorAll('.melody-note')).map(note => {
                // Get just the direct text content of the note span, excluding child elements
                let noteText = '';
                for (let child of note.childNodes) {
                    if (child.nodeType === Node.TEXT_NODE) {
                        noteText += child.textContent;
                    }
                }

                // Clean the text
                const cleanText = noteText.replace(/\s+/g, '').replace(/●/g, '').trim();

                // Extract note name and octave using regex
                const noteMatch = cleanText.match(/^([A-G][#b]?)(\d)/);
                let noteName = 'C';
                let octave = '5';

                if (noteMatch) {
                    noteName = noteMatch[1];
                    octave = noteMatch[2];
                } else {
                    // Fallback: try to extract just the note
                    const noteOnlyMatch = cleanText.match(/^([A-G][#b]?)/);
                    if (noteOnlyMatch) {
                        noteName = noteOnlyMatch[1];
                        octave = '5'; // default octave
                    }

                    console.warn('Could not parse melody note:', cleanText, 'from element:', note.outerHTML);
                }

                return {
                    note: noteName,
                    octave: octave,
                    chord: note.querySelector('small')?.textContent || '',
                    isChordTone: note.classList.contains('chord-tone'),
                    isStrongBeat: note.classList.contains('strong-beat'),
                    isDownbeat: note.classList.contains('downbeat')
                };
            });

            if (melodyNotes.length > 0) {
                // Clean up the melody name - remove emoji and extra text
                let melodyName = melodyHeader?.textContent || 'Section Melody';
                melodyName = melodyName.replace(/^🎵\s*/, '').replace(/^Generated Melody - /, '').trim();

                sectionMelody = {
                    name: melodyName,
                    notes: melodyNotes,
                    noteNames: melodyNotes.map(n => `${n.note}${n.octave}`)
                };
            }
        }

        return {
            type: sectionTypeSelect?.value || 'Verse',
            chords: chordInput?.value || '',
            lyrics: lyricsInput?.value || '',
            melody: sectionMelody
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
    const exportChordChartBtn = document.getElementById('export-chord-chart');
    const startOverBtn = document.getElementById('start-over');

    if (exportTextBtn) {
        exportTextBtn.addEventListener('click', exportAsText);
    }

    if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', exportAsJSON);
    }

    if (exportChordChartBtn) {
        exportChordChartBtn.addEventListener('click', exportChordChart);
    }
    
    if (startOverBtn) {
        startOverBtn.addEventListener('click', startOver);
    }
}

function setupNavigationListeners() {
    // Next buttons (top only)
    const nextButtons = {
        'mood-next-top': () => loadKeyTempoStep(),
        'key-tempo-next-top': () => loadChordsStep(),
        'chords-next-top': () => loadRhythmStep(),
        'rhythm-next-top': () => loadMelodyStep(),
        'melody-next-top': () => loadSongcraftStep(),
        'songcraft-next-top': () => loadExportStep()
    };
    
    Object.entries(nextButtons).forEach(([buttonId, handler]) => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', handler);
        }
    });
    
    // Back buttons (top only)
    const backButtons = {
        'key-tempo-back-top': () => loadMoodStep(),
        'chords-back-top': () => loadKeyTempoStep(),
        'rhythm-back-top': () => loadChordsStep(),
        'melody-back-top': () => loadRhythmStep(),
        'songcraft-back-top': () => loadMelodyStep()
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
        4: () => loadRhythmStep(),
        5: () => loadMelodyStep(),
        6: () => loadSongcraftStep(),
        7: () => loadExportStep()
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
            checkChordsStepCompletion();
            break;
            
        case 'drum-pattern':
            const patternId = element.dataset.patternId;
            const patterns = MusicTheory.getDrumPatternsForGenre(
                appState.songData.genre,
                appState.loadedData.drumPatterns
            );
            appState.songData.drumPattern = patterns.find(p => p.id === patternId);
            // Drum pattern selection triggers rhythm step completion check
            checkRhythmStepCompletion();
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
            UI.enableButton('melody-next-top');
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
    // Only mood is required; genre is optional
    if (appState.songData.mood) {
        UI.enableButton('mood-next-top');
    }
}

function checkKeyTempoComplete() {
    if (appState.songData.key && appState.songData.scale && appState.songData.tempo) {
        UI.enableButton('key-tempo-next-top');
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

// Export chord chart
function exportChordChart() {
    if (!appState.songData.songSections || appState.songData.songSections.length === 0) {
        UI.showMessage('No song sections found. Please complete the Lyrics & Structure step first.', 'warning');
        return;
    }

    let chordChartContent = `🎸 CHORD CHART: ${appState.songData.title} 🎸\n`;
    chordChartContent += `═══════════════════════════════════\n\n`;
    chordChartContent += `Key: ${appState.songData.key || 'Not set'}\n`;
    chordChartContent += `Tempo: ${appState.songData.tempo || 'Not set'} BPM\n`;
    chordChartContent += `Time Signature: ${appState.songData.strummingPattern?.timeSignature || '4/4'}\n\n`;

    appState.songData.songSections.forEach((section, index) => {
        chordChartContent += `[${section.type.toUpperCase()}]\n`;
        if (section.chords && section.chords.trim()) {
            // Format chord progression with bars
            const chords = section.chords.split(/\s+/).filter(c => c.trim());
            const chordsPerLine = 4;
            for (let i = 0; i < chords.length; i += chordsPerLine) {
                const lineChords = chords.slice(i, i + chordsPerLine);
                chordChartContent += `| ${lineChords.join(' | ')} |\n`;
            }
        } else {
            chordChartContent += `| (No chords specified) |\n`;
        }
        chordChartContent += `\n`;
    });

    if (appState.songData.strummingPattern) {
        chordChartContent += `═══ STRUMMING PATTERN ═══\n`;
        chordChartContent += `${appState.songData.strummingPattern.name}\n`;
        const strokeSymbols = appState.songData.strummingPattern.pattern.map(stroke => {
            switch (stroke) {
                case 'D': return '↓';
                case 'U': return '↑';
                case 'X': return '×';
                case '-': return '•';
                default: return stroke;
            }
        });
        chordChartContent += `${strokeSymbols.join(' ')}\n\n`;
    }

    chordChartContent += `Generated with Music Machine\n`;

    const filename = `${appState.songData.title.replace(/[^a-zA-Z0-9]/g, '_')}_chord_chart.txt`;
    UI.downloadFile(chordChartContent, filename, 'text/plain');
    UI.showMessage('Chord chart exported successfully', 'success');
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






// Check library status (for debugging)
function checkLibraries() {
    console.log('Library Status:');
    console.log('- Tonal.js:', !!window.Tonal ? '✅ Loaded' : '❌ Not loaded');

}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize the main app immediately
    initializeApp();

    // Setup progress bar navigation
    setupProgressBarNavigation();

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

// Setup progress bar navigation - allow clicking steps to jump
function setupProgressBarNavigation() {
    const progressSteps = document.querySelectorAll('.progress-step');

    // Map step numbers to step IDs
    const stepMap = {
        1: 'step-mood',
        2: 'step-key-tempo',
        3: 'step-chords',
        4: 'step-rhythm',
        5: 'step-melody',
        6: 'step-songcraft',
        7: 'step-export'
    };

    progressSteps.forEach((step, index) => {
        const stepNumber = parseInt(step.dataset.step);
        const stepId = stepMap[stepNumber];

        step.addEventListener('click', () => {
            console.log('Progress step clicked:', stepNumber, stepId);
            jumpToStep(stepId, stepNumber);
        });

        // Add tooltip
        step.title = 'Click to jump to this step';
    });

    console.log('Progress bar navigation setup complete');
}

// Jump to a specific step (with skip validation flag)
async function jumpToStep(stepId, stepNumber) {
    console.log(`Jumping to step ${stepNumber}: ${stepId}`);

    // Update app state
    appState.currentStep = stepId;

    // Load the appropriate step
    switch(stepId) {
        case 'step-mood':
            await loadMoodStep();
            break;
        case 'step-key-tempo':
            await loadKeyTempoStepDirect();
            break;
        case 'step-chords':
            await loadChordsStepDirect();
            break;
        case 'step-rhythm':
            await loadRhythmStepDirect();
            break;
        case 'step-melody':
            await loadMelodyStepDirect();
            break;
        case 'step-songcraft':
            // Songcraft is lyrics/structure - show it and initialize
            // Generate random defaults if missing
            if (!appState.songData.chordProgression) {
                const random = getRandomChordProgression();
                appState.songData.key = random.key;
                appState.songData.scale = random.scale;
                appState.songData.chordProgression = random.progression;
                console.log('Generated random progression for direct navigation:', random);
            }

            // Set fallback key/scale if still missing
            if (!appState.songData.key) appState.songData.key = 'C';
            if (!appState.songData.scale) appState.songData.scale = 'major';

            UI.showStep('step-songcraft');
            UI.updateProgressBar('step-songcraft');
            // Initialize the workspace when jumping to this step
            UI.initializeSongcraftWorkspace(appState.songData);
            break;
        case 'step-export':
            await loadExportStep();
            break;
        default:
            console.error('Unknown step:', stepId);
    }

    // Update progress bar
    UI.updateProgressBar(stepId);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Direct jump versions of step loaders (skip validation, show all options)
async function loadKeyTempoStepDirect() {
    // Get all keys as an array
    const allKeysObj = MusicTheory.getAllKeys();
    const allKeysArray = allKeysObj.all; // Use the 'all' property which is an array

    // If no mood/genre selected, show all options
    const mood = appState.songData.mood || { suggestedKeys: allKeysArray, tempoRange: [60, 180] };
    const genre = appState.songData.genre || { typicalTempo: [120, 120] };

    // Get suggested keys (or all keys if no mood)
    const suggestedKeys = appState.songData.mood && appState.songData.genre
        ? MusicTheory.getSuggestedKeysForMoodAndGenre(mood, genre)
        : allKeysArray;

    // Get suggested tempo range (or default)
    const tempoRange = appState.songData.mood && appState.songData.genre
        ? MusicTheory.getSuggestedTempo(mood, genre)
        : [60, 180];

    // Get suggested scales (or all scales)
    const allScales = [
        { name: 'Major (Ionian)', type: 'major', description: 'Bright, happy, stable' },
        { name: 'Natural Minor (Aeolian)', type: 'minor', description: 'Melancholic, introspective' },
        { name: 'Dorian', type: 'dorian', description: 'Jazzy, sophisticated minor' },
        { name: 'Phrygian', type: 'phrygian', description: 'Spanish, exotic, dark' },
        { name: 'Lydian', type: 'lydian', description: 'Dreamy, ethereal, bright' },
        { name: 'Mixolydian', type: 'mixolydian', description: 'Bluesy, rock-oriented' },
        { name: 'Harmonic Minor', type: 'harmonic minor', description: 'Classical, dramatic' },
        { name: 'Melodic Minor', type: 'melodic minor', description: 'Jazz, sophisticated' },
        { name: 'Major Pentatonic', type: 'major pentatonic', description: 'Simple, folk, country' },
        { name: 'Minor Pentatonic', type: 'minor pentatonic', description: 'Blues, rock, simple' },
        { name: 'Blues Scale', type: 'blues', description: 'Blues, rock, soulful' }
    ];

    const suggestedScales = appState.songData.mood && appState.songData.genre
        ? MusicTheory.getSuggestedScalesForMoodAndGenre(mood, genre)
        : allScales;

    // Render keys
    UI.renderKeys(suggestedKeys, 'key-options');

    // Render scales
    UI.renderScales(suggestedScales, 'scale-options');

    // Render tempos
    UI.renderTempos(tempoRange, 'tempo-options');

    UI.showStep('step-key-tempo');
}

async function loadChordsStepDirect() {
    // Ensure data is loaded
    if (!appState.loadedData.chordProgressions || Object.keys(appState.loadedData.chordProgressions).length === 0) {
        console.log('Loading chord progressions data...');
        appState.loadedData.chordProgressions = await MusicTheory.getChordProgressionsData();
    }

    // If no key/scale/genre, provide defaults and show all progressions
    if (!appState.songData.key) {
        appState.songData.key = 'C';
    }
    if (!appState.songData.scale) {
        appState.songData.scale = 'major';
    }
    if (!appState.songData.genre) {
        // Load genres if needed
        if (!appState.loadedData.genres || appState.loadedData.genres.length === 0) {
            appState.loadedData.genres = await MusicTheory.getGenresData();
        }
        // Use first genre as default, or create a simple pop genre
        appState.songData.genre = appState.loadedData.genres[0] || { id: 'pop', name: 'Pop' };
    }

    console.log('Chord step - Key:', appState.songData.key, 'Scale:', appState.songData.scale, 'Genre:', appState.songData.genre);

    const chordProgressions = MusicTheory.getChordProgressionsForKeyAndGenre(
        appState.songData.key,
        appState.songData.scale,
        appState.songData.genre,
        appState.loadedData.chordProgressions
    );

    console.log('Found chord progressions:', chordProgressions ? chordProgressions.length : 0);

    UI.renderChordProgressions(chordProgressions, 'chord-progressions');

    // Load strumming patterns
    loadStrummingPatterns();

    // Setup chord guide toggle
    setupChordGuideToggle();

    UI.showStep('step-chords');
}

async function loadRhythmStepDirect() {
    // Provide defaults if needed
    if (!appState.songData.genre) {
        // Load genres if needed
        if (!appState.loadedData.genres || appState.loadedData.genres.length === 0) {
            appState.loadedData.genres = await MusicTheory.getGenresData();
        }
        appState.songData.genre = appState.loadedData.genres[0] || { id: 'pop', name: 'Pop' };
    }
    if (!appState.songData.tempo) {
        appState.songData.tempo = 120;
    }
    if (!appState.songData.strummingPattern) {
        // Provide default strumming pattern
        appState.songData.strummingPattern = {
            id: 'down-down-up-up-down-up',
            name: 'Classic Strumming',
            pattern: ['D', 'D', 'U', 'U', 'D', 'U']
        };
    }

    console.log('Rhythm step - Genre:', appState.songData.genre, 'Tempo:', appState.songData.tempo);

    // Update rhythm context display
    updateRhythmContext();

    // Generate rhythm templates based on current song data
    const rhythmTemplates = generateRhythmTemplates();
    console.log('Generated rhythm templates:', rhythmTemplates ? rhythmTemplates.length : 0);

    renderRhythmTemplates(rhythmTemplates);

    UI.showStep('step-rhythm');
}

async function loadMelodyStepDirect() {
    // Provide defaults if needed
    if (!appState.songData.key) {
        appState.songData.key = 'C';
    }
    if (!appState.songData.scale) {
        appState.songData.scale = 'major';
    }
    if (!appState.songData.chordProgression) {
        appState.songData.chordProgression = {
            id: 'I-V-vi-IV',
            name: 'Pop Magic',
            numerals: ['I', 'V', 'vi', 'IV'],
            chords: ['C', 'G', 'Am', 'F']
        };
    }

    console.log('Melody step - Key:', appState.songData.key, 'Scale:', appState.songData.scale);
    console.log('Chord progression:', appState.songData.chordProgression);

    const melodyIdeas = MusicTheory.generateMelodyIdeas(
        appState.songData.key,
        appState.songData.chordProgression,
        appState.songData.scale
    );

    console.log('Generated melody ideas:', melodyIdeas ? melodyIdeas.length : 0);

    UI.renderMelodyIdeas(melodyIdeas, 'melody-ideas');

    UI.showStep('step-melody');
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