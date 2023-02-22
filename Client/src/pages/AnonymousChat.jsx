import React,{useState} from "react";
import io from "socket.io-client";
import "./Chat.css"
import ChatRoom from "./ChatRoom";

const socket = io.connect("http://localhost:3001");

function AnonymousChat(){

    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const [showChat, setShowChat] = useState(false);
    const [modal,setModal] = useState(false);
    const [showHelpDesk, setShowHelpDesk] = useState(false);
    const toggleModal = () => {
        setModal(!modal)
    }
    const joinRoom = () => {
      if (username !== "" && room !== "") {
        socket.emit("join_room", room);
        console.log(room)
        if(room.includes("HelpDesk"))
        {
            console.log("hi");
            setShowHelpDesk(true);
            console.log(showHelpDesk);
        }else{
            setShowChat(true);
        }
      }
    };
  
    return (
      <div className="Chat">
        {!showChat ? (
          <div className="chatContainer">
            <h3>Join A Chat</h3>
            <input
              type="text"
              placeholder="Name..."
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Room ID..."
              onChange={(event) => {
                setRoom(event.target.value);
              }}
            />
            <button onClick={joinRoom}>Join A Room</button>
            <button onClick={toggleModal}>List of Help Desk Room ID</button>

          </div>
        ) : (
            <>
     
                    <ChatRoom socket={socket} username={username} room={room}/>
             
            
            </>
        )}
      </div>
    );
};



export default AnonymousChat;
/*
              
            {modal && (
                 <div className="modal">
                 <div className="overlay"></div>
                 <div className="modal-content">
                     <h2>HelpDesk Code</h2>
                     <p>Please type the following code</p>
                     <li>HelpDesk</li>
                     <button className="close-modal" onClick={toggleModal}>Close</button>
             </div>
             </div>
            )}
           */
          