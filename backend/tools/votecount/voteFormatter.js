const usernameCorrection = require('../formatting/usernameCorrection');

function formatVoteCount(threadData, settingsVal) {
	for (const page in threadData) {
		const pageData = threadData[page];
		pageData.posts = pageData.posts.filter((val) => val.information.postNumber >= 2307);
		for (const postData of pageData.posts) {
			const { votes, information, settings } = postData;

			const correction = usernameCorrection(information.author, settingsVal.players);
			console.log(information.author, correction.direct[0].distance, correction.direct[0]);
		}
	}
}

module.exports = {
	formatVoteCount,
};
