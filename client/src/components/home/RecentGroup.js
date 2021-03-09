import React from "react";
import PropTypes from "prop-types";
import RecentPost from "./RecentPost";
import styled from "styled-components";

const RecentGroup = ({ postList, classroomName, nameColor }) => {
  return (
    <Wrapper>
      <GroupWrapper>
        <GroupTitle nameColor={nameColor}>{classroomName}</GroupTitle>
        {postList}
      </GroupWrapper>
    </Wrapper>
  );
};

RecentGroup.propTypes = {};

export default RecentGroup;

const Wrapper = styled.div`
  width: 100%;
  min-height: 85px;
  margin: 1em 0;
  padding: 1.5em;

  border-radius: 0.3em;
  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
`;

const GroupWrapper = styled.div`
  width: 100%;
  min-height: 85px;

  /* border: 1px solid black; */
`;

const GroupTitle = styled.h1`
  color: ${(props) => props.nameColor};

  text-align: center;
`;
