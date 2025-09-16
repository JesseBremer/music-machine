import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  saveProject: (projectData: any, filePath?: string) => Promise<string | null>;
  loadProject: (filePath?: string) => Promise<{ data: any; filePath: string } | null>;
  exportAbleton: (exportData: any) => Promise<string | null>;

  onMenuAction: (callback: (action: string, data?: any) => void) => void;
  removeMenuListener: () => void;
}

const electronAPI: ElectronAPI = {
  saveProject: (projectData: any, filePath?: string) =>
    ipcRenderer.invoke('save-project', projectData, filePath),

  loadProject: (filePath?: string) =>
    ipcRenderer.invoke('load-project', filePath),

  exportAbleton: (exportData: any) =>
    ipcRenderer.invoke('export-ableton', exportData),

  onMenuAction: (callback: (action: string, data?: any) => void) => {
    const listeners = [
      'menu-new-project',
      'menu-open-project',
      'menu-save-project',
      'menu-save-as-project',
      'menu-export-ableton',
      'transport-play-pause',
      'transport-stop',
      'transport-beginning'
    ];

    listeners.forEach(action => {
      ipcRenderer.on(action, (_, data) => callback(action, data));
    });
  },

  removeMenuListener: () => {
    const listeners = [
      'menu-new-project',
      'menu-open-project',
      'menu-save-project',
      'menu-save-as-project',
      'menu-export-ableton',
      'transport-play-pause',
      'transport-stop',
      'transport-beginning'
    ];

    listeners.forEach(action => {
      ipcRenderer.removeAllListeners(action);
    });
  }
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);