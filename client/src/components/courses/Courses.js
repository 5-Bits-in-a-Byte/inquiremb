import React from "react";
import TopContent from "./TopContent";
import CourseCard from "./CourseCard";

// Temporary hardcoded courses array and term
var coursesArray = ["MTH 342", "CIS 422", "CIS 473"];
var currentTerm = "Winter 2021";

const courseList = coursesArray.map((course) => (
  <CourseCard key={course} courseName={course} courseTerm={currentTerm} />
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
