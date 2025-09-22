// strumming-patterns.js - Guitar Strumming Patterns Reference Catalog
class StrummingPatterns {
    constructor() {
        this.isActive = false;
        this.currentPattern = null;

        // Available strumming patterns
        this.patterns = {
            // Basic Patterns
            'down-strums': {
                name: 'Down Strums',
                category: 'Basic',
                difficulty: 'Beginner',
                timeSignature: '4/4',
                pattern: ['D', '-', '-', '-', 'D', '-', '-', '-', 'D', '-', '-', '-', 'D', '-', '-', '-'],
                timing: [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75],
                description: 'Four quarter note down strums per measure with rests between. Great for building basic timing.',
                bpm: [80, 120]
            },
            'down-up': {
                name: 'Down-Up Basic',
                category: 'Basic',
                difficulty: 'Beginner',
                timeSignature: '4/4',
                pattern: ['D', 'U', 'D', 'U', 'D', 'U', 'D', 'U'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Alternating down and up strums. Foundation of most strumming.',
                bpm: [60, 100]
            },
            'eighth-notes': {
                name: 'Eighth Note Strums',
                category: 'Basic',
                difficulty: 'Beginner',
                timeSignature: '4/4',
                pattern: ['D', 'U', 'D', 'U', 'D', 'U', 'D', 'U'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Eighth note alternating down-up strums. Foundation for steady rhythm.',
                bpm: [60, 90]
            },
            'quarter-rest': {
                name: 'Quarter Rest Pattern',
                category: 'Basic',
                difficulty: 'Beginner',
                timeSignature: '4/4',
                pattern: ['D', 'U', '-', '-', 'D', 'U', '-', '-'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Down-up followed by quarter rest. Good for sparse arrangements.',
                bpm: [80, 120]
            },

            // Folk/Pop Patterns
            'folk-basic': {
                name: 'Folk Strum',
                category: 'Folk/Pop',
                difficulty: 'Beginner',
                timeSignature: '4/4',
                pattern: ['D', '-', 'D', 'U', '-', 'U', 'D', 'U'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Classic folk pattern: D-D-U-U-D-U. Very popular in acoustic music.',
                bpm: [80, 140]
            },
            'pop-ballad': {
                name: 'Pop Ballad',
                category: 'Folk/Pop',
                difficulty: 'Intermediate',
                timeSignature: '4/4',
                pattern: ['D', '-', '-', 'U', '-', 'U', 'D', 'U'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Gentle ballad pattern with emphasis on beat 1. Good for slow songs.',
                bpm: [60, 100]
            },
            'country-pop': {
                name: 'Country Pop',
                category: 'Folk/Pop',
                difficulty: 'Intermediate',
                timeSignature: '4/4',
                pattern: ['D', '-', 'D', 'U', 'D', 'U', 'D', 'U'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Driving country pattern with extra down strum on beat 3.',
                bpm: [120, 160]
            },
            'campfire': {
                name: 'Campfire',
                category: 'Folk/Pop',
                difficulty: 'Beginner',
                timeSignature: '4/4',
                pattern: ['D', '-', 'D', 'U', '-', 'U', 'D', 'U'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Classic campfire strum: D - D U - U D U. Perfect for folk songs.',
                bpm: [70, 110]
            },
            'island-strum': {
                name: 'Island Strum',
                category: 'Folk/Pop',
                difficulty: 'Intermediate',
                timeSignature: '4/4',
                pattern: ['D', '-', 'D', 'U', 'D', '-', 'U', 'D'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Relaxed tropical feel with syncopated rhythm.',
                bpm: [90, 130]
            },
            'folk-waltz': {
                name: 'Folk Waltz',
                category: 'Folk/Pop',
                difficulty: 'Intermediate',
                timeSignature: '3/4',
                pattern: ['D', '-', 'U', 'D', 'U', '-'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5],
                description: 'Folk style waltz with gentle up-strums.',
                bpm: [80, 120]
            },

            // Rock Patterns
            'rock-basic': {
                name: 'Basic Rock',
                category: 'Rock',
                difficulty: 'Intermediate',
                timeSignature: '4/4',
                pattern: ['D', '-', 'D', 'U', '-', '-', 'D', 'U'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Classic rock pattern with strong downbeats and syncopated upstrokes.',
                bpm: [100, 140]
            },
            'punk-rock': {
                name: 'Punk Rock',
                category: 'Rock',
                difficulty: 'Intermediate',
                timeSignature: '4/4',
                pattern: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'All down strums at eighth note speed. High energy and aggressive.',
                bpm: [140, 180]
            },
            'alt-rock': {
                name: 'Alternative Rock',
                category: 'Rock',
                difficulty: 'Advanced',
                timeSignature: '4/4',
                pattern: ['D', 'U', 'D', 'U', 'D', '-', 'D', 'U'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Syncopated rock pattern with emphasis on offbeats.',
                bpm: [110, 150]
            },
            'power-chord': {
                name: 'Power Chord',
                category: 'Rock',
                difficulty: 'Intermediate',
                timeSignature: '4/4',
                pattern: ['D', '-', '-', '-', 'D', '-', '-', '-'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Heavy emphasis on beats 1 and 3. Perfect for power chords.',
                bpm: [80, 140]
            },
            'metal-palm': {
                name: 'Metal Palm Mute',
                category: 'Rock',
                difficulty: 'Advanced',
                timeSignature: '4/4',
                pattern: ['X', 'X', 'D', 'X', 'X', 'X', 'D', 'X'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Palm muted pattern with accented down strums.',
                bpm: [120, 180]
            },
            'grunge': {
                name: 'Grunge',
                category: 'Rock',
                difficulty: 'Advanced',
                timeSignature: '4/4',
                pattern: ['D', 'U', 'X', 'U', 'D', 'X', 'U', 'D'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Raw grunge pattern with mixed dynamics and mutes.',
                bpm: [100, 140]
            },

            // Country Patterns
            'country-basic': {
                name: 'Country Basic',
                category: 'Country',
                difficulty: 'Intermediate',
                timeSignature: '4/4',
                pattern: ['D', '-', 'D', 'U', 'D', '-', 'D', 'U'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Classic country strum with strong downbeats.',
                bpm: [120, 160]
            },
            'country-shuffle': {
                name: 'Country Shuffle',
                category: 'Country',
                difficulty: 'Advanced',
                timeSignature: '4/4',
                pattern: ['D', 'U', 'D', '-', 'D', 'U', 'D', '-'],
                timing: [1, 1.33, 1.67, 2, 2.5, 2.83, 3.17, 3.5],
                description: 'Shuffle rhythm common in country and blues.',
                bpm: [100, 140]
            },
            'bluegrass': {
                name: 'Bluegrass',
                category: 'Country',
                difficulty: 'Advanced',
                timeSignature: '4/4',
                pattern: ['D', 'U', 'D', 'U', 'D', 'U', 'D', 'U'],
                timing: [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75],
                description: 'Fast bluegrass picking pattern with even strokes.',
                bpm: [140, 200]
            },
            'country-waltz': {
                name: 'Country Waltz',
                category: 'Country',
                difficulty: 'Intermediate',
                timeSignature: '3/4',
                pattern: ['D', '-', '-', 'D', 'U', '-'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5],
                description: 'Traditional country waltz with bass-chord pattern.',
                bpm: [90, 130]
            },

            // Reggae/Ska Patterns
            'reggae': {
                name: 'Reggae Skank',
                category: 'Reggae/Ska',
                difficulty: 'Advanced',
                timeSignature: '4/4',
                pattern: ['-', 'U', '-', 'U', '-', 'U', '-', 'U'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Classic reggae upstroke pattern on the offbeats.',
                bpm: [70, 110]
            },
            'ska-upstroke': {
                name: 'Ska Upstroke',
                category: 'Reggae/Ska',
                difficulty: 'Intermediate',
                timeSignature: '4/4',
                pattern: ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Fast ska upstrokes on every beat and off-beat.',
                bpm: [140, 180]
            },
            'dub-strum': {
                name: 'Dub Strum',
                category: 'Reggae/Ska',
                difficulty: 'Advanced',
                timeSignature: '4/4',
                pattern: ['-', 'U', 'D', 'U', '-', 'U', 'D', '-'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Dub-influenced pattern with syncopated accents.',
                bpm: [80, 120]
            },

            // Funk/R&B Patterns
            'funk-strum': {
                name: 'Funk Strum',
                category: 'Funk/R&B',
                difficulty: 'Advanced',
                timeSignature: '4/4',
                pattern: ['D', 'U', 'X', 'U', 'D', 'U', 'X', 'U'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Funk pattern with muted strums (X) for percussive effect.',
                bpm: [90, 130]
            },
            'r-and-b': {
                name: 'R&B Groove',
                category: 'Funk/R&B',
                difficulty: 'Advanced',
                timeSignature: '4/4',
                pattern: ['D', 'X', 'U', 'X', 'D', 'X', 'U', 'D'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Smooth R&B groove with ghost notes.',
                bpm: [80, 120]
            },
            'neo-soul': {
                name: 'Neo-Soul',
                category: 'Funk/R&B',
                difficulty: 'Advanced',
                timeSignature: '4/4',
                pattern: ['D', 'U', 'X', '-', 'D', 'U', 'X', 'U'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Modern neo-soul pattern with syncopation.',
                bpm: [70, 110]
            },

            // Latin Patterns
            'bossa-nova': {
                name: 'Bossa Nova',
                category: 'Latin',
                difficulty: 'Advanced',
                timeSignature: '4/4',
                pattern: ['D', 'U', 'D', '-', 'D', 'U', 'D', '-'],
                timing: [1, 1.25, 1.75, 2, 2.5, 2.75, 3.25, 4],
                description: 'Smooth Brazilian pattern with syncopated timing.',
                bpm: [120, 140]
            },
            'samba': {
                name: 'Samba',
                category: 'Latin',
                difficulty: 'Advanced',
                timeSignature: '4/4',
                pattern: ['D', 'U', 'D', 'U', 'D', '-', 'U', 'D'],
                timing: [1, 1.5, 2, 2.25, 2.5, 3, 3.5, 4],
                description: 'Energetic samba rhythm with Brazilian feel.',
                bpm: [100, 140]
            },
            'rumba': {
                name: 'Rumba',
                category: 'Latin',
                difficulty: 'Intermediate',
                timeSignature: '4/4',
                pattern: ['D', '-', 'D', '-', 'D', 'U', 'D', 'U'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Traditional rumba pattern with Latin rhythm.',
                bpm: [80, 120]
            },
            'spanish-strum': {
                name: 'Spanish Strum',
                category: 'Latin',
                difficulty: 'Advanced',
                timeSignature: '4/4',
                pattern: ['D', 'U', 'D', 'U', 'D', 'U', 'D', 'D'],
                timing: [1, 1.33, 1.67, 2, 2.33, 2.67, 3, 3.5],
                description: 'Flamenco-inspired pattern with triplet feel and strong ending.',
                bpm: [100, 140]
            },

            // Jazz Patterns
            'jazz-comping': {
                name: 'Jazz Comping',
                category: 'Jazz',
                difficulty: 'Advanced',
                timeSignature: '4/4',
                pattern: ['-', 'U', '-', 'U', 'D', '-', 'U', '-'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Jazz comping pattern with syncopated accents.',
                bpm: [100, 160]
            },
            'swing-strum': {
                name: 'Swing Strum',
                category: 'Jazz',
                difficulty: 'Advanced',
                timeSignature: '4/4',
                pattern: ['D', '-', 'U', 'D', '-', 'U', 'D', '-'],
                timing: [1, 1.33, 1.67, 2.33, 2.67, 3, 3.67, 4],
                description: 'Swing rhythm with characteristic triplet feel.',
                bpm: [120, 180]
            },
            'gypsy-jazz': {
                name: 'Gypsy Jazz',
                category: 'Jazz',
                difficulty: 'Advanced',
                timeSignature: '4/4',
                pattern: ['D', 'U', 'D', 'U', 'D', 'U', 'D', 'U'],
                timing: [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75],
                description: 'Fast gypsy jazz style with even eighth notes.',
                bpm: [150, 220]
            },

            // World Music Patterns
            'irish-folk': {
                name: 'Irish Folk',
                category: 'World',
                difficulty: 'Intermediate',
                timeSignature: '4/4',
                pattern: ['D', 'U', 'D', 'U', 'D', 'U', 'D', 'U'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Traditional Irish folk pattern with even strumming.',
                bpm: [110, 150]
            },
            'calypso': {
                name: 'Calypso',
                category: 'World',
                difficulty: 'Intermediate',
                timeSignature: '4/4',
                pattern: ['D', '-', 'U', 'D', 'U', 'D', '-', 'U'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'Caribbean calypso rhythm with tropical feel.',
                bpm: [120, 160]
            },
            'african-strum': {
                name: 'African Strum',
                category: 'World',
                difficulty: 'Advanced',
                timeSignature: '4/4',
                pattern: ['D', 'U', 'D', '-', 'U', 'D', 'U', 'D'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
                description: 'African-inspired polyrhythmic pattern.',
                bpm: [90, 130]
            },

            // Specialty Patterns
            'waltz': {
                name: 'Waltz',
                category: 'Specialty',
                difficulty: 'Intermediate',
                timeSignature: '3/4',
                pattern: ['D', 'U', 'U', 'D', 'U', 'U'],
                timing: [1, 2, 3, 1, 2, 3],
                description: '3/4 time pattern for waltzes and country ballads.',
                bpm: [80, 120]
            },
            'fast-waltz': {
                name: 'Fast Waltz',
                category: 'Specialty',
                difficulty: 'Advanced',
                timeSignature: '3/4',
                pattern: ['D', '-', '-', 'D', '-', '-'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5],
                description: 'Quick waltz with emphasis on beat 1.',
                bpm: [150, 200]
            },
            'compound-time': {
                name: 'Compound Time',
                category: 'Specialty',
                difficulty: 'Advanced',
                timeSignature: '6/8',
                pattern: ['D', '-', 'U', 'D', '-', 'U'],
                timing: [1, 1.5, 2, 2.5, 3, 3.5],
                description: '6/8 compound time with two main beats.',
                bpm: [80, 140]
            },
            'arpeggiated': {
                name: 'Arpeggiated',
                category: 'Specialty',
                difficulty: 'Advanced',
                timeSignature: '4/4',
                pattern: ['D', '-', '-', '-', 'D', '-', '-', '-'],
                timing: [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75],
                description: 'Gentle arpeggiated pattern for ballads.',
                bpm: [60, 100]
            }
        };

        // Chord suggestions for different patterns
        this.chordSuggestions = {
            'Basic': ['C', 'G', 'Am', 'F', 'D', 'Em'],
            'Folk/Pop': ['G', 'C', 'D', 'Em', 'Am', 'F'],
            'Rock': ['E', 'A', 'B', 'C#m', 'F#m', 'G#m'],
            'Country': ['G', 'C', 'D', 'Em', 'Am', 'A'],
            'Reggae/Ska': ['Am', 'F', 'C', 'G', 'Dm', 'Em'],
            'Funk/R&B': ['Am7', 'Dm7', 'G7', 'Cmaj7', 'Fmaj7', 'Em7'],
            'Latin': ['Am', 'Dm', 'G', 'C', 'F', 'E7'],
            'Jazz': ['Cmaj7', 'Am7', 'Dm7', 'G7', 'Fmaj7', 'Em7b5'],
            'World': ['Am', 'C', 'G', 'F', 'Dm', 'Em'],
            'Specialty': ['Am', 'Dm', 'E7', 'C', 'F', 'G7']
        };
    }

    initialize() {
        console.log('Strumming patterns reference catalog initialized');
        return true;
    }


    selectPattern(patternId) {
        this.currentPattern = this.patterns[patternId];
        this.currentBeat = 0;
        this.updateDisplay();
        console.log(`Selected pattern: ${this.currentPattern.name}`);
    }












    updateDisplay() {
        const strummingDisplay = document.getElementById('strumming-display');
        if (!strummingDisplay) return;

        if (!this.currentPattern) {
            strummingDisplay.innerHTML = `
                <div class="strumming-instructions">
                    <p>🎸 Select a strumming pattern to get started</p>
                    <p>Choose from beginner to advanced patterns</p>
                </div>
            `;
            return;
        }

        const pattern = this.currentPattern;
        const difficultyColor = this.getDifficultyColor(pattern.difficulty);

        strummingDisplay.innerHTML = `
            <div class="pattern-info">
                <div class="pattern-header">
                    <h3>${pattern.name}</h3>
                    <span class="pattern-difficulty" style="background-color: ${difficultyColor}">
                        ${pattern.difficulty}
                    </span>
                </div>
                <div class="pattern-details">
                    <span class="pattern-category">${pattern.category}</span>
                    <span class="pattern-time-sig">${pattern.timeSignature}</span>
                    <span class="pattern-bpm">Suggested BPM: ${pattern.bpm[0]}-${pattern.bpm[1]}</span>
                </div>
                <p class="pattern-description">${pattern.description}</p>
            </div>

            <div class="pattern-visualization" id="pattern-visualization">
                <div class="pattern-header-row">
                    <span class="timing-label">Count:</span>
                    <div class="pattern-beats">
                        ${pattern.timing.map((beat, index) => `
                            <div class="beat-marker">${this.convertTimingToCount(beat, pattern.timeSignature)}</div>
                        `).join('')}
                    </div>
                </div>
                <div class="pattern-strokes-row">
                    <span class="strokes-label">Strum:</span>
                    <div class="pattern-strokes">
                        ${pattern.pattern.map((stroke, index) => `
                            <div class="stroke ${stroke === '-' ? 'rest' : stroke.toLowerCase()}">
                                ${this.getStrokeSymbol(stroke)}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="practice-tools">
                <div class="practice-integration">
                    <h4>Practice Tools:</h4>
                    <div class="tool-buttons">
                        <button class="practice-tool-btn metronome-btn" onclick="window.strummingPatterns.toggleMetronomeIntegration()">
                            <span class="tool-icon">🥁</span>
                            <span class="tool-text">Use Metronome</span>
                            <span class="tool-status" id="metronome-status">Off</span>
                        </button>
                        <button class="practice-tool-btn scales-btn" onclick="window.strummingPatterns.openScalesIntegration()">
                            <span class="tool-icon">🎵</span>
                            <span class="tool-text">Practice with Scales</span>
                        </button>
                    </div>
                    <div id="metronome-controls" class="metronome-integration" style="display: none;">
                        <div class="tempo-sync">
                            <label>Sync Tempo:</label>
                            <button onclick="window.strummingPatterns.syncTempoToPattern()" class="sync-btn">
                                Set to ${pattern.bpm[0]} BPM
                            </button>
                            <button onclick="window.strummingPatterns.syncTempoToPattern(true)" class="sync-btn">
                                Set to ${pattern.bpm[1]} BPM
                            </button>
                        </div>
                        <div class="time-signature-sync">
                            <button onclick="window.strummingPatterns.syncTimeSignature()" class="sync-btn">
                                Set to ${pattern.timeSignature}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pattern-legend">
                <div class="legend-item">
                    <span class="legend-symbol d">↓</span>
                    <span class="legend-text">Down strum</span>
                </div>
                <div class="legend-item">
                    <span class="legend-symbol u">↑</span>
                    <span class="legend-text">Up strum</span>
                </div>
                <div class="legend-item">
                    <span class="legend-symbol x">×</span>
                    <span class="legend-text">Muted strum</span>
                </div>
                <div class="legend-item">
                    <span class="legend-symbol rest">•</span>
                    <span class="legend-text">Rest</span>
                </div>
            </div>
        `;
    }

    getStrokeSymbol(stroke) {
        switch (stroke) {
            case 'D': return '↓';
            case 'U': return '↑';
            case 'X': return '×';
            case '-': return '•';
            default: return stroke;
        }
    }

    convertTimingToCount(timing, timeSignature) {
        if (timeSignature === '3/4') {
            // 3/4 time: 1, &, 2, &, 3, &
            const countMap = {
                1: '1', 1.5: '&', 2: '2', 2.5: '&', 3: '3', 3.5: '&'
            };
            return countMap[timing] || timing.toString();
        } else if (timeSignature === '6/8') {
            // 6/8 time: 1, &, a, 2, &, a
            const countMap = {
                1: '1', 1.5: '&', 2: 'a', 2.5: '2', 3: '&', 3.5: 'a'
            };
            return countMap[timing] || timing.toString();
        } else {
            // 4/4 time: 1, &, 2, &, 3, &, 4, &
            const countMap = {
                1: '1', 1.5: '&', 2: '2', 2.5: '&', 3: '3', 3.5: '&', 4: '4', 4.5: '&'
            };
            return countMap[timing] || timing.toString();
        }
    }

    getDifficultyColor(difficulty) {
        switch (difficulty) {
            case 'Beginner': return '#4ecdc4';
            case 'Intermediate': return '#ffd93d';
            case 'Advanced': return '#ff6b6b';
            default: return '#666666';
        }
    }

    renderPatternLibrary() {
        try {
            console.log('Rendering pattern library...');
            console.log('Available patterns:', Object.keys(this.patterns));

            const categories = [...new Set(Object.values(this.patterns).map(p => p.category))];
            console.log('Categories found:', categories);

            const html = categories.map(category => {
                const categoryPatterns = Object.entries(this.patterns)
                    .filter(([_, pattern]) => pattern.category === category);

                console.log(`Category ${category} has ${categoryPatterns.length} patterns`);

                return `
                    <div class="pattern-category">
                        <h4 class="category-title">${category}</h4>
                        <div class="pattern-grid">
                            ${categoryPatterns.map(([id, pattern]) => `
                                <div class="pattern-card ${this.currentPattern && this.currentPattern.name === pattern.name ? 'selected' : ''}"
                                     onclick="window.strummingPatterns.selectPattern('${id}')">
                                    <div class="card-header">
                                        <h5>${pattern.name}</h5>
                                        <span class="difficulty ${pattern.difficulty.toLowerCase()}">${pattern.difficulty}</span>
                                    </div>
                                    <div class="pattern-preview">
                                        ${pattern.pattern.slice(0, 8).map(stroke => `
                                            <span class="preview-stroke ${stroke === '-' ? 'rest' : stroke.toLowerCase()}">${stroke === '-' ? '•' : stroke}</span>
                                        `).join('')}
                                    </div>
                                    <div class="pattern-meta">
                                        <span class="time-sig">${pattern.timeSignature}</span>
                                        <span class="bpm-range">${pattern.bpm[0]}-${pattern.bpm[1]} BPM</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('');

            console.log('Generated HTML length:', html.length);
            return html;

        } catch (error) {
            console.error('Error rendering pattern library:', error);
            return `<div class="error">Error loading patterns: ${error.message}</div>`;
        }
    }

    toggle() {
        try {
            console.log('Toggling strumming patterns, isActive:', this.isActive);

            if (!this.isActive) {
                console.log('Initializing strumming patterns...');
                const initialized = this.initialize();
                if (initialized) {
                    this.isActive = true;
                    console.log('Strumming patterns activated, updating display...');
                    this.updateDisplay();
                    return true;
                } else {
                    console.error('Failed to initialize strumming patterns');
                    return false;
                }
            } else {
                console.log('Deactivating strumming patterns...');
                this.isActive = false;
                return false;
            }
        } catch (error) {
            console.error('Error in strumming patterns toggle:', error);
            return false;
        }
    }

    toggleMetronomeIntegration() {
        const metronomeControls = document.getElementById('metronome-controls');
        const metronomeStatus = document.getElementById('metronome-status');

        if (!window.metronome) {
            alert('Metronome not available. Please ensure the metronome is loaded.');
            return;
        }

        const isMetronomeActive = window.metronome.isPlaying;

        if (!isMetronomeActive) {
            // Show metronome controls
            if (metronomeControls) {
                metronomeControls.style.display = 'block';
            }
            if (metronomeStatus) {
                metronomeStatus.textContent = 'Ready';
                metronomeStatus.style.color = 'var(--warning-color)';
            }
        } else {
            // Stop metronome
            window.metronome.stop();
            if (metronomeStatus) {
                metronomeStatus.textContent = 'Off';
                metronomeStatus.style.color = 'var(--text-muted)';
            }
            if (metronomeControls) {
                metronomeControls.style.display = 'none';
            }
        }
    }

    syncTempoToPattern(useMaxBPM = false) {
        if (!this.currentPattern || !window.metronome) return;

        const targetBPM = useMaxBPM ? this.currentPattern.bpm[1] : this.currentPattern.bpm[0];
        window.metronome.setTempo(targetBPM);

        const metronomeStatus = document.getElementById('metronome-status');
        if (metronomeStatus) {
            metronomeStatus.textContent = `Synced to ${targetBPM} BPM`;
            metronomeStatus.style.color = 'var(--success-color)';
        }

        console.log(`Metronome tempo synced to ${targetBPM} BPM`);
    }

    syncTimeSignature() {
        if (!this.currentPattern || !window.metronome) return;

        const timeSignature = this.currentPattern.timeSignature;
        const [numerator, denominator] = timeSignature.split('/').map(Number);

        window.metronome.setTimeSignature(numerator, denominator);

        console.log(`Metronome time signature synced to ${timeSignature}`);
    }

    openScalesIntegration() {
        if (!this.currentPattern) {
            alert('Please select a strumming pattern first.');
            return;
        }

        const suggestedChords = this.chordSuggestions[this.currentPattern.category];
        const patternInfo = {
            name: this.currentPattern.name,
            category: this.currentPattern.category,
            timeSignature: this.currentPattern.timeSignature,
            bpm: this.currentPattern.bpm,
            chords: suggestedChords
        };

        // Store pattern info for scales page
        localStorage.setItem('strummingPatternInfo', JSON.stringify(patternInfo));

        // Open scales page in new tab
        window.open('scales.html?from=strumming', '_blank');
    }

    dispose() {
        this.isActive = false;
        this.currentPattern = null;

        // Clean up metronome integration
        const metronomeStatus = document.getElementById('metronome-status');
        if (metronomeStatus) {
            metronomeStatus.textContent = 'Off';
            metronomeStatus.style.color = 'var(--text-muted)';
        }
    }
}

// Create global strumming patterns instance
window.strummingPatterns = new StrummingPatterns();

console.log('Strumming patterns loaded');