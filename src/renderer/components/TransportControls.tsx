import React from 'react';
import { TransportState } from '../types';

interface TransportControlsProps {
  transportState: TransportState;
  onPlayPause: () => void;
  onStop: () => void;
  onGoToBeginning: () => void;
  tempo: number;
  onTempoChange: (tempo: number) => void;
}

const TransportControls: React.FC<TransportControlsProps> = ({
  transportState,
  onPlayPause,
  onStop,
  onGoToBeginning,
  tempo,
  onTempoChange
}) => {
  const formatPosition = (position: number): string => {
    const bars = Math.floor(position / 4) + 1;
    const beats = Math.floor(position % 4) + 1;
    return `${bars}.${beats}`;
  };

  return (
    <div className="transport-controls toolbar">
      <div className="transport-buttons">
        <button
          className="transport-button"
          onClick={onGoToBeginning}
          title="Go to Beginning"
        >
          ⏮
        </button>

        <button
          className={`transport-button ${transportState.isPlaying ? 'playing' : ''}`}
          onClick={onPlayPause}
          title={transportState.isPlaying ? 'Pause' : 'Play'}
        >
          {transportState.isPlaying ? '⏸' : '▶'}
        </button>

        <button
          className="transport-button"
          onClick={onStop}
          title="Stop"
        >
          ⏹
        </button>
      </div>

      <div className="transport-display">
        <span className="position-display">
          {formatPosition(transportState.currentPosition)}
        </span>

        <div className="loop-controls">
          <button
            className={`transport-button small ${transportState.isLooping ? 'active' : ''}`}
            title="Loop"
          >
            🔁
          </button>
        </div>
      </div>

      <div className="tempo-control">
        <label>BPM:</label>
        <input
          type="number"
          min="60"
          max="200"
          value={tempo}
          onChange={(e) => onTempoChange(parseInt(e.target.value) || 120)}
          className="tempo-input"
        />
      </div>
    </div>
  );
};

export default TransportControls;