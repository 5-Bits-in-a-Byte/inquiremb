import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const CommentReply = (props) => {
  return (
    <CommentReplyWrapper>
      Lorem ipsum dolor sit.
      <p></p>
      <p></p>
      <p></p>
      <p></p>
    </CommentReplyWrapper>
  );
};

CommentReply.propTypes = {};

export default CommentReply;

const CommentReplyWrapper = styled.div`
  width: 90%;
  min-height: 85px;
  margin: 1em auto;

  background-color: #454545;
`;
