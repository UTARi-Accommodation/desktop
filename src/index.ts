import { shell, app, BrowserWindow } from 'electron';
import { is } from 'electron-util';

const createWindow = () => {
    const window = new BrowserWindow({
        simpleFullscreen: true,
        webPreferences: {},
    });

    const config = {
        prod: 'https://utari.netlify.app',
        dev: 'http://localhost:3000',
    } as const;

    window.maximize();
    window.setTitle('UTARi');

    const isDev = is.development;

    window.webContents.setWindowOpenHandler(({ url }) => {
        if ((isDev && url !== config.dev) || (!isDev && url !== config.prod)) {
            shell.openExternal(url);
        }
        return {
            action: 'deny',
        };
    });

    if (!isDev) {
        window.loadURL(config.prod);
    } else {
        window.loadURL(config.dev);
        window.webContents.openDevTools();
    }
};

app.whenReady()
    .then(() => {
        createWindow();
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            }
        });
    })
    .catch(console.error);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
