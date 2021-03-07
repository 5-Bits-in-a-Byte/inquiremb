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
        if (args['access_code'] is None or args['access_code'] == "") and (args['course_name'] is None or args['course_name'] == ""):
            return {'errors': ["Please provide course access code or course name"]}, 400

        # Course name search sent to backend
        elif (args['access_code'] is None or args['access_code'] == "") and (args['course_name'] is not None):
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
        # Parse arguments
        parser = reqparse.RequestParser()
        parser.add_argument('course_id')
        args = parser.parse_args()

        print(args.course_id)

        query = Course.objects.raw({"_id": args['course_id']})
        count = query.count()

        # Error checking even though these errors shouldn't be possible based on the post request
        if count > 1:
            return {"errors": ["Multiple courses with this course id"]}, 400
        elif count == 0:
            return {"errors": [f"Course with id {args['course_id']} does not exist"]}, 400
        else:
            course_to_add = query.first()

            # Appends the course with permissions to the user who created it
            user_query = User.objects.raw({'_id': current_user._id})
            user = user_query.first()

            for course in user.courses:
                if args['course_id'] == course.course_id:
                    return {"errors": ["You have already joined this class"]}, 400

            user_query.update({"$push": {"courses": {
                "course_id": args['course_id'], "course_name": course.course_name, "color": pick_color(DEFAULT_COLORS)}}})

            return {"success": "Course joined successfully"}, 200
