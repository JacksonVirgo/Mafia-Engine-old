import React from 'react';
import io from 'socket.io-client';

export default class ToolRoot extends React.Component {
    socket = null;
    state = {
        result: '',
        progress: ''
    }
    componentDidMount() {
        this.initSocketConnection();
        this.setupSocketListeners();
    }
    componentWillUnmount() {
        this.closeSocketConnection();
    }

    initSocketConnection() {
        this.socket = io.connect();
    }
    closeSocketConnection() {
        this.socket.disconnect();
    }
    onClientDisconnect() {
        console.log('Disconnected from Server');
    }
    onClientReconnect() {
        console.log('Reconnected to Client');
    }
    setupSocketListeners() {
        this.addSocketListener('disconnected', this.onClientDisconnect.bind(this));
        this.addSocketListener('reconnect', this.onClientReconnect.bind(this));
        this.addSocketListener('ping', console.log);
    }
    addSocketListener(id, func) {
        this.socket.on(id, func);
    }
}