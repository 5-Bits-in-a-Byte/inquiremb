import React, { Component } from "react";
import TextareaAutosize from "react-textarea-autosize";
import styled from "styled-components";

/** CommentTextBox component
 * Styled textbox to hold plain text. Is styled to fit sitewide conventions
 *
 * @param {object} props holds all of the passed in properties of this component.
 * @returns A textbox styled to match project wide style conventions. Holds plain text.
 */
class CommentTextBox extends Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    if (!this.props.secondary) {
      this.textInput.current.focus();
    }
  }

  render() {
    return (
      <TextInput
        minRows={this.props.minRows || 4}
        ref={this.textInput}
        {...this.props}
      />
    );
  }
}

export default CommentTextBox;

const TextInput = styled(TextareaAutosize)`
  border: none;
  resize: none;
  width: 100%;
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 4px;
  font-family: "Roboto";
  font-size: 16px;
`;
