import React from "react";
import SettingsImg from "../../imgs/settings-black.svg";
import CreateImg from "../../imgs/create-black.svg";
import MessagesImg from "../../imgs/message-black.svg";
import styled from "styled-components";

class CourseCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { numMsgs: 0, courseColor: props.color };
  }

  // Track when new messages come in
  componentDidMount() {
    // Placeholder for the updated messages
    //const newMsgs = {};
    this.setState({ numMsgs: 0 });
  }

  render() {
    return (
      <AlignedDiv>
        <ColorDiv color={this.state.courseColor}>
          <MessageDiv>
            <img src={MessagesImg} alt="Messages" />
            {this.state.numMsgs}
          </MessageDiv>
        </ColorDiv>
        <CourseInfo>
          <CourseName>{this.props.courseName}</CourseName>
          <CourseTerm>{this.props.courseTerm}</CourseTerm>
        </CourseInfo>
        <CourseFooter>
          <img src={CreateImg} alt="Create" />
          <img src={SettingsImg} alt="Settings" />
        </CourseFooter>
      </AlignedDiv>
    );
  }
}

export default CourseCard;

const AlignedDiv = styled.div`
  height: 225px;
  width: 250px;

  margin: 0.5em;
  overflow: hidden;

  background-color: #ffffff;
  box-shadow: 0px 0.25em 0.5em 0.125em rgba(0, 0, 0, 0.07);
  border-radius: 0.5em;

  flex-basis: 1;
`;

const ColorDiv = styled.div`
  height: 45%;
  width: 100%;

  background-color: ${(props) => props.color || "#0000ff"};
`;

const MessageDiv = styled.p`
  padding: 1em 0 0 1em;
  vertical-align: super;
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  color: #ffffff;
`;

const CourseInfo = styled.div`
  margin: 1em 0 0 1em;
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
`;

const CourseName = styled.h1`
  font-size: 1.25em;
  color: #162b55;
`;

const CourseTerm = styled.h3`
  font-size: 0.75em;
  color: #979797;
`;

const CourseFooter = styled.footer`
  margin: 0 0 1em 1em;
`;
