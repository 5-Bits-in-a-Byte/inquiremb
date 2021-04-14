""" Contains tests for the Home resource """
import pytest

def test_get_home(client, test_user):
    
    client.post('/test_user_login', json=test_user)
    
    resp = client.get('/api/home')

    assert resp.status_code == 200

def test_less_than_20_posts(client, test_user):
    
    client.post('/test_user_login', json=test_user)
    
    resp = client.get('/api/home')

    assert len(resp.get_json()) == 4

def test_more_than_20_posts(client, test_user, db):
    
    client.post('/test_user_login', json=test_user)

    course = f"/api/courses/{db['course_ids']['instructor_course']}/posts"
    
    # 21 public posts expected
    for i in range(0, 18):
        
        data = {"title": "post" + str(i), "content": "test content", "isPrivate": False, "isAnonymous": False}
        
        client.post(course, json=data)

    resp = client.get('/api/home')

    assert len(resp.get_json()) == 20

def test_only_public(client, test_user):
    
    client.post('/test_user_login', json=test_user)
    
    resp = client.get('/api/home')

    counter = 0

    for post in resp.get_json():
        
        if post["isPrivate"]:
            assert False
        
        counter = counter + 1

    assert counter == 4