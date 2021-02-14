import React, { useState } from 'react'
import { createSocket } from '../scripts/websockets';
import { getCalendarDate } from '../scripts/dateUtilities';

function ReplacementForm() {
    const [result, setResult] = useState('');
    const [progress, setProgress] = useState('F');

    const socket = createSocket();
    socket.on('replacement', (e) => onReplacement(e));
    let departing = null;

    const onReplacement = (e) => {
        console.log(e);
        const { author, lastPage, title, url } = e;
        let today = getCalendarDate();
        let result = `${today}\n[i][url=${url}]${title}[/url][/i]\n[b]Moderator:[/b] [user]${author}[/user][tab]3[/tab][tab]3[/tab][b]Status:[/b] ${lastPage} pages [tab]3[/tab] [b]Replacing:[/b] [user]${departing}[/user]`;
        setResult(result);
    }
    const onSubmit = (e) => {
        e.preventDefault();
        const url = e.target.gameThread.value;
        departing = e.target.departingPlayer.value;
        socket.emit('replacement', { url });
        setProgress('[pending]');
    }
    return (
        <form onSubmit={onSubmit}>
            <label htmlFor='gameThread'>Link to Game Thread</label>
            <input id='gameThread' name='gameThread' type='text' />
            <br />
            <label htmlFor='departingPlayer'>Departing Player</label>
            <input id='departingPlayer' name='departingPlayer' type='text' />
            <br />
            <a>+1</a>
            <br />
            <input type='submit' />
            <br />
            <h2>Result <span value={progress} /></h2>
            <textarea name='result' value={result} readOnly />
        </form>
    )
}
export default ReplacementForm


// export class ReplacementForm extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             socket: createSocket([{ cmd: 'replacement', func: (socket, e) => this.onReplacement(socket, e) }]),
//             result: 'To receive the formatted replacement post, please enter the necessary details in the form above.'
//         }
//     }
//     onReplacement(socket, data) {
//         const { author, lastPage, title, url, departingPlayer } = data;
//         let today = getCalendarDate();
//         let result = `${today}\n[i][url=${url}]${title}[/url][/i]\n[b]Moderator:[/b] [user]${author}[/user][tab]3[/tab][tab]3[/tab][b]Status:[/b] ${lastPage} pages [tab]3[/tab] [b]Replacing:[/b] [user]${departingPlayer}[/user]`;
//         this.setState({ result });
//     }
//     submit(event) {
//         event.preventDefault();
//         const gameThread = event.target.gameThread.value;
//         const departingPlayer = event.target.departingPlayer.value;
//         const request = {
//             cmd: 'replacement', data: {
//                 gameThread: gameThread,
//                 departingPlayer: departingPlayer
//             }
//         };
//         this.state.socket.emit('replacement', request);
//     }
//     render() {
//         return (
//             <form onSubmit={this.submit}>
//                 <label htmlFor='gameThread'>Link to Game Thread</label>
//                 <input id='gameThread' name='gameThread' type='text' />
//                 <br />
//                 <label htmlFor='departingPlayer'>Departing Player</label>
//                 <input id='departingPlayer' name='departingPlayer' type='text' />
//                 <br />
//                 <a>+1</a>
//                 <br />
//                 <input type='submit' value='Generate' />
//                 <br />
//                 <h2>Result</h2>
//                 <textarea name='result' value={this.state.result} readOnly />
//             </form>
//         )
//     }
// }

// export default ReplacementForm
