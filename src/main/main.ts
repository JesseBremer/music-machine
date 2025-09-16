import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

class SongForgeApp {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    this.initializeApp();
  }

  private initializeApp(): void {
    app.whenReady().then(() => {
      this.createMainWindow();
      this.setupMenu();
      this.setupIPC();

      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createMainWindow();
        }
      });
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }

  private createMainWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1280,
      height: 720,
      minWidth: 1024,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
      titleBarStyle: 'hiddenInset',
      show: false,
    });

    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
      this.mainWindow.loadURL('http://localhost:3000');
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(path.join(__dirname, 'index.html'));
    }

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  private setupMenu(): void {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'File',
        submenu: [
          {
            label: 'New Project',
            accelerator: 'CmdOrCtrl+N',
            click: () => {
              this.mainWindow?.webContents.send('menu-new-project');
            }
          },
          {
            label: 'Open Project',
            accelerator: 'CmdOrCtrl+O',
            click: () => {
              this.openProject();
            }
          },
          {
            label: 'Save Project',
            accelerator: 'CmdOrCtrl+S',
            click: () => {
              this.mainWindow?.webContents.send('menu-save-project');
            }
          },
          {
            label: 'Save As...',
            accelerator: 'CmdOrCtrl+Shift+S',
            click: () => {
              this.mainWindow?.webContents.send('menu-save-as-project');
            }
          },
          { type: 'separator' },
          {
            label: 'Export to Ableton',
            accelerator: 'CmdOrCtrl+E',
            click: () => {
              this.mainWindow?.webContents.send('menu-export-ableton');
            }
          },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' }
        ]
      },
      {
        label: 'Transport',
        submenu: [
          {
            label: 'Play/Pause',
            accelerator: 'Space',
            click: () => {
              this.mainWindow?.webContents.send('transport-play-pause');
            }
          },
          {
            label: 'Stop',
            accelerator: 'Escape',
            click: () => {
              this.mainWindow?.webContents.send('transport-stop');
            }
          },
          {
            label: 'Go to Beginning',
            accelerator: 'Home',
            click: () => {
              this.mainWindow?.webContents.send('transport-beginning');
            }
          }
        ]
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  private setupIPC(): void {
    ipcMain.handle('save-project', async (_, projectData: any, filePath?: string) => {
      try {
        let savePath = filePath;

        if (!savePath) {
          const result = await dialog.showSaveDialog(this.mainWindow!, {
            defaultPath: 'untitled.sfp',
            filters: [
              { name: 'SongForge Projects', extensions: ['sfp'] },
              { name: 'All Files', extensions: ['*'] }
            ]
          });

          if (result.canceled) return null;
          savePath = result.filePath;
        }

        await fs.promises.writeFile(savePath!, JSON.stringify(projectData, null, 2));
        return savePath;
      } catch (error) {
        console.error('Error saving project:', error);
        throw error;
      }
    });

    ipcMain.handle('load-project', async (_, filePath?: string) => {
      try {
        let loadPath = filePath;

        if (!loadPath) {
          const result = await dialog.showOpenDialog(this.mainWindow!, {
            filters: [
              { name: 'SongForge Projects', extensions: ['sfp'] },
              { name: 'All Files', extensions: ['*'] }
            ],
            properties: ['openFile']
          });

          if (result.canceled) return null;
          loadPath = result.filePaths[0];
        }

        const data = await fs.promises.readFile(loadPath!, 'utf-8');
        return {
          data: JSON.parse(data),
          filePath: loadPath
        };
      } catch (error) {
        console.error('Error loading project:', error);
        throw error;
      }
    });

    ipcMain.handle('export-ableton', async (_, exportData: any) => {
      try {
        const result = await dialog.showSaveDialog(this.mainWindow!, {
          defaultPath: 'project.als',
          filters: [
            { name: 'Ableton Live Sets', extensions: ['als'] },
            { name: 'All Files', extensions: ['*'] }
          ]
        });

        if (result.canceled) return null;

        // For now, we'll export as JSON - later we'll implement proper ALS format
        await fs.promises.writeFile(result.filePath!, JSON.stringify(exportData, null, 2));
        return result.filePath;
      } catch (error) {
        console.error('Error exporting to Ableton:', error);
        throw error;
      }
    });
  }

  private async openProject(): Promise<void> {
    try {
      const result = await dialog.showOpenDialog(this.mainWindow!, {
        filters: [
          { name: 'SongForge Projects', extensions: ['sfp'] },
          { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
      });

      if (!result.canceled) {
        this.mainWindow?.webContents.send('menu-open-project', result.filePaths[0]);
      }
    } catch (error) {
      console.error('Error opening project:', error);
    }
  }
}

new SongForgeApp();