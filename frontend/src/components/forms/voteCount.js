import React, { Component } from 'react'
import { websocketUrl } from '../../scripts/websockets';
import { getCalendarDate } from '../../scripts/dateUtilities';

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
        console.log(data);
        this.resultRef.current.value = "result";
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
