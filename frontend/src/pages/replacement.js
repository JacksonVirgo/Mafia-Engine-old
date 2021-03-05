import React, { useState } from 'react';
import { createSocket } from '../scripts/websockets';
import { getCalendarDate } from '../scripts/dateUtilities';
import { CenterModal } from '../components/centerModal';
import styles from '../css/centermodal.module.css'

function ReplacementForm() {
    const [result, setResult] = useState('');
    const [progress, setProgress] = useState('');
    const socket = createSocket();

    const onReplacement = (e) => {
        const { author, lastPage, title, url } = e;
        let today = getCalendarDate();
        let result = `${today}\n[i][url=${url}]${title}[/url][/i]\n[b]Moderator:[/b] [user]${author}[/user][tab]3[/tab][tab]3[/tab][b]Status:[/b] ${lastPage} pages [tab]3[/tab] [b]Replacing:[/b] [user]${departing}[/user]`;
        setResult(result);
        setProgress('');
    }
    const onSubmit = (e) => {
        e.preventDefault();
        const url = e.target.gameThread.value;
        departing = e.target.departingPlayer.value;
        socket.emit('replacement', { url });
        setProgress('[pending]');
    }
    socket.on('replacement', onReplacement);
    let departing = null;
    return (
        <form className={styles.modalForm} onSubmit={onSubmit}>
            <label className={styles.modalLabel} htmlFor='gameThread'>Link to Game Thread</label>
            <input className={styles.modalInput} id='gameThread' name='gameThread' type='text' />
            <br />
            <label className={styles.modalLabel} htmlFor='departingPlayer'>Departing Player</label>
            <input className={styles.modalInput} id='departingPlayer' name='departingPlayer' type='text' />
            <br />
            <input className={styles.modalSubmit++} type='submit' />
            <br />
            <h2>Result <span value={progress} /></h2>
            <textarea className={styles.modalTextarea} name='result' value={result} readOnly />
        </form>
    )
}

export default function Replacement() {
    return (
        <CenterModal title='Replacement Form' child={(<ReplacementForm />)} />
    )
}
