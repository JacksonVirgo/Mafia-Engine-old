const selectors = {
    comma: ',',
    colon: ':',
    settings: {
        players: ['playerList', 'players'],
        slots: ['slotList', 'slots', 'replacementlist', 'replacements'],
        alias: ['nicknameList', 'nicknames', 'alias', 'aliasList'],
        moderators: ['moderatorList', 'moderators', 'moderatorNames'],
        dead: ['deadList', 'dead', 'eliminated'],
        days: ['dayStartNumbers', 'dayStart', 'days'],
        deadline: ['deadline', 'timer'],
        prods: ['prodTimer', 'prod'],
        countdown: ['prods', 'timer', 'prodTimer', 'countdown'],
        pageData: ['pageData'],
        correctionWeight: ['correctionWeight, correction'],
        edash: ['edash', 'edashweight'],
        edashOnTop: ['edashOnTop'],
    },
};

function validSetting(sel, selRef) {
    return selRef.includes(sel);
}
function getSetting(sel) {
    for (const handle in selectors.settings) {
        const setting = selectors.settings[handle];
        if (validSetting(sel, setting)) {
            return { handle, request: sel, setting };
        }
    }
    return null;
}

// _____________ \\

const defaultSettings = {
    players: [],
    slots: {},
    alias: {},
    totalplayers: [],
    moderators: [],
    dead: [],
    deadPost: {},
    days: [],
    voteWeight: 1,
    edash: 2,
    edashOnTop: 1,
    correctionWeight: 0.85,
};

function parseSettings(settingsData) {
    console.log('Start Settings Parse');
    const settingsValue = defaultSettings;
    for (const handle in settingsData) {
        console.log('handle', handle);
        let setting = getSetting(handle);
        let data = settingsData[handle];

        if (setting) {
            switch (setting.handle) {
                case 'players':
                    console.log('here');
                    const parsedPlayers = commaDelimted(data);
                    settingsValue.players = [].concat(settingsValue.players, parsedPlayers.root);
                    settingsValue.slots = Object.assign(settingsValue.slots, parsedPlayers.child);
                    break;
                case 'slots':
                    const parsedSlots = commaDelimted(data);
                    settingsValue.slots = Object.assign(settingsValue.slots, parsedSlots.child);
                    break;
                case 'alias':
                    const parsedAlias = commaDelimted(data);
                    settingsValue.alias = Object.assign(settingsValue.alias, parsedAlias.child);
                    break;
                case 'moderators':
                    const parsedModerators = commaDelimted(data);
                    settingsValue.moderators = [].concat(settingsValue.moderators, parsedModerators.root);
                    break;
                case 'dead':
                    const parsedDead = commaDelimDead(data);
                    settingsValue.dead = [].concat(settingsValue.dead, parsedDead.root);
                    settingsValue.deadPost = Object.assign(settingsValue.deadPost, parsedDead.child);
                    break;
                case 'days':
                    const parsedDays = commaDelimted(data);
                    settingsValue.days = [].concat(settingsValue.days, parsedDays.root);
                    break;
                case 'voteWeight':
                    settingsValue.voteWeight = data;
                    break;
                case 'edash':
                    settingsValue.edash = data;
                    break;
                case 'edashOnTop':
                    settingsValue.edashOnTop;
                    break;
                case 'correctionWeight':
                    settingsValue.correctionWeight;
                    break;
            }
        }
    }
    return settingsValue;
}

function commaDelimted(data) {
    const root = [],
        child = {};
    let splitData = data.split(selectors.comma);
    for (const splitValue of splitData) {
        let individual = splitValue.split(selectors.colon);
        for (const splitChild of individual) {
            const rootValue = individual[0].trim();
            const childValue = splitChild.trim();
            root.push(rootValue);
            child[childValue] = rootValue;
        }
    }

    return { root, child };
}

function commaDelimDead(data) {
    const root = [],
        child = {};
    let splitData = data.split(selectors.comma);
    for (const splitValue of splitData) {
        let individual = splitValue.split(selectors.colon);
        const user = individual[0].trim();
        root.push(user);
        individual.shift();
        for (const splitChild of individual) {
            child[user] = splitChild.trim();
        }
    }
    return { root, child };
}

module.exports = {
    parseSettings,
};
