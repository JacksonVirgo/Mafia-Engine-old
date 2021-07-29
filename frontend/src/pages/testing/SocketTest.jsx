import React, { useEffect } from 'react';
import { useGlobals } from '../../GlobalProvider';

export default function SocketTest() {
    const { socket } = useGlobals();
    useEffect(() => {
        // Without Settings
        socket.emit('genVoteCount', {
            url: 'https://forum.mafiascum.net/viewtopic.php?f=2&t=85951',
        });

        // With Settings
        socket.emit('genVoteCount', {
            url: 'https://forum.mafiascum.net/viewtopic.php?f=2&t=85772',
        });
    }, [socket]);

    socket.on('genVoteCount', (data) => {
        console.log(data);
    });

    return (
        <div className='modalMain'>
            <p>If you found this page, that means that I forgot to remove this in production. Please let me know, thank you </p>
        </div>
    );
}
