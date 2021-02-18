import React from 'react'
import io from 'socket.io-client';
//import { createSocket } from '../scripts/websockets';
import { findBestMatch, compareTwoStrings } from 'string-similarity';

export default class VoteCount extends React.Component {
    socket = null;
    state = {
        result: '',
        progress: ''
    }
    componentDidMount() {
        this.initSocketConnection();
        this.setupSocketListeners();
    }
    componentWillUnmount() {
        this.closeSocketConnection();
    }
    initSocketConnection() {
        this.socket = io.connect()
    }
    closeSocketConnection() {
        this.socket.disconnect();
    }
    onClientDisconnected() {
        console.log('Disconnected from Server');
    }
    onReconnection() {
        console.log('Reconnected to Server');
    }
    onVoteCount(data) {
        let cleanedVoteCount = cleanVoteCount(data);
        console.log(cleanedVoteCount);
        if (false) {
            let formattedVoteCount = formatVoteCount(cleanedVoteCount);
            this.setState({ result: formattedVoteCount });
        }
    }
    onProgress(data) {
        console.log(data);
        // const { current, last } = data;
        // const currentNum = parseInt(current),
        //     lastNum = parseInt(last),
        //     cannotCheck = isNaN(currentNum) || isNaN(lastNum);
        // if (!cannotCheck) {
        //     this.setState({ progress: cannotCheck / lastNum });
        // }
    }
    onPing(data) {
        console.log(data);
    }
    setupSocketListeners() {
        this.socket.on('votecount', this.onVoteCount.bind(this));
        this.socket.on('progress', this.onProgress.bind(this));
        this.socket.on('ping', this.onPing.bind(this));
        this.socket.on('reconnect', this.onReconnection.bind(this));
        this.socket.on('disconencted', this.onClientDisconnected.bind(this));
    }
    onFormSubmit(e) {
        e.preventDefault();
        this.socket.emit('votecount', { url: 'https://forum.mafiascum.net/viewtopic.php?f=2&t=85556' });
        console.log('Form Submitted');
    }
    render() {
        return (
            <form onSubmit={this.onFormSubmit.bind(this)}>
                <label htmlFor='gameUrl'>Link to Game Thread</label>
                <input id='gameUrl' name='gameUrl' type='text' />
                <br />
                <label htmlFor='correction'>Spelling Correction</label>
                <input id='correction' name='correction' type='range' min='0' max='100' value='50' onChange={() => { }} />
                <br />
                <input type='submit' value='Generate' />
                <br />
                <h2>Result <span>{this.state.progress}</span></h2>
                <textarea name='result' value={this.state.result} readOnly />
            </form>
        );
    }
}

/**
 * Cleans vote data in a format that makes it easier to format.
 * @param {Object} voteCount Vote data
 * @param {Object} settings Settings object
 */
function cleanVoteCount({ voteCount, settings }) {
    // Going to make this slow but obvious and then slowly combine it at a later date.
    const voteData = {
        votes: {}, // Combined slot votes.
        wagons: {} // Wagon data
    };
    const slotData = {
        slots: settings.slots,
        votes: {
            //example: [vote1, vote2, vote3]
        }
    }
    settings.votenum = { reg: 1 };
    for (const voteCategory in voteCount) {
        voteData[voteCategory] = voteData[voteCategory] ? voteData[voteCategory] : {};
        for (const user in voteCount[voteCategory]) {
            let userVote = voteCount[voteCategory][user];
            let author = userVote.author;
            if (slotData.slots[author]) {
                if (!slotData.votes[voteCategory])
                    slotData.votes[voteCategory] = {};
                if (!slotData.votes[voteCategory][slotData.slots[author]])
                    slotData.votes[voteCategory][slotData.slots[author]] = [];
                slotData.votes[voteCategory][slotData.slots[author]].push(userVote);
            }
        }
    }
    for (const voteCategory in slotData.votes) {
        for (const user in slotData.votes[voteCategory]) {
            let sortedSlotVotes = quickSortVotes(slotData.votes[voteCategory][user]);
            slotData.votes[voteCategory][user] = sortedSlotVotes;
            let currentVote = sortedSlotVotes[0];
            if (currentVote.votes[voteCategory]) {
                let currentVoted = currentVote.votes[voteCategory].vote;
                let bestMatch = findBestMatch(currentVoted, settings.players);
                if (bestMatch.bestMatch.rating >= 0.5) {
                    if (!voteData.wagons[voteCategory]) voteData.wagons[voteCategory] = {};
                    if (!voteData.wagons[voteCategory][bestMatch.bestMatch.target]) voteData.wagons[voteCategory][bestMatch.bestMatch.target] = [];
                    voteData.wagons[voteCategory][bestMatch.bestMatch.target].push(currentVote);
                } else {
                    console.log(`${currentVoted} has been yeeted at ${bestMatch.bestMatch.rating}`);
                }
            }
        }
    }
    return voteData;

}
function formatVoteCount(voteCount, unknownVotes, settings) {
    let formattedVoteCount = 'f';
    console.log(voteCount);
    //const wagons = {};

    for (const voteCategory in voteCount) {
        let voteCategoryWagon = '';
        for (const wagon in voteCount[voteCategory]) {
            const wagonList = voteCount[voteCategory][wagon];
            let wagonVotes = `[b]${wagon} (${wagonList.length})[/b]`;
            let isFirst = true;
            for (const vote of wagonList) {
                wagonVotes += `${isFirst ? '' : ', '}${wagonList.vote}[url=${vote.url}][${vote.post}][/url]`;
                isFirst = false;
            }
            voteCategoryWagon += wagonVotes += '\n';
        }
        formattedVoteCount += voteCategoryWagon;
    }
    return formattedVoteCount;
}

function quickSortVotes(origArray) {
    if (origArray.length <= 1)
        return origArray;
    let left = [], right = [], newArray = [], pivot = origArray.pop(), length = origArray.length;
    for (let i = 0; i < length; i++) {
        if (origArray[i].post.number >= pivot) {
            left.push(origArray[i])
        } else {
            right.push(origArray[i]);
        }
    }
    return newArray.concat(quickSortVotes(left), pivot, quickSortVotes(right));
}
