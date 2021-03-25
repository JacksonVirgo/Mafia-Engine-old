const rep = require('../../tools/scrape/scrapeReplacement');
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
	const replacement = await scrapeThread(validParams);
	if (!replacement) {
		socket.emit('error', { type: '[Invalid Page] Content of the URL does not match what was expected. Bailed' });
		return;
	}
	socket.emit('replacement', replacement);
};
async function checkParams(url) {
	const { params, root } = urlUtil.getParams(url);
	const { f, t } = params;
	if (f && t) {
		return `${root}?f=${f}&t=${t}`;
	}
	return null;
}
async function scrapeThread(url) {
	try {
		const scrape = await rep.getReplacementFromUrl(url);
		return scrape;
	} catch (err) {
		return null;
	}
}
