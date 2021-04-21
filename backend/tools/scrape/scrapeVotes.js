const scrapeCore = require('./scrapeCore');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const Settings = require('./classes/settings');

const ref = {
	settingsSelector: 'Spoiler: VoteCount Settings',
};

class URL {
	constructor(url, ppp) {
		this.baseURL = url;
		this.ppp = ppp;
		this.indent = 0;
		this.pppURL = url + '&ppp=' + this.ppp;
	}
	urlFromPost(postNum) {
		return `${this.pppURL}&start=${postNum}`;
	}
	getNextUrlAndIndent() {
		let result = `${this.pppURL}&start=${this.indent}`;
		this.applyIndent();
		return result;
	}
	getCurrentIndented() {
		let result = `${this.pppURL}&start=${this.indent}`;
		return result;
	}
	pageNumberFromPost(postNum) {
		let pages = Math.floor(postNum / this.ppp) + 1;
		return pages;
	}
	applyIndent() {
		this.indent += this.ppp;
	}
}

class Thread {
	constructor(url) {
		this.url = new URL(url, 200);
		this.completed = false;
		this.settings = null;
		this.voteTags = {
			filled: false,
			votePairs: { reg: { id: 0, vote: 'VOTE: ', unvote: 'UNVOTE: ' } },
			votes: [],
			unvotes: [],
			total: [],
		};
	}
	async init(progressUpdate = (e) => console.log(e)) {
		console.time('Scrape');
		const voteCount = {};
		while (!this.completed) {
			let currentUrl = this.url.getNextUrlAndIndent();
			let html = await getHTML(currentUrl);
			let webData = this.scrapePage(html);
			if (webData) {
				for (const category in webData) {
					if (!voteCount[category]) voteCount[category] = {};
					for (const userArray in webData[category]) {
						if (!voteCount[category][userArray]) voteCount[category][userArray] = [];
						voteCount[category][userArray] = [].concat(voteCount[category][userArray], webData[category][userArray]);
						voteCount[category][userArray] = this.sortVotes(voteCount[category][userArray]);
					}
				}
			}
			this.completed = this.settings.pageData.currentPage === this.settings.pageData.lastPage;
			progressUpdate(this.settings.pageData);
		}
		console.timeEnd('Scrape');
		return { voteCount, settings: this.settings };
	}
	sortVotes(array) {
		for (let i = 1; i < array.length; i++) {
			for (let j = i - 1; j > -1; j--) {
				let preInt = parseInt(array[j + 1].post.number);
				let posInt = parseInt(array[j].post.number);

				if (preInt < posInt) {
					[array[j + 1], array[j]] = [array[j], array[j + 1]];
				}
			}
		}
		return array;
	}
	scrapeSettings($) {
		let voteCountSelector = 'Spoiler: VoteCount Settings';
		let settings = {};
		if (true) {
			settings.pageData = this.getPageData($);
			$('div.post')
				.first()
				.find('div.inner > div.postbody > div.content > div')
				.each((index, element) => {
					$(element)
						.find('div.quotetitle')
						.each((index, element) => {
							let parent = $(element).parent();
							let handle = $(element).find('b').first().text();
							let content = parent.find('div.quotecontent').first().find('div').first();
							if (handle === voteCountSelector) {
								content.find('span').each((index, element) => {
									let totalString = $(element).text();
									let command = totalString.split('=');
									settings[command[0]] = command[1];
								});
							}
						});
				});
		}
		console.log(settings);
		this.settings = settings;
	}
	getPageData($) {
		let pagination = $('.pagination').first();
		let currentPage = pagination.find('strong').first();
		let currentPageNum = convertInt(currentPage.text());
		let lastPage = currentPageNum;
		if (pagination.find('span').length >= 1) {
			let lastLink = pagination.find('span > a').last();
			let lastLinkNumber = convertInt(lastLink.text());
			lastPage = lastPage > lastLinkNumber ? lastPage : lastLinkNumber;
		}

		const result = { lastPage, currentPage: currentPageNum };
		return result;
	}
	scrapePage(html) {
		const $ = cheerio.load(html);
		if (!this.settings) this.scrapeSettings($);
		else this.settings.pageData = this.getPageData($);

		let voteCount = {};
		// Object with handles for the author names which is an array of ALL votes.

		$('div.post').each((i, e) => {
			let voteData = this.scrapePost($, $(e));
			if (voteData) {
				for (const category in voteData.votes) {
					if (!voteCount[category]) voteCount[category] = {};
					if (!voteCount[category][voteData.author]) voteCount[category][voteData.author] = [];
					voteCount[category][voteData.author].push(voteData);
				}
			}
		});
		return voteCount;
	}
	scrapePost($, post) {
		const voteData = {
			author: post.find('.inner > .postprofilecontainer > .postprofile > dt > a').text(),
			post: {
				url: post.find('div.inner > div.postbody > p.author > a > strong').parent().attr('href'),
				number: post.find('div.inner > div.postbody > p.author > a > strong:first').text().replace(/\D/g, ''),
			},
			pronoun: 'N/A',
			votes: {},
		};
		if (!this.voteTags.filled) {
			for (const category in this.voteTags.votePairs) {
				if (this.voteTags.votePairs[category].vote) this.voteTags.votes.push(this.voteTags.votePairs[category].vote);
				if (this.voteTags.votePairs[category].unvote) this.voteTags.unvotes.push(this.voteTags.votePairs[category].unvote);
				this.voteTags.total = [].concat(this.voteTags.votes, this.voteTags.unvotes);
			}
			this.voteTags.filled = true;
		}
		post.find('div.inner > div.postbody > div.content:first').each((i, e) => {
			$(e)
				.find('blockquote')
				.each((i, e) => $(e).remove());
			$(e)
				.find('span.bbvote, span.noboldsig')
				.each((i, e) => {
					let vote = $(e).text();
					if (vote) {
						let detachedVote = detachVoteTag(vote, this.voteTags.total);
						if (detachedVote) {
							let { tag, content } = detachedVote;
							for (const voteCategory in this.voteTags.votePairs) {
								if (!voteData.votes[voteCategory]) voteData.votes[voteCategory] = [];
								if (tag === this.voteTags.votePairs[voteCategory].vote) {
									voteData.votes[voteCategory].push(content);
								} else if (tag === this.voteTags.votePairs[voteCategory].unvote) {
									voteData.votes[voteCategory].push(null);
								}
							}
						}
					}
				});
		});

		let result = !!Object.keys(voteData.votes).length ? voteData : null;
		return result;
	}
}

async function getHTML(url) {
	const res = await fetch(url);
	const content = await res.text();
	return content;
}

function detachVoteTag(vote, allVotes) {
	for (const voteTag of allVotes) {
		if (vote.startsWith(voteTag)) {
			const result = { tag: voteTag, content: vote.substring(voteTag.length) };
			return result;
		}
	}
	return null;
}
function convertInt(str) {
	let result = parseInt(str);
	result = isNaN(result) ? null : result;
	return result;
}

const fetchSettingsFromUrl = (url) => {};
const findSettingsInPost = (post) => {
	const settings = null;
	post.find('div.inner > div.postbody > div.content > div').each((i, el) => {
		$(element)
			.find('div.quotetitle')
			.each((i, el) => {
				let parent = $(el).parent();
				let handle = $(el).find('b').first().text();
				let content = parent.find('div.quotecontent').first().find('div').first();
				if (handle === ref.settingsSelector) {
					settings = {};
					content.find('span').each((i, el) => {
						let totalString = $(el).text();
						let command = totalString.split('=');
						settings[command[0]] = command[1];
					});
				}
			});
	});
	return settings;
};

module.exports = {
	findSettingsInPost,

	scrapeThread: (url, progress) => {
		console.log(url);
		return new Thread(url).init(progress);
	},
	fetchSettingsFromUrl,
};
