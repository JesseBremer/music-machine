// rhythm-engine.js - Enhanced rhythm section with professional drums and smart bass generation
// Uses Tone.js for synthesis and sampling

class RhythmEngine {
    constructor() {
        this.initialized = false;
        this.drumSamplers = null;
        this.bassSynths = {}; // Multiple bass synth types
        this.currentBassSynth = null;
        this.currentParts = [];
        this.humanize = true; // Enable humanization by default
        this.humanizeAmount = 0.02; // Timing variation in seconds
        this.velocityVariation = 0.15; // Velocity variation amount
        this.currentIntensity = 'medium'; // low, medium, high, peak
    }

    async initialize() {
        if (this.initialized) return true;

        try {
            await Tone.start();

            // Create professional drum samplers with extended kit
            this.drumSamplers = {
                // Core kit
                kick: new Tone.MembraneSynth({
                    pitchDecay: 0.05,
                    octaves: 10,
                    oscillator: { type: 'sine' },
                    envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4, attackCurve: 'exponential' }
                }).toDestination(),

                snare: new Tone.NoiseSynth({
                    noise: { type: 'white' },
                    envelope: { attack: 0.001, decay: 0.2, sustain: 0 }
                }).toDestination(),

                hihat: new Tone.MetalSynth({
                    frequency: 200,
                    envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
                    harmonicity: 5.1,
                    modulationIndex: 32,
                    resonance: 4000,
                    octaves: 1.5
                }).toDestination(),

                openHihat: new Tone.MetalSynth({
                    frequency: 200,
                    envelope: { attack: 0.001, decay: 0.3, release: 0.3 },
                    harmonicity: 5.1,
                    modulationIndex: 32,
                    resonance: 4000,
                    octaves: 1.5
                }).toDestination(),

                clap: new Tone.NoiseSynth({
                    noise: { type: 'white' },
                    envelope: { attack: 0.001, decay: 0.15, sustain: 0 }
                }).toDestination(),

                // Extended toms (high, mid, low)
                tomHigh: new Tone.MembraneSynth({
                    pitchDecay: 0.05,
                    octaves: 4,
                    oscillator: { type: 'sine' },
                    envelope: { attack: 0.001, decay: 0.2, sustain: 0.05, release: 0.4 }
                }).toDestination(),

                tom: new Tone.MembraneSynth({
                    pitchDecay: 0.08,
                    octaves: 4,
                    oscillator: { type: 'sine' },
                    envelope: { attack: 0.001, decay: 0.3, sustain: 0.1, release: 0.8 }
                }).toDestination(),

                tomLow: new Tone.MembraneSynth({
                    pitchDecay: 0.1,
                    octaves: 5,
                    oscillator: { type: 'sine' },
                    envelope: { attack: 0.001, decay: 0.4, sustain: 0.1, release: 1.0 }
                }).toDestination(),

                // Cymbals
                crash: new Tone.MetalSynth({
                    frequency: 300,
                    envelope: { attack: 0.001, decay: 1.5, release: 0.8 },
                    harmonicity: 5.1,
                    modulationIndex: 40,
                    resonance: 5000,
                    octaves: 2
                }).toDestination(),

                ride: new Tone.MetalSynth({
                    frequency: 400,
                    envelope: { attack: 0.001, decay: 0.6, release: 0.3 },
                    harmonicity: 4,
                    modulationIndex: 20,
                    resonance: 6000,
                    octaves: 1.2
                }).toDestination(),

                rideBell: new Tone.MetalSynth({
                    frequency: 800,
                    envelope: { attack: 0.001, decay: 0.4, release: 0.2 },
                    harmonicity: 3,
                    modulationIndex: 10,
                    resonance: 8000,
                    octaves: 0.8
                }).toDestination(),

                // Percussion
                rimshot: new Tone.MembraneSynth({
                    pitchDecay: 0.01,
                    octaves: 2,
                    oscillator: { type: 'triangle' },
                    envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.1 }
                }).toDestination(),

                shaker: new Tone.NoiseSynth({
                    noise: { type: 'pink' },
                    envelope: { attack: 0.001, decay: 0.08, sustain: 0 }
                }).toDestination(),

                tambourine: new Tone.MetalSynth({
                    frequency: 600,
                    envelope: { attack: 0.001, decay: 0.15, release: 0.1 },
                    harmonicity: 8,
                    modulationIndex: 50,
                    resonance: 3000,
                    octaves: 1.8
                }).toDestination(),

                cowbell: new Tone.MetalSynth({
                    frequency: 560,
                    envelope: { attack: 0.001, decay: 0.3, release: 0.1 },
                    harmonicity: 2,
                    modulationIndex: 5,
                    resonance: 2000,
                    octaves: 0.5
                }).toDestination(),

                conga: new Tone.MembraneSynth({
                    pitchDecay: 0.03,
                    octaves: 3,
                    oscillator: { type: 'sine' },
                    envelope: { attack: 0.001, decay: 0.15, sustain: 0.02, release: 0.3 }
                }).toDestination(),

                bongo: new Tone.MembraneSynth({
                    pitchDecay: 0.02,
                    octaves: 2,
                    oscillator: { type: 'sine' },
                    envelope: { attack: 0.001, decay: 0.1, sustain: 0.01, release: 0.2 }
                }).toDestination(),

                // Ghost snare (quieter for fills and grooves)
                ghostSnare: new Tone.NoiseSynth({
                    noise: { type: 'white' },
                    envelope: { attack: 0.001, decay: 0.1, sustain: 0 }
                }).toDestination()
            };

            // Create multiple bass synth types with gain control
            this.bassGain = new Tone.Gain(1.5).toDestination(); // Increase bass volume

            // Standard fingered bass (default)
            this.bassSynths.fingered = new Tone.MonoSynth({
                oscillator: { type: 'sawtooth' },
                filter: { Q: 3, type: 'lowpass', rolloff: -24 },
                envelope: { attack: 0.01, decay: 0.3, sustain: 0.5, release: 1.2 },
                filterEnvelope: {
                    attack: 0.02, decay: 0.2, sustain: 0.4, release: 0.8,
                    baseFrequency: 80, octaves: 4
                },
                volume: 6
            }).connect(this.bassGain);

            // Picked bass (brighter attack)
            this.bassSynths.picked = new Tone.MonoSynth({
                oscillator: { type: 'square' },
                filter: { Q: 4, type: 'lowpass', rolloff: -12 },
                envelope: { attack: 0.005, decay: 0.2, sustain: 0.4, release: 0.8 },
                filterEnvelope: {
                    attack: 0.001, decay: 0.15, sustain: 0.3, release: 0.5,
                    baseFrequency: 120, octaves: 5
                },
                volume: 6
            }).connect(this.bassGain);

            // Synth bass (thick, electronic)
            this.bassSynths.synth = new Tone.MonoSynth({
                oscillator: { type: 'fatsawtooth', spread: 20, count: 3 },
                filter: { Q: 6, type: 'lowpass', rolloff: -24 },
                envelope: { attack: 0.02, decay: 0.4, sustain: 0.6, release: 1.5 },
                filterEnvelope: {
                    attack: 0.05, decay: 0.3, sustain: 0.5, release: 1.0,
                    baseFrequency: 60, octaves: 5
                },
                volume: 4
            }).connect(this.bassGain);

            // Sub bass (deep, minimal harmonics)
            this.bassSynths.sub = new Tone.MonoSynth({
                oscillator: { type: 'sine' },
                filter: { Q: 1, type: 'lowpass', rolloff: -12 },
                envelope: { attack: 0.02, decay: 0.5, sustain: 0.8, release: 2.0 },
                filterEnvelope: {
                    attack: 0.01, decay: 0.1, sustain: 0.8, release: 1.0,
                    baseFrequency: 40, octaves: 2
                },
                volume: 8
            }).connect(this.bassGain);

            // Slap bass (bright, percussive)
            this.bassSynths.slap = new Tone.MonoSynth({
                oscillator: { type: 'triangle' },
                filter: { Q: 8, type: 'bandpass', rolloff: -12 },
                envelope: { attack: 0.001, decay: 0.15, sustain: 0.2, release: 0.4 },
                filterEnvelope: {
                    attack: 0.001, decay: 0.1, sustain: 0.2, release: 0.3,
                    baseFrequency: 200, octaves: 6
                },
                volume: 5
            }).connect(this.bassGain);

            // Muted/palm-muted bass
            this.bassSynths.muted = new Tone.MonoSynth({
                oscillator: { type: 'sawtooth' },
                filter: { Q: 2, type: 'lowpass', rolloff: -48 },
                envelope: { attack: 0.002, decay: 0.08, sustain: 0.1, release: 0.15 },
                filterEnvelope: {
                    attack: 0.001, decay: 0.05, sustain: 0.1, release: 0.1,
                    baseFrequency: 100, octaves: 2
                },
                volume: 6
            }).connect(this.bassGain);

            // Fretless bass (smooth, gliding)
            this.bassSynths.fretless = new Tone.MonoSynth({
                oscillator: { type: 'sawtooth' },
                filter: { Q: 2, type: 'lowpass', rolloff: -24 },
                envelope: { attack: 0.03, decay: 0.4, sustain: 0.6, release: 1.5 },
                filterEnvelope: {
                    attack: 0.04, decay: 0.3, sustain: 0.5, release: 1.0,
                    baseFrequency: 70, octaves: 3
                },
                portamento: 0.08, // Enable glide between notes
                volume: 6
            }).connect(this.bassGain);

            // Set default bass synth
            this.currentBassSynth = this.bassSynths.fingered;
            this.currentBassTone = 'fingered';

            // Add compression for better sound
            const compressor = new Tone.Compressor(-20, 3).toDestination();
            this.drumSamplers.kick.connect(compressor);
            this.drumSamplers.snare.connect(compressor);
            this.drumSamplers.crash.connect(compressor);
            this.bassGain.connect(compressor);

            // Set default drum volumes for balance
            this.setDrumVolumes('medium');

            this.initialized = true;
            console.log('RhythmEngine initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize RhythmEngine:', error);
            return false;
        }
    }

    // Convert pattern string to trigger times (e.g., "x-x-x-x-" -> [0, 2, 4, 6])
    patternToTriggers(pattern, subdivision = '16n') {
        const triggers = [];
        const subdivisionTime = Tone.Time(subdivision).toSeconds();

        for (let i = 0; i < pattern.length; i++) {
            if (pattern[i] === 'x' || pattern[i] === 'X') {
                triggers.push(i * subdivisionTime);
            }
        }

        return triggers;
    }

    // Get drum patterns by style
    getDrumPatterns(style = 'rock') {
        const patterns = {
            rock: {
                name: 'Rock Beat',
                kick: 'x-------x-------',  // Kick on beats 1 and 3 (classic rock)
                snare: '----x-------x---',  // Snare on beats 2 and 4 (backbeat)
                hihat: 'x-x-x-x-x-x-x-x-',  // Steady 8th notes
                openHihat: '------x-------x-',  // Open on 2+ and 4+
                tempo: [80, 140]
            },
            pop: {
                name: 'Pop Groove',
                kick: 'x-----x-x-----x-',  // Syncopated pop kick
                snare: '----x-------x---',  // Snare on 2 and 4
                hihat: 'x-x-x-x-x-x-x-x-',  // 8th notes
                clap: '----x-------x---',   // Layered with snare
                shaker: 'x-x-x-x-x-x-x-x-',  // Light shaker layer
                tempo: [100, 130]
            },
            disco: {
                name: 'Disco Four-on-Floor',
                kick: 'x---x---x---x---',  // Four-on-floor (all 4 quarter notes)
                snare: '----x-------x---',  // Backbeat on 2 and 4
                hihat: 'xxxxxxxxxxxxxxxx',  // 16th notes for disco energy
                openHihat: '------x-------x-',  // Open accents
                cowbell: '----x-------x---',  // Classic disco cowbell
                tempo: [110, 130]
            },
            funk: {
                name: 'Funk Groove',
                kick: 'x---x-x---x-x---',  // Syncopated funk kick
                snare: '----x--x----x---',  // Ghost notes and backbeat
                ghostSnare: '--x---x---x---x-',  // Ghost note layer
                hihat: 'x-xxx-x-x-xxx-x-',  // 16th note funk hat pattern
                tempo: [95, 115]
            },
            hiphop: {
                name: 'Hip Hop Beat',
                kick: 'x-----x---x-----',  // Boom-bap kick pattern
                snare: '----x-------x---',  // Snare on 2 and 4
                hihat: 'x-x-x-x-x-x-x-x-',  // 8th notes
                clap: '----x-------x--x',   // Clap variation
                openHihat: '------x-------x-',  // Open hat accents
                tempo: [80, 100]
            },
            reggae: {
                name: 'Reggae One-Drop',
                kick: '--------x-------',  // One-drop: kick on beat 3 only
                rimshot: '--x---x---x---x-',  // Rimshot on offbeats
                hihat: 'x-x-x-x-x-x-x-x-',  // Steady 8ths
                openHihat: '--x-----x-----x-',  // Offbeat emphasis
                tempo: [70, 90]
            },
            electronic: {
                name: 'Electronic Dance',
                kick: 'x---x---x---x---',  // Four-on-floor
                snare: '----x--x----x--x',  // Syncopated snare/clap
                hihat: 'xxxxxxxxxxxxxxxx',  // Fast 16th notes
                clap: '----x-------x---',   // Layered clap
                crash: 'x---------------',  // Crash on downbeat
                tempo: [120, 140]
            },
            jazz: {
                name: 'Jazz Swing',
                kick: 'x-----x-----x---',  // Sparse jazz kick (feathering)
                snare: '------x-------x-',  // Light snare (brushes feel)
                ride: 'x--x--x--x--x--x',  // Swing ride pattern
                hihat: '----x-------x---',  // Hi-hat on 2 and 4 (foot)
                tempo: [100, 160]
            },
            latin: {
                name: 'Latin Groove',
                kick: 'x-x---x-x-x---x-',  // Tumbao/clave-based pattern
                snare: '----x-------x---',  // Backbeat
                hihat: 'x-x-x-x-x-x-x-x-',  // 8th notes
                conga: '--x---x---x---x-',  // Conga pattern
                bongo: 'x---x---x---x---',  // Bongo layer
                cowbell: '----x-------x---',  // Cowbell accents
                tempo: [100, 130]
            },
            blues: {
                name: 'Blues Shuffle',
                kick: 'x-----x-----x---',  // Shuffle kick
                snare: '----x-------x---',  // Backbeat on 2 and 4
                hihat: 'x--x--x--x--x--x',  // Shuffle/triplet pattern
                ride: '----x-------x---',  // Ride accent on backbeat
                tempo: [70, 110]
            },
            metal: {
                name: 'Metal Double Kick',
                kick: 'xxxx-xxx-xxx-xxx',  // Double bass pattern
                snare: '----x-------x---',  // Hard snare on 2 and 4
                hihat: 'xxxxxxxxxxxxxxxx',  // Fast hats
                crash: 'x---------------',  // Crash accent
                tomLow: '--------x-------',  // Low tom accent
                tempo: [140, 200]
            },
            punk: {
                name: 'Punk Beat',
                kick: 'x-x-x-x-x-x-x-x-',  // Driving kick on every 8th
                snare: '----x-------x---',  // Backbeat
                hihat: 'xxxxxxxxxxxxxxxx',  // Fast hats
                crash: 'x-------x-------',  // Crash accents
                tempo: [160, 200]
            },
            rnb: {
                name: 'R&B Groove',
                kick: 'x-----x-x-----x-',  // Smooth kick pattern
                snare: '----x-------x---',  // Backbeat
                hihat: 'x-x-x-x-x-x-x-x-',  // 8th notes
                ghostSnare: '--x-------x-----',  // Subtle ghost notes
                clap: '----x-------x---',   // Layered clap
                shaker: 'xxxxxxxxxxxxxxxx',  // 16th note shaker
                tempo: [85, 110]
            },
            gospel: {
                name: 'Gospel Groove',
                kick: 'x-----x-x-----x-',  // Driving kick
                snare: '----x-------x---',  // Powerful backbeat
                hihat: 'x-x-x-x-x-x-x-x-',  // 8th notes
                clap: '----x-------x---',   // Handclaps
                tambourine: 'x-x-x-x-x-x-x-x-',  // Tambourine layer
                crash: 'x---------------',  // Crash accent
                tempo: [90, 130]
            },
            country: {
                name: 'Country Two-Step',
                kick: 'x-------x-------',  // Simple two-beat
                snare: '----x-------x---',  // Backbeat
                hihat: 'x-x-x-x-x-x-x-x-',  // 8th notes
                ride: '----x-------x---',  // Ride accents
                tempo: [110, 140]
            },
            afrobeat: {
                name: 'Afrobeat Groove',
                kick: 'x---x-x---x-x---',  // Syncopated kick
                snare: '----x-------x---',  // Backbeat
                hihat: 'x-xxx-x-x-xxx-x-',  // Complex hat pattern
                conga: 'x-x-x---x-x-x---',  // Conga pattern
                shaker: 'xxxxxxxxxxxxxxxx',  // Shaker layer
                tempo: [105, 130]
            },
            bossanova: {
                name: 'Bossa Nova',
                kick: 'x-----x---x-----',  // Subtle kick
                snare: '------x-------x-',  // Rimshot cross-stick
                hihat: 'x-x-x-x-x-x-x-x-',  // Light 8th notes
                rimshot: '--x-------x-----',  // Cross-stick pattern
                shaker: 'x-x-x-x-x-x-x-x-',  // Soft shaker
                tempo: [120, 145]
            }
        };

        return patterns[style] || patterns.rock;
    }

    // Generate smart bass line from chord progression
    generateBassLine(chordProgression, key, style = 'root') {
        if (!chordProgression || chordProgression.length === 0) {
            return [];
        }

        const bassNotes = [];

        chordProgression.forEach((chord, index) => {
            try {
                // Get chord info using Tonal
                const chordInfo = Tonal.Chord.get(chord);
                const root = chordInfo.tonic || chord;

                // Transpose to bass range (E2-E3 range - comfortable bass range)
                // First ensure note is in octave 2 or 3
                let bassRoot = root;
                // Extract note name without octave
                const noteName = bassRoot.replace(/[0-9]/g, '');
                // Set to octave 2 for bass (e.g., C2, D2, E2, etc.)
                bassRoot = noteName + '2';

                // Get chord quality for smarter note selection
                const quality = chordInfo.quality || 'Major';
                const isMajor = quality.includes('Major') || quality === '';
                const isMinor = quality.includes('minor') || quality.includes('Minor');

                // Calculate correct intervals based on chord quality
                const thirdInterval = isMinor ? '3m' : '3M'; // Minor or major third
                const fifthInterval = '5P'; // Perfect fifth
                const seventhInterval = isMinor ? '7m' : '7M'; // Minor or major seventh

                switch (style) {
                    case 'root':
                        // Simple root notes
                        bassNotes.push({ note: bassRoot, articulation: 'normal' });
                        break;

                    case 'rootFifth':
                        // Root and fifth pattern
                        const fifth = Tonal.Note.transpose(bassRoot, fifthInterval);
                        bassNotes.push(
                            { note: bassRoot, articulation: 'normal' },
                            { note: fifth, articulation: 'normal' }
                        );
                        break;

                    case 'walking':
                        // Walking bass: root, third, fifth, chromatic approach
                        const walkingThird = Tonal.Note.transpose(bassRoot, thirdInterval);
                        const walkingFifth = Tonal.Note.transpose(bassRoot, fifthInterval);

                        bassNotes.push(
                            { note: bassRoot, articulation: 'normal' },
                            { note: walkingThird, articulation: 'normal' },
                            { note: walkingFifth, articulation: 'normal' }
                        );

                        // Add chromatic approach to next chord
                        if (index < chordProgression.length - 1) {
                            const nextChord = Tonal.Chord.get(chordProgression[index + 1]);
                            const nextRoot = nextChord.tonic || chordProgression[index + 1];
                            const nextRootName = nextRoot.replace(/[0-9]/g, '');
                            const nextBassRoot = nextRootName + '2';
                            const approach = Tonal.Note.transpose(nextBassRoot, '-1m');
                            bassNotes.push({ note: approach, articulation: 'slide' });
                        }
                        break;

                    case 'arpeggio':
                        // Full chord arpeggio in bass range
                        const arpThird = Tonal.Note.transpose(bassRoot, thirdInterval);
                        const arpFifth = Tonal.Note.transpose(bassRoot, fifthInterval);
                        bassNotes.push(
                            { note: bassRoot, articulation: 'normal' },
                            { note: arpThird, articulation: 'normal' },
                            { note: arpFifth, articulation: 'normal' },
                            { note: arpThird, articulation: 'normal' }
                        );
                        break;

                    case 'octaves':
                        // Root note in different octaves
                        const higherOctave = Tonal.Note.transpose(bassRoot, '8P');
                        bassNotes.push(
                            { note: bassRoot, articulation: 'normal' },
                            { note: higherOctave, articulation: 'normal' }
                        );
                        break;

                    case 'funky':
                        // Funky bass with ghost notes and syncopation
                        const funkyFifth = Tonal.Note.transpose(bassRoot, fifthInterval);
                        bassNotes.push(
                            { note: bassRoot, articulation: 'slap' },
                            { note: bassRoot, articulation: 'ghost' },
                            { note: funkyFifth, articulation: 'pop' },
                            { note: bassRoot, articulation: 'muted' }
                        );
                        break;

                    case 'slap':
                        // Slap bass style
                        const slapOctave = Tonal.Note.transpose(bassRoot, '8P');
                        bassNotes.push(
                            { note: bassRoot, articulation: 'slap' },
                            { note: bassRoot, articulation: 'ghost' },
                            { note: slapOctave, articulation: 'pop' },
                            { note: bassRoot, articulation: 'muted' }
                        );
                        break;

                    case 'disco':
                        // Disco octave bass
                        const discoOctave = Tonal.Note.transpose(bassRoot, '8P');
                        bassNotes.push(
                            { note: bassRoot, articulation: 'normal' },
                            { note: discoOctave, articulation: 'normal' },
                            { note: bassRoot, articulation: 'normal' },
                            { note: discoOctave, articulation: 'normal' }
                        );
                        break;

                    case 'reggae':
                        // Reggae one-drop bass
                        const reggaeFifth = Tonal.Note.transpose(bassRoot, fifthInterval);
                        bassNotes.push(
                            { note: bassRoot, articulation: 'muted' },
                            { note: bassRoot, articulation: 'normal' },
                            { note: reggaeFifth, articulation: 'normal' },
                            { note: bassRoot, articulation: 'muted' }
                        );
                        break;

                    case 'latin':
                        // Latin tumbao bass pattern
                        const latinFifth = Tonal.Note.transpose(bassRoot, fifthInterval);
                        const latinOctave = Tonal.Note.transpose(bassRoot, '8P');
                        bassNotes.push(
                            { note: bassRoot, articulation: 'normal' },
                            { note: latinFifth, articulation: 'normal' },
                            { note: latinOctave, articulation: 'normal' },
                            { note: latinFifth, articulation: 'staccato' }
                        );
                        break;

                    case 'syncopated':
                        // Syncopated pattern
                        const syncFifth = Tonal.Note.transpose(bassRoot, fifthInterval);
                        bassNotes.push(
                            { note: bassRoot, articulation: 'normal' },
                            { note: bassRoot, articulation: 'ghost' },
                            { note: syncFifth, articulation: 'normal' },
                            { note: bassRoot, articulation: 'staccato' }
                        );
                        break;

                    case 'pedal':
                        // Pedal bass (sustain root)
                        bassNotes.push({ note: bassRoot, articulation: 'sustain' });
                        break;

                    case 'chromatic':
                        // Chromatic walking bass
                        const chromThird = Tonal.Note.transpose(bassRoot, thirdInterval);
                        const chromFifth = Tonal.Note.transpose(bassRoot, fifthInterval);
                        const chromApproach = Tonal.Note.transpose(bassRoot, '2m'); // Half step up

                        bassNotes.push(
                            { note: bassRoot, articulation: 'normal' },
                            { note: chromApproach, articulation: 'slide' },
                            { note: chromThird, articulation: 'normal' },
                            { note: chromFifth, articulation: 'normal' }
                        );
                        break;

                    default:
                        bassNotes.push({ note: bassRoot, articulation: 'normal' });
                }
            } catch (error) {
                console.error('Error generating bass note for chord:', chord, error);
                bassNotes.push('C2'); // Fallback
            }
        });

        return bassNotes;
    }

    // Get bass pattern rhythm - maps bass style to rhythm pattern
    getBassPattern(style = 'root') {
        // Map bass styles to rhythm patterns
        const styleToPattern = {
            'root': 'steady',
            'rootFifth': 'syncopated',
            'walking': 'walking',
            'arpeggio': 'funky',
            'octaves': 'syncopated',
            'funky': 'funky',
            'slap': 'slap',
            'disco': 'disco',
            'reggae': 'reggae',
            'latin': 'latin',
            'syncopated': 'syncopated',
            'pedal': 'pedal',
            'chromatic': 'walking'
        };

        const patternName = styleToPattern[style] || 'steady';

        const patterns = {
            steady: 'x---x---x---x---',     // Quarter notes
            syncopated: 'x---x-x---x-x-x-',  // Syncopated
            walking: 'x-x-x-x-x-x-x-x-',     // Walking eighths
            funky: 'x-xxx-x-x-x-x-x-',       // Funky sixteenths
            slap: 'x-x-x-x-x-x-x-x-',        // Slap pattern
            reggae: '--x---x---x---x-',      // Reggae offbeat
            latin: 'x-x-x---x-x-x-x-',       // Latin tumbao
            minimal: 'x-------x-------',     // Minimal half notes
            disco: 'x---x---x-x-x---',       // Disco groove
            pedal: 'x---------------'        // Pedal (whole note)
        };

        return patterns[patternName] || patterns.steady;
    }

    // Get appropriate subdivision for bass style
    getSubdivisionForBassStyle(style, notesPerChord) {
        const subdivisions = {
            'root': '4n',           // Quarter notes for simple root
            'rootFifth': '8n',      // Eighth notes for root-fifth
            'walking': '8n',        // Eighth notes for walking bass
            'arpeggio': '16n',      // 16th notes for arpeggios
            'octaves': '8n',        // Eighth notes for octaves
            'funky': '16n',         // 16th notes for funk
            'slap': '16n',          // 16th notes for slap bass
            'disco': '8n',          // Eighth notes for disco
            'reggae': '8n',         // Eighth notes for reggae
            'latin': '8n',          // Eighth notes for latin
            'syncopated': '16n',    // 16th notes for syncopated
            'pedal': '1n',          // Whole notes for pedal tone
            'chromatic': '8n'       // Eighth notes for chromatic
        };

        return subdivisions[style] || '8n';
    }

    // Get note duration for bass style
    getNoteDurationForStyle(style) {
        const durations = {
            'root': '4n',           // Quarter note duration
            'rootFifth': '8n',      // Eighth note duration
            'walking': '8n',        // Eighth note duration
            'arpeggio': '16n',      // 16th note duration
            'octaves': '8n',        // Eighth note duration
            'funky': '16n',         // 16th note duration
            'slap': '16n',          // 16th note duration
            'disco': '8n',          // Eighth note duration
            'reggae': '8n',         // Eighth note duration
            'latin': '8n',          // Eighth note duration
            'syncopated': '16n',    // 16th note duration
            'pedal': '1n',          // Whole note duration
            'chromatic': '8n'       // Eighth note duration
        };

        return durations[style] || '8n';
    }

    // Set bass tone/synth type
    setBassTone(tone) {
        if (this.bassSynths[tone]) {
            this.currentBassSynth = this.bassSynths[tone];
            this.currentBassTone = tone;
            console.log(`🎸 Bass tone set to: ${tone}`);
            return true;
        }
        console.warn(`⚠️ Unknown bass tone: ${tone}`);
        return false;
    }

    // Get available bass tones
    getAvailableBassTones() {
        return Object.keys(this.bassSynths);
    }

    // Set bass intensity/dynamics
    setBassIntensity(level) {
        const intensityMap = {
            'low': { gain: 0.6, filterMult: 0.7 },
            'medium': { gain: 1.0, filterMult: 1.0 },
            'high': { gain: 1.3, filterMult: 1.2 },
            'peak': { gain: 1.5, filterMult: 1.4 }
        };

        const settings = intensityMap[level];
        if (settings && this.bassGain) {
            this.bassGain.gain.value = settings.gain * 1.5; // Base gain is 1.5
            console.log(`🎸 Bass intensity set to: ${level} (gain: ${settings.gain})`);
        }
    }

    // Play bass note with articulation
    playBassWithArticulation(note, duration, articulation = 'normal', time = undefined) {
        if (!this.currentBassSynth) return;

        // Base velocity for bass
        let velocity = 0.8;
        let actualDuration = duration;

        // Apply articulation modifiers
        switch (articulation) {
            case 'ghost':
                // Ghost note: very quiet, short
                velocity = 0.25;
                actualDuration = '32n';
                this.currentBassSynth.triggerAttackRelease(note, actualDuration, time, velocity);
                break;

            case 'muted':
                // Muted/palm-muted: use muted synth if available, otherwise short duration
                velocity = 0.6;
                actualDuration = '16n';
                if (this.bassSynths.muted) {
                    this.bassSynths.muted.triggerAttackRelease(note, actualDuration, time, velocity);
                } else {
                    this.currentBassSynth.triggerAttackRelease(note, actualDuration, time, velocity);
                }
                break;

            case 'staccato':
                // Staccato: short and punchy
                velocity = 0.9;
                actualDuration = '16n';
                this.currentBassSynth.triggerAttackRelease(note, actualDuration, time, velocity);
                break;

            case 'slap':
                // Slap: use slap synth, high velocity
                velocity = 1.0;
                if (this.bassSynths.slap) {
                    this.bassSynths.slap.triggerAttackRelease(note, duration, time, velocity);
                } else {
                    this.currentBassSynth.triggerAttackRelease(note, duration, time, velocity);
                }
                break;

            case 'pop':
                // Pop (for slap bass): bright, high octave
                velocity = 0.95;
                const popNote = Tonal.Note.transpose(note, '8P'); // Octave up
                if (this.bassSynths.slap) {
                    this.bassSynths.slap.triggerAttackRelease(popNote, '16n', time, velocity);
                } else {
                    this.currentBassSynth.triggerAttackRelease(popNote, '16n', time, velocity);
                }
                break;

            case 'slide':
                // Slide: use fretless synth with portamento
                velocity = 0.8;
                if (this.bassSynths.fretless) {
                    this.bassSynths.fretless.triggerAttackRelease(note, duration, time, velocity);
                } else {
                    this.currentBassSynth.triggerAttackRelease(note, duration, time, velocity);
                }
                break;

            case 'sustain':
                // Sustain: long duration
                velocity = 0.75;
                actualDuration = '1n'; // Whole note
                this.currentBassSynth.triggerAttackRelease(note, actualDuration, time, velocity);
                break;

            case 'accent':
                // Accent: louder
                velocity = 1.0;
                this.currentBassSynth.triggerAttackRelease(note, duration, time, velocity);
                break;

            case 'normal':
            default:
                // Normal articulation
                this.currentBassSynth.triggerAttackRelease(note, duration, time, velocity);
                break;
        }
    }

    // Play complete rhythm section
    async playRhythmSection(chordProgression, key, tempo = 120, drumStyle = 'rock', bassStyle = 'root') {
        if (!this.initialized) {
            await this.initialize();
        }

        // Stop any existing parts
        this.stop();

        // Set tempo
        Tone.Transport.bpm.value = tempo;

        // Get drum pattern
        const drumPattern = this.getDrumPatterns(drumStyle);

        // Schedule drums
        Object.entries(drumPattern).forEach(([drumType, pattern]) => {
            if (drumType === 'name' || drumType === 'tempo') return;
            if (!this.drumSamplers[drumType]) return;

            const triggers = this.patternToTriggers(pattern);

            triggers.forEach(time => {
                const part = new Tone.Part((t) => {
                    this.triggerDrum(drumType, t);
                }, [[time]]).start(0);

                part.loop = true;
                part.loopEnd = '1m'; // Loop every measure
                this.currentParts.push(part);
            });
        });

        // Generate and schedule bass line
        if (chordProgression && chordProgression.length > 0) {
            const bassNotes = this.generateBassLine(chordProgression, key, bassStyle);

            // Create a rhythm pattern that matches the number of generated notes
            // This ensures ALL bass notes are played
            const notesPerChord = Math.ceil(bassNotes.length / chordProgression.length);
            const beatsPerChord = 4; // Assuming 4/4 time signature
            const subdivision = this.getSubdivisionForBassStyle(bassStyle, notesPerChord);

            // Generate rhythm pattern dynamically to fit all notes
            // Styles that generate multiple notes per chord need dynamic patterns
            const multiNoteStyles = ['walking', 'arpeggio', 'funky', 'slap', 'disco', 'reggae', 'latin', 'syncopated', 'chromatic'];
            let bassRhythm;
            if (multiNoteStyles.includes(bassStyle)) {
                // For styles with many notes, create pattern with all hits
                bassRhythm = 'x'.repeat(bassNotes.length); // Play every note
            } else {
                // For simpler styles, use the preset pattern
                bassRhythm = this.getBassPattern(bassStyle);
            }

            const bassTriggers = this.patternToTriggers(bassRhythm, subdivision);

            console.log('🎸 Bass Configuration:', {
                style: bassStyle,
                chords: chordProgression,
                key: key,
                generatedNotes: bassNotes,
                notesCount: bassNotes.length,
                rhythm: bassRhythm,
                subdivision: subdivision,
                triggers: bassTriggers.length
            });

            // Ensure we have enough triggers for all notes
            const triggersNeeded = bassNotes.length;
            const actualTriggers = bassTriggers.length >= triggersNeeded ?
                bassTriggers.slice(0, triggersNeeded) :
                bassTriggers;

            // Schedule each bass note with articulation support
            actualTriggers.forEach((time, index) => {
                const noteData = bassNotes[index % bassNotes.length];
                // Handle both old format (string) and new format (object with articulation)
                const note = typeof noteData === 'string' ? noteData : noteData.note;
                const articulation = typeof noteData === 'string' ? 'normal' : noteData.articulation;
                const baseDuration = this.getNoteDurationForStyle(bassStyle);

                const part = new Tone.Part((t) => {
                    // Add logging for debugging
                    console.log(`🎸 Playing bass ${index + 1}/${bassNotes.length}: ${note} (${articulation}) at time ${t}`);
                    this.playBassWithArticulation(note, baseDuration, articulation, t);
                }, [[time]]).start(0);

                part.loop = true;
                part.loopEnd = `${chordProgression.length}m`; // Loop based on progression length
                this.currentParts.push(part);
            });

            console.log(`✅ Bass scheduled: ${bassNotes.length} notes, ${actualTriggers.length} triggers`);
        } else {
            console.warn('⚠️ No chord progression provided, skipping bass');
        }

        // Start transport
        console.log('▶️ Starting Tone.Transport at', tempo, 'BPM');
        Tone.Transport.start();
    }

    // Trigger individual drum with humanization support
    triggerDrum(drumType, time = undefined, velocity = 1) {
        if (!this.drumSamplers || !this.drumSamplers[drumType]) return;

        // Apply humanization if enabled
        let actualTime = time;
        let actualVelocity = velocity * 0.8; // Base reduction to prevent clipping

        if (this.humanize && time !== undefined) {
            // Add subtle timing variation
            const timeVariation = (Math.random() - 0.5) * 2 * this.humanizeAmount;
            actualTime = time + timeVariation;

            // Add velocity variation
            const velVariation = (Math.random() - 0.5) * 2 * this.velocityVariation;
            actualVelocity = Math.max(0.1, Math.min(1, actualVelocity + velVariation));
        }

        // Apply intensity scaling
        actualVelocity *= this.getIntensityMultiplier();

        switch (drumType) {
            // Core kit
            case 'kick':
                this.drumSamplers.kick.triggerAttackRelease('C1', '8n', actualTime, actualVelocity);
                break;
            case 'snare':
                this.drumSamplers.snare.triggerAttackRelease('16n', actualTime, actualVelocity);
                break;
            case 'ghostSnare':
                this.drumSamplers.ghostSnare.triggerAttackRelease('16n', actualTime, actualVelocity * 0.3);
                break;
            case 'hihat':
                this.drumSamplers.hihat.triggerAttackRelease('32n', actualTime, actualVelocity * 0.6);
                break;
            case 'openHihat':
                this.drumSamplers.openHihat.triggerAttackRelease('8n', actualTime, actualVelocity * 0.5);
                break;
            case 'clap':
                this.drumSamplers.clap.triggerAttackRelease('16n', actualTime, actualVelocity);
                break;

            // Extended toms
            case 'tomHigh':
                this.drumSamplers.tomHigh.triggerAttackRelease('A2', '8n', actualTime, actualVelocity);
                break;
            case 'tom':
                this.drumSamplers.tom.triggerAttackRelease('F2', '8n', actualTime, actualVelocity);
                break;
            case 'tomLow':
                this.drumSamplers.tomLow.triggerAttackRelease('C2', '8n', actualTime, actualVelocity);
                break;

            // Cymbals
            case 'crash':
                this.drumSamplers.crash.triggerAttackRelease('16n', actualTime, actualVelocity * 0.7);
                break;
            case 'ride':
                this.drumSamplers.ride.triggerAttackRelease('16n', actualTime, actualVelocity * 0.5);
                break;
            case 'rideBell':
                this.drumSamplers.rideBell.triggerAttackRelease('16n', actualTime, actualVelocity * 0.6);
                break;

            // Percussion
            case 'rimshot':
                this.drumSamplers.rimshot.triggerAttackRelease('E4', '16n', actualTime, actualVelocity * 0.8);
                break;
            case 'shaker':
                this.drumSamplers.shaker.triggerAttackRelease('32n', actualTime, actualVelocity * 0.4);
                break;
            case 'tambourine':
                this.drumSamplers.tambourine.triggerAttackRelease('32n', actualTime, actualVelocity * 0.5);
                break;
            case 'cowbell':
                this.drumSamplers.cowbell.triggerAttackRelease('16n', actualTime, actualVelocity * 0.6);
                break;
            case 'conga':
                this.drumSamplers.conga.triggerAttackRelease('G3', '8n', actualTime, actualVelocity * 0.7);
                break;
            case 'bongo':
                this.drumSamplers.bongo.triggerAttackRelease('D4', '16n', actualTime, actualVelocity * 0.7);
                break;
        }
    }

    // Get intensity multiplier based on current intensity level
    getIntensityMultiplier() {
        const multipliers = {
            'low': 0.5,
            'medium': 0.75,
            'high': 1.0,
            'peak': 1.2
        };
        return multipliers[this.currentIntensity] || 0.75;
    }

    // Set intensity level (affects overall dynamics)
    setIntensity(level) {
        if (['low', 'medium', 'high', 'peak'].includes(level)) {
            this.currentIntensity = level;
            console.log(`🎚️ Drum intensity set to: ${level}`);
        }
    }

    // Set drum volumes based on intensity (called during init and when changing intensity)
    setDrumVolumes(intensity = 'medium') {
        if (!this.drumSamplers) return;

        const volumePresets = {
            low: {
                kick: -6, snare: -8, hihat: -14, openHihat: -14, clap: -8,
                tomHigh: -10, tom: -10, tomLow: -10,
                crash: -12, ride: -14, rideBell: -12,
                rimshot: -12, shaker: -16, tambourine: -14, cowbell: -12, conga: -12, bongo: -12,
                ghostSnare: -18
            },
            medium: {
                kick: -3, snare: -5, hihat: -12, openHihat: -12, clap: -5,
                tomHigh: -7, tom: -7, tomLow: -7,
                crash: -10, ride: -12, rideBell: -10,
                rimshot: -10, shaker: -14, tambourine: -12, cowbell: -10, conga: -10, bongo: -10,
                ghostSnare: -16
            },
            high: {
                kick: 0, snare: -2, hihat: -10, openHihat: -10, clap: -2,
                tomHigh: -4, tom: -4, tomLow: -4,
                crash: -6, ride: -10, rideBell: -8,
                rimshot: -8, shaker: -12, tambourine: -10, cowbell: -8, conga: -8, bongo: -8,
                ghostSnare: -14
            },
            peak: {
                kick: 2, snare: 0, hihat: -8, openHihat: -8, clap: 0,
                tomHigh: -2, tom: -2, tomLow: -2,
                crash: -4, ride: -8, rideBell: -6,
                rimshot: -6, shaker: -10, tambourine: -8, cowbell: -6, conga: -6, bongo: -6,
                ghostSnare: -12
            }
        };

        const volumes = volumePresets[intensity] || volumePresets.medium;

        Object.entries(volumes).forEach(([drum, volume]) => {
            if (this.drumSamplers[drum]) {
                this.drumSamplers[drum].volume.value = volume;
            }
        });

        this.currentIntensity = intensity;
    }

    // Toggle humanization on/off
    setHumanize(enabled, amount = 0.02) {
        this.humanize = enabled;
        this.humanizeAmount = amount;
        console.log(`🎵 Humanization ${enabled ? 'enabled' : 'disabled'} (amount: ${amount}s)`);
    }

    // Get drum fills by style (for transitions between sections)
    getDrumFills(style = 'rock') {
        const fills = {
            rock: [
                // Simple fill: kick-snare-tom descend
                { pattern: 'x---x-x-xxxx----', instruments: ['kick', 'kick', 'snare', 'tomHigh', 'tom', 'tom', 'tomLow', 'tomLow'] },
                // Double kick fill
                { pattern: 'xx--x-x-x-x-x---', instruments: ['kick', 'kick', 'snare', 'snare', 'tomHigh', 'tom', 'tomLow', 'crash'] },
                // Tom roll
                { pattern: '----xxxxxxxxxxxx', instruments: ['tomHigh', 'tomHigh', 'tom', 'tom', 'tom', 'tom', 'tomLow', 'tomLow', 'tomLow', 'tomLow', 'crash', 'kick'] }
            ],
            pop: [
                { pattern: 'x---x---x-x-x-xx', instruments: ['kick', 'snare', 'snare', 'clap', 'snare', 'clap', 'crash'] },
                { pattern: '----x-x-x-x-xxxx', instruments: ['snare', 'snare', 'clap', 'snare', 'tomHigh', 'tom', 'tomLow', 'crash'] }
            ],
            funk: [
                { pattern: 'x-x-x-x-x-x-x-xx', instruments: ['kick', 'ghostSnare', 'snare', 'ghostSnare', 'kick', 'ghostSnare', 'snare', 'ghostSnare', 'crash'] },
                { pattern: 'x-xxx-x-x-xxx-xx', instruments: ['kick', 'ghostSnare', 'snare', 'ghostSnare', 'ghostSnare', 'kick', 'snare', 'kick', 'ghostSnare', 'snare', 'crash'] }
            ],
            jazz: [
                { pattern: 'x--x--x--x--x---', instruments: ['ride', 'snare', 'ride', 'tomHigh', 'tom', 'crash'] },
                { pattern: '---x---x--x-x-x-', instruments: ['snare', 'tom', 'tomHigh', 'tom', 'tomLow', 'crash'] }
            ],
            latin: [
                { pattern: 'x-x-x-x-x-x-xxxx', instruments: ['conga', 'bongo', 'conga', 'bongo', 'conga', 'bongo', 'tomHigh', 'tom', 'tomLow', 'crash'] },
                { pattern: 'xxxx----xxxx-xxx', instruments: ['bongo', 'bongo', 'conga', 'conga', 'bongo', 'bongo', 'conga', 'conga', 'tom', 'tomLow', 'crash'] }
            ],
            electronic: [
                { pattern: 'x-x-x-x-xxxxxxxx', instruments: ['kick', 'kick', 'snare', 'kick', 'hihat', 'hihat', 'hihat', 'hihat', 'hihat', 'hihat', 'clap', 'crash'] },
                { pattern: 'xxxx--xxxxxxxxxx', instruments: ['kick', 'kick', 'clap', 'clap', 'hihat', 'hihat', 'hihat', 'hihat', 'hihat', 'hihat', 'hihat', 'crash'] }
            ],
            hiphop: [
                { pattern: 'x---x---x-x-x-xx', instruments: ['kick', 'snare', 'kick', 'snare', 'clap', 'crash'] },
                { pattern: 'x-x---x-x---xxxx', instruments: ['kick', 'kick', 'snare', 'kick', 'tomHigh', 'tom', 'tomLow', 'crash'] }
            ],
            disco: [
                { pattern: 'x---x---x---xxxx', instruments: ['kick', 'kick', 'kick', 'tomHigh', 'tom', 'tomLow', 'crash'] },
                { pattern: 'x-x-x-x-x-xxxxxx', instruments: ['kick', 'kick', 'kick', 'kick', 'kick', 'hihat', 'hihat', 'tomHigh', 'tom', 'tomLow', 'crash'] }
            ],
            reggae: [
                { pattern: '----x---x---x-x-', instruments: ['rimshot', 'rimshot', 'tom', 'tomLow', 'crash'] },
                { pattern: '--x---x---x-xxxx', instruments: ['rimshot', 'rimshot', 'tom', 'bongo', 'conga', 'tomLow', 'crash'] }
            ],
            blues: [
                { pattern: 'x--x--x--x--x-xx', instruments: ['kick', 'snare', 'tom', 'tom', 'tomLow', 'crash'] },
                { pattern: '---x--x--x-xxxxx', instruments: ['snare', 'tom', 'tomHigh', 'tom', 'tom', 'tomLow', 'tomLow', 'crash'] }
            ]
        };

        return fills[style] || fills.rock;
    }

    // Play a drum fill (for transitions)
    async playDrumFill(style = 'rock', fillIndex = 0) {
        if (!this.initialized) {
            await this.initialize();
        }

        const fills = this.getDrumFills(style);
        const fill = fills[fillIndex % fills.length];

        let instrumentIndex = 0;
        const subdivisionTime = Tone.Time('16n').toSeconds();

        for (let i = 0; i < fill.pattern.length; i++) {
            if (fill.pattern[i] === 'x') {
                const instrument = fill.instruments[instrumentIndex % fill.instruments.length];
                const time = Tone.now() + (i * subdivisionTime);
                this.triggerDrum(instrument, time);
                instrumentIndex++;
            }
        }

        console.log(`🥁 Playing ${style} fill #${fillIndex + 1}`);
    }

    // Stop all rhythm parts
    stop() {
        this.currentParts.forEach(part => {
            part.stop();
            part.dispose();
        });
        this.currentParts = [];
        Tone.Transport.stop();
    }

    // Preview a single drum pattern
    async previewDrumPattern(style, tempo = 120) {
        if (!this.initialized) {
            await this.initialize();
        }

        this.stop();
        Tone.Transport.bpm.value = tempo;

        const drumPattern = this.getDrumPatterns(style);

        Object.entries(drumPattern).forEach(([drumType, pattern]) => {
            if (drumType === 'name' || drumType === 'tempo') return;
            if (!this.drumSamplers[drumType]) return;

            const triggers = this.patternToTriggers(pattern);

            triggers.forEach(time => {
                const part = new Tone.Part((t) => {
                    this.triggerDrum(drumType, t);
                }, [[time]]).start(0);

                part.loop = true;
                part.loopEnd = '1m';
                this.currentParts.push(part);
            });
        });

        Tone.Transport.start();

        // Auto-stop after 4 bars
        setTimeout(() => this.stop(), Tone.Time('4m').toSeconds() * 1000);
    }

    // Get available styles
    getAvailableStyles() {
        return {
            drums: ['rock', 'pop', 'disco', 'funk', 'hiphop', 'reggae', 'electronic', 'jazz', 'latin', 'blues',
                    'metal', 'punk', 'country', 'rnb', 'gospel', 'afrobeat', 'bossanova'],
            bass: ['root', 'rootFifth', 'walking', 'arpeggio', 'octaves', 'funky', 'slap', 'disco',
                   'reggae', 'latin', 'syncopated', 'pedal', 'chromatic'],
            bassTones: ['fingered', 'picked', 'synth', 'sub', 'slap', 'muted', 'fretless'],
            intensity: ['low', 'medium', 'high', 'peak']
        };
    }

    // Get all available drum instruments
    getAvailableDrumInstruments() {
        return [
            // Core kit
            'kick', 'snare', 'ghostSnare', 'hihat', 'openHihat', 'clap',
            // Toms
            'tomHigh', 'tom', 'tomLow',
            // Cymbals
            'crash', 'ride', 'rideBell',
            // Percussion
            'rimshot', 'shaker', 'tambourine', 'cowbell', 'conga', 'bongo'
        ];
    }

    // Preview bass with a specific tone
    async previewBassTone(tone, note = 'C2') {
        if (!this.initialized) {
            await this.initialize();
        }

        const synth = this.bassSynths[tone];
        if (synth) {
            synth.triggerAttackRelease(note, '4n');
            console.log(`🎸 Preview bass tone: ${tone} (${note})`);
        }
    }

    // Get recommended settings for a genre
    getRecommendedSettingsForGenre(genre) {
        const recommendations = {
            rock: { drumStyle: 'rock', bassStyle: 'rootFifth', bassTone: 'picked', intensity: 'high' },
            pop: { drumStyle: 'pop', bassStyle: 'root', bassTone: 'fingered', intensity: 'medium' },
            disco: { drumStyle: 'disco', bassStyle: 'disco', bassTone: 'fingered', intensity: 'high' },
            funk: { drumStyle: 'funk', bassStyle: 'funky', bassTone: 'slap', intensity: 'medium' },
            hiphop: { drumStyle: 'hiphop', bassStyle: 'root', bassTone: 'sub', intensity: 'high' },
            reggae: { drumStyle: 'reggae', bassStyle: 'reggae', bassTone: 'fingered', intensity: 'low' },
            electronic: { drumStyle: 'electronic', bassStyle: 'syncopated', bassTone: 'synth', intensity: 'high' },
            jazz: { drumStyle: 'jazz', bassStyle: 'walking', bassTone: 'fretless', intensity: 'low' },
            latin: { drumStyle: 'latin', bassStyle: 'latin', bassTone: 'fingered', intensity: 'medium' },
            blues: { drumStyle: 'blues', bassStyle: 'walking', bassTone: 'fingered', intensity: 'medium' },
            metal: { drumStyle: 'rock', bassStyle: 'rootFifth', bassTone: 'picked', intensity: 'peak' },
            rnb: { drumStyle: 'hiphop', bassStyle: 'syncopated', bassTone: 'fingered', intensity: 'medium' },
            gospel: { drumStyle: 'pop', bassStyle: 'walking', bassTone: 'fingered', intensity: 'high' },
            country: { drumStyle: 'rock', bassStyle: 'root', bassTone: 'picked', intensity: 'medium' },
            afrobeat: { drumStyle: 'latin', bassStyle: 'syncopated', bassTone: 'fingered', intensity: 'high' },
            bossanova: { drumStyle: 'latin', bassStyle: 'latin', bassTone: 'fretless', intensity: 'low' }
        };

        return recommendations[genre] || recommendations.pop;
    }

    // Apply recommended settings for a genre
    applyGenreSettings(genre) {
        const settings = this.getRecommendedSettingsForGenre(genre);
        this.setBassTone(settings.bassTone);
        this.setIntensity(settings.intensity);
        this.setDrumVolumes(settings.intensity);
        console.log(`🎵 Applied ${genre} settings:`, settings);
        return settings;
    }
}

// Create and export global instance
window.rhythmEngine = new RhythmEngine();

export default RhythmEngine;
