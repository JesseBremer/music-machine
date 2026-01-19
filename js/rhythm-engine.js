// rhythm-engine.js - Enhanced rhythm section with professional drums and smart bass generation
// Uses Tone.js for synthesis and sampling

class RhythmEngine {
    constructor() {
        this.initialized = false;
        this.drumSamplers = null;
        this.bassSynth = null;
        this.currentParts = [];
    }

    async initialize() {
        if (this.initialized) return true;

        try {
            await Tone.start();

            // Create professional drum samplers
            this.drumSamplers = {
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

                tom: new Tone.MembraneSynth({
                    pitchDecay: 0.08,
                    octaves: 4,
                    oscillator: { type: 'sine' },
                    envelope: { attack: 0.001, decay: 0.3, sustain: 0.1, release: 0.8 }
                }).toDestination()
            };

            // Create professional bass synth with gain control
            this.bassGain = new Tone.Gain(1.5).toDestination(); // Increase bass volume
            this.bassSynth = new Tone.MonoSynth({
                oscillator: {
                    type: 'sawtooth'
                },
                filter: {
                    Q: 3,
                    type: 'lowpass',
                    rolloff: -24
                },
                envelope: {
                    attack: 0.01,
                    decay: 0.3,
                    sustain: 0.5,
                    release: 1.2
                },
                filterEnvelope: {
                    attack: 0.02,
                    decay: 0.2,
                    sustain: 0.4,
                    release: 0.8,
                    baseFrequency: 80,
                    octaves: 4
                },
                volume: 6 // Boost bass by 6dB
            }).connect(this.bassGain);

            // Add compression for better sound
            const compressor = new Tone.Compressor(-20, 3).toDestination();
            this.drumSamplers.kick.connect(compressor);
            this.drumSamplers.snare.connect(compressor);
            this.bassGain.connect(compressor);

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
                tempo: [100, 130]
            },
            disco: {
                name: 'Disco Four-on-Floor',
                kick: 'x---x---x---x---',  // Four-on-floor (all 4 quarter notes)
                snare: '----x-------x---',  // Backbeat on 2 and 4
                hihat: 'xxxxxxxxxxxxxxxx',  // 16th notes for disco energy
                openHihat: '------x-------x-',  // Open accents
                tempo: [110, 130]
            },
            funk: {
                name: 'Funk Groove',
                kick: 'x---x-x---x-x---',  // Syncopated funk kick
                snare: '----x--x----x---',  // Ghost notes and backbeat
                hihat: 'x-xxx-x-x-xxx-x-',  // 16th note funk hat pattern
                tempo: [95, 115]
            },
            hiphop: {
                name: 'Hip Hop Beat',
                kick: 'x-----x---x-----',  // Boom-bap kick pattern
                snare: '----x-------x---',  // Snare on 2 and 4
                hihat: 'x-x-x-x-x-x-x-x-',  // 8th notes
                clap: '----x-------x--x',   // Clap variation
                tempo: [80, 100]
            },
            reggae: {
                name: 'Reggae One-Drop',
                kick: '--------x-------',  // One-drop: kick on beat 3 only
                snare: '--x-----x-------',  // Rimshot on 2-and, 3-and (offbeat)
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
                tempo: [120, 140]
            },
            jazz: {
                name: 'Jazz Swing',
                kick: 'x-----x-----x---',  // Sparse jazz kick (feathering)
                snare: '------x-------x-',  // Light snare on 2 and 4
                hihat: 'x--x--x--x--x--x',  // Swing pattern (triplet feel)
                tempo: [100, 160]
            },
            latin: {
                name: 'Latin Groove',
                kick: 'x-x---x-x-x---x-',  // Tumbao/clave-based pattern
                snare: '----x-------x---',  // Backbeat
                hihat: 'x-x-x-x-x-x-x-x-',  // 8th notes
                tom: '--x---x---x---x-',   // Tom accents
                tempo: [100, 130]
            },
            blues: {
                name: 'Blues Shuffle',
                kick: 'x-----x-----x---',  // Shuffle kick
                snare: '----x-------x---',  // Backbeat on 2 and 4
                hihat: 'x--x--x--x--x--x',  // Shuffle/triplet pattern (not straight 8ths)
                tempo: [70, 110]
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

                switch (style) {
                    case 'root':
                        // Simple root notes
                        bassNotes.push(bassRoot);
                        break;

                    case 'rootFifth':
                        // Root and fifth pattern
                        const fifthInterval = Tonal.Note.transpose(bassRoot, '4P'); // Perfect fifth up from bass root
                        bassNotes.push(bassRoot, fifthInterval);
                        break;

                    case 'walking':
                        // Walking bass: root, third, fifth
                        const third = Tonal.Note.transpose(bassRoot, '2M'); // Major third up
                        const walkingFifth = Tonal.Note.transpose(bassRoot, '4P'); // Perfect fifth up

                        bassNotes.push(bassRoot, third, walkingFifth);

                        // Add chromatic approach to next chord if available
                        if (index < chordProgression.length - 1) {
                            const nextChord = Tonal.Chord.get(chordProgression[index + 1]);
                            const nextRoot = nextChord.tonic || chordProgression[index + 1];
                            const nextRootName = nextRoot.replace(/[0-9]/g, '');
                            const nextBassRoot = nextRootName + '2';
                            const approach = Tonal.Note.transpose(nextBassRoot, '-1m'); // Half step below
                            bassNotes.push(approach);
                        }
                        break;

                    case 'arpeggio':
                        // Full chord arpeggio in bass range
                        bassNotes.push(
                            bassRoot, // Root
                            Tonal.Note.transpose(bassRoot, '2M'), // Third
                            Tonal.Note.transpose(bassRoot, '4P'), // Fifth
                            Tonal.Note.transpose(bassRoot, '2M')  // Back to third
                        );
                        break;

                    case 'octaves':
                        // Root note in different octaves
                        const higherOctave = Tonal.Note.transpose(bassRoot, '8P'); // One octave up (C3)
                        bassNotes.push(bassRoot, higherOctave);
                        break;

                    default:
                        bassNotes.push(bassRoot);
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
            'disco': 'disco',
            'reggae': 'reggae',
            'latin': 'latin',
            'syncopated': 'syncopated'
        };

        const patternName = styleToPattern[style] || 'steady';

        const patterns = {
            steady: 'x---x---x---x---', // Quarter notes
            syncopated: 'x---x-x---x-x-x-', // Syncopated
            walking: 'x-x-x-x-x-x-x-x-', // Walking eighths
            funky: 'x-xxx-x-x-x-x-x-', // Funky sixteenths
            reggae: '--x---x---x---x-', // Reggae offbeat
            latin: 'x-x-x---x-x-x-x-', // Latin tumbao
            minimal: 'x-------x-------', // Minimal half notes
            disco: 'x---x---x-x-x---' // Disco groove
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
            'disco': '8n',          // Eighth notes for disco
            'reggae': '8n',         // Eighth notes for reggae
            'latin': '8n',          // Eighth notes for latin
            'syncopated': '16n'     // 16th notes for syncopated
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
            'disco': '8n',          // Eighth note duration
            'reggae': '8n',         // Eighth note duration
            'latin': '8n',          // Eighth note duration
            'syncopated': '16n'     // 16th note duration
        };

        return durations[style] || '8n';
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
            let bassRhythm;
            if (bassStyle === 'walking' || bassStyle === 'arpeggio') {
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

            // Schedule each bass note
            actualTriggers.forEach((time, index) => {
                const note = bassNotes[index % bassNotes.length];
                const noteDuration = this.getNoteDurationForStyle(bassStyle);

                const part = new Tone.Part((t) => {
                    // Add logging for debugging
                    console.log(`🎸 Playing bass ${index + 1}/${bassNotes.length}: ${note} at time ${t}`);
                    this.bassSynth.triggerAttackRelease(note, noteDuration, t, 0.8);
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

    // Trigger individual drum
    triggerDrum(drumType, time = undefined, velocity = 1) {
        if (!this.drumSamplers || !this.drumSamplers[drumType]) return;

        const actualVelocity = velocity * 0.8; // Slight reduction to prevent clipping

        switch (drumType) {
            case 'kick':
                this.drumSamplers.kick.triggerAttackRelease('C1', '8n', time, actualVelocity);
                break;
            case 'snare':
                this.drumSamplers.snare.triggerAttackRelease('16n', time, actualVelocity);
                break;
            case 'hihat':
                this.drumSamplers.hihat.triggerAttackRelease('32n', time, actualVelocity * 0.6);
                break;
            case 'openHihat':
                this.drumSamplers.openHihat.triggerAttackRelease('8n', time, actualVelocity * 0.5);
                break;
            case 'clap':
                this.drumSamplers.clap.triggerAttackRelease('16n', time, actualVelocity);
                break;
            case 'tom':
                this.drumSamplers.tom.triggerAttackRelease('F2', '8n', time, actualVelocity);
                break;
        }
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
            drums: ['rock', 'pop', 'disco', 'funk', 'hiphop', 'reggae', 'electronic', 'jazz', 'latin', 'blues'],
            bass: ['root', 'rootFifth', 'walking', 'arpeggio', 'octaves']
        };
    }
}

// Create and export global instance
window.rhythmEngine = new RhythmEngine();

export default RhythmEngine;
