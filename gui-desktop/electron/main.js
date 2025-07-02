import { app, BrowserWindow } from "electron"
import path from "path"

const WIN_WIDTH = 1000;
const WIN_HEIGHT = 800;

const createWindow = () => {
  const win = new BrowserWindow({
    width: WIN_WIDTH,
    height: WIN_HEIGHT,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    }

  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"))
  }


}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})


