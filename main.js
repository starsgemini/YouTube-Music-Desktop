const { app, BrowserWindow, globalShortcut, shell } = require('electron');
let mainWindow;
function sendKey(key) { mainWindow.webContents.send('media', key); }
const path = require('path');

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 800, height: 600,
        webPreferences: { nodeIntegration: true, preload: path.join(__dirname, 'renderer.js') },
    });
    mainWindow.loadURL('https://music.youtube.com/');

    // mainWindow.webContents.openDevTools();
    // mainWindow.webContents.on('will-navigate', (evt, url) => {
    //     if (!url.startsWith('https://music.youtube.com/')) {
    //         evt.preventDefault();
    //         shell.openExternal(url);
    //     }
    // });

    mainWindow.on('closed', () => { mainWindow = null; });
    setTimeout(() => {
        console.log('keys injected!');
        // media keys
        globalShortcut.register('MediaPreviousTrack', () => sendKey('previousTrack'));
        globalShortcut.register('MediaPlayPause', () => sendKey('playPause'));
        globalShortcut.register('MediaNextTrack', () => sendKey('nextTrack'));
    }, 3000);
}

app.on('ready', createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') { app.quit(); } });
app.on('activate', () => { if (mainWindow === null) { createWindow(); } });

