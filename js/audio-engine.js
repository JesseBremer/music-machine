// audio-engine.js - Web Audio API engine for music playback

class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.isPlaying = false;
        this.currentPattern = null;
        this.scheduledNotes = [];
        this.tempo = 120; // BPM
        this.nextNoteTime = 0;
        this.lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
        this.scheduleAheadTime = 0.1; // How far ahead to schedule audio (in seconds)
        this.timerID = null;

        this.initializeAudio();
    }

    async initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = 1.0; // Master volume - increased for testing
        } catch (error) {
            console.error('Failed to initialize audio context:', error);
        }
    }

    async resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
            } catch (error) {
                console.error('Failed to resume audio context:', error);
            }
        }
    }

    // Test audio functionality
    async testAudio() {
        console.log('Testing audio...');
        await this.resumeAudioContext();

        if (!this.audioContext) {
            console.error('No audio context available for test');
            return false;
        }

        console.log('Audio context state:', this.audioContext.state);

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination); // Connect directly to speakers

            oscillator.frequency.value = 440; // A4
            oscillator.type = 'sine';

            gainNode.gain.value = 0.5; // Set volume directly

            const now = this.audioContext.currentTime;
            console.log('Starting test beep at:', now);

            oscillator.start(now);
            oscillator.stop(now + 1.0); // Play for 1 second

            console.log('Test beep scheduled for 1 second');
            return true;
        } catch (error) {
            console.error('Audio test failed:', error);
            return false;
        }
    }

    // Immediate audio test - plays right now
    async testImmediateAudio() {
        console.log('Testing immediate audio...');
        await this.resumeAudioContext();

        if (!this.audioContext) {
            console.error('No audio context available');
            return false;
        }

        try {
            // Create a simple beep that plays immediately
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            // Connect directly to destination, bypassing master gain
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // Set frequency and type
            oscillator.frequency.value = 880; // High A
            oscillator.type = 'square';
            gainNode.gain.value = 0.3;

            console.log('Playing immediate beep at 880Hz');
            console.log('Audio context current time:', this.audioContext.currentTime);

            // Start immediately
            oscillator.start();

            // Stop after 0.3 seconds
            setTimeout(() => {
                oscillator.stop();
                console.log('Stopped immediate beep');
            }, 300);

            return true;
        } catch (error) {
            console.error('Immediate audio test failed:', error);
            return false;
        }
    }

    // Simple chord progression test using immediate playback
    async testSimpleChord() {
        console.log('Testing simple chord...');
        await this.resumeAudioContext();

        if (!this.audioContext) {
            console.error('No audio context available');
            return false;
        }

        try {
            // Play a simple C major chord (C, E, G) immediately
            const notes = ['C', 'E', 'G'];
            const frequencies = [
                this.noteToFrequency('C', 4),
                this.noteToFrequency('E', 4),
                this.noteToFrequency('G', 4)
            ];

            console.log('Playing C major chord with frequencies:', frequencies);

            const oscillators = [];

            frequencies.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                oscillator.frequency.value = freq;
                oscillator.type = 'sine';
                gainNode.gain.value = 0.2; // Lower volume for chord

                oscillator.start();
                oscillators.push(oscillator);

                console.log(`Started oscillator ${index + 1}: ${freq}Hz`);
            });

            // Stop all oscillators after 2 seconds
            setTimeout(() => {
                oscillators.forEach((osc, index) => {
                    osc.stop();
                    console.log(`Stopped oscillator ${index + 1}`);
                });
            }, 2000);

            return true;
        } catch (error) {
            console.error('Simple chord test failed:', error);
            return false;
        }
    }

    // =====================================
    // NOTE FREQUENCY MAPPING
    // =====================================

    noteToFrequency(note, octave = 4) {
        // Handle undefined or invalid notes
        if (!note || typeof note !== 'string') {
            console.warn('Invalid note provided to noteToFrequency:', note);
            return 261.63; // Return C4 as fallback
        }

        const noteFreqs = {
            'C': 261.63, 'C#': 277.18, 'Db': 277.18,
            'D': 293.66, 'D#': 311.13, 'Eb': 311.13,
            'E': 329.63,
            'F': 349.23, 'F#': 369.99, 'Gb': 369.99,
            'G': 392.00, 'G#': 415.30, 'Ab': 415.30,
            'A': 440.00, 'A#': 466.16, 'Bb': 466.16,
            'B': 493.88
        };

        // Parse note (handle flats and sharps)
        const cleanNote = note.replace(/[0-9]/g, ''); // Remove octave numbers
        const baseFreq = noteFreqs[cleanNote] || noteFreqs['C'];

        // Adjust for octave (C4 = 261.63 Hz is our base)
        const octaveMultiplier = Math.pow(2, octave - 4);

        return baseFreq * octaveMultiplier;
    }

    // =====================================
    // CHORD SYNTHESIS
    // =====================================

    playChord(notes, duration = 1.0, startTime = null) {
        if (!this.audioContext || !notes || notes.length === 0) return;

        const when = startTime || this.audioContext.currentTime;
        const oscillators = [];

        notes.forEach((note, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            // Use different octaves for chord voicing
            const octave = 3 + Math.floor(index / 3); // Spread across octaves
            const frequency = this.noteToFrequency(note, octave);

            oscillator.frequency.setValueAtTime(frequency, when);
            oscillator.type = 'sine';

            // Volume envelope for chord
            gainNode.gain.setValueAtTime(0, when);
            gainNode.gain.linearRampToValueAtTime(0.3, when + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.2, when + duration * 0.3);
            gainNode.gain.exponentialRampToValueAtTime(0.001, when + duration);

            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);

            oscillator.start(when);
            oscillator.stop(when + duration);

            oscillators.push(oscillator);
        });

        return oscillators;
    }

    // =====================================
    // DRUM SYNTHESIS
    // =====================================

    playKick(startTime = null) {
        if (!this.audioContext) return;

        const when = startTime || this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        // Deeper, more punchy kick drum
        oscillator.frequency.setValueAtTime(80, when);
        oscillator.frequency.exponentialRampToValueAtTime(40, when + 0.05);
        oscillator.frequency.exponentialRampToValueAtTime(25, when + 0.2);
        oscillator.type = 'sine';

        // Punchy envelope
        gainNode.gain.setValueAtTime(0.6, when);
        gainNode.gain.exponentialRampToValueAtTime(0.3, when + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, when + 0.4);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.start(when);
        oscillator.stop(when + 0.4);

        return oscillator;
    }

    playSnare(startTime = null) {
        if (!this.audioContext) return;

        const when = startTime || this.audioContext.currentTime;

        // Noise component
        const bufferSize = this.audioContext.sampleRate * 0.15;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const noiseFilter = this.audioContext.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = 1500;
        noiseFilter.Q.value = 1;

        const noiseGain = this.audioContext.createGain();
        noiseGain.gain.setValueAtTime(0.35, when);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, when + 0.15);

        // Tone component (body of the snare)
        const oscillator = this.audioContext.createOscillator();
        const oscGain = this.audioContext.createGain();

        oscillator.frequency.setValueAtTime(250, when);
        oscillator.frequency.exponentialRampToValueAtTime(180, when + 0.05);
        oscillator.type = 'triangle';

        oscGain.gain.setValueAtTime(0.25, when);
        oscGain.gain.exponentialRampToValueAtTime(0.01, when + 0.12);

        // Connect everything
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        oscillator.connect(oscGain);
        oscGain.connect(this.masterGain);

        noise.start(when);
        noise.stop(when + 0.15);
        oscillator.start(when);
        oscillator.stop(when + 0.12);

        return [noise, oscillator];
    }

    playHiHat(startTime = null, open = false) {
        if (!this.audioContext) return;

        const when = startTime || this.audioContext.currentTime;
        const duration = open ? 0.2 : 0.08;

        // Create noise
        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = open ? 8000 : 10000;
        filter.Q.value = open ? 0.5 : 1;

        const gainNode = this.audioContext.createGain();
        const volume = open ? 0.2 : 0.15;
        gainNode.gain.setValueAtTime(volume, when);
        gainNode.gain.exponentialRampToValueAtTime(0.01, when + duration);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);

        noise.start(when);
        noise.stop(when + duration);

        return noise;
    }

    // =====================================
    // PATTERN PLAYBACK
    // =====================================

    async playChordProgression(chordProgression, tempo = 120, key = 'C') {
        if (!chordProgression) {
            console.error('No chord progression provided');
            return;
        }

        if (!chordProgression.chords) {
            console.error('Chord progression has no chords property:', chordProgression);
            return;
        }

        await this.resumeAudioContext();
        this.tempo = tempo;

        const chordDuration = (60 / tempo) * 2; // Half notes in seconds

        // Use immediate playback approach like the working tests
        this.playChordProgressionImmediate(chordProgression.chords, chordDuration, key);

        return chordProgression.chords.length * chordDuration;
    }

    // New immediate playback approach
    async playChordProgressionImmediate(chords, chordDuration, key = 'C') {
        let currentDelay = 0;

        chords.forEach((chord, index) => {
            setTimeout(() => {
                // Get chord notes using Tonal.js if available
                let chordNotes = [];
                console.log(`Processing chord: ${chord}`);

                if (window.Tonal && window.Tonal.Chord) {
                    const chordInfo = window.Tonal.Chord.get(chord);
                    console.log(`Tonal.js chord info for '${chord}':`, chordInfo);
                    console.log(`Chord notes:`, chordInfo.notes);
                    console.log(`Is valid chord:`, chordInfo.notes && chordInfo.notes.length > 0);

                    chordNotes = chordInfo.notes || [chord.charAt(0)];
                } else {
                    console.log('Tonal.js not available, using fallback');
                    // Fallback to basic triads
                    chordNotes = this.getBasicTriad(chord, key);
                }

                console.log(`Final chord notes for playback:`, chordNotes);

                // Play chord immediately using the same approach as testSimpleChord
                const frequencies = chordNotes.map(note => this.noteToFrequency(note, 4));
                const oscillators = [];

                frequencies.forEach((freq, noteIndex) => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);

                    oscillator.frequency.value = freq;
                    oscillator.type = 'sine';
                    gainNode.gain.value = 0.15; // Lower volume for chord

                    oscillator.start();
                    oscillators.push(oscillator);
                });

                // Stop all oscillators after chord duration
                setTimeout(() => {
                    oscillators.forEach((osc, noteIndex) => {
                        osc.stop();
                    });
                }, chordDuration * 1000);

            }, currentDelay);

            currentDelay += chordDuration * 1000; // Convert to milliseconds
        });
    }

    getBasicTriad(chord, key) {
        // Simple fallback for basic major/minor triads
        const root = chord.charAt(0);
        const isMinor = chord.includes('m') && !chord.includes('maj');

        if (isMinor) {
            return [root, this.getInterval(root, 3, true), this.getInterval(root, 5)]; // Minor triad
        } else {
            return [root, this.getInterval(root, 3), this.getInterval(root, 5)]; // Major triad
        }
    }

    getInterval(root, interval, minor = false) {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const rootIndex = notes.indexOf(root);

        let semitones;
        switch (interval) {
            case 3: semitones = minor ? 3 : 4; break; // Minor 3rd = 3, Major 3rd = 4
            case 5: semitones = 7; break; // Perfect 5th
            default: semitones = 0;
        }

        return notes[(rootIndex + semitones) % 12];
    }

    playDrumPattern(drumPattern, tempo = 120, bars = 2) {
        if (!drumPattern || !drumPattern.grid || drumPattern.grid.length === 0) return;

        this.resumeAudioContext();
        this.tempo = tempo;

        // Determine pattern length from the grid (exclude instrument name)
        const patternLength = drumPattern.grid[0].length - 1; // Subtract 1 for instrument name

        // Calculate timing based on pattern length
        let beatDuration;
        if (patternLength <= 4) {
            // 4 beats or less = quarter notes
            beatDuration = 60 / tempo;
        } else if (patternLength <= 8) {
            // 5-8 beats = eighth notes
            beatDuration = 60 / tempo / 2;
        } else {
            // More than 8 = sixteenth notes
            beatDuration = 60 / tempo / 4;
        }

        const patternDuration = beatDuration * patternLength;
        let currentTime = this.audioContext.currentTime + 0.1;

        console.log(`Playing drum pattern: ${drumPattern.name}, Length: ${patternLength}, Beat duration: ${beatDuration.toFixed(3)}s`);

        for (let bar = 0; bar < bars; bar++) {
            drumPattern.grid.forEach(track => {
                const instrumentName = track[0].toLowerCase();

                // Skip the first element (instrument name) and process beats
                for (let beat = 1; beat < track.length; beat++) {
                    if (track[beat] === 'x') {
                        const beatTime = currentTime + (beat - 1) * beatDuration;

                        if (instrumentName.includes('kick')) {
                            this.playKick(beatTime);
                        } else if (instrumentName.includes('snare')) {
                            this.playSnare(beatTime);
                        } else if (instrumentName.includes('hihat') || instrumentName.includes('hat')) {
                            const isOpen = instrumentName.includes('open');
                            this.playHiHat(beatTime, isOpen);
                        } else if (instrumentName.includes('ride')) {
                            this.playHiHat(beatTime, false); // Use hi-hat sound for ride
                        }
                    }
                }
            });

            currentTime += patternDuration;
        }

        return patternDuration * bars;
    }

    // =====================================
    // BASS AND MELODY PLAYBACK
    // =====================================

    playBassLine(bassLine, tempo = 120) {
        if (!bassLine || bassLine.length === 0) return;

        this.resumeAudioContext();
        this.tempo = tempo;

        const beatDuration = 60 / tempo;
        let currentTime = this.audioContext.currentTime + 0.1;

        bassLine.forEach(bassNote => {
            const frequency = this.noteToFrequency(bassNote.note, 2); // Bass octave
            const duration = this.getNoteDuration(bassNote.rhythm, tempo);

            this.playBassNote(frequency, duration, currentTime);
            currentTime += duration;
        });

        return currentTime - this.audioContext.currentTime;
    }

    playBassNote(frequency, duration, startTime) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = 'sawtooth';

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);

        return oscillator;
    }

    playMelodyIdea(melodyIdea, tempo = 120) {
        if (!melodyIdea) return;

        this.resumeAudioContext();
        this.tempo = tempo;

        const noteDuration = this.getNoteDuration(melodyIdea.rhythm || 'quarter', tempo);
        let currentTime = this.audioContext.currentTime + 0.1;

        // Get melody notes from different formats
        let melodyNotes = [];
        if (melodyIdea.noteNames && Array.isArray(melodyIdea.noteNames)) {
            melodyNotes = melodyIdea.noteNames;
        } else if (melodyIdea.pattern && Array.isArray(melodyIdea.pattern)) {
            melodyNotes = melodyIdea.pattern;
        } else if (melodyIdea.melody && Array.isArray(melodyIdea.melody)) {
            melodyNotes = melodyIdea.melody.map(n => `${n.note}${n.octave}`);
        }

        // Filter out undefined notes and play the melody
        melodyNotes.filter(note => note && typeof note === 'string').forEach(note => {
            const frequency = this.noteToFrequency(note, 5); // Higher octave for melody
            this.playMelodyNote(frequency, noteDuration, currentTime);
            currentTime += noteDuration;
        });

        return currentTime - this.audioContext.currentTime;
    }

    playMelodyNote(frequency, duration, startTime) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);

        return oscillator;
    }

    getNoteDuration(rhythmType, tempo) {
        const beatDuration = 60 / tempo;

        switch (rhythmType) {
            case 'whole': return beatDuration * 4;
            case 'half': return beatDuration * 2;
            case 'quarter': return beatDuration;
            case 'eighth': return beatDuration / 2;
            case 'sixteenth': return beatDuration / 4;
            default: return beatDuration;
        }
    }

    // =====================================
    // CONTROL METHODS
    // =====================================

    stop() {
        this.isPlaying = false;
        if (this.timerID) {
            clearTimeout(this.timerID);
            this.timerID = null;
        }

        // Stop all scheduled notes
        this.scheduledNotes.forEach(note => {
            try {
                if (note.stop) note.stop();
            } catch (error) {
                // Note might already be stopped
            }
        });
        this.scheduledNotes = [];
    }

    setTempo(newTempo) {
        this.tempo = Math.max(60, Math.min(200, newTempo)); // Clamp between 60-200 BPM
    }

    setVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
        }
    }

    // =====================================
    // COMBINED PLAYBACK
    // =====================================

    playFullArrangement(songData, options = {}) {
        if (!songData) return;

        this.resumeAudioContext();

        const tempo = songData.tempo || options.tempo || 120;
        const bars = options.bars || 4;
        this.setTempo(tempo);

        // Calculate synchronized timing
        const beatDuration = 60 / tempo; // Quarter note duration
        const barDuration = beatDuration * 4; // 4 beats per bar
        const totalDuration = barDuration * bars;

        const startTime = this.audioContext.currentTime + 0.1;

        console.log(`Playing full arrangement: ${bars} bars at ${tempo} BPM (${totalDuration.toFixed(2)}s total)`);

        // Play all instruments with synchronized timing
        this.playArrangementChords(songData, startTime, tempo, bars);
        this.playArrangementDrums(songData, startTime, tempo, bars);
        this.playArrangementBass(songData, startTime, tempo, bars);
        this.playArrangementMelody(songData, startTime, tempo, bars);

        return totalDuration;
    }

    playArrangementChords(songData, startTime, tempo, bars) {
        if (!songData.chordProgression || !songData.chordProgression.chords) return;

        const beatDuration = 60 / tempo;
        const chordDuration = beatDuration * 2; // Half notes for chords
        const progressionDuration = chordDuration * songData.chordProgression.chords.length;

        let currentTime = startTime;

        // Loop the chord progression for the specified number of bars
        for (let bar = 0; bar < bars; ) {
            songData.chordProgression.chords.forEach((chord, index) => {
                if (bar >= bars) return; // Don't exceed bar limit

                try {
                    let chordNotes = [];
                    if (window.Tonal && window.Tonal.Chord) {
                        const chordInfo = window.Tonal.Chord.get(chord);
                        chordNotes = chordInfo.notes || [chord.charAt(0)];
                    } else {
                        chordNotes = this.getBasicTriad(chord, songData.key);
                    }

                    this.playChord(chordNotes, chordDuration, currentTime);
                    currentTime += chordDuration;
                } catch (error) {
                    console.warn('Error playing chord:', chord, error);
                }
            });

            // Calculate how many bars this progression represents
            const barsInProgression = Math.ceil(progressionDuration / (beatDuration * 4));
            bar += barsInProgression;
        }
    }

    playArrangementDrums(songData, startTime, tempo, bars) {
        if (!songData.drumPattern || !songData.drumPattern.grid) return;

        const beatDuration = 60 / tempo / 4; // Sixteenth note timing for drums
        const barDuration = beatDuration * 16; // 16 sixteenth notes per bar

        const patternLength = songData.drumPattern.grid[0].length - 1; // Subtract instrument name
        const patternDuration = beatDuration * patternLength;

        let currentTime = startTime;

        // Loop the drum pattern for the specified number of bars
        for (let bar = 0; bar < bars; bar++) {
            // Calculate how many times to repeat the pattern to fill a bar
            const repeatsPerBar = Math.ceil(barDuration / patternDuration);

            for (let repeat = 0; repeat < repeatsPerBar && bar < bars; repeat++) {
                songData.drumPattern.grid.forEach(track => {
                    const instrumentName = track[0].toLowerCase();

                    for (let beat = 1; beat < track.length; beat++) {
                        if (track[beat] === 'x') {
                            const beatTime = currentTime + (beat - 1) * beatDuration;

                            if (instrumentName.includes('kick')) {
                                this.playKick(beatTime);
                            } else if (instrumentName.includes('snare')) {
                                this.playSnare(beatTime);
                            } else if (instrumentName.includes('hihat') || instrumentName.includes('hat')) {
                                const isOpen = instrumentName.includes('open');
                                this.playHiHat(beatTime, isOpen);
                            }
                        }
                    }
                });

                currentTime += patternDuration;

                // Move to next bar if we've filled this one
                if (currentTime >= startTime + (bar + 1) * barDuration) {
                    break;
                }
            }

            // Ensure we start the next bar at the right time
            currentTime = startTime + (bar + 1) * barDuration;
        }
    }

    playArrangementBass(songData, startTime, tempo, bars) {
        const beatDuration = 60 / tempo;
        const barDuration = beatDuration * 4;

        // Create bass notes from bass line or chord progression
        let bassNotes = [];

        if (songData.bassLine && songData.bassLine.length > 0) {
            // Use existing bass line
            bassNotes = songData.bassLine;
        } else if (songData.chordProgression && songData.chordProgression.chords) {
            // Generate simple bass from chord progression roots
            bassNotes = songData.chordProgression.chords.map(chord => {
                let rootNote = chord.charAt(0);
                // Handle flat notation (e.g., "Bb" -> "Bb")
                if (chord.length > 1 && (chord.charAt(1) === 'b' || chord.charAt(1) === '#')) {
                    rootNote = chord.substring(0, 2);
                }
                return {
                    note: rootNote,
                    rhythm: 'quarter'
                };
            });
        }

        if (!bassNotes || bassNotes.length === 0) return;

        let currentTime = startTime;

        // Loop bass line for the specified number of bars
        for (let bar = 0; bar < bars; bar++) {
            bassNotes.forEach(bassNote => {
                if (currentTime >= startTime + bars * barDuration) return;

                const note = typeof bassNote === 'object' ? bassNote.note : bassNote;
                const rhythm = typeof bassNote === 'object' ? bassNote.rhythm : 'quarter';

                const frequency = this.noteToFrequency(note, 2); // Bass octave
                const duration = this.getNoteDuration(rhythm || 'quarter', tempo);

                this.playBassNote(frequency, duration, currentTime);
                currentTime += duration;
            });
        }
    }

    playArrangementMelody(songData, startTime, tempo, bars) {
        if (!songData.melodyIdea) return;

        const beatDuration = 60 / tempo;
        const barDuration = beatDuration * 4;

        // Start melody after 1 bar (musical entrance)
        const melodyStartTime = startTime + barDuration;
        let currentTime = melodyStartTime;

        const noteDuration = this.getNoteDuration(songData.melodyIdea.rhythm || 'eighth', tempo);

        // Get melody notes from different formats
        let melodyNotes = [];
        if (songData.melodyIdea.noteNames && Array.isArray(songData.melodyIdea.noteNames)) {
            melodyNotes = songData.melodyIdea.noteNames;
        } else if (songData.melodyIdea.pattern && Array.isArray(songData.melodyIdea.pattern)) {
            melodyNotes = songData.melodyIdea.pattern;
        } else if (songData.melodyIdea.melody && Array.isArray(songData.melodyIdea.melody)) {
            melodyNotes = songData.melodyIdea.melody.map(n => `${n.note}${n.octave}`);
        }

        // Play melody for remaining bars
        for (let bar = 1; bar < bars; bar++) {
            melodyNotes.forEach(note => {
                if (currentTime >= startTime + bars * barDuration) return;

                const frequency = this.noteToFrequency(note, 5); // Higher octave for melody
                this.playMelodyNote(frequency, noteDuration, currentTime);
                currentTime += noteDuration;
            });
        }
    }

    // =====================================
    // CHORD AND MELODY PLAYBACK METHODS
    // =====================================

    // Play a chord using MIDI note numbers
    playChord(midiNotes, duration = 1.0) {
        if (!this.audioContext || !Array.isArray(midiNotes)) return;

        this.resumeAudioContext();
        const startTime = this.audioContext.currentTime + 0.1;

        midiNotes.forEach(midiNote => {
            if (typeof midiNote === 'number' && midiNote >= 0 && midiNote <= 127) {
                const frequency = this.midiToFrequency(midiNote);
                this.playChordNote(frequency, duration, startTime);
            }
        });
    }

    // Play a melody sequence using MIDI note numbers
    playMelody(midiNotes, noteDuration = 0.5) {
        if (!this.audioContext || !Array.isArray(midiNotes)) return;

        this.resumeAudioContext();
        let currentTime = this.audioContext.currentTime + 0.1;

        midiNotes.forEach(midiNote => {
            if (typeof midiNote === 'number' && midiNote >= 0 && midiNote <= 127) {
                const frequency = this.midiToFrequency(midiNote);
                this.playMelodyNote(frequency, noteDuration, currentTime);
                currentTime += noteDuration;
            }
        });
    }

    // Convert MIDI note number to frequency
    midiToFrequency(midiNote) {
        return 440 * Math.pow(2, (midiNote - 69) / 12);
    }

    // Play a single chord note
    playChordNote(frequency, duration, startTime) {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        // Set up oscillator
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;

        // Set up envelope
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        // Start and stop
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }

    // =====================================
    // CHORD SEQUENCE PLAYBACK (for progressions page)
    // =====================================

    // Play a sequence of chords by name (e.g., ["C", "F", "G", "C"])
    async playChordSequence(chordNames, tempo = 120) {
        if (!chordNames || chordNames.length === 0) {
            console.warn('No chords provided to playChordSequence');
            return;
        }

        await this.resumeAudioContext();

        const beatDuration = 60 / tempo;
        const chordDuration = beatDuration * 2; // Each chord lasts 2 beats

        console.log(`Playing chord sequence: ${chordNames.join(' - ')} at ${tempo} BPM`);

        let currentDelay = 0;

        chordNames.forEach((chordName, index) => {
            setTimeout(() => {
                // Get chord notes using Tonal.js if available
                let chordNotes = [];

                if (window.Tonal && window.Tonal.Chord) {
                    const chordInfo = window.Tonal.Chord.get(chordName);
                    chordNotes = chordInfo.notes || [];

                    // If Tonal didn't return notes, try fallback
                    if (chordNotes.length === 0) {
                        chordNotes = this.getBasicTriad(chordName, 'C');
                    }
                } else {
                    // Fallback to basic triads
                    chordNotes = this.getBasicTriad(chordName, 'C');
                }

                console.log(`Playing chord ${index + 1}/${chordNames.length}: ${chordName} = [${chordNotes.join(', ')}]`);

                // Play chord immediately using the same approach as testSimpleChord
                const frequencies = chordNotes.map(note => this.noteToFrequency(note, 4));
                const oscillators = [];

                frequencies.forEach((freq, noteIndex) => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);

                    oscillator.frequency.value = freq;
                    oscillator.type = 'sine';
                    gainNode.gain.value = 0.2; // Volume for chord

                    oscillator.start();
                    oscillators.push(oscillator);
                });

                // Stop all oscillators after chord duration
                setTimeout(() => {
                    oscillators.forEach((osc) => {
                        try {
                            osc.stop();
                        } catch (e) {
                            // Already stopped
                        }
                    });
                }, chordDuration * 1000);

            }, currentDelay);

            currentDelay += chordDuration * 1000; // Convert to milliseconds
        });

        return currentDelay / 1000; // Return total duration in seconds
    }
}

// Create global audio engine instance
const audioEngine = new AudioEngine();

// Export for module use
export default audioEngine;

// Make available globally for direct access
window.audioEngine = audioEngine;