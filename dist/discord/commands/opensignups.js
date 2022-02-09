"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LFG_1 = require("../structures/LFG");
exports.default = {
    tag: 'opensignups',
    alias: ['opensignup', 'open', 'os'],
    description: 'Open a signup in the current channel.',
    permission: {
        regularUser: false,
        custom: (_message) => true,
    },
    runMsg: (_message, _args) => {
        let lfg = (0, LFG_1.createLFG)({});
        console.log(lfg);
    },
};
