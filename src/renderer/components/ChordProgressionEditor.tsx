import React, { useState, useCallback, useEffect } from 'react';
import { ProjectSection } from '../types';
import { MusicTheoryEngine } from '../services/MusicTheoryEngine';

interface ChordProgressionEditorProps {
  section: ProjectSection;
  projectKey: string;
  onSectionUpdate: (updates: Partial<ProjectSection>) => void;
  musicTheory: MusicTheoryEngine;
  onChordPlay?: (chord: string) => void;
}

const ChordProgressionEditor: React.FC<ChordProgressionEditorProps> = ({
  section,
  projectKey,
  onSectionUpdate,
  musicTheory,
  onChordPlay
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [chordInput, setChordInput] = useState('');

  useEffect(() => {
    if (section.chords.length > 0) {
      const analysis = musicTheory.analyzeProgression(section.chords, projectKey);
      setSuggestions(analysis.suggestions);
    }
  }, [section.chords, projectKey, musicTheory]);

  const handleChordChange = useCallback((index: number, newChord: string) => {
    const newChords = [...section.chords];
    newChords[index] = newChord;
    onSectionUpdate({ chords: newChords });
  }, [section.chords, onSectionUpdate]);

  const handleAddChord = useCallback(() => {
    const newChords = [...section.chords, 'C'];
    onSectionUpdate({ chords: newChords });
  }, [section.chords, onSectionUpdate]);

  const handleRemoveChord = useCallback((index: number) => {
    if (section.chords.length <= 1) return;
    const newChords = section.chords.filter((_, i) => i !== index);
    onSectionUpdate({ chords: newChords });
  }, [section.chords, onSectionUpdate]);

  const handleChordClick = useCallback((chord: string, index: number) => {
    if (onChordPlay) {
      onChordPlay(chord);
    }
    setEditingIndex(index);
    setChordInput(chord);
  }, [onChordPlay]);

  const handleChordInputSubmit = useCallback(() => {
    if (editingIndex !== null && chordInput.trim()) {
      handleChordChange(editingIndex, chordInput.trim());
    }
    setEditingIndex(null);
    setChordInput('');
  }, [editingIndex, chordInput, handleChordChange]);

  const handleChordInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleChordInputSubmit();
    } else if (e.key === 'Escape') {
      setEditingIndex(null);
      setChordInput('');
    }
  }, [handleChordInputSubmit]);

  const getRomanNumeral = useCallback((chord: string): string => {
    return musicTheory.chordToRoman(chord, projectKey);
  }, [musicTheory, projectKey]);

  const getChordSuggestions = useCallback((currentChord: string): string[] => {
    return musicTheory.suggestSubstitutions(currentChord, projectKey);
  }, [musicTheory, projectKey]);

  const handleSuggestionClick = useCallback((suggestion: string, index: number) => {
    handleChordChange(index, suggestion);
    setEditingIndex(null);
  }, [handleChordChange]);

  const generateProgression = useCallback((genre: string) => {
    const progressions = musicTheory.getChordProgressions(projectKey, genre);
    const progressionNames = Object.keys(progressions);

    if (progressionNames.length > 0) {
      const randomProgression = progressionNames[Math.floor(Math.random() * progressionNames.length)];
      const chords = progressions[randomProgression];
      onSectionUpdate({ chords });
    }
  }, [musicTheory, projectKey, onSectionUpdate]);

  return (
    <div className="chord-progression-editor">
      <div className="panel-header">
        Chord Progression - {section.name}
      </div>

      <div className="chord-grid">
        {section.chords.map((chord, index) => (
          <div key={index} className="chord-container">
            {editingIndex === index ? (
              <input
                type="text"
                value={chordInput}
                onChange={(e) => setChordInput(e.target.value)}
                onBlur={handleChordInputSubmit}
                onKeyDown={handleChordInputKeyDown}
                className="chord-input"
                autoFocus
              />
            ) : (
              <button
                className={`chord-button ${editingIndex === index ? 'editing' : ''}`}
                onClick={() => handleChordClick(chord, index)}
                onDoubleClick={() => handleChordClick(chord, index)}
              >
                <span className="chord-name">{chord}</span>
                <span className="chord-roman">{getRomanNumeral(chord)}</span>
              </button>
            )}

            {editingIndex === index && (
              <div className="chord-suggestions">
                {getChordSuggestions(chord).map((suggestion, i) => (
                  <button
                    key={i}
                    className="suggestion-button"
                    onClick={() => handleSuggestionClick(suggestion, index)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <button
              className="remove-chord-button"
              onClick={() => handleRemoveChord(index)}
              disabled={section.chords.length <= 1}
            >
              ×
            </button>
          </div>
        ))}

        <button className="add-chord-button" onClick={handleAddChord}>
          +
        </button>
      </div>

      <div className="progression-controls">
        <div className="genre-buttons">
          <span className="control-label">Generate:</span>
          {musicTheory.getAvailableGenres().map(genre => (
            <button
              key={genre}
              className="genre-button"
              onClick={() => generateProgression(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className="section-settings">
        <div className="setting-group">
          <label>Bars:</label>
          <input
            type="number"
            min="1"
            max="32"
            value={section.bars}
            onChange={(e) => onSectionUpdate({ bars: parseInt(e.target.value) || 4 })}
          />
        </div>

        <div className="setting-group">
          <label>Repeat:</label>
          <input
            type="number"
            min="1"
            max="8"
            value={section.repeat}
            onChange={(e) => onSectionUpdate({ repeat: parseInt(e.target.value) || 1 })}
          />
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions">
          <div className="panel-header">Suggestions:</div>
          {suggestions.map((suggestion, index) => (
            <div key={index} className="suggestion-item">
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChordProgressionEditor;