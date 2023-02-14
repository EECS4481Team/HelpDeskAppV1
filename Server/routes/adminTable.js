const express = require("express");
const parser = require('body-parser');
const router = express.Router();
const mysql = require('mysql');
const fs = require('fs');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
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
    else {console.log("DB Connection successful")};
})

const verifyToken = (request, response, next) => {
    
    if(!request.headers.authorization)
    {
        response.status(401).send("Unauthorized request");
        return
    }
    const token = request.headers["authorization"].split(" ")[1];
    if(!token)
    {
        response.status(401).send("Access denied, No token provided")
        return
    }
    try{
        const decode = jwt.verify(token, process.env.JWT_KEY)
        request.user = decode.user;
        next();
    }catch (err)
    {
        response.status(400).send("Invalid Token")
    }
}

//get name
router.get("/name", verifyToken,  (request, response) => { 

    //problem, sql injection very likely
    con.query(`SELECT Name FROM admin_table WHERE UserName = '${request.query.userName}'`, function (err, result, fields) { 
        if (err) throw err;
        response.send(result);
    })
});

//get ID
router.get("/username", verifyToken, (request, response) => { 
    console.log(request.query);

    //problem, sql injection very likely
    con.query(`SELECT User_ID FROM admin_table WHERE UserName = '${request.query.userName}'`, function (err, result, fields) { 
        if (err) throw err;
        response.send(result);
    })
});

//get email
router.get("/email", verifyToken, (request, response) => { 

    //problem, sql injection very likely
    con.query(`SELECT Email FROM admin_table WHERE UserName = '${request.query.userName}'`, function (err, result, fields) { 
        if (err) throw err;
        response.send(result);
    })
});

//post new admin
router.post("/newAdmin", (request, response) =>
{
    let input = request.body;
    if( !input.username || !input.username || !input.password || !input.email)
    {
        response.status(400).send("All fields must be filled")
        return
    }
    else(
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) {console.log("Salting error")
            response.status(500).send("Salting error")
            return};

            bcrypt.hash(input.password, salt, function(err, hash) {
                if (err) {console.log("Hashing error")
                response.status(500).send("Hashing error")
                return};
                
                con.query(`SELECT COUNT(*) as numRows FROM admin_table`, (err, result) =>
                {
                    let sqlQuery = `INSERT INTO admin_table (User_ID, Name, UserName, PasswordHash, Email) VALUES (${result[0].numRows + 1}, '${input.username}', '${input.username}', '${hash}', '${input.email}' )`;
                    con.query(sqlQuery, function (err, result) {
                        if (err) 
                        {
                            console.log("An admin with this name already exists");
                            response.status(400).send("An admin with this name already exists")
                            return
                        }
        
                        else console.log("1 Admin inserted");
                            response.sendStatus(200);
                        })
                    })
                })
            })
        )
        
});

//login
router.post("/Login", async (request,response) =>
{
    let user = request.body;
    let sqlQuery = `SELECT UserName, PasswordHash FROM admin_table WHERE username = '${user.username}'`

    con.query(sqlQuery, async function (err, result) {
        if (err) console.log(err);   

        if( JSON.stringify(result) == "[]" )
        {
            response.status(400).send("no such user exists")
            console.log("NSU exist")
            return
        }
        
        let validPassword = await bcrypt.compare(user.password, result[0].PasswordHash )
        if( !validPassword )
        {
            response.status(400).send("Incorrect Password")
            console.log("bad password")
            return
        }
        else
        {
            let token = jwt.sign({user}, process.env.JWT_KEY, {
                expiresIn: "1h",
            });
            console.log(token)
            response.status(200).json(token);
            return
        }
    })
})


//put name
router.put("/newName", verifyToken, (request, response) =>
{
    let input = request.body;
    if(verifyUserIdentity(request, response))
    {
        let sqlQuery = `UPDATE admin_table SET Name = '${input.newname}' WHERE UserName = '${input.userName}'`;
        con.query(sqlQuery, function (err, result) {
            if (err) console.log(err);
            else console.log("Admin name update");
        });
        response.sendStatus(200);
    }
});

//put password hash
router.put("/newPassword", verifyToken, (request, response) =>
{
    let input = request.body;
    
    if(verifyUserIdentity(request, response))
    {
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) console.log(err);
        console.log(salt)

        bcrypt.hash(input.newPass, salt, function(err, hash) {
            if (err) console.log(err);
            console.log(hash)

                let sqlQuery = `UPDATE admin_table SET name = '${hash}' WHERE UserName = '${input.userName}'`;
                con.query(sqlQuery, function (err, result) {
                    if (err) console.log(err);
                    else console.log("admin password updated");
                });
        });
     });
    response.sendStatus(200);
    }
});

//put email
router.put("/newEmail", verifyToken, (request, response) =>
{
    let input = request.body;
    let sqlQuery = `UPDATE admin_table SET name = '${input.newMail}' WHERE UserName = '${input.userName}'`;

    if(verifyUserIdentity(request, response))
    {
        con.query(sqlQuery, function (err, result) {
            if (err) console.log(err);
            else console.log("Admin Email update");
        });
        response.sendStatus(200);
    }
});

//delete user
router.delete("/Delete", verifyToken, (request, response) =>
{
    let input = request.body;
    let sqlQuery = `DELETE FROM admin_table WHERE UserName = '${input.userName}'`
    if(verifyUserIdentity(request, response))
    {
        con.query(sqlQuery, function (err, result) {
            if (err) throw err;
            console.log("Number of records deleted: " + result.affectedRows);
        });
        response.sendStatus(200);
    }
});

//function verifies user is the same as the user to be altered/deleted (preventing abuse of admin power against other admins)
function verifyUserIdentity(request, response)
{
    let decode = jwt.verify(request.headers["authorization"].split(" ")[1], process.env.JWT_KEY);
    if(decode.user.userName === request.body.userName)
    {
        return true;
    }
    response.status(400).send("Unauthorized request");
    return false;
}

module.exports = router;