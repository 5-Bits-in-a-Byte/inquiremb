from pymodm import MongoModel, fields, EmbeddedMongoModel
from pymongo.write_concern import WriteConcern
from pymodm.connection import connect
import pymongo
from config import MONGO_URI
import json
import shortuuid
import datetime
from bson.objectid import ObjectId
connect(MONGO_URI, alias="my-app")


class User(MongoModel):
    _id = fields.CharField(primary_key=True)
    anonymousId = fields.CharField(required=True, default=shortuuid.uuid)
    email = fields.EmailField()
    first = fields.CharField(default="Nofirstgiven")
    last = fields.CharField(default="Nolastgiven")
    picture = fields.URLField()
    courses = fields.EmbeddedDocumentListField(
        'UserCourse', blank=True, required=True)

    def get_course(self, course_id):
        for course in self.courses:
            if course.course_id == course_id:
                return course
        return None

    class Meta:
        write_concern = WriteConcern(j=True)
        connection_alias = 'my-app'

        indexes = [pymongo.IndexModel([('_id', pymongo.ASCENDING)]), pymongo.IndexModel([
            ('anonymousId', pymongo.ASCENDING)], unique=True)]


class UserCourse(EmbeddedMongoModel):
    course_id = fields.CharField()
    course_name = fields.CharField(required=True)
    nickname = fields.CharField(blank=True)
    color = fields.CharField(blank=True)
    canPost = fields.BooleanField(default=True)
    seePrivate = fields.BooleanField(default=False)
    canPin = fields.BooleanField(default=False)
    canRemove = fields.BooleanField(default=False)
    canEndorse = fields.BooleanField(default=False)
    viewAnonymous = fields.BooleanField(default=False)
    admin = fields.BooleanField(default=False)


'''
Posts use the Course ID to reference the course they belong to.

Although it may seem sensible to attach user references to the course,
it is also unnecessary. Each user's document will contain the courses
they belong to, and their permissions for each course. By storing the
permissions in a single place (the User model), we eliminate the need
to modify/query multiple documents when updating classes or permissions.
'''


class Post(MongoModel):
    _id = fields.CharField(primary_key=True, default=shortuuid.uuid)
    courseid = fields.CharField()
    postedby = fields.DictField()
    title = fields.CharField(required=True)
    content = fields.CharField(required=True)
    isPinned = fields.BooleanField(default=False)
    isPrivate = fields.BooleanField()
    instructorCommented = fields.BooleanField(default=False)
    reactions = fields.DictField(default={"likes": []})
    comments = fields.IntegerField(default=0)
    createdDate = fields.DateTimeField(default=datetime.datetime.now())
    updatedDate = fields.DateTimeField(default=datetime.datetime.now())

    def serialize(self, date):
        pass

    class Meta:
        write_concern = WriteConcern(j=True)
        connection_alias = 'my-app'

        indexes = [pymongo.IndexModel([('$**', pymongo.TEXT)])]


class Comment(MongoModel):
    post_id = fields.CharField(required=True)
    content = fields.CharField(required=True, default="")
    postedby = fields.DictField()
    endorsed = fields.BooleanField(default=False)
    replies = fields.EmbeddedDocumentListField('Reply', blank=True)
    reactions = fields.DictField(default={'likes': []})

    class Meta:
        write_concern = WriteConcern(j=True)
        connection_alias = 'my-app'


class Reply(EmbeddedMongoModel):
    _id = fields.CharField(primary_key=True, default=shortuuid.uuid)
    content = fields.CharField(required=True, default="")
    postedby = fields.DictField()
    reactions = fields.DictField(default={'likes': []})


class Course(MongoModel):
    # university = fields.CharField()
    course = fields.CharField()
    canJoinById = fields.BooleanField()
    instructorID = fields.CharField()
    _id = fields.CharField(primary_key=True, default=shortuuid.uuid)

    class Meta:
        write_concern = WriteConcern(j=True)
        connection_alias = 'my-app'
