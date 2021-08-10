import React, { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "../common/Button";
import { Link } from "react-router-dom";
import CogIcon from "../../imgs/settings 1.svg";
import SearchBar from "../common/SearchBar";
import LazyFetch from "../common/requests/LazyFetch";

/**
 * Options Component ~ Button side panel for displaying buttons for the user
 *
 * @param {string} courseId given to the "+ New Post" button to route to the Post form page
 */
const SearchPanel = ({ courseId, onChangeCallback }) => {
  const user = useContext(UserContext);
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

  return (
    <OptionsWrapper>
      <OptionsHeader>SEARCH</OptionsHeader>
      <OptionsPanel>
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

  /* border: 1px solid red; */
`;

const OptionsHeader = styled.h1`
  margin: 3em 0 1em 0;

  font-size: 14px;
`;

const OptionsPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
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
