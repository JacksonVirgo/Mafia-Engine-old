import React, { Component } from 'react'
import style from '../css/centermodal.module.css';

export class CenterModal extends Component {
    constructor(props) {
        super(props);
        this.title = props.title;
        this.child = props.child;
    }
    render() {
        return (
            <div className={style.centerModal}>
                <h1>{this.title}</h1>
                <br />
                {this.child}
            </div>
        )
    }
}