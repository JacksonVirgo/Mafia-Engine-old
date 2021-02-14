import React, { Component, useState } from 'react'
import { findBestMatch } from 'string-similarity';
import { serverUrl } from '../../scripts/reference';
import socketIOClient from 'socket.io-client';
import { createSocket } from '../../scripts/websockets';
import e from 'cors';

export default class VoteCount extends Component {
    constructor(props) {
        super(props);
        this.state = { progress: '', result: '' };
        this.socket = socketIOClient(serverUrl);
    }
    submit(e) {
        e.nativeEvent.preventDefault();

        console.log(this);
        //        client.socket.emit('ping', { potato: 'yes' });
    }
    render() {
        return (
            <form onSubmit={this.submit}>
                <label htmlFor='gameThread'>Link to Game Thread</label>
                <input id='gameThread' name='gameThread' type='text' />
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

// const socket = socketIOClient(serverUrl);

// function VC() {
//     const [progress, setProgress] = useState('Progress');
//     const [result, setResult] = useState('');
//     socket.on('progress', (data) => setProgress(`(${data.currentPageNum}/${data.lastPage})`));
//     socket.on('votecount', (data) => postResponse(data));

//     function submit(e) {
//         e.preventDefault();
//         let gameThread = e.target.gameThread.value;
//         socket.emit('votecount', { url: gameThread });
//         setProgress('?/?');
//     }
//     function postResponse(data) {
//         setProgress('');
//         console.log(data);
//         let result = 'An error has occurred...';
//         let values = data.voteCount;
//         let settings = data.settings;
//         settings.correcton = 50; // TEMPORARY!
//         let cleanedVC = cleanVoteCount(values, settings);
//         if (cleanedVC !== null) {
//             let formatVC = formatVoteCount(cleanedVC, settings);
//             if (formatVC !== null) {
//                 result = formatVC;
//             }
//         }
//         setResult(result);
//     }
//     return (
//         <form onSubmit={submit}>
//             <label htmlFor='gameThread'>Link to Game Thread</label>
//             <input id='gameThread' name='gameThread' type='text' />
//             <br />
//             <label htmlFor='correction'>Spelling Correction</label>
//             <input id='correction' name='correction' type='range' min='0' max='100' value='50' onChange={() => { }} />
//             <br />
//             <input type='submit' value='Generate' />
//             <br />
//             <h2>Result <span>{progress}</span></h2>
//             <textarea name='result' value={result} readOnly />
//         </form>
//     );
// }

function formatVoteCount({ voteCount, unknownVotes }, settings) {
    let formattedVoteCount = '';
    const finalVoteCount = {};
    for (const voteType in voteCount) {
        if (!finalVoteCount[voteType])
            finalVoteCount[voteType] = {};

        for (const vote in voteCount[voteType]) {
            let currentVote = voteCount[voteType][vote];
            if (!finalVoteCount[voteType][currentVote.vote])
                finalVoteCount[voteType][currentVote.vote] = [];
            finalVoteCount[voteType][currentVote.vote].push(currentVote);
        }
    }
    formattedVoteCount += JSON.stringify(finalVoteCount);
    return formattedVoteCount;
}

function cleanVoteCount(voteCount, settings) {
    try {
        const finalVoteCount = {};
        const unknownVotes = [];
        for (const voteType in voteCount) {
            if (!finalVoteCount[voteType])
                finalVoteCount[voteType] = {};
            for (const vote in voteCount[voteType]) {
                let currentVote = voteCount[voteType][vote];
                const correctedVote = findBestMatch(currentVote.vote, settings.players);
                if (settings.correction)
                    if (correctedVote.bestMatch.rating >= settings.correction) {
                        console.log('VOTE');
                        currentVote.vote = correctedVote.bestMatch.target;
                        currentVote.author = settings.slots[currentVote.author];
                        finalVoteCount[voteType][vote] = currentVote;
                    } else {
                        delete voteCount[voteType][vote];
                        unknownVotes.push(currentVote);
                    }
            }
        }
        return { voteCount: finalVoteCount, unknownVotes }
    } catch (err) {
        console.log(err);
    }
    return null;
}

// export class VoteCount extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             socket: createSocket([
//                 { cmd: 'votecount', func: (socket, e) => this.postResponse(e) },
//                 { cmd: 'progress', func: (socket, e) => this.postProgress(e.currentPageNum, e.lastPage) }]),
//             progress: '',
//             result: '',
//             correction: 50
//         }
//     }
//     postProgress(progress) {
//         this.setState({ progress: progress });
//     }
//     async submit(event) {
//         event.preventDefault();
//         const gameThread = event.target.gameThread.value;
//         this.state.socket.emit('votecount', { gameThread });
//     }
//     postResponse(data) {
//         this.setState({ progress: '' });
//         const result = { result: 'An error has occurred...' };
//         let values = data.voteCount;
//         let settings = data.settings;
//         settings.correction = this.state.correction;
//         console.log(data);
//         let cleanedVC = cleanVoteCount(values, settings);
//         if (result !== null) {
//             let formatVC = formatVoteCount(cleanedVC, settings);
//             if (formatVC !== null) {
//                 result.result = formatVC;
//             }
//         }
//         this.setState({ result });
//     }

//     render() {
//         return (
//             <form onSubmit={this.submit}>
//                 <label htmlFor='gameThread'>Link to Game Thread</label>
//                 <input id='gameThread' name='gameThread' type='text' />
//                 <br />
//                 <label htmlFor='correction'>Spelling Correction</label>
//                 <input id='correction' name='correction' type='range' min='0' max='100' value='50' onChange={() => { }} />
//                 <br />
//                 <input type='submit' value='Generate' />
//                 <br />
//                 <h2>Result <span>{this.state.progress}</span></h2>
//                 <textarea name='result' value={this.state.result} readOnly />
//             </form>
//         )
//     }
// }
// function formatVoteCount({ voteCount, unknownVotes }, settings) {
//     let formattedVoteCount = '';
//     const finalVoteCount = {};
//     for (const voteType in voteCount) {
//         if (!finalVoteCount[voteType])
//             finalVoteCount[voteType] = {};

//         for (const vote in voteCount[voteType]) {
//             let currentVote = voteCount[voteType][vote];
//             if (!finalVoteCount[voteType][currentVote.vote])
//                 finalVoteCount[voteType][currentVote.vote] = [];
//             finalVoteCount[voteType][currentVote.vote].push(currentVote);
//         }
//     }
//     formattedVoteCount += JSON.stringify(finalVoteCount);
//     return formattedVoteCount;
// }

// function cleanVoteCount(voteCount, settings) {
//     try {
//         const finalVoteCount = {};
//         const unknownVotes = [];
//         for (const voteType in voteCount) {
//             if (!finalVoteCount[voteType])
//                 finalVoteCount[voteType] = {};
//             for (const vote in voteCount[voteType]) {
//                 let currentVote = voteCount[voteType][vote];
//                 const correctedVote = findBestMatch(currentVote.vote, settings.players);
//                 if (settings.correction)
//                     if (correctedVote.bestMatch.rating >= settings.correction) {
//                         console.log('VOTE');
//                         currentVote.vote = correctedVote.bestMatch.target;
//                         currentVote.author = settings.slots[currentVote.author];
//                         finalVoteCount[voteType][vote] = currentVote;
//                     } else {
//                         delete voteCount[voteType][vote];
//                         unknownVotes.push(currentVote);
//                     }
//             }
//         }
//         return { voteCount: finalVoteCount, unknownVotes }
//     } catch (err) {
//         console.log(err);
//     }
//     return null;
// }

// export default VoteCount;
