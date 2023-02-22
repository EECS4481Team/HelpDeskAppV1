const express = require("express");
const app = express();
// const { resourceLimits } = require('worker_threads');
const cors = require("cors");
const mysql = require("mysql");
const dotenv = require('dotenv').config();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors:
{ origin: "http://localhost:3000" }});
const verify = require('./verification.js');
const parser = require('body-parser');
const fs = require('fs');
const jwt = require("jsonwebtoken");
require('dotenv').config();


app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;
const databaseHost = process.env.DATABASE_HOST;

const con = mysql.createConnection({
    host: databaseHost,
    user: username,
    password: password,
    database: database
   
});

con.connect( (err) =>
{
    if (err) {console.log(`Failed to connect to database: ${err}`)}
    else {console.log("Connection successful")};
})




const port = process.env.PORT;

const adminAccounts = require("./routes/adminTable.js")
const privChatRooms = require("./routes/privateRoom.js")
const anonAccounts = require("./routes/anonTable.js")
const pubChatRooms = require("./routes/publicRoom.js")

app.set('socketio', io)
// app.set('view engine', 'ejs');
app.use(cors());

app.get("/api", (request, response) => /*, next  (also included in function call sometimes) used to declare next function*/ { 
    console.log("Welcome")
    response.status(200).send("Welcome")
});

app.use('/api/admin', adminAccounts)//use this "router" for any page with /adminLogin
app.use('/api/anonymous', anonAccounts)//use this "router" for any page with /anonomousLogin
app.use('/api/helpdesk', privChatRooms)//use this "router" for any page with /helpDesk
app.use('/api/chatrooms', pubChatRooms)//use this "router" for any page with /chatRooms

io.on("connection", (socket) => {

    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
      //get room from public room, if exists join
      const query = `SELECT * FROM private_chatroom_table WHERE Chatroom_ID = ${data}`;
      
      con.query(query, (error, result) => {
        
        if (error) 
        {
          console.log("error joining room");
          socket.error;
        }
        else if(result != "[]")
        {
          socket.join(data);
          console.log(`User with ID: ${socket.id} joined room: ${data}`);

          con.query(`SELECT COUNT(*) as numRows FROM anonymous_user_table`, (err, result) =>
          {
              con.query(`INSERT INTO anonymous_user_table (User_ID, Name) VALUES (${result[0].numRows + 1}, '${socket.id}')`, function (err, result) {
                  if (err) console.log(err);
                  else console.log("1 record inserted");
              });
            }
          )}
          else
          {
            // socket.emit("error, no such room", (data) =>
            // {
            //   socket.to()
            // })
            console.log("no such room exists");
          };
      });
    })
  
    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
      //log message to public table

      console.log(data);
    });
  
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });

server.listen(port, () =>
{
    console.log(`listening on port ${port}`)
});