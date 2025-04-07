/**
 * The preload script runs before `index.html` is loaded
 * in the renderer. It has access to web APIs as well as
 * Electron's renderer process modules and some polyfilled
 * Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 * // Welcome to qq group: 1030115250
 */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  navigateTo: (path) => ipcRenderer.send('navigate-to', path),

  readAppIni: () => ipcRenderer.invoke('read-app-ini'),
  writeAppIni: (config) => ipcRenderer.invoke('write-app-ini', config),
  clearAppIni: () => ipcRenderer.invoke('clear-app-ini'),
  saveFile: (content) => ipcRenderer.invoke('save-file', content),
  calculateCRC64: (input) => ipcRenderer.invoke('calculate-crc64', input),
  
  sendEncryptRequest: () => ipcRenderer.invoke('sendEncryptRequest'),
  login: (username, password) => ipcRenderer.invoke('login', username, password),
  changepassword: (username, newpassword, safepassword) => ipcRenderer.invoke('changepassword', username, newpassword, safepassword),
  genKeyCards: ( num, type) => ipcRenderer.invoke('genKeyCards',  num, type),
  manageUsers: (operations) => ipcRenderer.invoke('manageUsers', operations),
  queryGenKeyCards: (begin, end) => ipcRenderer.invoke('queryGenKeyCards',  begin, end),
  queryActivateKeyCards: (begin, end) => ipcRenderer.invoke('queryActivateKeyCards', begin, end),
})

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
