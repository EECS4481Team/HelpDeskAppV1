import React from "react"
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import SetAvatar from "./pages/SetAvatar";
import AnonymousChat from "./pages/AnonymousChat";
import GlobalChat from "./pages/GlobalChat";
export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/setAvatar" element={<SetAvatar />}/>
        <Route path="/chat" element={<Chat />}/>
        <Route path="/chat/anon" element={<AnonymousChat />}/>
        <Route path="/globalchat" element={<GlobalChat />}/>
        <Route path="" element={<Login />}/>
        
      </Routes>
    </BrowserRouter>
  );
}


