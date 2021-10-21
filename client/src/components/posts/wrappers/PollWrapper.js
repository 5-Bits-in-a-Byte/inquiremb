import React, { useContext, useState } from "react";
import Poll from "react-polls";
import { useParams } from "react-router";
import LazyFetch from "../../common/requests/LazyFetch";
import { UserRoleContext } from "../../context/UserRoleProvider";
import { ColorContext, colorThemes } from "../../context/ColorModeContext";

const PollWrapper = ({ post }) => {
  const { courseId } = useParams();
  const userRole = useContext(UserRoleContext);

  const theme = useContext(ColorContext);

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

    // Only send the request to the backend if the user has permission to do so
    if (userRole.participation.voteInPoll) {
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
    }
  };
  // console.log("pollAns: ", pollAns);

  return (
    <>
      <Poll
        question={post.title}
        answers={pollAns}
        onVote={handleVote}
        vote={
          userRole && userRole.participation.voteInPoll
            ? post.content.vote
            : pollAns[0].option
        }
        customStyles={{
          theme: `${theme === colorThemes.light ? "black" : "white"}`,
          align: "center",
          questionColor: `${theme.pollQuestionColor}`,
        }}
        noStorage
        onClick={(event) => {
          event.stopPropagation();
        }}
      />
    </>
  );
};

export default PollWrapper;
