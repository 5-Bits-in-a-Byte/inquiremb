from pymodm import MongoModel, fields, EmbeddedMongoModel
from pymongo.write_concern import WriteConcern
from pymodm.connection import connect
import pymongo
from config import MONGO_URI
import json
import shortuuid
connect(MONGO_URI, alias="my-app")


class User(MongoModel):
    _id = fields.CharField(primary_key=True)
    anonymousId = fields.CharField(required=True, default=shortuuid.uuid())
    email = fields.EmailField()
    first = fields.CharField(default="Nofirstgiven")
    last = fields.CharField(default="Nolastgiven")
    picture = fields.URLField()
    universities = fields.EmbeddedDocumentListField('UserUniversity')
    courses = fields.EmbeddedDocumentListField('UserCourse')

    class Meta:
        write_concern = WriteConcern(j=True)
        connection_alias = 'my-app'

        indexes = [pymongo.IndexModel([('_id', pymongo.ASCENDING)]), pymongo.IndexModel([
            ('anonymousId', pymongo.ASCENDING)], unique=True)]


class UserUniversity(EmbeddedMongoModel):
    name = fields.CharField(required=True)
    instructor = fields.BooleanField(required=True)


class UserCourse(EmbeddedMongoModel):
    course_id = fields.CharField()
    course_name = fields.CharField(required=True)
    nickname = fields.CharField(blank=True)
    color = fields.CharField()
    canPost = fields.BooleanField(default=True)
    seePrivate = fields.BooleanField(default=False)
    canPin = fields.BooleanField(default=False)
    canRemove = fields.BooleanField(default=False)
    canEndorse = fields.BooleanField(default=False)
    viewAnonymous = fields.BooleanField(default=False)


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
    title = fields.CharField()
    content = fields.CharField()
    postedby = fields.CharField()
    comments = fields.CharField()
    likes = fields.CharField()
    pinned = fields.BooleanField()

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
