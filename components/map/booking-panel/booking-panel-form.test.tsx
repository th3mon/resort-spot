import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BookingPanelForm, type BookingSubmitHandler } from ".";

describe("BookingPanelForm", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders cabana heading and booking fields", () => {
    renderForm();

    expect(
      screen.getByRole("heading", { name: "Book cabana-0-0" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Room number")).toBeInTheDocument();
    expect(screen.getByLabelText("Guest name")).toBeInTheDocument();
  });

  it("calls the submit handler when submitted", async () => {
    const user = userEvent.setup();
    const handleSubmit: BookingSubmitHandler = vi.fn(event => {
      event.preventDefault();
    });

    renderForm({ onSubmit: handleSubmit });

    await user.click(screen.getByRole("button", { name: "Book cabana" }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("disables the action while submitting", () => {
    renderForm({ bookingState: { status: "submitting" } });

    expect(screen.getByRole("button", { name: "Booking..." })).toBeDisabled();
  });

  it("renders field and form errors", () => {
    renderForm({
      bookingState: {
        status: "error",
        message: "Unable to complete booking. Please try again.",
        errors: {
          room: "Enter a room number.",
          guestName: "Enter a guest name.",
        },
      },
    });

    expect(screen.getByText("Enter a room number.")).toBeInTheDocument();
    expect(screen.getByText("Enter a guest name.")).toBeInTheDocument();
    expect(
      screen.getByText("Unable to complete booking. Please try again."),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("alert")).toHaveLength(3);
  });
});

type RenderFormOptions = Partial<
  Omit<Parameters<typeof BookingPanelForm>[0], "selectedCabanaId">
>;

const renderForm = ({
  bookingState = { status: "idle" },
  onSubmit = event => {
    event.preventDefault();
  },
}: RenderFormOptions = {}) =>
  render(
    <BookingPanelForm
      selectedCabanaId="cabana-0-0"
      bookingState={bookingState}
      onSubmit={onSubmit}
    />,
  );
