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
    const genrePatterns = patternsData[genre.id] || {};
    
    const patterns = Object.keys(genrePatterns).map(patternId => {
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
    
    // If no specific patterns for genre, provide generic patterns
    if (patterns.length === 0) {
        return [
            {
                id: 'basic-4-4',
                name: 'Basic 4/4',
                description: 'Standard rock/pop beat',
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
    
    return patterns;
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