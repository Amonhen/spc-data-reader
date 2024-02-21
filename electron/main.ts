import path from 'path'
import { app, BrowserWindow } from 'electron'
import {pathToFileURL} from "node:url";
//
// // The built directory structure
// //
// // ├─┬ dist-electron
// // │ ├─┬ main
// // │ │ └── index.js
// // │ ├─┬ preload
// // │ │ └── index.js
// // │ ├─┬ renderer
// // │ │ └── index.html
//
process.env.ROOT = path.join(__dirname, '..')
process.env.DIST = path.join(process.env.ROOT, 'dist-electron')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? path.join(process.env.ROOT, 'public')
    : path.join(process.env.ROOT, '.output/public')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// let win: BrowserWindow
const preload = path.join(process.env.DIST, 'preload.js')
//
// const modulePath = path.join(process.env.ROOT, '.output/server/index.mjs');
// const moduleUrl = pathToFileURL(modulePath).href;
//
// // let startServer: Function|undefined = undefined
//
// // import(moduleUrl).then((data)=> {
// //    startServer = data.default
// // });
//
// async function bootstrap() {
//    win = new BrowserWindow({
//       title: "SPC Data",
//       webPreferences: {
//          preload,
//          nodeIntegrationInWorker: true,
//          contextIsolation: false,
//          nodeIntegration: true,
//          webSecurity: false,
//       },
//    })
//
//    if (process.env.VITE_DEV_SERVER_URL) {
//      await win.loadURL(process.env.VITE_DEV_SERVER_URL)
//      win.webContents.openDevTools()
//    } else {
//      await win.loadFile(path.join(process.env.VITE_PUBLIC!, 'index.html'))
//    }
// }
//
// app.whenReady()
//     .then(()=> {
//        import(moduleUrl).then((data)=> {
//           data.default()
//           bootstrap().then()
//        });
//     })

// const { app, BrowserWindow } = require('electron')
// const path =  require('path')
// const { pathToFileURL } = require('url');

// /**
//  * PreConfigure
//  */
//
// // @ts-ignore
// process.env.ELECTRON_DEV == 1 ?
//     process.env.ROOT = path.resolve(__dirname, "../../") : //dev root folder
//     process.env.ROOT = path.join(process.resourcesPath) //production root folder


/**
 * Create function to run website in SSR
 */
const startWebServer = async () => {
    // @ts-ignore
    const modulePath = path.join(process.env.ROOT, '.output/server/index.mjs');
    const moduleUrl = pathToFileURL(modulePath).href;
    const { default: startServer } = await import(moduleUrl);

    if (typeof startServer === 'function') {
        startServer();
    }
}


/**
 * Create function to create window
 */
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            nodeIntegration: true,
            webSecurity: false,
        }
    })

    win.loadURL('http://localhost:3000')
}

/**
 * Create function when app is ready
 */
app.whenReady()
    .then(startWebServer)
    .then(createWindow)

/**
 * Close the app when all windows are closed
 */
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})