import * as Tone from 'tone';
import { Project, MidiNote, MidiPattern } from '../types';

interface InstrumentConfig {
  type: 'synth' | 'sampler' | 'drum';
  options: any;
  effects?: any[];
}

export class AudioEngine {
  private instruments: Map<string, Tone.Instrument> = new Map();
  private transport: typeof Tone.Transport;
  private isInitialized = false;
  private currentProject: Project | null = null;
  private scheduledEvents: any[] = [];

  private instrumentConfigs: { [key: string]: InstrumentConfig } = {
    // Drum kits
    'kit_rock': {
      type: 'sampler',
      options: {
        urls: {
          'C1': 'kick.wav',
          'D1': 'snare.wav',
          'F#1': 'hihat.wav',
          'A1': 'crash.wav',
        },
        baseUrl: '/samples/drums/',
        release: 1
      }
    },
    'kit_electronic': {
      type: 'sampler',
      options: {
        urls: {
          'C1': 'kick_808.wav',
          'D1': 'snare_clap.wav',
          'F#1': 'hihat_closed.wav',
          'A1': 'crash_reverse.wav',
        },
        baseUrl: '/samples/electronic/',
        release: 1
      }
    },

    // Bass instruments
    'electric_bass': {
      type: 'synth',
      options: {
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.8 },
        filter: { frequency: 800, type: 'lowpass' },
        filterEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.5, release: 0.8 }
      },
      effects: [
        { type: 'distortion', options: { distortion: 0.1 } },
        { type: 'filter', options: { frequency: 1000, type: 'lowpass' } }
      ]
    },
    'synth_bass': {
      type: 'synth',
      options: {
        oscillator: { type: 'square' },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0.8, release: 0.3 },
        filter: { frequency: 600, type: 'lowpass' }
      }
    },

    // Piano/Keyboard instruments
    'acoustic_piano': {
      type: 'sampler',
      options: {
        urls: {
          'C4': 'piano_c4.wav',
          'D#4': 'piano_ds4.wav',
          'F#4': 'piano_fs4.wav',
          'A4': 'piano_a4.wav',
        },
        baseUrl: '/samples/piano/',
        release: 1
      }
    },
    'electric_piano': {
      type: 'synth',
      options: {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.02, decay: 0.3, sustain: 0.6, release: 1.5 },
        modulation: { type: 'sine', frequency: 5 },
        modulationEnvelope: { attack: 0.5, decay: 0, sustain: 1, release: 0.5 }
      },
      effects: [
        { type: 'chorus', options: { frequency: 4, delayTime: 2.5, depth: 0.5 } },
        { type: 'reverb', options: { roomSize: 0.4, dampening: 3000 } }
      ]
    },

    // Guitar instruments
    'acoustic_guitar': {
      type: 'synth',
      options: {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.01, decay: 0.5, sustain: 0.3, release: 1.2 },
        filter: { frequency: 2000, type: 'lowpass' }
      }
    },
    'electric_guitar': {
      type: 'synth',
      options: {
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.01, decay: 0.3, sustain: 0.6, release: 0.8 },
        filter: { frequency: 1500, type: 'lowpass' }
      },
      effects: [
        { type: 'distortion', options: { distortion: 0.3 } },
        { type: 'delay', options: { delayTime: 0.25, feedback: 0.3 } }
      ]
    },

    // Strings
    'strings': {
      type: 'synth',
      options: {
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 1.0, decay: 0.3, sustain: 0.8, release: 2.0 },
        filter: { frequency: 3000, type: 'lowpass' },
        filterEnvelope: { attack: 1.0, decay: 0.5, sustain: 0.7, release: 2.0 }
      },
      effects: [
        { type: 'reverb', options: { roomSize: 0.8, dampening: 1000 } },
        { type: 'chorus', options: { frequency: 2, delayTime: 5, depth: 0.3 } }
      ]
    },

    // Synth leads
    'synth_lead': {
      type: 'synth',
      options: {
        oscillator: { type: 'square' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.7, release: 0.5 },
        filter: { frequency: 2000, type: 'lowpass' },
        filterEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.5, release: 0.8 }
      },
      effects: [
        { type: 'delay', options: { delayTime: 0.125, feedback: 0.4 } }
      ]
    }
  };

  constructor() {
    this.transport = Tone.Transport;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await Tone.start();

      this.transport.bpm.value = 120;
      this.transport.timeSignature = 4;
      this.transport.swing = 0;
      this.transport.swingSubdivision = '8n';

      this.setupMasterEffects();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
    }
  }

  private setupMasterEffects(): void {
    const limiter = new Tone.Limiter(-6).toDestination();
    const reverb = new Tone.Reverb({
      roomSize: 0.3,
      dampening: 3000,
      wet: 0.1
    }).connect(limiter);

    Tone.Destination.connect(reverb);
  }

  async loadInstrument(trackId: string, instrumentType: string): Promise<void> {
    if (this.instruments.has(trackId)) {
      this.instruments.get(trackId)?.dispose();
    }

    const config = this.instrumentConfigs[instrumentType];
    if (!config) {
      console.warn(`Unknown instrument type: ${instrumentType}`);
      return;
    }

    let instrument: Tone.Instrument;

    switch (config.type) {
      case 'synth':
        instrument = new Tone.Synth(config.options);
        break;
      case 'sampler':
        instrument = new Tone.Sampler(config.options);
        break;
      case 'drum':
        instrument = new Tone.Sampler(config.options);
        break;
      default:
        instrument = new Tone.Synth();
    }

    if (config.effects) {
      let chain = instrument;
      for (const effectConfig of config.effects) {
        const effect = this.createEffect(effectConfig.type, effectConfig.options);
        chain = chain.connect(effect);
      }
      chain.toDestination();
    } else {
      instrument.toDestination();
    }

    this.instruments.set(trackId, instrument);
  }

  private createEffect(type: string, options: any): Tone.ToneAudioNode {
    switch (type) {
      case 'reverb':
        return new Tone.Reverb(options);
      case 'delay':
        return new Tone.Delay(options);
      case 'distortion':
        return new Tone.Distortion(options);
      case 'filter':
        return new Tone.Filter(options);
      case 'chorus':
        return new Tone.Chorus(options);
      default:
        return new Tone.Gain(1);
    }
  }

  async play(project?: Project): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (project) {
      this.currentProject = project;
      await this.scheduleProject(project);
    }

    this.transport.start();
  }

  pause(): void {
    this.transport.pause();
  }

  stop(): void {
    this.transport.stop();
    this.clearScheduledEvents();
  }

  seekTo(position: number): void {
    this.transport.position = position;
  }

  setTempo(bpm: number): void {
    this.transport.bpm.value = bpm;
  }

  setTimeSignature(numerator: number, denominator: number = 4): void {
    this.transport.timeSignature = [numerator, denominator];
  }

  setSwing(amount: number): void {
    this.transport.swing = amount;
  }

  private async scheduleProject(project: Project): Promise<void> {
    this.clearScheduledEvents();

    for (const track of project.tracks) {
      if (track.muted) continue;

      await this.loadInstrument(track.id, track.instrument);

      for (const pattern of track.patterns) {
        this.schedulePattern(track.id, pattern);
      }
    }
  }

  private schedulePattern(trackId: string, pattern: MidiPattern): void {
    const instrument = this.instruments.get(trackId);
    if (!instrument) return;

    for (const note of pattern.notes) {
      const event = this.transport.schedule((time) => {
        const frequency = Tone.Frequency(note.pitch, 'midi').toFrequency();
        const velocity = note.velocity / 127;

        if (instrument instanceof Tone.Sampler) {
          const noteName = Tone.Frequency(note.pitch, 'midi').toNote();
          instrument.triggerAttackRelease(noteName, note.duration, time, velocity);
        } else if (instrument instanceof Tone.Synth) {
          instrument.triggerAttackRelease(frequency, note.duration, time, velocity);
        }
      }, note.start);

      this.scheduledEvents.push(event);
    }
  }

  private clearScheduledEvents(): void {
    for (const event of this.scheduledEvents) {
      this.transport.clear(event);
    }
    this.scheduledEvents = [];
  }

  playNote(trackId: string, pitch: number, velocity: number = 100, duration: number = 0.5): void {
    const instrument = this.instruments.get(trackId);
    if (!instrument) return;

    const frequency = Tone.Frequency(pitch, 'midi').toFrequency();
    const normalizedVelocity = velocity / 127;

    if (instrument instanceof Tone.Sampler) {
      const noteName = Tone.Frequency(pitch, 'midi').toNote();
      instrument.triggerAttackRelease(noteName, duration, undefined, normalizedVelocity);
    } else if (instrument instanceof Tone.Synth) {
      instrument.triggerAttackRelease(frequency, duration, undefined, normalizedVelocity);
    }
  }

  playChord(trackId: string, pitches: number[], velocity: number = 100, duration: number = 1): void {
    for (const pitch of pitches) {
      this.playNote(trackId, pitch, velocity, duration);
    }
  }

  setTrackVolume(trackId: string, volume: number): void {
    const instrument = this.instruments.get(trackId);
    if (instrument && 'volume' in instrument) {
      (instrument as any).volume.value = Tone.gainToDb(volume);
    }
  }

  setTrackMute(trackId: string, muted: boolean): void {
    const instrument = this.instruments.get(trackId);
    if (instrument && 'volume' in instrument) {
      (instrument as any).volume.value = muted ? -Infinity : 0;
    }
  }

  setTrackSolo(trackId: string, solo: boolean): void {
    if (!this.currentProject) return;

    for (const track of this.currentProject.tracks) {
      if (track.id === trackId) {
        this.setTrackMute(track.id, false);
      } else {
        this.setTrackMute(track.id, solo);
      }
    }
  }

  getTransportPosition(): number {
    return this.transport.position as number;
  }

  isPlaying(): boolean {
    return this.transport.state === 'started';
  }

  getAvailableInstruments(): string[] {
    return Object.keys(this.instrumentConfigs);
  }

  dispose(): void {
    this.stop();

    for (const instrument of this.instruments.values()) {
      instrument.dispose();
    }
    this.instruments.clear();

    if (this.isInitialized) {
      Tone.Transport.cancel();
    }
  }

  exportToWAV(project: Project, duration: number = 30): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        const recorder = new Tone.Recorder();
        Tone.Destination.connect(recorder);

        recorder.start();

        this.play(project);

        setTimeout(async () => {
          const recording = await recorder.stop();
          this.stop();
          Tone.Destination.disconnect(recorder);
          recorder.dispose();
          resolve(recording);
        }, duration * 1000);

      } catch (error) {
        reject(error);
      }
    });
  }
}