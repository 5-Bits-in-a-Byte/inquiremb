import React from "react";
import TopContent from "./TopContent";
import { useParams } from "react-router-dom";

const Courses = () => {
  let { signin } = useParams();
  if (signin) {
    console.log("attempt");
  }
  return (
    <div className="content">
      <TopContent />
    </div>
  );
};

export default Courses;
