import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import {
  UserRoleContext,
  UserRoleDispatchContext,
} from "../context/UserRoleProvider";
import styled from "styled-components";
import PostWrapper from "../posts/refactorComponents/PostWrapper";
import Sidebar from "../posts/Sidebar";
import Button from "../common/Button";
import Comment from "./Comment";
import LazyFetch from "../common/requests/LazyFetch";
import { UserContext } from "../context/UserProvider";
import io from "../../services/socketio";
import Draft from "../posts/refactorComponents/Draft";
import PollConfig from "../posts/refactorComponents/PollConfig";
import PollWrapper from "../posts/refactorComponents/PollWrapper";
import EditorWrapper from "../posts/refactorComponents/EditorWrapper";

const renderComments = (data, userRole) => {
  let ret = [];
  if (data) {
    data.forEach((comment) => {
      ret.push(<Comment comment={comment} key={comment._id} />);
    });
  }
  return ret;
};

const CommentView = ({ classroomName }) => {
  const { courseId, postid } = useParams();
  // var roleAfterGetRequest = null;

  // LazyFetch({
  //   type: "get",
  //   endpoint: "/api/userRole/" + courseId,
  //   onSuccess: (role) => {
  //     if (role) {
  //       roleAfterGetRequest = role;
  //     }
  //   },
  //   onFailure: (err) => {
  //     console.log(
  //       "Error getting user role object from {" + courseId + "}:",
  //       err
  //     );
  //   },
  // });

  const user = useContext(UserContext);
  const history = useHistory();
  // Stores comments fetched live from socketio
  const [newComments, setNewComments] = useState({ draft: false });
  const [commentData, setCommentData] = useState([]);
  const [highlightedSection, setHighlightedSection] = useState("");
  const [pollAns, setPollAns] = useState([{ option: "dummy", votes: 0 }]);

  // const setUserRole = useContext(UserRoleDispatchContext);
  const userRole = useContext(UserRoleContext);
  // console.log("Comment View Role Object: ", userRole);

  const handleVote = (voteAnswer) => {
    var pa = pollAns;
    const newPollAnswers = pa.map((answer) => {
      if (answer.option === voteAnswer) answer.votes++;
      return answer;
    });
    setPollAns(newPollAnswers);
  };

  // const attemptGetUserRole = (courseId) => {
  //   LazyFetch({
  //     type: "get",
  //     endpoint: "/api/userRole/" + courseId,
  //     onSuccess: (role) => {
  //       if (role) {
  //         setUserRole(role);
  //       }
  //     },
  //     onFailure: (err) => {
  //       console.log(
  //         "Error getting user role object from {" + courseId + "}:",
  //         err
  //       );
  //       setUserRole(null);
  //     },
  //   });
  // };

  const redirect = (sectionFilter) => {
    history.push({
      pathname: "/course/" + courseId,
      state: { filter: sectionFilter },
    });
  };

  // location is passed from the react-router Link which stores
  // the post that was clicked under location.state
  let location = useLocation();
  let post;
  if (location.state) {
    console.log("L State: ", location.state);
    post = location.state.post;
    console.log(post);
  }

  const establishPollAns = (post) => {
    let initialPollAns = [];
    Object.keys(post.content.fields).map((key) => {
      initialPollAns.push(post.content.fields[key]);
    });
    console.log("InitialPollAns in CommentView:", initialPollAns);
    return initialPollAns;
  };

  useEffect(() => {
    if (post && post.content.type == "poll") {
      setPollAns(establishPollAns(post));
    }
  });

  const convertToUpper = (postType) => {
    var first = postType[0].toUpperCase();
    var rest = postType.slice(1);
    return first + rest;
  };

  // Fetch comments
  useEffect(() => {
    if (post) {
      LazyFetch({
        type: "get",
        endpoint:
          "/api/courses/" + courseId + "/posts/" + post._id + "/comments",
        onSuccess: (data) => {
          setCommentData([...renderComments(data, userRole)]);
        },
      });
    }
    io.emit("join", { room: postid, room_type: "post" });
    return () => {
      io.emit("leave", { room: postid });
    };
  }, [post]);

  useEffect(() => {
    io.on("Comment/create", (comment) => {
      //console.log(comment);
      // Ensure the user isn't the one who posted it
      if (
        comment &&
        comment.postedBy._id !== user._id &&
        comment.postedBy._id !== user.anonymousId
      ) {
        // console.log(commentData);
        setCommentData([
          ...commentData,
          <Comment comment={comment} key={comment._id} />,
        ]);
      }
    });
    io.on("Reply/create", (comment) => {
      // console.log(comment, "ws");
      // Take copy of socketComments and append reply to matching comment (with _id)
      // console.log(commentData);
      let allComments = [...commentData];
      // console.log(allComments);
      for (let i in allComments) {
        // console.log(allComments[i], "in for loop");
        if (allComments[i].props.comment._id === comment._id) {
          // console.log("found a match");
          allComments[i] = <Comment comment={comment} key={comment._id} />;
          break;
        }
      }
      setCommentData(allComments);
    });
  }, [commentData]);

  // useEffect(() => {
  //   // console.log("rendered");
  //   if (!userRole) {
  //     attemptGetUserRole(courseId);
  //   }
  // }, [userRole]);

  const draftNewComment = () => {
    setNewComments({
      draft: true,
    });
  };
  // Takes a boolean value: true creates, false cancels
  const finishComment = (content) => {
    // If false, clear the draft
    if (!content) {
      setNewComments({ draft: false });
    } else {
      LazyFetch({
        type: "post",
        endpoint:
          "/api/courses/" + courseId + "/posts/" + post._id + "/comments",
        data: { isAnonymous: false, content: content },
        onSuccess: (data) => {
          setNewComments({ draft: false });
          setCommentData([
            ...commentData,
            <Comment comment={data} key={data._id} />,
          ]);
        },
      });
    }
  };
  //console.log(commentData);

  let comments = [...commentData];
  if (newComments.draft) {
    const draft = {
      postedBy: {
        first: user.first,
        last: user.last,
        _id: user._id,
      },
      replies: [],
    };
    comments.push(
      <Comment
        comment={draft}
        isDraft={true}
        callback={finishComment}
        key="draft"
      />
    );
  }
  const postExists = postid !== "newQorA" && postid !== "newPoll";
  // console.log("postid !== newPoll: ", postid !== "newPoll");
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
                  to={"/course/" + courseId}
                  style={{ textDecoration: "none" }}
                >
                  <Button secondary>Back to all Posts</Button>
                </Link>
                {postExists && (
                  <Button onClick={draftNewComment} secondary>
                    Reply to Post
                  </Button>
                )}
              </OptionsContainer>
              {postid === "newQorA" && <Draft />}
              {/* {postid === "newPoll" && <DraftPoll />} */}
              {postid === "newPoll" && <PollConfig />}
              {postExists &&
                (convertToUpper(post.content.type) === "Poll" ? (
                  <PostWrapper
                    condensed={false}
                    // isRead
                    postObject={post}
                    postType={"Poll"}
                    content={<PollWrapper post={post} />}
                  />
                ) : (
                  <PostWrapper
                    postObject={post}
                    postType={convertToUpper(post.content.type)}
                    condensed={false}
                    content={<EditorWrapper post={post} edit={false} />}
                  />
                ))}
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
