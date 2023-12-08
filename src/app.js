const { app, BrowserWindow, dialog, Menu } = require("electron");
const path = require("path");

const view_path = (view_name) => path.resolve(__dirname, "views", view_name);
const preload_path = (preload_name)=>path.resolve(__dirname,"preloads",preload_name)
// Windows
var mainWindow = null;

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
      label: "Developer",
      accelerator: "Ctrl+Shift+I",
      click: () => {
        mainWindow.webContents.toggleDevTools();
      },
    },
  ];
  return template;
}

function createWindow(
  title = "biblioteca",
  width = 1200,
  height = 800,
  view_name = "index.html",
  preload = "index.js"
) {
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

  return win;
}

app.whenReady().then(() => {
  mainWindow = createWindow();

  const menu = Menu.buildFromTemplate(createMenu());
  Menu.setApplicationMenu(menu);
});
