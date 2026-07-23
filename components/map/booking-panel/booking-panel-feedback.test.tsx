import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { BookingPanelFeedback } from ".";

describe("BookingPanelFeedback", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders successful booking feedback as a status message", () => {
    render(
      <BookingPanelFeedback
        bookingState={{
          status: "success",
          message: "cabana-0-0 is booked.",
        }}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "cabana-0-0 is booked.",
    );
  });

  it("renders unavailable cabana feedback as an alert", () => {
    render(
      <BookingPanelFeedback
        bookingState={{
          status: "unavailable",
          message: "cabana-0-0 is already booked. Choose another cabana.",
        }}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "cabana-0-0 is already booked. Choose another cabana.",
    );
  });
});
