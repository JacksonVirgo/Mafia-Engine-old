import React, { useState, useEffect } from 'react';
import Form from '../components/forms/Form';
import Modal from '../components/pages/Modal';

import { useGlobals, useGlobalsUpdate, ACTIONS } from '../GlobalProvider';

const Replace = () => {
    const [result, setResult] = useState('');
    const [progress, setProgress] = useState('Result');
    const { socket } = useGlobals();
    const dispatch = useGlobalsUpdate();

    useEffect(() => {
        dispatch({
            type: ACTIONS.CHANGE_SOCKET_LISTENER,
            payload: {
                socketListeners: [{ tag: 'genReplace', func: onGenReplace }],
            },
        });
    }, [dispatch]);

    const onGenReplace = (data) => {
        const { error, form } = data;
        if (error || !form) {
            setResult(error ? data.message : 'An Error has Occurred');
            setProgress('Error');
        } else {
            setResult(form);
            setProgress('Completed');
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const url = e.target.url.value;
        const user = e.target.departing.value;

        socket.emit('genReplace', { url, user });
        setProgress('[pending]');
        setResult('Pending');
    };

    return (
        <Modal
            title='Replacement Form'
            children={[
                <Form
                    key='replacementForm'
                    onSubmit={onSubmit}
                    submitText='Generate'
                    children={[
                        { name: 'url', label: 'Game URL', type: 'text' },
                        { name: 'departing', label: 'Departing User', type: 'text' },
                    ]}
                />,
                <div key='result' className='modalResult'>
                    <h3>
                        <span>{progress}</span>
                    </h3>
                    <textarea defaultValue={result} readOnly />
                </div>,
            ]}
        />
    );
};

export default Replace;
