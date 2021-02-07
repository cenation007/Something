import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

import ChatSocketServer from './ChatSocketServer';

import ChatList from './ChatList/ChatList'
import Conversation from './Conversation/Conversation';

import './ChatHome.css';
class Home extends Component {
    user = {};
    state = {
        isOverlayVisible: true,
        username: '______',
        selectedUser: null
    }

    /*logout = async () => {
        try {
            await ChatHttpServer.removeLS();
            ChatSocketServer.logout({
                userId: this.userId
            });
            ChatSocketServer.eventEmitter.on('logout-response', (loggedOut) => {
                this.props.history.push(`/`);
            });
        } catch (error) {
            console.log(error);
            alert(' This App is Broken, we are working on it. try after some time.');
            throw error;
        }
    }
    */
    setRenderLoadingState = (loadingState) => {
        this.setState({
            isOverlayVisible: loadingState
        });
    }
    getUser =() => {
        return new Promise((resolve, reject) => {
            try {
                resolve( JSON.parse(localStorage.getItem('user')));
            } catch (error) {
                reject(error);
            }
        });
    }
    async componentDidMount() {
        try {
            this.setRenderLoadingState(true);
            this.user = await this.getUser();
            this.setState({
                username: this.user.name
            });
            console.log(this.user.id)
            ChatSocketServer.establishSocketConnection(this.user.id);
            this.setRenderLoadingState(false);
    } catch(error) {
        this.setRenderLoadingState(false);
        this.props.history.push(`/`)
    }
}

getChatListComponent() {
    return this.state.isOverlayVisible ? null : <ChatList userId={this.user.id} updateSelectedUser={this.updateSelectedUser} />
}

getChatBoxComponent = () => {
    return this.state.isOverlayVisible ? null : <Conversation userId={this.user.id} newSelectedUser={this.state.selectedUser} />
}
updateSelectedUser = (user) => {
    this.setState({
        selectedUser: user
    });
}
render() {
    return (
        <div className="App">
            <div className={`${this.state.isOverlayVisible ? 'overlay' : 'visibility-hidden'} `}>
                <h1>Loading</h1>
            </div>
            <main role="main" className="container content" >
                <div className="row chat-content">
                    <div className="col-3 chat-list-container">
                        {this.getChatListComponent()}
                    </div>
                    <div className="col-8 message-container">
                        {this.getChatBoxComponent()}
                    </div>
                </div>
            </main>
        </div>
    );
}
}

export default withRouter(Home)