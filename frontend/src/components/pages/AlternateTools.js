import React from 'react';
import config from '../../config.json';
import { CenterModal } from '../centerModal';
import styles from '../../css/centermodal.module.css';
import { BrowserRouter as Link } from 'react-router-dom';

function Alternative() {
    const mathblade = () => {
        try {
            fetch(`${config.core}/api/download?id=mathblade`);
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div>
            <span onClick={mathblade}>MathBlade </span>
            <a href={(config.core += '/api/download?id=mathblade')}>MathBlade's Vote Scrubber [download]</a>
        </div>
    );
}

export default function AlternateTools() {
    return <CenterModal title="Alternative Tools" child={<Alternative />} />;
}
