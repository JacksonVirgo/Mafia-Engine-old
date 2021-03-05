import React, { useState } from 'react'
import { createSocket } from '../scripts/websockets';
import { getCalendarDate } from '../scripts/dateUtilities';
// eslint-disable-next-line
import ToolRoot from './ToolRoot';

// class Replacement extends ToolRoot {

// }


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
            <input type='submit' />
            <br />
            <h2>Result <span value={progress} /></h2>
            <textarea name='result' value={result} readOnly />
        </form>
    )
}
export default ReplacementForm