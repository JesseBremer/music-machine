import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Project, ProjectSection, ProjectTrack, TransportState, PatternStyle } from '../types';
import { PatternGenerator } from '../services/PatternGenerator';
import { AudioEngine } from '../services/AudioEngine';

interface ArrangementTimelineProps {
  project: Project;
  selectedSectionId: string;
  transportState: TransportState;
  onTrackUpdate: (trackId: string, updates: Partial<ProjectTrack>) => void;
  onSectionSelect: (sectionId: string) => void;
  audioEngine: AudioEngine;
  patternGenerator: PatternGenerator;
}

interface TrackPattern {
  trackId: string;
  sectionId: string;
  hasContent: boolean;
  intensity: number;
}

const ArrangementTimeline: React.FC<ArrangementTimelineProps> = ({
  project,
  selectedSectionId,
  transportState,
  onTrackUpdate,
  onSectionSelect,
  audioEngine,
  patternGenerator
}) => {
  const [trackPatterns, setTrackPatterns] = useState<Map<string, TrackPattern>>(new Map());
  const [zoom, setZoom] = useState(1);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    trackId: string | null;
    sectionId: string | null;
  }>({ isDragging: false, trackId: null, sectionId: null });

  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);

  const totalDuration = project.sections.reduce((total, section) => {
    return total + (section.bars * section.repeat);
  }, 0);

  const beatsPerPixel = totalDuration / (800 * zoom);

  useEffect(() => {
    const interval = setInterval(() => {
      if (transportState.isPlaying && playheadRef.current) {
        const position = transportState.currentPosition;
        const pixelPosition = position / beatsPerPixel;
        playheadRef.current.style.left = `${pixelPosition}px`;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [transportState.isPlaying, transportState.currentPosition, beatsPerPixel]);

  const generatePattern = useCallback(async (trackId: string, sectionId: string) => {
    const track = project.tracks.find(t => t.id === trackId);
    const section = project.sections.find(s => s.id === sectionId);

    if (!track || !section) return;

    const style: PatternStyle = {
      name: 'auto',
      complexity: 0.5,
      swing: 0,
      humanization: 0.3,
      genre: 'pop'
    };

    const instrumentType = track.instrument.includes('drum') ? 'drums' :
                         track.instrument.includes('bass') ? 'bass' :
                         track.instrument.includes('piano') ? 'piano' :
                         track.instrument.includes('guitar') ? 'guitar' : 'synth';

    const pattern = patternGenerator.generatePattern(
      instrumentType as any,
      style,
      section.chords,
      section.bars
    );

    const updatedPatterns = [...track.patterns];
    const existingIndex = updatedPatterns.findIndex(p => p.name.includes(section.name));

    if (existingIndex >= 0) {
      updatedPatterns[existingIndex] = pattern;
    } else {
      updatedPatterns.push(pattern);
    }

    onTrackUpdate(trackId, { patterns: updatedPatterns });

    setTrackPatterns(prev => new Map(prev.set(`${trackId}-${sectionId}`, {
      trackId,
      sectionId,
      hasContent: true,
      intensity: 0.7
    })));
  }, [project.tracks, project.sections, patternGenerator, onTrackUpdate]);

  const clearPattern = useCallback((trackId: string, sectionId: string) => {
    const track = project.tracks.find(t => t.id === trackId);
    const section = project.sections.find(s => s.id === sectionId);

    if (!track || !section) return;

    const updatedPatterns = track.patterns.filter(p => !p.name.includes(section.name));
    onTrackUpdate(trackId, { patterns: updatedPatterns });

    setTrackPatterns(prev => {
      const newMap = new Map(prev);
      newMap.delete(`${trackId}-${sectionId}`);
      return newMap;
    });
  }, [project.tracks, project.sections, onTrackUpdate]);

  const handleTrackMute = useCallback((trackId: string) => {
    const track = project.tracks.find(t => t.id === trackId);
    if (!track) return;

    onTrackUpdate(trackId, { muted: !track.muted });
    audioEngine.setTrackMute(trackId, !track.muted);
  }, [project.tracks, onTrackUpdate, audioEngine]);

  const handleTrackSolo = useCallback((trackId: string) => {
    const track = project.tracks.find(t => t.id === trackId);
    if (!track) return;

    onTrackUpdate(trackId, { solo: !track.solo });
    audioEngine.setTrackSolo(trackId, !track.solo);
  }, [project.tracks, onTrackUpdate, audioEngine]);

  const handleTrackVolumeChange = useCallback((trackId: string, volume: number) => {
    onTrackUpdate(trackId, { volume });
    audioEngine.setTrackVolume(trackId, volume);
  }, [onTrackUpdate, audioEngine]);

  const handleCellClick = useCallback((trackId: string, sectionId: string) => {
    const patternKey = `${trackId}-${sectionId}`;
    const hasPattern = trackPatterns.has(patternKey);

    if (hasPattern) {
      clearPattern(trackId, sectionId);
    } else {
      generatePattern(trackId, sectionId);
    }
  }, [trackPatterns, generatePattern, clearPattern]);

  const handleCellDragStart = useCallback((trackId: string, sectionId: string) => {
    setDragState({
      isDragging: true,
      trackId,
      sectionId
    });
  }, []);

  const handleCellDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      trackId: null,
      sectionId: null
    });
  }, []);

  const getSectionPosition = useCallback((section: ProjectSection, index: number): { left: number; width: number } => {
    const prevSections = project.sections.slice(0, index);
    const startBeat = prevSections.reduce((total, s) => total + (s.bars * s.repeat), 0);
    const sectionBars = section.bars * section.repeat;

    return {
      left: (startBeat / beatsPerPixel),
      width: (sectionBars / beatsPerPixel)
    };
  }, [project.sections, beatsPerPixel]);

  const renderTimelineHeader = () => (
    <div className="timeline-header">
      <div className="timeline-sections">
        {project.sections.map((section, index) => {
          const { left, width } = getSectionPosition(section, index);
          const isSelected = section.id === selectedSectionId;

          return (
            <div
              key={section.id}
              className={`section-header ${isSelected ? 'selected' : ''}`}
              style={{ left: `${left}px`, width: `${width}px` }}
              onClick={() => onSectionSelect(section.id)}
            >
              <span className="section-name">{section.name}</span>
              <span className="section-info">{section.bars}×{section.repeat}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTrackLane = (track: ProjectTrack) => (
    <div key={track.id} className="track-lane">
      <div className="track-header">
        <div className="track-name">{track.name}</div>
        <div className="track-controls">
          <button
            className={`track-control ${track.muted ? 'active' : ''}`}
            onClick={() => handleTrackMute(track.id)}
            title="Mute"
          >
            M
          </button>
          <button
            className={`track-control ${track.solo ? 'active' : ''}`}
            onClick={() => handleTrackSolo(track.id)}
            title="Solo"
          >
            S
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={track.volume}
            onChange={(e) => handleTrackVolumeChange(track.id, parseFloat(e.target.value))}
            className="volume-slider"
            title="Volume"
          />
        </div>
      </div>

      <div className="track-content">
        {project.sections.map((section, index) => {
          const { left, width } = getSectionPosition(section, index);
          const patternKey = `${track.id}-${section.id}`;
          const hasPattern = trackPatterns.has(patternKey);
          const intensity = trackPatterns.get(patternKey)?.intensity || 0;

          return (
            <div
              key={`${track.id}-${section.id}`}
              className={`pattern-cell ${hasPattern ? 'has-pattern' : 'empty'}`}
              style={{
                left: `${left}px`,
                width: `${width}px`,
                background: hasPattern
                  ? `linear-gradient(90deg, rgba(0, 102, 204, ${intensity}) 0%, rgba(0, 102, 204, ${intensity * 0.5}) 100%)`
                  : 'transparent'
              }}
              onClick={() => handleCellClick(track.id, section.id)}
              onMouseDown={() => handleCellDragStart(track.id, section.id)}
              onMouseUp={handleCellDragEnd}
            >
              {hasPattern && (
                <div className="pattern-indicator">
                  <div className="pattern-bars">
                    {Array.from({ length: section.bars }).map((_, i) => (
                      <div key={i} className="pattern-bar" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="arrangement-timeline">
      <div className="timeline-controls">
        <div className="zoom-controls">
          <button onClick={() => setZoom(prev => Math.max(0.25, prev - 0.25))}>−</button>
          <span>Zoom: {(zoom * 100).toFixed(0)}%</span>
          <button onClick={() => setZoom(prev => Math.min(4, prev + 0.25))}>+</button>
        </div>

        <div className="arrangement-actions">
          <button
            onClick={() => {
              project.tracks.forEach(track => {
                project.sections.forEach(section => {
                  generatePattern(track.id, section.id);
                });
              });
            }}
          >
            Generate All
          </button>

          <button
            onClick={() => {
              setTrackPatterns(new Map());
              project.tracks.forEach(track => {
                onTrackUpdate(track.id, { patterns: [] });
              });
            }}
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="timeline-container" ref={timelineRef}>
        {renderTimelineHeader()}

        <div className="timeline-content">
          <div
            ref={playheadRef}
            className="timeline-bar"
            style={{ left: '0px' }}
          />

          <div className="track-lanes">
            {project.tracks.map(renderTrackLane)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrangementTimeline;