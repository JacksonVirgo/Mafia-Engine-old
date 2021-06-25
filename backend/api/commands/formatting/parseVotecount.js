const settingsConfig = require('./settings.json');
const checkSetting = require('./checkSetting');

module.exports = (socket, data) => {
	const { settings, voteData } = data;
	parsedSettings = parseSettings(settings);
};

function parseSettings(settingsRoot) {
	let settings = settingsConfig.defaultSettings;
	for (const handle in settingsRoot) {
		let selector = findSetting(handle);
		let data = settingsRoot[handle];
		if (!selector) continue;
		settings = checkSetting(settings, selector, data);
	}
	return settings;
}
function findSetting(setting) {
	for (const handle in settingsConfig.settings) {
		if (settingsConfig.settings.includes(handle))
			return {
				handle,
				request: setting,
				settings: settingsConfig.settings[handle],
			};
	}
	return null;
}
