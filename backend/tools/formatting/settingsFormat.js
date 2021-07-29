const SEPERATOR = ',';
const BLOCK_SEPERATOR = ':';
const SELECTORS = {
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
};

const COMMANDS = {
    players: (data) => {
        const { list, obj } = convertCommaDelimiter(data);
        return { players: list, slots: obj };
    },
    slots: (data) => {
        const { obj } = convertCommaDelimiter(data);
        return { slots: obj };
    },
    alias: (data) => {
        const { list, obj } = convertCommaDelimiter(data);
        return {};
    },
    moderators: (data) => {
        const { list } = convertCommaDelimiter(data);
        return { moderators: list };
    },
    dead: (data) => {
        const { list } = convertCommaDelimiter(data);
        return { dead: list };
    },
    days: (data) => {
        const { list } = convertCommaDelimiter(data);
        return { days: list };
    },
    deadline: (data) => {
        return { deadline: data };
    },
    countdown: (data) => {
        const { list, obj } = convertCommaDelimiter(data);
        return {};
    },
    pageData: (data) => {
        return { pageData: data };
    },
    correctionWeight: (data) => {
        return { correctionWeight: data };
    },
    edash: (data) => {
        const edashValue = parseInt(data);
        return { edash: isNaN(edashValue) ? -1 : edashValue };
    },
    edashOnTop: (data) => {
        const edashValue = parseInt(data);
        return { edashOnTop: isNaN(edashValue) ? -1 : edashValue };
    },
};

const convertCommaDelimiter = (data) => {
    const author = [],
        group = {};
    let slotRef = data.split(seperator);
    for (let i = 0; i < slotRef.length; i++) {
        let indivPlayers = slotRef[i].split(block);
        for (let j = 0; j < indivPlayers.length; j++) {
            const currentPlayer = indivPlayers[0].trim();
            const playerReference = indivPlayers[j].trim();
            author.push(playerReference);
            group[playerReference] = currentPlayer;
        }
    }
    return { list: author, obj: group };
};

const findSelector = (fetchSelector) => {
    for (const selector in SELECTORS) {
        if (SELECTORS[selector].includes(fetchSelector)) {
            return { handle: selector, request: fetchSelector, selector: SELECTORS[selector] };
        }
    }
    return null;
};

module.exports = (raw) => {
    const settings = {};
    for (const rawSelector in raw) {
        const selector = findSelector(rawSelector);
        const data = raw[rawSelector];
        if (selector) {
            let handleCommand = COMMANDS[selector];
            if (handleCommand) {
                const newValue = handleCommand(data);
                settings = Object.assign(settings, newValue);
            }
        }
    }
    return settings;
};
