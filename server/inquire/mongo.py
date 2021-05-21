'''
This file explicitly defines the models for our collections and their embedded fields.
It provides default values where necessary and links to the database.

Authors: Brian Gunnarson, Sam Peters, and Alec Springel
Group Name: 5 Bits in a Byte

Last Modified Date: 03/12/2021
'''
from inquire.config import MONGO_URI
from inquire.roles import student
from pymodm import MongoModel, fields, EmbeddedMongoModel
from pymongo.write_concern import WriteConcern
from pymodm.connection import connect
from pymodm.errors import ValidationError
import pymongo
import json
import shortuuid
import datetime
from bson.objectid import ObjectId
import os
import sys
script_dir = os.path.dirname(__file__)


def post_content_validator(content):
    post_type = content.get("type", None)
    if post_type == "poll":
        return True
    elif post_type == "question":
        return True
    elif post_type == "announcement":
        return True
    else:
        raise ValidationError("Post type not recognized")


def role_validator(d, example=None):
    """For use with the Roles Model"""
    # Loop through each field
    #   if field exists:
    #       role_validator(field, example_field)
    if example == None:
        example = student
    for key, item in example.items():
        if key in d:
            if type(item) == dict and type(d[key]) == dict:
                if not role_validator(d[key], example=item):
                    raise ValidationError("Missing key")
            elif type(item) != bool or type(d[key]) != bool:
                raise ValidationError(f"Wrong type in permission field: {key}")
        else:
            raise ValidationError(f"Missing permission field: {key}")

    return True


class User(MongoModel):
    _id = fields.CharField(primary_key=True)
    anonymousId = fields.CharField(required=True, default=ObjectId)
    email = fields.EmailField(blank=True)
    first = fields.CharField(default="Nofirstgiven", blank=True)
    last = fields.CharField(default="Nolastgiven", blank=True)
    picture = fields.URLField()
    courses = fields.EmbeddedDocumentListField(
        'UserCourse', blank=True, required=True)

    def get_course(self, courseId):
        for course in self.courses:
            if course.courseId == courseId:
                return course
        return None

    class Meta:
        write_concern = WriteConcern(j=True)
        connection_alias = 'my-app'

        indexes = [pymongo.IndexModel([('_id', pymongo.ASCENDING)]), pymongo.IndexModel([
            ('anonymousId', pymongo.ASCENDING)], unique=True)]


class UserCourse(EmbeddedMongoModel):
    courseId = fields.CharField(required=True)
    courseName = fields.CharField(required=True)
    nickname = fields.CharField(blank=True)
    color = fields.CharField(blank=True)
    role = fields.CharField(required=True)


'''
Posts use the Course ID to reference the course they belong to.

Although it may seem sensible to attach user references to the course,
it is also unnecessary. Each user's document will contain the courses
they belong to, and their permissions for each course. By storing the
permissions in a single place (the User model), we eliminate the need
to modify/query multiple documents when updating classes or permissions.
'''


class Post(MongoModel):
    _id = fields.CharField(primary_key=True, default=ObjectId)
    courseId = fields.CharField()
    postedBy = fields.DictField()
    title = fields.CharField(required=True)
    content = fields.DictField(required=True, validators=[
                               post_content_validator])
    isInstructor = fields.BooleanField(default=False)
    isPinned = fields.BooleanField(default=False)
    isPrivate = fields.BooleanField()
    instructorCommented = fields.BooleanField(default=False)
    reactions = fields.DictField(default={"likes": []})
    comments = fields.IntegerField(default=0)
    createdDate = fields.DateTimeField(default=datetime.datetime.now)
    updatedDate = fields.DateTimeField(default=datetime.datetime.now)

    def serialize(self, date):
        pass

    class Meta:
        write_concern = WriteConcern(j=True)
        connection_alias = 'my-app'

        indexes = [pymongo.IndexModel([('$**', pymongo.TEXT)])]


class Comment(MongoModel):
    postId = fields.CharField(required=True)
    content = fields.CharField(required=True, default="")
    postedBy = fields.DictField()
    endorsed = fields.BooleanField(default=False)
    replies = fields.EmbeddedDocumentListField('Reply', blank=True)
    reactions = fields.DictField(default={'likes': []})

    class Meta:
        write_concern = WriteConcern(j=True)
        connection_alias = 'my-app'


class Reply(EmbeddedMongoModel):
    _id = fields.CharField(primary_key=True, default=ObjectId)
    content = fields.CharField(required=True, default="")
    postedBy = fields.DictField()
    reactions = fields.DictField(default={'likes': []})


class Course(MongoModel):
    # university = fields.CharField()
    course = fields.CharField()
    canJoinById = fields.BooleanField()
    instructorID = fields.CharField()
    roles = fields.DictField(required=True)
    defaultRole = fields.CharField(required=True)
    _id = fields.CharField(primary_key=True, default=shortuuid.uuid)

    class Meta:
        write_concern = WriteConcern(j=True)
        connection_alias = 'my-app'

        indexes = [pymongo.IndexModel([('$**', pymongo.TEXT)])]


class Role(MongoModel):
    _id = fields.CharField(primary_key=True, default=ObjectId)
    name = fields.CharField(required=True)
    permissions = fields.DictField(default=False, validators=[role_validator])

    class Meta:
        write_concern = WriteConcern(j=True)
        connection_alias = 'my-app'
