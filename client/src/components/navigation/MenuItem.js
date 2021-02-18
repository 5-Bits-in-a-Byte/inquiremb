import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const MenuItem = ({ img, label, to, active }) => {
  return (
    <Item active={active} data-testid={"menu-item-" + label}>
      <Link to={to}>
        <Icon src={img} />
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

const Icon = styled.img``;

const Label = styled.p`
  color: #fff;
  font-size: 10px;
`;
