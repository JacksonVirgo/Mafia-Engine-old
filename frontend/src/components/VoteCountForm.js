import React from 'react'
import { findBestMatch } from 'string-similarity';
import ToolRoot from './ToolRoot';
import Vote from '../scripts/Vote';

export default class VoteCount extends ToolRoot {
    cache = {};
    setupSocketListeners() {
        super.setupSocketListeners();
        this.socket.on('votecount', this.onVoteCount.bind(this));
        this.socket.on('progress', this.onProgress.bind(this));
    }
    onVoteCount(data) {
        this.addCache(data);
        let cleaned = this.clean();
        let formatted = this.format(cleaned);
        this.setState({ progress: '', result: formatted });
    }
    onProgress(data) {
        let progress = Math.round(data.currentPage / data.lastPage * 100);
        this.setState({ progress: `[${progress}%]` });
    }
    onFormSubmit(e) {
        e.preventDefault();
        let gameUrl = e.target.gameUrl.value || 'https://forum.mafiascum.net/viewtopic.php?f=2&t=85556'; // Second value is for testing purposes.
        console.log(gameUrl);
        this.socket.emit('votecount', { url: gameUrl });
        this.setState({ progress: '[0%]' });
        console.log('Form Submitted');
    }
    render() {
        return (
            <form onSubmit={this.onFormSubmit.bind(this)}>
                <label htmlFor='gameUrl'>Link to Game Thread</label>
                <input id='gameUrl' name='gameUrl' type='text' />
                <br />
                <input type='submit' value='Generate' />
                <br />
                <h2>Result <span>{this.state.progress}</span></h2>
                <textarea name='result' value={this.state.result} readOnly />
            </form>
        );
    }
    clean() {
        const voteData = { votes: {}, wagons: {}, notVoting: [], majority: null };
        for (const category in this.cache.voteCount) {
            if (!voteData.votes[category]) voteData.votes[category] = {};
            if (!voteData.wagons[category]) voteData.wagons[category] = {};
            voteData.notVoting = this.getAlive();
            voteData.majority = Math.ceil(voteData.notVoting.length / 2);
            for (const author in this.cache.voteCount[category]) {
                let voteArray = this.cache.voteCount[category][author];
                let lastVote = null;
                let validVote = null;
                for (let i = 0; i < voteArray.length; i++) {
                    let vote = new Vote(voteArray[i], category);
                    vote.clean(this.cache.settings);
                    if (vote.vote.valid !== undefined) {
                        if (vote.vote.valid) {
                            validVote = vote.getNewest(validVote);
                        } else {
                            validVote = null;
                        }
                    }
                    lastVote = vote.getNewest(lastVote);
                }
                let valid = validVote?.isValid(this.cache.settings);
                if (valid) {
                    let authorIndex = voteData.notVoting.indexOf(validVote.author);
                    voteData.notVoting.splice(authorIndex, 1);
                    voteData.votes[category][author] = {
                        last: lastVote,
                        valid: validVote
                    };
                    if (!voteData.wagons[category][validVote.vote.valid])
                        voteData.wagons[category][validVote.vote.valid] = []
                    voteData.wagons[category][validVote.vote.valid].push(validVote);
                }
            }
        }
        return voteData;
    }
    format(voteData) {
        const { wagons, notVoting, majority } = voteData;
        let totalVC = "";
        for (const category in wagons) {
            let categoryVotes = '[area]';
            for (const wagonHead in wagons[category]) {
                let voteArray = wagons[category][wagonHead];
                let vote = `[b]${wagonHead}[/b] (${voteArray.length}) -> `;
                for (let i = 0; i < voteArray.length; i++) {
                    if (i > 0)
                        vote += ', ';
                    vote += `${voteArray[i].author}`;
                }
                categoryVotes += `${vote} [b][E-${majority - voteArray.length}][/b]\n`;
            }
            if (notVoting.length > 0) {
                categoryVotes += `\n[b]Not Voting[/b] (${notVoting.length}) -> `;
                for (let i = 0; i < notVoting.length; i++) {
                    if (i > 0)
                        categoryVotes += ', ';
                    categoryVotes += `${notVoting[i]}`;
                }
            }
            categoryVotes += '[/area]';
            totalVC += categoryVotes;
        }
        return totalVC;
    }
    getAlive() {
        const { players, dead } = this.cache.settings;
        let aliveList = [];
        for (let i = 0; i < players.length; i++) {
            let root = this.getRootAuthor(players[i]);
            if (!containsObject(root, aliveList) && !containsObject(root, dead)) {
                aliveList.push(root);
            }
        }
        return aliveList;
    }
    checkValid(votePost, category) {
        let isCurrent = votePost.number > parseInt(this.cache.settings.days[this.cache.settings.days.length - 1]);
        let isDead = false;
        for (let deadUsr of this.cache.settings.dead) {
            let deadRoot = this.rootUser(deadUsr);
            let userRoot = this.rootUser(votePost.author);
            if (deadRoot.target === userRoot.target) {
                isDead = true;
            }
        }
        return isCurrent && !isDead;
    }
    isValidVote(vote) {
        let valid = false;
        if (vote) {
            let cor = this.rootUser(vote);
            if (cor.rating >= this.cache.settings.correctionWeight || 0.7) {
                let correctedVote = this.cache.settings.alias[cor.target];
                if (correctedVote) {
                    valid = true;
                }
            }
        }
        return valid;
    }
    rootUser(user) {
        return findBestMatch(user, this.cache.settings.totalnames).bestMatch;
    }
    getRootAuthor(author) {
        let bestMatch = findBestMatch(author, this.cache.settings.totalnames).bestMatch;
        let root = this.cache.settings.alias[bestMatch.target];
        return root || bestMatch.target;
    }
}

function containsObject(obj, list) {
    for (let i = 0; i < list.length; i++) {
        if (list[i] === obj)
            return true;
    }
    return false;
}