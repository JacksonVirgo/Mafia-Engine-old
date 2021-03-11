import React from 'react';
import { CenterModal } from '../components/centerModal';

function TestForm() {
    return <p>Test</p>;
}

export default function Test() {
    return <CenterModal title="Replacement Form" child={<TestForm />} />;
}
