const scrapeVotes = require('../../tools/scrape/scrapeVotes');
const urlUtil = require('../../util/url');
module.exports = async (socket, data) => {
    const { url, post, raw } = data;
    const parsedPost = post ? post : null;
    const parsedRaw = raw ? raw : null;

    console.log(data);
    const val = urlUtil.validate(url);
    if (!val) {
        socket.emit('error', { type: '[Invalid URL] URL is not a complete URL' });
        return;
    }
    const validParams = await checkParams(url);
    if (!validParams) {
        socket.emit('error', { type: '[Invalid URL] URL Parameters were not what was expected. Bailed' });
        return;
    }
    const thread = await scrapeThread(validParams, socket, parsedPost);
    if (!thread) {
        socket.emit('error', { type: '[Invalid Page] Content of the URL does not match that of which was expected. Bailed' });
        return;
    }
    let result = thread;
    if (!parsedRaw) console.log('[REQUEST] Raw Vote Count');
    socket.emit('result', result);
};
async function checkParams(url) {
    let result = null;
    const p = urlUtil.getParams(url);
    if (p) {
        const { params, root } = p;
        const { f, t } = params;
        if (f && t) {
            result = `${root}?f=${f}&t=${t}`;
        }
    }
    return result;
}
async function scrapeThread(url, socket, post) {
    try {
        const scrape = await scrapeVotes.scrapeThread(url, post, (e) => socket.emit('progress', e));
        return scrape;
    } catch (err) {
        console.log(err);
        return null;
    }
}
