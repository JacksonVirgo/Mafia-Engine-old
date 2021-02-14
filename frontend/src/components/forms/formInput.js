import React, { Component } from 'react'

class Input extends Component {
    constructor(props) {
        super(props);
    }
    state = {}
    render() {
        return (
            <>
                <label htmlFor={this.props.name} value={this.props.name} />
                <input id={this.props.name} type={this.props.type}></input>
            </>
        );
    }
}

export default Input;