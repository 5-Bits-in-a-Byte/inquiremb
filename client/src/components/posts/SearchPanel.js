import React, { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "../common/Button";
import { Link } from "react-router-dom";
import CogIcon from "../../imgs/settings 1.svg";
import SearchBar from "../common/SearchBar";
import LazyFetch from "../common/requests/LazyFetch";
import { useWindowDimensions } from "../common/CustomHooks";
import { ColorContext } from "../context/ColorModeContext";

/**
 * Options Component ~ Button side panel for displaying buttons for the user
 *
 * @param {string} courseId given to the "+ New Post" button to route to the Post form page
 */
const SearchPanel = ({ courseId, onChangeCallback }) => {
  // console.log("User Object: ", user);
  // console.log("OPTIONS User Role: ", userRole);

  //   const handleSearch = (e) => {
  //     // console.log(e.target.value);
  //     LazyFetch({
  //       type: "get",
  //       endpoint: "/courses/" + courseId + "/search?search=" + e.target.value,
  //       onSuccess: (data) => {
  //         console.log(data);
  //       },
  //       onFailure: (err) => {
  //         console.log(err.response.data.errors);
  //       },
  //     });
  //   };

  const { width, height } = useWindowDimensions();
  const theme = useContext(ColorContext);

  if (width <= 1200) return <></>;
  else
    return (
      <OptionsWrapper>
        {/* {width >= 768 ? <OptionsHeader>SEARCH</OptionsHeader> : <></>} */}
        <OptionsHeader theme={theme}>SEARCH</OptionsHeader>
        <OptionsPanel theme={theme}>
          <SearchBar
            placeholder="Search for Post"
            displayIcon={false}
            onChange={onChangeCallback}
          />
        </OptionsPanel>
      </OptionsWrapper>
    );
};

SearchPanel.propTypes = {
  courseId: PropTypes.string,
};

export default SearchPanel;

const OptionsWrapper = styled.div`
  width: 280px; // Need to make same width as nav + menu bar
  flex-grow: 1;
  position: absolute;
  right: -40px;
  top: 0px;

  /* @media only screen and (max-width: 768px) {
    position: auto;
    top: auto;
    right: auto;
  } */
`;

const OptionsHeader = styled.h1`
  color: ${(props) => props.theme.logoFontColor};
  margin: 3em 0 1em 0;

  font-size: 14px;
`;

const OptionsPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.header};
  width: 220px;
  padding: 14px;
  border-radius: 5px;

  box-shadow: 0px 1px 4px 2px rgba(0, 0, 0, 0.07);
`;

const TextInput = styled.input`
  height: 100%;
  border: none;
  background-color: transparent;
  width: 100%;
  padding-left: 11px;
  font-size: 16px;

  &:focus {
    outline: none;
  }

  &::selection {
    background: #81818150; /* WebKit/Blink Browsers */
  }
`;
