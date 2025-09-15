// music-theory.js - Pure music logic and data handling

// Data loading functions
export async function getMoodsData() {
    try {
        const response = await fetch('./data/moods.json');
        const data = await response.json();
        return data.moods;
    } catch (error) {
        console.error('Error loading moods data:', error);
        return [];
    }
}

export async function getGenresData() {
    try {
        const response = await fetch('./data/genres.json');
        const data = await response.json();
        return data.genres;
    } catch (error) {
        console.error('Error loading genres data:', error);
        return [];
    }
}

export async function getChordProgressionsData() {
    try {
        const response = await fetch('./data/chord-progressions.json');
        const data = await response.json();
        return data.progressions;
    } catch (error) {
        console.error('Error loading chord progressions data:', error);
        return {};
    }
}

export async function getDrumPatternsData() {
    try {
        const response = await fetch('./data/drum-patterns.json');
        const data = await response.json();
        return data.patterns;
    } catch (error) {
        console.error('Error loading drum patterns data:', error);
        return {};
    }
}

// Music theory helper functions
export function getScaleType(key) {
    const minorKeys = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm'];
    return minorKeys.includes(key) ? 'minor' : 'major';
}

export function getSuggestedKeysForMoodAndGenre(mood, genre) {
    const moodKeys = mood.suggestedKeys || [];
    const genrePreference = genre.id;
    
    // Adjust suggestions based on genre
    if (genrePreference === 'rock') {
        return moodKeys.filter(key => ['E', 'A', 'D', 'G', 'B', 'Em', 'Am', 'Dm'].includes(key));
    } else if (genrePreference === 'edm') {
        return moodKeys.filter(key => ['Am', 'Em', 'Dm', 'Gm', 'F#m'].includes(key));
    }
    
    return moodKeys;
}

export function getSuggestedTempo(mood, genre) {
    const moodTempo = mood.tempoRange || [120, 120];
    const genreTempo = genre.typicalTempo || [120, 120];
    
    // Find overlap between mood and genre tempo ranges
    const minTempo = Math.max(moodTempo[0], genreTempo[0]);
    const maxTempo = Math.min(moodTempo[1], genreTempo[1]);
    
    // If no overlap, use genre preference
    if (minTempo > maxTempo) {
        return genreTempo;
    }
    
    return [minTempo, maxTempo];
}

export function getChordProgressionsForKeyAndGenre(key, genre, progressionsData) {
    const scaleType = getScaleType(key);
    const genreProgressions = genre.commonProgressions || [];
    const availableProgressions = progressionsData[scaleType] || {};
    
    const matchingProgressions = [];
    
    genreProgressions.forEach(progressionName => {
        if (availableProgressions[progressionName]) {
            const progression = availableProgressions[progressionName];
            const chords = progression.examples[key] || [];
            
            if (chords.length > 0) {
                matchingProgressions.push({
                    name: progression.name,
                    description: progression.description,
                    numerals: progression.numerals,
                    chords: chords,
                    id: progressionName
                });
            }
        }
    });
    
    return matchingProgressions;
}

export function getDrumPatternsForGenre(genre, patternsData) {
    const genrePatterns = patternsData[genre.id] || {};
    
    return Object.keys(genrePatterns).map(patternId => {
        const pattern = genrePatterns[patternId];
        return {
            id: patternId,
            name: pattern.name,
            description: pattern.description,
            pattern: pattern.pattern,
            grid: pattern.grid,
            tempo: pattern.tempo
        };
    });
}

export function generateBassLine(chordProgression, complexity = 'simple') {
    if (!chordProgression || !chordProgression.chords) {
        return [];
    }
    
    const chords = chordProgression.chords;
    const bassLine = [];
    
    chords.forEach(chord => {
        const rootNote = chord.replace(/m|7|maj|dim|aug/g, '');
        
        if (complexity === 'simple') {
            bassLine.push({
                note: rootNote,
                rhythm: 'whole'
            });
        } else if (complexity === 'walking') {
            bassLine.push({
                note: rootNote,
                rhythm: 'quarter'
            });
            bassLine.push({
                note: getWalkingNote(rootNote),
                rhythm: 'quarter'
            });
        }
    });
    
    return bassLine;
}

function getWalkingNote(rootNote) {
    const noteMap = {
        'C': 'D', 'D': 'E', 'E': 'F', 'F': 'G', 'G': 'A', 'A': 'B', 'B': 'C',
        'C#': 'D#', 'D#': 'F', 'F#': 'G#', 'G#': 'A#', 'A#': 'C'
    };
    return noteMap[rootNote] || rootNote;
}

export function generateMelodyIdeas(key, chordProgression, scale = 'major') {
    const scaleNotes = getScaleNotes(key, scale);
    const melodyIdeas = [];
    
    // Generate different melody patterns
    const patterns = [
        {
            name: 'Ascending Scale Run',
            description: 'Start low and climb up the scale',
            pattern: scaleNotes.slice(0, 5),
            rhythm: 'eighth'
        },
        {
            name: 'Chord Tone Melody',
            description: 'Focus on chord tones',
            pattern: getChordTones(chordProgression, scaleNotes),
            rhythm: 'quarter'
        },
        {
            name: 'Scale Fragment',
            description: 'Short melodic motif',
            pattern: [scaleNotes[0], scaleNotes[2], scaleNotes[4], scaleNotes[1]],
            rhythm: 'quarter'
        }
    ];
    
    return patterns;
}

function getScaleNotes(key, scale) {
    const rootNote = key.replace(/m/g, '');
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const rootIndex = notes.indexOf(rootNote);
    
    if (rootIndex === -1) return [];
    
    const majorIntervals = [0, 2, 4, 5, 7, 9, 11];
    const minorIntervals = [0, 2, 3, 5, 7, 8, 10];
    
    const intervals = scale === 'minor' ? minorIntervals : majorIntervals;
    
    return intervals.map(interval => {
        const noteIndex = (rootIndex + interval) % 12;
        return notes[noteIndex];
    });
}

function getChordTones(chordProgression, scaleNotes) {
    if (!chordProgression || !chordProgression.chords) {
        return scaleNotes.slice(0, 4);
    }
    
    const chord = chordProgression.chords[0];
    const rootNote = chord.replace(/m|7|maj|dim|aug/g, '');
    const rootIndex = scaleNotes.indexOf(rootNote);
    
    if (rootIndex === -1) return scaleNotes.slice(0, 4);
    
    // Return root, third, fifth of the chord
    return [
        scaleNotes[rootIndex % scaleNotes.length],
        scaleNotes[(rootIndex + 2) % scaleNotes.length],
        scaleNotes[(rootIndex + 4) % scaleNotes.length]
    ];
}

export function getSongStructureForGenre(genre) {
    const structures = {
        'pop': [
            {
                name: 'Classic Pop',
                sections: ['Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro']
            },
            {
                name: 'Modern Pop',
                sections: ['Intro', 'Verse', 'Pre-Chorus', 'Chorus', 'Verse', 'Pre-Chorus', 'Chorus', 'Bridge', 'Chorus', 'Outro']
            }
        ],
        'rock': [
            {
                name: 'Classic Rock',
                sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Guitar Solo', 'Chorus', 'Outro']
            },
            {
                name: 'Power Rock',
                sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Guitar Solo', 'Chorus', 'Chorus']
            }
        ],
        'lofi': [
            {
                name: 'Lo-fi Loop',
                sections: ['Main Loop', 'Variation A', 'Main Loop', 'Variation B', 'Main Loop']
            }
        ],
        'edm': [
            {
                name: 'EDM Structure',
                sections: ['Intro', 'Build-up', 'Drop', 'Breakdown', 'Build-up', 'Drop', 'Outro']
            }
        ]
    };
    
    return structures[genre.id] || structures['pop'];
}

export function getArrangementSuggestions(genre, songStructure) {
    const arrangementTips = {
        'pop': {
            'Verse': 'Keep it simple - vocals, light drums, bass, maybe acoustic guitar',
            'Chorus': 'Full arrangement - add electric guitar, strings, backing vocals',
            'Bridge': 'Strip back or change instrumentation for contrast',
            'Intro': 'Hook the listener - start with the most memorable element',
            'Outro': 'Fade out or end with a strong final chord'
        },
        'rock': {
            'Verse': 'Clean or lightly distorted guitar, steady bass and drums',
            'Chorus': 'Full distortion, power chords, driving rhythm',
            'Guitar Solo': 'Lead guitar over rhythm section, maybe bass solo',
            'Bridge': 'Different chord progression, maybe acoustic or clean tone',
            'Intro': 'Guitar riff or drum fill to set energy',
            'Outro': 'Big ending or fade with repeated chorus'
        },
        'lofi': {
            'Main Loop': 'Piano/keys, soft drums, ambient textures',
            'Variation A': 'Add subtle elements - vinyl crackle, reversed sounds',
            'Variation B': 'Change drum pattern slightly or add melodic element'
        },
        'edm': {
            'Intro': 'Minimal elements, build atmosphere',
            'Build-up': 'Gradually add elements, increase tension',
            'Drop': 'Full energy - all synths, heavy bass, driving drums',
            'Breakdown': 'Strip to minimal elements, prepare for next build',
            'Outro': 'Gradually remove elements, fade or hard stop'
        }
    };
    
    return arrangementTips[genre.id] || arrangementTips['pop'];
}

export function exportSongData(songData) {
    const exportData = {
        metadata: {
            title: songData.title || 'Untitled Song',
            created: new Date().toISOString(),
            generator: 'Music Machine v1.0'
        },
        ...songData
    };
    
    return exportData;
}

export function exportAsText(songData) {
    const data = exportSongData(songData);
    let text = `SONG PLAN: ${data.metadata.title}\n`;
    text += `Created: ${new Date(data.metadata.created).toLocaleDateString()}\n\n`;
    
    text += `MOOD & GENRE:\n`;
    text += `- Mood: ${data.mood?.name || 'Not set'} (${data.mood?.description || ''})\n`;
    text += `- Genre: ${data.genre?.name || 'Not set'} (${data.genre?.description || ''})\n\n`;
    
    text += `MUSICAL FOUNDATION:\n`;
    text += `- Key: ${data.key || 'Not set'}\n`;
    text += `- Scale: ${data.scale || 'Not set'}\n`;
    text += `- Tempo: ${data.tempo || 'Not set'} BPM\n\n`;
    
    if (data.chordProgression) {
        text += `CHORD PROGRESSION:\n`;
        text += `- ${data.chordProgression.name}: ${data.chordProgression.chords.join(' - ')}\n\n`;
    }
    
    if (data.drumPattern) {
        text += `DRUM PATTERN:\n`;
        text += `- ${data.drumPattern.name}: ${data.drumPattern.description}\n\n`;
    }
    
    if (data.bassLine && data.bassLine.length > 0) {
        text += `BASS LINE:\n`;
        text += `- Notes: ${data.bassLine.map(note => note.note).join(' - ')}\n\n`;
    }
    
    if (data.songStructure && data.songStructure.length > 0) {
        text += `SONG STRUCTURE:\n`;
        text += `- ${data.songStructure.join(' - ')}\n\n`;
    }
    
    if (data.lyrics) {
        text += `LYRICS:\n${data.lyrics}\n\n`;
    }
    
    text += `Generated with Music Machine - Your guided journey from mood to complete song`;
    
    return text;
}