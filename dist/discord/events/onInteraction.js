"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LFG_1 = require("../structures/LFG");
const onInteractButton = (i) => {
    console.log(i.customId);
    let customId = i.customId;
    if (customId.startsWith('lfg-button') || customId.startsWith('lfg-leave-button'))
        (0, LFG_1.onLfgButton)(i);
};
exports.default = {
    tag: 'interactionCreate',
    run: async (i) => {
        console.log('Here.');
        if (i.isButton())
            onInteractButton(i);
    },
};
