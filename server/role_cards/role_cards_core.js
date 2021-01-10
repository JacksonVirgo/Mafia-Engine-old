const lexer = require("./lexer");

class RoleCards {
    constructor() { 
        this.lexer = lexer;
    }
}

var instance = new RoleCards();
module.exports = instance;