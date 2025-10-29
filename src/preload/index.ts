import electron, { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  selectImage: () => ipcRenderer.invoke('select-image'),
  selectFile: () => ipcRenderer.invoke('select-file'),
  selectFolder: () => electron.ipcRenderer.invoke('select-folder'),
  getFolderByPath: (targetPath: string) => ipcRenderer.invoke('get-folder', { targetPath }),
  getFileNameByPath: (targetPath: string) => ipcRenderer.invoke('get-file-name', { targetPath }),
  callService: (service: string, method: string, payload?: never) =>
    electron.ipcRenderer.invoke('application-call', { service, method, payload })
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
