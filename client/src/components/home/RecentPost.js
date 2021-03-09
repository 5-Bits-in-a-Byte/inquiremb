import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Post from "../posts/Post";
import Fetch from "../common/requests/Fetch";
import { useParams } from "react-router-dom";

const createPost = (post) => {
  return <Post post={post} key={post._id} isCondensed={false} />;
};

// Sorts the posts by pinned/date
const generateSections = (data) => {
  let posts = { pinned: [], other: [] };
  if (data) {
    data.forEach((post) => {
      if (post.isPinned) {
        posts.pinned.push(createPost(post));
      } else {
        posts.other.push(createPost(post));
      }
    });
  }
  return posts;
};

const RecentPost = (props) => {
  const [isCondensed, setCondensedState] = useState(true);
  // Retrieves the courseid from the url parameters
  const { courseid } = useParams();
  let endpoint = "/api/courses/" + courseid + "/posts";

  // Load posts from course
  const { data, errors, loading } = Fetch({
    type: "get",
    endpoint: endpoint,
  });
  let posts = generateSections(data);

  return (
    <Wrapper>
      <h1>test</h1>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia,
        necessitatibus earum. Commodi illo, vero magnam alias doloremque
        expedita sint libero, autem fuga sunt harum enim. Accusamus qui in
        necessitatibus laboriosam perferendis obcaecati eaque facere aspernatur
        deleniti nisi, cum facilis blanditiis, maiores ad corrupti voluptatibus!
        Voluptatibus voluptas sunt sapiente sint fugiat.
      </p>
      {/* {posts} */}
    </Wrapper>
  );
};

RecentPost.propTypes = {};

export default RecentPost;

const Wrapper = styled.div`
  width: 100%;
  margin: 1em 0;
  padding: 1em;

  border: 1px solid green;
`;
