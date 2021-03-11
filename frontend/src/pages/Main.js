import React from 'react';
import logo from '../img/logo.png';
import styles from '../css/centermodal.module.css';

function renderSubtitle(subtitle) {
    let subtitleCmpt = <h2>{subtitle}</h2>;
    return subtitle ? subtitleCmpt : null;
}

export default function Main(auth) {
    return (
        <div className={styles.centerModal}>
            <img src={logo} alt="Logo" />
            <h1>Mafia Engine</h1>
            {renderSubtitle('Version Beta 1.2')}
            <br />
            <div className="mainmenu">
                <a className={styles.menuoption} href="/rolecard">
                    Role Card
                </a>
                <a className={styles.menuoption} href="/replacement">
                    Replacement Form
                </a>
                <a className={styles.menuoption} href="/votecount">
                    Vote Counter
                </a>
                <a className={styles.menuoption} href="/info">
                    Information
                </a>
                <a className={styles.menuoption} href="/tools">
                    Other Links
                </a>
            </div>
        </div>
    );
}
