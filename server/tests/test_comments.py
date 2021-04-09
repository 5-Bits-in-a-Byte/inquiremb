""" Contains tests for the Me resource """
import pytest
from collections import defaultdict
from inquire.mongo import *


def test_get_comments_number(client, test_comments, test_user):
    """ Checks if the right number of comments are being returned """
    client.post('/test_user_login', json=test_user)
    comment_counts = defaultdict(int)
    # Counting the comments on every post in the test data set
    for comment in test_comments:
        try:
            comment_counts[comment['postId']] += 1
        except:
            assert not comment

    errors = []
    for post_id, count in comment_counts.items():
        resp = client.get(f'api/posts/{post_id}/comments')
        if resp.status_code == 200:
            if resp.is_json:
                data = resp.get_json()
                comment_ids = set()
                for comment in data:
                    if comment['postId'] != post_id:
                        errors.append("Returned comment on wrong post")
                    if comment['_id'] in comment_ids:
                        errors.append("Returned same comment multiple times")
                    else:
                        comment_ids.add(comment['_id'])
                if len(comment_ids) != count:
                    errors.append(
                        f"Wrong number of returned comments for post: {post_id}")
            else:
                errors.append("Response type is not json")
        else:
            errors.append(
                f"Response status code is {resp.status_code}, not 200")
    assert not errors
