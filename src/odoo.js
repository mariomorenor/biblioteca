const Store = require("electron-store")
const store = new Store();
const { default: axios } = require("axios");

var config = store.get("config");

try {

    console.log(config.server);

} catch (error) {
    store.set("config.server.url", "http://localhost:8069");
    store.set("config.server.db", "pucesd");
    store.set("config.server.user", "pruebas");
    store.set("config.server.password", "1234");
    store.set("config.user.uid", "");
    config = store.get("config")
}


async function json_rpc(url, method, params) {
    const data = {
        jsonrpc: "2.0",
        method,
        params,
        id: Math.floor(Math.random() * 1000000)
    }

    const res = await axios.post(url, data, { "Content-Type": "application/json" })
    return res.data.result
}

async function call(url, service, method, ...args) {
    return await json_rpc(url, "call", { service, method, args })
}

async function login() {
    config = store.get("config")
    const uid = await call(config.server.url, "common", "login", config.server.db, config.server.user, config.server.password);
    store.set("config.user.uid", uid);
}

class BaseModel {
    _name = "model.name"

    async search(domain, fields) {
        const result = await call(config.server.url, "object", "execute", config.server.db, config.user.uid, config.server.password, this._name, "search_read", domain, fields);
        return result
    }

    async create(data) {
        const result = await call(config.server.url, "object", "execute", config.server.db, config.user.uid, config.server.password, this._name, "create", data);
        return result
    }
}



module.exports.login = login;
module.exports.BaseModel = BaseModel