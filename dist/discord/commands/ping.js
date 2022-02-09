"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    tag: 'ping',
    description: 'Command to check if the bot is currently working correctly.',
    runMsg: (args) => {
        console.log(args);
    },
};
