"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VoteCount_1 = require("../structures/VoteCount");
exports.default = {
    tag: 'vote',
    developmentOnly: true,
    description: '[GAME] Vote a player.',
    permission: {
        regularUser: false,
        custom: (_message) => true,
    },
    slashPermissions: [
        {
            type: 'ROLE',
            id: '801534801320083496',
            permission: true,
        },
        {
            type: 'ROLE',
            id: '650834329257377796',
            permission: true,
        },
        {
            type: 'ROLE',
            id: '897910725467570178',
            permission: true,
        },
        {
            type: 'ROLE',
            id: '943131009338204161',
            permission: true,
        },
    ],
    options: [
        {
            name: 'target',
            description: 'Player you want to vote',
            type: 'USER',
            required: true,
        },
    ],
    runSlash: async (i) => {
        await i.deferReply();
        console.log('Hiya');
        const formattedVC = (0, VoteCount_1.createVoteCount)(VoteCount_1.ExampleVoteData, i.guild);
        i.editReply(formattedVC);
    },
    runMsg: async (message, _args) => {
        (0, VoteCount_1.createVoteCount)(VoteCount_1.ExampleVoteData, message.guild);
    },
};
