import boto3
import json
from datetime import datetime
from inquire.config import SQS_QUEUE_URL

""" Event Model
{
  "actor" : {},   // Seth Tal | Same Peters | etc
  "action" : "",  // created | reacted to | edited | deleted
  "subject" : {}, // meta content attributes
  "topics" : [course, post, comment, reply]
}
"""

SQS = boto3.client('sqs')


def sendQueueMessage(message, queue_url=SQS_QUEUE_URL):
  """Send message to SQS Queue"""

  response = SQS.send_message(
    QueueUrl=queue_url,
    DelaySeconds=0,
    MessageAttributes={
        'Datetime': {
            'DataType': 'String',
            'StringValue': str(datetime.now())
        }
    },
    MessageBody=json.dumps(message),
  )


def sendEvent(actor, action, subject, topics):
  message = {
      'actor': actor,
      'action': action,
      'subject': subject,
      'topics': topics
  }

  sendQueueMessage(message)
