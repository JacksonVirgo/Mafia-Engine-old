const vc = require('../../tools/scrape/scrapeVotes');
const config = require('./config.json');
const urlUtil = require('../../util/url');

module.exports = async (socket, data) => {
	const result = null;
	let { url } = data;
	let hitError = false;
	try {
		const { params, root } = urlUtil.getParams(url);
		const { f, t } = params;
		if (f && t) {
			url = `${root}?f=${f}&t=${t}`;
		}
	} catch (err) {
		socket.emit('error', { type: 'Invalid Input [URL]' });
		hitError = true;
	}
	if (!hitError) {
		try {
			result = await vc.scrapeThread(url, (e) => socket.emit('progress', e));
		} catch (err) {
			socket.emit('error', { type: 'Invalid URL Target' });
			hitError = true;
		}
	}
	if (!hitError) {
		socket.emit('result', result);
	}
};
