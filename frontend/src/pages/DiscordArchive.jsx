import React, { useState } from 'react';

const mainDiv = {
    display: 'flex',
    flexDirection: 'column',
    width: '100vw',
    height: '100vh',
    color: '#FFF',
    padding: '10px',
};
const form = {
    display: 'flex',
    flexDirection: 'column',
};
const textArea = {
    width: '80%',
};
const button = {
    width: '100px',
};

export default function DiscordArchive() {
    const [pastedData, setPastedData] = useState([]);
    const pasteData = (e) => {
        e.preventDefault();
        const data = e.target.archiveData.value;
        setPastedData(JSON.parse(data).messages);
    };

    return (
        <div style={mainDiv}>
            <form style={form} onSubmit={pasteData}>
                <label htmlFor='archiveData'>Archive Data</label>
                <textarea style={textArea} id='archiveData' name='archiveData'></textarea>
                <input style={button} type='submit' value='Submit' />
            </form>

            <ul>
                {pastedData.map((value, index) => {
                    return (
                        <li key={index}>
                            <span style={{ color: '#F00' }}>{value.author.username}</span> {value.content}
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
