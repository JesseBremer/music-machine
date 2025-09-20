// guitar-audio.js - Real recorded acoustic guitar chord audio

class GuitarAudio {
    constructor() {
        this.isInitialized = false;
        this.chordSampler = null;
        this.reverb = null;
        this.currentPlayback = null;
        this.fallbackGuitar = null; // Backup synthesizer
        this.pureAudioContext = null; // Separate pure Web Audio context
        this.chordBuffers = new Map();
    }

    async initialize() {
        if (this.isInitialized) return;

        try {
            // Start Tone.js audio context
            await Tone.start();
            console.log('Tone.js audio context started');

            // Create separate pure Web Audio context for samples (avoid Tone.js conflicts)
            this.pureAudioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Add subtle room reverb for natural acoustic sound
            this.reverb = new Tone.Reverb({
                decay: 0.6,
                wet: 0.1
            });
            await this.reverb.generate(); // Wait for reverb to be ready
            this.reverb.toDestination();

            // Create fallback synthesizer for chords we don't have samples for
            this.fallbackGuitar = new Tone.PolySynth(Tone.Synth, {
                oscillator: {
                    type: "triangle",
                    partials: [1, 0.2, 0.01]
                },
                envelope: {
                    attack: 0.008,
                    decay: 0.3,
                    sustain: 0.3,
                    release: 1.2,
                    attackCurve: "linear"
                },
                filter: {
                    type: "lowpass",
                    frequency: 3000,
                    rolloff: -12
                }
            });
            this.fallbackGuitar.connect(this.reverb);

            // Load some common chord samples (you would expand this)
            await this.loadChordSamples();

            this.isInitialized = true;
            console.log('Guitar audio engine with samples initialized successfully');

        } catch (error) {
            console.error('Failed to initialize guitar audio:', error);
        }
    }

    // Load recorded acoustic guitar chord samples
    async loadChordSamples() {
        // Basic chords + common slash chords for realistic guitar playing
        const sampleChords = [
            // Basic major and minor chords
            'C', 'Am', 'F', 'G', 'Dm', 'Em',

            // Common slash chords (inversions)
            'C/E', 'C/G', 'Am/C', 'Am/E', 'F/A', 'F/C',
            'G/B', 'G/D', 'Dm/A', 'Dm/F', 'Em/B', 'Em/G',

            // Additional useful slash chords
            'D/F#', 'A/C#', 'E/G#', 'B/D#'
        ];

        console.log('Loading chord samples (including slash chords)...');

        for (const chord of sampleChords) {
            try {
                const buffer = await this.createGuitarChordSample(chord);
                if (buffer && buffer.length > 0) {
                    this.chordBuffers.set(chord, buffer);
                    console.log(`✓ Loaded sample for ${chord} chord (${buffer.duration.toFixed(2)}s)`);
                } else {
                    console.error(`Failed to create valid buffer for ${chord}`);
                }
            } catch (error) {
                console.warn(`Failed to create sample for ${chord}:`, error);
            }
        }

        console.log(`Loaded ${this.chordBuffers.size} chord samples:`, Array.from(this.chordBuffers.keys()));
    }

    // Create a more realistic guitar chord sample using additive synthesis
    async createGuitarChordSample(chordName) {
        const chordNotes = this.getChordNotes(chordName);
        const sampleRate = this.pureAudioContext.sampleRate;
        const duration = 3.0; // 3 seconds
        const length = sampleRate * duration;

        const buffer = this.pureAudioContext.createBuffer(1, length, sampleRate);
        const channelData = buffer.getChannelData(0);

        // Check if this is a slash chord for bass emphasis
        const isSlashChord = chordName.includes('/');
        const bassNote = isSlashChord ? chordName.split('/')[1] : chordNotes[0];

        // Generate guitar-like sound with multiple harmonics and string simulation
        chordNotes.forEach((note, stringIndex) => {
            const isBaseNote = note === bassNote;
            let octave = '4';

            // For slash chords, put the bass note in a lower octave
            if (isSlashChord && isBaseNote) {
                octave = '3'; // Lower octave for bass emphasis
            }

            const frequency = this.noteNameToFrequency(note + octave);

            for (let i = 0; i < length; i++) {
                const time = i / sampleRate;

                // String pluck envelope
                const envelope = Math.exp(-time * 3) * (1 - Math.exp(-time * 50));

                // Add fundamental and harmonics with guitar-like overtones
                let sample = 0;
                const harmonics = [1, 0.5, 0.25, 0.125, 0.0625]; // Natural harmonic series

                harmonics.forEach((amplitude, harmonic) => {
                    const harmonicFreq = frequency * (harmonic + 1);
                    sample += Math.sin(2 * Math.PI * harmonicFreq * time) * amplitude;
                });

                // Add some string resonance and body characteristics
                sample *= envelope;

                // Emphasize bass note in slash chords
                const noteVolume = (isSlashChord && isBaseNote) ? 0.4 : 0.3;
                sample *= noteVolume;

                // Slight delay between strings for strum effect
                // Bass note plays first in slash chords
                let strumDelay = stringIndex * 0.01;
                if (isSlashChord && isBaseNote) {
                    strumDelay = 0; // Bass note starts immediately
                } else if (isSlashChord) {
                    strumDelay = 0.005 + (stringIndex * 0.008); // Others follow shortly
                }

                if (time >= strumDelay) {
                    channelData[i] += sample;
                }
            }
        });

        // Normalize to prevent clipping
        this.normalizeBuffer(channelData);

        return buffer;
    }

    // Helper to normalize audio buffer
    normalizeBuffer(channelData) {
        let max = 0;
        for (let i = 0; i < channelData.length; i++) {
            max = Math.max(max, Math.abs(channelData[i]));
        }
        if (max > 0) {
            for (let i = 0; i < channelData.length; i++) {
                channelData[i] /= max * 1.5; // Leave some headroom
            }
        }
    }

    // Play a guitar chord using samples when available
    async playChord(chordName, duration = 2.0) {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            // Stop any currently playing chord
            this.stopCurrentChord();

            console.log(`Playing guitar chord: ${chordName}`);

            // Check if we have a pre-loaded sample
            if (this.chordBuffers.has(chordName)) {
                console.log(`Using pre-loaded sample for ${chordName}`);
                try {
                    await this.playSample(chordName, duration);
                    return;
                } catch (sampleError) {
                    console.warn(`Pre-loaded sample failed for ${chordName}:`, sampleError);
                }
            }

            // For any chord we don't have pre-loaded, create a sample dynamically
            console.log(`Creating dynamic sample for ${chordName}`);
            try {
                const buffer = await this.createGuitarChordSample(chordName);
                if (buffer && buffer.length > 0) {
                    // Cache the newly created sample for future use
                    this.chordBuffers.set(chordName, buffer);
                    await this.playSample(chordName, duration);
                    return;
                }
            } catch (sampleError) {
                console.warn(`Dynamic sample creation failed for ${chordName}:`, sampleError);
            }

            // Final fallback to synthesized audio
            console.log(`Using synthesized fallback for ${chordName}`);
            await this.playFallback(chordName, duration);

        } catch (error) {
            console.error(`Failed to play chord ${chordName}:`, error);
            throw error;
        }
    }

    // Play a recorded chord sample
    async playSample(chordName, duration) {
        const buffer = this.chordBuffers.get(chordName);
        if (!buffer) {
            console.warn(`No buffer found for chord: ${chordName}`);
            return;
        }

        try {
            // Create buffer source using pure Web Audio API
            const source = this.pureAudioContext.createBufferSource();
            source.buffer = buffer;

            // Create gain node for volume control
            const gainNode = this.pureAudioContext.createGain();
            gainNode.gain.value = 0.5; // Reasonable volume

            // Simple direct connection using pure Web Audio API
            source.connect(gainNode);
            gainNode.connect(this.pureAudioContext.destination);

            // Start playback
            source.start(0);

            // Stop after duration
            setTimeout(() => {
                try {
                    source.stop();
                } catch (e) {
                    // Source may already be stopped
                    console.warn('Could not stop audio source:', e);
                }
            }, duration * 1000);

            this.currentPlayback = source;

        } catch (error) {
            console.error('Error in playSample:', error);
            throw error;
        }
    }

    // Fallback to synthesized chord for chords we don't have samples for
    async playFallback(chordName, duration) {
        if (!this.fallbackGuitar) return;

        // Get chord notes using Tonal.js
        let chordNotes = this.getChordNotes(chordName);

        if (chordNotes.length === 0) {
            console.warn(`No notes found for chord: ${chordName}`);
            return;
        }

        // Convert to proper octave and format for Tone.js
        const guitarVoicing = this.createGuitarVoicing(chordNotes);

        // Simulate gentle acoustic guitar strumming
        const strumDelay = 0.015;
        const now = Tone.now();

        guitarVoicing.forEach((note, index) => {
            const startTime = now + (index * strumDelay);
            const velocity = 0.4 - (index * 0.04); // Softer for acoustic feel
            this.fallbackGuitar.triggerAttackRelease(note, duration, startTime, Math.max(velocity, 0.25));
        });

        // Auto-stop after duration
        setTimeout(() => {
            this.stopCurrentChord();
        }, duration * 1000);
    }

    // Get chord notes using Tonal.js with enhanced fallback
    getChordNotes(chordName) {
        let notes = [];

        // First try Tonal.js (handles most complex chords)
        if (window.Tonal && window.Tonal.Chord) {
            const chordInfo = window.Tonal.Chord.get(chordName);
            notes = chordInfo.notes || [];

            // Log what Tonal.js found for debugging
            if (notes.length > 0) {
                console.log(`Tonal.js parsed ${chordName}:`, notes);
            } else {
                console.log(`Tonal.js couldn't parse ${chordName}, trying manual parsing`);
            }
        }

        // If Tonal.js failed, try manual parsing for slash chords
        if (notes.length === 0 && chordName.includes('/')) {
            notes = this.parseSlashChord(chordName);
        }

        // If still no notes, try enhanced manual parsing for common chord types
        if (notes.length === 0) {
            notes = this.parseChordManually(chordName);
        }

        // Final fallback to basic triads
        if (notes.length === 0) {
            notes = this.getBasicTriad(chordName);
        }

        console.log(`Final notes for ${chordName}:`, notes);
        return notes;
    }

    // Manual parsing for slash chords that Tonal.js might miss
    parseSlashChord(chordName) {
        const [baseChord, bassNote] = chordName.split('/');

        // Get the base chord notes
        let notes = [];
        if (window.Tonal && window.Tonal.Chord) {
            const chordInfo = window.Tonal.Chord.get(baseChord);
            notes = chordInfo.notes || [];
        }

        // If we got base chord notes, add the bass note
        if (notes.length > 0 && bassNote) {
            // Remove the bass note if it's already in the chord, then add it at the beginning
            notes = notes.filter(note => !note.startsWith(bassNote));
            notes.unshift(bassNote);
        }

        return notes;
    }

    // Enhanced manual chord parsing for common types
    parseChordManually(chordName) {
        const root = chordName.charAt(0).toUpperCase();
        let notes = [];

        // Get the base triad first
        const baseTriad = this.getBasicTriad(chordName);
        if (baseTriad.length === 0) return [];

        notes = [...baseTriad];

        // Add extensions based on chord symbols
        if (chordName.includes('7')) {
            // Add 7th
            const seventh = this.addInterval(root, chordName.includes('maj7') ? 11 : 10);
            if (seventh) notes.push(seventh);
        }

        if (chordName.includes('9')) {
            // Add 9th (2nd octave)
            const ninth = this.addInterval(root, 14);
            if (ninth) notes.push(ninth);
        }

        if (chordName.includes('11')) {
            // Add 11th (4th octave)
            const eleventh = this.addInterval(root, 17);
            if (eleventh) notes.push(eleventh);
        }

        if (chordName.includes('13')) {
            // Add 13th (6th octave)
            const thirteenth = this.addInterval(root, 21);
            if (thirteenth) notes.push(thirteenth);
        }

        if (chordName.includes('6')) {
            // Add 6th
            const sixth = this.addInterval(root, 9);
            if (sixth) notes.push(sixth);
        }

        if (chordName.includes('sus2')) {
            // Replace 3rd with 2nd
            notes = notes.filter(note => !this.isThird(root, note));
            const second = this.addInterval(root, 2);
            if (second) notes.push(second);
        }

        if (chordName.includes('sus4')) {
            // Replace 3rd with 4th
            notes = notes.filter(note => !this.isThird(root, note));
            const fourth = this.addInterval(root, 5);
            if (fourth) notes.push(fourth);
        }

        if (chordName.includes('add9')) {
            // Add 9th without 7th
            const ninth = this.addInterval(root, 14);
            if (ninth) notes.push(ninth);
        }

        if (chordName.includes('aug')) {
            // Augmented - raise the 5th
            notes = notes.filter(note => !this.isFifth(root, note));
            const augFifth = this.addInterval(root, 8);
            if (augFifth) notes.push(augFifth);
        }

        if (chordName.includes('dim') || chordName.includes('o')) {
            // Diminished - lower the 5th
            notes = notes.filter(note => !this.isFifth(root, note));
            const dimFifth = this.addInterval(root, 6);
            if (dimFifth) notes.push(dimFifth);
        }

        return notes;
    }

    // Helper to add interval to root note
    addInterval(root, semitones) {
        const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const rootIndex = noteOrder.indexOf(root);
        if (rootIndex === -1) return null;

        const targetIndex = (rootIndex + semitones) % 12;
        return noteOrder[targetIndex];
    }

    // Helper to check if note is the third of the root
    isThird(root, note) {
        const major3rd = this.addInterval(root, 4);
        const minor3rd = this.addInterval(root, 3);
        return note === major3rd || note === minor3rd;
    }

    // Helper to check if note is the fifth of the root
    isFifth(root, note) {
        const perfect5th = this.addInterval(root, 7);
        return note === perfect5th;
    }

    // Fallback basic triad generation
    getBasicTriad(chordName) {
        const root = chordName.charAt(0).toUpperCase();
        const isMinor = chordName.includes('m') && !chordName.includes('maj');

        // Basic major and minor triads
        const majorTriads = {
            'C': ['C', 'E', 'G'],
            'D': ['D', 'F#', 'A'],
            'E': ['E', 'G#', 'B'],
            'F': ['F', 'A', 'C'],
            'G': ['G', 'B', 'D'],
            'A': ['A', 'C#', 'E'],
            'B': ['B', 'D#', 'F#']
        };

        const minorTriads = {
            'C': ['C', 'Eb', 'G'],
            'D': ['D', 'F', 'A'],
            'E': ['E', 'G', 'B'],
            'F': ['F', 'Ab', 'C'],
            'G': ['G', 'Bb', 'D'],
            'A': ['A', 'C', 'E'],
            'B': ['B', 'D', 'F#']
        };

        if (isMinor && minorTriads[root]) {
            return minorTriads[root];
        } else if (majorTriads[root]) {
            return majorTriads[root];
        }

        return [root]; // Just the root note as fallback
    }

    // Convert note name to frequency (A4 = 440Hz)
    noteNameToFrequency(noteName) {
        const noteRegex = /^([A-G])(#|b)?(\d+)$/;
        const match = noteName.match(noteRegex);

        if (!match) {
            console.warn(`Invalid note name: ${noteName}`);
            return 440; // Default to A4
        }

        const [, note, accidental, octave] = match;

        // Note numbers (C = 0, C# = 1, D = 2, etc.)
        const noteNumbers = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
        let noteNumber = noteNumbers[note];

        if (accidental === '#') noteNumber += 1;
        if (accidental === 'b') noteNumber -= 1;

        // Calculate MIDI note number
        const midiNote = (parseInt(octave) + 1) * 12 + noteNumber;

        // Convert MIDI note to frequency
        return 440 * Math.pow(2, (midiNote - 69) / 12);
    }

    // Create realistic guitar voicing with proper octaves
    createGuitarVoicing(notes) {
        if (notes.length === 0) return [];

        // Standard guitar tuning ranges (approximate)
        const voicing = [];

        // Start with bass note in lower octave
        if (notes[0]) voicing.push(notes[0] + '3');

        // Add chord tones in middle register
        notes.forEach((note, index) => {
            if (index === 0) return; // Skip bass note, already added

            const octave = index < 3 ? '4' : '5'; // Spread across octaves
            voicing.push(note + octave);
        });

        // Add some doubling for fuller sound
        if (notes.length >= 3) {
            voicing.push(notes[0] + '5'); // Octave doubling of root
        }

        return voicing;
    }

    // Stop currently playing chord
    stopCurrentChord() {
        // Stop sample playback
        if (this.currentPlayback) {
            try {
                this.currentPlayback.stop();
            } catch (e) {
                // Source may already be stopped
            }
            this.currentPlayback = null;
        }

        // Stop fallback synthesizer
        if (this.fallbackGuitar) {
            this.fallbackGuitar.releaseAll();
        }
    }

    // Clean up resources
    dispose() {
        this.stopCurrentChord();

        if (this.fallbackGuitar) this.fallbackGuitar.dispose();
        if (this.reverb) this.reverb.dispose();

        // Clear chord buffers
        this.chordBuffers.clear();

        this.isInitialized = false;
    }
}

// Create global instance
window.guitarAudio = new GuitarAudio();

// Global function for easy access
window.playGuitarChord = async function(chordName, duration = 2.0) {
    try {
        await window.guitarAudio.playChord(chordName, duration);
    } catch (error) {
        console.error('Error playing guitar chord:', error);
    }
};

// Global function for playing single notes
window.playGuitarNote = async function(noteName, duration = 1.0) {
    try {
        await window.guitarAudio.initialize();

        // Use the fallback guitar synthesizer for single notes
        if (window.guitarAudio.fallbackGuitar) {
            const note = noteName + "4"; // Add octave if not present
            window.guitarAudio.fallbackGuitar.triggerAttackRelease(note, duration);
        }
    } catch (error) {
        console.error('Error playing guitar note:', error);
    }
};

console.log('Guitar audio engine loaded');