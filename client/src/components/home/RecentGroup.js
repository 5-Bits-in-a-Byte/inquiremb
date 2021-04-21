import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/** RecentGroup Component
 * @brief A grouping of most recent posts from a given course id
 *
 * @param {list} postList list of posts and thier data associated with this course group
 * @param {string} nameColor (deprecated) the color applied to the name of the course
 * @param {string} classroomName the name of the course this group is associated with
 * @returns RecentGroup component
 */
const RecentGroup = ({ postList, classroomName, nameColor }) => {
  return (
    <Wrapper barColor={nameColor}>
      <GroupWrapper>
        <GroupTitle>{classroomName}</GroupTitle>
        {postList}
      </GroupWrapper>
    </Wrapper>
  );
};

RecentGroup.propTypes = {
  postList: PropTypes.array,
  classroomName: PropTypes.string,
  nameColor: PropTypes.string,
};

export default RecentGroup;

const Wrapper = styled.div`
  width: 100%;
  min-height: 85px;
  margin: 1em 0;
  padding: 1.5em;

  border-left: 4px solid ${(props) => props.barColor};
  border-radius: 0.3em;
  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
`;

const GroupWrapper = styled.div`
  width: 100%;
  min-height: 85px;
`;

const GroupTitle = styled.h1`
  text-align: center;
  text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
`;
