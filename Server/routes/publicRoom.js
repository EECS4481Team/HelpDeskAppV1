const express = require("express");
const verify = require('./../verification.js');
const parser = require('body-parser');
const router = express.Router();
const mysql = require('mysql');
const fs = require('fs');
const jwt = require("jsonwebtoken");
require('dotenv').config();

router.use(parser.json());
router.use(parser.urlencoded({extended: true}));

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



//get private chat room
router.get("/get", (request, response) => { 
    console.log("Retrieving a specific private chat room");
    const { ChatRoomID } = request.body;
    const query = `SELECT * FROM private_chatroom_table WHERE Chatroom_ID = ${ChatRoomID}`;
    con.query(query, (error, result) => {
      if (error) throw error;
      response.send(result[0]);
    });
});

// POST method to create a new chat room
router.post("/create", verify.verifyToken, (request, response) => {
    console.log("Creating a new private chat room");
    console.log(request.body);
    input = request.body;
    const query = `INSERT INTO private_chatroom_table (Helpdesk_User, Anonymous_User) 
    VALUES ('${input.HelpDeskUser}', '${input.AnonymousUser}')`;
    con.query(query, (error, result) => {
      if (error) throw error;
      response.send(`Chat room created with ID: ${result.insertId}`);
    });
});



// PUT method to update a chat room
router.put("/update", verify.verifyToken, (request, response) => {
    console.log("Updating a private chat room");
    const { ChatRoomID, HelpDeskUser, AnonymousUser, ChatLog } = request.body;
    const query = `UPDATE private_chatroom_table 
    SET Helpdesk_User = '${HelpDeskUser}', Anonymous_User = '${AnonymousUser}', Chat_Log = '${ChatLog}' 
    WHERE Chatroom_ID = ${ChatRoomID}`;
    con.query(query, (error, result) => {
      if (error) throw error;
      response.send(`Chat room updated with ID: ${ChatRoomID}`);
    });
});

// DELETE method to delete a chat room
router.delete("/delete", verify.verifyToken, (request, response) => {
    console.log("Deleting a private chat room");
    const { ChatRoomID } = request.body;
    const query = `DELETE FROM private_chatroom_table WHERE Chatroom_ID = ${ChatRoomID}`;
    con.query(query, (error, result) => {
      if (error) throw error;
      response.send(`Chat room deleted with ID: ${ChatRoomID}`);
    });
});


module.exports = router;