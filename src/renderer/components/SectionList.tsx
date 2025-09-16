import React from 'react';
import { ProjectSection } from '../types';

interface SectionListProps {
  sections: ProjectSection[];
  selectedSectionId: string;
  onSectionSelect: (sectionId: string) => void;
  onSectionAdd: () => void;
  onSectionRemove: (sectionId: string) => void;
  onSectionDuplicate: (sectionId: string) => void;
}

const SectionList: React.FC<SectionListProps> = ({
  sections,
  selectedSectionId,
  onSectionSelect,
  onSectionAdd,
  onSectionRemove,
  onSectionDuplicate
}) => {
  return (
    <div className="section-list panel">
      <div className="panel-header">SECTIONS</div>

      <div className="section-items">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`section-item ${section.id === selectedSectionId ? 'active' : ''}`}
            onClick={() => onSectionSelect(section.id)}
          >
            <div className="section-main">
              <span className="section-name">{section.name}</span>
              <span className="section-details">{section.bars}×{section.repeat}</span>
            </div>

            <div className="section-actions">
              <button
                className="section-action"
                onClick={(e) => {
                  e.stopPropagation();
                  onSectionDuplicate(section.id);
                }}
                title="Duplicate"
              >
                ⧉
              </button>
              <button
                className="section-action danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onSectionRemove(section.id);
                }}
                title="Remove"
                disabled={sections.length <= 1}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="add-section-button" onClick={onSectionAdd}>
        + Add Section
      </button>
    </div>
  );
};

export default SectionList;