"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onLfgButton = exports.extractLFG = exports.createLFG = void 0;
const discord_js_1 = require("discord.js");
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
            if (completedCategories.includes(category.title.toLowerCase()))
                continue;
            completedCategories.push(category.title.toLowerCase());
            let categoryValue = '';
            category.users.forEach((val) => (categoryValue += `<@${val}>\n`));
            if (categoryValue === '')
                categoryValue = 'N/A';
            let formattedLabel = category.title
                .toLowerCase()
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
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
        let lfgCat = {
            title: name,
            users: [],
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
const onLfgButton = async (i) => {
    const isLeave = i.customId.startsWith('lfg-leave-button');
    const joined = isLeave ? null : i.customId.substring('lfg-button-'.length);
    const embed = i.message.embeds[0];
    let lfgData = (0, exports.extractLFG)(embed);
    if (!lfgData.categories)
        return;
    console.log(lfgData.categories);
    lfgData.categories.forEach((v) => {
        v.users = v.users.filter((v) => {
            console.log(`[${i.user.id}]`, `[${v}]`, v == i.user.id);
            return v != i.user.id;
        });
        console.log(v.title, v.users);
        if (v.title.toLowerCase() === joined)
            v.users.push(i.user.id);
    });
    let createdLFG = (0, exports.createLFG)(lfgData);
    await i.update({ embeds: createdLFG.embeds });
};
exports.onLfgButton = onLfgButton;
