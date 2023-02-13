const express = require("express");
const router = express.Router();
const sql = require('mysql');

router.get("/tests", (request, response, next) =>
{
    let io = request.app.get("socketio");

    io.on('connection', (socket) => {
        console.log('user connected');
        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
    });

    response.status(200).sendFile('D:/VSCode/SharedWVM/JS/HelpDeskApp-BackEnd/index.html');
})

module.exports = router;