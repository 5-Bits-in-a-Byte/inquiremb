import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import TopContent from "../TopContent";

test("join course modal appears when clicking 'join course' button", async () => {
  const { getByText, getByTestId } = render(<TopContent />);

  const joinCourseBtn = getByText("Join a Course");

  // Click courses menu item
  fireEvent.click(joinCourseBtn);
  await waitFor(() => {
    expect(getByTestId("join-course-modal")).toBeInTheDocument();
  });
});

test("join course modal closes after clicking on background", async () => {
  const { getByText, getByTestId } = render(<TopContent />);
  const joinCourseBtn = getByText("Join a Course");

  // Click courses menu item
  fireEvent.click(joinCourseBtn);
  await waitFor(() => {
    expect(getByTestId("join-course-modal")).toBeInTheDocument();
  });

  const modalBackground = getByTestId("modal-background");

  // Click courses menu item
  fireEvent.click(modalBackground);
  await waitFor(() => {
    expect(screen.queryByTestId("join-course-modal")).not.toBeInTheDocument();
  });
});
