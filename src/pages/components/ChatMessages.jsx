import { useEffect } from "react";

const ChatMessages = ({ chat, messages, sendMessage, firstLoadMessages }) => {

  const scrollMessages = () => {

    const messagesContainer = document.querySelector("#root > div > div.messages-container > div.content");
    
    messagesContainer.scrollTo({
      top: messagesContainer.lastChild.offsetTop + 9.5 * 16,
      left: 0,
      behavior: firstLoadMessages ? "instant" : "smooth",
    });
  }

  const handleEnter = e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      sendMessage();
    }
  }

  useEffect(() => {
    scrollMessages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return (
    <>
      <div className="header">
        <span className="title">{chat.name}</span>
      </div>
      <div className="content">
        {
          messages.length === 0 ? (
            <span className="placeholder-message">
              ENVIE A PRIMEIRA MENSAGEM
            </span>
          ) : messages.map((item, index) => {
            return (
              <div
                className={item.isMine ? 'chat-message-container mine' : 'chat-message-container'}
                key={index}>
                <div className="chat-message">
                  <div className="profile">
                    <span className="name">{item.name}</span>
                    <span className="time">{new Date(item.createdAt).toLocaleTimeString().slice(0, 5)}</span>
                  </div>
                  <div className="content">{item.content}</div>
                </div>
              </div>
            )
          })
        }
      </div>
      <div className="form-container">
        <form id="message-form" onSubmit={sendMessage}>
          <textarea
            name="message"
            id="message-input"
            placeholder="Digite sua mensagem"
            rows={5}
            onKeyDown={handleEnter}
          />
          <button>Enviar</button>
        </form>
      </div>
    </>
  )
}

export default ChatMessages;