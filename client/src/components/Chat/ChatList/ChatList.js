import { Component } from 'react';

import "./ChatList.css";
import ChatSocketServer from '../ChatSocketServer';

class ChatList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          selectedUserId: null,
          chatListUsers: []
        }
    }
    componentDidMount() {
        const userId = this.props.userId;
        ChatSocketServer.getChatList(userId);
        ChatSocketServer.eventEmitter.on('chat-list-response', this.createChatListUsers);
    }
     
    componentWillUnmount() {
        ChatSocketServer.eventEmitter.removeListener('chat-list-response', this.createChatListUsers);
    }
     
    createChatListUsers = (chatListResponse) => {
        console.log(chatListResponse)
        if (!chatListResponse.error && !chatListResponse.userDisconnected) {
            let chatListUsers = this.state.chatListUsers;
            console.log(chatListResponse.chatList);
            chatListUsers = [...chatListUsers, ...chatListResponse.chatList];
            this.setState({
                chatListUsers: chatListUsers
            });
            console.log(this.state.chatListUsers)
        } else if(chatListResponse.error) {
            alert(`Unable to load Chat list, Redirecting to Login.`);
        }
        this.setState({
            loading: false
        });
    }
    selectedUser = (user) => {
        this.setState({
            selectedUserId: user._id
        });
        this.props.updateSelectedUser(user)
    }
     
    render() {
        return (
            <>
                <ul className={`user-list ${this.state.chatListUsers.length === 0 ? 'visibility-hidden' : ''}`} >
                {
                    this.state.chatListUsers.map( (user, index) => 
                        <li 
                            key={index} 
                            className={this.state.selectedUserId === user._id ? 'active' : ''}
                            onClick={() => this.selectedUser(user)}
                        >
                            {user.name}
                        </li>
                    )
                }
                </ul>
                <div className={`alert 
                        ${this.state.loading ? 'alert-info' : ''} 
                        ${this.state.chatListUsers.length > 0 ? 'visibility-hidden' : ''}`
                }>
                    { this.state.loading|| this.state.chatListUsers.length === 0 ? 'Loading your chat list.' : 'No User Available to chat.'}
                </div>
            </>
        );
    }
}

export default ChatList;