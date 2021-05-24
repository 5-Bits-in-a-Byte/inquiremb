import React from "react";
import ColorImg from "../../imgs/color-palette.svg";
import EditImg from "../../imgs/create-black.svg";
import MessagesImg from "../../imgs/message-black.svg";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Icon from "../common/Icon";
import { ChromePicker } from "react-color";
import LazyFetch from "../common/requests/LazyFetch";
import Button from "../common/Button";
import Input from "../common/Input";

/** Course Card
 * @brief Component for displaying courses the user is a part of. Component is one of many courses
 *
 * @param props holds all of the properties for this component (contains: courseName, nickname, courseTerm, courseColor)
 * @returns Course Card Component
 */
class CourseCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numMsgs: 0,
      courseColor: props.color,
      displayColorSelector: false,
      nicknameActive: false,
      nickname: this.props.nickname,
    };
    this.endpoint = "/api/courses?courseId=" + this.props.id;
  }

  handleColorChange = (colors) => {
    this.setState({ courseColor: colors.hex });
  };

  toggleColorDisplay = (e) => {
    console.log("Event: ", e);
    this.setState({ displayColorSelector: !this.state.displayColorSelector });
  };

  toggleColorDisplay_onBlur = (e) => {
    console.log("Event: ", e);
    this.setState({ displayColorSelector: false });
  };

  toggleNickname = () => {
    this.setState({ nicknameActive: !this.state.nicknameActive });
  };

  colorFocus = (div) => {
    if (div) {
      div.focus();
    }
  };

  handleCancel = () => {
    this.setState({ nicknameActive: false, nickname: this.props.nickname });
  };

  sendColorRequest = (colors) => {
    // Get rid of # so we can send to backend properly
    let spl = colors.hex.split("#");
    // Add code for # part and then the actual color
    let new_color = "%23" + spl[1];
    // Send to backend
    LazyFetch({
      type: "put",
      endpoint: this.endpoint + "&color=" + new_color,
      onSuccess: (data) => {
        console.log(data.success);
        this.setState({ courseColor: colors.hex });
      },
    });
  };

  sendNicknameRequest = () => {
    LazyFetch({
      type: "put",
      endpoint: this.endpoint + "&nickname=" + this.state.nickname,
      onSuccess: (data) => {
        console.log(data.success);
        this.setState({ nicknameActive: false });
      },
    });
  };

  handleNicknameChange = (e) => {
    // console.log(e.target.value);
    this.setState({ nickname: e.target.value });
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
                    'You clicked the Unread Messages icon for "' +
                      this.props.courseName +
                      '".\nThis feature is a work in progress.'
                  )
                }
              ></Icon>
              {this.state.numMsgs > 0 && this.state.numMsgs ? (
                <h3 style={{ color: `#f8f8f8`, lineHeight: `1.2em` }}>
                  {this.state.numMsgs}
                </h3>
              ) : (
                // <h3 style={{ color: `#f8f8f8`, lineHeight: `1.2em` }}>0</h3>
                <></>
              )}
            </MessageDiv>
          </ColorDiv>
          <CourseInfo>
            <div style={{ padding: "0px 20px 0px 0px" }}>
              {this.state.nicknameActive ? (
                <div>
                  <Input
                    placeholder="Enter a nickname"
                    onChange={this.handleNicknameChange}
                  />
                </div>
              ) : (
                <Link
                  to={"/course/" + this.props.id}
                  style={{ textDecoration: "none" }}
                >
                  <CourseName>
                    {this.state.nickname
                      ? this.state.nickname
                      : this.props.courseName}
                  </CourseName>
                </Link>
              )}
              {this.state.nickname ? (
                <Link
                  to={"/course/" + this.props.id}
                  style={{ textDecoration: "none" }}
                >
                  <CourseTitle>{this.props.courseName}</CourseTitle>
                </Link>
              ) : (
                <></>
              )}
            </div>
          </CourseInfo>
          <CourseFooter>
            <Icon
              fader
              clickable
              src={EditImg}
              alt={"Nickname"}
              width={"20em"}
              style={{ padding: "5px 5px 8px 0px" }}
              onClick={this.toggleNickname}
            ></Icon>
            <Icon
              fader
              clickable
              src={ColorImg}
              alt={"Color"}
              width={"16em"}
              style={{ padding: "5px 5px 8px 5px" }}
              onClick={this.toggleColorDisplay}
            ></Icon>
            <Placeholder></Placeholder>
            {this.state.nicknameActive && (
              <ButtonWrapper>
                <Button
                  secondary
                  style={{ padding: "6px" }}
                  onClick={this.handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  primary
                  style={{ padding: "6px", margin: "0 0 0 0.5em" }}
                  onClick={this.sendNicknameRequest}
                >
                  Submit
                </Button>
              </ButtonWrapper>
            )}
          </CourseFooter>
        </AlignedDiv>
        {this.state.displayColorSelector && (
          <ColorWrapper
            ref={this.colorFocus}
            tabIndex="0"
            // onBlur={this.toggleColorDisplay_onBlur}
            // onBlur={this.setState({ displayColorSelector: false })}
          >
            <ChromePicker
              onChange={this.handleColorChange}
              onChangeComplete={this.sendColorRequest}
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

const CourseTitle = styled.h3`
  font-size: 0.75em;
  color: #979797;
  flex-grow: 1;
`;

const CourseFooter = styled.footer`
  padding: 0 0 1em 1.4em;
  display: flex;
  justify-content: center;
  /* justify-content: space-between; */
  /* width: 28%; */
`;

const ColorWrapper = styled.div`
  outline: none !important;
`;

const ButtonWrapper = styled.div`
  display: flex;
  padding: 5px 10px 5px 5px;
  align-items: flex-end;
  justify-content: space-between;
`;

const Placeholder = styled.div`
  flex: 1;
`;
