
import React, { Component } from 'react';

import './Conversation.css';
import ChatSocketServer from '../ChatSocketServer';
import axios from 'axios'
class Conversation extends Component {
    constructor(props) {
        super(props);
        this.state = {
          messageLoading: true,
          conversations: [],
          selectedUser: null
        }
        this.messageContainer = React.createRef();
      }
    componentDidMount() {
        ChatSocketServer.receiveMessage();
        ChatSocketServer.eventEmitter.on('add-message-response', this.receiveSocketMessages);
    }
     
    componentWillUnmount() {
        ChatSocketServer.eventEmitter.removeListener('add-message-response', this.receiveSocketMessages);
    }
    
    static getDerivedStateFromProps(props, state) {
        if (state.selectedUser === null || state.selectedUser._id !== props.newSelectedUser._id) {
            
            return {
                selectedUser: props.newSelectedUser
            };
        }
        return null;
    }
    componentDidUpdate(prevProps) {
        if (prevProps.newSelectedUser === null || (this.props.newSelectedUser._id !== prevProps.newSelectedUser._id)) {
            this.getMessages();
        }
    }
    getMessagesHandler(userId, toUserId) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post('/getMessages', {
                    userId: userId,
                    toUserId: toUserId
                });
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        });
    }
    scrollMessageContainer() {
        if (this.messageContainer.current !== null) {
          try {
            setTimeout(() => {
              this.messageContainer.current.scrollTop = this.messageContainer.current.scrollHeight;
            }, 100);
          } catch (error) {
            console.warn(error);
          }
        }
      }
    getMessages = async () => {
        try {
            const { userId, newSelectedUser } = this.props;
            const messageResponse = await this.getMessagesHandler(userId, newSelectedUser._id);
            console.log(messageResponse)
            if (!messageResponse.error) {
                this.setState({
                    conversations: messageResponse.messages,
                });
                this.scrollMessageContainer();
            } else {
                alert('Unable to fetch messages');
            }
            this.setState({
                messageLoading: false
            });
        } catch (error) {
            this.setState({
                messageLoading: false
            });
        }
    }
    alignMessages(toUserId) {
        const { userId } = this.props;
        return userId !== toUserId;
    }

    getMessageUI() {
        return (
            <ul ref={this.messageContainer} className="message-thread">
                {
                    this.state.conversations.map((conversation, index) =>
                        <li className={`${this.alignMessages(conversation.toUserId) ? 'align-right' : ''}`} key={index}> {conversation.message} </li>
                    )
                }
            </ul>
        )
    }

    getInitiateConversationUI() {
        if (this.props.newSelectedUser !== null) {
            return (
                <div className="message-thread start-chatting-banner">
                    <p className="heading">
                        You haven 't chatted with {this.props.newSelectedUser.name} in a while,
                <span className="sub-heading"> Say Hi.</span>
                    </p>
                </div>
            )
        }
    }
    sendAndUpdateMessages(message) {
        try {
            ChatSocketServer.sendMessage(message);
            this.setState({
                conversations : [...this.state.conversations, message]
            });
            this.scrollMessageContainer();
        } catch (error) {
            alert(`Can't send your message`);
        }
    }
    sendMessage = (event) => {
        if (event.key === 'Enter') {
            const message = event.target.value;
            const { userId, newSelectedUser } = this.props;
            if (message === '' || message === undefined || message === null) {
                alert(`Message can't be empty.`);
            } else if (userId === '') {
                this.router.navigate(['/']);
            } else if (newSelectedUser === undefined) {
                alert(`Select a user to chat.`);
            } else {
                this.sendAndUpdateMessages({
                    fromUserId: userId,
                    message: (message).trim(),
                    toUserId: newSelectedUser._id,
                });
                event.target.value = '';
            }
        }
    }
    receiveSocketMessages = (socketResponse) => {
        const { selectedUser } = this.state;
        if (selectedUser !== null && selectedUser._id === socketResponse.fromUserId) {
            this.setState({
                conversations: [...this.state.conversations, socketResponse]
            });
            this.scrollMessageContainer();
        }
    }
    render() {
        const { messageLoading, selectedUser } = this.state;
        return (
            <>
                <div className={`message-overlay ${!messageLoading ? 'invisible' : 'visible'}`}>
                    <h3> {selectedUser !== null && selectedUser.name ? 'Loading Messages' : ' Select a User to chat.'}</h3>
                </div>
                <div className={`message-wrapper ${messageLoading ? 'visibility-hidden' : ''}`}>
                    <div className="message-container">
                        <div className="opposite-user">
                            Chatting with {this.props.newSelectedUser !== null ? this.props.newSelectedUser.name : '----'}
                        </div>
                        {this.state.conversations.length > 0 ? this.getMessageUI() : this.getInitiateConversationUI()}
                    </div>

                    <div className="message-typer">
                        <form>
                            <textarea className="message form-control" placeholder="Type and hit Enter" onKeyPress={this.sendMessage}>
                            </textarea>
                        </form>
                    </div>
                </div>
            </>
        );
    }
}

export default Conversation;