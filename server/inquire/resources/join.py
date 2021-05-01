'''
This file deals with the Join resource. It's responsible for handling all requests sent from
the frontend for joining a course. The post request is used to obtain the course id, name,
and instructor name. The put request is used to update the user's list of classes.

Authors: Brian Gunnarson
Group Name: 5 Bits in a Byte

Last Modified Date: 03/12/2021
'''
from flask_restful import Resource, reqparse
from inquire.auth import current_user
from inquire.mongo import *
from inquire.resources.courses import pick_color, DEFAULT_COLORS


class Join(Resource):
    def post(self):
        """
        Begins adding user to course
        ---
        tags:
          - Other
        parameters:
          - name: body
            in: body
            description: Course the user wants to join
            required: true
            schema:
              type: object
              properties:
                courseName:
                  type: string
                  description: Name of the course
                  example: CIS 499 Advanced Debugging
                accessCode:
                  type: string
                  description: Access code for the course
                  example: ihuaweoliawfeh
        responses:
          200:
            description: Returns additional course information
            schema:
              type: object
              properties:
                courseName:
                  type: string
                  description: Name of the course
                  example: CIS 499 Advanced Debugging
                courseId:
                  type: string
                  description: Id of the course
                  example: qewruiopq12313
                first:
                  type: string
                  description: Instructor first name
                  example: Sam
                last:
                  type: string
                  description: Instructor last name
                  example: Peters
          400:
            schema:
              $ref: '#/definitions/400Response'
        """
        parser = reqparse.RequestParser()
        parser.add_argument('courseName')
        parser.add_argument('accessCode')
        args = parser.parse_args()

        # Nothing sent to backend
        if (args['accessCode'] is None or args['accessCode'] == "") and (args['courseName'] is None or args['courseName'] == ""):
            return {'errors': ["Please provide course access code or course name"]}, 400

        # Course name search sent to backend
        elif (args['accessCode'] is None or args['accessCode'] == "") and (args['courseName'] is not None):
            query = Course.objects.raw(
                {'$text': {'$search': args['courseName']}})
            count = query.count()
            if count == 0:
                return {'errors': [f"Course with the name {args['courseName']} does not exist"]}, 400
            else:
                course = query.first()
                instructor = User.objects.raw(
                    {"_id": course.instructorID}).first()

                return {"courseId": course._id, "course": course.course, "first": instructor.first, "last": instructor.last}, 200

        # Access code sent to backend
        else:
            try:
                course = Course.objects.raw(
                    {'_id': args['accessCode']}).first()
            except:
                return {'errors': ["Invalid access code"]}, 400

            instructor = User.objects.raw({"_id": course.instructorID}).first()

            return {"courseId": course._id, "course": course.course, "first": instructor.first, "last": instructor.last}, 200

    def put(self):
        """
        Confirms adding user to course
        ---
        tags:
          - Other
        parameters:
          - name: body
            in: body
            description: Course the user wants to join
            required: true
            schema:
              type: object
              properties:
                courseId:
                  type: string
                  description: Id of the course
                  example: abcde12389
        responses:
          200:
            description: Returns successful delete
            schema:
              type: object
              properties:
                success:
                  required: true
                  type: string
                  example: Course joined successfully
                course:
                  $ref: '#/definitions/UserCourse'
          400:
            schema:
              $ref: '#/definitions/400Response'
        """
        parser = reqparse.RequestParser()
        parser.add_argument('courseId')
        args = parser.parse_args()

        query = Course.objects.raw({"_id": args['courseId']})
        count = query.count()

        # Error checking even though these errors shouldn't be possible based on the post request
        if count > 1:
            return {"errors": ["Multiple courses with this course id"]}, 400
        elif count == 0:
            return {"errors": [f"Course with id {args['courseId']} does not exist"]}, 400
        else:

            for course in current_user.courses:
                if args['courseId'] == course.courseId:
                    return {"errors": ["You have already joined this class"]}, 400

            course_to_add = query.first()
            color = pick_color(DEFAULT_COLORS)

            user_course = UserCourse(
                courseId=args['courseId'], courseName=course_to_add.course, color=color, role=course_to_add.defaultRole)

            current_user.courses.append(user_course)

            current_user.save()

            course_to_add.roles[course_to_add.defaultRole].append(current_user._id)

            course_to_add.save()

            result = user_course.to_son()

            return {"success": ["Course joined successfully"], "course": result}, 200
