import pytest


@pytest.fixture
def test_posts():
    posts = [
        {
            "_id": "post1id",
            "courseId": "course1",
            "title": "NonAnonymous/Public Title",
            "content": "Test content. What are variables?",
            "isPrivate": False,
            "postedBy": {
                "first": "Rob",
                "last": "Robot",
                "_id": "10101010110",
                "anonymous": False,
                "picture": "https://i.imgur.com/nlc9ONQ.jpg",
            }
        },
        {
            "_id": "post2id",
            "courseId": "course1",
            "title": "Anonymous/Public Title",
            "content": "Test content. What are variables?",
            "isPrivate": False,
            "postedBy": {
                "first": "Anonymous",
                "last": "",
                "_id": "00000010110",
                "anonymous": True,
            }
        },
        {
            "_id": "post3id",
            "courseId": "course1",
            "title": "Anonymous/Private Title",
            "content": "Test content. What are variables?",
            "isPrivate": True,
            "postedBy": {
                "first": "Anonymous",
                "last": "",
                "_id": "00000010110",
                "anonymous": True,
            }
        },
        {
            "_id": "post4id",
            "courseId": "course1",
            "title": "NonAnonymous/Private Title",
            "content": "Test content. What are variables?",
            "isPrivate": True,
            "postedBy": {
                "first": "Rob",
                "last": "Robot",
                "_id": "10101010110",
                "anonymous": False,
                "picture": "https://i.imgur.com/nlc9ONQ.jpg",
            }
        },
        {
            "_id": "post5id",
            "courseId": "course2",
            "title": "NonAnonymous/Public Title",
            "content": "Test content. What are variables?",
            "isPrivate": False,
            "postedBy": {
                "first": "Rob",
                "last": "Robot",
                "_id": "10101010110",
                "anonymous": False,
                "picture": "https://i.imgur.com/nlc9ONQ.jpg",
            }
        },
        {
            "_id": "post6id",
            "courseId": "course2",
            "title": "Anonymous/Public Title",
            "content": "Test content. What are variables?",
            "isPrivate": False,
            "postedBy": {
                "first": "Anonymous",
                "last": "",
                "_id": "00000010110",
                "anonymous": True,
            }
        },
        {
            "_id": "post7id",
            "courseId": "course2",
            "title": "Anonymous/Private Title",
            "content": "Test content. What are variables?",
            "isPrivate": True,
            "postedBy": {
                "first": "Anonymous",
                "last": "",
                "_id": "00000010110",
                "anonymous": True,
            }
        },
        {
            "_id": "post8id",
            "courseId": "course2",
            "title": "NonAnonymous/Private Title",
            "content": "Test content. What are variables?",
            "isPrivate": True,
            "postedBy": {
                "first": "Rob",
                "last": "Robot",
                "_id": "10101010110",
                "anonymous": False,
                "picture": "https://i.imgur.com/nlc9ONQ.jpg",
            }
        },
    ]

    return posts
