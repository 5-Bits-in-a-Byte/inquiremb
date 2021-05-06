import React from "react";
import styled from "styled-components";

const PostWrapper = () => {
  return <ContentTest>Wrapper</ContentTest>;
};

export default PostWrapper;

const ContentTest = styled.div`
  margin: 1em;
  width: 719px;
  max-width: 900px;
  height: 255px;

  text-align: center;
  line-height: 250px;

  background-color: #fff;
  /* border: 1px solid red; */
  border-radius: 5px;
  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
`;
