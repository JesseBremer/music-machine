import React, { useState, useCallback } from 'react';
import { Project, ProjectSection, TransportState } from '../types';
import { MusicTheoryEngine } from '../services/MusicTheoryEngine';
import { AudioEngine } from '../services/AudioEngine';
import { ProjectManager } from '../services/ProjectManager';
import { PatternGenerator } from '../services/PatternGenerator';
import ChordProgressionEditor from './ChordProgressionEditor';
import ArrangementTimeline from './ArrangementTimeline';
import SectionList from './SectionList';
import TransportControls from './TransportControls';
import ProjectToolbar from './ProjectToolbar';

interface MainLayoutProps {
  project: Project;
  updateProject: (updates: Partial<Project>) => void;
  selectedSectionId: string;
  onSectionSelect: (sectionId: string) => void;
  transportState: TransportState;
  onPlayPause: () => void;
  onStop: () => void;
  onGoToBeginning: () => void;
  onKeyChange: (key: string) => void;
  onTempoChange: (tempo: number) => void;
  musicTheory: MusicTheoryEngine;
  audioEngine: AudioEngine;
  projectManager: ProjectManager;
  isDirty: boolean;
  currentFilePath: string | null;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  project,
  updateProject,
  selectedSectionId,
  onSectionSelect,
  transportState,
  onPlayPause,
  onStop,
  onGoToBeginning,
  onKeyChange,
  onTempoChange,
  musicTheory,
  audioEngine,
  projectManager,
  isDirty,
  currentFilePath
}) => {
  const [patternGenerator] = useState(() => new PatternGenerator());

  const selectedSection = project.sections.find(s => s.id === selectedSectionId);

  const handleSectionUpdate = useCallback((updates: Partial<ProjectSection>) => {
    if (!selectedSection) return;

    const updatedSections = project.sections.map(section =>
      section.id === selectedSectionId ? { ...section, ...updates } : section
    );

    updateProject({ sections: updatedSections });
  }, [project.sections, selectedSectionId, selectedSection, updateProject]);

  const handleSectionAdd = useCallback(() => {
    const newSection: ProjectSection = {
      id: `section_${Date.now()}`,
      name: `Section ${project.sections.length + 1}`,
      bars: 8,
      chords: ['C', 'Am', 'F', 'G'],
      repeat: 1
    };

    updateProject({
      sections: [...project.sections, newSection]
    });

    onSectionSelect(newSection.id);
  }, [project.sections, updateProject, onSectionSelect]);

  const handleSectionRemove = useCallback((sectionId: string) => {
    if (project.sections.length <= 1) return;

    const updatedSections = project.sections.filter(s => s.id !== sectionId);
    updateProject({ sections: updatedSections });

    if (sectionId === selectedSectionId && updatedSections.length > 0) {
      onSectionSelect(updatedSections[0].id);
    }
  }, [project.sections, selectedSectionId, updateProject, onSectionSelect]);

  const handleSectionDuplicate = useCallback((sectionId: string) => {
    const duplicatedSection = projectManager.duplicateSection(project, sectionId);
    if (duplicatedSection) {
      updateProject({
        sections: [...project.sections, duplicatedSection]
      });
    }
  }, [project, projectManager, updateProject]);

  const handleTrackUpdate = useCallback((trackId: string, updates: Partial<any>) => {
    const updatedTracks = project.tracks.map(track =>
      track.id === trackId ? { ...track, ...updates } : track
    );

    updateProject({ tracks: updatedTracks });
  }, [project.tracks, updateProject]);

  const handleChordPlay = useCallback(async (chord: string) => {
    const chordData = musicTheory.parseChord(chord);
    if (chordData && chordData.notes.length > 0) {
      const pianoTrack = project.tracks.find(t => t.instrument.includes('piano'));
      if (pianoTrack) {
        const pitches = chordData.notes.map(note => {
          const noteMap: { [key: string]: number } = {
            'C': 60, 'C#': 61, 'D': 62, 'D#': 63, 'E': 64, 'F': 65,
            'F#': 66, 'G': 67, 'G#': 68, 'A': 69, 'A#': 70, 'B': 71
          };
          return noteMap[note] || 60;
        });

        audioEngine.playChord(pianoTrack.id, pitches, 80, 1);
      }
    }
  }, [musicTheory, project.tracks, audioEngine]);

  return (
    <div className="main-layout">
      <ProjectToolbar
        project={project}
        isDirty={isDirty}
        currentFilePath={currentFilePath}
        onKeyChange={onKeyChange}
        onTempoChange={onTempoChange}
      />

      <div className="main-content">
        <div className="left-panel">
          <SectionList
            sections={project.sections}
            selectedSectionId={selectedSectionId}
            onSectionSelect={onSectionSelect}
            onSectionAdd={handleSectionAdd}
            onSectionRemove={handleSectionRemove}
            onSectionDuplicate={handleSectionDuplicate}
          />
        </div>

        <div className="center-panel">
          <div className="chord-section">
            {selectedSection && (
              <ChordProgressionEditor
                section={selectedSection}
                projectKey={project.metadata.key}
                onSectionUpdate={handleSectionUpdate}
                musicTheory={musicTheory}
                onChordPlay={handleChordPlay}
              />
            )}
          </div>

          <div className="arrangement-section">
            <ArrangementTimeline
              project={project}
              selectedSectionId={selectedSectionId}
              transportState={transportState}
              onTrackUpdate={handleTrackUpdate}
              onSectionSelect={onSectionSelect}
              audioEngine={audioEngine}
              patternGenerator={patternGenerator}
            />
          </div>
        </div>
      </div>

      <TransportControls
        transportState={transportState}
        onPlayPause={onPlayPause}
        onStop={onStop}
        onGoToBeginning={onGoToBeginning}
        tempo={project.metadata.tempo}
        onTempoChange={onTempoChange}
      />
    </div>
  );
};

export default MainLayout;