import React from 'react'
import { createSocket } from '../scripts/websockets';

export default function TestSocket() {
    const socket = createSocket();
    const submitForm = (e) => {
        e.preventDefault();
        socket.emit('ping', {});
    }
    return (<form onSubmit={submitForm}>
        <input type='submit' value='Submit' />
    </form>);
}