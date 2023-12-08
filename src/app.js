const { app, BrowserWindow, dialog, Menu, ipcMain } = require("electron");
const path = require("path");

const Store = require('electron-store');
const store = new Store();

var config = store.get("config")
try {

  console.log(config.server);

} catch (error) {
  store.set("config.server.url", "http://localhost:8069");
  store.set("config.server.db", "pucesd");
  store.set("config.server.user", "pruebas");
  store.set("config.server.password", "1234");
  config = store.get("config")

}


const view_path = (view_name) => path.resolve(__dirname, "views", view_name);


// Windows
var mainWindow = null;
var configWindow = null;
function createMenu() {
  const template = [
    {
      label: "Archivo",
      submenu: [
        { type: "separator" },
        {
          label: "Salir",
          accelerator: "Ctrl+Q",
          click: () => {
            dialog
              .showMessageBox(mainWindow, {
                message: "¿Está Seguro de que quiere Salir?",
                type: "question",
                title: "Saliendo....",
                buttons: ["No", "Sí"],
                noLink: true,
              })
              .then((result) => {
                if (result.response != 0) app.quit();
              });
          },
        },
      ],
    },
    {
      label: "Configuraciones",
      submenu: [
        {
          label: "Conexión",
          click: () => {
            createWindow({ view_name: "config.html", dev: true })
          }
        }
      ]
    },
    {
      label: "Developer",
      accelerator: "Ctrl+Shift+I",
      click: () => {
        mainWindow.webContents.toggleDevTools();
      },
    },
  ];
  return template;
}

function createWindow({
  title = "biblioteca",
  width = 1200,
  height = 800,
  view_name = "index.html",
  dev = false }) {
  const win = new BrowserWindow({
    title,
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile(view_path(view_name));
  if (dev) win.webContents.toggleDevTools()
  return win;
}

app.whenReady().then(() => {
  mainWindow = createWindow({});

  const menu = Menu.buildFromTemplate(createMenu());
  Menu.setApplicationMenu(menu);
});



ipcMain.on("config:save", (ev, data) => {
  dialog.showMessageBox(configWindow, {
    title: "Guardando...",
    message: "¿Está a punto de guardar la configuración actual, desea continuar?",
    noLink: true,
    buttons: ["Cancelar", "Aceptar"]
  }).then(res => {
    if (res.response != 0) {
      store.set("config.server", data);
      config.server = data;
    }
  })
});


ipcMain.handle("config:get", (ev, data) => {
  return config;
});