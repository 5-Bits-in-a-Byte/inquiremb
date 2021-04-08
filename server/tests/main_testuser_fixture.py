import pytest


@pytest.fixture
def test_user():
    user = {
        "sub": "123456789",
        "given_name": "Testy",
        "family_name": "DontUseMeOnProdDB",
        "email": "test@test.com",
        "picture": "https://i.imgur.com/nnhQbpY.jpg"
    }

    return user
