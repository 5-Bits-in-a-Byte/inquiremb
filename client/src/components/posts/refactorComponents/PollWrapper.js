import React, { useState } from "react";
import Poll from "react-polls";
import { useParams } from "react-router";
import LazyFetch from "../../common/requests/LazyFetch";

const PollWrapper = ({ post }) => {
  const { courseId } = useParams();

  // console.log("pollWrapper post: ", post);
  const establishPollAns = (post) => {
    let initialPollAns = [];
    Object.keys(post.content.fields).map((key) => {
      initialPollAns.push(post.content.fields[key]);
    });
    // console.log("InitialPollAns:", initialPollAns);
    return initialPollAns;
  };

  const [pollAns, setPollAns] = useState(establishPollAns(post));

  const handleVote = (voteAnswer) => {
    var pa = pollAns;
    const newPollAnswers = pa.map((answer) => {
      if (answer.option === voteAnswer) answer.votes++;
      return answer;
    });

    LazyFetch({
      type: "put",
      endpoint: "/courses/" + courseId + "/polls",
      data: { selectedOption: voteAnswer, postId: post._id },
      onSuccess: (data) => {
        // console.log("Data: ", data);
        setPollAns(newPollAnswers);
      },
      onFailure: (err) => {
        console.log("Err: ", err);
      },
    });
  };
  // console.log("pollAns: ", pollAns);

  return (
    <>
      <Poll
        question={post.title}
        answers={pollAns}
        onVote={handleVote}
        vote={post.content.vote}
        noStorage
        onClick={(event) => {
          event.stopPropagation();
        }}
      />
    </>
  );
};

export default PollWrapper;
