# HelpDeskAppV1

HelpDeskAppV1 is a web-based chat app that is in a pre-alpha build

## Before You Start (Locally)

If you want to run it locally, make sure your have the following installed:

1. Node JS: https://nodejs.org/en/
2. MySQL Workbench (Use MySQL Installer): https://dev.mysql.com/downloads/installer/

Use the following to build the database tables:

```SQL
CREATE DATABASE eecs4481;
USE eecs4481;
CREATE TABLE admin_table (
   User_ID int(11) NOT NULL,
   UserName varchar(45) NOT NULL,
   PasswordHash varchar(80) NOT NULL,
   Email varchar(45) NOT NULL,
   PRIMARY KEY (Email)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE anonymous_user_table (
   User_ID int(11) NOT NULL,
   Name varchar(45) NOT NULL,
   PRIMARY KEY (User_ID)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE private_chatroom_table (
   Chatroom_ID int(11) NOT NULL,
   Helpdesk_User varchar(45) NOT NULL,
   Anonymous_User varchar(45) NOT NULL,
   Chat_Log longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(Chat_Log)),
   PRIMARY KEY (Chatroom_ID)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE public_chatroom_table (
   Chatroom_ID int(11) NOT NULL,
   Helpdesk_Users longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(Helpdesk_Users)),
   Anonymous_Users longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(Anonymous_Users)),
   Chat_Log longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(Chat_Log)),
   PRIMARY KEY (Chatroom_ID)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
 ```

 ## To Run (Locally)

 From the root folder, in a terminal, use the commands:

```bash
cd /HelpDeskAppV1/Client 
```

And install node modules using:

```bash
npm install
```

You can start the frontend with
```bash
npm start
```

Now for the backend, open a new terminal and use:
```bash
cd /HelpDeskAppV1/Server 
```

And install node modules using:

```bash
npm install
```

and create an ".env" file with the following information:

```bash
PORT=3000
DATABASE_USERNAME="dbuserName"
DATABASE_PASSWORD="dbpassword"
DATABASE_NAME="dbName"
DATABASE_HOST="localhost"
JWT_KEY="resxg9ks28Diii1JbbpFDEQu7fsGXMg6BDnOq3N6"
```

You can start the backend with
```bash
npm start
```

Now you can enjoy the app!