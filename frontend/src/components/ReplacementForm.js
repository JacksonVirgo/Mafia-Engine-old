import { connection } from 'mongoose';
import React, { Component } from 'react'

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getCurrentDate() {
    let date = new Date();
    let currentDay = date.getDate();
    currentDay = attachSuffixOf((currentDay < 10) ? `0${currentDay}` : currentDay);
    let currentMonth = date.getMonth() + 1;
    currentMonth = (currentMonth < 10) ? `0${currentMonth}` : currentMonth;
    return `${currentDay} ${months[currentMonth - 1]}`;
}

function attachSuffixOf(i) {
    let j = i % 10, k = i % 100;
    if (j === 1 && j !== 11) return i + "st";
    else if (j === 2 && k !== 12) return i + "nd";
    else if (j === 3 && k !== 13) return i + "rd";
    else return i + "th";
}

const wsUrl = `wss://localhost:5000`
const ws = new WebSocket(wsUrl);

export class ReplacementForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: ''
        }
        ws.addEventListener('open', () => {
            console.log("Connected to WebSocket");
            ws.send(JSON.stringify({ cmd: "ping" }));
        });
        ws.addEventListener('message', e => {
            try {
                const json = JSON.parse(e);
                switch (json.cmd) {
                    case 'ping':

                        break;
                }
                console.log(json);
            } catch (err) {
                console.log(err);
            }
        });
    }
    async submit(event) {
        event.preventDefault();
        const gameThread = event.target.gameThread.value;
        const departingPlayer = event.target.departingPlayer.value;
        const request = {
            cmd: 'replacement', data: {
                gameThread: gameThread,
                departingPlayer: departingPlayer
            }
        };

        ws.send(JSON.stringify(request));

        //        ws.send(JSON.stringify({ type: 'message', msg: 'potato' }));
        // event.preventDefault();
        // const threadUrl = event.target.gameThread.value;
        // const departingPlayer = event.target.departingPlayer.value;
        // const resultContainer = event.target.result;
        // const cleanUrl = encodeURIComponent(threadUrl);
        // const res = await fetch('http://localhost:5000/api/replacement/' + cleanUrl);
        // const json = await res.json();

        // const { author, lastPage, title, url } = json;
        // let today = getCurrentDate();
        // let result = `${today}\n[i][url=${url}]${title}[/url][/i]\n[b]Moderator:[/b] [user]${author}[/user][tab]3[/tab][tab]3[/tab][b]Status:[/b] ${lastPage} pages [tab]3[/tab] [b]Replacing:[/b] [user]${departingPlayer}[/user]`;
        // resultContainer.value = result;
    }
    render() {
        return (
            <form onSubmit={this.submit}>
                <label htmlFor='gameThread'>Link to Game Thread</label>
                <input id='gameThread' name='gameThread' type='text' />
                <br />
                <label htmlFor='departingPlayer'>Departing Player</label>
                <input id='departingPlayer' name='departingPlayer' type='text' />
                <br />
                <input type='submit' value='Generate' />

                <br />
                <h2>Result</h2>
                <textarea name='result' readOnly />
            </form>
        )
    }
}

export default ReplacementForm
