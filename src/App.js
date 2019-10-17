import React from 'react';
import Chatkit from '@pusher/chatkit-client';
import ChatList from './components/ChatList';
import NewChatRoom from './components/NewChatRoom';
import ChannelList from './components/ChannelList';
import SendChatForm from './components/SendChatForm';
import './App.css';
import logo from './logo.svg';

import { tokenUrl, instanceLocator } from './config';

class App extends React.Component {

  constructor(){
    super()
    this.state = {
      roomId: null,
      messages: [],
      joinableRooms: [],
      joinedRooms: []
    }
    this.sendMessage = this.sendMessage.bind(this);
    this.subscribeToRoom = this.subscribeToRoom.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.createRoom = this.createRoom.bind(this);
  }

//To fetch data using instanceLocator, userId, and tokenProvider
//instanceLocator and tokenProvider are stored in config.js
  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator,
      userId: 'risa',
      tokenProvider: new Chatkit.TokenProvider({
        url: tokenUrl
      })
    })

    chatManager.connect()
    .then(currentUser => {
      this.currentUser = currentUser
      this.getRooms()
    })
    .catch(err => console.log('error on connecting: ', err));
  }

//getRoom will be called in componentDidMount()

  getRooms(){
    this.currentUser.getJoinableRooms()
      .then(joinableRooms => {
        this.setState({
          joinableRooms,
          joinedRooms: this.currentUser.rooms
        })
      })
      .catch(err => console.log('error on joinableRooms: ', err));
  }

      subscribeToRoom(roomId) {
        this.setState({ messages: [] })
            this.currentUser.subscribeToRoom({
              roomId: roomId,
              hooks: {
                onMessage: message => {
                  this.setState({
                    messages: [...this.state.messages, message]
                  })
                }
              }
            }).then(room => {
              this.setState({
                roomId: room.id
              })
              this.getRooms()
            })
            .catch(err => console.log('error on subscribing to room: ', err));
      }

      sendMessage(text){
        this.currentUser.sendMessage({
          text,
          roomId: this.state.roomId
        })
      }

      createRoom(name) {
        this.currentUser.createRoom({
            name
        })
        .then(room => this.subscribeToRoom(room.id))
        .catch(err => console.log('error with createRoom: ', err))
    }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Cognite boilerplate</h1>
        </header>
        <div className="app">
              <ChannelList 
                  subscribeToRoom={this.subscribeToRoom} 
                  rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}
                  roomId={this.state.roomId}
             />
              <ChatList 
                  roomId={this.state.roomId} 
                  messages={this.state.messages} 
              />
              <SendChatForm 
                  disabled={!this.state.roomId} 
                  sendMessage={this.sendMessage} 
              />
              <NewChatRoom createRoom={this.createRoom} />
          </div>
      </div>
    );
  }
}

export default App;
