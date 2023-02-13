const express = require("express");
const router = express.Router();
const sql = require('mysql');

router.get("/", (request, response) => 
{ 
    console.log("public room");

    response.send("public room");
});

router.post("/", (request, response) =>
{

});

router.put("/", (request, response) =>
{

});

router.delete("/", (request, response) =>
{

});

module.exports = router;