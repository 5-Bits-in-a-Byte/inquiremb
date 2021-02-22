import React from "react";
import SettingsImg from "../../imgs/settings-black.svg";
import CreateImg from "../../imgs/create-black.svg";
import MessagesImg from "../../imgs/messages-white.svg";
import styled from "styled-components";

class CourseCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { numMsgs: 0 };
  }

  // Track when new messages come in
  componentDidMount() {
    // Placeholder for the updated messages
    const newMsgs = {};
    this.setState({ numMsgs: newMsgs.length });
  }

  render() {
    return (
      <Card>
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
      </Card>
    );
  }
}

export default CourseCard;

const Card = styled.div`
  height: 50vh;
  width: 500px;
  background-color: #3f0000;
  left: 100;
`;
