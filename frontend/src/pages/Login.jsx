import React, { useState } from 'react';
import logo from '../img/logo.png';

import { useGlobals, useGlobalsUpdate, ACTIONS } from '../GlobalProvider';

export default function Login(props) {
    const [error, setError] = useState('');
    const globalState = useGlobals();
    const globalStateUpdate = useGlobalsUpdate();

    const loginAccount = async (e) => {
        e.preventDefault();
        console.log('Logged In');
        const { loginUsername, loginPassword } = e.target;

        const body = { username: loginUsername.value, password: loginPassword.value };
        globalState.axios
            .post('api/auth/login', body)
            .then((res) => {
                const token = res.data.token;
                globalStateUpdate({ type: ACTIONS.SET_JWT, payload: { jwt: token } });
                props.history.push('/');
            })
            .catch((err) => {
                if (err.response) {
                    switch (err.response.status) {
                        case 401:
                            setError('Incorrect Password');
                            break;
                        case 404:
                            setError('User does not exist');
                            break;
                        case 500:
                            setError('Server error occurred');
                            break;
                        default:
                            setError('Unexpected error occurred');
                            break;
                    }
                } else {
                    setError('Unexpected error occurred');
                }
            });
    };

    return (
        <div className='modalMain'>
            <img src={logo} alt='Logo' />
            <h1>Login Form</h1>
            <div>{error}</div>
            <br />
            <form onSubmit={loginAccount}>
                <div>
                    <label htmlFor='loginUsername'>Username</label>
                    <br />
                    <input id='loginUsername' name='loginUsername' placeholder='Username' />
                </div>
                <div>
                    <label htmlFor='loginPassword'>Password</label>
                    <br />

                    <input id='loginPassword' name='loginPassword' type='password' />
                </div>
                <input type='submit' value='Login' />
            </form>
        </div>
    );
}
