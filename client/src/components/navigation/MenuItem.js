import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Icon from "../common/Icon";

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
  return (
    <Item active={active} data-testid={"menu-item-" + label}>
      <Link to={to}>
        <Icon fader src={img} />
        <Label>{label}</Label>
      </Link>
    </Item>
  );
};

export default MenuItem;

const Item = styled.li`
  margin: 12px 6px;
  text-align: center;
  background-color: ${(props) => props.active && "#0B1B3A"};
  padding: 3px;
  border-radius: 3px;
`;

//const Icon = styled.img``;

const Label = styled.p`
  color: #fff;
  font-size: 13px;
`;
