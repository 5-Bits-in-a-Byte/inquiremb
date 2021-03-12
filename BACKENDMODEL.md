# MongoDB Models

```json
// Post Mongo Model
{
    "_id": "oasif-jo12j-asdjf-asdf9",
    "courseid": "vonqJNDJ07yPyiagvKlR",
    "postedby": {
        "first": "Alec",
        "last": "Springel",
        "_id": "oasif-jo12j-asdjf-asdf9",
        "anonymous": false
    },
    "title": "example",
    "content": "example content",
    "isPrivate": false,
    "isPinned": false,
    "instructorCommented": false,
    // Store user Id's to prevent duplicate likes
    "reactions": {
        "likes": [
            "userid123"
        ]
    },
    // Track comment quantity for preview
    "comments": 3,
    "createdDate": new Date()
}


// Comment Mongo Model
{
    "_id": "oasif-jo12j-asdjf-asdf9",
    "content": "Your question is stupid",
    "postedby": {
        "first": "Alec",
        "last": "Springel",
        "_id": "oasif-jo12j-asdjf-asdf9",
        "anonymous": false
    },
    "endorsed": false,
    "replies": [
        {
            "content": "",
            "postedBy": {
                "first": "Alec",
                "last": "Springel",
                "_id": "oasif-jo12j-asdjf-asdf9",
                "anonymous": false
            },
            "reactions": {
                "likes": [
                    "userid123"
                ]
            },
        }
    ],
    "reactions": {
        "likes": [
            "userid123"
        ]
    },
}

// Course
{
    "_id": "shortId_abJl3S",
    "university": "University of Oregon",
    "course": "CIS 210",
    "canJoinById": true,
    "anonymousPosting": true,
}

// User
{
    "_id": "oasif-jo12j-asdjf-asdf9",
    "anonymousId": "cuk19-lzi91-soc01-cks83",
    "picture": "https://google.com/users/images/aobidsl123",
    "first": "Alec",
    "last": "Springel",
    "email": "alecspringel@gmail.com",
    "universities": [
        {
            "name": "University of Oregon",
            "isInstructor": false,
        }
    ],
    "courses": [
        {
            "_id": "oasif-jo12j-asdjf-asdf9",
            "course": "CIS 210",
            "nickname": null,
            "color": "#3e7aab",
            "canPost": true,
            "seePrivate": false,
            "canPin": false,
            "canRemove": false,
            "canEndorse": false,
            "viewAnonymous": false,
        }
    ]
}
```
