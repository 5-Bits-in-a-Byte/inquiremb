from pymodm import MongoModel, fields
from pymongo.write_concern import WriteConcern
from pymodm.connection import connect
import pymongo
from config import MONGO_URI
import json
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

# print(u)
# print(u.to_son().to_dict())
