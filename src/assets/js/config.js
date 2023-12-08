const { ipcRenderer } = require("electron");

let inpUrl = document.getElementById("url");
let inpDb = document.getElementById("db");
let inpUser = document.getElementById("user");
let inpPassword = document.getElementById("password");

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
    ipcRenderer.invoke("config:get").then(({ server }) => {
        inpUrl.value = server.url;
        inpDb.value = server.db;
        inpUser.value = server.user;
        inpPassword.value = server.password

    })
}