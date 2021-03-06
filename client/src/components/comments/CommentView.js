import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Post from "../forumsAndPosts/Post";
import Sidebar from "../forumsAndPosts/Sidebar";
import Button from "../common/Button";
import Comment from "./Comment";
import { Link, useLocation, useParams } from "react-router-dom";
import LazyFetch from "../common/requests/LazyFetch";
import Fetch from "../common/requests/Fetch";
import { UserContext } from "../context/UserProvider";

const renderComments = (data) => {
  let ret = [];
  if (data) {
    data.forEach((comment) => {
      ret.push(<Comment comment={comment} />);
    });
  }
  return ret;
};

const CommentView = (props) => {
  const user = useContext(UserContext);
  const [newComments, setNewComments] = useState({ draft: false, created: [] });
  const { courseid, postid } = useParams();
  // location is passed from the react-router Link which stores
  // the post that was clicked under location.state
  let location = useLocation();
  let post;
  if (location.state) {
    post = location.state.post;
  }
  const draftNewComment = () => {
    setNewComments({
      ...newComments,
      draft: true,
    });
  };
  // Takes a boolean value: true creates, false cancels
  const finishComment = (content) => {
    // If false, clear the draft
    if (!content) {
      setNewComments({ ...newComments, draft: false });
    } else {
      LazyFetch({
        type: "post",
        endpoint: "/api/posts/" + post._id + "/comments",
        data: { isAnonymous: false, content: content },
        onSuccess: (data) => {
          console.log("new", data);
          setNewComments({
            draft: false,
            created: newComments.created.concat(<Comment comment={data} />),
          });
        },
      });
    }
  };

  let comments = [...newComments.created];
  if (post && !post.new) {
    const { data, errors, loading } = Fetch({
      type: "get",
      endpoint: "/api/posts/" + post._id + "/comments",
    });
    comments = [...renderComments(data), ...comments];
  }

  if (newComments.draft) {
    const draft = {
      postedby: {
        first: user.first,
        last: user.last,
        _id: user._id,
      },
      replies: [],
    };
    comments.push(
      <Comment comment={draft} isDraft={true} callback={finishComment} />
    );
  }
  return (
    <CommentViewWrapper>
      <Sidebar
        classroomName={props.classroomName}
        setHighlightedSection={() => {}}
        highlightedSection={""}
      />

      <CommentViewContainer>
        <ScrollingDiv>
          <OptionsContainer>
            <Link to={"/course/" + courseid} style={{ textDecoration: "none" }}>
              <Button secondary>Back to all Posts</Button>
            </Link>
            <Button onClick={draftNewComment} secondary>
              Reply to Post
            </Button>
          </OptionsContainer>
          <Post post={post} isCondensed={false} isDraft={postid === "new"} />
          {comments}
        </ScrollingDiv>
      </CommentViewContainer>
      <EmptyDiv />
    </CommentViewWrapper>
  );
};

CommentView.propTypes = {};

export default CommentView;

const CommentViewWrapper = styled.div`
  display: flex;
  height: 100%;
`;

const CommentViewContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 900px;
  width: 100%;
  /* border: 1px solid green; */
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin: 2.2em 0 1.1em 0;
`;

const EmptyDiv = styled.div`
  width: 280px; // Need to make same width as nav + menu bar
  flex-grow: 1;
`;

const PostCommentContainer = styled.div`
  width: 100%;

  /* border: 1px solid orange; */
`;

const ScrollingDiv = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  padding: 0 40px;
  overflow: auto;
  ::-webkit-scrollbar {
    width: 0; /* Remove scrollbar space */
    background: transparent; /* Optional: just make scrollbar invisible */
  }
`;
