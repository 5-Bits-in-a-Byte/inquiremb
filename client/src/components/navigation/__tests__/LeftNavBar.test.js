import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import LeftNavBar from "../LeftNavBar";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";

it("menu item highlights when on correct page", async () => {
  const history = createMemoryHistory();
  const { getByText, getByTestId } = render(
    <Router history={history}>
      <LeftNavBar />
    </Router>
  );

  const navigationBtn = getByText("Courses");

  fireEvent.click(navigationBtn);
  await waitFor(() => {
    expect(getByTestId("menu-item")).toHaveStyle(`background-color: #0B1B3A`);
  });
});
