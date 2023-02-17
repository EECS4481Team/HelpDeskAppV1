import React from 'react';
import ReactDOM from 'react-dom/client';
import style from './index.css';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
    <div class="intro">
    <div class="black"></div>  
    <div class="white"></div>
    <div class="boxfather">
      <div class="box">
        <h1>Anonymous Chat</h1>
        <button type="button" class="btn1" onClick="javascript:window.location='/register'">Enter</button>
      </div>
    </div>
    
  </div>
  
  </>
);



