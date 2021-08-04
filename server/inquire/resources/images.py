'''
This file deals with the Images resource. It's responsible for handling the post requests
that result in images being uploaded to AWS S3.

Authors: Sam Peters
Group Name: 5 Bits in a Byte

Last Modified Date: 08/4/2021
'''
from logging import error
from flask import request
from flask_restful import Resource, reqparse
from inquire.auth import current_user, permission_layer
from inquire.mongo import *
from inquire.config import S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET_NAME

def create_client():
    client = boto3.client(
        's3',
        aws_access_key_id=S3_ACCESS_KEY,
        aws_secret_access_key=S3_SECRET_KEY,
    )
    return client

def upload_file(file, bucket, object_name, content_type="image/png"):
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """
    # Upload the file
    s3_client = create_client()
    try:
        response = s3_client.put_object(Body=file,
                      Bucket=bucket,
                      Key=object_name,
                      ContentType=content_type)
        print(response)
    except error as e:
        print(e)
        return False
    return True


class Images(Resource):
    @permission_layer(require_login=True)
    def post(self):
        image = request.files.get('imageFile')
        upload_file()
        return self.__serialize(current_user).to_dict()
