import React from "react";
import styled from "styled-components";
import { useWindowDimensions } from "../common/CustomHooks";
import LeftNavBar from "./LeftNavBar";
import TopNavBar from "./TopNavBar";

/** MenuMargin
 * @brief DEPRECATED ~ but will consider refactoring some webpages to incorporate.
 * @param {idk?} children container of child components.
 * @returns
 */
const MenuMargin = ({ children }) => {
  const { width, height } = useWindowDimensions();

  return (
    <>
      <Wrapper windowWidth={width}>{children}</Wrapper>
      {/* Put absolute positioned nav bars after 
      the children to prevent zIndex issues */}
      <LeftNavBar />
      <TopNavBar />
    </>
  );
};

export default MenuMargin;

const Wrapper = styled.div`
  margin-top: 66px;
  margin-left: 80px;
  position: relative;

  @media only screen and (max-width: 769px) {
    margin-left: 0;
  }
`;
