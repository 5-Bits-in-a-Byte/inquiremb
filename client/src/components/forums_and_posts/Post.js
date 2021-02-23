import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components";

const Post = (props) => {
  const isPinned = props.isPinned  === true ?  {visibility: "visible"} : DisplayHidden;

  return (
    <PostWrapper>
      <PostTitle>{props.postTitle}</PostTitle>

      <PinIcon style={isPinned} src="./icons8_pin.svg"/>

      <PostContent>{props.postContent}</PostContent>

      <hr style={HRStyle}/>

      <PostMetaContentWrapper className="meta">
        <UserIcon src="./icons8_note.svg"/>
        <UserDescription>Posted by {props.posterName}</UserDescription>
        
        <MetaIconWrapper>
          <Icon src="./icons8_facebook_like 1.svg" />
          <IconValue>1</IconValue>

          <Icon src="./icons8_topic 1.svg" />
          <IconValue>1</IconValue>
        </MetaIconWrapper>
      </PostMetaContentWrapper>
    </PostWrapper>
  )
}

Post.propTypes = {
  postTitle: PropTypes.string,
  postContent: PropTypes.string
}

export default Post;

const DisplayHidden = {
  visibility: "hidden"
}

const HRStyle = {
  width : "90%",
  border: "1px solid #DDDDDD"
}

//#region Post Stylings
const PostWrapper = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

  width: 720px;
  height: 150px;
  margin: 2em 0;

  // border: 1px solid black;
  border-radius: 0.3em;

  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);

  :hover {
    cursor: pointer;
  }
`;

const PostTitle = styled.h2`
  margin: 1em 0 0.5em 2em;

  font-size: 18px;
`;

const PinIcon = styled.img`
  position: absolute;
  top: 0;
  right: 0;

  width: 16px;
  height: 16px;
  margin: 1.1em 2em 0 0;
`;

const PostContent = styled.p`
  margin: 0 2.5em 0.5em 2.5em;

  font-size: 14px;
  color: #979797;
`;

const PostMetaContentWrapper = styled.div`
  display: flex;
  flex-direction: row;

  height: 100%;
  margin: 0 2.2em 0.5em 2.2em;

  // border: 1px solid black;
`;

const UserIcon = styled.img`
  float: left;

  width: 19px;
  height: 19px;
  margin-right: 0.5em;

  background-color: #e0e0e0;
  border-radius: 50%;

  user-select: none;
`;

const UserDescription = styled.h5`
  user-select: none;
`;

const MetaIconWrapper = styled.div`
  display: inline-flex;
  margin-left: 350px;

  height: 100%;
`;

const Icon = styled.img`
  float: left;

  width: 18px;
  height: 18px;
  margin-right: 1em;
  margin-left: 0.75em;

  user-select: none;
`;

const IconValue = styled.h5`
  color: #8C8C8C;
`;
//#endregion
