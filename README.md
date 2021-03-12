# Inquire

Welcome to Inquire, a message board/forum for course instructors and students to post questions, provide answers, connect, and communicate.

## Founders

Brian Gunnarson: https://github.com/bgunnar5

Sam Peters: https://github.com/sampeters747

Alec Springel: https://github.com/alecspringel

Seth Tal: https://github.com/Sephta

Aaron Van Cleave: https://github.com/AARONJVC

## Creation Date

Date this repo was first created: 02/06/2021

Date the site was first publicly launched: 03/11/2021

## Course Name/Assignment

This project was created as the second group assignment for CIS 422 taught by Prof. Juan Flores at the University of Oregon.

## System Architecture

Inquire is set up with a React frontend and Flask backend. We incorporated an OAuth2 authentication system for security measures. Additionally, we decided to hook our server up to a MongoDB database to store user information, course content, and more. On top of this, to make flow of the website smooth and friendly for all users we included web sockets with socket.io.

## How to Deploy Locally

### Client Startup

```
cd client
npm run start
```

To bring Node modules up to date:

```
cd client
npm install
```

### Server Startup

```
cd server
*start your virtual environment*
python app.py
```

To bring Python modules up to date:

```
cd server
*start your virtual environment*
pip install -r requirements.txt
```

## How to Use Publicly

If you have a Google or GitHub account you can log into our site at https://inquiremb.com/login.

## Directory Structure

There are two main directories in this project: client and server. Client contains all of the frontend work including package.json files and all of the components we created that interact with eachother. Some of these components have to interact with the server in the backend. The server directory is where you'll find code pertaining to this. You'll also see the OAuth2 setup and the models for our MongoDB collections. Below is a visual of the directory structure:

![comment draft](/client/src/imgs/md-directory-layout.png)
