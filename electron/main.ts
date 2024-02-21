import path from 'path'
import { app, BrowserWindow } from 'electron'
import electron from "electron";

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js
// │ ├─┬ preload
// │ │ └── index.js
// │ ├─┬ renderer
// │ │ └── index.html

process.env.ROOT = path.join(__dirname, '..')
process.env.DIST = path.join(process.env.ROOT, 'dist-electron')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? path.join(process.env.ROOT, 'public')
    : path.join(process.env.ROOT, '.output/public')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow
const preload = path.join(process.env.DIST, 'preload.js')

async function bootstrap() {
   const appDataDirPath: string = (electron.app || electron.remote.app).getPath('userData')
   console.log(appDataDirPath)
   process.env['APP_DATA'] = appDataDirPath
   win = new BrowserWindow({
      title: "SPC Data",
      webPreferences: {
         preload,
         nodeIntegrationInWorker: true,
         contextIsolation: false,
         nodeIntegration: true,
         webSecurity: false,
      },
   })



   if (process.env.VITE_DEV_SERVER_URL) {
     await win.loadURL(process.env.VITE_DEV_SERVER_URL)
     win.webContents.openDevTools()
   } else {
     await win.loadFile(path.join(process.env.VITE_PUBLIC!, 'index.html'))
   }
}

app.whenReady()
    .then(bootstrap)
