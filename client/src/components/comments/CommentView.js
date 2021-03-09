import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import Post from "../posts/Post";
import Sidebar from "../posts/Sidebar";
import Button from "../common/Button";
import Comment from "./Comment";
import LazyFetch from "../common/requests/LazyFetch";
import { UserContext } from "../context/UserProvider";
import Fetch from "../common/requests/Fetch";

const renderComments = (data) => {
  let ret = [];
  if (data) {
    data.forEach((comment) => {
      ret.push(<Comment comment={comment} />);
    });
  }
  return ret;
};

const CommentView = ({ classroomName }) => {
  const user = useContext(UserContext);
  const history = useHistory();
  const [newComments, setNewComments] = useState({ draft: false, created: [] });
  const [commentData, setCommentData] = useState([]);
  const { courseid, postid } = useParams();
  const [highlightedSection, setHighlightedSection] = useState("");

  const redirect = (sectionFilter) => {
    history.push({
      pathname: "/course/" + courseid,
      state: { filter: sectionFilter },
    });
  };

  // location is passed from the react-router Link which stores
  // the post that was clicked under location.state
  let location = useLocation();
  let post;
  if (location.state) {
    post = location.state.post;
  }

  // Fetch comments
  useEffect(() => {
    if (post) {
      LazyFetch({
        type: "get",
        endpoint: "/api/posts/" + post._id + "/comments",
        onSuccess: (data) => {
          setCommentData([...renderComments(data)]);
        },
      });
    }
  }, [post]);

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

  let comments = [...commentData, ...newComments.created];
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
        classroomName={classroomName}
        setHighlightedSection={redirect}
        highlightedSection={highlightedSection}
      />

      <CommentViewContainer>
        <AbsoluteWrapper>
          <ScrollingDiv>
            <MaxWidth>
              <OptionsContainer>
                <Link
                  to={"/course/" + courseid}
                  style={{ textDecoration: "none" }}
                >
                  <Button secondary>Back to all Posts</Button>
                </Link>
                {postid !== "new" && (
                  <Button onClick={draftNewComment} secondary>
                    Reply to Post
                  </Button>
                )}
              </OptionsContainer>
              <Post
                post={post}
                isCondensed={false}
                isDraft={postid === "new"}
              />
              {comments}
            </MaxWidth>
          </ScrollingDiv>
        </AbsoluteWrapper>
      </CommentViewContainer>
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
  width: 100%;
  /* border: 1px solid green; */
`;

const AbsoluteWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin: 2.2em 0 1.1em 0;
`;

const ScrollingDiv = styled.div`
  height: 100%;
  width: 100%;
  padding: 0 280px 0 40px;
  overflow: auto;
  padding-right: 280px;
`;

const MaxWidth = styled.div`
  max-width: 900px;
  margin: auto;
  padding-bottom: 40px;
`;
