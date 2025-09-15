// music-theory.js - Enhanced with Tonal.js for comprehensive music theory

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

export async function getSongStructuresData() {
    try {
        const response = await fetch('./data/song-structures.json');
        const data = await response.json();
        return data.arrangements;
    } catch (error) {
        console.error('Error loading song structures data:', error);
        return {};
    }
}

// Enhanced music theory functions using Tonal.js
export function getScaleType(key) {
    try {
        const keyInfo = Tonal.Key.majorKey(key);
        if (keyInfo.tonic) {
            return 'major';
        }
        const minorKeyInfo = Tonal.Key.minorKey(key);
        if (minorKeyInfo.tonic) {
            return 'minor';
        }
        // Fallback to simple detection
        return key.includes('m') ? 'minor' : 'major';
    } catch (error) {
        console.warn('Error detecting scale type, using fallback:', error);
        return key.includes('m') ? 'minor' : 'major';
    }
}

export function getAllKeys() {
    const majorKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const minorKeys = ['Am', 'A#m', 'Bm', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m'];
    return {
        major: majorKeys,
        minor: minorKeys,
        all: [...majorKeys, ...minorKeys]
    };
}

export function getSuggestedKeysForMoodAndGenre(mood, genre) {
    let suggestedKeys = mood.suggestedKeys || [];
    
    // Expand suggestions based on genre preferences
    if (genre.id === 'rock' || genre.id === 'metal') {
        // Rock genres prefer guitar-friendly keys
        const guitarKeys = ['E', 'A', 'D', 'G', 'B', 'Em', 'Am', 'Dm', 'Bm'];
        suggestedKeys = suggestedKeys.filter(key => guitarKeys.includes(key));
        if (suggestedKeys.length < 3) {
            suggestedKeys = [...suggestedKeys, ...guitarKeys.slice(0, 5)];
        }
    } else if (genre.id === 'jazz' || genre.id === 'blues') {
        // Jazz and blues prefer certain keys
        const jazzKeys = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'G', 'C', 'Am', 'Dm', 'Gm'];
        suggestedKeys = [...new Set([...suggestedKeys, ...jazzKeys])];
    } else if (genre.id === 'classical') {
        // Classical music uses all keys but some are more common
        const classicalKeys = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb', 'Am', 'Em', 'Bm', 'F#m'];
        suggestedKeys = [...new Set([...suggestedKeys, ...classicalKeys])];
    }
    
    // Remove duplicates and limit to reasonable number
    return [...new Set(suggestedKeys)].slice(0, 8);
}

export function getSuggestedScalesForMoodAndGenre(mood, genre) {
    const scaleOptions = [
        { name: 'Major (Ionian)', type: 'major', description: 'Bright, happy, stable' },
        { name: 'Minor (Aeolian)', type: 'minor', description: 'Dark, sad, emotional' },
        { name: 'Dorian', type: 'dorian', description: 'Minor with bright 6th, jazzy' },
        { name: 'Mixolydian', type: 'mixolydian', description: 'Major with flat 7th, bluesy' },
        { name: 'Lydian', type: 'lydian', description: 'Major with sharp 4th, dreamy' },
        { name: 'Phrygian', type: 'phrygian', description: 'Minor with flat 2nd, Spanish' },
        { name: 'Locrian', type: 'locrian', description: 'Diminished, very dark' },
        { name: 'Harmonic Minor', type: 'harmonic-minor', description: 'Exotic, Middle Eastern' },
        { name: 'Melodic Minor', type: 'melodic-minor', description: 'Jazz minor, sophisticated' },
        { name: 'Blues Scale', type: 'blues', description: 'Pentatonic with blue notes' },
        { name: 'Pentatonic Major', type: 'pentatonic-major', description: 'Simple, folk-like' },
        { name: 'Pentatonic Minor', type: 'pentatonic-minor', description: 'Rock, blues, world music' }
    ];
    
    let suggestedScales = mood.suggestedScales || ['major', 'minor'];
    
    // Filter based on genre
    if (genre.id === 'blues') {
        suggestedScales = ['blues', 'minor', 'mixolydian'];
    } else if (genre.id === 'jazz') {
        suggestedScales = ['major', 'minor', 'dorian', 'mixolydian', 'melodic-minor'];
    } else if (genre.id === 'flamenco') {
        suggestedScales = ['phrygian', 'harmonic-minor', 'minor'];
    } else if (genre.id === 'celtic') {
        suggestedScales = ['dorian', 'mixolydian', 'major'];
    } else if (genre.id === 'metal') {
        suggestedScales = ['minor', 'phrygian', 'harmonic-minor', 'locrian'];
    }
    
    return scaleOptions.filter(scale => suggestedScales.includes(scale.type));
}

export function getSuggestedTempo(mood, genre) {
    const moodTempo = mood.tempoRange || [120, 120];
    const genreTempo = genre.typicalTempo || [120, 120];
    
    // Find overlap between mood and genre tempo ranges
    const minTempo = Math.max(moodTempo[0], genreTempo[0]);
    const maxTempo = Math.min(moodTempo[1], genreTempo[1]);
    
    // If no overlap, blend the ranges
    if (minTempo > maxTempo) {
        const blendedMin = Math.round((moodTempo[0] + genreTempo[0]) / 2);
        const blendedMax = Math.round((moodTempo[1] + genreTempo[1]) / 2);
        return [Math.min(blendedMin, blendedMax), Math.max(blendedMin, blendedMax)];
    }
    
    return [minTempo, maxTempo];
}

export function getChordProgressionsForKeyAndGenre(key, scale, genre, progressionsData) {
    const progressions = [];
    
    // Determine which progression categories to use
    let categories = [];
    
    if (scale === 'major') {
        categories.push('major');
    } else if (scale === 'minor') {
        categories.push('minor');
    }
    
    // Add genre-specific categories
    if (genre.id === 'jazz') categories.push('jazz');
    if (genre.id === 'blues') categories.push('blues');
    if (genre.id === 'gospel') categories.push('gospel');
    if (genre.id === 'latin' || genre.id === 'bossanova') categories.push('latin');
    if (['edm', 'house', 'techno', 'dubstep'].includes(genre.id)) categories.push('electronic');
    
    // Add modal categories for appropriate genres
    if (['celtic', 'folk', 'jazz', 'metal'].includes(genre.id)) {
        categories.push('modal');
    }
    
    // Process each category
    categories.forEach(category => {
        const categoryProgressions = progressionsData[category];
        if (!categoryProgressions) return;
        
        // Handle modal subcategories
        if (category === 'modal') {
            Object.keys(categoryProgressions).forEach(modalType => {
                Object.keys(categoryProgressions[modalType]).forEach(progressionId => {
                    const progression = categoryProgressions[modalType][progressionId];
                    const actualChords = convertNumeralsToChords(progression.numerals, key, modalType);
                    if (actualChords.length > 0) {
                        progressions.push({
                            name: `${progression.name} (${modalType})`,
                            description: progression.description,
                            numerals: progression.numerals,
                            chords: actualChords,
                            id: `${modalType}-${progressionId}`,
                            function: progression.function
                        });
                    }
                });
            });
        } else {
            // Handle regular categories
            Object.keys(categoryProgressions).forEach(progressionId => {
                const progression = categoryProgressions[progressionId];
                const actualChords = convertNumeralsToChords(progression.numerals, key, scale);
                if (actualChords.length > 0) {
                    progressions.push({
                        name: progression.name,
                        description: progression.description,
                        numerals: progression.numerals,
                        chords: actualChords,
                        id: progressionId,
                        function: progression.function
                    });
                }
            });
        }
    });
    
    // Filter by genre preferences if specified
    const genreProgressions = genre.commonProgressions || [];
    if (genreProgressions.length > 0 && progressions.length > 3) {
        const preferredProgressions = progressions.filter(prog => 
            genreProgressions.some(gp => prog.id.includes(gp) || prog.numerals.join('-') === gp)
        );
        if (preferredProgressions.length > 0) {
            return [...preferredProgressions, ...progressions.slice(0, 2)];
        }
    }
    
    return progressions.slice(0, 8); // Limit to 8 progressions
}

export function convertNumeralsToChords(numerals, key, scale = 'major') {
    try {
        const chords = [];
        
        for (const numeral of numerals) {
            const chord = convertSingleNumeralToChord(numeral, key, scale);
            if (chord) {
                chords.push(chord);
            }
        }
        
        return chords;
    } catch (error) {
        console.error('Error converting numerals to chords:', error);
        return [];
    }
}

function convertSingleNumeralToChord(numeral, key, scale) {
    try {
        // Handle different key formats
        const cleanKey = key.replace('m', '');
        const isMinorKey = key.includes('m') || scale === 'minor';
        
        // Get the scale notes
        let scaleNotes;
        if (isMinorKey) {
            scaleNotes = Tonal.Scale.get(`${cleanKey} minor`).notes;
        } else {
            scaleNotes = Tonal.Scale.get(`${cleanKey} major`).notes;
        }
        
        if (!scaleNotes || scaleNotes.length === 0) {
            console.warn(`Could not get scale notes for ${key} ${scale}`);
            return null;
        }
        
        // Parse the numeral
        const { degree, quality, extension } = parseNumeral(numeral);
        
        if (degree < 1 || degree > 7) return null;
        
        // Get the root note (adjust for 0-based array)
        const rootNote = scaleNotes[degree - 1];
        
        if (!rootNote) return null;
        
        // Build the chord based on quality and extension
        return buildChord(rootNote, quality, extension, scaleNotes, degree, isMinorKey);
        
    } catch (error) {
        console.error(`Error converting numeral ${numeral}:`, error);
        return null;
    }
}

function parseNumeral(numeral) {
    // Remove common symbols and parse
    let cleanNumeral = numeral.replace(/♭/g, 'b').replace(/°/g, 'dim');
    
    let degree = 1;
    let quality = '';
    let extension = '';
    
    // Extract Roman numeral degree
    if (cleanNumeral.includes('VII')) degree = 7;
    else if (cleanNumeral.includes('VI')) degree = 6;
    else if (cleanNumeral.includes('V')) degree = 5;
    else if (cleanNumeral.includes('IV')) degree = 4;
    else if (cleanNumeral.includes('III')) degree = 3;
    else if (cleanNumeral.includes('II')) degree = 2;
    else if (cleanNumeral.includes('I')) degree = 1;
    
    // Determine quality from case and symbols
    const isLowerCase = /[ivx]/.test(cleanNumeral);
    const hasFlat = cleanNumeral.includes('b');
    const hasDim = cleanNumeral.includes('dim') || cleanNumeral.includes('°');
    const hasHalfDim = cleanNumeral.includes('b5');
    
    if (hasDim) quality = 'dim';
    else if (hasHalfDim) quality = 'b5';
    else if (isLowerCase) quality = 'm';
    else quality = '';
    
    // Handle extensions
    if (cleanNumeral.includes('maj7')) extension = 'maj7';
    else if (cleanNumeral.includes('7')) extension = '7';
    
    return { degree, quality, extension };
}

function buildChord(rootNote, quality, extension, scaleNotes, degree, isMinorKey) {
    try {
        let chordSymbol = rootNote;
        
        // Add quality
        if (quality === 'm') {
            chordSymbol += 'm';
        } else if (quality === 'dim') {
            chordSymbol += 'dim';
        } else if (quality === 'b5') {
            chordSymbol += 'm7b5';
        }
        
        // Add extension
        if (extension) {
            chordSymbol += extension;
        }
        
        return chordSymbol;
        
    } catch (error) {
        console.error('Error building chord:', error);
        return rootNote; // Fallback to root note
    }
}

export function getDrumPatternsForGenre(genre, patternsData) {
    // Map genres to drum pattern categories
    const genreMapping = {
        'grunge': ['rock', 'punk', 'metal'],
        'indie': ['rock', 'folk', 'pop'],
        'alternative': ['rock', 'punk'],
        'emo': ['rock', 'punk'],
        'post-rock': ['rock', 'ambient'],
        'shoegaze': ['rock', 'ambient'],
        'garage': ['rock', 'punk'],
        'noise': ['punk', 'metal'],
        'progressive': ['rock', 'metal'],
        'stoner': ['rock', 'metal'],
        'psychedelic': ['rock', 'ambient']
    };
    
    let allPatterns = [];
    
    // First, try to get patterns for the exact genre
    const directPatterns = patternsData[genre.id] || {};
    Object.keys(directPatterns).forEach(patternId => {
        const pattern = directPatterns[patternId];
        allPatterns.push({
            id: `${genre.id}-${patternId}`,
            name: pattern.name,
            description: pattern.description,
            pattern: pattern.pattern,
            grid: pattern.grid,
            tempo: pattern.tempo
        });
    });
    
    // Then, add patterns from mapped genres
    const mappedGenres = genreMapping[genre.id] || [];
    mappedGenres.forEach(mappedGenre => {
        const mappedPatterns = patternsData[mappedGenre] || {};
        Object.keys(mappedPatterns).forEach(patternId => {
            const pattern = mappedPatterns[patternId];
            allPatterns.push({
                id: `${mappedGenre}-${patternId}`,
                name: `${pattern.name} (${mappedGenre})`,
                description: pattern.description,
                pattern: pattern.pattern,
                grid: pattern.grid,
                tempo: pattern.tempo
            });
        });
    });
    
    // Remove duplicates based on pattern content
    const uniquePatterns = [];
    const seenPatterns = new Set();
    
    allPatterns.forEach(pattern => {
        const patternKey = pattern.pattern + pattern.name.replace(/\s*\([^)]*\)/, '');
        if (!seenPatterns.has(patternKey)) {
            seenPatterns.add(patternKey);
            uniquePatterns.push(pattern);
        }
    });
    
    // If still no patterns, provide genre-appropriate fallbacks
    if (uniquePatterns.length === 0) {
        if (['rock', 'grunge', 'indie', 'alternative', 'punk'].includes(genre.id)) {
            return [
                {
                    id: 'basic-rock',
                    name: 'Basic Rock Beat',
                    description: 'Standard rock rhythm',
                    pattern: 'K-s-K-s-',
                    grid: [
                        ['Kick', 'x', '.', '.', '.'],
                        ['Snare', '.', '.', 'x', '.'],
                        ['Hi-hat', 'x', 'x', 'x', 'x']
                    ],
                    tempo: [110, 140]
                },
                {
                    id: 'driving-rock',
                    name: 'Driving Rock',
                    description: 'More aggressive rock beat',
                    pattern: 'K-s-K-s-',
                    grid: [
                        ['Kick', 'x', '.', 'x', '.'],
                        ['Snare', '.', 'x', '.', 'x'],
                        ['Hi-hat', 'x', 'x', 'x', 'x']
                    ],
                    tempo: [120, 160]
                }
            ];
        } else {
            return [
                {
                    id: 'basic-4-4',
                    name: 'Basic 4/4',
                    description: 'Standard beat',
                    pattern: 'K-s-K-s-',
                    grid: [
                        ['Kick', 'x', '.', 'x', '.'],
                        ['Snare', '.', 'x', '.', 'x'],
                        ['Hi-hat', 'x', 'x', 'x', 'x']
                    ],
                    tempo: [100, 140]
                }
            ];
        }
    }
    
    return uniquePatterns.slice(0, 8); // Limit to 8 patterns for UI
}

export function generateBassLine(chordProgression, complexity = 'simple') {
    if (!chordProgression || !chordProgression.chords) {
        return [];
    }
    
    const chords = chordProgression.chords;
    const bassLine = [];
    
    chords.forEach((chord, index) => {
        try {
            // Get root note using Tonal.js
            const chordInfo = Tonal.Chord.get(chord);
            const rootNote = chordInfo.tonic || chord.replace(/[^A-G#b]/g, '');
            
            if (complexity === 'simple') {
                bassLine.push({
                    note: rootNote,
                    rhythm: 'whole',
                    measure: index + 1
                });
            } else if (complexity === 'walking') {
                bassLine.push({
                    note: rootNote,
                    rhythm: 'quarter',
                    measure: index + 1,
                    beat: 1
                });
                
                // Add walking notes
                const nextChord = chords[index + 1];
                if (nextChord) {
                    const nextRoot = Tonal.Chord.get(nextChord).tonic || nextChord.replace(/[^A-G#b]/g, '');
                    const walkingNote = getWalkingNote(rootNote, nextRoot);
                    bassLine.push({
                        note: walkingNote,
                        rhythm: 'quarter',
                        measure: index + 1,
                        beat: 3
                    });
                }
            }
        } catch (error) {
            console.warn(`Error processing chord ${chord}:`, error);
            bassLine.push({
                note: chord.charAt(0),
                rhythm: 'whole',
                measure: index + 1
            });
        }
    });
    
    return bassLine;
}

function getWalkingNote(currentRoot, nextRoot) {
    try {
        const currentNote = Tonal.Note.get(currentRoot);
        const nextNote = Tonal.Note.get(nextRoot);
        
        // Calculate interval and choose appropriate walking note
        const interval = Tonal.Interval.distance(currentRoot, nextRoot);
        
        // Simple walking logic - could be enhanced
        const chromatic = Tonal.Note.enharmonic(Tonal.Note.transpose(currentRoot, '2M'));
        return chromatic || currentRoot;
        
    } catch (error) {
        console.warn('Error calculating walking note:', error);
        return currentRoot;
    }
}

export function generateMelodyIdeas(key, chordProgression, scale = 'major') {
    try {
        const scaleNotes = getScaleNotesForKey(key, scale);
        const melodyIdeas = [];
        
        // Generate different melody patterns based on music theory
        const patterns = [
            {
                name: 'Ascending Scale Run',
                description: 'Start low and climb up the scale',
                pattern: scaleNotes.slice(0, 5),
                rhythm: 'eighth',
                difficulty: 'easy'
            },
            {
                name: 'Chord Tone Melody',
                description: 'Focus on chord tones for strong harmonic connection',
                pattern: getChordTones(chordProgression, scaleNotes),
                rhythm: 'quarter',
                difficulty: 'medium'
            },
            {
                name: 'Pentatonic Melody',
                description: 'Use pentatonic scale for universal appeal',
                pattern: getPentatonicNotes(key, scale),
                rhythm: 'quarter',
                difficulty: 'easy'
            },
            {
                name: 'Arpeggiated Melody',
                description: 'Follow chord arpeggios for harmonic strength',
                pattern: getArpeggioNotes(chordProgression),
                rhythm: 'eighth',
                difficulty: 'medium'
            },
            {
                name: 'Scale Fragment',
                description: 'Short melodic motif for development',
                pattern: [scaleNotes[0], scaleNotes[2], scaleNotes[4], scaleNotes[1]],
                rhythm: 'quarter',
                difficulty: 'easy'
            },
            {
                name: 'Interval Leaps',
                description: 'Dramatic melodic leaps for excitement',
                pattern: [scaleNotes[0], scaleNotes[4], scaleNotes[1], scaleNotes[5]],
                rhythm: 'half',
                difficulty: 'hard'
            }
        ];
        
        return patterns.filter(pattern => pattern.pattern.length > 0);
        
    } catch (error) {
        console.error('Error generating melody ideas:', error);
        return [];
    }
}

function getScaleNotesForKey(key, scale) {
    try {
        const cleanKey = key.replace('m', '');
        let scaleName = `${cleanKey} ${scale}`;
        
        // Map scale types to Tonal.js scale names
        if (scale === 'minor') scaleName = `${cleanKey} minor`;
        else if (scale === 'dorian') scaleName = `${cleanKey} dorian`;
        else if (scale === 'mixolydian') scaleName = `${cleanKey} mixolydian`;
        else if (scale === 'lydian') scaleName = `${cleanKey} lydian`;
        else if (scale === 'phrygian') scaleName = `${cleanKey} phrygian`;
        else if (scale === 'harmonic-minor') scaleName = `${cleanKey} harmonic minor`;
        else if (scale === 'pentatonic-major') scaleName = `${cleanKey} pentatonic`;
        else if (scale === 'pentatonic-minor') scaleName = `${cleanKey} minor pentatonic`;
        else if (scale === 'blues') scaleName = `${cleanKey} blues`;
        
        const scaleInfo = Tonal.Scale.get(scaleName);
        return scaleInfo.notes || [];
        
    } catch (error) {
        console.warn(`Error getting scale notes for ${key} ${scale}:`, error);
        // Fallback to basic major scale
        const basicScale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        return basicScale;
    }
}

function getPentatonicNotes(key, scale) {
    try {
        const cleanKey = key.replace('m', '');
        const isMinor = key.includes('m') || scale === 'minor';
        const pentatonicScale = isMinor ? 'minor pentatonic' : 'pentatonic';
        const scaleInfo = Tonal.Scale.get(`${cleanKey} ${pentatonicScale}`);
        return scaleInfo.notes || [];
    } catch (error) {
        console.warn('Error getting pentatonic notes:', error);
        return ['C', 'D', 'E', 'G', 'A'];
    }
}

function getChordTones(chordProgression, scaleNotes) {
    if (!chordProgression || !chordProgression.chords || chordProgression.chords.length === 0) {
        return scaleNotes.slice(0, 4);
    }
    
    try {
        const firstChord = chordProgression.chords[0];
        const chordInfo = Tonal.Chord.get(firstChord);
        return chordInfo.notes || scaleNotes.slice(0, 3);
    } catch (error) {
        console.warn('Error getting chord tones:', error);
        return scaleNotes.slice(0, 4);
    }
}

function getArpeggioNotes(chordProgression) {
    if (!chordProgression || !chordProgression.chords) {
        return ['C', 'E', 'G', 'C'];
    }
    
    try {
        const arpeggio = [];
        chordProgression.chords.forEach(chord => {
            const chordInfo = Tonal.Chord.get(chord);
            if (chordInfo.notes && chordInfo.notes.length > 0) {
                arpeggio.push(chordInfo.notes[0]); // Root note
            }
        });
        return arpeggio;
    } catch (error) {
        console.warn('Error getting arpeggio notes:', error);
        return ['C', 'E', 'G', 'C'];
    }
}

export function getSongStructureForGenre(genre) {
    const structures = {
        'pop': [
            { name: 'Classic Pop', sections: ['Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro'] },
            { name: 'Modern Pop', sections: ['Intro', 'Verse', 'Pre-Chorus', 'Chorus', 'Verse', 'Pre-Chorus', 'Chorus', 'Bridge', 'Chorus', 'Outro'] }
        ],
        'rock': [
            { name: 'Classic Rock', sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Guitar Solo', 'Chorus', 'Outro'] },
            { name: 'Power Rock', sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Guitar Solo', 'Chorus', 'Chorus'] }
        ],
        'grunge': [
            { name: 'Grunge Classic', sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro'] },
            { name: 'Alternative Dynamic', sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Guitar Solo', 'Chorus', 'Outro'] },
            { name: 'Grunge Epic', sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Guitar Solo', 'Chorus', 'Chorus', 'Outro'] }
        ],
        'indie': [
            { name: 'Indie Standard', sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro'] },
            { name: 'Indie Atmospheric', sections: ['Intro', 'Verse', 'Pre-Chorus', 'Chorus', 'Verse', 'Pre-Chorus', 'Chorus', 'Bridge', 'Chorus', 'Outro'] },
            { name: 'Indie Extended', sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Instrumental', 'Chorus', 'Outro'] }
        ],
        'punk': [
            { name: 'Punk Fast', sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro'] },
            { name: 'Punk Raw', sections: ['Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus'] }
        ],
        'metal': [
            { name: 'Metal Structure', sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Breakdown', 'Solo', 'Chorus', 'Outro'] }
        ],
        'jazz': [
            { name: 'Jazz Standard', sections: ['Head', 'Solo Section', 'Head'] },
            { name: 'Jazz AABA', sections: ['A Section', 'A Section', 'B Section', 'A Section'] }
        ],
        'blues': [
            { name: '12-Bar Blues', sections: ['Verse', 'Verse', 'Chorus', 'Verse'] },
            { name: 'Blues Ballad', sections: ['Verse', 'Chorus', 'Verse', 'Chorus', 'Solo', 'Chorus'] }
        ],
        'edm': [
            { name: 'EDM Structure', sections: ['Intro', 'Build-up', 'Drop', 'Breakdown', 'Build-up', 'Drop', 'Outro'] }
        ],
        'house': [
            { name: 'House Track', sections: ['Intro', 'Build', 'Drop', 'Break', 'Build', 'Drop', 'Outro'] }
        ],
        'dubstep': [
            { name: 'Dubstep', sections: ['Intro', 'Build-up', 'Drop', 'Breakdown', 'Second Drop', 'Outro'] }
        ],
        'hiphop': [
            { name: 'Hip-Hop', sections: ['Intro', 'Verse', 'Hook', 'Verse', 'Hook', 'Bridge', 'Hook', 'Outro'] }
        ],
        'folk': [
            { name: 'Folk Song', sections: ['Verse', 'Chorus', 'Verse', 'Chorus', 'Verse', 'Chorus'] }
        ],
        'classical': [
            { name: 'Sonata Form', sections: ['Exposition', 'Development', 'Recapitulation'] },
            { name: 'Theme and Variations', sections: ['Theme', 'Variation 1', 'Variation 2', 'Variation 3', 'Coda'] }
        ],
        'ambient': [
            { name: 'Ambient Flow', sections: ['Introduction', 'Development', 'Climax', 'Resolution'] }
        ]
    };
    
    return structures[genre.id] || structures['pop'];
}

export function getArrangementSuggestions(genre, songStructure) {
    const arrangementTips = {
        'pop': {
            'Intro': 'Hook the listener - start with the most memorable element',
            'Verse': 'Keep it simple - vocals, light drums, bass, maybe acoustic guitar',
            'Pre-Chorus': 'Build energy - add instruments, increase dynamics',
            'Chorus': 'Full arrangement - add electric guitar, strings, backing vocals',
            'Bridge': 'Strip back or change instrumentation for contrast',
            'Outro': 'Fade out or end with a strong final chord'
        },
        'rock': {
            'Intro': 'Guitar riff or drum fill to set energy',
            'Verse': 'Clean or lightly distorted guitar, steady bass and drums',
            'Chorus': 'Full distortion, power chords, driving rhythm',
            'Guitar Solo': 'Lead guitar over rhythm section, maybe bass solo',
            'Bridge': 'Different chord progression, maybe acoustic or clean tone',
            'Outro': 'Big ending or fade with repeated chorus'
        },
        'metal': {
            'Intro': 'Heavy riff or atmospheric buildup',
            'Verse': 'Palm-muted guitars, double bass drums',
            'Chorus': 'Full power chords, aggressive vocals',
            'Breakdown': 'Slow, heavy section with emphasis on rhythm',
            'Solo': 'Technical guitar work, complex rhythms',
            'Outro': 'Powerful ending or fade to silence'
        },
        'jazz': {
            'Head': 'Melody with light accompaniment',
            'Solo Section': 'Featured instrumentalist over rhythm section',
            'A Section': 'Main theme, full band',
            'B Section': 'Contrasting harmony, different feel'
        },
        'edm': {
            'Intro': 'Minimal elements, build atmosphere',
            'Build-up': 'Gradually add elements, increase tension with risers and sweeps',
            'Drop': 'Full energy - all synths, heavy bass, driving drums',
            'Breakdown': 'Strip to minimal elements, vocal focus',
            'Outro': 'Gradually remove elements, fade or hard stop'
        },
        'ambient': {
            'Introduction': 'Establish mood with pads and textures',
            'Development': 'Layer additional elements slowly',
            'Climax': 'Peak emotional intensity',
            'Resolution': 'Return to peaceful state'
        }
    };
    
    return arrangementTips[genre.id] || arrangementTips['pop'];
}

export function exportSongData(songData) {
    const exportData = {
        metadata: {
            title: songData.title || 'Untitled Song',
            created: new Date().toISOString(),
            generator: 'Music Machine v2.0 with Tonal.js'
        },
        ...songData
    };
    
    return exportData;
}

export function exportAsText(songData) {
    const data = exportSongData(songData);
    let text = `♪ SONG PLAN: ${data.metadata.title} ♪\n`;
    text += `Created: ${new Date(data.metadata.created).toLocaleDateString()}\n`;
    text += `Generated with: ${data.metadata.generator}\n\n`;
    
    text += `═══ MOOD & GENRE ═══\n`;
    text += `♫ Mood: ${data.mood?.name || 'Not set'}\n`;
    text += `  └─ ${data.mood?.description || ''}\n`;
    text += `♫ Genre: ${data.genre?.name || 'Not set'}\n`;
    text += `  └─ ${data.genre?.description || ''}\n\n`;
    
    text += `═══ MUSICAL FOUNDATION ═══\n`;
    text += `♪ Key: ${data.key || 'Not set'}\n`;
    text += `♪ Scale: ${data.scale || 'Not set'}\n`;
    text += `♪ Tempo: ${data.tempo || 'Not set'} BPM\n\n`;
    
    if (data.chordProgression) {
        text += `═══ HARMONY ═══\n`;
        text += `♫ Chord Progression: ${data.chordProgression.name}\n`;
        text += `  └─ ${data.chordProgression.description}\n`;
        text += `♪ Chords: ${data.chordProgression.chords.join(' → ')}\n`;
        text += `♪ Function: ${data.chordProgression.function || 'Standard progression'}\n\n`;
    }
    
    if (data.drumPattern) {
        text += `═══ RHYTHM ═══\n`;
        text += `♫ Drum Pattern: ${data.drumPattern.name}\n`;
        text += `  └─ ${data.drumPattern.description}\n\n`;
    }
    
    if (data.bassLine && data.bassLine.length > 0) {
        text += `═══ BASS LINE ═══\n`;
        text += `♪ Bass Notes: ${data.bassLine.map(note => note.note).join(' → ')}\n`;
        text += `♪ Style: ${data.bassComplexity || 'Simple'}\n\n`;
    }
    
    if (data.melodyIdea) {
        text += `═══ MELODY ═══\n`;
        text += `♫ Melody Idea: ${data.melodyIdea.name}\n`;
        text += `  └─ ${data.melodyIdea.description}\n`;
        text += `♪ Notes: ${data.melodyIdea.pattern.join(' → ')}\n\n`;
    }
    
    if (data.songStructure && data.songStructure.length > 0) {
        text += `═══ SONG STRUCTURE ═══\n`;
        text += `♪ ${data.songStructure.join(' → ')}\n\n`;
    }
    
    if (data.lyrics && data.lyrics.trim()) {
        text += `═══ LYRICS ═══\n`;
        text += `${data.lyrics}\n\n`;
    }
    
    text += `═══════════════════════════════════\n`;
    text += `Generated with Music Machine v2.0\n`;
    text += `Your comprehensive journey from mood to complete song`;
    
    return text;
}

// ========== ABLETON LIVE TEMPLATE GENERATION ==========

export function generateAbletonTemplate(songData) {
    const template = {
        version: '12.0.0',
        project: {
            name: songData.title || 'Music Machine Song',
            tempo: songData.tempo || 120,
            timeSignature: [4, 4],
            key: songData.key || 'C'
        },
        tracks: [],
        scenes: [],
        devicePresets: getAbletonDevicePresets(songData.genre)
    };
    
    // Create tracks based on song data
    if (songData.chordProgression) {
        template.tracks.push(createAbletonChordTrack(songData));
    }
    
    if (songData.bassLine) {
        template.tracks.push(createAbletonBassTrack(songData));
    }
    
    if (songData.melodyIdea) {
        template.tracks.push(createAbletonMelodyTrack(songData));
    }
    
    if (songData.drumPattern) {
        template.tracks.push(createAbletonDrumTrack(songData));
    }
    
    // Add utility tracks
    template.tracks.push(createAbletonUtilityTracks(songData));
    
    // Create scene structure based on song structure
    if (songData.songStructure) {
        template.scenes = createAbletonScenes(songData);
    }
    
    return template;
}

function getAbletonDevicePresets(genre) {
    const presets = {
        'electronic': {
            synth: 'Wavetable',
            bass: 'Bass',
            drums: 'Drum Rack',
            effects: ['Reverb', 'Delay', 'Compressor']
        },
        'rock': {
            synth: 'Simpler',
            bass: 'Bass',
            drums: 'Drum Rack',
            effects: ['Amp', 'Overdrive', 'Reverb']
        },
        'pop': {
            synth: 'Wavetable',
            bass: 'Bass',
            drums: 'Drum Rack',
            effects: ['Reverb', 'Compressor', 'EQ Eight']
        },
        'jazz': {
            synth: 'Simpler',
            bass: 'Bass',
            drums: 'Drum Rack',
            effects: ['Reverb', 'Compressor']
        }
    };
    
    return presets[genre?.id] || presets['pop'];
}

function createAbletonChordTrack(songData) {
    return {
        name: 'Chords',
        type: 'midi',
        instrument: 'Wavetable',
        volume: 0.7,
        pan: 0,
        clips: createChordClips(songData),
        effects: ['Reverb', 'Compressor']
    };
}

function createAbletonBassTrack(songData) {
    return {
        name: 'Bass',
        type: 'midi',
        instrument: 'Bass',
        volume: 0.8,
        pan: 0,
        clips: createBassClips(songData),
        effects: ['Compressor', 'EQ Eight']
    };
}

function createAbletonMelodyTrack(songData) {
    return {
        name: 'Lead',
        type: 'midi',
        instrument: 'Wavetable',
        volume: 0.6,
        pan: 0,
        clips: createMelodyClips(songData),
        effects: ['Reverb', 'Delay']
    };
}

function createAbletonDrumTrack(songData) {
    return {
        name: 'Drums',
        type: 'midi',
        instrument: 'Drum Rack',
        volume: 0.9,
        pan: 0,
        clips: createDrumClips(songData),
        effects: ['Compressor']
    };
}

function createAbletonUtilityTracks(songData) {
    return {
        name: 'Harmony',
        type: 'midi',
        instrument: 'Simpler',
        volume: 0.4,
        pan: 0.2,
        clips: [],
        effects: ['Reverb']
    };
}

function createChordClips(songData) {
    const clips = [];
    if (songData.songStructure) {
        songData.songStructure.forEach((section, index) => {
            clips.push({
                name: `${section} Chords`,
                length: getBarLengthForSection(section, songData.genre),
                notes: generateChordClipNotes(songData.chordProgression)
            });
        });
    }
    return clips;
}

function createBassClips(songData) {
    const clips = [];
    if (songData.songStructure) {
        songData.songStructure.forEach((section, index) => {
            clips.push({
                name: `${section} Bass`,
                length: getBarLengthForSection(section, songData.genre),
                notes: generateBassClipNotes(songData.bassLine)
            });
        });
    }
    return clips;
}

function createMelodyClips(songData) {
    const clips = [];
    if (songData.songStructure && songData.melodyIdea) {
        songData.songStructure.forEach((section, index) => {
            clips.push({
                name: `${section} Melody`,
                length: getBarLengthForSection(section, songData.genre),
                notes: generateMelodyClipNotes(songData.melodyIdea)
            });
        });
    }
    return clips;
}

function createDrumClips(songData) {
    const clips = [];
    if (songData.songStructure && songData.drumPattern) {
        songData.songStructure.forEach((section, index) => {
            clips.push({
                name: `${section} Drums`,
                length: getBarLengthForSection(section, songData.genre),
                pattern: songData.drumPattern.pattern
            });
        });
    }
    return clips;
}

function createAbletonScenes(songData) {
    const scenes = [];
    songData.songStructure.forEach((section, index) => {
        scenes.push({
            name: section,
            clips: {
                chords: index,
                bass: index,
                melody: index,
                drums: index
            }
        });
    });
    return scenes;
}

function generateChordClipNotes(chordProgression) {
    if (!chordProgression?.chords) return [];
    
    const notes = [];
    chordProgression.chords.forEach((chord, index) => {
        const chordNotes = Tonal.Chord.get(chord).notes;
        chordNotes.forEach((note, noteIndex) => {
            notes.push({
                pitch: Tonal.Midi.toMidi(note + '4'),
                velocity: 80,
                start: index * 0.25,
                duration: 0.25
            });
        });
    });
    return notes;
}

function generateBassClipNotes(bassLine) {
    if (!bassLine?.notes) return [];
    
    return bassLine.notes.map((note, index) => ({
        pitch: Tonal.Midi.toMidi(note + '2'),
        velocity: 90,
        start: index * 0.25,
        duration: 0.2
    }));
}

function generateMelodyClipNotes(melodyIdea) {
    if (!melodyIdea?.pattern) return [];
    
    return melodyIdea.pattern.map((note, index) => ({
        pitch: Tonal.Midi.toMidi(note + '5'),
        velocity: 75,
        start: index * 0.125,
        duration: 0.1
    }));
}

export function exportAbletonTemplate(songData) {
    const projectName = (songData.title || 'Music Machine Song').replace(/[^a-zA-Z0-9]/g, '_');
    
    // Generate MIDI files instead of a fake .als file
    const midiFiles = generateTemplateAsMIDI(songData);
    
    // Create project folder structure with MIDI files and instructions
    const projectStructure = {
        'README.txt': generateProjectReadme(songData),
        'MIDI Files/': midiFiles,
        'Instructions.txt': generateAbletonInstructions(songData),
        'Song Structure.txt': generateSongStructureFile(songData)
    };
    
    return projectStructure;
}

function generateTemplateAsMIDI(songData) {
    const midiFiles = {};
    
    try {
        // Generate individual MIDI files for each track
        if (songData.chordProgression) {
            const chordTrack = createSimpleChordMIDI(songData);
            if (chordTrack) {
                midiFiles['01_Chords.mid'] = chordTrack;
            }
        }
        
        if (songData.bassLine || songData.chordProgression) {
            const bassTrack = createSimpleBassMIDI(songData);
            if (bassTrack) {
                midiFiles['02_Bass.mid'] = bassTrack;
            }
        }
        
        if (songData.melodyIdea) {
            const melodyTrack = createSimpleMelodyMIDI(songData);
            if (melodyTrack) {
                midiFiles['03_Melody.mid'] = melodyTrack;
            }
        }
        
        if (songData.drumPattern) {
            const drumTrack = createSimpleDrumMIDI(songData);
            if (drumTrack) {
                midiFiles['04_Drums.mid'] = drumTrack;
            }
        }
        
    } catch (error) {
        console.error('Error generating template MIDI files:', error);
    }
    
    return midiFiles;
}

function createSimpleChordMIDI(songData) {
    if (!window.MidiWriter || !songData.chordProgression) return null;
    
    try {
        const track = new MidiWriter.Track();
        track.setTempo(songData.tempo || 120);
        track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 1}));
        
        // Create a simple 4-bar pattern
        songData.chordProgression.chords.forEach((chord, index) => {
            const chordNotes = Tonal.Chord.get(chord).notes.slice(0, 4);
            if (chordNotes.length > 0) {
                const midiNotes = chordNotes.map(note => {
                    const midiNum = Tonal.Midi.toMidi(note + '4');
                    return midiNum || 60; // fallback to middle C
                });
                
                track.addEvent(new MidiWriter.NoteEvent({
                    pitch: midiNotes,
                    duration: '1', // whole note
                    velocity: 80
                }));
            }
        });
        
        const write = new MidiWriter.Writer(track);
        return write.buildFile();
    } catch (error) {
        console.error('Error creating chord MIDI:', error);
        return null;
    }
}

function createSimpleBassMIDI(songData) {
    if (!window.MidiWriter) return null;
    
    try {
        const track = new MidiWriter.Track();
        track.setTempo(songData.tempo || 120);
        track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 33})); // Bass
        
        // Use bass line or chord roots
        let bassNotes = [];
        if (songData.bassLine && songData.bassLine.length > 0) {
            bassNotes = songData.bassLine.map(note => note.note || note);
        } else if (songData.chordProgression) {
            bassNotes = songData.chordProgression.chords.map(chord => {
                const chordInfo = Tonal.Chord.get(chord);
                return chordInfo.tonic || chord.charAt(0);
            });
        }
        
        bassNotes.forEach(note => {
            const midiNote = Tonal.Midi.toMidi(note + '2') || 36; // fallback to low C
            track.addEvent(new MidiWriter.NoteEvent({
                pitch: [midiNote],
                duration: '1', // whole note
                velocity: 90
            }));
        });
        
        const write = new MidiWriter.Writer(track);
        return write.buildFile();
    } catch (error) {
        console.error('Error creating bass MIDI:', error);
        return null;
    }
}

function createSimpleMelodyMIDI(songData) {
    if (!window.MidiWriter || !songData.melodyIdea) return null;
    
    try {
        const track = new MidiWriter.Track();
        track.setTempo(songData.tempo || 120);
        track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 1}));
        
        songData.melodyIdea.pattern.forEach(note => {
            const midiNote = Tonal.Midi.toMidi(note + '5') || 72; // fallback to high C
            track.addEvent(new MidiWriter.NoteEvent({
                pitch: [midiNote],
                duration: '4', // quarter note
                velocity: 75
            }));
        });
        
        const write = new MidiWriter.Writer(track);
        return write.buildFile();
    } catch (error) {
        console.error('Error creating melody MIDI:', error);
        return null;
    }
}

function createSimpleDrumMIDI(songData) {
    if (!window.MidiWriter || !songData.drumPattern) return null;
    
    try {
        const track = new MidiWriter.Track();
        track.setTempo(songData.tempo || 120);
        
        // Create a simple drum pattern
        const drumMap = { kick: 36, snare: 38, hihat: 42 };
        
        // Simple 4/4 pattern
        const pattern = [
            { drum: 'kick', beat: 1 },
            { drum: 'hihat', beat: 1.5 },
            { drum: 'snare', beat: 2 },
            { drum: 'hihat', beat: 2.5 },
            { drum: 'kick', beat: 3 },
            { drum: 'hihat', beat: 3.5 },
            { drum: 'snare', beat: 4 },
            { drum: 'hihat', beat: 4.5 }
        ];
        
        pattern.forEach(({ drum, beat }) => {
            track.addEvent(new MidiWriter.NoteEvent({
                pitch: [drumMap[drum] || 36],
                duration: '8', // eighth note
                velocity: 100,
                channel: 10 // drum channel
            }));
        });
        
        const write = new MidiWriter.Writer(track);
        return write.buildFile();
    } catch (error) {
        console.error('Error creating drum MIDI:', error);
        return null;
    }
}

function generateAbletonInstructions(songData) {
    return `ABLETON LIVE IMPORT INSTRUCTIONS
==============================

Your Music Machine song has been exported as MIDI files ready for Ableton Live!

QUICK START:
1. Open Ableton Live
2. Create a new Live Set
3. Drag and drop the MIDI files from the "MIDI Files" folder onto separate tracks
4. Assign instruments to each track:
   - 01_Chords.mid → Wavetable, Piano, or any harmonic instrument
   - 02_Bass.mid → Bass instrument or Operator in bass mode
   - 03_Melody.mid → Lead synth, Piano, or any melodic instrument
   - 04_Drums.mid → Drum Rack (Channel 10 for standard drum mapping)

SONG DETAILS:
- Title: ${songData.title || 'My Song'}
- Genre: ${songData.genre?.name || 'Unknown'}
- Key: ${songData.key || 'C'}
- Tempo: ${songData.tempo || 120} BPM
- Mood: ${songData.mood?.name || 'Unknown'}

SUGGESTED ABLETON INSTRUMENTS:
For ${songData.genre?.name || 'this genre'}:
${getAbletonInstrumentSuggestions(songData.genre?.id || 'pop')}

ARRANGEMENT TIPS:
${getArrangementTipsText(songData.genre?.id || 'pop')}

Need help? Check out Ableton's official tutorials or the Live manual for more details on working with MIDI files.

Generated with Music Machine v2.0
Happy music making! 🎵
`;
}

function getAbletonInstrumentSuggestions(genreId) {
    const suggestions = {
        'pop': `- Chords: Wavetable (Mallets & Bells > Warm Bell)
- Bass: Bass (Synth Bass > Sub Bass)
- Melody: Wavetable (Keys > Felt Piano)
- Effects: Reverb, Compressor, EQ Eight`,
        
        'rock': `- Chords: Amp + Cabinet (Clean guitar sound)
- Bass: Bass (Electric Bass > Vintage Electric)
- Melody: Amp + Overdrive (Lead guitar sound)
- Drums: Drum Rack (Rock kit)
- Effects: Amp, Overdrive, Reverb`,
        
        'edm': `- Chords: Wavetable (Synth Plucks > Pluck It)
- Bass: Wavetable (Synth Bass > Reese Bass)
- Melody: Wavetable (Synth Lead > Basic Lead)
- Effects: Reverb, Delay, Compressor, Auto Filter`,
        
        'jazz': `- Chords: Impulse (Jazz Piano) or Wavetable (Keys > EP Dirty)
- Bass: Bass (Acoustic Bass > Upright Bass)
- Melody: Wavetable (Keys > EP Clean)
- Effects: Reverb, Compressor`,
        
        'ambient': `- Chords: Wavetable (Pads > Warm Pad)
- Bass: Wavetable (Bass > Sub Bass)
- Melody: Wavetable (Pads > Evolving Pad)
- Effects: Reverb (Large Hall), Delay, Auto Filter`
    };
    
    return suggestions[genreId] || suggestions['pop'];
}

function getArrangementTipsText(genreId) {
    const tips = {
        'pop': 'Keep it simple and catchy. Use automation to create builds and drops.',
        'rock': 'Use distortion and reverb. Create dynamic contrast between verses and chorus.',
        'edm': 'Focus on the drop. Use risers, sweeps, and heavy compression.',
        'jazz': 'Leave space for improvisation. Use subtle swing timing.',
        'ambient': 'Create atmosphere with long reverbs and evolving textures.'
    };
    
    return tips[genreId] || tips['pop'];
}

function generateSongStructureFile(songData) {
    let structure = `SONG STRUCTURE
=============

`;
    
    if (songData.songStructure && songData.songStructure.length > 0) {
        structure += `Recommended structure for your ${songData.genre?.name || 'song'}:

`;
        songData.songStructure.forEach((section, index) => {
            structure += `${index + 1}. ${section}\n`;
        });
        
        structure += `\nArrangement suggestions:\n`;
        if (songData.arrangementTips) {
            Object.entries(songData.arrangementTips).forEach(([section, tip]) => {
                structure += `- ${section}: ${tip}\n`;
            });
        }
    } else {
        structure += `Basic song structure suggestion:
1. Intro
2. Verse
3. Chorus
4. Verse
5. Chorus
6. Bridge
7. Chorus
8. Outro

Customize this structure to fit your creative vision!
`;
    }
    
    return structure;
}

function getPresetFiles(genre) {
    return {
        'Chord_Preset.adv': JSON.stringify({ device: 'Wavetable', preset: 'Default' }),
        'Bass_Preset.adv': JSON.stringify({ device: 'Bass', preset: 'Default' }),
        'Drum_Kit.adg': JSON.stringify({ device: 'Drum Rack', samples: getDrumSamples(genre) })
    };
}

function getDrumSamples(genre) {
    const sampleMappings = {
        'electronic': {
            kick: 'Electronic_Kick.wav',
            snare: 'Electronic_Snare.wav',
            hihat: 'Electronic_HiHat.wav'
        },
        'rock': {
            kick: 'Rock_Kick.wav',
            snare: 'Rock_Snare.wav',
            hihat: 'Rock_HiHat.wav'
        }
    };
    
    return sampleMappings[genre?.id] || sampleMappings['electronic'];
}

function generateProjectReadme(songData) {
    return `MUSIC MACHINE PROJECT
===================

Project: ${songData.title || 'Untitled Song'}
Generated: ${new Date().toLocaleDateString()}

SONG DETAILS:
- Genre: ${songData.genre?.name || 'Unknown'}
- Mood: ${songData.mood?.name || 'Unknown'}
- Key: ${songData.key || 'C'}
- Tempo: ${songData.tempo || 120} BPM
- Scale: ${songData.scale || 'major'}

TRACK STRUCTURE:
1. Chords - Main harmonic foundation
2. Bass - Low-end rhythm and harmony
3. Lead - Melodic content
4. Drums - Rhythmic foundation
5. Harmony - Additional harmonic layers

INSTRUCTIONS:
1. Open this project in Ableton Live 12+
2. Load the included presets on each track
3. Adjust levels and effects to taste
4. Record your own parts or modify existing clips
5. Use the scene structure to arrange your song

Generated with Music Machine v2.0
`;
}

// ========== MIDI EXPORT FUNCTIONALITY ==========

export async function generateMIDITracks(songData, options = {}) {
    try {
        if (!window.MidiWriter) {
            // Fallback: generate text-based MIDI files info instead
            return generateMIDIFallback(songData, options);
        }
        
        const structuresData = await getSongStructuresData();
        const arrangement = getArrangementStructure(songData, structuresData, options.songLength || 'medium');
        
        const tracks = {};
        
        try {
            if (options.exportChords) {
                const chordTrack = generateChordTrack(songData, arrangement, options);
                if (chordTrack) tracks.chords = chordTrack;
            }
        } catch (error) {
            console.warn('Failed to generate chord track:', error);
        }
        
        try {
            if (options.exportBass) {
                const bassTrack = generateBassTrack(songData, arrangement, options);
                if (bassTrack) tracks.bass = bassTrack;
            }
        } catch (error) {
            console.warn('Failed to generate bass track:', error);
        }
        
        try {
            if (options.exportMelody) {
                const melodyTrack = generateMelodyTrack(songData, arrangement, options);
                if (melodyTrack) tracks.melody = melodyTrack;
            }
        } catch (error) {
            console.warn('Failed to generate melody track:', error);
        }
        
        try {
            if (options.exportDrums) {
                const drumTrack = generateDrumTrack(songData, arrangement, options);
                if (drumTrack) tracks.drums = drumTrack;
            }
        } catch (error) {
            console.warn('Failed to generate drum track:', error);
        }
        
        try {
            if (options.exportHarmony) {
                const harmonyTrack = generateHarmonyTrack(songData, arrangement, options);
                if (harmonyTrack) tracks.harmony = harmonyTrack;
            }
        } catch (error) {
            console.warn('Failed to generate harmony track:', error);
        }
        
        try {
            if (options.exportPads) {
                const padTrack = generatePadTrack(songData, arrangement, options);
                if (padTrack) tracks.pads = padTrack;
            }
        } catch (error) {
            console.warn('Failed to generate pad track:', error);
        }
        
        return {
            tracks,
            arrangement,
            metadata: {
                title: songData.title || 'Untitled Song',
                tempo: songData.tempo || 120,
                key: songData.key || 'C',
                timeSignature: [4, 4],
                duration: calculateTotalDuration(arrangement)
            }
        };
    } catch (error) {
        console.error('MIDI generation error:', error);
        throw error;
    }
}

function generateChordTrack(songData, arrangement, options) {
    if (!songData.chordProgression || !songData.chordProgression.chords) return null;
    
    const track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 1}));
    
    let currentTime = 0;
    arrangement.sections.forEach(section => {
        const sectionBars = section.bars;
        const chordsPerBar = Math.ceil(songData.chordProgression.chords.length / 4);
        
        for (let bar = 0; bar < sectionBars; bar++) {
            songData.chordProgression.chords.forEach((chord, index) => {
                const chordNotes = Tonal.Chord.get(chord).notes.slice(0, 4);
                const midiNotes = chordNotes.map(note => Tonal.Midi.toMidi(note + '4'));
                
                track.addEvent(new MidiWriter.NoteEvent({
                    pitch: midiNotes,
                    duration: 'q',
                    velocity: 70,
                    startTick: currentTime
                }));
                currentTime += 480; // Quarter note in ticks
            });
        }
    });
    
    const write = new MidiWriter.Writer(track);
    return write.buildFile();
}

function generateBassTrack(songData, arrangement, options) {
    if (!songData.bassLine && !songData.chordProgression) return null;
    
    const track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 33})); // Bass
    
    let currentTime = 0;
    
    // Generate bass notes from either bass line or chord roots
    let bassNotes = [];
    if (songData.bassLine && songData.bassLine.length > 0) {
        bassNotes = songData.bassLine.map(note => typeof note === 'object' ? note.note : note);
    } else if (songData.chordProgression && songData.chordProgression.chords) {
        bassNotes = songData.chordProgression.chords.map(chord => {
            const chordInfo = Tonal.Chord.get(chord);
            return chordInfo.tonic || chord.charAt(0);
        });
    }
    
    if (bassNotes.length === 0) return null;
    
    arrangement.sections.forEach(section => {
        const sectionBars = section.bars;
        
        for (let bar = 0; bar < sectionBars; bar++) {
            bassNotes.forEach((note, index) => {
                const midiNote = Tonal.Midi.toMidi(note + '2') || 36; // fallback to low C
                
                track.addEvent(new MidiWriter.NoteEvent({
                    pitch: [midiNote],
                    duration: 'q',
                    velocity: 85,
                    startTick: currentTime
                }));
                currentTime += 480;
            });
        }
    });
    
    const write = new MidiWriter.Writer(track);
    return write.buildFile();
}

function generateMelodyTrack(songData, arrangement, options) {
    if (!songData.melodyIdea || !songData.melodyIdea.pattern) return null;
    
    const track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 1}));
    
    let currentTime = 0;
    arrangement.sections.forEach(section => {
        const sectionBars = section.bars;
        
        for (let bar = 0; bar < sectionBars; bar++) {
            songData.melodyIdea.pattern.forEach((note, index) => {
                const midiNote = Tonal.Midi.toMidi(note + '5');
                
                track.addEvent(new MidiWriter.NoteEvent({
                    pitch: midiNote,
                    duration: '8',
                    velocity: 75,
                    startTick: currentTime
                }));
                currentTime += 240; // Eighth note
            });
        }
    });
    
    const write = new MidiWriter.Writer(track);
    return write.buildFile();
}

function generateDrumTrack(songData, arrangement, options) {
    if (!songData.drumPattern || !songData.drumPattern.pattern) return null;
    
    const track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 1, channel: 10})); // Drum channel
    
    let currentTime = 0;
    const drumMap = { kick: 36, snare: 38, hihat: 42, openhat: 46, crash: 49 };
    
    arrangement.sections.forEach(section => {
        const sectionBars = section.bars;
        
        for (let bar = 0; bar < sectionBars; bar++) {
            Object.entries(songData.drumPattern.pattern).forEach(([drum, pattern]) => {
                pattern.forEach((hit, index) => {
                    if (hit === 1) {
                        track.addEvent(new MidiWriter.NoteEvent({
                            pitch: drumMap[drum] || 36,
                            duration: '16',
                            velocity: 90,
                            startTick: currentTime + (index * 120),
                            channel: 10
                        }));
                    }
                });
            });
            currentTime += 1920; // One bar in ticks
        }
    });
    
    const write = new MidiWriter.Writer(track);
    return write.buildFile();
}

function generateHarmonyTrack(songData, arrangement, options) {
    if (!songData.chordProgression || !songData.chordProgression.chords) return null;
    
    const track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 49})); // String ensemble
    
    let currentTime = 0;
    arrangement.sections.forEach(section => {
        const sectionBars = section.bars;
        
        for (let bar = 0; bar < sectionBars; bar++) {
            songData.chordProgression.chords.forEach((chord, index) => {
                const chordNotes = Tonal.Chord.get(chord).notes.slice(1, 3); // Inner voices
                const midiNotes = chordNotes.map(note => Tonal.Midi.toMidi(note + '4'));
                
                track.addEvent(new MidiWriter.NoteEvent({
                    pitch: midiNotes,
                    duration: 'h',
                    velocity: 50,
                    startTick: currentTime
                }));
                currentTime += 960; // Half note
            });
        }
    });
    
    const write = new MidiWriter.Writer(track);
    return write.buildFile();
}

function generatePadTrack(songData, arrangement, options) {
    if (!songData.chordProgression || !songData.chordProgression.chords) return null;
    
    const track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 89})); // Warm pad
    
    let currentTime = 0;
    arrangement.sections.forEach(section => {
        const sectionBars = section.bars;
        
        for (let bar = 0; bar < sectionBars; bar++) {
            songData.chordProgression.chords.forEach((chord, index) => {
                const chordNotes = Tonal.Chord.get(chord).notes;
                const midiNotes = chordNotes.map(note => Tonal.Midi.toMidi(note + '3'));
                
                track.addEvent(new MidiWriter.NoteEvent({
                    pitch: midiNotes,
                    duration: 'w',
                    velocity: 40,
                    startTick: currentTime
                }));
                currentTime += 1920; // Whole note
            });
        }
    });
    
    const write = new MidiWriter.Writer(track);
    return write.buildFile();
}

function calculateTotalDuration(arrangement) {
    return arrangement.sections.reduce((total, section) => total + section.bars, 0) * 4; // Beats
}

function getArrangementStructure(songData, structuresData, songLength) {
    // structuresData is already the arrangements object from getSongStructuresData()
    const genreData = structuresData[songData.genre?.id] || structuresData.default;
    
    if (!genreData || !genreData.structures) {
        // Fallback structure if data is missing
        return {
            sections: [
                { name: 'Intro', bars: 4 },
                { name: 'Verse', bars: 16 },
                { name: 'Chorus', bars: 16 },
                { name: 'Outro', bars: 8 }
            ],
            totalBars: 44,
            duration: 2.5
        };
    }
    
    const structure = genreData.structures[songLength] || genreData.structures.medium;
    
    if (!structure) {
        // Fallback if specific length not found
        return {
            sections: [
                { name: 'Intro', bars: 4 },
                { name: 'Verse', bars: 16 },
                { name: 'Chorus', bars: 16 },
                { name: 'Outro', bars: 8 }
            ],
            totalBars: 44,
            duration: 2.5
        };
    }
    
    return {
        sections: structure.sections.map(sectionName => ({
            name: sectionName,
            bars: genreData.typical_bars[sectionName] || 8
        })),
        totalBars: structure.total_bars,
        duration: structure.duration_minutes
    };
}

function getBarLengthForSection(section, genre) {
    const defaultLengths = {
        'Intro': 4,
        'Verse': 16,
        'Chorus': 16,
        'Bridge': 16,
        'Outro': 8,
        'Solo': 32,
        'Hook': 8,
        'Pre-Chorus': 8,
        'Post-Chorus': 8,
        'Build-up': 16,
        'Drop': 32,
        'Breakdown': 16,
        'Head': 32,
        'Trading': 32,
        'Guitar Solo': 32,
        'Instrumental': 32
    };
    
    return defaultLengths[section] || 8;
}


function mapGenreToStructureKey(genreId) {
    const mapping = {
        'pop': 'pop',
        'rock': 'rock',
        'metal': 'rock',
        'edm': 'edm',
        'house': 'edm',
        'techno': 'edm',
        'dubstep': 'edm',
        'trance': 'edm',
        'jazz': 'jazz',
        'blues': 'blues',
        'hiphop': 'hiphop',
        'trap': 'hiphop',
        'reggae': 'reggae',
        'country': 'country'
    };
    return mapping[genreId] || 'default';
}

// Fallback MIDI generation when MidiWriter is not available
function generateMIDIFallback(songData, options) {
    console.warn('MidiWriter library not available, generating text-based MIDI information instead');
    
    const tracks = {};
    const midiInfo = {
        title: songData.title || 'My Song',
        key: songData.key || 'C',
        tempo: songData.tempo || 120,
        scale: songData.scale || 'major'
    };
    
    // Generate text representations of MIDI data
    if (options.exportChords && songData.chordProgression) {
        tracks.chords = generateChordInfo(songData.chordProgression, midiInfo);
    }
    
    if (options.exportBass && (songData.bassLine || songData.chordProgression)) {
        tracks.bass = generateBassInfo(songData, midiInfo);
    }
    
    if (options.exportMelody && songData.melodyIdea) {
        tracks.melody = generateMelodyInfo(songData.melodyIdea, midiInfo);
    }
    
    if (options.exportDrums && songData.drumPattern) {
        tracks.drums = generateDrumInfo(songData.drumPattern, midiInfo);
    }
    
    return {
        tracks,
        arrangement: { sections: [], totalBars: 0, duration: 0 },
        metadata: midiInfo,
        fallback: true
    };
}

function generateChordInfo(chordProgression, midiInfo) {
    return {
        name: `${midiInfo.title}_Chords`,
        type: 'text',
        content: `CHORD PROGRESSION MIDI DATA
Key: ${midiInfo.key}
Tempo: ${midiInfo.tempo} BPM
Chords: ${chordProgression.chords.join(' - ')}

MIDI Notes (approximate):
${chordProgression.chords.map((chord, i) => {
    const chordNotes = Tonal.Chord.get(chord).notes.slice(0, 4);
    return `Bar ${i + 1}: ${chord} (${chordNotes.join(', ')})`;
}).join('\n')}

Instructions for DAW import:
1. Create a new MIDI track
2. Set tempo to ${midiInfo.tempo} BPM
3. Manually enter the chord notes above
4. Each chord should be one bar (4 beats)
`
    };
}

function generateBassInfo(songData, midiInfo) {
    let bassNotes = [];
    if (songData.bassLine && songData.bassLine.length > 0) {
        bassNotes = songData.bassLine.map(note => typeof note === 'object' ? note.note : note);
    } else if (songData.chordProgression) {
        bassNotes = songData.chordProgression.chords.map(chord => {
            const chordInfo = Tonal.Chord.get(chord);
            return chordInfo.tonic || chord.charAt(0);
        });
    }
    
    return {
        name: `${midiInfo.title}_Bass`,
        type: 'text',
        content: `BASS LINE MIDI DATA
Key: ${midiInfo.key}
Tempo: ${midiInfo.tempo} BPM
Bass Notes: ${bassNotes.join(' - ')}

MIDI Notes (Low Octave):
${bassNotes.map((note, i) => `Bar ${i + 1}: ${note}2 (MIDI note ${Tonal.Midi.toMidi(note + '2') || 36})`).join('\n')}

Instructions for DAW import:
1. Create a bass track with a bass instrument
2. Set tempo to ${midiInfo.tempo} BPM
3. Enter the bass notes above in low octave (octave 2)
4. Each note should be one bar (4 beats)
`
    };
}

function generateMelodyInfo(melodyIdea, midiInfo) {
    return {
        name: `${midiInfo.title}_Melody`,
        type: 'text',
        content: `MELODY MIDI DATA
Key: ${midiInfo.key}
Tempo: ${midiInfo.tempo} BPM
Melody: ${melodyIdea.name}
Pattern: ${melodyIdea.pattern.join(' - ')}

MIDI Notes (High Octave):
${melodyIdea.pattern.map((note, i) => `Beat ${i + 1}: ${note}5 (MIDI note ${Tonal.Midi.toMidi(note + '5') || 72})`).join('\n')}

Instructions for DAW import:
1. Create a lead/melody track
2. Set tempo to ${midiInfo.tempo} BPM
3. Enter the melody notes above in high octave (octave 5)
4. Use eighth or quarter note timing
`
    };
}

function generateDrumInfo(drumPattern, midiInfo) {
    return {
        name: `${midiInfo.title}_Drums`,
        type: 'text',
        content: `DRUM PATTERN MIDI DATA
Tempo: ${midiInfo.tempo} BPM
Pattern: ${drumPattern.name}

Standard MIDI Drum Mapping:
- Kick Drum: MIDI note 36 (Channel 10)
- Snare Drum: MIDI note 38 (Channel 10)
- Hi-Hat: MIDI note 42 (Channel 10)

Basic 4/4 Pattern (repeat every bar):
Beat 1: Kick
Beat 1.5: Hi-Hat
Beat 2: Snare
Beat 2.5: Hi-Hat
Beat 3: Kick
Beat 3.5: Hi-Hat
Beat 4: Snare
Beat 4.5: Hi-Hat

Instructions for DAW import:
1. Create a drum track with a drum kit
2. Set tempo to ${midiInfo.tempo} BPM
3. Use Channel 10 for drums (standard MIDI)
4. Program the pattern above with appropriate velocities
`
    };
}

export function exportMIDIFiles(midiTracks) {
    const files = [];
    
    if (midiTracks.fallback) {
        // Handle fallback text files
        Object.entries(midiTracks.tracks).forEach(([trackType, trackData]) => {
            if (trackData && trackData.content) {
                files.push({
                    name: `${trackData.name}.txt`,
                    blob: new Blob([trackData.content], { type: 'text/plain' }),
                    type: trackType
                });
            }
        });
    } else {
        // Handle binary MIDI files
        Object.entries(midiTracks.tracks).forEach(([trackType, trackData]) => {
            if (trackData && trackData.length > 0) {
                files.push({
                    name: `${trackType}.mid`,
                    blob: new Blob([trackData], { type: 'audio/midi' }),
                    type: trackType
                });
            }
        });
    }
    
    return files;
}

export function downloadMIDIFiles(files) {
    files.forEach(file => {
        const url = URL.createObjectURL(file.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

