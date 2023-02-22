import React,{useState} from "react";
import io from "socket.io-client";
import "./Chat.css";
import {Link, useNavigate} from "react-router-dom";
import ChatRoom from "./ChatRoom";
import {ToastContainer, toast} from "react-toastify";
import {chatRoute} from "../utils/APIRoutes";
import axios from "axios";
const socket = io.connect("http://localhost:3001");
function Chat(){

    const [username, setUsername] = useState("")
    const [room,setRoom] = useState("");
    const [showChat, setShowChat] = useState(false);
    var val = "";
  
    if (window.location.pathname == "/chat/anon") {
      localStorage.setItem(`HelpDeskAppV1`, null);
    }

    if (localStorage.getItem(`HelpDeskAppV1`) != null) {
      //Get the "data" from localStorage using key `HelpDeskAppV1`
      var str = localStorage.getItem(`HelpDeskAppV1`);
      //Gives a string in base64, only need info between 2 periods
      var subStr = str.substring(
        str.indexOf('.') + 1, 
        str.lastIndexOf('.')
      );
      //Decode from base64
      var dec = atob(subStr);
      //Get substring between second instance of ':' and first instance of ','
      var newStr = dec.substring(
        dec.indexOf(':"', 10) + 2, 
        dec.indexOf('",')
      );
      //Check string
      console.log(newStr);
      val = newStr;
    }

    const joinRoom = () => {
      if (username !== "" && room !== ""){
        console.log(room);
        socket.emit("join_room",room);
        setShowChat(true);
      }
    };

    
    return (
      <div className="Chat">
        {!showChat ? (
      <div className="chatContainer">
       <h3> Join A Chat</h3>
        <input type="text" placeholder="John ..." value={val} onChange={(event) => {setUsername(event.target.value);}}/>
        <input type="text" placeholder="Room ID ..." onChange={(event) => {setRoom(event.target.value);}}/> 
        <button onClick={joinRoom}> Join A Room</button>
      </div>
        ): (
     <ChatRoom socket={socket} username={username} room={room}/>
     )}
     </div>);
};



export default Chat;
