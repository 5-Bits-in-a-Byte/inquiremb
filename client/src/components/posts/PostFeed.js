import React, { useContext, useState, useEffect } from "react";
import styled, { css } from "styled-components";
import OptionsPanel from "./OptionsPanel";
import Button from "../common/Button";
import LineWidthImg from "../../imgs/line-width.svg";
import HollowPinImg from "../../imgs/pin-hollow.svg";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import io from "../../services/socketio";
import PostWrapper from "./wrappers/PostWrapper";
import PollWrapper from "./wrappers/PollWrapper";
import EditorWrapper from "./EditorWrapper";
import SearchPanel from "./SearchPanel";
import LazyFetch from "../common/requests/LazyFetch";
// import LoadingDots from "../common/animation/LoadingDots";

const convertToUpper = (postType) => {
  var first = postType[0].toUpperCase();
  var rest = postType.slice(1);
  return first + rest;
};

const createPost = (post, userRole, isCondensed, key) => {
  const postType = convertToUpper(post.content.type);

  var content;
  if (
    post.content.type === "question" ||
    post.content.type === "announcement" ||
    post.content.type === "general"
  ) {
    content = (
      <EditorWrapper messageData={post} messageType="post" edit={false} />
    );
  } else if (post.content.type === "poll") {
    content = <PollWrapper post={post} />;
  }

  return (
    <PostWrapper
      postObject={post}
      postType={postType}
      condensed={isCondensed}
      content={content}
      key={key}
    />
  );
};

// Sorts the posts by pinned/date
const generateSections = (data, userRole, isCondensed) => {
  let posts = { pinned: [], other: [] };
  let key = 0;
  if (data) {
    data.forEach((post) => {
      if (post.isPinned) {
        if (post.isPrivate && userRole.privacy.private)
          posts.pinned.push(createPost(post, userRole, isCondensed, key));
        else if (!post.isPrivate)
          posts.pinned.push(createPost(post, userRole, isCondensed, key));
      } else if (
        (post.isPrivate && userRole.privacy.private) ||
        !post.isPrivate
      ) {
        posts.other.push(createPost(post, userRole, isCondensed, key));
      }

      key = key + 1;
    });
  }
  return posts;
};

const fetchData = (endpoint, socketPosts, setData) => {
  LazyFetch({
    type: "get",
    endpoint: endpoint,
    onSuccess: (response) => {
      // console.log("get request data:", response);
      setData([...socketPosts, ...response]);
    },
  });
};

const PostFeed = ({ userRole, highlightedSection }) => {
  const user = useContext(UserContext);
  const [socketPosts, setSocketPosts] = useState([]);

  useEffect(() => {
    io.emit("join", { room: courseId, room_type: "course" });
    io.on("Post/create", (post) => {
      // Ensure the user isn't the one who posted it
      console.log(post);
      if (
        post &&
        post.postedBy._id !== user._id &&
        post.postedBy._id !== user.anonymousId
      ) {
        setSocketPosts([post, ...socketPosts]);
      }
    });

    return () => {
      io.emit("leave", { room: courseId });
    };
  }, []);

  const [isCondensed, setCondensedState] = useState(false);
  const [sortByMostRecent, toggleSort] = useState(true);
  // Retrieves the courseId from the url parameters
  const { courseId } = useParams();
  const baseEndpoint = "/courses/" + courseId + "/posts";
  const [endpoint, setEndpoint] = useState(baseEndpoint);

  useEffect(() => {
    // Sorting by post type
    switch (highlightedSection) {
      case "Instructor":
        setEndpoint(baseEndpoint + "?filterby=instructor");
        break;
      case "My Posts":
        setEndpoint(baseEndpoint + "?filterby=me");
        break;
      case "My Upvoted":
        setEndpoint(baseEndpoint + "?filterby=myupvoted");
        break;
      case "Announcements":
        setEndpoint(baseEndpoint + "?filterby=announcement");
        break;
      case "Questions":
        setEndpoint(baseEndpoint + "?filterby=question");
        break;
      case "Polls":
        setEndpoint(baseEndpoint + "?filterby=poll");
        break;
      case "General Posts":
        setEndpoint(baseEndpoint + "?filterby=general");
        break;
      default:
        // Don't add a filter to endpoint
        setEndpoint(baseEndpoint);
        break;
    }

    // Sorting by date
    if (!sortByMostRecent) {
      if (highlightedSection !== "All Posts") {
        setEndpoint(endpoint + "&sortby=oldest");
      } else {
        setEndpoint(baseEndpoint + "?sortby=oldest");
      }
    }
  }, [highlightedSection, sortByMostRecent]);

  const [data, setData] = useState(null);

  // Initial Fetch of Data
  useEffect(() => {
    if (!data) {
      fetchData(endpoint, socketPosts, setData);
    }
  }, []);

  // Fetch for endpoint change
  useEffect(() => {
    if (data) {
      fetchData(endpoint, socketPosts, setData);
    }
  }, [endpoint]);

  const [posts, setPosts] = useState(null);
  const [initialPosts, setInitialPosts] = useState(posts);

  // Populate posts and store state of initial posts
  useEffect(() => {
    // console.log("data:", data);
    if (data) {
      let initialGeneratedPosts = generateSections(data, userRole, isCondensed);
      setPosts(initialGeneratedPosts);
      setInitialPosts(initialGeneratedPosts);
    }
  }, [data]);

  const handleSearch = (e) => {
    // console.log(e.target.value);
    if (e.target.value != "") {
      LazyFetch({
        type: "get",
        endpoint: "/courses/" + courseId + "/search?search=" + e.target.value,
        onSuccess: (searchData) => {
          // console.log("onSuccess data:", searchData);
          setPosts(generateSections(searchData, userRole, isCondensed));
        },
        onFailure: (err) => {
          console.log(err.response.data.errors);
        },
      });
    } else {
      // console.log("initialPosts:", initialPosts);
      setPosts(initialPosts);
    }
  };

  return (
    <>
      <PostFeedWrapper>
        <ScrollingDiv>
          <CenterWrapper>
            <SortingOptions>
              <Button
                secondary={true}
                onClick={() => {
                  setCondensedState(!isCondensed);
                  fetchData(endpoint, socketPosts, setData);
                }}
              >
                <img src={LineWidthImg} />
              </Button>
              <Button
                secondary={true}
                style={MarginLeftRight}
                onClick={() => {
                  toggleSort(!sortByMostRecent);
                }}
              >
                {sortByMostRecent ? "Most Recent" : "Oldest"}
              </Button>
            </SortingOptions>
            {posts && posts.pinned.length > 0 && (
              <PostGroupingHeader>
                <img
                  src={HollowPinImg}
                  style={{ width: 18, height: 18, marginRight: 5 }}
                />
                Pinned Posts
              </PostGroupingHeader>
            )}
            {posts ? posts.pinned : <></>}
            {posts && posts.other.length > 0 && (
              <PostGroupingHeader>All Posts</PostGroupingHeader>
            )}
            {posts ? posts.other : <></>}
            <SearchPanel courseId={courseId} onChangeCallback={handleSearch} />
            <OptionsPanel userRole={userRole} courseId={courseId} />
            <OverflowCounter offsetAmount={"0.25rem"} />
          </CenterWrapper>
        </ScrollingDiv>
      </PostFeedWrapper>
    </>
  );
};

export default PostFeed;

const MarginLeftRight = {
  marginLeft: "1em",
  marginRight: "1em",
};

const PostFeedWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
`;

const ScrollingDiv = styled.div`
  position: absolute;
  display: flex;
  height: 100%;
  width: 100%;
  padding: 0 40px;
  overflow: auto;
`;

const CenterWrapper = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
  padding-right: 280px;
  position: relative;
`;

const SortingOptions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin: 2.2em 0 1em 0;
  position: absolute;
  padding-right: 280px;
`;

const PostGroupingHeader = styled.div`
  margin: 2.2em 0 0em 0;
  font-size: 1.25em;
  font-weight: 500;
`;

/** THIS ACCOUNTS FOR WEIRD SCROLLING DIV STUFF */
const OverflowCounter = styled.div`
  width: 100%;
  ${(props) =>
    props.offsetAmount &&
    css`
      padding: ${props.offsetAmount};
    `}/* border: 3px solid black; */
`;
