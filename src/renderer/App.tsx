import React, { useState, useEffect, useCallback } from 'react';
import { Project, TransportState } from './types';
import { MusicTheoryEngine } from './services/MusicTheoryEngine';
import { AudioEngine } from './services/AudioEngine';
import { ProjectManager } from './services/ProjectManager';
import MainLayout from './components/MainLayout';

const defaultProject: Project = {
  version: '1.0',
  metadata: {
    title: 'Untitled Project',
    key: 'C',
    tempo: 120,
    timeSignature: '4/4',
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
  sections: [
    {
      id: 'intro',
      name: 'Intro',
      bars: 4,
      chords: ['C', 'F', 'G', 'C'],
      repeat: 1
    }
  ],
  tracks: [
    {
      id: 'drums',
      name: 'Drums',
      instrument: 'kit_rock',
      patterns: [],
      automation: {},
      muted: false,
      solo: false,
      volume: 0.8,
      pan: 0
    },
    {
      id: 'bass',
      name: 'Bass',
      instrument: 'electric_bass',
      patterns: [],
      automation: {},
      muted: false,
      solo: false,
      volume: 0.7,
      pan: 0
    },
    {
      id: 'piano',
      name: 'Piano',
      instrument: 'acoustic_piano',
      patterns: [],
      automation: {},
      muted: false,
      solo: false,
      volume: 0.6,
      pan: 0
    }
  ],
  mixerState: {},
  projectSettings: {}
};

const App: React.FC = () => {
  const [project, setProject] = useState<Project>(defaultProject);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('intro');
  const [transportState, setTransportState] = useState<TransportState>({
    isPlaying: false,
    currentPosition: 0,
    isLooping: false,
    loopStart: 0,
    loopEnd: 16
  });

  const musicTheory = new MusicTheoryEngine();
  const audioEngine = new AudioEngine();
  const projectManager = new ProjectManager();

  useEffect(() => {
    audioEngine.initialize();

    const handleMenuAction = (action: string, data?: any) => {
      switch (action) {
        case 'menu-new-project':
          handleNewProject();
          break;
        case 'menu-open-project':
          if (data) {
            handleOpenProject(data);
          } else {
            handleOpenProject();
          }
          break;
        case 'menu-save-project':
          handleSaveProject();
          break;
        case 'menu-save-as-project':
          handleSaveAsProject();
          break;
        case 'menu-export-ableton':
          handleExportAbleton();
          break;
        case 'transport-play-pause':
          handlePlayPause();
          break;
        case 'transport-stop':
          handleStop();
          break;
        case 'transport-beginning':
          handleGoToBeginning();
          break;
      }
    };

    if (window.electronAPI) {
      window.electronAPI.onMenuAction(handleMenuAction);
    }

    return () => {
      if (window.electronAPI) {
        window.electronAPI.removeMenuListener();
      }
      audioEngine.dispose();
    };
  }, []);

  const updateProject = useCallback((updates: Partial<Project>) => {
    setProject(prev => ({
      ...prev,
      ...updates,
      metadata: {
        ...prev.metadata,
        ...updates.metadata,
        modified: new Date().toISOString()
      }
    }));
    setIsDirty(true);
  }, []);

  const handleNewProject = useCallback(() => {
    setProject(defaultProject);
    setCurrentFilePath(null);
    setIsDirty(false);
    setSelectedSectionId('intro');
  }, []);

  const handleOpenProject = useCallback(async (filePath?: string) => {
    try {
      const result = await window.electronAPI?.loadProject(filePath);
      if (result) {
        setProject(result.data);
        setCurrentFilePath(result.filePath);
        setIsDirty(false);
        if (result.data.sections.length > 0) {
          setSelectedSectionId(result.data.sections[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to open project:', error);
    }
  }, []);

  const handleSaveProject = useCallback(async () => {
    try {
      const filePath = await window.electronAPI?.saveProject(project, currentFilePath || undefined);
      if (filePath) {
        setCurrentFilePath(filePath);
        setIsDirty(false);
      }
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  }, [project, currentFilePath]);

  const handleSaveAsProject = useCallback(async () => {
    try {
      const filePath = await window.electronAPI?.saveProject(project);
      if (filePath) {
        setCurrentFilePath(filePath);
        setIsDirty(false);
      }
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  }, [project]);

  const handleExportAbleton = useCallback(async () => {
    try {
      const exportData = projectManager.generateAbletonExport(project);
      const filePath = await window.electronAPI?.exportAbleton(exportData);
      if (filePath) {
        console.log('Exported to:', filePath);
      }
    } catch (error) {
      console.error('Failed to export to Ableton:', error);
    }
  }, [project, projectManager]);

  const handlePlayPause = useCallback(() => {
    if (transportState.isPlaying) {
      audioEngine.pause();
    } else {
      audioEngine.play(project);
    }
    setTransportState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, [transportState.isPlaying, project, audioEngine]);

  const handleStop = useCallback(() => {
    audioEngine.stop();
    setTransportState(prev => ({
      ...prev,
      isPlaying: false,
      currentPosition: 0
    }));
  }, [audioEngine]);

  const handleGoToBeginning = useCallback(() => {
    audioEngine.seekTo(0);
    setTransportState(prev => ({ ...prev, currentPosition: 0 }));
  }, [audioEngine]);

  const handleKeyChange = useCallback((key: string) => {
    updateProject({
      metadata: { ...project.metadata, key }
    });
  }, [project.metadata, updateProject]);

  const handleTempoChange = useCallback((tempo: number) => {
    updateProject({
      metadata: { ...project.metadata, tempo }
    });
    audioEngine.setTempo(tempo);
  }, [project.metadata, updateProject, audioEngine]);

  return (
    <MainLayout
      project={project}
      updateProject={updateProject}
      selectedSectionId={selectedSectionId}
      onSectionSelect={setSelectedSectionId}
      transportState={transportState}
      onPlayPause={handlePlayPause}
      onStop={handleStop}
      onGoToBeginning={handleGoToBeginning}
      onKeyChange={handleKeyChange}
      onTempoChange={handleTempoChange}
      musicTheory={musicTheory}
      audioEngine={audioEngine}
      projectManager={projectManager}
      isDirty={isDirty}
      currentFilePath={currentFilePath}
    />
  );
};

export default App;