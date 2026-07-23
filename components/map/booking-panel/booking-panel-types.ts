import type { SubmitEventHandler } from "react";

import type { BookingFormData } from "./booking-form-schema";

export type BookingFormErrors = Partial<Record<keyof BookingFormData, string>>;

export type BookingState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message?: string; errors?: BookingFormErrors }
  | { status: "unavailable"; message: string };

export type BookingPanelFeedbackState = Extract<
  BookingState,
  { status: "success" } | { status: "unavailable" }
>;

export type BookingSubmitHandler = SubmitEventHandler<HTMLFormElement>;
