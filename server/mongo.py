from pymodm import MongoModel, fields
from pymongo.write_concern import WriteConcern
from pymodm.connection import connect
import pymongo
from config import MONGO_URI
import json
import shortuuid
connect(MONGO_URI, alias="my-app")


class User(MongoModel):
    sub = fields.CharField(primary_key=True)
    email = fields.EmailField()
    first = fields.CharField()
    last = fields.CharField()
    instructor = fields.BooleanField(required=True)
    permissions = fields.DictField()

    class Meta:
        write_concern = WriteConcern(j=True)
        connection_alias = 'my-app'

        #indexes = [pymongo.IndexModel([('sub', pymongo.ASCENDING)])]


example_permissions = {
    'course_id_1': ["read", "write", "viewPrivatePosts", "ta"],
    'course_id_2': ["read", "write"]
}


'''
Posts use the Course ID to reference the course they belong to.

Although it may seem sensible to attach user references to the course,
it is also unnecessary. Each user's document will contain the courses
they belong to, and their permissions for each course. By storing the
permissions in a single place (the User model), we eliminate the need
to modify/query multiple documents when updating classes or permissions.
'''


class Post(MongoModel):
    courseid = fields.CharField()
    postedby = fields.DictField()
    title = fields.CharField()
    content = fields.CharField()
    isPinned = fields.BooleanField()
    instructorCommented = fields.BooleanField()
    reactions = fields.DictField()
    comments = fields.IntegerField()
    createdDate = fields.DateTimeField()

    class Meta:
        write_concern = WriteConcern(j=True)
        connection_alias = 'my-app'


class Comment(MongoModel):
    content = fields.CharField()
    postedby = fields.DictField()
    endorsed = fields.BooleanField()
    replies = fields.DictField()
    reactions = fields.DictField()

    class Meta:
        write_concern = WriteConcern(j=True)
        connection_alias = 'my-app'


class Course(MongoModel):
    university = fields.CharField()
    course = fields.CharField()
    canJoinById = fields.BooleanField()
    _id = fields.CharField(primary_key=True, default=shortuuid.uuid())

    class Meta:
        write_concern = WriteConcern(j=True)
        connection_alias = 'my-app'
