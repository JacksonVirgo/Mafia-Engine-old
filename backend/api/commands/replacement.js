const rep = require('../../tools/scrape/scrapeReplacement');
const config = require('./config.json');
module.exports = async (socket, data) => {
    try {
        const result = await rep.getReplacementFromUrl(data.url);
        socket.emit(config.result, result);
    } catch (err) {
        console.log(`[${config.error}] Replacement`, err);
        socket.emit(config.error, err);
    }
}