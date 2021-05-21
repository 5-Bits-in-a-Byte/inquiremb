import React, { useState } from "react";
import Poll from "react-polls";

const PollWrapper = ({ post }) => {
  console.log("pollWrapper post: ", post);
  const establishPollAns = (post) => {
    let initialPollAns = [];
    Object.keys(post.content.fields).map((key) => {
      initialPollAns.push(post.content.fields[key]);
    });
    console.log("InitialPollAns:", initialPollAns);
    return initialPollAns;
  };

  const [pollAns, setPollAns] = useState(establishPollAns(post));

  const handleVote = (voteAnswer) => {
    var pa = pollAns;
    const newPollAnswers = pa.map((answer) => {
      if (answer.option === voteAnswer) answer.votes++;
      return answer;
    });
    setPollAns(newPollAnswers);
  };
  console.log("pollAns: ", pollAns);

  return (
    <>
      <Poll
        question={post.title}
        answers={pollAns}
        onVote={handleVote}
        onClick={(event) => {
          event.stopPropagation();
        }}
        noStorage
      />
    </>
  );
};

export default PollWrapper;
