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

// Get Roman numeral analysis for a chord in a given key
export function getChordFunction(chord, key) {
    if (!chord || !key || !window.Tonal) {
        return '';
    }

    try {
        // Clean up the key (remove any extra notation)
        const cleanKey = key.replace(/\s*(major|minor)\s*/i, '').trim();

        // Get the key's diatonic chords
        const majorKeyInfo = window.Tonal.Key.majorKey(cleanKey);
        const minorKeyInfo = window.Tonal.Key.minorKey(cleanKey);

        // Roman numerals for major and minor keys
        const majorNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
        const minorNumerals = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

        // Normalize chord name for comparison
        const normalizedChord = chord.replace(/[()]/g, '');

        // Check major key first
        if (majorKeyInfo.chords && majorKeyInfo.chords.length > 0) {
            const chordIndex = majorKeyInfo.chords.findIndex(keyChord => {
                // Handle different chord notation styles
                const normalizedKeyChord = keyChord.replace(/[()]/g, '');
                return normalizedKeyChord === normalizedChord ||
                       normalizedKeyChord.startsWith(normalizedChord) ||
                       normalizedChord.startsWith(normalizedKeyChord);
            });

            if (chordIndex !== -1) {
                return majorNumerals[chordIndex];
            }
        }

        // Check minor key
        if (minorKeyInfo.chords && minorKeyInfo.chords.length > 0) {
            const chordIndex = minorKeyInfo.chords.findIndex(keyChord => {
                const normalizedKeyChord = keyChord.replace(/[()]/g, '');
                return normalizedKeyChord === normalizedChord ||
                       normalizedKeyChord.startsWith(normalizedChord) ||
                       normalizedChord.startsWith(normalizedKeyChord);
            });

            if (chordIndex !== -1) {
                return minorNumerals[chordIndex];
            }
        }

        // If not found in diatonic chords, it might be a borrowed chord or secondary dominant
        // Try to find the root relationship
        const chordRoot = window.Tonal.Chord.get(chord).tonic;
        const keyRoot = cleanKey;

        if (chordRoot && keyRoot) {
            const interval = window.Tonal.Interval.distance(keyRoot, chordRoot);
            const semitones = window.Tonal.Interval.semitones(interval);

            // Map semitones to scale degrees
            const scaleDegreesMap = {
                0: 'I',   // Root
                2: 'ii',  // Second
                4: 'iii', // Third
                5: 'IV',  // Fourth
                7: 'V',   // Fifth
                9: 'vi',  // Sixth
                11: 'vii' // Seventh
            };

            const baseDegree = scaleDegreesMap[semitones % 12];
            if (baseDegree) {
                // Add quality indicators for non-diatonic chords
                const chordQuality = window.Tonal.Chord.get(chord).quality;
                if (chordQuality === 'major' && ['ii', 'iii', 'vi', 'vii'].includes(baseDegree)) {
                    return baseDegree.toUpperCase(); // Borrowed major chord
                } else if (chordQuality === 'minor' && ['I', 'IV', 'V'].includes(baseDegree)) {
                    return baseDegree.toLowerCase(); // Borrowed minor chord
                }
                return baseDegree;
            }
        }

        return ''; // Unknown function

    } catch (error) {
        console.warn('Error analyzing chord function:', error);
        return '';
    }
}

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

    // If no genre is provided, return ALL keys
    if (!genre) {
        const allKeysObj = getAllKeys();
        return allKeysObj.all; // Return all 24 keys (12 major + 12 minor)
    }

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

    // Remove duplicates and limit to reasonable number when genre IS selected
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

    // If no genre is provided, return ALL scales for maximum flexibility
    if (!genre) {
        return scaleOptions; // Return all 12 scale options
    }

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

    // If no genre is provided, just use mood's tempo range
    if (!genre) {
        return moodTempo;
    }

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

    // First, get genre-specific progressions from the genre's commonProgressions (if genre is provided)
    if (genre && genre.commonProgressions && genre.commonProgressions.length > 0) {
        genre.commonProgressions.forEach(progressionPattern => {
            // Try to find this progression in all categories
            for (const category of Object.keys(progressionsData)) {
                const categoryProgressions = progressionsData[category];

                // Handle modal subcategories
                if (category === 'modal') {
                    Object.keys(categoryProgressions).forEach(modalType => {
                        Object.keys(categoryProgressions[modalType]).forEach(progressionId => {
                            const progression = categoryProgressions[modalType][progressionId];
                            if (progression.numerals.join('-') === progressionPattern) {
                                const actualChords = convertNumeralsToChords(progression.numerals, key, modalType);
                                if (actualChords.length > 0) {
                                    progressions.push({
                                        name: `${progression.name} (${genre.name} ${modalType})`,
                                        description: progression.description,
                                        numerals: progression.numerals,
                                        chords: actualChords,
                                        id: `${modalType}-${progressionId}`,
                                        function: progression.function,
                                        priority: 'genre-specific'
                                    });
                                }
                            }
                        });
                    });
                } else {
                    // Handle regular categories
                    Object.keys(categoryProgressions).forEach(progressionId => {
                        const progression = categoryProgressions[progressionId];
                        if (progression.numerals.join('-') === progressionPattern) {
                            const actualChords = convertNumeralsToChords(progression.numerals, key, scale);
                            if (actualChords.length > 0) {
                                progressions.push({
                                    name: `${progression.name} (${genre.name})`,
                                    description: progression.description,
                                    numerals: progression.numerals,
                                    chords: actualChords,
                                    id: progressionId,
                                    function: progression.function,
                                    priority: 'genre-specific'
                                });
                            }
                        }
                    });
                }
            }
        });
    }

    // Then, add general categories as fallback
    let categories = [];

    // Determine base category based on scale type
    if (scale === 'major') {
        categories.push('major');
    } else if (scale === 'minor') {
        categories.push('minor');
    } else if (['dorian', 'phrygian', 'locrian', 'harmonic-minor', 'melodic-minor', 'pentatonic-minor'].includes(scale)) {
        // Minor-based modes and scales
        categories.push('minor');
        categories.push('modal'); // Also add modal progressions
    } else if (['lydian', 'mixolydian', 'pentatonic-major'].includes(scale)) {
        // Major-based modes and scales
        categories.push('major');
        categories.push('modal'); // Also add modal progressions
    } else if (scale === 'blues') {
        // Blues can work with both
        categories.push('minor', 'blues');
    }

    // If genre is not provided, show ALL categories for maximum variety
    if (!genre) {
        categories.push('jazz', 'blues', 'gospel', 'latin', 'funk', 'electronic', 'modal');
    } else {
        // Add specialized genre categories
        if (genre.id === 'jazz' || genre.id === 'bossanova') categories.push('jazz');
        if (genre.id === 'blues') categories.push('blues');
        if (genre.id === 'gospel') categories.push('gospel');
        if (genre.id === 'latin' || genre.id === 'bossanova') categories.push('latin');
        if (genre.id === 'funk') categories.push('funk');
        if (['edm', 'house', 'techno', 'dubstep', 'trance', 'trap'].includes(genre.id)) categories.push('electronic');

        // Add modal categories for appropriate genres
        if (['celtic', 'folk', 'jazz', 'metal', 'flamenco'].includes(genre.id)) {
            categories.push('modal');
        }
    }

    // Always include section-specific categories (verses, chorus, bridge)
    categories.push('verses', 'chorus', 'bridge');

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
    
    // Sort progressions to prioritize genre-specific ones
    const sortedProgressions = progressions.sort((a, b) => {
        // Genre-specific progressions come first
        if (a.priority === 'genre-specific' && b.priority !== 'genre-specific') return -1;
        if (b.priority === 'genre-specific' && a.priority !== 'genre-specific') return 1;
        return 0;
    });

    // Remove duplicates (same progression pattern)
    const uniqueProgressions = [];
    const seenPatterns = new Set();

    sortedProgressions.forEach(prog => {
        const pattern = prog.numerals.join('-');
        if (!seenPatterns.has(pattern)) {
            seenPatterns.add(pattern);
            uniqueProgressions.push(prog);
        }
    });

    // If genre is not provided, show more progressions for maximum variety
    const limit = !genre ? 40 : 20;
    return uniqueProgressions.slice(0, limit);
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

        // Map scale types to Tonal.js scale names
        const scaleMap = {
            'major': 'major',
            'minor': 'minor',
            'aeolian': 'aeolian',  // Same as natural minor
            'dorian': 'dorian',
            'phrygian': 'phrygian',
            'lydian': 'lydian',
            'mixolydian': 'mixolydian',
            'locrian': 'locrian',
            'harmonic-minor': 'harmonic minor',
            'melodic-minor': 'melodic minor ascending',
            'blues': 'blues',
            'pentatonic-major': 'major pentatonic',
            'pentatonic-minor': 'minor pentatonic'
        };

        // Get the correct scale name for Tonal.js
        const tonalScaleName = scaleMap[scale] || scale || 'major';

        // Get the scale notes using Tonal.js
        const scaleData = Tonal.Scale.get(`${cleanKey} ${tonalScaleName}`);
        const scaleNotes = scaleData.notes;

        if (!scaleNotes || scaleNotes.length === 0) {
            console.warn(`Could not get scale notes for ${cleanKey} ${tonalScaleName} (original: ${key} ${scale})`);
            // Fallback to major if scale doesn't work
            const fallbackScale = Tonal.Scale.get(`${cleanKey} major`);
            if (fallbackScale.notes && fallbackScale.notes.length > 0) {
                console.log(`Using major scale as fallback`);
                return convertSingleNumeralToChord(numeral, key, 'major');
            }
            return null;
        }

        // Parse the numeral
        const { degree, quality, extension } = parseNumeral(numeral);

        if (degree < 1 || degree > 7) return null;

        // Get the root note (adjust for 0-based array)
        const rootNote = scaleNotes[degree - 1];

        if (!rootNote) return null;

        // Build the chord based on quality and extension
        const isMinorScale = ['minor', 'aeolian', 'dorian', 'phrygian', 'harmonic-minor', 'melodic-minor', 'blues', 'pentatonic-minor'].includes(scale);
        return buildChord(rootNote, quality, extension, scaleNotes, degree, isMinorScale);

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

    // Extract Roman numeral degree - check longer patterns first to avoid partial matches
    if (/VII/i.test(cleanNumeral)) degree = 7;
    else if (/VI/i.test(cleanNumeral)) degree = 6;
    else if (/IV/i.test(cleanNumeral)) degree = 4;
    else if (/III/i.test(cleanNumeral)) degree = 3;
    else if (/II/i.test(cleanNumeral)) degree = 2;
    else if (/V/i.test(cleanNumeral)) degree = 5;  // V must come after VII, VI, IV
    else if (/I/i.test(cleanNumeral)) degree = 1;  // I must come last
    
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
    // No genre filtering - show ALL available drum patterns for maximum creativity!
    console.log('getDrumPatternsForGenre called with:', genre, 'patternsData keys:', Object.keys(patternsData));

    let allPatterns = [];

    // Add ALL patterns from every genre category
    Object.keys(patternsData).forEach(genreKey => {
        const genrePatterns = patternsData[genreKey] || {};
        console.log(`Processing genre: ${genreKey}, patterns:`, Object.keys(genrePatterns));

        Object.keys(genrePatterns).forEach(patternId => {
            const pattern = genrePatterns[patternId];
            allPatterns.push({
                id: `${genreKey}-${patternId}`,
                name: `${pattern.name} (${genreKey})`,
                description: pattern.description,
                pattern: pattern.pattern,
                grid: pattern.grid,
                tempo: pattern.tempo
            });
        });
    });

    console.log(`Total patterns found: ${allPatterns.length}`);
    
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
    
    console.log(`Returning ${uniquePatterns.length} unique patterns`);
    return uniquePatterns; // Show ALL patterns for maximum creativity!
}

// Bass pattern definitions for different styles
const bassPatterns = {
    'simple': {
        name: 'Simple Root',
        description: 'Root notes following chord changes',
        generate: (chords) => {
            const bassLine = [];
            chords.forEach((chord, index) => {
                const rootNote = getChordRoot(chord);
                bassLine.push({
                    note: rootNote,
                    rhythm: 'whole',
                    measure: index + 1,
                    beat: 1
                });
            });
            return bassLine;
        }
    },
    'walking': {
        name: 'Walking Bass',
        description: 'Jazz-style walking bass with passing tones',
        generate: (chords) => {
            const bassLine = [];
            chords.forEach((chord, index) => {
                const rootNote = getChordRoot(chord);
                bassLine.push({
                    note: rootNote,
                    rhythm: 'quarter',
                    measure: index + 1,
                    beat: 1
                });

                const nextChord = chords[index + 1];
                if (nextChord) {
                    const nextRoot = getChordRoot(nextChord);
                    const walkingNote = getWalkingNote(rootNote, nextRoot);
                    bassLine.push({
                        note: walkingNote,
                        rhythm: 'quarter',
                        measure: index + 1,
                        beat: 3
                    });
                }
            });
            return bassLine;
        }
    },
    'octave': {
        name: 'Octave Bass',
        description: 'Root note played in different octaves',
        generate: (chords) => {
            const bassLine = [];
            chords.forEach((chord, index) => {
                const rootNote = getChordRoot(chord);
                bassLine.push({
                    note: rootNote,
                    rhythm: 'quarter',
                    measure: index + 1,
                    beat: 1
                });
                bassLine.push({
                    note: rootNote,
                    rhythm: 'quarter',
                    measure: index + 1,
                    beat: 3,
                    octave: 'high'
                });
            });
            return bassLine;
        }
    },
    'fifths': {
        name: 'Root-Fifth',
        description: 'Alternating between root and fifth',
        generate: (chords) => {
            const bassLine = [];
            chords.forEach((chord, index) => {
                const rootNote = getChordRoot(chord);
                const fifthNote = getChordFifth(chord);
                bassLine.push({
                    note: rootNote,
                    rhythm: 'quarter',
                    measure: index + 1,
                    beat: 1
                });
                bassLine.push({
                    note: fifthNote,
                    rhythm: 'quarter',
                    measure: index + 1,
                    beat: 3
                });
            });
            return bassLine;
        }
    },
    'triads': {
        name: 'Triad Arpeggios',
        description: 'Playing through chord tones (1-3-5)',
        generate: (chords) => {
            const bassLine = [];
            chords.forEach((chord, index) => {
                const chordTones = getChordTones(chord);
                chordTones.slice(0, 3).forEach((note, toneIndex) => {
                    bassLine.push({
                        note: note,
                        rhythm: 'eighth',
                        measure: index + 1,
                        beat: 1 + (toneIndex * 0.5)
                    });
                });
            });
            return bassLine;
        }
    },
    'syncopated': {
        name: 'Syncopated Funk',
        description: 'Funky syncopated bass rhythm',
        generate: (chords) => {
            const bassLine = [];
            chords.forEach((chord, index) => {
                const rootNote = getChordRoot(chord);
                const chordTones = getChordTones(chord);

                bassLine.push({
                    note: rootNote,
                    rhythm: 'eighth',
                    measure: index + 1,
                    beat: 1
                });
                bassLine.push({
                    note: chordTones[2] || rootNote, // Fifth or root
                    rhythm: 'eighth',
                    measure: index + 1,
                    beat: 1.5
                });
                bassLine.push({
                    note: rootNote,
                    rhythm: 'quarter',
                    measure: index + 1,
                    beat: 2.5
                });
            });
            return bassLine;
        }
    },
    'pedal': {
        name: 'Pedal Tone',
        description: 'Sustained root note throughout',
        generate: (chords) => {
            const bassLine = [];
            const firstRoot = getChordRoot(chords[0]);
            chords.forEach((chord, index) => {
                bassLine.push({
                    note: firstRoot,
                    rhythm: 'whole',
                    measure: index + 1,
                    beat: 1
                });
            });
            return bassLine;
        }
    },
    'chromatic': {
        name: 'Chromatic Walk',
        description: 'Chromatic passing tones between chords',
        generate: (chords) => {
            const bassLine = [];
            chords.forEach((chord, index) => {
                const rootNote = getChordRoot(chord);
                bassLine.push({
                    note: rootNote,
                    rhythm: 'quarter',
                    measure: index + 1,
                    beat: 1
                });

                const nextChord = chords[index + 1];
                if (nextChord) {
                    const nextRoot = getChordRoot(nextChord);
                    const chromaticNote = getChromaticPassingTone(rootNote, nextRoot);
                    bassLine.push({
                        note: chromaticNote,
                        rhythm: 'quarter',
                        measure: index + 1,
                        beat: 3
                    });
                }
            });
            return bassLine;
        }
    },
    'reggae': {
        name: 'Reggae One-Drop',
        description: 'Reggae-style bass with emphasis on off-beats',
        generate: (chords) => {
            const bassLine = [];
            chords.forEach((chord, index) => {
                const rootNote = getChordRoot(chord);
                bassLine.push({
                    note: rootNote,
                    rhythm: 'quarter',
                    measure: index + 1,
                    beat: 2
                });
                bassLine.push({
                    note: rootNote,
                    rhythm: 'quarter',
                    measure: index + 1,
                    beat: 4
                });
            });
            return bassLine;
        }
    },
    'latin': {
        name: 'Latin Montuno',
        description: 'Latin-style bass pattern with syncopation',
        generate: (chords) => {
            const bassLine = [];
            chords.forEach((chord, index) => {
                const rootNote = getChordRoot(chord);
                const fifthNote = getChordFifth(chord);

                bassLine.push({
                    note: rootNote,
                    rhythm: 'eighth',
                    measure: index + 1,
                    beat: 1
                });
                bassLine.push({
                    note: fifthNote,
                    rhythm: 'eighth',
                    measure: index + 1,
                    beat: 2.5
                });
                bassLine.push({
                    note: rootNote,
                    rhythm: 'eighth',
                    measure: index + 1,
                    beat: 4
                });
            });
            return bassLine;
        }
    },
    'syncopated-funk': {
        name: 'Modern Funk Syncopation',
        description: 'Punchy syncopated groove with octave and approach tones',
        generate: (chords) => {
            const bassLine = [];
            chords.forEach((chord, index) => {
                const rootNote = getChordRoot(chord);
                const fifthNote = getChordFifth(chord);
                const nextChord = chords[index + 1];
                const nextRoot = nextChord ? getChordRoot(nextChord) : null;

                bassLine.push({
                    note: rootNote,
                    rhythm: 'eighth',
                    measure: index + 1,
                    beat: 1
                });

                bassLine.push({
                    note: rootNote,
                    rhythm: 'sixteenth',
                    measure: index + 1,
                    beat: 1.75,
                    octave: 'high'
                });

                const seventhNote = getChordSeventh(chord);
                bassLine.push({
                    note: seventhNote,
                    rhythm: 'eighth',
                    measure: index + 1,
                    beat: 2.5
                });

                bassLine.push({
                    note: fifthNote,
                    rhythm: 'eighth',
                    measure: index + 1,
                    beat: 3
                });

                if (nextRoot) {
                    bassLine.push({
                        note: getApproachTone(rootNote, nextRoot),
                        rhythm: 'sixteenth',
                        measure: index + 1,
                        beat: 3.75
                    });

                    bassLine.push({
                        note: nextRoot,
                        rhythm: 'eighth',
                        measure: index + 1,
                        beat: 4,
                        octave: 'high'
                    });
                } else {
                    bassLine.push({
                        note: rootNote,
                        rhythm: 'quarter',
                        measure: index + 1,
                        beat: 4
                    });
                }
            });
            return bassLine;
        }
    },
    'motown-soul': {
        name: 'Motown Soul',
        description: 'Classic R&B bounce with expressive passing tones',
        generate: (chords) => {
            const bassLine = [];
            chords.forEach((chord, index) => {
                const rootNote = getChordRoot(chord);
                const thirdNote = getChordThird(chord);
                const fifthNote = getChordFifth(chord);
                const sixthNote = getChordSixth(chord);
                const nextChord = chords[index + 1];
                const nextRoot = nextChord ? getChordRoot(nextChord) : null;

                bassLine.push({
                    note: rootNote,
                    rhythm: 'eighth',
                    measure: index + 1,
                    beat: 1
                });

                bassLine.push({
                    note: thirdNote,
                    rhythm: 'eighth',
                    measure: index + 1,
                    beat: 1.5
                });

                bassLine.push({
                    note: fifthNote,
                    rhythm: 'eighth',
                    measure: index + 1,
                    beat: 2
                });

                bassLine.push({
                    note: sixthNote,
                    rhythm: 'eighth',
                    measure: index + 1,
                    beat: 2.5
                });

                if (nextRoot) {
                    bassLine.push({
                        note: getApproachTone(rootNote, nextRoot),
                        rhythm: 'eighth',
                        measure: index + 1,
                        beat: 3.5
                    });

                    bassLine.push({
                        note: nextRoot,
                        rhythm: 'eighth',
                        measure: index + 1,
                        beat: 4,
                        octave: 'high'
                    });
                } else {
                    bassLine.push({
                        note: rootNote,
                        rhythm: 'quarter',
                        measure: index + 1,
                        beat: 4
                    });
                }
            });
            return bassLine;
        }
    },
    'disco-octave': {
        name: 'Disco Octaves',
        description: 'Driving octave pulse inspired by classic dance bass lines',
        generate: (chords) => {
            const bassLine = [];
            chords.forEach((chord, index) => {
                const rootNote = getChordRoot(chord);
                const fifthNote = getChordFifth(chord);
                const nextChord = chords[index + 1];
                const nextRoot = nextChord ? getChordRoot(nextChord) : null;

                bassLine.push({
                    note: rootNote,
                    rhythm: 'eighth',
                    measure: index + 1,
                    beat: 1
                });

                bassLine.push({
                    note: rootNote,
                    rhythm: 'eighth',
                    measure: index + 1,
                    beat: 1.5,
                    octave: 'high'
                });

                bassLine.push({
                    note: rootNote,
                    rhythm: 'eighth',
                    measure: index + 1,
                    beat: 2
                });

                bassLine.push({
                    note: rootNote,
                    rhythm: 'eighth',
                    measure: index + 1,
                    beat: 2.5,
                    octave: 'high'
                });

                bassLine.push({
                    note: fifthNote,
                    rhythm: 'eighth',
                    measure: index + 1,
                    beat: 3
                });

                bassLine.push({
                    note: fifthNote,
                    rhythm: 'eighth',
                    measure: index + 1,
                    beat: 3.5,
                    octave: 'high'
                });

                if (nextRoot) {
                    bassLine.push({
                        note: getApproachTone(rootNote, nextRoot),
                        rhythm: 'eighth',
                        measure: index + 1,
                        beat: 4
                    });
                } else {
                    bassLine.push({
                        note: rootNote,
                        rhythm: 'eighth',
                        measure: index + 1,
                        beat: 4
                    });
                }
            });
            return bassLine;
        }
    }
};

export function generateBassLine(chordProgression, patternType = 'simple') {
    if (!chordProgression || !chordProgression.chords) {
        return [];
    }

    const pattern = bassPatterns[patternType];
    if (!pattern) {
        console.warn(`Unknown bass pattern: ${patternType}, using simple`);
        return bassPatterns.simple.generate(chordProgression.chords);
    }

    try {
        return pattern.generate(chordProgression.chords);
    } catch (error) {
        console.error(`Error generating ${patternType} bass line:`, error);
        return bassPatterns.simple.generate(chordProgression.chords);
    }
}

// Get all available bass patterns for the UI
export function getAvailableBassPatterns() {
    return Object.keys(bassPatterns).map(key => ({
        id: key,
        name: bassPatterns[key].name,
        description: bassPatterns[key].description
    }));
}

// Helper functions for bass line generation
function getChordRoot(chord) {
    try {
        const chordInfo = Tonal.Chord.get(chord);
        return chordInfo.tonic || chord.replace(/[^A-G#b]/g, '');
    } catch (error) {
        return chord.charAt(0);
    }
}

function getChordFifth(chord) {
    try {
        const chordInfo = Tonal.Chord.get(chord);
        const notes = chordInfo.notes;
        return notes[2] || notes[0]; // Fifth or fallback to root
    } catch (error) {
        return getChordRoot(chord);
    }
}

function getChordThird(chord) {
    try {
        const chordInfo = Tonal.Chord.get(chord);
        if (chordInfo.notes && chordInfo.notes.length > 1) {
            return chordInfo.notes[1];
        }

        const root = getChordRoot(chord);
        const interval = isMinorChord(chord) ? '3m' : '3M';
        const third = Tonal.Note.transpose(root, interval);
        return Tonal.Note.enharmonic(third) || third || root;
    } catch (error) {
        const root = getChordRoot(chord);
        const interval = isMinorChord(chord) ? '3m' : '3M';
        const third = Tonal.Note.transpose(root, interval);
        return Tonal.Note.enharmonic(third) || third || root;
    }
}

function getChordSixth(chord) {
    try {
        const root = getChordRoot(chord);
        const interval = isMinorChord(chord) ? '6m' : '6M';
        const sixth = Tonal.Note.transpose(root, interval);
        return Tonal.Note.enharmonic(sixth) || sixth || root;
    } catch (error) {
        return getChordRoot(chord);
    }
}

function getChordSeventh(chord) {
    try {
        const chordInfo = Tonal.Chord.get(chord);
        if (chordInfo.notes && chordInfo.notes.length > 3) {
            return chordInfo.notes[3];
        }

        const root = getChordRoot(chord);
        const symbol = (chordInfo.symbol || chord).toLowerCase();
        const isMajorSeventh = symbol.includes('maj7') || symbol.includes('maj9') || symbol.includes('Δ');
        const interval = isMajorSeventh ? '7M' : '7m';
        const seventh = Tonal.Note.transpose(root, interval);
        return Tonal.Note.enharmonic(seventh) || seventh || root;
    } catch (error) {
        const root = getChordRoot(chord);
        const seventh = Tonal.Note.transpose(root, '7m');
        return Tonal.Note.enharmonic(seventh) || seventh || root;
    }
}

function getApproachTone(currentRoot, nextRoot) {
    try {
        const currentMidi = Tonal.Note.midi(currentRoot);
        const nextMidi = Tonal.Note.midi(nextRoot);

        if (nextMidi === null) return currentRoot;

        if (currentMidi === null) {
            const below = Tonal.Note.transpose(nextRoot, '-2m');
            return Tonal.Note.enharmonic(below) || below || nextRoot;
        }

        const directionInterval = nextMidi >= currentMidi ? '-2m' : '2m';
        const approach = Tonal.Note.transpose(nextRoot, directionInterval);
        return Tonal.Note.enharmonic(approach) || approach || nextRoot;
    } catch (error) {
        return nextRoot;
    }
}

function isMinorChord(chord) {
    if (!chord) return false;
    try {
        const chordInfo = Tonal.Chord.get(chord);
        if (chordInfo?.quality) {
            const quality = chordInfo.quality.toLowerCase();
            if (quality.includes('minor') || quality.includes('diminished')) {
                return true;
            }
            if (quality.includes('major')) {
                return false;
            }
        }
    } catch (error) {
        // Fall back to string inspection below
    }

    const normalized = chord.toLowerCase();
    if (normalized.includes('maj')) return false;
    return normalized.includes('min') || /(?:^|[^a-z])m(?![aj])/i.test(chord);
}

function getChordTones(chord) {
    try {
        const chordInfo = Tonal.Chord.get(chord);
        return chordInfo.notes || [getChordRoot(chord)];
    } catch (error) {
        return [getChordRoot(chord)];
    }
}

function getChromaticPassingTone(currentRoot, nextRoot) {
    try {
        const currentMidi = Tonal.Note.midi(currentRoot);
        const nextMidi = Tonal.Note.midi(nextRoot);

        if (currentMidi === null || nextMidi === null) {
            const fallback = Tonal.Note.transpose(currentRoot, '2m');
            return Tonal.Note.enharmonic(fallback) || fallback || currentRoot;
        }

        if (currentMidi === nextMidi) {
            const fifth = Tonal.Note.transpose(currentRoot, '5P');
            return Tonal.Note.enharmonic(fifth) || fifth || currentRoot;
        }

        const interval = nextMidi > currentMidi ? '2m' : '-2m';
        const passingTone = Tonal.Note.transpose(currentRoot, interval);
        return Tonal.Note.enharmonic(passingTone) || passingTone || currentRoot;
    } catch (error) {
        return currentRoot;
    }
}

function getWalkingNote(currentRoot, nextRoot) {
    try {
        const currentMidi = Tonal.Note.midi(currentRoot);
        const nextMidi = Tonal.Note.midi(nextRoot);

        if (currentMidi === null || nextMidi === null) {
            const fallback = Tonal.Note.transpose(currentRoot, '2M');
            return Tonal.Note.enharmonic(fallback) || fallback || currentRoot;
        }

        if (currentMidi === nextMidi) {
            const fifth = Tonal.Note.transpose(currentRoot, '5P');
            return Tonal.Note.enharmonic(fifth) || fifth || currentRoot;
        }

        const stepInterval = nextMidi > currentMidi ? '2M' : '-2M';
        const walking = Tonal.Note.transpose(currentRoot, stepInterval);
        if (walking) {
            return Tonal.Note.enharmonic(walking) || walking;
        }

        return getChromaticPassingTone(currentRoot, nextRoot);

    } catch (error) {
        console.warn('Error calculating walking note:', error);
        return currentRoot;
    }
}

export function generateMelodyIdeas(key, chordProgression, scale = 'major') {
    try {
        const scaleNotes = getScaleNotesForKey(key, scale);
        const melodyIdeas = [];

        // Comprehensive melody patterns inspired by real songs and genres
        const patterns = [
            // Classic/Pop Patterns
            {
                name: 'Hook Line',
                description: 'Catchy repetitive phrase perfect for pop hooks',
                pattern: [scaleNotes[0], scaleNotes[2], scaleNotes[4], scaleNotes[2], scaleNotes[0]],
                rhythm: 'quarter',
                difficulty: 'easy',
                genre: 'pop'
            },
            {
                name: 'Call and Response',
                description: 'Question-answer melodic phrases',
                pattern: [scaleNotes[0], scaleNotes[2], scaleNotes[4], scaleNotes[7], scaleNotes[4], scaleNotes[2], scaleNotes[0]],
                rhythm: 'eighth',
                difficulty: 'medium',
                genre: 'pop'
            },
            {
                name: 'Stepwise Motion',
                description: 'Smooth melodic line moving by steps',
                pattern: scaleNotes.slice(0, 6),
                rhythm: 'quarter',
                difficulty: 'easy',
                genre: 'ballad'
            },

            // Rock/Aggressive Patterns
            {
                name: 'Power Melody',
                description: 'Strong, angular melody for rock vocals',
                pattern: [scaleNotes[0], scaleNotes[4], scaleNotes[7], scaleNotes[4], scaleNotes[0]],
                rhythm: 'quarter',
                difficulty: 'easy',
                genre: 'rock'
            },
            {
                name: 'Octave Jumps',
                description: 'Dynamic leaps for dramatic effect',
                pattern: [scaleNotes[0], scaleNotes[7], scaleNotes[2], scaleNotes[4]],
                rhythm: 'quarter',
                difficulty: 'hard',
                genre: 'rock'
            },

            // Jazz/Blues Patterns
            {
                name: 'Blue Note Melody',
                description: 'Incorporates blue notes for soulful feel',
                pattern: getPentatonicBluesNotes(key, scale),
                rhythm: 'swung-eighth',
                difficulty: 'medium',
                genre: 'blues'
            },
            {
                name: 'Chord Tone Outline',
                description: 'Follows chord changes with strong harmonic connection',
                pattern: getMelodyChordTones(chordProgression, scaleNotes),
                rhythm: 'quarter',
                difficulty: 'medium',
                genre: 'jazz'
            },
            {
                name: 'Bebop Line',
                description: 'Fast-moving jazz-style melodic line',
                pattern: getBebopScaleNotes(key, scale),
                rhythm: 'eighth',
                difficulty: 'hard',
                genre: 'jazz'
            },

            // World/Ethnic Patterns
            {
                name: 'Pentatonic Flow',
                description: 'Universal pentatonic scale for world appeal',
                pattern: getPentatonicNotes(key, scale),
                rhythm: 'quarter',
                difficulty: 'easy',
                genre: 'world'
            },
            {
                name: 'Modal Melody',
                description: 'Exotic modal scales for unique character',
                pattern: getModalNotes(key, 'dorian'),
                rhythm: 'quarter',
                difficulty: 'medium',
                genre: 'world'
            },

            // R&B/Soul Patterns
            {
                name: 'Melismatic Run',
                description: 'Flowing runs typical of R&B vocals',
                pattern: [...scaleNotes.slice(0, 5), ...scaleNotes.slice(2, 7).reverse()],
                rhythm: 'sixteenth',
                difficulty: 'hard',
                genre: 'rnb'
            },
            {
                name: 'Gospel Phrases',
                description: 'Soulful phrases with tension and release',
                pattern: [scaleNotes[0], scaleNotes[2], scaleNotes[3], scaleNotes[4], scaleNotes[2], scaleNotes[0]],
                rhythm: 'syncopated',
                difficulty: 'medium',
                genre: 'gospel'
            },

            // Electronic/Modern Patterns
            {
                name: 'Synth Arp Pattern',
                description: 'Arpeggiated pattern perfect for electronic music',
                pattern: getArpeggioNotes(chordProgression),
                rhythm: 'sixteenth',
                difficulty: 'medium',
                genre: 'electronic'
            },
            {
                name: 'Vocal Chop Style',
                description: 'Short, choppy phrases typical of modern production',
                pattern: [scaleNotes[0], scaleNotes[2], scaleNotes[4]],
                rhythm: 'staccato',
                difficulty: 'easy',
                genre: 'electronic'
            },

            // Country/Folk Patterns
            {
                name: 'Country Storytelling',
                description: 'Simple, narrative-friendly melody',
                pattern: [scaleNotes[0], scaleNotes[2], scaleNotes[4], scaleNotes[2], scaleNotes[0]],
                rhythm: 'quarter',
                difficulty: 'easy',
                genre: 'country'
            },
            {
                name: 'Folk Motif',
                description: 'Traditional folk-style melodic fragment',
                pattern: [scaleNotes[0], scaleNotes[1], scaleNotes[2], scaleNotes[0]],
                rhythm: 'quarter',
                difficulty: 'easy',
                genre: 'folk'
            },

            // Experimental/Advanced
            {
                name: 'Chromatic Approach',
                description: 'Uses chromatic notes for sophisticated harmony',
                pattern: getChromaticMelodyNotes(scaleNotes),
                rhythm: 'eighth',
                difficulty: 'hard',
                genre: 'jazz'
            },
            {
                name: 'Motivic Development',
                description: 'Short motif that can be developed and varied',
                pattern: [scaleNotes[0], scaleNotes[2], scaleNotes[4], scaleNotes[1]],
                rhythm: 'quarter',
                difficulty: 'easy',
                genre: 'classical'
            },
            {
                name: 'Interval Leaps',
                description: 'Large interval jumps for dramatic effect',
                pattern: [scaleNotes[0], scaleNotes[4], scaleNotes[1], scaleNotes[6]],
                rhythm: 'quarter',
                difficulty: 'hard',
                genre: 'contemporary'
            }
        ];

        // Filter out any patterns with undefined notes and return
        return patterns.map(pattern => ({
            ...pattern,
            pattern: pattern.pattern.filter(note => note && typeof note === 'string')
        })).filter(pattern => pattern.pattern.length > 0);
    } catch (error) {
        console.error('Error generating melody ideas:', error);
        return [];
    }
}

// Helper functions for the new melody patterns
function getPentatonicBluesNotes(key, scale) {
    try {
        const scaleNotes = getScaleNotesForKey(key, scale);
        if (!scaleNotes || scaleNotes.length < 7) {
            return ['C', 'E', 'F', 'G', 'B']; // Fallback C pentatonic
        }
        // Pentatonic with blue notes (b3, b5, b7)
        return [scaleNotes[0], scaleNotes[2], scaleNotes[3], scaleNotes[4], scaleNotes[6]].filter(note => note);
    } catch (error) {
        return ['C', 'E', 'F', 'G', 'B']; // Fallback C pentatonic
    }
}

function getBebopScaleNotes(key, scale) {
    try {
        const scaleNotes = getScaleNotesForKey(key, scale);
        if (!scaleNotes || scaleNotes.length < 7) {
            return ['C', 'D', 'E', 'F', 'G', 'A', 'B']; // Fallback C major
        }
        // Bebop scale adds chromatic passing tones
        return [...scaleNotes.slice(0, 4), ...scaleNotes.slice(2, 6)].filter(note => note);
    } catch (error) {
        return ['C', 'D', 'E', 'F', 'G', 'A', 'B']; // Fallback C major
    }
}

function getModalNotes(key, mode = 'dorian') {
    try {
        // Simple modal implementation - could be expanded
        const scaleNotes = getScaleNotesForKey(key, 'major');
        if (!scaleNotes || scaleNotes.length < 7) {
            return ['C', 'D', 'E', 'F', 'G', 'A', 'B']; // Fallback C major
        }
        switch (mode) {
            case 'dorian':
                return [scaleNotes[1], scaleNotes[2], scaleNotes[3], scaleNotes[4], scaleNotes[5], scaleNotes[6], scaleNotes[0]].filter(note => note);
            case 'mixolydian':
                return [scaleNotes[4], scaleNotes[5], scaleNotes[6], scaleNotes[0], scaleNotes[1], scaleNotes[2], scaleNotes[3]].filter(note => note);
            default:
                return scaleNotes.filter(note => note);
        }
    } catch (error) {
        return ['C', 'D', 'E', 'F', 'G', 'A', 'B']; // Fallback C major
    }
}

function getChromaticMelodyNotes(scaleNotes) {
    try {
        if (!scaleNotes || scaleNotes.length === 0) {
            return ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G']; // Fallback chromatic
        }
        // Add chromatic passing tones between scale degrees
        const chromatic = [];
        for (let i = 0; i < Math.min(scaleNotes.length - 1, 4); i++) {
            if (scaleNotes[i]) {
                chromatic.push(scaleNotes[i]);
                // Add chromatic note between current and next scale degree (simplified)
                chromatic.push(`${scaleNotes[i]}#`);
            }
        }
        return chromatic.filter(note => note).slice(0, 8); // Limit length and filter out undefined
    } catch (error) {
        return ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G']; // Fallback chromatic
    }
}

function getScaleNotesForKey(key, scale) {
    try {
        const cleanKey = key.replace('m', '');

        // Map scale types to Tonal.js scale names (consistent with convertSingleNumeralToChord)
        const scaleMap = {
            'major': 'major',
            'minor': 'minor',
            'aeolian': 'aeolian',
            'dorian': 'dorian',
            'phrygian': 'phrygian',
            'lydian': 'lydian',
            'mixolydian': 'mixolydian',
            'locrian': 'locrian',
            'harmonic-minor': 'harmonic minor',
            'melodic-minor': 'melodic minor ascending',
            'blues': 'blues',
            'pentatonic-major': 'major pentatonic',
            'pentatonic-minor': 'minor pentatonic'
        };

        const tonalScaleName = scaleMap[scale] || scale || 'major';
        const scaleInfo = Tonal.Scale.get(`${cleanKey} ${tonalScaleName}`);

        if (!scaleInfo.notes || scaleInfo.notes.length === 0) {
            console.warn(`Could not get scale notes for ${cleanKey} ${tonalScaleName}`);
            // Fallback to basic major scale
            return Tonal.Scale.get(`${cleanKey} major`).notes || ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        }

        return scaleInfo.notes;

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

function getMelodyChordTones(chordProgression, scaleNotes) {
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
        ],
        'country': [
            { name: 'Country Standard', sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Instrumental', 'Chorus', 'Outro'] },
            { name: 'Country Ballad', sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro'] }
        ],
        'soul': [
            { name: 'Soul Classic', sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro'] },
            { name: 'Soul Gospel', sections: ['Call', 'Response', 'Verse', 'Chorus', 'Call', 'Response', 'Chorus'] }
        ],
        'gospel': [
            { name: 'Gospel Traditional', sections: ['Call', 'Response', 'Verse', 'Chorus', 'Call', 'Response', 'Chorus'] },
            { name: 'Gospel Contemporary', sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro'] }
        ],
        'reggae': [
            { name: 'Reggae Standard', sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro'] },
            { name: 'Reggae Roots', sections: ['Verse', 'Chorus', 'Verse', 'Chorus', 'Toasting', 'Chorus', 'Outro'] }
        ],
        'ska': [
            { name: 'Ska Upbeat', sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Horn Section', 'Chorus', 'Outro'] }
        ],
        'funk': [
            { name: 'Funk Groove', sections: ['Intro Groove', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Breakdown', 'Groove Out', 'Outro'] },
            { name: 'Funk Vamp', sections: ['Groove In', 'Verse', 'Hook', 'Verse', 'Hook', 'Solo Section', 'Hook', 'Groove Out'] }
        ],
        'rnb': [
            { name: 'R&B Classic', sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro'] },
            { name: 'R&B Smooth', sections: ['Intro', 'Verse', 'Pre-Chorus', 'Chorus', 'Verse', 'Pre-Chorus', 'Chorus', 'Bridge', 'Chorus', 'Outro'] }
        ],
        'techno': [
            { name: 'Techno Loop', sections: ['Intro', 'Build', 'Main Loop', 'Breakdown', 'Build', 'Main Loop', 'Outro'] },
            { name: 'Techno Minimal', sections: ['Layer 1', 'Layer 2', 'Layer 3', 'Full', 'Strip Down', 'Build', 'Full', 'Outro'] }
        ],
        'trance': [
            { name: 'Trance Euphoric', sections: ['Intro', 'Breakdown', 'Build-up', 'Climax', 'Breakdown', 'Build-up', 'Climax', 'Outro'] },
            { name: 'Trance Progressive', sections: ['Intro', 'Layer Build', 'Peak', 'Breakdown', 'Layer Build', 'Peak', 'Resolution'] }
        ],
        'trap': [
            { name: 'Trap Standard', sections: ['Intro', 'Verse', 'Hook', 'Verse', 'Hook', 'Bridge', 'Hook', 'Outro'] },
            { name: 'Trap Hard', sections: ['Tag', 'Verse', 'Hook', 'Verse', 'Hook', 'Switch', 'Hook', 'Tag'] }
        ],
        'afrobeat': [
            { name: 'Afrobeat Extended', sections: ['Intro', 'Verse', 'Call-Response', 'Verse', 'Call-Response', 'Solo Section', 'Call-Response', 'Outro'] },
            { name: 'Afrobeat Traditional', sections: ['Groove In', 'Vocal Entry', 'Horn Section', 'Vocal Section', 'Extended Jam', 'Vocal Return', 'Groove Out'] }
        ],
        'latin': [
            { name: 'Latin Standard', sections: ['Intro', 'Verso', 'Coro', 'Verso', 'Coro', 'Puente', 'Coro', 'Outro'] },
            { name: 'Latin Salsa', sections: ['Intro', 'Montuno', 'Verso', 'Coro', 'Mambo', 'Coro', 'Outro'] }
        ],
        'bossanova': [
            { name: 'Bossa Nova', sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Solo', 'Chorus', 'Outro'] },
            { name: 'Bossa AABA', sections: ['A Section', 'A Section', 'B Section', 'A Section'] }
        ],
        'flamenco': [
            { name: 'Flamenco Traditional', sections: ['Entrada', 'Letra', 'Falseta', 'Letra', 'Falseta', 'Escobilla', 'Final'] },
            { name: 'Flamenco Modern', sections: ['Intro', 'Verse', 'Chorus', 'Guitar Solo', 'Verse', 'Chorus', 'Outro'] }
        ],
        'celtic': [
            { name: 'Celtic Reel', sections: ['A Part', 'A Part', 'B Part', 'B Part'] },
            { name: 'Celtic Song', sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Instrumental', 'Chorus', 'Outro'] }
        ],
        'bluegrass': [
            { name: 'Bluegrass Standard', sections: ['Intro', 'Verse', 'Chorus', 'Instrumental', 'Verse', 'Chorus', 'Instrumental', 'Chorus'] },
            { name: 'Bluegrass Jam', sections: ['Head', 'Solo 1', 'Solo 2', 'Solo 3', 'Head', 'Tag'] }
        ],
        'newage': [
            { name: 'New Age Flow', sections: ['Gentle Intro', 'Theme', 'Development', 'Peak', 'Resolution', 'Fade'] },
            { name: 'New Age Meditation', sections: ['Calm Opening', 'Spiritual Journey', 'Transcendence', 'Return', 'Peace'] }
        ],
        'lofi': [
            { name: 'Lo-fi Study', sections: ['Vinyl Intro', 'Main Loop', 'Variation 1', 'Main Loop', 'Variation 2', 'Main Loop', 'Fade'] },
            { name: 'Lo-fi Chill', sections: ['Atmospheric Intro', 'Beat Drop', 'Melody Enter', 'Full Arrangement', 'Stripped Back', 'Outro'] }
        ],
        'chillhop': [
            { name: 'Chillhop Relax', sections: ['Ambient Intro', 'Beat In', 'Melody', 'Full Mix', 'Breakdown', 'Build', 'Outro'] },
            { name: 'Chillhop Study', sections: ['Soft Entry', 'Main Groove', 'Jazz Elements', 'Main Groove', 'Wind Down'] }
        ],
        'synthwave': [
            { name: 'Synthwave Retro', sections: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Synth Solo', 'Chorus', 'Outro'] },
            { name: 'Synthwave Cinematic', sections: ['Atmospheric Intro', 'Build', 'Peak', 'Breakdown', 'Final Build', 'Epic Outro'] }
        ],
        'vaporwave': [
            { name: 'Vaporwave Dreamy', sections: ['Slow Intro', 'Main Theme', 'Variation', 'Main Theme', 'Ethereal Outro'] },
            { name: 'Vaporwave Sample', sections: ['Sample Intro', 'Slowed Section', 'Pitched Down', 'Reverb Section', 'Fade'] }
        ],
        'drill': [
            { name: 'Drill UK', sections: ['Intro', 'Verse', 'Hook', 'Verse', 'Hook', 'Bridge', 'Hook', 'Outro'] },
            { name: 'Drill Chicago', sections: ['Tag', 'Verse', 'Hook', 'Verse', 'Hook', 'Switch Up', 'Hook', 'Tag Out'] }
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
        },
        'country': {
            'Intro': 'Acoustic guitar picking or steel guitar',
            'Verse': 'Simple arrangement - acoustic guitar, bass, light drums',
            'Chorus': 'Add electric guitar, fuller drums, maybe fiddle',
            'Instrumental': 'Steel guitar, fiddle, or acoustic guitar solo',
            'Bridge': 'Change instrumentation, maybe banjo or mandolin',
            'Outro': 'Fade with instrumental hook or hard ending'
        },
        'soul': {
            'Intro': 'Organ stabs or horn section riff',
            'Verse': 'Rhythm section foundation with subtle organ',
            'Chorus': 'Full horn section, gospel-style organ, backing vocals',
            'Bridge': 'Strip to just vocals and organ, or feature horn solo',
            'Call': 'Lead vocal with minimal backing',
            'Response': 'Full choir or horn section response',
            'Outro': 'Big ending with full band and vocal ad-libs'
        },
        'gospel': {
            'Call': 'Lead vocal or organ, minimal accompaniment',
            'Response': 'Full choir with organ and rhythm section',
            'Verse': 'Organ prominent, light rhythm section',
            'Chorus': 'Full arrangement with choir and organ',
            'Bridge': 'Feature organ solo or choir harmonies',
            'Outro': 'Extended choir section with organ'
        },
        'reggae': {
            'Intro': 'Rhythm guitar skank on off-beats',
            'Verse': 'Bass-heavy with guitar skank, minimal drums',
            'Chorus': 'Add keyboard and fuller arrangement',
            'Bridge': 'Change up rhythm, maybe dub effects',
            'Toasting': 'Minimal backing for vocal prominence',
            'Outro': 'Dub-style echo effects, fade rhythm'
        },
        'ska': {
            'Intro': 'Horn section stabs or guitar upstrokes',
            'Verse': 'Guitar upstrokes, walking bass, driving drums',
            'Chorus': 'Full horn section, energetic arrangement',
            'Horn Section': 'Feature trumpets, trombones, and saxophone',
            'Bridge': 'Strip to rhythm section or feature horn solos',
            'Outro': 'Big horn ending or sudden stop'
        },
        'funk': {
            'Intro Groove': 'Bass and drums lock, minimal other elements',
            'Verse': 'Tight rhythm section, percussive guitar',
            'Chorus': 'Add horn stabs, fuller arrangement',
            'Breakdown': 'Strip to core groove elements',
            'Solo Section': 'Feature bass, guitar, or horn over groove',
            'Groove Out': 'Extended vamp with all elements',
            'Outro': 'Fade groove or sudden stop'
        },
        'rnb': {
            'Intro': 'Smooth keyboard or guitar riff',
            'Verse': 'Subtle arrangement highlighting vocals',
            'Pre-Chorus': 'Build with strings or backing vocals',
            'Chorus': 'Full arrangement with lush harmony',
            'Bridge': 'Stripped down or instrumental feature',
            'Outro': 'Vocal runs over fading arrangement'
        },
        'techno': {
            'Intro': 'Minimal kick pattern, subtle percussion',
            'Build': 'Layer percussion and effects gradually',
            'Main Loop': 'Full techno arrangement with driving beat',
            'Breakdown': 'Strip to minimal elements',
            'Layer 1': 'Start with kick and hi-hat',
            'Layer 2': 'Add bass and simple synth',
            'Layer 3': 'Add lead synth and effects',
            'Full': 'All elements playing together',
            'Strip Down': 'Remove elements systematically',
            'Outro': 'Gradual removal of elements'
        },
        'trance': {
            'Intro': 'Atmospheric pads and subtle percussion',
            'Breakdown': 'Minimal arrangement with emphasis on melody',
            'Build-up': 'Add layers, risers, and filtered effects',
            'Climax': 'Full arrangement with driving bass and lead',
            'Layer Build': 'Gradually add arpeggios and pads',
            'Peak': 'Maximum energy with all elements',
            'Resolution': 'Return to peaceful breakdown',
            'Outro': 'Fade with atmospheric elements'
        },
        'trap': {
            'Intro': 'Minimal 808s and atmospheric sounds',
            'Verse': 'Simple beat with bass and minimal melody',
            'Hook': 'Full arrangement with layered vocals',
            'Bridge': 'Change up the beat or add new elements',
            'Tag': 'Producer tag or signature sound',
            'Switch': 'Complete beat change or tempo shift',
            'Outro': 'Fade or cut to silence'
        },
        'afrobeat': {
            'Intro': 'Percussion ensemble, establish groove',
            'Verse': 'Add bass and guitar to rhythm foundation',
            'Call-Response': 'Vocal call with horn section response',
            'Solo Section': 'Feature saxophone, guitar, or keyboard',
            'Groove In': 'Build polyrhythmic foundation',
            'Vocal Entry': 'Lead vocal over established groove',
            'Horn Section': 'Full brass section with intricate parts',
            'Extended Jam': 'Allow instruments to interact freely',
            'Outro': 'Gradual fade of percussion ensemble'
        },
        'latin': {
            'Intro': 'Percussion section with montuno piano',
            'Verso': 'Vocals with rhythm section support',
            'Coro': 'Full arrangement with horn section',
            'Puente': 'Instrumental bridge with solos',
            'Montuno': 'Piano and bass groove foundation',
            'Mambo': 'High-energy horn section feature',
            'Outro': 'Extended percussion or sudden stop'
        },
        'bossanova': {
            'Intro': 'Nylon guitar with subtle percussion',
            'Verse': 'Guitar, soft vocals, minimal drums',
            'Chorus': 'Add subtle strings or flute',
            'Solo': 'Nylon guitar or flute over rhythm',
            'A Section': 'Main melody with full arrangement',
            'B Section': 'Harmonic contrast, different feel',
            'Outro': 'Fade with guitar and percussion'
        },
        'flamenco': {
            'Entrada': 'Solo flamenco guitar, establish mode',
            'Letra': 'Vocal with guitar accompaniment',
            'Falseta': 'Guitar solo sections between vocals',
            'Escobilla': 'Footwork section with percussive guitar',
            'Final': 'Climactic ending with full intensity',
            'Intro': 'Modern approach with rhythm section',
            'Guitar Solo': 'Feature flamenco techniques',
            'Outro': 'Traditional or modern ending'
        },
        'celtic': {
            'A Part': 'Main melody with traditional instruments',
            'B Part': 'Contrasting section, often in relative key',
            'Intro': 'Solo fiddle or tin whistle',
            'Verse': 'Vocals with acoustic accompaniment',
            'Chorus': 'Full arrangement with harmonies',
            'Instrumental': 'Feature traditional solos',
            'Outro': 'Traditional ending or fade'
        },
        'bluegrass': {
            'Intro': 'Banjo roll or fiddle melody',
            'Verse': 'Vocals with acoustic backing',
            'Chorus': 'Vocal harmonies with full band',
            'Instrumental': 'Trading solos between instruments',
            'Head': 'Main melody played by all',
            'Solo 1': 'Banjo or fiddle feature',
            'Solo 2': 'Mandolin or guitar feature',
            'Solo 3': 'Bass or dobro feature',
            'Tag': 'Short ending phrase'
        },
        'newage': {
            'Gentle Intro': 'Soft pads and nature sounds',
            'Theme': 'Main melody with ethereal backing',
            'Development': 'Layer instruments gradually',
            'Peak': 'Emotional climax with full arrangement',
            'Resolution': 'Return to peaceful state',
            'Fade': 'Gradual volume reduction',
            'Calm Opening': 'Meditative start with minimal elements',
            'Spiritual Journey': 'Building emotional narrative',
            'Transcendence': 'Peak spiritual moment',
            'Return': 'Gentle descent back to earth',
            'Peace': 'Final state of tranquility'
        },
        'lofi': {
            'Vinyl Intro': 'Record crackle and ambient sounds',
            'Main Loop': 'Core beat with warm, filtered elements',
            'Variation 1': 'Slight changes to maintain interest',
            'Variation 2': 'Additional melodic or rhythmic elements',
            'Fade': 'Gradual volume reduction with crackle',
            'Atmospheric Intro': 'Ambient textures and vinyl warmth',
            'Beat Drop': 'Soft entrance of hip-hop beat',
            'Melody Enter': 'Jazz-influenced melodic elements',
            'Full Arrangement': 'All elements together but understated',
            'Stripped Back': 'Return to minimal elements',
            'Outro': 'Fade with atmospheric elements'
        },
        'chillhop': {
            'Ambient Intro': 'Atmospheric pads and field recordings',
            'Beat In': 'Gentle introduction of hip-hop rhythm',
            'Melody': 'Jazz-influenced melodic instruments',
            'Full Mix': 'Complete arrangement with subtle dynamics',
            'Breakdown': 'Strip to core elements',
            'Build': 'Gradually return full arrangement',
            'Soft Entry': 'Gentle start with minimal elements',
            'Main Groove': 'Core chillhop beat and bass',
            'Jazz Elements': 'Add piano, guitar, or horn samples',
            'Wind Down': 'Gradual reduction to peaceful end'
        },
        'synthwave': {
            'Intro': 'Atmospheric synth pads and arpeggios',
            'Verse': 'Retro drum machine with bass synth',
            'Chorus': 'Full 80s arrangement with lead synth',
            'Synth Solo': 'Feature analog-style lead synthesis',
            'Atmospheric Intro': 'Cinematic pads and effects',
            'Build': 'Layer retro elements progressively',
            'Peak': 'Full 80s power with driving rhythms',
            'Breakdown': 'Strip to atmospheric elements',
            'Final Build': 'Ultimate 80s energy peak',
            'Epic Outro': 'Cinematic ending with full power'
        },
        'vaporwave': {
            'Slow Intro': 'Slowed down samples with reverb',
            'Main Theme': 'Core vaporwave aesthetic elements',
            'Variation': 'Pitch-shifted or time-stretched changes',
            'Ethereal Outro': 'Dreamy fade with heavy effects',
            'Sample Intro': 'Recognizable 80s/90s sample',
            'Slowed Section': 'Reduced tempo treatment',
            'Pitched Down': 'Lower pitch for surreal effect',
            'Reverb Section': 'Heavy reverb and delay effects',
            'Fade': 'Extended fade with nostalgic elements'
        },
        'drill': {
            'Intro': 'Dark atmospheric sounds with 808s',
            'Verse': 'Minimal beat with vocal prominence',
            'Hook': 'Catchiest part with fuller arrangement',
            'Bridge': 'Different energy or tempo shift',
            'Tag': 'Producer signature or vocal tag',
            'Switch Up': 'Complete beat change',
            'Tag Out': 'Closing producer tag or phrase'
        },
        'blues': {
            'Verse': 'Basic blues progression, simple arrangement',
            'Chorus': 'Fuller arrangement, emphasize the story',
            'Solo': 'Guitar or harmonica feature over progression',
            'Outro': 'Traditional blues ending or fade'
        },
        'folk': {
            'Verse': 'Acoustic guitar and vocals, minimal drums',
            'Chorus': 'Add harmonica, banjo, or vocal harmonies',
            'Outro': 'Simple ending, often with acoustic guitar'
        },
        'classical': {
            'Exposition': 'Present main themes clearly',
            'Development': 'Explore and vary the themes',
            'Recapitulation': 'Return themes in home key',
            'Theme': 'Simple, clear melodic statement',
            'Variation 1': 'First elaboration of theme',
            'Variation 2': 'Second development of theme',
            'Variation 3': 'Third transformation of theme',
            'Coda': 'Concluding section'
        },
        'house': {
            'Intro': 'Minimal four-on-the-floor with basic elements',
            'Build': 'Layer house elements progressively',
            'Drop': 'Full house arrangement with bassline',
            'Break': 'Strip back to create tension',
            'Outro': 'Gradual removal of elements'
        },
        'dubstep': {
            'Intro': 'Atmospheric buildup with filtered elements',
            'Build-up': 'Tension building with risers and effects',
            'Drop': 'Heavy bass and complex rhythms',
            'Breakdown': 'Minimal elements for contrast',
            'Second Drop': 'Even more intense than first',
            'Outro': 'Fade or sudden stop'
        },
        'hiphop': {
            'Intro': 'Beat intro or vocal ad-libs',
            'Verse': 'Core beat with minimal distractions',
            'Hook': 'Catchy section with fuller arrangement',
            'Bridge': 'Different feel or energy shift',
            'Outro': 'Fade beat or vocal outro'
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
    text += `♪ Tempo: ${data.tempo || 'Not set'} BPM\n`;
    text += `♪ Time Signature: ${data.strummingPattern?.timeSignature || 'Not set'}\n\n`;
    
    if (data.chordProgression) {
        text += `═══ HARMONY ═══\n`;
        text += `♫ Chord Progression: ${data.chordProgression.name}\n`;
        text += `  └─ ${data.chordProgression.description}\n`;
        text += `♪ Chords: ${data.chordProgression.chords.join(' → ')}\n`;
        text += `♪ Function: ${data.chordProgression.function || 'Standard progression'}\n\n`;
    }

    if (data.strummingPattern) {
        text += `═══ STRUMMING PATTERN ═══\n`;
        text += `♫ Pattern: ${data.strummingPattern.name}\n`;
        text += `  └─ ${data.strummingPattern.description}\n`;
        text += `♪ Category: ${data.strummingPattern.category}\n`;
        text += `♪ Difficulty: ${data.strummingPattern.difficulty}\n`;
        text += `♪ BPM Range: ${data.strummingPattern.bpm[0]}-${data.strummingPattern.bpm[1]} BPM\n`;
        const strokeSymbols = data.strummingPattern.pattern.map(stroke => {
            switch (stroke) {
                case 'D': return '↓';
                case 'U': return '↑';
                case 'X': return '×';
                case '-': return '•';
                default: return stroke;
            }
        });
        text += `♪ Pattern: ${strokeSymbols.join(' ')}\n\n`;
    }
    
    if (data.rhythmTemplate) {
        text += `═══ RHYTHM SECTION ═══\n`;
        text += `♫ Template: ${data.rhythmTemplate.name}\n`;
        text += `  └─ ${data.rhythmTemplate.description}\n`;
        text += `♪ Drum Pattern: ${data.rhythmTemplate.drumPattern}\n`;
        text += `♪ Bass Style: ${data.rhythmTemplate.bassStyle}\n`;
        text += `♪ Compatibility: ${data.rhythmTemplate.compatibility} match\n\n`;
    } else {
        // Fallback for old format
        if (data.drumPattern) {
            text += `═══ RHYTHM ═══\n`;
            text += `♫ Drum Pattern: ${data.drumPattern.name}\n`;
            text += `  └─ ${data.drumPattern.description || 'Drum pattern for rhythm section'}\n\n`;
        }

        if (data.bassLine && (data.bassLine.length > 0 || data.bassLine.style || data.bassLine.notes)) {
            text += `═══ BASS LINE ═══\n`;
            if (data.bassLine.style) {
                text += `♪ Bass Style: ${data.bassLine.style}\n`;
                if (data.bassLine.notes) {
                    text += `♪ Bass Notes: ${data.bassLine.notes.map(note => note.note).join(' → ')}\n`;
                }
                text += `\n`;
            } else if (data.bassLine.map) {
                text += `♪ Bass Notes: ${data.bassLine.map(note => note.note).join(' → ')}\n`;
                text += `♪ Style: ${data.bassComplexity || 'Simple'}\n\n`;
            }
        }
    }
    
    if (data.melodyIdea) {
        text += `═══ MELODY ═══\n`;
        text += `♫ Melody Idea: ${data.melodyIdea.name}\n`;

        // Handle different melody formats (old preset vs new generated)
        if (data.melodyIdea.description) {
            text += `  └─ ${data.melodyIdea.description}\n`;
        }

        // Handle different note formats
        let melodyNotes = '';
        if (data.melodyIdea.noteNames && Array.isArray(data.melodyIdea.noteNames)) {
            melodyNotes = data.melodyIdea.noteNames.join(' → ');
        } else if (data.melodyIdea.pattern && Array.isArray(data.melodyIdea.pattern)) {
            melodyNotes = data.melodyIdea.pattern.join(' → ');
        } else if (data.melodyIdea.melody && Array.isArray(data.melodyIdea.melody)) {
            melodyNotes = data.melodyIdea.melody.map(n => `${n.note}${n.octave}`).join(' → ');
        }

        if (melodyNotes) {
            text += `♪ Notes: ${melodyNotes}\n`;
        }

        // Add melody type and style info for generated melodies
        if (data.melodyIdea.type) {
            text += `♪ Type: ${data.melodyIdea.type}\n`;
        }
        if (data.melodyIdea.style) {
            text += `♪ Style: ${data.melodyIdea.style}\n`;
        }
        if (data.melodyIdea.genre) {
            text += `♪ Genre Style: ${data.melodyIdea.genre}\n`;
        }

        // Add analysis for generated melodies
        if (data.melodyIdea.analysis && Array.isArray(data.melodyIdea.analysis)) {
            text += `♪ Analysis:\n`;
            data.melodyIdea.analysis.forEach(tip => {
                text += `  • ${tip}\n`;
            });
        }

        text += '\n';
    }
    
    // Detailed song sections (from songcraft)
    if (data.songSections && data.songSections.length > 0) {
        text += `═══ DETAILED SONG STRUCTURE ═══\n`;
        data.songSections.forEach((section, index) => {
            text += `\n${index + 1}. ${section.type.toUpperCase()}\n`;
            if (section.chords && section.chords.trim()) {
                text += `   🎸 Chords: ${section.chords}\n`;
            }
            if (section.melody) {
                text += `   🎵 Section Melody: ${section.melody.name}\n`;
                text += `      Notes: ${section.melody.noteNames.join(' → ')}\n`;
            }
            if (section.lyrics && section.lyrics.trim()) {
                text += `   🎤 Lyrics:\n`;
                const lyricsLines = section.lyrics.split('\n');
                lyricsLines.forEach(line => {
                    if (line.trim()) {
                        text += `      ${line}\n`;
                    }
                });
            }
        });
        text += `\n`;
    } else {
        // Fallback to basic structure if detailed sections aren't available
        if (data.songStructure && data.songStructure.length > 0) {
            text += `═══ SONG STRUCTURE ═══\n`;
            text += `♪ ${data.songStructure.join(' → ')}\n\n`;
        }

        if (data.lyrics && data.lyrics.trim()) {
            text += `═══ LYRICS ═══\n`;
            text += `${data.lyrics}\n\n`;
        }
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
    if (!melodyIdea) return [];

    // Get melody notes from different formats
    let melodyNotes = [];
    if (melodyIdea.noteNames && Array.isArray(melodyIdea.noteNames)) {
        melodyNotes = melodyIdea.noteNames;
    } else if (melodyIdea.pattern && Array.isArray(melodyIdea.pattern)) {
        melodyNotes = melodyIdea.pattern.map(note => note + '5');
    } else if (melodyIdea.melody && Array.isArray(melodyIdea.melody)) {
        melodyNotes = melodyIdea.melody.map(n => `${n.note}${n.octave}`);
    }

    return melodyNotes.map((note, index) => ({
        pitch: Tonal.Midi.toMidi(note),
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
    if (!window.SimpleMIDI || !songData.chordProgression) return null;

    try {
        const midi = new SimpleMIDI();
        const track = midi.addTrack('Chords');

        track.addTempo(songData.tempo || 120);
        track.programChange(0, MIDIUtils.instruments.piano);

        const quarterNote = MIDIUtils.durationToTicks('quarter', songData.tempo || 120);
        let currentTime = 0;

        // Create a simple 4-bar pattern
        songData.chordProgression.chords.forEach((chord, index) => {
            const chordNotes = Tonal.Chord.get(chord).notes.slice(0, 4);
            if (chordNotes.length > 0) {
                const midiNotes = chordNotes.map(note => {
                    const midiNum = Tonal.Midi.toMidi(note + '4');
                    return midiNum || 60; // fallback to middle C
                });

                // Add chord notes
                midiNotes.forEach(midiNote => {
                    track.addNote(0, midiNote, 80, currentTime, quarterNote * 4); // whole note
                });
            }
            currentTime += quarterNote * 4;
        });

        return midi.toBlob();
    } catch (error) {
        console.error('Error creating chord MIDI:', error);
        return null;
    }
}

function createSimpleBassMIDI(songData) {
    if (!window.SimpleMIDI) return null;

    try {
        const midi = new SimpleMIDI();
        const track = midi.addTrack('Bass');

        track.addTempo(songData.tempo || 120);
        track.programChange(0, MIDIUtils.instruments.bass);

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

        const quarterNote = MIDIUtils.durationToTicks('quarter', songData.tempo || 120);
        let currentTime = 0;

        bassNotes.forEach(note => {
            const midiNote = Tonal.Midi.toMidi(note + '2') || 36; // fallback to low C
            track.addNote(0, midiNote, 90, currentTime, quarterNote * 4); // whole note
            currentTime += quarterNote * 4;
        });

        return midi.toBlob();
    } catch (error) {
        console.error('Error creating bass MIDI:', error);
        return null;
    }
}

function createSimpleMelodyMIDI(songData) {
    if (!window.SimpleMIDI || !songData.melodyIdea) return null;

    try {
        const midi = new SimpleMIDI();
        const track = midi.addTrack('Melody');

        track.addTempo(songData.tempo || 120);
        track.programChange(0, MIDIUtils.instruments.piano);

        const quarterNote = MIDIUtils.durationToTicks('quarter', songData.tempo || 120);
        let currentTime = 0;

        // Get melody notes from different formats
        let melodyNotes = [];
        if (songData.melodyIdea.noteNames && Array.isArray(songData.melodyIdea.noteNames)) {
            melodyNotes = songData.melodyIdea.noteNames;
        } else if (songData.melodyIdea.pattern && Array.isArray(songData.melodyIdea.pattern)) {
            melodyNotes = songData.melodyIdea.pattern.map(note => note + '5');
        } else if (songData.melodyIdea.melody && Array.isArray(songData.melodyIdea.melody)) {
            melodyNotes = songData.melodyIdea.melody.map(n => `${n.note}${n.octave}`);
        }

        melodyNotes.forEach(note => {
            const midiNote = Tonal.Midi.toMidi(note) || 72; // fallback to high C
            track.addNote(0, midiNote, 75, currentTime, quarterNote);
            currentTime += quarterNote;
        });

        return midi.toBlob();
    } catch (error) {
        console.error('Error creating melody MIDI:', error);
        return null;
    }
}

function createSimpleDrumMIDI(songData) {
    if (!window.SimpleMIDI || !songData.drumPattern) return null;

    try {
        const midi = new SimpleMIDI();
        const track = midi.addTrack('Drums');

        track.addTempo(songData.tempo || 120);

        // Simple 4/4 pattern
        const pattern = [
            { drum: 'kick', beat: 0 },
            { drum: 'hihat', beat: 0.5 },
            { drum: 'snare', beat: 1 },
            { drum: 'hihat', beat: 1.5 },
            { drum: 'kick', beat: 2 },
            { drum: 'hihat', beat: 2.5 },
            { drum: 'snare', beat: 3 },
            { drum: 'hihat', beat: 3.5 }
        ];

        const eighthNote = MIDIUtils.durationToTicks('eighth', songData.tempo || 120);

        pattern.forEach(({ drum, beat }) => {
            const drumNote = MIDIUtils.drums[drum] || MIDIUtils.drums.kick;
            const noteTime = beat * eighthNote * 2; // Convert beat to ticks
            track.addNote(9, drumNote, 100, noteTime, eighthNote); // Channel 9 for drums
        });

        return midi.toBlob();
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
        if (!window.SimpleMIDI) {
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

    const midi = new SimpleMIDI();
    const track = midi.addTrack('Chords');

    track.addTempo(songData.tempo || 120);
    track.programChange(0, MIDIUtils.instruments.piano);

    const quarterNote = MIDIUtils.durationToTicks('quarter', songData.tempo || 120);
    let currentTime = 0;

    arrangement.sections.forEach(section => {
        const sectionBars = section.bars;

        for (let bar = 0; bar < sectionBars; bar++) {
            songData.chordProgression.chords.forEach((chord, index) => {
                const chordNotes = Tonal.Chord.get(chord).notes.slice(0, 4);
                const midiNotes = chordNotes.map(note => Tonal.Midi.toMidi(note + '4'));

                // Add each note of the chord
                midiNotes.forEach(midiNote => {
                    if (midiNote) {
                        track.addNote(0, midiNote, 70, currentTime, quarterNote);
                    }
                });
                currentTime += quarterNote;
            });
        }
    });

    return midi.toBlob();
}

function generateBassTrack(songData, arrangement, options) {
    if (!songData.bassLine && !songData.chordProgression) return null;

    const midi = new SimpleMIDI();
    const track = midi.addTrack('Bass');

    track.addTempo(songData.tempo || 120);
    track.programChange(0, MIDIUtils.instruments.bass);

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

    const quarterNote = MIDIUtils.durationToTicks('quarter', songData.tempo || 120);

    arrangement.sections.forEach(section => {
        const sectionBars = section.bars;

        for (let bar = 0; bar < sectionBars; bar++) {
            bassNotes.forEach((note, index) => {
                const midiNote = Tonal.Midi.toMidi(note + '2') || 36; // fallback to low C
                track.addNote(0, midiNote, 85, currentTime, quarterNote);
                currentTime += quarterNote;
            });
        }
    });

    return midi.toBlob();
}

function generateMelodyTrack(songData, arrangement, options) {
    if (!songData.melodyIdea) return null;

    const midi = new SimpleMIDI();
    const track = midi.addTrack('Melody');

    track.addTempo(songData.tempo || 120);
    track.programChange(0, MIDIUtils.instruments.piano);

    let currentTime = 0;
    const eighthNote = MIDIUtils.durationToTicks('eighth', songData.tempo || 120);

    // Get melody notes from different formats
    let melodyNotes = [];
    if (songData.melodyIdea.noteNames && Array.isArray(songData.melodyIdea.noteNames)) {
        melodyNotes = songData.melodyIdea.noteNames;
    } else if (songData.melodyIdea.pattern && Array.isArray(songData.melodyIdea.pattern)) {
        melodyNotes = songData.melodyIdea.pattern.map(note => note + '5');
    } else if (songData.melodyIdea.melody && Array.isArray(songData.melodyIdea.melody)) {
        melodyNotes = songData.melodyIdea.melody.map(n => `${n.note}${n.octave}`);
    }

    arrangement.sections.forEach(section => {
        const sectionBars = section.bars;

        for (let bar = 0; bar < sectionBars; bar++) {
            melodyNotes.forEach((note, index) => {
                const midiNote = Tonal.Midi.toMidi(note);
                if (midiNote) {
                    track.addNote(0, midiNote, 75, currentTime, eighthNote);
                }
                currentTime += eighthNote;
            });
        }
    });

    return midi.toBlob();
}

function generateDrumTrack(songData, arrangement, options) {
    if (!songData.drumPattern || !songData.drumPattern.pattern) return null;

    const midi = new SimpleMIDI();
    const track = midi.addTrack('Drums');

    track.addTempo(songData.tempo || 120);

    let currentTime = 0;
    const sixteenthNote = MIDIUtils.durationToTicks('sixteenth', songData.tempo || 120);
    const barLength = sixteenthNote * 16; // 16 sixteenth notes in a bar

    arrangement.sections.forEach(section => {
        const sectionBars = section.bars;

        for (let bar = 0; bar < sectionBars; bar++) {
            Object.entries(songData.drumPattern.pattern).forEach(([drum, pattern]) => {
                pattern.forEach((hit, index) => {
                    if (hit === 1) {
                        const drumNote = MIDIUtils.drums[drum] || MIDIUtils.drums.kick;
                        const noteTime = currentTime + (index * sixteenthNote);
                        track.addNote(9, drumNote, 90, noteTime, sixteenthNote); // Channel 9 for drums
                    }
                });
            });
            currentTime += barLength;
        }
    });

    return midi.toBlob();
}

function generateHarmonyTrack(songData, arrangement, options) {
    if (!songData.chordProgression || !songData.chordProgression.chords) return null;

    const midi = new SimpleMIDI();
    const track = midi.addTrack('Harmony');

    track.addTempo(songData.tempo || 120);
    track.programChange(0, MIDIUtils.instruments.strings);

    let currentTime = 0;
    const halfNote = MIDIUtils.durationToTicks('half', songData.tempo || 120);

    arrangement.sections.forEach(section => {
        const sectionBars = section.bars;

        for (let bar = 0; bar < sectionBars; bar++) {
            songData.chordProgression.chords.forEach((chord, index) => {
                const chordNotes = Tonal.Chord.get(chord).notes.slice(1, 3); // Inner voices
                const midiNotes = chordNotes.map(note => Tonal.Midi.toMidi(note + '4'));

                // Add each harmony note
                midiNotes.forEach(midiNote => {
                    if (midiNote) {
                        track.addNote(0, midiNote, 50, currentTime, halfNote);
                    }
                });
                currentTime += halfNote;
            });
        }
    });

    return midi.toBlob();
}

function generatePadTrack(songData, arrangement, options) {
    if (!songData.chordProgression || !songData.chordProgression.chords) return null;

    const midi = new SimpleMIDI();
    const track = midi.addTrack('Pads');

    track.addTempo(songData.tempo || 120);
    track.programChange(0, MIDIUtils.instruments.pad);

    let currentTime = 0;
    const wholeNote = MIDIUtils.durationToTicks('whole', songData.tempo || 120);

    arrangement.sections.forEach(section => {
        const sectionBars = section.bars;

        for (let bar = 0; bar < sectionBars; bar++) {
            songData.chordProgression.chords.forEach((chord, index) => {
                const chordNotes = Tonal.Chord.get(chord).notes;
                const midiNotes = chordNotes.map(note => Tonal.Midi.toMidi(note + '3'));

                // Add each pad note
                midiNotes.forEach(midiNote => {
                    if (midiNote) {
                        track.addNote(0, midiNote, 40, currentTime, wholeNote);
                    }
                });
                currentTime += wholeNote;
            });
        }
    });

    return midi.toBlob();
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

// Fallback MIDI generation when SimpleMIDI is not available
function generateMIDIFallback(songData, options) {
    console.warn('SimpleMIDI library not available, generating text-based MIDI information instead');
    
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

${(() => {
    // Get melody notes from different formats
    let melodyNotes = [];
    if (melodyIdea.noteNames && Array.isArray(melodyIdea.noteNames)) {
        melodyNotes = melodyIdea.noteNames;
    } else if (melodyIdea.pattern && Array.isArray(melodyIdea.pattern)) {
        melodyNotes = melodyIdea.pattern.map(note => note + '5');
    } else if (melodyIdea.melody && Array.isArray(melodyIdea.melody)) {
        melodyNotes = melodyIdea.melody.map(n => `${n.note}${n.octave}`);
    }

    return `Pattern: ${melodyNotes.join(' - ')}

MIDI Notes:
${melodyNotes.map((note, i) => `Beat ${i + 1}: ${note} (MIDI note ${Tonal.Midi.toMidi(note) || 72})`).join('\n')}`;
})()}

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
        // Handle binary MIDI files (Blob objects from SimpleMIDI)
        Object.entries(midiTracks.tracks).forEach(([trackType, trackData]) => {
            if (trackData) {
                // trackData is already a Blob from SimpleMIDI.toBlob()
                files.push({
                    name: `${trackType}.mid`,
                    blob: trackData instanceof Blob ? trackData : new Blob([trackData], { type: 'audio/midi' }),
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

// =====================================
// MUSIC THEORY EDUCATION FUNCTIONS
// =====================================

export function explainChordProgression(chordProgression, key) {
    if (!chordProgression || !chordProgression.chords || !chordProgression.numerals) {
        return null;
    }

    const explanation = {
        name: chordProgression.name,
        key: key,
        analysis: [],
        theoryNotes: [],
        harmonicFunction: getProgressionFunctions(chordProgression.numerals),
        commonUse: getProgressionCommonUse(chordProgression.name)
    };

    // Analyze each chord
    chordProgression.chords.forEach((chord, index) => {
        const numeral = chordProgression.numerals[index];
        const chordAnalysis = analyzeChord(chord, numeral, key);
        explanation.analysis.push(chordAnalysis);
    });

    // Add theory notes about the progression
    explanation.theoryNotes = getProgressionTheoryNotes(chordProgression.numerals);

    return explanation;
}

function analyzeChord(chord, numeral, key) {
    try {
        const chordInfo = Tonal.Chord.get(chord);
        const scaleDegree = getScaleDegreeFromNumeral(numeral);

        return {
            chord: chord,
            numeral: numeral,
            scaleDegree: scaleDegree,
            chordTones: chordInfo.notes || [],
            quality: getChordQuality(numeral),
            function: getHarmonicFunction(numeral),
            intervals: chordInfo.intervals || [],
            explanation: getChordExplanation(numeral, scaleDegree)
        };
    } catch (error) {
        console.warn('Error analyzing chord:', error);
        return {
            chord: chord,
            numeral: numeral,
            explanation: 'Unable to analyze this chord'
        };
    }
}

function getScaleDegreeFromNumeral(numeral) {
    const degreeMap = {
        'I': 'First (Tonic)', 'i': 'First (Tonic)',
        'II': 'Second (Supertonic)', 'ii': 'Second (Supertonic)',
        'III': 'Third (Mediant)', 'iii': 'Third (Mediant)',
        'IV': 'Fourth (Subdominant)', 'iv': 'Fourth (Subdominant)',
        'V': 'Fifth (Dominant)', 'v': 'Fifth (Dominant)',
        'VI': 'Sixth (Submediant)', 'vi': 'Sixth (Submediant)',
        'VII': 'Seventh (Leading Tone)', 'vii': 'Seventh (Leading Tone)'
    };

    const baseNumeral = numeral.replace(/[^IVXivx]/g, '');
    return degreeMap[baseNumeral] || 'Unknown degree';
}

function getChordQuality(numeral) {
    if (numeral.includes('°') || numeral.includes('dim')) return 'Diminished';
    if (numeral.includes('+') || numeral.includes('aug')) return 'Augmented';
    if (numeral.includes('7')) return 'Seventh chord';
    if (numeral === numeral.toUpperCase()) return 'Major';
    if (numeral === numeral.toLowerCase()) return 'Minor';
    return 'Unknown quality';
}

function getHarmonicFunction(numeral) {
    const baseNumeral = numeral.replace(/[^IVXivx]/g, '').toUpperCase();

    const functionMap = {
        'I': 'Tonic (Home/Rest)',
        'II': 'Predominant (Preparation)',
        'III': 'Tonic extension',
        'IV': 'Predominant (Preparation)',
        'V': 'Dominant (Tension/Resolution)',
        'VI': 'Tonic substitute',
        'VII': 'Dominant function'
    };

    return functionMap[baseNumeral] || 'Unknown function';
}

function getChordExplanation(numeral, scaleDegree) {
    const explanations = {
        'I': 'The tonic chord - feels like home, stable and restful',
        'i': 'Minor tonic - darker version of home, still stable',
        'ii': 'Supertonic minor - often leads to V, creates gentle forward motion',
        'II': 'Major supertonic - brighter, less common in major keys',
        'iii': 'Mediant minor - connects I and V, adds color without strong direction',
        'III': 'Major mediant - dramatic, often used in modulation',
        'IV': 'Subdominant - creates pleasant departure from tonic, very consonant',
        'iv': 'Minor subdominant - adds melancholy, common in pop music',
        'V': 'Dominant - creates tension that wants to resolve back to I',
        'v': 'Minor dominant - weaker pull than major V, more gentle',
        'vi': 'Submediant - relative minor, often used as tonic substitute',
        'VI': 'Major submediant - bright contrast, common in minor keys',
        'vii°': 'Leading tone diminished - strong pull to tonic, unstable',
        'VII': 'Subtonic - common in modal music, weaker than vii°'
    };

    return explanations[numeral] || `${scaleDegree} - ${getHarmonicFunction(numeral)}`;
}

function getProgressionFunctions(numerals) {
    const functions = numerals.map(numeral => {
        const base = numeral.replace(/[^IVXivx]/g, '').toUpperCase();
        if (['I', 'III', 'VI'].includes(base)) return 'T';
        if (['II', 'IV'].includes(base)) return 'PD';
        if (['V', 'VII'].includes(base)) return 'D';
        return '?';
    });

    return {
        sequence: functions.join(' - '),
        explanation: 'T=Tonic (stable), PD=Predominant (prepares), D=Dominant (tension)'
    };
}

function getProgressionCommonUse(progressionName) {
    const usageMap = {
        'I-V-vi-IV': 'Extremely popular in pop music - creates satisfying loop',
        'vi-IV-I-V': 'Classic pop progression - emotional and memorable',
        'I-vi-IV-V': '50s progression - nostalgic, doo-wop feel',
        'ii-V-I': 'Jazz standard - smooth voice leading, sophisticated',
        'I-IV-V-I': 'Basic blues/rock - fundamental Western harmony',
        'vi-V-IV-V': 'Modal pop - modern, slightly ambiguous tonality',
        'I-VII-IV-I': 'Rock progression - uses flat VII for power',
        'i-VI-III-VII': 'Minor epic - dramatic, cinematic feel'
    };

    return usageMap[progressionName] || 'Unique progression - experiment with its character';
}

function getProgressionTheoryNotes(numerals) {
    const notes = [];

    // Check for common patterns
    if (numerals.includes('V') && numerals.includes('I')) {
        notes.push('Contains V-I resolution - the strongest harmonic motion in tonal music');
    }

    if (numerals.includes('ii') && numerals.includes('V')) {
        notes.push('ii-V motion creates smooth voice leading and forward momentum');
    }

    if (numerals.includes('vi') && numerals.includes('IV')) {
        notes.push('vi-IV motion is very popular in contemporary music');
    }

    if (numerals.includes('IV') && numerals.includes('I')) {
        notes.push('IV-I is a plagal cadence, also called the "Amen" cadence');
    }

    // Check for circle of fifths motion
    const circlePattern = checkCircleOfFifths(numerals);
    if (circlePattern) {
        notes.push(`Contains circle of fifths motion: ${circlePattern}`);
    }

    return notes;
}

function checkCircleOfFifths(numerals) {
    const fifthsOrder = ['I', 'V', 'ii', 'vi', 'iii', 'VII', 'IV'];
    const cleanNumerals = numerals.map(n => n.replace(/[^IVXivx]/g, '').toUpperCase());

    for (let i = 0; i < cleanNumerals.length - 1; i++) {
        const current = fifthsOrder.indexOf(cleanNumerals[i]);
        const next = fifthsOrder.indexOf(cleanNumerals[i + 1]);

        if (current !== -1 && next !== -1 && (current + 1) % 7 === next) {
            return `${cleanNumerals[i]} → ${cleanNumerals[i + 1]} (down a fifth)`;
        }
    }

    return null;
}

export function explainScale(key, scaleName = 'major') {
    try {
        const scale = Tonal.Scale.get(`${key} ${scaleName}`);

        return {
            name: `${key} ${scaleName}`,
            notes: scale.notes || [],
            intervals: scale.intervals || [],
            degrees: getScaleDegreeNames(),
            moodCharacter: getScaleMoodCharacter(scaleName),
            commonChords: getCommonChordsInScale(key, scaleName),
            tips: getScaleTips(scaleName)
        };
    } catch (error) {
        console.warn('Error explaining scale:', error);
        return null;
    }
}

function getScaleDegreeNames() {
    return [
        '1 - Tonic (Do)',
        '2 - Supertonic (Re)',
        '3 - Mediant (Mi)',
        '4 - Subdominant (Fa)',
        '5 - Dominant (Sol)',
        '6 - Submediant (La)',
        '7 - Leading Tone (Ti)',
        '8 - Octave (Do)'
    ];
}

function getScaleMoodCharacter(scaleName) {
    const characters = {
        'major': 'Bright, happy, stable - the most common scale in Western music',
        'minor': 'Darker, sadder, more emotional - natural minor scale',
        'dorian': 'Medieval, folk-like - minor with raised 6th degree',
        'phrygian': 'Spanish, exotic - minor with lowered 2nd degree',
        'lydian': 'Dreamy, floating - major with raised 4th degree',
        'mixolydian': 'Bluesy, rock-like - major with lowered 7th degree',
        'locrian': 'Unstable, dissonant - diminished 5th creates tension',
        'harmonic minor': 'Classical, dramatic - raised 7th creates exotic sound',
        'melodic minor': 'Jazz favorite - different ascending vs descending',
        'pentatonic': 'Universal, simple - found in music worldwide',
        'blues': 'Soulful, expressive - adds blue notes for emotion'
    };

    return characters[scaleName.toLowerCase()] || 'Unique scale with its own character';
}

function getCommonChordsInScale(key, scaleName) {
    try {
        const scale = Tonal.Scale.get(`${key} ${scaleName}`);
        const notes = scale.notes || [];

        if (notes.length < 7) return [];

        // Build triads on each degree
        const chords = [];
        for (let i = 0; i < 7; i++) {
            const root = notes[i];
            const third = notes[(i + 2) % 7];
            const fifth = notes[(i + 4) % 7];

            const chord = Tonal.Chord.detect([root, third, fifth])[0];
            if (chord) {
                chords.push({
                    degree: i + 1,
                    chord: chord,
                    numeral: getRomanNumeral(i + 1, scaleName)
                });
            }
        }

        return chords;
    } catch (error) {
        console.warn('Error getting common chords:', error);
        return [];
    }
}

function getRomanNumeral(degree, scaleName) {
    const majorNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
    const minorNumerals = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

    if (scaleName.toLowerCase().includes('minor')) {
        return minorNumerals[degree - 1] || '?';
    } else {
        return majorNumerals[degree - 1] || '?';
    }
}

function getScaleTips(scaleName) {
    const tips = {
        'major': [
            'Use I, IV, V for strong, traditional sound',
            'Add vi for emotional contrast (relative minor)',
            'ii and iii add color without being too dramatic'
        ],
        'minor': [
            'Natural minor: i, II, III, iv, v, VI, VII',
            'Try harmonic minor for classical drama',
            'Melodic minor gives jazz sophistication'
        ],
        'dorian': [
            'Focus on the raised 6th degree for its unique flavor',
            'Great for folk, Celtic, and modal rock',
            'Try i - VII - I progressions'
        ],
        'pentatonic': [
            'Perfect for improvisation - hard to hit wrong notes',
            'Used in rock solos, Asian music, and blues',
            'Try skipping around the scale rather than stepwise'
        ]
    };

    return tips[scaleName.toLowerCase()] || ['Experiment with this scale\'s unique intervals'];
}

export function explainRhythm(drumPattern) {
    if (!drumPattern || !drumPattern.grid) return null;

    return {
        name: drumPattern.name,
        timeSignature: drumPattern.timeSignature || '4/4',
        tempo: drumPattern.tempo || 'Medium',
        explanation: getRhythmExplanation(drumPattern),
        techniques: getRhythmTechniques(drumPattern),
        variations: getRhythmVariations(drumPattern)
    };
}

function getRhythmExplanation(drumPattern) {
    const name = drumPattern.name.toLowerCase();

    if (name.includes('rock')) {
        return 'Basic rock beat emphasizes beats 2 and 4 with the snare, creating the classic "backbeat" that drives rock music forward.';
    } else if (name.includes('jazz')) {
        return 'Jazz rhythms often feature complex syncopation and swing feel, where eighth notes are played with uneven timing.';
    } else if (name.includes('latin')) {
        return 'Latin rhythms use clave patterns and syncopated accents that create infectious grooves rooted in Afro-Cuban traditions.';
    } else if (name.includes('funk')) {
        return 'Funk emphasizes the downbeat (beat 1) with tight, syncopated patterns that create irresistible groove and pocket.';
    } else {
        return 'This rhythm pattern creates its own unique groove through the placement of accents and the interplay between different drum voices.';
    }
}

function getRhythmTechniques(drumPattern) {
    const techniques = [];

    // Analyze the grid for common techniques
    if (drumPattern.grid && drumPattern.grid.length > 0) {
        const kickPattern = drumPattern.grid.find(track => track[0].toLowerCase().includes('kick'));
        const snarePattern = drumPattern.grid.find(track => track[0].toLowerCase().includes('snare'));

        if (kickPattern && kickPattern[1] === 'x') {
            techniques.push('Strong downbeat - kick on beat 1 provides foundation');
        }

        if (snarePattern && (snarePattern[3] === 'x' || snarePattern[7] === 'x')) {
            techniques.push('Backbeat - snare on beats 2 and 4 creates forward drive');
        }

        // Check for syncopation
        let hasSyncopation = false;
        drumPattern.grid.forEach(track => {
            for (let i = 2; i < track.length; i += 2) {
                if (track[i] === 'x') hasSyncopation = true;
            }
        });

        if (hasSyncopation) {
            techniques.push('Syncopation - accents on off-beats create rhythmic interest');
        }
    }

    return techniques;
}

function getRhythmVariations(drumPattern) {
    return [
        'Try adding ghost notes (light snare hits) between main accents',
        'Experiment with kick drum variations - double hits or displaced accents',
        'Add hi-hat foot splashes on beat 4 for extra drive',
        'Use dynamics - play some hits softer to create groove and pocket'
    ];
}

// ===== ADVANCED TONAL.JS FEATURES =====

// Voice Leading Analysis and Optimization
export function analyzeVoiceLeading(chord1, chord2, key) {
    try {
        const chord1Info = Tonal.Chord.get(chord1);
        const chord2Info = Tonal.Chord.get(chord2);

        if (!chord1Info.notes || !chord2Info.notes) {
            return { smooth: false, analysis: 'Unable to analyze chords' };
        }

        // Calculate semitone movements for each voice
        const voices = Math.min(chord1Info.notes.length, chord2Info.notes.length);
        const movements = [];
        let totalMovement = 0;

        for (let i = 0; i < voices; i++) {
            const note1 = chord1Info.notes[i];
            const note2 = chord2Info.notes[i];
            const movement = Tonal.Interval.distance(note1, note2);
            const semitones = Tonal.Interval.semitones(movement);
            movements.push({ from: note1, to: note2, semitones });
            totalMovement += Math.abs(semitones);
        }

        // Analyze smoothness (less movement = smoother)
        const avgMovement = totalMovement / voices;
        const isSmooth = avgMovement <= 3; // Average movement of 3 semitones or less

        return {
            smooth: isSmooth,
            totalMovement,
            avgMovement: Math.round(avgMovement * 10) / 10,
            movements,
            analysis: generateVoiceLeadingAnalysis(movements, isSmooth)
        };
    } catch (error) {
        console.error('Voice leading analysis error:', error);
        return { smooth: false, analysis: 'Error analyzing voice leading' };
    }
}

function generateVoiceLeadingAnalysis(movements, isSmooth) {
    const analysis = [];

    if (isSmooth) {
        analysis.push('✅ Smooth voice leading detected');
    } else {
        analysis.push('⚠️ Large voice movements - consider chord inversions');
    }

    // Identify specific voice movements
    movements.forEach((move, i) => {
        const voiceName = ['Bass', 'Tenor', 'Alto', 'Soprano'][i] || `Voice ${i + 1}`;
        if (Math.abs(move.semitones) === 0) {
            analysis.push(`${voiceName}: ${move.from} stays (common tone)`);
        } else if (Math.abs(move.semitones) <= 2) {
            analysis.push(`${voiceName}: ${move.from} → ${move.to} (step-wise)`);
        } else if (Math.abs(move.semitones) <= 4) {
            analysis.push(`${voiceName}: ${move.from} → ${move.to} (small leap)`);
        } else {
            analysis.push(`${voiceName}: ${move.from} → ${move.to} (large leap - ${Math.abs(move.semitones)} semitones)`);
        }
    });

    return analysis;
}

// Generate Multiple Chord Voicings
export function generateChordVoicings(chordName, options = {}) {
    try {
        const {
            instrument = 'piano', // 'piano', 'guitar', 'generic'
            voiceCount = 4,
            range = { low: 'C3', high: 'C6' },
            includeInversions = true
        } = options;

        const chord = Tonal.Chord.get(chordName);
        if (!chord.notes) return [];

        const voicings = [];

        // Root position
        voicings.push({
            name: `${chordName} (Root Position)`,
            notes: chord.notes.slice(0, voiceCount),
            type: 'root',
            bass: chord.notes[0],
            description: 'Standard root position voicing'
        });

        if (includeInversions && chord.notes.length >= 3) {
            // First inversion
            const firstInv = [...chord.notes.slice(1), chord.notes[0]];
            voicings.push({
                name: `${chordName}/${chord.notes[1]} (1st Inversion)`,
                notes: firstInv.slice(0, voiceCount),
                type: 'first_inversion',
                bass: chord.notes[1],
                description: 'First inversion - smoother bass line'
            });

            // Second inversion (if triad or larger)
            if (chord.notes.length >= 3) {
                const secondInv = [...chord.notes.slice(2), ...chord.notes.slice(0, 2)];
                voicings.push({
                    name: `${chordName}/${chord.notes[2]} (2nd Inversion)`,
                    notes: secondInv.slice(0, voiceCount),
                    type: 'second_inversion',
                    bass: chord.notes[2],
                    description: 'Second inversion - often used as passing chord'
                });
            }
        }

        // Jazz/Extended voicings for 7th chords
        if (chord.notes.length >= 4) {
            // Drop 2 voicing
            if (chord.notes.length >= 4) {
                const drop2 = [chord.notes[0], chord.notes[2], chord.notes[3], chord.notes[1]];
                voicings.push({
                    name: `${chordName} (Drop 2)`,
                    notes: drop2,
                    type: 'drop2',
                    bass: chord.notes[0],
                    description: 'Drop 2 voicing - popular in jazz'
                });
            }
        }

        // Add MIDI note numbers for each voicing
        return voicings.map(voicing => ({
            ...voicing,
            midiNotes: voicing.notes.map(note => {
                const midiNote = Tonal.Midi.toMidi(note + '4');
                return midiNote || 60; // fallback to middle C
            })
        }));

    } catch (error) {
        console.error('Chord voicing generation error:', error);
        return [];
    }
}

// Enhanced Chord Progression Analysis with Roman Numerals
export function analyzeProgressionWithRomanNumerals(progression, key) {
    try {
        const keyInfo = Tonal.Key.majorKey(key);
        if (!keyInfo.scale) return null;

        const analysis = {
            key,
            chords: [],
            functionalAnalysis: [],
            voiceLeadingTips: [],
            modalInterchange: []
        };

        progression.chords.forEach((chord, index) => {
            const chordInfo = Tonal.Chord.get(chord);
            const rootNote = chordInfo.tonic || chord.replace(/[^A-G#b]/g, '');

            // Find scale degree
            const scaleIndex = keyInfo.scale.indexOf(rootNote);
            let romanNumeral = 'Unknown';
            let function_ = 'Unknown';

            if (scaleIndex !== -1) {
                // Determine if major or minor chord
                const isMinor = chord.includes('m') && !chord.includes('maj');
                const degree = scaleIndex + 1;

                romanNumeral = getRomanNumeralForDegree(degree, isMinor);
                function_ = getChordFunctionByDegree(degree);
            } else {
                // Check for modal interchange or secondary dominants
                romanNumeral = analyzeNonDiatonicChord(chord, key);
                function_ = 'Modal/Chromatic';
                analysis.modalInterchange.push(`${chord} - ${romanNumeral}`);
            }

            analysis.chords.push({
                chord,
                romanNumeral,
                function: function_,
                notes: chordInfo.notes || [],
                root: rootNote
            });

            // Voice leading analysis
            if (index > 0) {
                const voiceLeading = analyzeVoiceLeading(progression.chords[index - 1], chord, key);
                analysis.voiceLeadingTips.push({
                    transition: `${progression.chords[index - 1]} → ${chord}`,
                    ...voiceLeading
                });
            }
        });

        // Functional analysis
        analysis.functionalAnalysis = generateFunctionalAnalysis(analysis.chords);

        return analysis;
    } catch (error) {
        console.error('Progression analysis error:', error);
        return null;
    }
}

function getRomanNumeralForDegree(degree, isMinor) {
    const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    const numeral = numerals[degree - 1];
    return isMinor ? numeral.toLowerCase() : numeral;
}

function getChordFunctionByDegree(degree) {
    const functions = {
        1: 'Tonic',
        2: 'Supertonic',
        3: 'Mediant',
        4: 'Subdominant',
        5: 'Dominant',
        6: 'Submediant',
        7: 'Leading Tone'
    };
    return functions[degree] || 'Unknown';
}

function analyzeNonDiatonicChord(chord, key) {
    // Simple secondary dominant detection
    if (chord.includes('7') && !chord.includes('maj7')) {
        return 'V7/?'; // Secondary dominant
    }

    // Modal interchange detection (simplified)
    const chordRoot = chord.replace(/[^A-G#b]/g, '');
    const keyInfo = Tonal.Key.minorKey(key);

    if (keyInfo.scale && keyInfo.scale.includes(chordRoot)) {
        return 'borrow from parallel minor';
    }

    return 'chromatic';
}

function generateFunctionalAnalysis(chords) {
    const analysis = [];

    // Look for common progressions
    const numerals = chords.map(c => c.romanNumeral).join(' - ');

    if (numerals.includes('I - V - vi - IV')) {
        analysis.push('✨ Classic pop progression (I-V-vi-IV) - very strong and memorable');
    }
    if (numerals.includes('ii - V - I')) {
        analysis.push('🎵 ii-V-I progression - the cornerstone of jazz harmony');
    }
    if (numerals.includes('vi - IV - I - V')) {
        analysis.push('🔄 Circle progression - creates forward momentum');
    }
    if (numerals.includes('I - vi - ii - V')) {
        analysis.push('📀 50s doo-wop progression - classic nostalgic sound');
    }

    // Functional flow analysis
    let hasTonicToSubdominant = false;
    let hasSubdominantToDominant = false;
    let hasDominantToTonic = false;

    for (let i = 0; i < chords.length - 1; i++) {
        const current = chords[i].function;
        const next = chords[i + 1].function;

        if (current === 'Tonic' && next === 'Subdominant') hasTonicToSubdominant = true;
        if (current === 'Subdominant' && next === 'Dominant') hasSubdominantToDominant = true;
        if (current === 'Dominant' && next === 'Tonic') hasDominantToTonic = true;
    }

    if (hasTonicToSubdominant && hasSubdominantToDominant && hasDominantToTonic) {
        analysis.push('🏛️ Classical functional harmony - Tonic → Subdominant → Dominant → Tonic');
    }

    return analysis;
}

// Smart Melody Generation with Advanced Chord-Tone Awareness
export function generateSmartMelody(chordProgression, key, options = {}) {
    try {
        const {
            style = 'smooth', // 'smooth', 'angular', 'pentatonic', 'vocal'
            preferChordTones = true,
            avoidLargeLeaps = true,
            octave = 5,
            notesPerChord = 4, // Number of melody notes per chord
            emphasizeStrongBeats = true,
            vocalRange = { low: 'C4', high: 'C6' }, // Vocal-friendly range
            scale: scaleType = 'major' // Scale type to use
        } = options;

        // Map scale types to Tonal.js scale names
        const scaleMap = {
            'major': 'major',
            'minor': 'minor',
            'aeolian': 'aeolian',
            'dorian': 'dorian',
            'phrygian': 'phrygian',
            'lydian': 'lydian',
            'mixolydian': 'mixolydian',
            'locrian': 'locrian',
            'harmonic-minor': 'harmonic minor',
            'melodic-minor': 'melodic minor ascending',
            'blues': 'blues',
            'pentatonic-major': 'major pentatonic',
            'pentatonic-minor': 'minor pentatonic'
        };

        const tonalScaleName = scaleMap[scaleType] || scaleType || 'major';
        const cleanKey = key.replace('m', '');
        const scale = Tonal.Scale.get(`${cleanKey} ${tonalScaleName}`);

        if (!scale.notes || scale.notes.length === 0) {
            console.warn(`Could not get scale notes for melody generation: ${cleanKey} ${tonalScaleName}`);
            return null;
        }

        const melody = [];
        let lastNote = scale.notes[0]; // Start on tonic

        // Get chord tone priorities (root, third, fifth have highest priority)
        const getChordTonePriority = (note, chordTones) => {
            const index = chordTones.indexOf(note);
            if (index === 0) return 3; // Root
            if (index === 2) return 2; // Fifth
            if (index === 1) return 2.5; // Third (slightly higher than fifth)
            if (index === 3) return 1.5; // Seventh
            return index >= 0 ? 1 : 0; // Other chord tones or non-chord tones
        };

        chordProgression.chords.forEach((chord, chordIndex) => {
            const chordInfo = Tonal.Chord.get(chord);
            const chordTones = chordInfo.notes || [];
            const scaleNotes = scale.notes;

            // Generate multiple notes per chord for rhythmic interest
            for (let noteIndex = 0; noteIndex < notesPerChord; noteIndex++) {
                const isStrongBeat = noteIndex % 2 === 0; // Every other note is a strong beat
                const isDownbeat = noteIndex === 0; // First note of chord

                let nextNote;
                let selectionReason = '';

                if (preferChordTones && chordTones.length > 0) {
                    if (isStrongBeat || isDownbeat) {
                        // Strong beats: prioritize chord tones, especially root and third
                        const weightedChordTones = chordTones.map(tone => ({
                            note: tone,
                            weight: getChordTonePriority(tone, chordTones) *
                                   (isDownbeat ? 1.5 : 1) * // Extra weight for downbeat
                                   (1 / (Math.abs(Tonal.Interval.semitones(Tonal.Interval.distance(lastNote, tone))) + 1)) // Favor close intervals
                        }));

                        // Sort by weight and pick top choice with some randomness
                        weightedChordTones.sort((a, b) => b.weight - a.weight);
                        const topChoices = weightedChordTones.slice(0, Math.min(3, weightedChordTones.length));
                        nextNote = topChoices[Math.floor(Math.random() * topChoices.length)].note;
                        selectionReason = isDownbeat ? 'downbeat-chord-tone' : 'strong-beat-chord-tone';
                    } else {
                        // Weak beats: allow passing tones and scale notes for melodic movement
                        const passingToneChance = 0.4; // 40% chance of using passing tone

                        if (Math.random() < passingToneChance) {
                            // Use scale notes for passing tones
                            const lastIndex = scaleNotes.indexOf(Tonal.Note.get(lastNote).pc);
                            const direction = Math.random() > 0.5 ? 1 : -1;
                            const stepSize = Math.random() > 0.8 ? 2 : 1; // Mostly stepwise motion
                            const nextIndex = (lastIndex + (direction * stepSize) + scaleNotes.length) % scaleNotes.length;
                            nextNote = scaleNotes[nextIndex];
                            selectionReason = 'passing-tone';
                        } else {
                            // Still prefer chord tones but with less strict voice leading
                            const availableChordTones = chordTones.filter(tone => {
                                const interval = Math.abs(Tonal.Interval.semitones(Tonal.Interval.distance(lastNote, tone)));
                                return !avoidLargeLeaps || interval <= 5; // Perfect fourth or less
                            });

                            nextNote = availableChordTones.length > 0 ?
                                      availableChordTones[Math.floor(Math.random() * availableChordTones.length)] :
                                      chordTones[Math.floor(Math.random() * chordTones.length)];
                            selectionReason = 'weak-beat-chord-tone';
                        }
                    }
                } else {
                    // Fallback to scale notes
                    const lastIndex = scaleNotes.indexOf(Tonal.Note.get(lastNote).pc);
                    const direction = Math.random() > 0.5 ? 1 : -1;
                    const stepSize = avoidLargeLeaps ? (Math.random() > 0.7 ? 2 : 1) : Math.floor(Math.random() * 4) + 1;
                    const nextIndex = (lastIndex + (direction * stepSize) + scaleNotes.length) % scaleNotes.length;
                    nextNote = scaleNotes[nextIndex];
                    selectionReason = 'scale-note';
                }

                // Apply vocal range constraints if specified
                let finalOctave = octave;
                if (vocalRange) {
                    const noteWithOctave = nextNote + finalOctave;
                    const midiNote = Tonal.Midi.toMidi(noteWithOctave);
                    const lowMidi = Tonal.Midi.toMidi(vocalRange.low);
                    const highMidi = Tonal.Midi.toMidi(vocalRange.high);

                    if (midiNote < lowMidi) finalOctave = Math.ceil((lowMidi - Tonal.Midi.toMidi(nextNote + '0')) / 12);
                    if (midiNote > highMidi) finalOctave = Math.floor((highMidi - Tonal.Midi.toMidi(nextNote + '0')) / 12);
                }

                const noteWithOctave = nextNote + finalOctave;
                melody.push({
                    note: nextNote,
                    noteWithOctave: noteWithOctave,
                    chord: chord,
                    octave: finalOctave,
                    midiNote: Tonal.Midi.toMidi(noteWithOctave),
                    isChordTone: chordTones.includes(nextNote),
                    isStrongBeat: isStrongBeat,
                    isDownbeat: isDownbeat,
                    chordIndex: chordIndex,
                    noteIndex: noteIndex,
                    intervalFromPrevious: melody.length > 0 ? Tonal.Interval.distance(lastNote, nextNote) : 'unison',
                    selectionReason: selectionReason,
                    chordTonePriority: getChordTonePriority(nextNote, chordTones)
                });

                lastNote = nextNote;
            }
        });

        return {
            melody,
            analysis: analyzeMelodyQuality(melody),
            style,
            key,
            notesPerChord,
            chordCount: chordProgression.chords.length,
            totalNotes: melody.length
        };
    } catch (error) {
        console.error('Smart melody generation error:', error);
        return null;
    }
}

function analyzeMelodyQuality(melody) {
    const analysis = [];
    let chordToneCount = 0;
    let strongBeatChordTones = 0;
    let downbeatChordTones = 0;
    let largeLeaps = 0;
    let passingTones = 0;
    let stepwiseMotion = 0;

    melody.forEach((note, index) => {
        if (note.isChordTone) {
            chordToneCount++;
            if (note.isStrongBeat) strongBeatChordTones++;
            if (note.isDownbeat) downbeatChordTones++;
        }

        if (note.selectionReason === 'passing-tone') passingTones++;

        if (index > 0) {
            const interval = note.intervalFromPrevious;
            const semitones = Math.abs(Tonal.Interval.semitones(interval));

            if (semitones > 4) {
                largeLeaps++;
            } else if (semitones <= 2) {
                stepwiseMotion++;
            }
        }
    });

    // Calculate percentages
    const chordTonePercentage = Math.round((chordToneCount / melody.length) * 100);
    const strongBeats = melody.filter(n => n.isStrongBeat).length;
    const downbeats = melody.filter(n => n.isDownbeat).length;
    const strongBeatChordTonePercentage = strongBeats > 0 ? Math.round((strongBeatChordTones / strongBeats) * 100) : 0;
    const downbeatChordTonePercentage = downbeats > 0 ? Math.round((downbeatChordTones / downbeats) * 100) : 0;
    const stepwisePercentage = melody.length > 1 ? Math.round((stepwiseMotion / (melody.length - 1)) * 100) : 0;

    // Overall chord tone analysis
    analysis.push(`🎵 ${chordTonePercentage}% chord tones overall - ${chordTonePercentage > 70 ? 'excellent harmonic foundation' : chordTonePercentage > 50 ? 'good harmonic connection' : 'more scalar/melodic approach'}`);

    // Strong beat analysis
    if (strongBeatChordTonePercentage >= 80) {
        analysis.push(`🎯 ${strongBeatChordTonePercentage}% chord tones on strong beats - excellent rhythmic emphasis`);
    } else if (strongBeatChordTonePercentage >= 60) {
        analysis.push(`✅ ${strongBeatChordTonePercentage}% chord tones on strong beats - good harmonic rhythm`);
    } else {
        analysis.push(`⚠️ ${strongBeatChordTonePercentage}% chord tones on strong beats - consider more harmonic emphasis`);
    }

    // Downbeat analysis
    if (downbeatChordTonePercentage >= 90) {
        analysis.push(`🏛️ ${downbeatChordTonePercentage}% chord tones on downbeats - strong harmonic structure`);
    } else if (downbeatChordTonePercentage >= 70) {
        analysis.push(`✅ ${downbeatChordTonePercentage}% chord tones on downbeats - solid foundation`);
    }

    // Motion analysis
    if (stepwisePercentage >= 70) {
        analysis.push(`🎶 ${stepwisePercentage}% stepwise motion - very singable melody`);
    } else if (stepwisePercentage >= 50) {
        analysis.push(`🎵 ${stepwisePercentage}% stepwise motion - good melodic flow`);
    }

    if (passingTones > 0) {
        const passingTonePercentage = Math.round((passingTones / melody.length) * 100);
        analysis.push(`🌊 ${passingTonePercentage}% passing tones - adds melodic fluidity`);
    }

    // Leap analysis
    if (largeLeaps === 0) {
        analysis.push('✅ Smooth melody - no large leaps, excellent for vocal performance');
    } else if (largeLeaps <= Math.ceil(melody.length * 0.1)) {
        analysis.push('⚡ Few strategic leaps - good for melodic interest');
    } else {
        analysis.push('🎢 Angular melody - many large leaps, challenging but expressive');
    }

    // Professional assessment
    if (chordTonePercentage > 60 && strongBeatChordTonePercentage > 70 && stepwisePercentage > 60) {
        analysis.push('🌟 Professional quality melody with strong harmonic foundation and singable contour');
    } else if (chordTonePercentage > 50 && strongBeatChordTonePercentage > 60) {
        analysis.push('👍 Well-crafted melody with good harmonic awareness');
    }

    return analysis;
}

// Advanced Melodic Development Functions

// Generate melodic motif (2-4 notes that can be developed)
export function generateMotif(key, chordTones, options = {}) {
    const {
        length = 3, // 2-4 notes
        style = 'stepwise', // 'stepwise', 'arpeggiated', 'mixed'
        intervalPattern = null // Custom interval pattern like [2, -1, 3]
    } = options;

    const scale = Tonal.Scale.get(`${key} major`);
    const motif = [];

    if (intervalPattern) {
        // Use custom interval pattern
        let currentNote = chordTones[0] || scale.notes[0];
        motif.push(currentNote);

        intervalPattern.slice(0, length - 1).forEach(interval => {
            const nextNote = Tonal.Note.transpose(currentNote, Tonal.Interval.fromSemitones(interval));
            motif.push(nextNote);
            currentNote = nextNote;
        });
    } else {
        // Generate based on style
        switch (style) {
            case 'stepwise':
                let startIndex = Math.floor(Math.random() * scale.notes.length);
                for (let i = 0; i < length; i++) {
                    motif.push(scale.notes[(startIndex + i) % scale.notes.length]);
                }
                break;

            case 'arpeggiated':
                // Use chord tones in sequence
                for (let i = 0; i < length && i < chordTones.length; i++) {
                    motif.push(chordTones[i]);
                }
                break;

            case 'mixed':
                // Mix stepwise and chord tone approaches
                motif.push(chordTones[0] || scale.notes[0]);
                for (let i = 1; i < length; i++) {
                    if (Math.random() > 0.5 && chordTones[i]) {
                        motif.push(chordTones[i]);
                    } else {
                        const lastNote = motif[motif.length - 1];
                        const lastIndex = scale.notes.indexOf(lastNote);
                        const direction = Math.random() > 0.5 ? 1 : -1;
                        const nextIndex = (lastIndex + direction + scale.notes.length) % scale.notes.length;
                        motif.push(scale.notes[nextIndex]);
                    }
                }
                break;
        }
    }

    return {
        notes: motif,
        intervals: motif.slice(1).map((note, i) =>
            Tonal.Interval.distance(motif[i], note)
        ),
        style,
        length
    };
}

// Apply motif development techniques
export function developMotif(motif, technique, options = {}) {
    const { notes } = motif;
    const { transposition = 0, rhythmicAugmentation = 1 } = options;

    switch (technique) {
        case 'sequence':
            // Repeat motif at different pitch levels
            const interval = options.sequenceInterval || 'M2'; // Major second by default
            return notes.map(note => Tonal.Note.transpose(note, interval));

        case 'inversion':
            // Invert the interval direction
            const inverted = [notes[0]];
            for (let i = 1; i < notes.length; i++) {
                const originalInterval = Tonal.Interval.distance(notes[i-1], notes[i]);
                const invertedInterval = Tonal.Interval.invert(originalInterval);
                inverted.push(Tonal.Note.transpose(inverted[i-1], invertedInterval));
            }
            return inverted;

        case 'retrograde':
            // Reverse the note order
            return [...notes].reverse();

        case 'augmentation':
            // Stretch intervals (make them larger)
            const augmented = [notes[0]];
            for (let i = 1; i < notes.length; i++) {
                const interval = Tonal.Interval.distance(notes[i-1], notes[i]);
                const semitones = Tonal.Interval.semitones(interval);
                const augmentedInterval = Tonal.Interval.fromSemitones(semitones * 2);
                augmented.push(Tonal.Note.transpose(augmented[i-1], augmentedInterval));
            }
            return augmented;

        case 'diminution':
            // Compress intervals (make them smaller)
            const diminished = [notes[0]];
            for (let i = 1; i < notes.length; i++) {
                const interval = Tonal.Interval.distance(notes[i-1], notes[i]);
                const semitones = Tonal.Interval.semitones(interval);
                const diminishedInterval = Tonal.Interval.fromSemitones(Math.ceil(semitones / 2));
                diminished.push(Tonal.Note.transpose(diminished[i-1], diminishedInterval));
            }
            return diminished;

        case 'fragmentation':
            // Use only part of the motif
            const fragmentLength = Math.max(2, Math.floor(notes.length / 2));
            return notes.slice(0, fragmentLength);

        default:
            return notes;
    }
}

// Genre-specific melodic patterns and scales
export function getGenreMelodicStyle(genre) {
    const styles = {
        'pop': {
            preferredScales: ['major', 'minor', 'dorian'],
            intervalPreferences: ['m2', 'M2', 'm3', 'M3'], // Stepwise motion preferred
            rhythmicPatterns: ['straight', 'syncopated'],
            phraseStructure: [4, 8], // 4 or 8 bar phrases
            hookFocus: true,
            chordToneEmphasis: 0.7
        },
        'rock': {
            preferredScales: ['minor pentatonic', 'blues', 'natural minor'],
            intervalPreferences: ['m3', 'P4', 'P5'], // Power chord intervals
            rhythmicPatterns: ['straight', 'driving'],
            phraseStructure: [4, 8],
            hookFocus: true,
            chordToneEmphasis: 0.6
        },
        'jazz': {
            preferredScales: ['major', 'dorian', 'mixolydian', 'altered'],
            intervalPreferences: ['M2', 'm2', 'M7', 'm7'], // Complex intervals
            rhythmicPatterns: ['swing', 'syncopated'],
            phraseStructure: [8, 16, 32],
            hookFocus: false,
            chordToneEmphasis: 0.8
        },
        'folk': {
            preferredScales: ['major', 'dorian', 'mixolydian', 'pentatonic'],
            intervalPreferences: ['M2', 'm2', 'M3', 'P4'],
            rhythmicPatterns: ['straight', 'lilting'],
            phraseStructure: [8, 16],
            hookFocus: false,
            chordToneEmphasis: 0.6
        },
        'country': {
            preferredScales: ['major', 'mixolydian', 'pentatonic'],
            intervalPreferences: ['M2', 'M3', 'P4'],
            rhythmicPatterns: ['straight', 'shuffle'],
            phraseStructure: [4, 8],
            hookFocus: true,
            chordToneEmphasis: 0.7
        },
        'rnb': {
            preferredScales: ['minor', 'dorian', 'blues', 'pentatonic'],
            intervalPreferences: ['m2', 'M2', 'm3', 'M3', 'm7'],
            rhythmicPatterns: ['syncopated', 'groove'],
            phraseStructure: [4, 8, 16],
            hookFocus: true,
            chordToneEmphasis: 0.75,
            melismaticRuns: true
        },
        'classical': {
            preferredScales: ['major', 'minor', 'dorian', 'phrygian'],
            intervalPreferences: ['M2', 'm2', 'M3', 'm3', 'P4', 'P5'],
            rhythmicPatterns: ['straight', 'rubato'],
            phraseStructure: [8, 16, 32],
            hookFocus: false,
            chordToneEmphasis: 0.85,
            phraseArches: true
        }
    };

    return styles[genre.toLowerCase()] || styles['pop'];
}

// Generate phrase structure with breathing points
export function generatePhraseStructure(chordProgression, options = {}) {
    const {
        phraseLength = 8, // bars per phrase
        breathingPoints = true,
        questionAnswer = true,
        archShape = true
    } = options;

    const totalChords = chordProgression.chords.length;
    const phrases = [];

    for (let i = 0; i < totalChords; i += phraseLength) {
        const phraseChords = chordProgression.chords.slice(i, i + phraseLength);
        const phraseInfo = {
            chords: phraseChords,
            startBar: i,
            endBar: Math.min(i + phraseLength - 1, totalChords - 1),
            type: 'statement'
        };

        // Apply phrase structure logic
        if (questionAnswer && phrases.length % 2 === 0) {
            phraseInfo.type = 'question'; // Antecedent
            phraseInfo.contour = 'rising'; // Questions often rise
        } else if (questionAnswer && phrases.length % 2 === 1) {
            phraseInfo.type = 'answer'; // Consequent
            phraseInfo.contour = 'falling'; // Answers often fall
        }

        if (archShape) {
            const midPoint = Math.floor(phraseChords.length / 2);
            phraseInfo.climaxPoint = midPoint;
            phraseInfo.contour = 'arch'; // Rise to middle, then fall
        }

        if (breathingPoints) {
            phraseInfo.breathingPoint = phraseInfo.endBar;
        }

        phrases.push(phraseInfo);
    }

    return phrases;
}

// Create call-and-response melodic patterns
export function generateCallAndResponse(motif, key, options = {}) {
    const {
        responseType = 'answer', // 'echo', 'answer', 'contrast'
        responseInterval = 'P5', // Interval to transpose response
        responseRhythm = 'same' // 'same', 'augmented', 'diminished'
    } = options;

    const call = motif.notes;
    let response = [];

    switch (responseType) {
        case 'echo':
            // Simple repetition, possibly transposed
            response = call.map(note =>
                responseInterval ? Tonal.Note.transpose(note, responseInterval) : note
            );
            break;

        case 'answer':
            // Complementary phrase that resolves
            response = developMotif(motif, 'inversion').slice(0, call.length);
            // Ensure it ends on a stable note
            const scale = Tonal.Scale.get(`${key} major`);
            response[response.length - 1] = scale.notes[0]; // End on tonic
            break;

        case 'contrast':
            // Different rhythm and contour
            response = call.map((note, i) => {
                const interval = i % 2 === 0 ? 'M3' : 'm2';
                return Tonal.Note.transpose(note, interval);
            });
            break;
    }

    return {
        call: call,
        response: response,
        type: responseType,
        interval: responseInterval
    };
}

// Add lyrical rhythm consideration
export function adaptMelodyToLyrics(melody, lyrics, options = {}) {
    const {
        emphasizeStressedSyllables = true,
        respectNaturalAccents = true,
        allowMelisma = false // Multiple notes per syllable
    } = options;

    if (!lyrics || lyrics.length === 0) return melody;

    const words = lyrics.split(' ');
    const syllables = [];

    // Simple syllable counting (basic implementation)
    words.forEach(word => {
        const syllableCount = countSyllables(word);
        const wordSyllables = [];

        for (let i = 0; i < syllableCount; i++) {
            wordSyllables.push({
                text: i === 0 ? word : '',
                isStressed: i === 0 || (syllableCount > 2 && i === syllableCount - 2),
                isWordStart: i === 0,
                isWordEnd: i === syllableCount - 1
            });
        }
        syllables.push(...wordSyllables);
    });

    // Adapt melody to syllables
    const adaptedMelody = melody.map((note, index) => {
        const syllable = syllables[index % syllables.length];

        if (!syllable) return note;

        const adaptedNote = { ...note };

        if (emphasizeStressedSyllables && syllable.isStressed) {
            // Place stressed syllables on chord tones and higher pitches
            adaptedNote.emphasis = 'stressed';
            adaptedNote.preferHigherPitch = true;
        }

        if (syllable.isWordStart) {
            adaptedNote.phrasePosition = 'word-start';
        }

        if (syllable.isWordEnd) {
            adaptedNote.phrasePosition = 'word-end';
            adaptedNote.allowBreath = true;
        }

        adaptedNote.syllable = syllable;

        return adaptedNote;
    });

    return adaptedMelody;
}

// Simple syllable counter
function countSyllables(word) {
    if (!word) return 0;

    word = word.toLowerCase();
    let count = 0;
    let wasVowel = false;

    for (let i = 0; i < word.length; i++) {
        const isVowel = 'aeiouy'.includes(word[i]);
        if (isVowel && !wasVowel) {
            count++;
        }
        wasVowel = isVowel;
    }

    // Handle silent e
    if (word.endsWith('e')) {
        count--;
    }

    // Minimum of 1 syllable
    return Math.max(1, count);
}

// Enhanced Melody Generation that integrates all melodic development features
export function generateAdvancedMelody(chordProgression, key, options = {}) {
    try {
        const {
            style = 'smooth',
            genre = 'pop',
            lyrics = null,
            useMotifs = true,
            phraseStructure = 'question-answer',
            developmentTechniques = ['sequence', 'inversion'],
            notesPerChord = 4,
            octave = 5,
            vocalRange = { low: 'C4', high: 'C6' },
            scale = 'major' // Scale type to use
        } = options;

        // Get genre-specific style preferences
        const genreStyle = getGenreMelodicStyle(genre);

        // Generate phrase structure
        const phrases = generatePhraseStructure(chordProgression, {
            phraseLength: genreStyle.phraseStructure[0],
            questionAnswer: phraseStructure === 'question-answer',
            archShape: genreStyle.phraseArches || false
        });

        // Generate initial melody using enhanced chord-tone aware generation
        const baseMelody = generateSmartMelody(chordProgression, key, {
            style,
            preferChordTones: true,
            avoidLargeLeaps: true,
            octave,
            notesPerChord,
            vocalRange,
            emphasizeStrongBeats: true,
            scale // Pass scale through to generateSmartMelody
        });

        if (!baseMelody) return null;

        let enhancedMelody = baseMelody.melody;

        // Apply motif development if requested
        if (useMotifs && enhancedMelody.length >= 6) {
            // Extract motif from first few notes
            const motifNotes = enhancedMelody.slice(0, 3).map(note => note.note);
            const firstChordTones = Tonal.Chord.get(chordProgression.chords[0]).notes || [];

            const motif = {
                notes: motifNotes,
                intervals: motifNotes.slice(1).map((note, i) =>
                    Tonal.Interval.distance(motifNotes[i], note)
                ),
                style: 'mixed',
                length: motifNotes.length
            };

            // Apply development techniques throughout the melody
            const developedSections = [];

            developmentTechniques.forEach((technique, index) => {
                if (index < phrases.length) {
                    const developed = developMotif(motif, technique, {
                        sequenceInterval: genreStyle.intervalPreferences[0] || 'M2'
                    });
                    developedSections.push({
                        phrase: index,
                        technique,
                        notes: developed
                    });
                }
            });

            // Apply call-and-response if using question-answer structure
            if (phraseStructure === 'question-answer' && phrases.length >= 2) {
                const callAndResponse = generateCallAndResponse(motif, key, {
                    responseType: 'answer',
                    responseInterval: 'P5'
                });

                // Apply to alternating phrases
                phrases.forEach((phrase, index) => {
                    if (index % 2 === 0) {
                        phrase.melodicRole = 'call';
                        phrase.motifNotes = callAndResponse.call;
                    } else {
                        phrase.melodicRole = 'response';
                        phrase.motifNotes = callAndResponse.response;
                    }
                });
            }
        }

        // Apply genre-specific interval preferences
        enhancedMelody = enhancedMelody.map((note, index) => {
            const enhancedNote = { ...note };

            // Apply genre-specific emphasis
            enhancedNote.genreStyle = genreStyle;
            enhancedNote.chordToneEmphasis = genreStyle.chordToneEmphasis;

            // Mark hook-focused sections for pop/rock genres
            if (genreStyle.hookFocus && index < notesPerChord * 2) {
                enhancedNote.isHookSection = true;
            }

            // Add melismatic potential for R&B
            if (genreStyle.melismaticRuns && note.isStrongBeat && Math.random() > 0.7) {
                enhancedNote.allowMelisma = true;
            }

            return enhancedNote;
        });

        // Adapt to lyrics if provided
        if (lyrics) {
            enhancedMelody = adaptMelodyToLyrics(enhancedMelody, lyrics, {
                emphasizeStressedSyllables: true,
                allowMelisma: genreStyle.melismaticRuns || false
            });
        }

        // Generate comprehensive analysis
        const analysis = [
            ...analyzeMelodyQuality(enhancedMelody),
            `🎼 Genre: ${genre} - ${genreStyle.hookFocus ? 'Hook-focused' : 'Development-focused'} approach`,
            `📏 Phrase structure: ${phrases.length} phrases (${phrases.map(p => p.type).join(', ')})`,
        ];

        if (useMotifs) {
            analysis.push(`🎵 Motif development: ${developmentTechniques.join(', ')}`);
        }

        if (phraseStructure === 'question-answer') {
            analysis.push(`💬 Call-and-response phrasing implemented`);
        }

        if (lyrics) {
            analysis.push(`🎤 Melody adapted to lyrical rhythm and stress patterns`);
        }

        return {
            melody: enhancedMelody,
            phrases,
            analysis,
            genreStyle,
            motifDevelopment: useMotifs ? developmentTechniques : null,
            style,
            key,
            totalNotes: enhancedMelody.length,
            features: {
                chordToneAware: true,
                rhythmicEmphasis: true,
                motifDevelopment: useMotifs,
                phraseStructure: phraseStructure,
                genreSpecific: true,
                lyricalAdaptation: !!lyrics,
                callAndResponse: phraseStructure === 'question-answer'
            }
        };

    } catch (error) {
        console.error('Advanced melody generation error:', error);
        return null;
    }
}

