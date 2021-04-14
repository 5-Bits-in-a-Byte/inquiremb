import React from "react";
import styled from "styled-components";
import LeftNavBar from "./LeftNavBar";
import TopNavBar from "./TopNavBar";

/** MenuMargin
 * @brief DEPRECATED ~ but will consider refactoring some webpages to incorporate.
 * @param {idk?} children container of child components.
 * @returns
 * @deprecated This component is unused and has since been deprecated.
 */
const MenuMargin = ({ children }) => {
  return (
    <>
      <Wrapper>{children}</Wrapper>
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
`;
