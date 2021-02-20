import React from "react";
import FadeIn from "./animation/FadeIn";
import styled from "styled-components";
import PropTypes from "prop-types";

const Modal = ({ children, close, ...props }) => {
  return (
    <Background onClick={close} data-testid="modal-background">
      <FadeIn>
        <Content {...props} onClick={(e) => e.stopPropagation()}>
          {children}
        </Content>
      </FadeIn>
    </Background>
  );
};

Modal.propTypes = {
  /* JSX elements to be rendered within the modal (the content) */
  children: PropTypes.node,
  /* Function that closes the modal */
  close: PropTypes.func,
};

export default Modal;

const Background = styled.div`
  position: fixed;
  z-index: 2;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(99, 114, 130, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  position: relative;
  background-color: #fff;
  margin: 15% auto;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 3px 3px 9px #48484830;
  width: ${(props) => props.width || "520px"};
`;
