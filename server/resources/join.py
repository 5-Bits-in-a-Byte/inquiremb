from flask_restful import Resource, reqparse
from auth import current_user
from mongo import *
from resources.courses import pick_color, DEFAULT_COLORS


class Join(Resource):
    def post(self):
       # Parse arguments
        parser = reqparse.RequestParser()
        parser.add_argument('course_name')
        parser.add_argument('access_code')
        args = parser.parse_args()

        # Nothing sent to backend
        if (args['access_code'] is None) and (args['course_name'] is None):
            return {'errors': ["Please provide course access code or course name"]}, 400

        # Course name search sent to backend
        elif (args['access_code'] is None) and (args['course_name'] is not None):
            query = Course.objects.raw(
                {'$text': {'$search': args['course_name']}})
            count = query.count()
            if count == 0:
                return {'errors': [f"Course with the name {args['course_name']} does not exist"]}, 400
            else:
                course = query.first()
                instructor = User.objects.raw(
                    {"_id": course.instructorID}).first()

                return {"course_id": course._id, "course": course.course, "first": instructor.first, "last": instructor.last}, 200

        # Access code sent to backend
        else:
            try:
                course = Course.objects.raw(
                    {'_id': args['access_code']}).first()
            except:
                return {'errors': ["Invalid access code"]}, 400

            instructor = User.objects.raw({"_id": course.instructorID}).first()

            return {"course_id": course._id, "course": course.course, "first": instructor.first, "last": instructor.last}, 200

    def put(self):
        current_user.update({"$push": {"courses":
                                       {"course_id": args['access_code'], "course_name": course.course, "color": pick_color(DEFAULT_COLORS)}}})
        pass
