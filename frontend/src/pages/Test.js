import React from 'react';
import '../css/reset.css';
import '../css/app.css';
import TestSocket from '../components/testSocket';
import { CenterModal } from '../components/centerModal';
export default function Replacement() {
    return (
        <CenterModal title='Vote Count' child={(<TestSocket />)} />
    )
}
