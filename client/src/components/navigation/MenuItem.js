import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const MenuItem = ({ img, label, url }) => {
  return (
    <Item>
      <Link to={url}>
        <Icon src={img} />
        <Label>{label}</Label>
      </Link>
    </Item>
  );
};

export default MenuItem;

const Item = styled.li`
  margin: 6px;
  text-align: center;
`;

const Icon = styled.img``;

const Label = styled.p`
  color: #fff;
  font-size: 12px;
`;
