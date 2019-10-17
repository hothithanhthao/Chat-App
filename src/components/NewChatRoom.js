import React, { useState } from "react";

const NewChatRoom = (props) => {
    const [name, setName] = useState("");
  

    const handleSubmit = (evt) => {
        evt.preventDefault();
        
        props.createRoom(name);
        setName("");
    }
    
    
    return (
        <div className="new-room-form">
            <form onSubmit={handleSubmit}>
                <input
                    value={ name }
                    onChange={ e => setName( e.target.value ) }
                    type="text" 
                    placeholder="Create a room" 
                    required />
                <button id="create-room-btn" type="submit">Send</button>
            </form>
        </div>
    );
    
}

export default NewChatRoom