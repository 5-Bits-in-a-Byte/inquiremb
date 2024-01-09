![Inquire Logo](/client/src/imgs/inquire-logo.png)

## SITE NO LONGER MAINTAINED

[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)
[![Version](https://badge.fury.io/gh/tterb%2FHyde.svg)](https://badge.fury.io/gh/tterb%2FHyde)

---

<p align="left">
  <img alt="Flask" src="https://img.shields.io/badge/flask%20-%23000.svg?&style=for-the-badge&logo=flask&logoColor=white"/>
  <img alt="React" src="https://img.shields.io/badge/react%20-%2320232a.svg?&style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
  <img alt="MongoDB" src ="https://img.shields.io/badge/MongoDB-%234ea94b.svg?&style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img alt="Python" src="https://img.shields.io/badge/python%20-%2314354C.svg?&style=for-the-badge&logo=python&logoColor=white"/>
</p>

A message board for course instructors and students to post questions, provide answers, connect, and communicate. We built Inquire as an intuitive tool to aid professors with classroom discussion and incentivize productive interaction amongst peers.

---

## Founders

Full Stack Devs

- Brian Gunnarson: https://github.com/bgunnar5
- Seth Tal: https://github.com/Sephta
- Alec Springel: https://github.com/alecspringel

Backend Devs

- Sam Peters: https://github.com/sampeters747

Frontend Dev:

- Aaron Van Cleave: https://github.com/AARONJVC

---

## Creation Date

Date this repo was first created: 02/06/2021

Date the site was first publicly launched: 03/11/2021

Date of the first live test in a real classroom: 09/26/2021

---

## Context

Inquire started as a group project @ University of Oregon in Professor Juan Flores's "CIS 422: Software Methodology" course. For the second major assignment in the course we were tasked with forming groups and creating a project from scratch utilizing all of the Software Methodologies we had learned up until that point. The project idea was approved by Juan Flores, and we very quickly mocked up designs for the platform. In a total of 4 weeks we had a fully functioning live website with a vertical slice of what the platform could be. We incorporated 2 unique OAuth systems for user sign-in. We had the basics of our course / user / and content backend models. Most importantly we had the basic message board functionality working with socketio in mind.

## System Architecture

Inquire is set up with a React frontend client and Flask backend server. We incorporated an OAuth2 authentication system for security measures using Google's and (alternatively) GitHub's Oauth systems. Additionally, we utilize a MongoDB document oriented database to store user information, course content, and more. On top of this, to make flow of the website smooth and friendly for all users we included web sockets with socketio.

---

## Deploying Locally with Docker

#### (Out of date, may still work)

### Requirements

Running the project using docker requires the user to have docker installed

### Required Environment Variable File Setup

### If the "docker-env" file is provided continue reading:

Put the docker-env file inside of the /server folder.

### If the "docker-env" file is not provided:

Navigate to the /server and rename the "example-docker-env" file to "docker-env". Then replace the values in each key-value pair in the file with new ones from your Google and Github API accounts.

### Building and running the project with docker

Navigate to the root folder of the project. There should be a docker-compose.yml file inside the folderRun the command

```
docker compose up
```

## Deploying Locally without Docker

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

## Directory Structure

#### (Out of date, subject to change)

There are two main directories in this project: client and server. Client contains all of the frontend work including package.json files and all of the components we created that interact with eachother. Some of these components have to interact with the server in the backend. The server directory is where you'll find code pertaining to this. You'll also see the OAuth2 setup and the models for our MongoDB collections.
