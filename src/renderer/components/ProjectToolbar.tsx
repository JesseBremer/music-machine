import React from 'react';
import { Project } from '../types';

interface ProjectToolbarProps {
  project: Project;
  isDirty: boolean;
  currentFilePath: string | null;
  onKeyChange: (key: string) => void;
  onTempoChange: (tempo: number) => void;
}

const ProjectToolbar: React.FC<ProjectToolbarProps> = ({
  project,
  isDirty,
  currentFilePath,
  onKeyChange,
  onTempoChange
}) => {
  const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const getProjectName = (): string => {
    if (currentFilePath) {
      const fileName = currentFilePath.split('/').pop() || currentFilePath.split('\\').pop();
      return fileName?.replace('.sfp', '') || 'Untitled';
    }
    return project.metadata.title;
  };

  return (
    <div className="project-toolbar toolbar">
      <div className="project-info">
        <span className="project-name">
          {getProjectName()}
          {isDirty && ' •'}
        </span>
      </div>

      <div className="project-controls">
        <div className="control-group">
          <label>Key:</label>
          <select
            value={project.metadata.key}
            onChange={(e) => onKeyChange(e.target.value)}
            className="key-select"
          >
            {keys.map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Tempo:</label>
          <input
            type="number"
            min="60"
            max="200"
            value={project.metadata.tempo}
            onChange={(e) => onTempoChange(parseInt(e.target.value) || 120)}
            className="tempo-input"
          />
          <span>BPM</span>
        </div>

        <div className="control-group">
          <label>Time:</label>
          <select
            value={project.metadata.timeSignature}
            onChange={(e) => {
              // For now, we'll just display this - full implementation would update the project
              console.log('Time signature changed:', e.target.value);
            }}
            className="time-signature-select"
          >
            <option value="4/4">4/4</option>
            <option value="3/4">3/4</option>
            <option value="6/8">6/8</option>
            <option value="2/4">2/4</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProjectToolbar;