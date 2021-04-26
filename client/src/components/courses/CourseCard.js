import React from "react";
import { withRouter } from "react-router-dom";
import SettingsImg from "../../imgs/settings-black.svg";
// import ColorImg from "../../imgs/color-picker-icon.svg";
import ColorImg from "../../imgs/color-palette.svg";
import EditImg from "../../imgs/create-black.svg";
import MessagesImg from "../../imgs/message-black.svg";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Icon from "../common/Icon";
import { ChromePicker } from "react-color";
import LazyFetch from "../common/requests/LazyFetch";
import ClickAway from "../common/dropdown/ClickAway";

/** Course Card
 * @brief Component for displaying courses the user is a part of. Component is one of many courses
 *
 * @param props holds all of the properties for this component (contains: courseName, courseTerm, courseColor)
 * @returns Course Card Component
 */
class CourseCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numMsgs: 0,
      courseColor: props.color,
      displayColorSelector: false,
    };
  }

  handleColorChange = (colors) => {
    this.setState({ courseColor: colors.hex });
  };

  toggleColorDisplay = () => {
    this.setState({ displayColorSelector: !this.state.displayColorSelector });
  };

  colorFocus = (div) => {
    if (div) {
      div.focus();
    }
  };

  handleColorChangeComplete = (colors) => {
    // Get rid of # so we can send to backend properly
    let spl = colors.hex.split("#");
    // Add code for # part and then the actual color
    let new_color = "%23" + spl[1];
    // Send to backend
    LazyFetch({
      type: "put",
      endpoint:
        "/api/courses?courseId=" + this.props.id + "&color=" + new_color,
      onSuccess: (data) => {
        console.log(data.success);
        this.setState({ courseColor: colors.hex });
      },
    });
  };

  // Track when new messages come in
  componentDidMount() {
    // Placeholder for the updated messages
    //const newMsgs = {};
    this.setState({ numMsgs: 0 });
  }

  render() {
    return (
      <>
        <AlignedDiv>
          <ColorDiv color={this.state.courseColor}>
            <MessageDiv>
              <Icon
                fader
                clickable
                src={MessagesImg}
                alt={"Messages"}
                width={"25em"}
                onClick={() =>
                  alert(
                    "You clicked the Unread Messages icon for " +
                      this.props.courseName +
                      ".\nThis feature is a work in progress."
                  )
                }
              ></Icon>
              {this.state.numMsgs > 0 && this.state.numMsgs}
            </MessageDiv>
          </ColorDiv>
          <CourseInfo to={"/course/" + this.props.id}>
            <CourseName>{this.props.courseName}</CourseName>
            <CourseTerm>{this.props.courseTerm}</CourseTerm>
          </CourseInfo>
          <CourseFooter>
            <Icon
              fader
              clickable
              src={EditImg}
              alt={"Nickname"}
              width={"20em"}
              onClick={() =>
                alert(
                  "You clicked the Edit option for " +
                    this.props.courseName +
                    ".\nThis feature is a work in progress."
                )
              }
            ></Icon>
            <Icon
              fader
              clickable
              src={ColorImg}
              alt={"Color"}
              width={"16em"}
              onClick={this.toggleColorDisplay}
            ></Icon>
          </CourseFooter>
        </AlignedDiv>
        {this.state.displayColorSelector && (
          <ColorWrapper
            ref={this.colorFocus}
            tabIndex="0"
            onBlur={this.toggleColorDisplay}
          >
            <ChromePicker
              onChange={this.handleColorChange}
              onChangeComplete={this.handleColorChangeComplete}
              color={this.state.courseColor}
              disableAlpha
            />
          </ColorWrapper>
        )}
      </>
    );
  }
}

/* withRouter is imported from react-router-dom and is used
to redirect to other courses */
export default CourseCard;

const AlignedDiv = styled.div`
  height: 225px;
  width: 250px;

  margin: 0.5em;
  overflow: hidden;

  background-color: #ffffff;
  box-shadow: 0px 0.25em 0.5em 0.125em rgba(0, 0, 0, 0.07);
  border-radius: 0.35em;

  flex-basis: 1;

  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0px 0.25em 0.5em 0.125em rgba(0, 0, 0, 0.14);
  }
`;

const ColorDiv = styled.div`
  height: 50%;
  width: 100%;

  background-color: ${(props) => props.color || "#0000ff"};
`;

const MessageDiv = styled.div`
  padding: 0.6em 0 0 0;
  margin: 0 0 0 0.75em;

  display: flex;

  align-items: flex-start;
  justify-content: space-between;
  width: 16.5%;

  font-family: Roboto;
  font-style: normal;
  font-size: 1.2em;
  font-weight: 300;
  color: #ffffff;
`;

const CourseInfo = styled(Link)`
  margin: 0.8em 0 0 1.4em;
  font-family: Roboto;
  font-style: normal;
  font-weight: 200;
  flex-grow: 1;

  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const CourseName = styled.h1`
  font-size: 1.2em;
  color: #162b55;
`;

const CourseTerm = styled.h3`
  font-size: 0.75em;
  color: #979797;
  flex-grow: 1;
`;

const CourseFooter = styled.footer`
  padding: 0 0 1em 1.4em;
  display: flex;
  justify-content: space-between;
  width: 28%;
`;

const ColorWrapper = styled.div`
  outline: none !important;
`;
