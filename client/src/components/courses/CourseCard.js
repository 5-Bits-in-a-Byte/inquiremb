import React from "react";
import SettingsImg from "../../imgs/settings-black.svg";
import CreateImg from "../../imgs/create-black.svg";
import MessagesImg from "../../imgs/messages-white.svg";
import styled from "styled-components";

class CourseCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { numMsgs: 0, courseIndex: props.index };
  }

  // Track when new messages come in
  componentDidMount() {
    // Placeholder for the updated messages
    const newMsgs = {};
    this.setState({ numMsgs: newMsgs.length });
  }

  render() {
    return (
      <div>
        <div>
          <img src={MessagesImg} alt="Messages" />
          <h3>{this.state.numMsgs}</h3>
        </div>
        <br />
        <h1>{this.props.courseName}</h1>
        <br />
        <h3>{this.props.courseTerm}</h3>
        <br />
        <img src={CreateImg} alt="Create" />
        <img src={SettingsImg} alt="Settings" />
      </div>
    );
  }
}

// export default CourseCard;

var displayWidth = 3;

const StyledCourseCard = styled(CourseCard)`
  height: 100px;
  width: 500px;
  background-color: #3f3f3f;
  left: ${100 + 525 * (((props) => props.index) % displayWidth)}px;
  top: ${100 + 50 * Math.floor((props) => props.index / displayWidth)}px;
`;

export default StyledCourseCard;
