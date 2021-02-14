import React, { useState, useEffect } from 'react'
import { createSocket } from '../scripts/websockets';
import io from 'socket.io-client';
import { findBestMatch, compareTwoStrings } from 'string-similarity';


const SOCKET_URI = process.env.SERVER_URI || 'http://localhost:5000';
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
        console.log(data);
        const { settings, unknownVotes, voteCount } = data;
        let cleaned = cleanVoteCount(voteCount, settings);
        let formatted = formatVoteCount(cleaned.voteCount, cleaned.unknownVotes, settings);
        this.setState({ result: formatted });
    }
    onProgress(data) {
        const { current, last } = data;
        const currentNum = parseInt(current),
            lastNum = parseInt(last),
            cannotCheck = isNaN(currentNum) || isNaN(lastNum);
        if (!cannotCheck) {
            this.setState({ progress: cannotCheck / lastNum });
        }
    }
    onPing(data) {
        console.log(data);
    }
    setupSocketListeners() {
        this.socket.on('votecount', this.onVoteCount.bind(this));
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
function cleanVoteCount(voteCount, settings) {
    /* Formats into a new object that shows each wagon and
    which slots are on each wagon. Fixes spelling errors and best-match*/

    console.log(voteCount);
    console.log('-');
    const checkCorrections = true;

    try {
        const wagons = {};
        const unknownVotes = [];
        for (const voteCategory in voteCount) {
            if (!wagons[voteCategory]) {
                wagons[voteCategory] = {};
            }
            for (const vote in voteCount[voteCategory]) {
                let currentVote = voteCount[voteCategory][vote];
                if (checkCorrections) {
                    const correctedVote = findBestMatch(currentVote.vote, settings.players);
                    if (correctedVote.bestMatch.rating >= settings.correction) {
                        currentVote.vote = correctedVote.bestMatch.target;
                        currentVote.author = settings.slots[currentVote.author];

                        if (!wagons[voteCategory][currentVote.vote])
                            wagons[voteCategory][currentVote.vote] = [];
                        wagons[voteCategory][currentVote.vote].push(currentVote);
                    } else {
                        delete voteCount[voteCategory][vote];
                        unknownVotes.push(currentVote);
                    }
                }
            }
        }
        return { voteCount: wagons, unknownVotes };
    } catch (err) {
        console.log(err);
    }
    return null;
}
function formatVoteCount(voteCount, unknownVotes, settings) {
    let formattedVoteCount = 'f';
    console.log(voteCount);
    const wagons = {};
    for (const voteCategory in voteCount) {
        let voteCategoryWagon = '';
        for (const wagon in voteCount[voteCategory]) {
            const wagonList = voteCount[voteCategory][wagon];
            let wagonVotes = `[b]${wagon} (${wagonList.length})[/b]`;
            const isFirst = true;
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