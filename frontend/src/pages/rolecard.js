import React from 'react';
import styles from '../css/rolecard.module.css';
import { FaAirbnb } from 'react-icons/fa';

const sidebarData = [
    {
        title: "Import Data",
        link: <FaAirbnb size={44} color='green' />,
        object: null
    }
];

export default function RoleCard() {
    return (
        <div className={styles.root}>
            <header></header>
            <main></main>
            <nav className={styles.sidebar}>
                <ul>
                    {sidebarData.map((val, key) => {
                        return (<li key={key}>{"   "}
                            <div>{val.icon}</div>
                            <div>{val.title}</div>
                        </li>)
                    })}
                </ul>
            </nav>
        </div>
    )

    // <div className='centerModal'>
    //     <img src={logo} alt='Logo' />
    //     <h1>Role Card</h1>
    //     <br />
    //     <div>
    //         This page contains no information as it's
    //         currently in development check back at a
    //         later date.
    //     </div>
    // </div>)
}
