import React, { Component } from 'react'

export class CenterModal extends Component {
    constructor(props) {
        super(props);
        this.title = props.title;
        this.child = props.child;
    }
    render() {
        return (
            <div className='centerModal'>
                <h1>{this.title}</h1>
                <br />
                {this.child}
            </div>
        )
    }
}