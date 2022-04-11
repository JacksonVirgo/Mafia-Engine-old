"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseInit = void 0;
const mongoose_1 = require("mongoose");
const __1 = require("../");
let db;
exports.default = () => db;
const databaseInit = async () => {
    if (!__1.Config.databaseUrl)
        return console.log('Database token not supplied');
    try {
        db = (await (0, mongoose_1.connect)(__1.Config.databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })).connection;
        if (db)
            console.log('Database Connected');
        else
            console.log('Database failed to connect.');
    }
    catch (err) {
        console.log('Database connection error', err);
    }
};
exports.databaseInit = databaseInit;
