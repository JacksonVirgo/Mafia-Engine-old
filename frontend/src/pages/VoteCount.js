import React from 'react';
import '../css/reset.css';
import '../css/app.css';
import VoteCount from '../components/VoteCountForm';
import { CenterModal } from '../components/centerModal';
export default function VoteCountForm() {
    return (
        <CenterModal title='Vote Count' child={(<VoteCount />)} />
    )
}
