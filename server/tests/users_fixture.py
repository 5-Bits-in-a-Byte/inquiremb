import pytest


@pytest.fixture
def test_users():
    users = [
        {
            "_id": "123456789",
            "first": "Testy",
            "last": "DontUseMeOnProdDB",
            "email": "test@test.com",
            "picture": "https://i.imgur.com/nnhQbpY.jpg",
            "courses": []
        },
        {
            "_id": "987654321",
            "first": "Prof. Testy",
            "last": "DontUseMeOnProdDB",
            "email": "test@test.edu",
            "picture": "https://i.imgur.com/nnhQbpY.jpg",
            "courses": []
        },
        {
            "_id": "10101010110",
            "first": "Rob",
            "last": "Robot",
            "email": "rob@test.edu",
            "picture": "https://i.imgur.com/nlc9ONQ.jpg",
            "courses": []
        }
    ]

    return users
