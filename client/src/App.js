import React, { useState, useCallback } from 'react';
import './App.css';
import { io } from 'socket.io-client';
import Chat from './components/chat/Chat';

const socket = io.connect('http://localhost:4000/');

function App() {
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState('');

  const handleJoinRoom = useCallback(
    async (e) => {
      e.preventDefault();

      if (!userName || !roomId)
        return setError('Plese fill the form to join a chat');

      try {
        await socket.emit('join_room', roomId);
        setError('');
        setShowChat(true);
      } catch (err) {
        console.log(err);
      }
    },
    [userName, roomId]
  );

  return (
    <div className='App'>
      {!showChat ? (
        <div className='join__room'>
          <h2>Join a Chat</h2>
          <form className='join__room__form' onSubmit={handleJoinRoom}>
            {error && <p className='error'>{error}</p>}

            <input
              type='text'
              placeholder='Enter your name'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type='text'
              placeholder='Enter room ID'
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button type='submit'>Join Chat</button>
          </form>
        </div>
      ) : (
        <Chat socket={socket} userName={userName} roomId={roomId} />
      )}
    </div>
  );
}

export default App;
