const vc = require('../../tools/scrape/scrapeVotes');
const config = require('./config.json');
const urlUtil = require('../../util/url');

module.exports = async (socket, data) => {
	let { url } = data;
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
	const thread = await scrapeThread(validParams, socket);
	if (!thread) {
		socket.emit('error', { type: '[Invalid Page] Content of the URL does not match that of which was expected. Bailed' });
		return;
	}
	socket.emit('result', thread);
};
async function checkParams(url) {
	const p = urlUtil.getParams(url);
	if (p) {
		const { params, root } = p;
		const { f, t } = params;
		if (hasParams && f && t) {
			return `${root}?f=${f}&t=${t}`;
		}
	}
	return null;
}
async function scrapeThread(url, socket) {
	try {
		const scrape = await vc.scrapeThread(url, (e) => socket.emit('progress', e));
		return scrape;
	} catch (err) {
		return null;
	}
}
