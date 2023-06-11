import React, { useState, useMemo, useCallback } from 'react';
import './Chat.css';
import { TbSend } from 'react-icons/tb';

const Chat = ({ socket, roomId, userName }) => {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSendMessage = useCallback(async () => {
    if (!msg.trim()) return;

    const data = {
      msg: msg,
      roomId,
      time:
        new Date(Date.now()).getHours() +
        ':' +
        new Date(Date.now()).getMinutes(),
      userName,
    };

    try {
      await socket.emit('send__msg', data);
      setMessages((prev) => [...prev, data]);
      setMsg('');
    } catch (err) {
      console.log(err);
    }
  }, [msg, roomId, userName, socket]);

  useMemo(() => {
    socket.on('receive_msg', (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, [socket]);

  return (
    <div className='chatbox'>
      <div className='cb__header'>
        <p>Chat Room #{roomId}</p>
      </div>
      <div className='cb__body'>
        <div className='cb__content'>
          {messages.map((item, i) => {
            return (
              <div
                key={i}
                className={
                  item.userName === userName ? 'my__msg' : 'received__msg'
                }
              >
                <p className='msg'>{item.msg}</p>
                <p className='msg__time'>
                  {item.userName} &#183; {item.time}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className='cb__footer'>
        <input
          type='text'
          placeholder='Enter message...'
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Return') {
              handleSendMessage();
            }
          }}
        />
        <button type='submit' onClick={handleSendMessage}>
          <TbSend fontSize={20} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
