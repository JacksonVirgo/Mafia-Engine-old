import React, { Component } from 'react'
import { websocketUrl } from '../../scripts/websockets';
import { compareTwoStrings, findBestMatch } from 'string-similarity';


function formatVoteCount(settings, { voteCount, unknownVotes }) {
    let formattedVoteCount = '';
    console.log(voteCount);

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
    console.log(finalVoteCount);
    formattedVoteCount += 'Temporary - Everything is working in the console.';
    return formattedVoteCount;
}

function cleanVoteCount({ settings, voteCount }) {
    try {
        const correctionAmount = 0.5;
        const finalVoteCount = {};
        const unknownVotes = [];
        for (const voteType in voteCount) {
            if (!finalVoteCount[voteType])
                finalVoteCount[voteType] = {};
            for (const vote in voteCount[voteType]) {
                let currentVote = voteCount[voteType][vote];
                const correctedVote = findBestMatch(currentVote.vote, settings.players);
                if (correctedVote.bestMatch.rating >= correctionAmount) {
                    currentVote.vote = correctedVote.bestMatch.target;
                    currentVote.author = settings.slots[currentVote.author];
                    finalVoteCount[voteType][vote] = currentVote;
                } else {
                    console.log("DEL");
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

const ws = new WebSocket(websocketUrl);
export class VoteCount extends Component {
    constructor(props) {
        super(props);
        this.state = {}

        this.resultRef = React.createRef();
        ws.addEventListener('open', () => {
            console.log("Connected to WebSocket");
        });
        ws.addEventListener('message', e => {
            try {
                const json = JSON.parse(e.data);
                if (json.cmd === 'votecount')
                    this.postResponse(json.data);
            } catch (err) {
                console.log(err);
                console.log(e);
            }
        });
    }
    async submit(event) {
        event.preventDefault();
        const gameThread = event.target.gameThread.value;
        const request = {
            cmd: 'votecount', data: {
                gameThread: gameThread
            }
        };
        ws.send(JSON.stringify(request));
    }
    postResponse(data) {
        let values = data.voteCount;
        let cleanedVC = cleanVoteCount(values);
        console.log(cleanedVC);
        let formatVC = formatVoteCount(values.settings, cleanedVC);
        this.resultRef.current.value = formatVC;
    }
    render() {
        return (
            <form onSubmit={this.submit}>
                <label htmlFor='gameThread'>Link to Game Thread</label>
                <input id='gameThread' name='gameThread' type='text' />
                <br />
                <a>+1</a>
                <br />
                <input type='submit' value='Generate' />
                <br />
                <h2>Result</h2>
                <textarea name='result' ref={this.resultRef} readOnly />
            </form>
        )
    }
}

export default VoteCount;
