import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BookingPanelCloseButton } from ".";

describe("BookingPanelCloseButton", () => {
  afterEach(() => {
    cleanup();
  });

  it("calls the close handler when clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(<BookingPanelCloseButton disabled={false} onClose={handleClose} />);

    await user.click(
      screen.getByRole("button", { name: "Close booking panel" }),
    );

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("does not call the close handler when disabled", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(<BookingPanelCloseButton disabled={true} onClose={handleClose} />);

    await user.click(
      screen.getByRole("button", { name: "Close booking panel" }),
    );

    expect(
      screen.getByRole("button", { name: "Close booking panel" }),
    ).toBeDisabled();
    expect(handleClose).not.toHaveBeenCalled();
  });
});
