import os
from pymongo import MongoClient

MONGO_URI = os.getenv('MONGO_URI')
DB_TO_UPDATE = os.getenv('DB_TO_UPDATE')

mongoClient = MongoClient(MONGO_URI)

database = mongoClient[DB_TO_UPDATE]

print("DATABASE - ", database)

users = database['user']

print("USERS - ", users)

userObjects = users.find({})

print("COUNT = ", userObjects.count())

print("User Objects - ", userObjects)

for user in userObjects:
  print("USER - ", user)

  newUserProfileData = {
    "about" : user['userProfileData']['about'],
    "bannerColor": user['userProfileData']['bannerColor'],
    "theme": True,
    "receiveEmailNotifications": False,
    "accountFlags" : {
      "emailNotificationPrompt": True,
    },
  }

  print(newUserProfileData)

  user['userProfileData'] = newUserProfileData

  print("UPDATED_USER - ", user)

  users.replace_one({"_id": user["_id"]}, user)

mongoClient.close()
