import boto3
import json
from datetime import datetime
from inquire.config import SNS_TOPIC_ARN

""" Event Model
{
  "actor" : {},   // Seth Tal | Same Peters | etc
  "action" : "",  // created | reacted to | edited | deleted
  "subject" : {}, // meta content attributes
  "topics" : [course, post, comment, reply]
}
"""

# SNS = boto3.client('sns')

# def publishMessage(message, topic_arn=SNS_TOPIC_ARN):
#   """Send Subscription to thingy and do stuff SNS"""

#   response = SNS.publish(
#     TopicArn=topic_arn,
#     MessageAttributes={
#         'Datetime': {
#             'DataType': 'String',
#             'StringValue': str(datetime.now())
#         }
#     },
#     Message=json.dumps(message),
#   )


# def sendEvent(actor, action, subject, topics):
#   message = {
#       'actor': actor,
#       'action': action,
#       'subject': subject,
#       'topics': topics
#   }

#   publishMessage(message)
