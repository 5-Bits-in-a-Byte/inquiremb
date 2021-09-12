import CourseCard from "../../courses/CourseCard";

/** generateCourseList (list)
 * @brief Creates a list of CourseCards generated from the UserContext course list
 *
 * @param {list} userCourses the list of user courses from the UserContext.
 * @param {function} setUser the method of setting the new UserContext.
 * @returns a list of CourseCard components
 */
export const generateCourseList = (userCourses, setUser) => {
  let ret = [];
  userCourses.forEach((course, index) => {
    ret.push(
      <CourseCard
        key={course.courseId}
        id={course.courseId}
        courseName={course.courseName}
        nickname={course.nickname}
        courseTerm="Winter 2021"
        color={course.color || "#121212"}
        setUser={setUser}
      />
    );
  });
  return ret;
};

/** addNewCourseToList (object, list)
 * @brief takes the new course info from the newCourse object and creates a course to append onto the courseList React State
 *
 * @param {object} newCourse object containing information needed to make a new course card
 * @param {list} courseList the react state list containing all of the React CourseCards
 * @returns new list of courseCards to be updated in React State
 */
export const addNewCourseToList = (newCourse, courseList) => {
  // console.log("Course to add: ", newCourse);
  // console.log("Example from list: ", courseList[0]);
  // console.log("Before: ", "\nCourseList: ", courseList);

  let ret = [];
  for (let i = 0; i < courseList.length; i++) {
    // console.log(courseList[i]);
    ret.push(
      <CourseCard
        key={courseList[i].props.id}
        id={courseList[i].props.id}
        courseName={courseList[i].props.courseName}
        courseTerm="Winter 2021"
        color={courseList[i].props.color || "#121212"}
      />
    );
  }

  ret.push(
    <CourseCard
      key={newCourse.courseId}
      id={newCourse.courseId}
      courseName={newCourse.courseName}
      courseTerm="Winter 2021"
      color={newCourse.color || "#121212"}
    />
  );

  // console.log("After: ", "\nCourseList: ", ret);
  return ret;
};
