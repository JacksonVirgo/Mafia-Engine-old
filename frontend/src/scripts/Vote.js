import { findBestMatch } from 'string-similarity';

export default class Vote {
	constructor(voteData, category) {
		this.category = category;
		this.author = voteData.author;
		this.pronoun = voteData.pronoun;
		this.number = parseInt(voteData.post.number);
		this.url = voteData.post.url;
		this.votes = voteData.votes;
		this.vote = {
			last: null,
			valid: null,
		};
	}
	isAfter(vote) {
		return this.number > vote.number;
	}
	getNewest(vote) {
		if (!vote) {
			return this;
		} else {
			return this.isAfter ? this : vote;
		}
	}
	clean(settings) {
		const totalnames = settings.totalnames,
			alias = settings.alias,
			voteArray = this.votes[this.category];
		let lastVote = undefined,
			finalVote = undefined;
		for (let i = voteArray.length; i >= 0; i -= 1) {
			const originalVote = voteArray[i];
			if (lastVote === undefined) lastVote = originalVote;
			if (finalVote === undefined) {
				if (originalVote || originalVote === null) {
					if (originalVote === null) {
						finalVote = null;
					} else {
						let correction = findBestMatch(originalVote, totalnames).bestMatch;
						if (correction.rating >= settings?.correctionWeight || 0.7) {
							let corrected = alias[correction.target];
							if (corrected) {
								finalVote = corrected;
								if (lastVote === originalVote) lastVote = finalVote;
							}
						}
					}
				}
			}
		}
		this.vote.last = lastVote;
		this.vote.valid = finalVote;
	}
	isValid(settings) {
		let isCurrent = this.number > parseInt(settings.days[settings.days.length - 1]);
		let isDead = false;
		for (let deadUsr of settings.dead) {
			let deadRoot = this.rootUser(deadUsr, settings.totalnames);
			let userRoot = this.rootUser(this.author, settings.totalnames);
			if (deadRoot.target === userRoot.target) {
				isDead = true;
			}
		}
		return isCurrent && !isDead;
	}
	rootUser(user, totalnames) {
		return findBestMatch(user, totalnames).bestMatch;
	}
}
