import React, { useState, useEffect } from 'react';
import logo from '../res/logo.png';
import '../css/global.css';
import axios from 'axios'


import { RadioButton, TextField } from '../components/form/Input';

const FORUM_REQUEST_URI = 'http://localhost:3001/api/ms/page'
const SETTINGS_REQUEST_URI = 'http://localhost:3001/api/ms/settings';

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
}


/*

TODO:
- Correct mistakes / nicknames with the votes.
- Organize votes into wagons.
- Display wagons as vote-count.

*/

export default function Login(props) {
    const [progress, setProgress] = useState(null);
    const onFormSubmit = async (e) => {
        e.preventDefault();

        setProgress('0%')

        try {
            const requestedURL = new URL(e.target.voteCountThreadUrl.value);
            // Just for test. Ignore posts after 831.

            if (!requestedURL.searchParams.get('t')) throw Error('Invalid URL')

            let hasDatabaseSettings = false;
            const settingsRequest = `${SETTINGS_REQUEST_URI}?t=${requestedURL.searchParams.get('t')}`;
            const settingsResponse = await axios.get(settingsRequest);

            if (settingsResponse.status == 200) hasDatabaseSettings = true;
            if (!hasDatabaseSettings) throw Error('Thread does not have associated database entry.')

            const databaseSettings = settingsResponse.data.settings;
            let dayStarts = databaseSettings.dayStarts;
            if (!dayStarts) dayStarts = [{ count: 1, post: 0 }]

            let latestDay = null;
            for (const day of dayStarts) {
                const { count } = day;
                if (!latestDay) latestDay = day;
                else latestDay = latestDay.count > count ? latestDay : day;
            }

            requestedURL.searchParams.append('start', latestDay.post);

            let allPagesDone = false;
            let currentPage = null;
            let lastPage = null;
            let allVotes = [];

            do {
                const msRequest = FORUM_REQUEST_URI + requestedURL.search;
                const msResponse = await axios.get(msRequest);
                const posts = msResponse.data.posts;
                posts.forEach((value, index) => {
                    if (value.votes.length > 0) {
                        const formattedVote = {
                            voter: value.author,
                            timestamp: value.timestamp,
                            voteData: value.votes
                        }

                        allVotes.push(formattedVote)
                    }
                })

                allPagesDone = true;
            } while (!allPagesDone);
        } catch (err) {
            if (err.response.status === 401) {
                window.location.replace('https://discord.com/api/oauth2/authorize?client_id=843514276383031296&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code&scope=identify%20guilds');
            } else {
                console.error('Form Submission Error', err);
            }
        }
    }


    return (
        <div className='modalMain'>
            <img src={logo} alt='Logo' />
            <h1 style={{ marginBottom: '0', paddingBottom: '0' }}>Vote Counter</h1>
            <p style={{ fontSize: '0.8rem', marginBottom: '12px' }}>Read the <a href='/privacy'>privacy policy</a> to see what we do with your data.</p>

            <form style={formStyle} onSubmit={onFormSubmit}>
                <TextField name='voteCountThreadUrl' label='Thread URL' placeholder={'https://forum.mafiascum.net/viewtopic.php?f=5&t=85371'} defaultValue={'https://forum.mafiascum.net/viewtopic.php?f=23&t=88974&ppp=200'} />

                {/* <div>Vote-Count Data</div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <RadioButton group='dataInputType' name='vcNone' label='None' selected={true} />
                    <RadioButton group='dataInputType' name='vcOnDatabase' label='Database' />
                    <RadioButton group='dataInputType' name='vcInThread' label="In-Thread" />
                    <RadioButton group='dataInputType' name='vcManual' label='Manual' />
                </div> */}
            </form>
        </div>
    );
}
