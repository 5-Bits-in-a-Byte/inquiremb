import pytest
from bson.objectid import ObjectId


@pytest.fixture
def test_comments():
    comments = [
        {
            "_id": ObjectId('59d7ef576cab3d6118805a21'),
            "postId": "post1id",
            "content": "Wow, what a great question",
            "replies": [],
            "postedBy": {
                "first": "Prof. Testy",
                "last": "DontUseMeOnProdDB",
                "_id": "987654321",
                "anonymous": False,
                "picture": "https://i.imgur.com/nlc9ONQ.jpg",
            }
        },
        {
            "_id": ObjectId("59d7ef576cab3d6118805a22"),
            "postId": "post1id",
            "content": "Yes",
            "replies": [],
            "postedBy": {
                "first": "Testy",
                "last": "DontUseMeOnProdDB",
                "_id": "123456789",
                "anonymous": False,
                "picture": "https://i.imgur.com/nlc9ONQ.jpg",
            }
        },
        {
            "_id": ObjectId("59d7ef576cab3d6118805a23"),
            "postId": "post5id",
            "content": "Wow, what a great question",
            "replies": [],
            "postedBy": {
                "first": "Prof. Testy",
                "last": "DontUseMeOnProdDB",
                "_id": "987654321",
                "anonymous": False,
                "picture": "https://i.imgur.com/nlc9ONQ.jpg",
            }
        },
        {
            "_id": ObjectId("59d7ef576cab3d6118805a24"),
            "postId": "post6id",
            "content": "Yes",
            "replies": [],
            "postedBy": {
                "first": "Testy",
                "last": "DontUseMeOnProdDB",
                "_id": "123456789",
                "anonymous": False,
                "picture": "https://i.imgur.com/nlc9ONQ.jpg",
            }
        }
    ]

    return comments
