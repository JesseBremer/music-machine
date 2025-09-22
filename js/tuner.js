// tuner.js - Guitar Tuner with Frequency Detection
class GuitarTuner {
    constructor() {
        this.isActive = false;
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.dataArray = null;
        this.isListening = false;
        this.animationFrame = null;

        // Standard guitar tuning frequencies (Hz)
        this.standardTuning = {
            'E2': { frequency: 82.41, name: 'Low E (6th string)', string: 6 },
            'A2': { frequency: 110.00, name: 'A (5th string)', string: 5 },
            'D3': { frequency: 146.83, name: 'D (4th string)', string: 4 },
            'G3': { frequency: 196.00, name: 'G (3rd string)', string: 3 },
            'B3': { frequency: 246.94, name: 'B (2nd string)', string: 2 },
            'E4': { frequency: 329.63, name: 'High E (1st string)', string: 1 }
        };

        this.currentNote = null;
        this.currentFrequency = 0;
        this.cents = 0;
    }

    async initialize() {
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false
                }
            });

            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create analyser for frequency detection
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 8192; // Higher resolution for better frequency detection
            this.analyser.smoothingTimeConstant = 0.8;

            // Connect microphone to analyser
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.microphone.connect(this.analyser);

            // Create data array for frequency analysis
            this.dataArray = new Float32Array(this.analyser.frequencyBinCount);

            console.log('Guitar tuner initialized successfully');
            return true;

        } catch (error) {
            console.error('Failed to initialize tuner:', error);
            this.showError('Microphone access denied or not available');
            return false;
        }
    }

    startListening() {
        if (!this.audioContext || this.isListening) return;

        this.isListening = true;
        this.detectPitch();
        console.log('Tuner listening started');
    }

    stopListening() {
        this.isListening = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        console.log('Tuner listening stopped');
    }

    detectPitch() {
        if (!this.isListening || !this.analyser) return;

        // Get frequency data
        this.analyser.getFloatFrequencyData(this.dataArray);

        // Find the fundamental frequency using autocorrelation
        const frequency = this.findFundamentalFrequency();

        if (frequency > 0) {
            this.currentFrequency = frequency;
            this.analyzeNote(frequency);
            this.updateDisplay();
        }

        // Continue detection
        this.animationFrame = requestAnimationFrame(() => this.detectPitch());
    }

    findFundamentalFrequency() {
        // Convert to time domain for autocorrelation
        const bufferLength = this.analyser.fftSize;
        const buffer = new Float32Array(bufferLength);
        this.analyser.getFloatTimeDomainData(buffer);

        // Autocorrelation to find period
        const sampleRate = this.audioContext.sampleRate;
        const minPeriod = Math.floor(sampleRate / 1000); // 1000 Hz max
        const maxPeriod = Math.floor(sampleRate / 50);   // 50 Hz min

        let bestCorrelation = 0;
        let bestPeriod = 0;

        for (let period = minPeriod; period < maxPeriod && period < bufferLength / 2; period++) {
            let correlation = 0;
            for (let i = 0; i < bufferLength - period; i++) {
                correlation += buffer[i] * buffer[i + period];
            }

            if (correlation > bestCorrelation) {
                bestCorrelation = correlation;
                bestPeriod = period;
            }
        }

        // Convert period to frequency
        if (bestPeriod > 0 && bestCorrelation > 0.01) {
            return sampleRate / bestPeriod;
        }

        return 0;
    }

    analyzeNote(frequency) {
        let closestNote = null;
        let smallestDifference = Infinity;

        // Find the closest standard tuning note
        for (const [noteName, noteData] of Object.entries(this.standardTuning)) {
            const difference = Math.abs(frequency - noteData.frequency);
            if (difference < smallestDifference) {
                smallestDifference = difference;
                closestNote = { name: noteName, ...noteData };
            }
        }

        if (closestNote) {
            this.currentNote = closestNote;
            // Calculate cents (1200 cents = 1 octave)
            this.cents = Math.round(1200 * Math.log2(frequency / closestNote.frequency));
        }
    }

    updateDisplay() {
        const tunerDisplay = document.getElementById('tuner-display');
        if (!tunerDisplay || !this.currentNote) return;

        const frequency = this.currentFrequency.toFixed(2);
        const cents = this.cents;

        // Determine tuning status
        let status = 'sharp';
        let statusText = `+${cents} cents`;
        let statusColor = '#ff6b6b'; // Red for sharp

        if (cents < 0) {
            status = 'flat';
            statusText = `${cents} cents`;
            statusColor = '#ff6b6b'; // Red for flat
        }

        if (Math.abs(cents) <= 5) {
            status = 'in-tune';
            statusText = 'In Tune!';
            statusColor = '#4ecdc4'; // Teal for in tune
        }

        // Update display
        tunerDisplay.innerHTML = `
            <div class="tuner-note">
                <div class="note-name">${this.currentNote.name}</div>
                <div class="note-string">String ${this.currentNote.string}</div>
            </div>
            <div class="frequency-display">${frequency} Hz</div>
            <div class="tuning-meter">
                <div class="meter-track">
                    <div class="meter-center"></div>
                    <div class="meter-needle" style="transform: translateX(${Math.max(-100, Math.min(100, cents * 2))}px)"></div>
                </div>
                <div class="meter-labels">
                    <span>♭</span>
                    <span>♯</span>
                </div>
            </div>
            <div class="tuning-status ${status}" style="color: ${statusColor}">
                ${statusText}
            </div>
        `;

        // Update needle position and color
        const needle = tunerDisplay.querySelector('.meter-needle');
        if (needle) {
            needle.style.backgroundColor = statusColor;
        }
    }

    showError(message) {
        const tunerDisplay = document.getElementById('tuner-display');
        if (tunerDisplay) {
            tunerDisplay.innerHTML = `
                <div class="tuner-error">
                    <div class="error-icon">⚠️</div>
                    <div class="error-message">${message}</div>
                    <div class="error-help">Please allow microphone access and try again</div>
                </div>
            `;
        }
    }

    async toggle() {
        if (!this.isActive) {
            const initialized = await this.initialize();
            if (initialized) {
                this.isActive = true;
                this.startListening();
                return true;
            }
            return false;
        } else {
            this.stop();
            return false;
        }
    }

    stop() {
        this.isActive = false;
        this.stopListening();

        if (this.microphone) {
            this.microphone.disconnect();
        }
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }

        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.dataArray = null;
    }

    playReferenceNote(noteName) {
        const noteData = this.standardTuning[noteName];
        if (!noteData || !window.guitarAudio) return;

        // Use the guitar audio engine to play the reference note
        window.guitarAudio.initialize().then(() => {
            if (window.guitarAudio.fallbackGuitar) {
                const note = noteName; // Already includes octave
                window.guitarAudio.fallbackGuitar.triggerAttackRelease(note, '2n');
            }
        });
    }
}

// Create global tuner instance
window.guitarTuner = new GuitarTuner();

console.log('Guitar tuner loaded');