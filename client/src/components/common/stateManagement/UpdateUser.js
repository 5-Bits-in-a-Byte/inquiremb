/**
 * Use these helper methods to update user context when making certain changes
 */

/** DeleteUserCourse
 * Deletes a course from the UserContext by id. Uses array.filter() to filter is out.
 *
 * @param {object} user the user object containing all user related data. (SHOULD BE A COPY OF THE ORIGINAL OBJECT)
 * @param {string} courseId the courseId to remove from user.courses
 */
export function DeleteUserCourse(user, courseId) {
  //   console.log("User Object to Update: ", user);
  //   console.log("CourseId to remove: ", courseId);

  let filteredCourses = user.courses.filter((val, index, courses) => {
    return val.courseId !== courseId;
  });

  //   console.log("Filtered course array: ", filteredCourses);

  user.courses = filteredCourses;

  //   console.log("User Object after Update: ", user);
}
