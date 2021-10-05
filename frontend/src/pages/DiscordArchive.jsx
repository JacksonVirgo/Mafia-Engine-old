import React, { useState, useEffect } from 'react';
import style from '../styles/modules/archive.module.css';

import exampleArchive from '../resources/exampleArchive.json';

export default function DiscordArchive() {
    const [pastedData, setPastedData] = useState([]);
    const [accounts, setAccounts] = useState([]);

    const pasteData = (e) => {
        e.preventDefault();
        const data = e.target.archiveData.value;
        setPastedData(JSON.parse(data).messages);
    };
    const onFileChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        reader.onload = async (event) => {
            const json = JSON.parse(event.target.result);
            setPastedData(json.messages);
            setAccounts(json.accounts);
        };
        reader.readAsText(e.target.files[0]);
    };

    useEffect(() => {
        // setPastedData(exampleArchive.messages);
        // setAccounts(exampleArchive.accounts);
    }, []);

    const parseMessage = (message) => {
        let newMessage = message;

        // Check for player pings.
        let pings = matchRegex(newMessage, /<@!*&*[0-9]+>/g);
        for (let i = 0; i < pings.length; i++) {
            let pingHandle = pings[i][0];
            let userID = pingHandle.slice(0, -1).substring(2);
            if (accounts[userID]) {
                newMessage = newMessage.replace(pingHandle, `@${accounts[userID].username}`);
            } else {
            }
        }

        return newMessage;
    };

    const matchRegex = (string, regex) => {
        let list = [];
        let matches;
        while ((matches = regex.exec(string)) != null) {
            list.push(matches);
        }
        return list;
    };

    return (
        <div className={style.main}>
            <form onSubmit={pasteData}>
                <label htmlFor='archiveData'>Archive Data</label>
                <input type='file' name='archiveData' id='archiveData' onChange={onFileChange} />
            </form>

            <ul>
                {pastedData.map((value, index) => {
                    return (
                        <li key={index} id={`message_${value.id}`}>
                            <div className={style.contentRoot}>
                                <div className={style.avatar}>
                                    <img src={`https://cdn.discordapp.com/avatars/${value.author.id}/${value.author.avatar}.jpg`} />
                                </div>
                                <div className={style.message}>
                                    <div className={style.username}>{value.author.username}</div>
                                    <div>{value.content}</div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

// export default class ModeratorPanel extends React.Component {
//     constructor() {
//         super();
//         this.state = {
//             menuActive: true,
//         };

//         this.bindFunctions = this.bindFunctions.bind(this);
//         this.bindFunctions();
//     }
//     componentDidMount() {}
//     bindFunctions() {
//         this.onPaste.bind(this);
//     }
//     onPaste(e) {}
//     render() {
//         const content = (
//             <div className={styles.mainDiv}>
//                 <div className={styles.body}>
//                     <div className={styles.content}>
//                         <div onClick={this.onPaste}>Paste Data</div>
//                         <span>Hi</span>
//                     </div>
//                 </div>{' '}
//             </div>
//         );

//         return content;
//     }
// }

// ModeratorPanel.contextType = GlobalContext;
