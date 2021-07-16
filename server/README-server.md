# Server

The server folder contains four main files for backend management and two extra folders to keep things organized. The extra folders have their own READMEs so in this README we will just discuss the four main files: app.py, auth.py, config.py, and mongo.py.

## App

Much like App.js on the frontend, app.py handles putting all of the backend together so that the server can run. This component handles request messages, secret key configuration, oauth routes, and linking paths for resources.

## Auth

This component contains functions used to perform user authentication, and secure the rest api.

Users login with their Google or GitHub accounts using the OAuth2 protocol. Once users are logged in they are issued a JWT that continuously identifies them until the token expires. Then, when users send a request to the rest api, the JWT is checked for authorization.

## Config

The config component handles linking all of our environment variables and general configuration components. This includes a list of default colors we use in the app for creating course cards.

## Mongo

This component handles setting up all of our MongoDB models so that each collection has the correct fields and default values. The model format is as follows:

---

## Structure of Backend Resources

- [User Specific Models](#user-specific-models)
- [User Interaction Models](#user-interaction-models)
- [Other](#other)

## User Specific Models

### User Model (Refactored Permissions Model)

```json
{
  "_id": "oasif-jo12j-asdjf-asdf9",
  "anonymousId": "cuk19-lzi91-soc01-cks83",
  "email": "stal@someEmail.com",
  "first": "Seth",
  "last": "Tal",
  "picture": "https://google.com/users/images/aobidsl123",
  "courses": [
    {
      "courseId": "oasif-jo12j-asdjf-asdf9",
      "courseName": "Test course",
      "color": "#ffffff",
      "nickname": null,
      "role": "id of the role" // NEW (04.18.21)
    }
  ]
}
```

### User Course Model (Also shown above inside a user resource)

```json
{
  "courseId": "oasif-jo12j-asdjf-asdf9",
  "courseName": "course name",
  "color": "#ffffff",
  "nickname": null,
  "role": "roleId" // NEW (04.18.21)
}
```

## User Interaction Models

### Post Model

```json
{
  "_id": "oasif-jo12j-asdjf-asdf9",
  "courseId": "vonqJNDJ07yPyiagvKlR",
  "postedBy": {
    "first": "Alec",
    "last": "Springel",
    "_id": "oasif-jo12j-asdjf-asdf9",
    "anonymous": false,
    "picture": "profile-picture-url.com"
  },
  "title": "example",
  "content": "example content",
  "isInstructor": false,
  "isPinned": false,
  "isPrivate": false,
  "instructorCommented": false,
  "reactions": {
    "likes": ["userid123"]
  },
  "comments": 3,
  "createdDate": "2021-03-08 17:46:53.289000",
  "updatedDate": "2021-03-08 18:26:33.128000"
}
```

### New Post Model: Polls

```json
{
  "_id": "oasif-jo12j-asdjf-asdf9",
  "courseId": "vonqJNDJ07yPyiagvKlR",
  "postedBy": {
    "first": "Alec",
    "last": "Springel",
    "_id": "oasif-jo12j-asdjf-asdf9",
    "anonymous": false,
    "picture": "profile-picture-url.com"
  },
  "title": "example",
  "content": {
    "type": "poll",
    "fields": {
        "Cancel final": {
            "votes": 3,
            "users": [userIds....],
            "option": "Cancel final"
        },
        "Make final harder": {
            "users": [userIds....], // Delete users before sending?
            "votes": 3,
            "option": "Make final harder"
        }
    }
  },
  "isInstructor": false,
  "isPinned": false,
  "isPrivate": false,
  "instructorCommented": false,
  "reactions": {
    "likes": ["userid123"]
  },
  "comments": 3,
  "createdDate": "2021-03-08 17:46:53.289000",
  "updatedDate": "2021-03-08 18:26:33.128000"
}
```

### New Post Content Model: Question

```json
{
  "content": {
    "type": "question",
    "text": "????????????????????"
  }
}
```

### New Post Content Model: Announcement

```json
{
  "content": {
    "type": "announcement",
    "text": "????????????????????"
  }
}
```

### Comment Model

```json
{
  "_id": "oasif-jo12j-asdjf-asdf9",
  "postId": "oasif-jo12j-asdjf-asdf9",
  "content": "Your question is stupid",
  "postedBy": {
    "first": "Alec",
    "last": "Springel",
    "_id": "oasif-jo12j-asdjf-asdf9",
    "anonymous": false,
    "picture": "profile-picture-url.com"
  },
  "endorsed": false,
  "replies": [
    {
      "_id": "oasif-jo12j-asdjf-asdf9",
      "content": "",
      "postedBy": {
        "first": "Alec",
        "last": "Springel",
        "_id": "oasif-jo12j-asdjf-asdf9",
        "anonymous": false,
        "picture": "profile-picture-url.com"
      },
      "reactions": {
        "likes": ["userid123"]
      }
    }
  ],
  "reactions": {
    "likes": ["userid123"]
  }
}
```

### Reply Model (Also shown above inside a comment resource)

```json
{
  "_id": "oasif-jo12j-asdjf-asdf9",
  "content": "",
  "postedBy": {
    "first": "Alec",
    "last": "Springel",
    "_id": "oasif-jo12j-asdjf-asdf9",
    "anonymous": false,
    "picture": "profile-picture-url.com"
  },
  "reactions": {
    "likes": ["userid123"]
  }
}
```

## Other

### Course Model

```json
{
  "_id": "shortId_abJl3S",
  "course": "CIS 210",
  "canJoinById": true,
  "instructorID": "oasif-jo12j-asdjf-asdf9",
  // roles update: NEW (05.01.21)
  "roles": {
    "roleId1": ["userId1", "userId2"],
    "roleId2": ["userId1", "userId2", "userId3", "userId4"]
  },
  "defaultRole": "roleId1"
}
```

```json
[
  {
    "userName": "name",
    "imgUrl": "url",
    "roleColor": "#color",
    "roleId": "roleId"
  }
]
```

### Roles Model (OLD)

```json
{
  "_id": "role id goes here",
  "name": "the name of the role goes here",
  "permissions": {
    "publish": {
      "postComment": true,
      "reply": true,
      "poll": true
    },
    "delete": {
      "postComment": true,
      "reply": true,
      "poll": true
    },
    "participation": {
      "reactions": true,
      "voteInPoll": true,
      "pin": true
    },
    "edit": {
      "postComment": true,
      "reply": true,
      "poll": true
    },
    "privacy": {
      "private": true,
      "anonymous": true
    },
    "admin": {
      "banUsers": true,
      "removeUsers": true,
      "announce": true,
      "configure": true,
      "highlightName": true
    }
  }
}
```

### Roles Model (NEW 07.15.21)

```json
{
  "_id": "role id goes here",
  "name": "the name of the role goes here",
  "permissions": {
    "publish": {
      "question": true,
      "announcement": true,
      "poll": true,
      "general": true,
      "comment": true,
      "reply": true
    },
    "delete": {
      "question": true,
      "announcement": true,
      "poll": true,
      "general": true,
      "comment": true,
      "reply": true
    },
    "participation": {
      "reactions": true,
      "voteInPoll": true,
      "pin": true
    },
    "edit": {
      "question": true,
      "announcement": true,
      "poll": true,
      "general": true,
      "comment": true,
      "reply": true
    },
    "privacy": {
      "private": true,
      "anonymous": true
    },
    "admin": {
      "banUsers": true,
      "removeUsers": true,
      "configure": true,
      "highlightName": true
    }
  }
}
```

### Deprecated Models

#### Old User Model

```json
{
  "_id": "oasif-jo12j-asdjf-asdf9",
  "anonymousId": "cuk19-lzi91-soc01-cks83",
  "picture": "https://google.com/users/images/aobidsl123",
  "first": "Alec",
  "last": "Springel",
  "email": "alecspringel@gmail.com",
  "courses": [
    {
      "courseId": "oasif-jo12j-asdjf-asdf9",
      "courseName": "CIS 210",
      "nickname": null,
      "color": "#3e7aab",
      "canPost": true,
      "seePrivate": false,
      "canPin": false,
      "canRemove": false,
      "canEndorse": false,
      "viewAnonymous": false,
      "admin": false
    }
  ]
}
```

### POST get request

```
[full of posts] (polls will have users omitted)
```
