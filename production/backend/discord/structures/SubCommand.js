"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubCmd = void 0;
const useSubCmd = (commands) => {
    let manager = {
        commands,
        run: (msg, args) => {
            let secondaryCommand = args.shift();
            if (secondaryCommand && commands[secondaryCommand]) {
                commands[secondaryCommand](msg, args);
            }
        },
    };
    return manager;
};
exports.useSubCmd = useSubCmd;
