// midi-generator.js - Custom MIDI file generator
// Lightweight replacement for MidiWriter.js with no external dependencies

class SimpleMIDI {
    constructor() {
        this.tracks = [];
        this.ticksPerQuarter = 480; // Standard MIDI resolution
    }

    // Add a new track
    addTrack(name = 'Track') {
        const track = new MIDITrack(name, this.ticksPerQuarter);
        this.tracks.push(track);
        return track;
    }

    // Generate the complete MIDI file as a Uint8Array
    generate() {
        const headerChunk = this.createHeaderChunk();
        const trackChunks = this.tracks.map(track => track.generate());

        // Calculate total file size
        let totalSize = headerChunk.length;
        trackChunks.forEach(chunk => totalSize += chunk.length);

        // Combine all chunks
        const midiData = new Uint8Array(totalSize);
        let offset = 0;

        // Copy header
        midiData.set(headerChunk, offset);
        offset += headerChunk.length;

        // Copy track chunks
        trackChunks.forEach(chunk => {
            midiData.set(chunk, offset);
            offset += chunk.length;
        });

        return midiData;
    }

    // Create MIDI header chunk
    createHeaderChunk() {
        const header = new ArrayBuffer(14);
        const view = new DataView(header);

        // "MThd" chunk type
        view.setUint32(0, 0x4D546864, false); // "MThd"
        view.setUint32(4, 6, false); // Header length
        view.setUint16(8, 1, false); // Format type 1 (multi-track)
        view.setUint16(10, this.tracks.length, false); // Number of tracks
        view.setUint16(12, this.ticksPerQuarter, false); // Ticks per quarter note

        return new Uint8Array(header);
    }

    // Create a downloadable blob
    toBlob() {
        const midiData = this.generate();
        return new Blob([midiData], { type: 'audio/midi' });
    }
}

class MIDITrack {
    constructor(name, ticksPerQuarter) {
        this.name = name;
        this.ticksPerQuarter = ticksPerQuarter;
        this.events = [];
        this.currentTime = 0;
    }

    // Add a note on event
    noteOn(channel, note, velocity, time) {
        if (time !== undefined) this.currentTime = time;
        this.events.push({
            time: this.currentTime,
            type: 'noteOn',
            channel: channel,
            note: note,
            velocity: velocity
        });
        return this;
    }

    // Add a note off event
    noteOff(channel, note, velocity, time) {
        if (time !== undefined) this.currentTime = time;
        this.events.push({
            time: this.currentTime,
            type: 'noteOff',
            channel: channel,
            note: note,
            velocity: velocity || 64
        });
        return this;
    }

    // Add a note with duration (convenience method)
    addNote(channel, note, velocity, startTime, duration) {
        this.noteOn(channel, note, velocity, startTime);
        this.noteOff(channel, note, velocity, startTime + duration);
        return this;
    }

    // Add program change (instrument selection)
    programChange(channel, program, time) {
        if (time !== undefined) this.currentTime = time;
        this.events.push({
            time: this.currentTime,
            type: 'programChange',
            channel: channel,
            program: program
        });
        return this;
    }

    // Add controller change (like volume, pan, etc.)
    controllerChange(channel, controller, value, time) {
        if (time !== undefined) this.currentTime = time;
        this.events.push({
            time: this.currentTime,
            type: 'controllerChange',
            channel: channel,
            controller: controller,
            value: value
        });
        return this;
    }

    // Add track name meta event
    addTrackName(name) {
        this.events.push({
            time: 0,
            type: 'trackName',
            text: name || this.name
        });
        return this;
    }

    // Add tempo change (BPM)
    addTempo(bpm, time = 0) {
        const microsecondsPerQuarter = Math.round(60000000 / bpm);
        this.events.push({
            time: time,
            type: 'tempo',
            microsecondsPerQuarter: microsecondsPerQuarter
        });
        return this;
    }

    // Generate track chunk
    generate() {
        // Sort events by time
        this.events.sort((a, b) => a.time - b.time);

        // Convert events to MIDI data
        const trackData = [];
        let lastTime = 0;

        this.events.forEach(event => {
            // Calculate delta time
            const deltaTime = event.time - lastTime;
            lastTime = event.time;

            // Add delta time as variable length quantity
            trackData.push(...this.encodeVariableLength(deltaTime));

            // Add event data
            switch (event.type) {
                case 'noteOn':
                    trackData.push(0x90 | event.channel, event.note, event.velocity);
                    break;
                case 'noteOff':
                    trackData.push(0x80 | event.channel, event.note, event.velocity);
                    break;
                case 'programChange':
                    trackData.push(0xC0 | event.channel, event.program);
                    break;
                case 'controllerChange':
                    trackData.push(0xB0 | event.channel, event.controller, event.value);
                    break;
                case 'trackName':
                    const nameBytes = new TextEncoder().encode(event.text);
                    trackData.push(0xFF, 0x03); // Meta event: Track name
                    trackData.push(...this.encodeVariableLength(nameBytes.length));
                    trackData.push(...nameBytes);
                    break;
                case 'tempo':
                    trackData.push(0xFF, 0x51, 0x03); // Meta event: Set tempo
                    const tempo = event.microsecondsPerQuarter;
                    trackData.push((tempo >> 16) & 0xFF, (tempo >> 8) & 0xFF, tempo & 0xFF);
                    break;
            }
        });

        // Add end of track
        trackData.push(0x00, 0xFF, 0x2F, 0x00);

        // Create track chunk
        const header = new ArrayBuffer(8);
        const view = new DataView(header);
        view.setUint32(0, 0x4D54726B, false); // "MTrk"
        view.setUint32(4, trackData.length, false); // Track length

        // Combine header and data
        const result = new Uint8Array(8 + trackData.length);
        result.set(new Uint8Array(header), 0);
        result.set(trackData, 8);

        return result;
    }

    // Encode variable length quantity (VLQ)
    encodeVariableLength(value) {
        const bytes = [];
        let tmp = value;

        bytes.unshift(tmp & 0x7F);
        tmp >>= 7;

        while (tmp > 0) {
            bytes.unshift((tmp & 0x7F) | 0x80);
            tmp >>= 7;
        }

        return bytes;
    }
}

// Utility functions for common MIDI operations
class MIDIUtils {
    // Convert note name to MIDI number
    static noteToMidi(noteName, octave = 4) {
        const noteMap = {
            'C': 0, 'C#': 1, 'Db': 1,
            'D': 2, 'D#': 3, 'Eb': 3,
            'E': 4,
            'F': 5, 'F#': 6, 'Gb': 6,
            'G': 7, 'G#': 8, 'Ab': 8,
            'A': 9, 'A#': 10, 'Bb': 10,
            'B': 11
        };

        // Parse note name and octave
        let note = noteName.replace(/[0-9]/g, '');
        let oct = parseInt(noteName.replace(/[^0-9]/g, '')) || octave;

        const noteNumber = noteMap[note];
        if (noteNumber === undefined) {
            console.warn(`Unknown note: ${note}`);
            return 60; // Default to middle C
        }

        return (oct + 1) * 12 + noteNumber;
    }

    // Convert BPM to ticks
    static bpmToTicks(bpm, ticksPerQuarter = 480) {
        return Math.round(60000 / bpm * ticksPerQuarter / 1000);
    }

    // Convert duration to ticks
    static durationToTicks(duration, bpm, ticksPerQuarter = 480) {
        const quarterNoteTicks = ticksPerQuarter;
        switch (duration) {
            case 'whole': return quarterNoteTicks * 4;
            case 'half': return quarterNoteTicks * 2;
            case 'quarter': return quarterNoteTicks;
            case 'eighth': return quarterNoteTicks / 2;
            case 'sixteenth': return quarterNoteTicks / 4;
            default: return quarterNoteTicks;
        }
    }

    // Common MIDI instruments
    static instruments = {
        piano: 0,
        guitar: 24,
        bass: 32,
        strings: 48,
        trumpet: 56,
        saxophone: 64,
        flute: 73,
        pad: 88,
        lead: 80,
        drums: 128 // Special case - use channel 9 for drums
    };

    // Common drum sounds (for channel 9)
    static drums = {
        kick: 36,
        snare: 38,
        hihat: 42,
        openHihat: 46,
        crash: 49,
        ride: 51,
        highTom: 50,
        midTom: 47,
        lowTom: 45
    };
}

// Export for module use
export { SimpleMIDI, MIDITrack, MIDIUtils };

// Make available globally
window.SimpleMIDI = SimpleMIDI;
window.MIDITrack = MIDITrack;
window.MIDIUtils = MIDIUtils;