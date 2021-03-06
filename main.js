// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  Menu
} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 598,
    height: 685,
    useContentSize: true
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({
      label: app.getName(),
      submenu: [{
          role: 'about',
          accelerator: 'Command+A'
        },
        {
          type: 'separator'
        },
        {
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          role: 'hide'
        },
        {
          role: 'hideothers'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    });
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenuTemplate));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }

  app.quit();
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// Main menu template

let mainMenuTemplate = [{
  label: 'Fichier',
  submenu: [{
    label: 'Recommencer',
    accelerator: process.platform == 'darwin' ? 'Command+R' : 'Ctrl+R',
    click() {
      mainWindow.webContents.send('restart');
    }
  },
  {
    label: 'Quitter',
    accelerator: process.platform == 'darwin' ? 'Command+R' : 'Alt+F4',
    click() {
      app.quit();
    }
  }]
}];