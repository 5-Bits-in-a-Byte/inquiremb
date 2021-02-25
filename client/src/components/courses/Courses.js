import React from "react";
import TopContent from "./TopContent";
import StyledCourseCard from "./CourseCard";

// Temporary hardcoded courses array and term
var coursesArray = [
  "MTH 342",
  "CIS 422",
  "CIS 473",
  "PSY 201",
  "SOC 104",
  "MTH 101",
  "ART 258",
];
var currentTerm = "Winter 2021";

const courseList = coursesArray.map((course, index) => (
  <StyledCourseCard
    key={course}
    courseName={course}
    courseTerm={currentTerm}
    index={index}
  />
));

const Courses = () => {
  return (
    <div className="content">
      <TopContent />
      {courseList}
    </div>
  );
};

export default Courses;
