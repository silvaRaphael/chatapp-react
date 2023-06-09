import './ChatPage.scss';
import { io } from 'socket.io-client';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../contexts/auth';
import { API_URL } from '../../config';
import ChatMessages from '../components/ChatMessages';

const socket = io(API_URL);

export default function ChatPage() {

  const userId = sessionStorage.getItem('id');
  
  const { signOut } = useContext(AuthContext);

  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState(null);
  const [firstLoadMessages, setFirstLoadMessages] = useState(true);
  const [messages, setMessages] = useState([]);

  const createChat = async e => {

    const ev = e || window.event;
    ev.preventDefault();

    const sessionToken = sessionStorage.getItem('token');
    const user = document.querySelector('#user-input').value;

    if(!user)
      return false;

    try {
      const chatsReq = await fetch(API_URL + '/chats', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': 'Bearer ' + sessionToken,
        },
        body: JSON.stringify({ user })
      });

      const res = await chatsReq.json();

      if (!chatsReq.ok)
        return alert(res.message);

      user.value = '';

      getChats();
    } catch (err) {
      alert(err.message);
    }
  }
  
  const getChats = async () => {

    const userId = sessionStorage.getItem('id');
    const sessionToken = sessionStorage.getItem('token');
    
    if(!userId || !sessionToken)
      return alert('ID e TOKEN são inválidos!');

    try {
      const chatsReq = await fetch(API_URL + '/chats', {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'authorization': 'Bearer ' + sessionToken,
        }
      });

      const res = await chatsReq.json();

      if (!chatsReq.ok) {
        console.log(sessionToken)
        if(chatsReq.status === 401) return signOut();
        return alert(res.message);
      }

      const chats = res.map(item => {

        const { id: chat, updatedAt, users } = item;

        const [{ name }] = users.filter(item => item.id !== userId);

        const chatObject = {
          chat,
          name,
          updatedAt
        };

        return chatObject;
      });

      return setChats(chats);
    } catch (err) {
      alert(err.message);
    }
  }

  const selectChat = (item) => {

    const userId = sessionStorage.getItem('id');

    socket.emit('select_chat', {
      prevChat: chat?.chat,
      chat: item.chat,
      user: userId,
    });
    
    !firstLoadMessages && setFirstLoadMessages(true);
    getMessages(item);
  }

  const getMessages = async ({ chat, name }) => {

    const userId = sessionStorage.getItem('id');
    const sessionToken = sessionStorage.getItem('token');

    try {
      const messagesReq = await fetch(API_URL + '/messages/' + chat, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'authorization': 'Bearer ' + sessionToken,
        }
      });

      const res = await messagesReq.json();

      if (!messagesReq.ok)
        return alert(res.message);

      const messages = res.map(item => {

        const { chat, createdAt, user, content } = item;

        const { id: senderId, name } = user;

        const isMine = userId === senderId;

        const messageObject = {
          chat,
          name,
          content,
          createdAt,
          isMine
        };

        return messageObject;
      });

      const chatInfo = {
        chat,
        name,
      };

      setChat(chatInfo);
      setMessages(messages);
    } catch (err) {
      alert(err.message);
    }
  }

  const sendMessage = async e => {

    const ev = e || window.event;
    ev.preventDefault();

    const userId = sessionStorage.getItem('id');
    const sessionToken = sessionStorage.getItem('token');

    const messageInput = document.querySelector('#message-input');

    if (!messageInput.value)
      return false;

    try {
      const messageObject = {
        chat: chat.chat,
        user: userId,
        content: messageInput.value,
      };

      socket.emit('chat_message', {
        token: sessionToken,
        ...messageObject
      });

      messageInput.value = '';

      getChats();
    } catch (err) {
      alert(err.message);
    }
  }

  const chatMessage = data => {

    console.log(data)

    const userId = sessionStorage.getItem('id');

    const isMine = data.user === userId;

    const messageObject = {
      chat: data.chat,
      name: data.name,
      user: data.user,
      content: data.content,
      createdAt: data.createdAt,
      isMine: isMine
    };

    firstLoadMessages && setFirstLoadMessages(false);
    getChats();
    setMessages((messages) =>[...messages, messageObject]);
  }

  useEffect(() => {

    socket.on('chat_message', chatMessage);

    getChats();

    return () => {
      if(socket) socket.disconnect();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app-container">
      <div className="chats-container">
        <div className="header">
          <span className="title">Meus Chats</span>
          <span className="material-symbols-outlined" id="logout-button" title="Sair" onClick={signOut}>logout</span>
        </div>
        <div className="content">
          {
            chats.map((item, index) => {
              return (
                <div key={index} className="chat-item" onClick={() => selectChat(item)}>
                  <div className="profile">
                    <div className="image">
                      <span className="material-symbols-outlined">
                        face
                      </span>
                    </div>
                    <span className="name">{item.name}</span>
                  </div>
                  <span className="time">{new Date(item.updatedAt).toLocaleTimeString().slice(0, 5)}</span>
                </div>
              )
            })
          }
        </div>
        <div className="chat-form-container">
          <form id="chat-form" onSubmit={createChat}>
            <input name="user" id="user-input" placeholder="Digite um ID" />
            <button>
              <span className="material-symbols-outlined">add</span>
            </button>
          </form>
          <span id="span-my-id">Meu ID: {userId}</span>
        </div>
      </div>
      <div className="messages-container">
        {
          !!chat && <ChatMessages
            chat={chat}
            messages={messages}
            sendMessage={sendMessage}
            firstLoadMessages={firstLoadMessages}
          />
        }
      </div>
    </div>
  )
}