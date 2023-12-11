const { ipcRenderer } = require("electron");

let inpUrl = document.getElementById("url");
let inpDb = document.getElementById("db");
let inpUser = document.getElementById("user");
let inpPassword = document.getElementById("password");
let inpSeccion = document.getElementById("up/down")

let btnSave = document.getElementById("btnSave");

btnSave.addEventListener("click", () => {
    ipcRenderer.send("config:save", {
        url: inpUrl.value,
        db: inpDb.value,
        user: inpUser.value,
        password: inpPassword.value
    });
})

window.onload = () => {
    ipcRenderer.invoke("config:get").then((config) => {
        inpUrl.value = config.server.url;
        inpDb.value = config.server.db;
        inpUser.value = config.server.user;
        inpPassword.value = config.server.password
        inpSeccion.value = config.seccion

    })
}