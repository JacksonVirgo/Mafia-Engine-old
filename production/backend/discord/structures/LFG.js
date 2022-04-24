"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LFGUpdate = exports.LFGUpdateButton = exports.extractLFG = exports.createLFG = exports.parseRequestedCategoryTitle = exports.IlllegalCharacters = void 0;
const discord_js_1 = require("discord.js");
const LookingForGroup_1 = __importDefault(require("../../database/discord/LookingForGroup"));
exports.IlllegalCharacters = '[]:/';
const parseRequestedCategoryTitle = (req) => {
    let title;
    let maximum;
    let split = req.split('[');
    title = split.shift()?.trim();
    let data = split.shift()?.split(']')[0];
    if (data) {
        if (data.includes('/')) {
            let strMax = data.split('/')[1];
            let tmpMax = parseInt(strMax.trim());
            if (!isNaN(tmpMax))
                maximum = tmpMax;
        }
    }
    if (!title)
        title = req;
    return { title, maximum };
};
exports.parseRequestedCategoryTitle = parseRequestedCategoryTitle;
const createLFG = (lfgData) => {
    let result = {};
    let embedData = {
        title: lfgData.title || 'Looking For Group',
        description: 'Interact with a button below to join a group, if there are no buttons notify staff.',
        fields: [],
        color: discord_js_1.Constants.Colors.BLURPLE,
        footer: {
            text: 'Mafia Engine LFG',
        },
        timestamp: new Date(),
    };
    const completedCategories = [];
    const actionRow = new discord_js_1.MessageActionRow();
    if (lfgData.categories)
        for (const category of lfgData.categories) {
            const { players, title, limit } = category;
            let parsedCategory = title.toLowerCase();
            let amount = players.length;
            let maximum = limit;
            if (completedCategories.includes(parsedCategory))
                continue;
            completedCategories.push(parsedCategory);
            let categoryValue = '';
            players.forEach((val) => (categoryValue += `<@${val}>\n`));
            if (categoryValue === '')
                categoryValue = 'N/A';
            let formattedLabel = category.title
                .toLowerCase()
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            if (amount)
                formattedLabel += ` [${amount}${maximum ? `/${maximum}` : ''}]`;
            embedData.fields?.push({
                name: formattedLabel,
                value: categoryValue,
                inline: true,
            });
            let button = new discord_js_1.MessageButton()
                .setCustomId(`lfg-button-${category.title}`)
                .setLabel(formattedLabel)
                .setStyle(actionRow.components.length === 0 ? 'PRIMARY' : 'SECONDARY');
            actionRow.addComponents(button);
        }
    let leaveButton = new discord_js_1.MessageButton().setCustomId('lfg-leave-button').setLabel('Leave').setStyle('DANGER');
    actionRow.addComponents(leaveButton);
    const embed = new discord_js_1.MessageEmbed(embedData);
    result.embeds = [embed];
    result.components = [actionRow];
    return result;
};
exports.createLFG = createLFG;
const extractLFG = (lfgData) => {
    let lfg = {
        title: lfgData.title || undefined,
        description: lfgData.description || undefined,
        categories: [],
    };
    for (const field of lfgData.fields) {
        const { name, value } = field;
        let parsed = (0, exports.parseRequestedCategoryTitle)(name);
        let lfgCat = {
            title: parsed.title,
            users: [],
            maximum: parsed.maximum,
        };
        let users = value.trim().split('\n');
        for (const user of users) {
            if (!user)
                continue;
            if (user.startsWith('<@') && user.endsWith('>')) {
                let newUser = user.slice(2, -1);
                if (newUser.startsWith('!'))
                    newUser = newUser.slice(1);
                lfgCat.users.push(user.slice(2, -1));
            }
        }
        lfg.categories?.push(lfgCat);
    }
    return lfg;
};
exports.extractLFG = extractLFG;
const LFGUpdateButton = async (i) => {
    const isLeave = i.customId.startsWith('lfg-leave-button');
    const joined = isLeave ? null : i.customId.substring('lfg-button-'.length);
    const update = {};
    if (isLeave)
        update.removedUsers = [i.user.id];
    else if (joined) {
        update.addedUsers = {};
        update.addedUsers[joined] = [i.user.id];
    }
    await (0, exports.LFGUpdate)(i.message, update, (data) => {
        i.update(data);
    });
};
exports.LFGUpdateButton = LFGUpdateButton;
const LFGUpdate = async (message, update, saveFunc = null) => {
    const embed = message.embeds[0];
    const guild = message.guild;
    const lfgData = (await LookingForGroup_1.default.findOne({ messageID: message.id }));
    if (!lfgData)
        return;
    if (!lfgData.categories)
        return;
    let allUpdatedUsers = update.removedUsers || [];
    if (update.addedUsers) {
        for (const key in update.addedUsers) {
            allUpdatedUsers = allUpdatedUsers.concat(update.addedUsers[key]);
        }
    }
    for (let i = 0; i < lfgData.categories.length; i++) {
        const v = lfgData.categories[i];
        for (let f = 0; f < v.users.length; f++) {
            let member = await guild?.members.fetch(v.users[f]);
            if (member) {
            }
        }
        v.users = v.users.filter((v2) => !allUpdatedUsers.includes(v2));
        if (update.addedUsers) {
            for (const joinedCategories in update.addedUsers) {
                if (v.title.toLowerCase() == joinedCategories.toLowerCase()) {
                    update.addedUsers[joinedCategories].forEach((user) => {
                        v.users.push(user);
                    });
                }
            }
        }
    }
    if (update.changedTitle)
        lfgData.title = update.changedTitle;
    if (update.changedDescription)
        lfgData.description = update.changedDescription;
    let createdLFG = (0, exports.createLFG)(lfgData);
    if (saveFunc)
        saveFunc({ embeds: createdLFG.embeds });
};
exports.LFGUpdate = LFGUpdate;
