import React from "react";
import styled, { css } from "styled-components";
import ConfigPanel from "./ConfigButtonPanel";
import Button from "../common/Button";
import LazyFetch from "../common/requests/LazyFetch";

const ConfigView = ({ props }) => {
  return (
    <ConfigWrapper>
      <ScrollingDiv>
        <h1>THIS IS THE CONFIG PAGE</h1>

        <ConfigPanel panelText="This is the button description for the 'other' button. It does nothing.">
          <Button
            primary
            buttonWidth={"200px"}
            buttonHeight={"2.2rem"}
            onClick={() => {
              alert("This literally doesn't do anything...");
            }}
          >
            Other Button
          </Button>
        </ConfigPanel>

        <ConfigPanel
          panelText={
            "Click here to delete the course. WARNING once deleted there is no undoing."
          }
        >
          <Button
            primary
            buttonColor={"#DC2B2B"}
            buttonWidth={"200px"}
            buttonHeight={"2.2rem"}
            onClick={() => {
              let c = window.confirm(
                "Are you sure you want to delete this course?"
              );
              if (c == true) {
                alert("YOU ARE DELETING COURSE NOW!");
                // LazyFetch({
                //   type: "delete",
                //   endpoint: "/api/courses?courseId=" + "",
                //   onSuccess: (data) => {
                //     alert("delete request success.");
                //   },
                // });
              } else {
                alert("You canceled the delete request.");
              }
            }}
          >
            Delete Course
          </Button>
        </ConfigPanel>

        {/* KEEP THE OVERFLOW COUNTER IT HELPS WITH OVERFLOW
            at the bottom of the scrolling div. */}
        <OverflowCounter offsetAmount={"30px"}></OverflowCounter>
      </ScrollingDiv>
    </ConfigWrapper>
  );
};

export default ConfigView;

const ConfigWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
`;

const ScrollingDiv = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  padding: 2rem 4rem 0 4rem;

  overflow: auto;
`;

/** THIS ACCOUNTS FOR WEIRD SCROLLING DIV STUFF */
const OverflowCounter = styled.div`
  width: 100%;
  ${(props) =>
    props.offsetAmount &&
    css`
      padding: ${props.offsetAmount};
    `}
`;
