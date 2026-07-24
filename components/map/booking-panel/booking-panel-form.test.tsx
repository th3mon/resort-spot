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

  it("calls the cancel handler when canceled", async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();

    renderForm({ onCancel: handleCancel });

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it("disables the action while submitting", () => {
    const { container } = renderForm({
      bookingState: { status: "submitting" },
    });

    expect(screen.getByRole("button", { name: "Booking..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(messagePlaceholdersIn(container)).toHaveLength(1);
  });

  it("renders field and form errors", () => {
    const { container } = renderForm({
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
    expect(messagePlaceholdersIn(container)).toHaveLength(0);
  });

  it("reserves field message space for an error state without a form message", () => {
    const { container } = renderForm({
      bookingState: {
        status: "error",
        errors: {
          room: "Enter a room number.",
        },
      },
    });

    expect(screen.getByText("Enter a room number.")).toBeInTheDocument();
    expect(screen.getAllByRole("alert")).toHaveLength(1);
    expect(messagePlaceholdersIn(container)).toHaveLength(1);
  });

  it("reserves form message space while idle", () => {
    const { container } = renderForm();

    expect(messagePlaceholdersIn(container)).toHaveLength(1);
  });

  it("does not reserve message space for completed booking states", () => {
    const { container, rerender } = renderForm({
      bookingState: {
        status: "success",
        message: "Cabana booked.",
      },
    });

    expect(messagePlaceholdersIn(container)).toHaveLength(0);

    rerender(
      <BookingPanelForm
        selectedCabanaId="cabana-0-0"
        bookingState={{
          status: "unavailable",
          message: "Cabana is no longer available.",
        }}
        onCancel={() => undefined}
        onSubmit={event => {
          event.preventDefault();
        }}
      />,
    );

    expect(messagePlaceholdersIn(container)).toHaveLength(0);
  });

  it("does not reserve field message space when a form error is present", () => {
    const { container } = renderForm({
      bookingState: {
        status: "error",
        message: "Unable to complete booking. Please try again.",
      },
    });

    expect(
      screen.getByText("Unable to complete booking. Please try again."),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("alert")).toHaveLength(1);
    expect(messagePlaceholdersIn(container)).toHaveLength(0);
  });

  it("renders all field placeholders when validation fails without field errors", () => {
    const { container } = renderForm({
      bookingState: {
        status: "error",
        errors: {},
      },
    });

    expect(messagePlaceholdersIn(container)).toHaveLength(2);
  });

  it("keeps placeholder layout hidden from accessibility APIs", () => {
    const { container } = renderForm();

    expect(messagePlaceholdersIn(container)[0]).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});

type RenderFormOptions = Partial<
  Omit<Parameters<typeof BookingPanelForm>[0], "selectedCabanaId">
>;

const renderForm = ({
  bookingState = { status: "idle" },
  onCancel = () => undefined,
  onSubmit = event => {
    event.preventDefault();
  },
}: RenderFormOptions = {}) =>
  render(
    <BookingPanelForm
      selectedCabanaId="cabana-0-0"
      bookingState={bookingState}
      onCancel={onCancel}
      onSubmit={onSubmit}
    />,
  );

const messagePlaceholdersIn = (container: HTMLElement) =>
  container.querySelectorAll(".booking-panel__message-placeholder");
