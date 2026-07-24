import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BookingPanel, type BookingState, type BookingSubmitHandler } from ".";

describe("BookingPanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("does not render when no cabana is selected and booking is idle", () => {
    const { container } = renderPanel({
      selectedCabanaId: null,
      bookingState: { status: "idle" },
    });

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the booking form for the selected cabana", () => {
    renderPanel({
      selectedCabanaId: "cabana-0-0",
      bookingState: { status: "idle" },
    });

    expect(
      screen.getByRole("heading", { name: "Book cabana-0-0" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Room number")).toBeInTheDocument();
    expect(screen.getByLabelText("Guest name")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Close booking panel" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Book cabana" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeEnabled();
  });

  it("calls the close handler when the close button is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    renderPanel({
      selectedCabanaId: "cabana-0-0",
      bookingState: { status: "idle" },
      onClose: handleClose,
    });

    await user.click(
      screen.getByRole("button", { name: "Close booking panel" }),
    );

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls the close handler when the cancel button is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    renderPanel({
      selectedCabanaId: "cabana-0-0",
      bookingState: { status: "idle" },
      onClose: handleClose,
    });

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls the submit handler when the form is submitted", async () => {
    const user = userEvent.setup();
    const handleSubmit: BookingSubmitHandler = vi.fn(event => {
      event.preventDefault();
    });

    renderPanel({
      selectedCabanaId: "cabana-0-0",
      bookingState: { status: "idle" },
      onSubmit: handleSubmit,
    });

    await user.click(screen.getByRole("button", { name: "Book cabana" }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("disables the submit button while booking is submitting", () => {
    renderPanel({
      selectedCabanaId: "cabana-0-0",
      bookingState: { status: "submitting" },
    });

    expect(screen.getByRole("button", { name: "Booking..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  });

  it("disables the close button while booking is submitting", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    renderPanel({
      selectedCabanaId: "cabana-0-0",
      bookingState: { status: "submitting" },
      onClose: handleClose,
    });

    await user.click(
      screen.getByRole("button", { name: "Close booking panel" }),
    );

    expect(
      screen.getByRole("button", { name: "Close booking panel" }),
    ).toBeDisabled();
    expect(handleClose).not.toHaveBeenCalled();
  });

  it("renders field and form errors as alerts", () => {
    renderPanel({
      selectedCabanaId: "cabana-0-0",
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

  it("renders successful booking feedback as a status message", () => {
    renderPanel({
      selectedCabanaId: null,
      bookingState: {
        status: "success",
        message: "cabana-0-0 is booked.",
      },
    });

    expect(screen.getByRole("status")).toHaveTextContent(
      "cabana-0-0 is booked.",
    );
  });

  it("renders unavailable cabana feedback as an alert", () => {
    renderPanel({
      selectedCabanaId: null,
      bookingState: {
        status: "unavailable",
        message: "cabana-0-0 is already booked. Choose another cabana.",
      },
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "cabana-0-0 is already booked. Choose another cabana.",
    );
  });
});

type RenderPanelOptions = {
  selectedCabanaId: string | null;
  bookingState: BookingState;
  onClose?: () => void;
  onSubmit?: BookingSubmitHandler;
};

const renderPanel = ({
  selectedCabanaId,
  bookingState,
  onClose = () => undefined,
  onSubmit = event => {
    event.preventDefault();
  },
}: RenderPanelOptions) =>
  render(
    <BookingPanel
      selectedCabanaId={selectedCabanaId}
      bookingState={bookingState}
      onClose={onClose}
      onSubmit={onSubmit}
    />,
  );
