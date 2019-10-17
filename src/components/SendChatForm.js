import React, { useState } from "react";

const SendMessageForm = (props) => {
    
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (evt) => {
    evt.preventDefault();
    
    props.sendMessage(newMessage);
    setNewMessage("");
  };
  
  return (
    <form
      onSubmit={handleSubmit}
      className="send-message-form">
      <input
        disabled={props.disabled}
        onChange={e => setNewMessage(e.target.value)}
        value={newMessage}
        placeholder="Enter to send"
        type="text" />
      </form>
  );
    
}

export default SendMessageForm