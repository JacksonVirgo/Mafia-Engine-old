const scrapeVotes = require('../../tools/scrape/scrapeVotes');
console.log(scrapeVotes);
const config = require('./config.json');
const urlUtil = require('../../util/url');

module.exports = async (socket, data) => {
	let { url, raw } = data;
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
	let result = thread;
	if (!raw) {
	}
	socket.emit('result', thread);
};
async function checkParams(url) {
	let result = null;
	const p = urlUtil.getParams(url);
	if (p) {
		const { params, root } = p;
		const { f, t } = params;
		console.log(f, t);
		if (f && t) {
			result = `${root}?f=${f}&t=${t}`;
		}
	}
	return result;
}
async function scrapeThread(url, socket) {
	try {
		console.log('TEST');
		const scrape = await scrapeVotes.scrapeThread(url, (e) => socket.emit('progress', e));
		console.log('Scrape', scrape);
		return scrape;
	} catch (err) {
		console.log(err);
		return null;
	}
}
