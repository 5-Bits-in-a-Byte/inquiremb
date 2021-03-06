import React, { Component } from "react";
import TextareaAutosize from "react-textarea-autosize";
import styled from "styled-components";

class CommentTextBox extends Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focus();
  }

  render() {
    return <TextInput minRows={4} ref={this.textInput} {...this.props} />;
  }
}

export default CommentTextBox;

const TextInput = styled(TextareaAutosize)`
  border: none;
  resize: none;
  width: 100%;
  background-color: #ededed;
  padding: 10px;
  border-radius: 4px;
  font-family: "Roboto";
  font-size: 16px;
`;
