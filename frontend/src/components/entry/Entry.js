import LoginForm from './LoginForm';
import Menu from './Menu';
import React, { Component } from 'react'
import { MainMenu } from '../MainMenu';

export default class Entry extends Component {
    constructor(props) {
        super(props);
        this.state = { token: '' };
    }
    submitHandler(e) {
        e.preventDefault();
        console.log('E');
    }
    render() {
        return (
            <div>{(this.state?.token != '') ? (<Menu />) : (<LoginForm submit={this.submitHandler} />)}</div>
        )
    }
}