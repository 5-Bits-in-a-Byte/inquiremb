import React from "react";
import styled, { css } from "styled-components";
import Icon from "../../common/Icon";
import Reaction from "../../common/Reaction";
import CommentImg from "../../../imgs/comment.svg";

const MobileReactionsDropdown = ({
  postObject,
  userRole,
  reactionSettings,
  ...props
}) => {
  return (
    <>
      <Wrapper>
        {userRole && userRole.participation.reactions && (
          <Reaction
            reactions={postObject.reactions}
            type="post"
            id={postObject._id}
            postid={postObject._id}
            dropdown
          />
        )}
        <Icon
          alt={"Number of comments"}
          src={CommentImg}
          width={"22px"}
          style={{
            float: "left",
            marginRight: "8px",
            marginLeft: "20px",
            userSelect: "none",
          }}
        />
        <h5 style={{ color: "#8c8c8c", marginRight: "1em" }}>
          {postObject.comments}
        </h5>
      </Wrapper>
    </>
  );
};

export default MobileReactionsDropdown;

const Wrapper = styled.div`
  height: 100%;
  margin-left: auto;

  display: flex;
  align-items: center;
`;
