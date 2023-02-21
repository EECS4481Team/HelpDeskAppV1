import React,{useState} from "react";
import io from "socket.io-client";
import "./Chat.css"
import ChatRoom from "./ChatRoom";
import "react-toastify/dist/ReactToastify.css";
const socket = io.connect("http://localhost:3001");
function Chat(){

    const [username, setUsername] = useState("")
    const [room,setRoom] = useState("");
    const [showChat, setShowChat] = useState(false);
    const cat = localStorage.getItem(`HelpDeskAppV1`);
    console.log(cat);
    
    const joinRoom = () => {
      if (username !== "" && room !== ""){
        socket.emit("join_room",room);
        setShowChat(true);
      }
    };


    return (
      <div className="Chat">
        {!showChat ? (
      <div className="chatContainer">
       <h3> Join A Chat</h3>
        <input type="text" placeholder="John ..." onChange={(event) => {setUsername(event.target.value);}}/>
        <input type="text" placeholder="Room ID ..." onChange={(event) => {setRoom(event.target.value);}}/> 
        <button onClick={joinRoom}> Join A Room</button>
      </div>
        ): (
     <ChatRoom socket={socket} username={username} room={room}/>
     )}
     </div>);
};



export default Chat;