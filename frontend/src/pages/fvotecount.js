import React from 'react';
import '../css/reset.css';
import '../css/app.css';
import VoteCount from '../components/forms/voteCount';
import { CenterModal } from '../components/centerModal';
export default function Replacement() {
    return (
        <CenterModal title='Vote Count' child={(<VoteCount />)} />
    )
}
