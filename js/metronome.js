// metronome.js - Professional Metronome with Precise Timing
class Metronome {
    constructor() {
        this.isActive = false;
        this.isPlaying = false;
        this.audioContext = null;
        this.nextNoteTime = 0.0;
        this.currentNote = 0;
        this.tempo = 120; // BPM
        this.lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
        this.scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
        this.timerWorker = null;
        this.timeSignature = { numerator: 4, denominator: 4 };

        // Sound settings
        this.clickHighFreq = 800;
        this.clickLowFreq = 400;
        this.clickDuration = 0.05;
        this.volume = 0.5;

        // Visual metronome
        this.visualElement = null;
        this.lastBeatTime = 0;
    }

    async initialize() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create worker for precise timing (if available)
            if (typeof Worker !== 'undefined') {
                this.createTimerWorker();
            }

            console.log('Metronome initialized successfully');
            return true;

        } catch (error) {
            console.error('Failed to initialize metronome:', error);
            return false;
        }
    }

    createTimerWorker() {
        // Create a Web Worker for precise timing
        const workerScript = `
            let timerID = null;
            let interval = 100;

            self.onmessage = function(e) {
                if (e.data === "start") {
                    timerID = setInterval(function(){
                        postMessage("tick");
                    }, interval);
                } else if (e.data.interval) {
                    interval = e.data.interval;
                    if (timerID) {
                        clearInterval(timerID);
                        timerID = setInterval(function(){
                            postMessage("tick");
                        }, interval);
                    }
                } else if (e.data === "stop") {
                    clearInterval(timerID);
                    timerID = null;
                }
            };
        `;

        const blob = new Blob([workerScript], { type: 'application/javascript' });
        this.timerWorker = new Worker(URL.createObjectURL(blob));

        this.timerWorker.onmessage = (e) => {
            if (e.data === "tick") {
                this.scheduler();
            }
        };

        this.timerWorker.postMessage({ interval: this.lookahead });
    }

    start() {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.currentNote = 0;
        this.nextNoteTime = this.audioContext.currentTime;
        this.lastBeatTime = Date.now();

        if (this.timerWorker) {
            this.timerWorker.postMessage("start");
        } else {
            // Fallback to setTimeout
            this.scheduleLoop();
        }

        this.updateDisplay();
        console.log(`Metronome started at ${this.tempo} BPM`);
    }

    stop() {
        this.isPlaying = false;

        if (this.timerWorker) {
            this.timerWorker.postMessage("stop");
        }

        this.updateDisplay();
        console.log('Metronome stopped');
    }

    scheduleLoop() {
        if (!this.isPlaying) return;

        this.scheduler();
        setTimeout(() => this.scheduleLoop(), this.lookahead);
    }

    scheduler() {
        // While there are notes that will need to play before the next interval,
        // schedule them and advance the pointer.
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
            this.scheduleNote(this.currentNote, this.nextNoteTime);
            this.nextNote();
        }
    }

    scheduleNote(beatNumber, time) {
        // Create click sound
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Use higher frequency for downbeat (first beat of measure)
        const frequency = (beatNumber % this.timeSignature.numerator === 0) ?
            this.clickHighFreq : this.clickLowFreq;

        oscillator.frequency.value = frequency;
        oscillator.type = 'square';

        // Create click envelope
        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(this.volume, time + 0.001);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + this.clickDuration);

        oscillator.start(time);
        oscillator.stop(time + this.clickDuration);

        // Update visual metronome
        this.updateVisualBeat(beatNumber, time);
    }

    nextNote() {
        // Calculate the time for the next beat
        const secondsPerBeat = 60.0 / this.tempo;
        this.nextNoteTime += secondsPerBeat;

        // Advance the beat number, wrapping to zero when it reaches time signature
        this.currentNote = (this.currentNote + 1) % this.timeSignature.numerator;
    }

    updateVisualBeat(beatNumber, time) {
        // Schedule visual update to synchronize with audio
        const delay = (time - this.audioContext.currentTime) * 1000;

        setTimeout(() => {
            this.flashBeat(beatNumber);
            this.updateBeatIndicator(beatNumber);
        }, delay);
    }

    flashBeat(beatNumber) {
        const metronomeDisplay = document.getElementById('metronome-display');
        if (!metronomeDisplay) return;

        const flashElement = metronomeDisplay.querySelector('.beat-flash');
        if (flashElement) {
            flashElement.classList.remove('flash');
            // Force reflow
            flashElement.offsetHeight;
            flashElement.classList.add('flash');

            // Add emphasis for downbeat
            if (beatNumber === 0) {
                flashElement.classList.add('downbeat');
                setTimeout(() => flashElement.classList.remove('downbeat'), 200);
            }
        }
    }

    updateBeatIndicator(beatNumber) {
        const beatDots = document.querySelectorAll('.beat-dot');

        beatDots.forEach((dot, index) => {
            if (index === beatNumber) {
                dot.classList.add('active');
                if (beatNumber === 0) {
                    dot.classList.add('downbeat');
                }
            } else {
                dot.classList.remove('active', 'downbeat');
            }
        });
    }

    setTempo(newTempo) {
        newTempo = Math.max(40, Math.min(200, newTempo)); // Clamp between 40-200 BPM
        this.tempo = newTempo;
        this.updateDisplay();
        console.log(`Tempo changed to ${this.tempo} BPM`);
    }

    setTimeSignature(numerator, denominator) {
        this.timeSignature = { numerator, denominator };
        this.currentNote = 0; // Reset beat counter
        this.updateDisplay();
        console.log(`Time signature changed to ${numerator}/${denominator}`);
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.updateDisplay();
    }

    updateDisplay() {
        const metronomeDisplay = document.getElementById('metronome-display');
        if (!metronomeDisplay) return;

        metronomeDisplay.innerHTML = `
            <div class="metronome-controls">
                <div class="tempo-section">
                    <label class="tempo-label">Tempo</label>
                    <div class="tempo-controls">
                        <button class="tempo-btn" onclick="window.metronome.adjustTempo(-5)">-5</button>
                        <button class="tempo-btn" onclick="window.metronome.adjustTempo(-1)">-1</button>
                        <div class="tempo-display">
                            <input type="number" id="tempo-input" value="${this.tempo}" min="40" max="200"
                                   onchange="window.metronome.setTempo(parseInt(this.value))">
                            <span class="bpm-label">BPM</span>
                        </div>
                        <button class="tempo-btn" onclick="window.metronome.adjustTempo(1)">+1</button>
                        <button class="tempo-btn" onclick="window.metronome.adjustTempo(5)">+5</button>
                    </div>
                </div>

                <div class="time-signature-section">
                    <label class="time-sig-label">Time Signature</label>
                    <div class="time-signature-controls">
                        <select id="time-sig-num" onchange="window.metronome.updateTimeSignature()">
                            <option value="2" ${this.timeSignature.numerator === 2 ? 'selected' : ''}>2</option>
                            <option value="3" ${this.timeSignature.numerator === 3 ? 'selected' : ''}>3</option>
                            <option value="4" ${this.timeSignature.numerator === 4 ? 'selected' : ''}>4</option>
                            <option value="5" ${this.timeSignature.numerator === 5 ? 'selected' : ''}>5</option>
                            <option value="6" ${this.timeSignature.numerator === 6 ? 'selected' : ''}>6</option>
                        </select>
                        <span class="time-sig-divider">/</span>
                        <select id="time-sig-den" onchange="window.metronome.updateTimeSignature()">
                            <option value="4" ${this.timeSignature.denominator === 4 ? 'selected' : ''}>4</option>
                            <option value="8" ${this.timeSignature.denominator === 8 ? 'selected' : ''}>8</option>
                        </select>
                    </div>
                </div>

                <div class="volume-section">
                    <label class="volume-label">Volume</label>
                    <input type="range" id="volume-slider" min="0" max="1" step="0.1" value="${this.volume}"
                           oninput="window.metronome.setVolume(parseFloat(this.value))">
                </div>
            </div>

            <div class="beat-indicator">
                ${Array.from({ length: this.timeSignature.numerator }, (_, i) =>
                    `<div class="beat-dot ${i === this.currentNote ? 'active' : ''} ${i === 0 ? 'downbeat' : ''}"></div>`
                ).join('')}
            </div>

            <div class="beat-flash"></div>

            <div class="playback-controls">
                <button class="play-btn ${this.isPlaying ? 'playing' : ''}"
                        onclick="window.metronome.toggle()">
                    ${this.isPlaying ? '⏸️ Stop' : '▶️ Start'}
                </button>
                <button class="tap-tempo-btn" onclick="window.metronome.initTapTempo()">
                    👆 Tap Tempo
                </button>
            </div>

            <div class="preset-tempos">
                <h4>Common Tempos</h4>
                <div class="tempo-presets">
                    <button onclick="window.metronome.setTempo(60)">Largo (60)</button>
                    <button onclick="window.metronome.setTempo(80)">Andante (80)</button>
                    <button onclick="window.metronome.setTempo(120)">Moderato (120)</button>
                    <button onclick="window.metronome.setTempo(144)">Allegro (144)</button>
                    <button onclick="window.metronome.setTempo(180)">Presto (180)</button>
                </div>
            </div>
        `;
    }

    adjustTempo(change) {
        this.setTempo(this.tempo + change);

        // Update the input field
        const tempoInput = document.getElementById('tempo-input');
        if (tempoInput) {
            tempoInput.value = this.tempo;
        }
    }

    updateTimeSignature() {
        const numSelect = document.getElementById('time-sig-num');
        const denSelect = document.getElementById('time-sig-den');

        if (numSelect && denSelect) {
            this.setTimeSignature(
                parseInt(numSelect.value),
                parseInt(denSelect.value)
            );
        }
    }

    // Tap tempo functionality
    initTapTempo() {
        this.tapTimes = [];
        this.tapButton = document.querySelector('.tap-tempo-btn');

        if (this.tapButton) {
            this.tapButton.textContent = '👆 Tap (0/4)';
            this.tapButton.onclick = () => this.tapTempo();
        }
    }

    tapTempo() {
        const now = Date.now();
        this.tapTimes.push(now);

        // Keep only the last 4 taps
        if (this.tapTimes.length > 4) {
            this.tapTimes.shift();
        }

        const tapCount = this.tapTimes.length;
        this.tapButton.textContent = `👆 Tap (${tapCount}/4)`;

        if (tapCount >= 2) {
            // Calculate average interval
            let totalInterval = 0;
            for (let i = 1; i < tapCount; i++) {
                totalInterval += this.tapTimes[i] - this.tapTimes[i - 1];
            }

            const avgInterval = totalInterval / (tapCount - 1);
            const calculatedTempo = Math.round(60000 / avgInterval);

            // Update tempo if reasonable
            if (calculatedTempo >= 40 && calculatedTempo <= 200) {
                this.setTempo(calculatedTempo);

                // Update the input field
                const tempoInput = document.getElementById('tempo-input');
                if (tempoInput) {
                    tempoInput.value = this.tempo;
                }
            }
        }

        // Reset tap tempo after 2 seconds of inactivity
        clearTimeout(this.tapTimeout);
        this.tapTimeout = setTimeout(() => {
            this.tapButton.textContent = '👆 Tap Tempo';
            this.tapButton.onclick = () => this.initTapTempo();
            this.tapTimes = [];
        }, 2000);
    }

    async toggle() {
        if (!this.isActive) {
            const initialized = await this.initialize();
            if (initialized) {
                this.isActive = true;
                this.start();
                return true;
            }
            return false;
        } else {
            if (this.isPlaying) {
                this.stop();
            } else {
                this.start();
            }
            return this.isPlaying;
        }
    }

    async togglePlayback() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.start();
        }
    }

    dispose() {
        this.stop();
        this.isActive = false;

        if (this.timerWorker) {
            this.timerWorker.terminate();
            this.timerWorker = null;
        }

        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }

        this.audioContext = null;
    }
}

// Create global metronome instance
window.metronome = new Metronome();

console.log('Metronome loaded');