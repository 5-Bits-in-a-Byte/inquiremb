import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import LeftNavBar from "../LeftNavBar";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";

test("navigation items highlights when clicked", async () => {
  const history = createMemoryHistory();
  const { getByText, getByTestId } = render(
    <Router history={history}>
      <LeftNavBar />
    </Router>
  );

  const coursesBtn = getByText("Courses");
  const homeBtn = getByText("Home");
  const messagesBtn = getByText("Messages");

  // Click courses menu item
  fireEvent.click(coursesBtn);
  await waitFor(() => {
    expect(getByTestId("menu-item-Courses")).toHaveStyle(
      `background-color: #0B1B3A`
    );
  });

  fireEvent.click(homeBtn);
  await waitFor(() => {
    expect(getByTestId("menu-item-Home")).toHaveStyle(
      `background-color: #0B1B3A`
    );
  });

  fireEvent.click(messagesBtn);
  await waitFor(() => {
    expect(getByTestId("menu-item-Messages")).toHaveStyle(
      `background-color: #0B1B3A`
    );
  });
});
