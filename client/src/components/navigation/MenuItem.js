import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Icon from "../common/Icon";
import { ColorContext } from "../context/ColorModeContext";

/** MenuItem
 * @brief Simple menu item component that routes to the main webpages of the webapp.
 *
 * @param {string} img Path to the icon used in the menu item
 * @param {string} label Menu item text labeling the item
 * @param {string} to Where to route. Goes into Link tag.
 * @param {bool}   active sets the highlighted portion of the menu item based on evaluation of this bool
 * @returns MenuItem Component
 */
const MenuItem = ({ img, label, to, active }) => {
  const theme = useContext(ColorContext);
  return (
    <Item active={active} data-testid={"menu-item-" + label} theme={theme}>
      <Link to={to}>
        <Icon fader src={img} />
        <Label>{label}</Label>
      </Link>
    </Item>
  );
};

export default MenuItem;

const Item = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 64px;
  height: 64px;
  margin: 0.5em 0;
  text-align: center;
  background-color: ${(props) => {
    if (props.active) {
      return props.theme.menuItemActive;
    }
  }};
  padding-top: 0.5em;
  border-radius: 3px;
`;

const Label = styled.p`
  margin: 0.5em 0;
  color: #fff;
  font-size: 13px;
`;
