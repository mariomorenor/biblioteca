const { app, BrowserWindow, dialog, Menu, ipcMain } = require("electron");
const path = require("path");
const moment = require("moment")

const Store = require('electron-store');
const store = new Store();

const odoo = require("./odoo")

var config = store.get("config")

try {
  console.log(config.seccion);
} catch (error) {
  store.set("config.seccion", "planta_baja");
  config = store.get("config");
}

const view_path = (view_name) => path.resolve(__dirname, "views", view_name);


const models = require("./models");
const db = require("./db");

var users = [];
var records = []

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
      click: () => {
            configWindow = createWindow({ view_name: "config.html", width:800, height: 358});
            configWindow.setMenu(null);
      }
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

app.whenReady().then(async () => {
  mainWindow = createWindow({});
  mainWindow.maximize();
  mainWindow.on("close", () => {app.quit()});
  const menu = Menu.buildFromTemplate(createMenu());
  Menu.setApplicationMenu(menu);

  users = await models.users.search();
  records = await db.records.findAll();

  setInterval(sendRecordsOdoo, 5 * 1000);

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
      odoo.login();
    }
  })
});


ipcMain.handle("config:get", (ev, data) => {
  return config;
});

ipcMain.on("record:save", (ev, data) => {
  console.log(data);
  const user = users.filter(u => u.cedula == data.cedula)[0]

  db.records.create({
    name: user.nombres,
    last_name: user.apellidos,
    dni: user.cedula,
    email: user.email,
    date: moment().format("Y-MM-DD HH:mm:ss"),
    user_id: user.id,
    seccion: config.seccion
  });
});

async function sendRecordsOdoo() {


  let rec = await db.records.findAll({
    raw: true,
    attributes: ["id", ["user_id", "usuario_id"], "seccion", [db.sequelize.fn("STRFTIME", "%Y-%m-%d %H:%M:%S", db.sequelize.col("date")), "fecha"]
    ]
  })

  if (rec.length > 0) {
    models.records.create(rec)
      .then(id => {
        db.records.destroy({
          where: {
            id: rec.map(i => i.id)
          }
        })
      })
      .catch(err => {
        console.log("ocurrio un error bd");
      });
  }

}