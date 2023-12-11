
const { BaseModel } = require("./odoo")

class User extends BaseModel {
    _name = "biblioteca.usuarios"
}

class Record extends BaseModel{
    _name = "biblioteca.ingresos"
}

module.exports.users = new User()
module.exports.records = new Record()