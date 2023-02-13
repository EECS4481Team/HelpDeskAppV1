const express = require("express");
const { resourceLimits } = require('worker_threads');
const mysql = require("mysql");
const dotenv = require('dotenv').config();

const port = process.env.PORT;

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);


const adminAccounts = require("./routes/adminTable.js")
const privChatRooms = require("./routes/privateRoom.js")
const anonAccounts = require("./routes/anonTable.js")
const pubChatRooms = require("./routes/publicRoom.js")

// const test = require("./routes/test.js")

app.set('socketio', io)
app.set('view engine', 'ejs');
// app.use(parser.json());


app.get("/api", (request, response) => /*, next  (also included in function call sometimes) used to declare next function*/ { 
    console.log("Welcome")
    response.status(200).send("Welcome")
});


app.use('/api/admin', adminAccounts)//use this "router" for any page with /adminLogin
app.use('/api/anonymous', anonAccounts)//use this "router" for any page with /anonomousLogin
app.use('/helpDesk', privChatRooms)//use this "router" for any page with /helpDesk
app.use('/chatRooms', pubChatRooms)//use this "router" for any page with /chatRooms
// app.use('/test', test)


server.listen(port, () =>
{
    console.log(`listening on port ${port}`)
});