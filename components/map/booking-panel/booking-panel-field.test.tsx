import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { BookingPanelField } from ".";

describe("BookingPanelField", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the input with its label", () => {
    renderField();

    expect(screen.getByLabelText("Room number")).toBeInTheDocument();
  });

  it("renders an error message when error is provided", () => {
    renderField({ error: "Enter a room number." });

    expect(screen.getByRole("alert")).toHaveTextContent("Enter a room number.");
  });

  it("reserves message space when requested without an error", () => {
    const { container } = renderField({ shouldReserveMessageSpace: true });

    const placeholder = container.querySelector(
      ".booking-panel__message-placeholder",
    );

    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveAttribute("aria-hidden", "true");
  });

  it("renders the error instead of reserved message space", () => {
    const { container } = renderField({
      error: "Enter a room number.",
      shouldReserveMessageSpace: true,
    });

    expect(screen.getByRole("alert")).toHaveTextContent("Enter a room number.");
    expect(
      container.querySelector(".booking-panel__message-placeholder"),
    ).not.toBeInTheDocument();
  });

  it("does not reserve message space by default", () => {
    const { container } = renderField();

    expect(
      container.querySelector(".booking-panel__message-placeholder"),
    ).not.toBeInTheDocument();
  });
});

type RenderFieldOptions = Partial<Parameters<typeof BookingPanelField>[0]>;

const renderField = ({
  autoComplete = "off",
  error = undefined,
  label = "Room number",
  name = "room",
  shouldReserveMessageSpace = false,
}: RenderFieldOptions = {}) =>
  render(
    <BookingPanelField
      autoComplete={autoComplete}
      error={error}
      label={label}
      name={name}
      shouldReserveMessageSpace={shouldReserveMessageSpace}
    />,
  );
