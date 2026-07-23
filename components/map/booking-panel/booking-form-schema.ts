import { z } from "zod";

export const bookingFormSchema = z.object({
  room: z.string().trim().min(1, "Enter a room number."),
  guestName: z.string().trim().min(1, "Enter a guest name."),
});

export type BookingFormData = z.output<typeof bookingFormSchema>;
