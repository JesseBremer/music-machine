# Enhanced Rhythm Engine - Documentation

## Overview

The Music Machine now includes a professional rhythm engine that provides:
- **10 drum styles**: Rock, Pop, Disco, Funk, Hip Hop, Reggae, Electronic, Jazz, Latin, Blues
- **5 bass patterns**: Root notes, Root-Fifth, Walking Bass, Arpeggio, Octaves
- **Real-time synthesis** using Tone.js
- **Intelligent bass generation** from chord progressions

## Features

### Professional Drum Sounds
- Synthesized kick, snare, hi-hat, open hi-hat, clap, and tom drums
- Genre-specific patterns with authentic rhythms
- Preview individual patterns before selection

### Smart Bass Generation
- **Root Notes**: Simple root note bass line
- **Root-Fifth**: Alternates between root and fifth
- **Walking Bass**: Jazz-style walking with chromatic approaches
- **Arpeggio**: Full chord arpeggios
- **Octaves**: Root notes in different octaves

### Pattern-Based System
- Uses intuitive pattern notation: `"x-x-x-x-"` where `x` = hit, `-` = rest
- Supports 16th note resolution
- Automatic loop and synchronization with Tone.js Transport

## Usage

### Step 4: Rhythm Section

1. **Navigate to Step 4** after selecting chords
2. **Browse rhythm templates** - sorted by compatibility with your genre
3. **Preview individual drums** - Click "🔊 Preview" on any template card
4. **Select a template** - Click on a card to select it
5. **Play full rhythm** - Click "▶️ Play Full Rhythm" to hear drums + bass together
6. **Stop playback** - Click "⏹️ Stop" to stop

### Compatibility Ratings

Templates are rated based on your selected genre:
- **Perfect** ⭐⭐⭐ - Ideal match for your genre
- **Good** ⭐⭐ - Works well with your genre
- **Fair** ⭐ - Can work but may need adjustment

## Available Styles

### Drum Styles

| Style | Description | Tempo Range | Best For |
|-------|-------------|-------------|----------|
| **Rock** | Classic rock beat with driving kick/snare | 80-140 BPM | Rock, Alternative, Punk |
| **Pop** | Modern pop groove with syncopation | 100-130 BPM | Pop, Indie, Contemporary |
| **Disco** | Four-on-the-floor with open hi-hats | 110-130 BPM | Disco, Dance, Electronic |
| **Funk** | Syncopated 16th note hi-hats | 95-115 BPM | Funk, Soul, R&B |
| **Hip Hop** | Boom-bap with heavy kicks | 80-100 BPM | Hip Hop, Trap, Urban |
| **Reggae** | One-drop with offbeat kicks | 70-90 BPM | Reggae, Ska, Dub |
| **Electronic** | High-energy 4/4 dance beat | 120-140 BPM | EDM, House, Techno |
| **Jazz** | Swinging jazz rhythm | 100-160 BPM | Jazz, Swing, Bebop |
| **Latin** | Tumbao with toms and syncopation | 100-130 BPM | Latin, Salsa, Bossa Nova |
| **Blues** | Shuffling blues groove | 70-110 BPM | Blues, Country, Rock |

### Bass Styles

| Style | Pattern | Description |
|-------|---------|-------------|
| **Root** | Quarter notes | Simple root notes on beat |
| **Root-Fifth** | Alternating | Alternates root and fifth |
| **Walking** | Eighths | Jazz walking bass with chromatic approaches |
| **Arpeggio** | 16ths | Full chord arpeggiation |
| **Octaves** | Octave jumps | Root notes in different octaves |

## Technical Details

### Drum Synthesis
- **Kick**: MembraneSynth with exponential decay
- **Snare**: NoiseSynth with white noise
- **Hi-Hat/Open Hi-Hat**: MetalSynth with harmonicity
- **Clap**: NoiseSynth with short decay
- **Tom**: MembraneSynth with mid-range pitch

### Bass Synthesis
- **MonoSynth** with sawtooth oscillator
- Lowpass filter with envelope control
- Attack: 0.01s, Decay: 0.3s, Sustain: 0.4, Release: 0.8s
- Filter envelope for dynamic timbre

### Audio Processing
- **Compression**: -20dB threshold, 3:1 ratio
- Applied to kick, snare, and bass for cohesive sound
- Prevents clipping and balances levels

## API Reference

### RhythmEngine Class

```javascript
// Global instance available as window.rhythmEngine

// Initialize (called automatically on app start)
await rhythmEngine.initialize();

// Play full rhythm section
await rhythmEngine.playRhythmSection(
    ['C', 'Am', 'F', 'G'],  // chord progression
    'C',                      // key
    120,                      // tempo
    'rock',                   // drum style
    'root'                    // bass style
);

// Preview drum pattern only
await rhythmEngine.previewDrumPattern('funk', 110);

// Stop all playback
rhythmEngine.stop();

// Trigger individual drum
rhythmEngine.triggerDrum('kick');
rhythmEngine.triggerDrum('snare', undefined, 0.8); // with velocity

// Get available styles
const styles = rhythmEngine.getAvailableStyles();
// Returns: { drums: [...], bass: [...] }
```

## Integration Notes

### With Tone.js Transport
The rhythm engine uses `Tone.Transport` for timing:
- Automatically syncs with existing Tone.js code
- Respects BPM changes via `Tone.Transport.bpm.value`
- Uses looping Parts for seamless playback

### With Chord Progressions
Bass generation uses the Tonal library to:
- Extract chord roots and intervals
- Transpose notes to bass register (-8P)
- Create walking patterns with chromatic approaches
- Handle complex chord symbols (maj7, m7, etc.)

### Memory Management
- All Tone.js Parts are tracked in `currentParts` array
- `stop()` disposes of all parts to prevent memory leaks
- Samplers persist across playback for efficiency

## Troubleshooting

### No Sound
- Ensure audio context started (browser may require user interaction)
- Check if `rhythmEngine.initialized` is `true`
- Verify `Tone.Transport` is started

### Playback Issues
- Call `rhythmEngine.stop()` before starting new playback
- Check browser console for errors
- Ensure chord progression is valid

### Performance
- Rhythm engine is lightweight (~500 lines)
- Uses native Tone.js synthesizers (no samples to load)
- All processing happens in Web Audio API

## Future Enhancements

Potential additions:
- [ ] Custom pattern editor
- [ ] Velocity/dynamics control per hit
- [ ] Swing/humanization settings
- [ ] More percussion instruments (cowbell, tambourine, etc.)
- [ ] MIDI export of generated patterns
- [ ] Pattern variation generator
- [ ] Integration with Magenta.js for AI-generated patterns

## Credits

Built with:
- **Tone.js** - Web Audio framework
- **Tonal** - Music theory library
- Inspired by Scribbletune's pattern syntax

## Support

For issues or questions:
- Check browser console for errors
- Ensure modern browser with Web Audio support
- Verify Tone.js is loaded (check `window.Tone`)

---

**Version**: 1.0.0
**Last Updated**: 2026-01-19
**Compatible With**: Music Machine v2.0+
