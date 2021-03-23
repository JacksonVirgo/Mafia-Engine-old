const vc = require('../../tools/scrape/scrapeVotes');
const config = require('./config.json');
const urlUtil = require('../../util/url');

module.exports = async (socket, data) => {
	let { url } = data;
	let hitError = false;
	try {
		const { params, root } = urlUtil.getParams(url);
		const { f, t } = params;
		if (f && t) {
			url = `${root}?f=${f}&t=${t}`;
		}
		const result = await vc.scrapeThread(url, (e) => socket.emit('progress', e));
		socket.emit('result', result);
	} catch (err) {
		socket.emit('error', { type: 'Invalid Input [URL]' });
		hitError = true;
	}
};
