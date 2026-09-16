import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { AppBooking, CreateBookingPayload } from "@/types/api";
import { qk } from "./keys";

export const bookingsApi = {
  create: async (payload: CreateBookingPayload) => {
    const { data } = await api.post("/booking", payload);
    return data.data as AppBooking;
  },
  details: async (bookingId: string) => {
    const { data } = await api.get("/booking", { params: { bookingId } });
    return data.data as AppBooking;
  },
  confirm: async (bookingId: string) => (await api.post(`/booking/${bookingId}/confirm`)).data,
  reject: async ({ bookingId, reason }: { bookingId: string; reason?: string }) =>
    (await api.post(`/booking/${bookingId}/reject`, reason ? { reason } : {})).data,
  cancel: async ({ bookingId, cancellationReason }: { bookingId: string; cancellationReason: string }) =>
    (await api.patch(`/booking/${bookingId}/cancel`, { cancellationReason })).data,
};

export const useBooking = (bookingId?: string) =>
  useQuery({
    queryKey: qk.booking(bookingId ?? ""),
    queryFn: () => bookingsApi.details(bookingId!),
    enabled: Boolean(bookingId),
  });

const useBookingMutation = <TVars,>(mutationFn: (vars: TVars) => Promise<unknown>) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["app", "trips"] });
      qc.invalidateQueries({ queryKey: ["app", "bookings"] });
    },
  });
};

export const useCreateBooking = () => useBookingMutation(bookingsApi.create);
export const useConfirmBooking = () => useBookingMutation(bookingsApi.confirm);
export const useRejectBooking = () => useBookingMutation(bookingsApi.reject);
export const useCancelBooking = () => useBookingMutation(bookingsApi.cancel);
