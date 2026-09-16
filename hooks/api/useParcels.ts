import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, toList } from "@/lib/api";
import type { AppParcel } from "@/types/api";
import { qk } from "./keys";

export interface CreateParcelPayload {
  tripId: string;
  pickup_latitude: number;
  pickup_longitude: number;
  dropoff_latitude: number;
  dropoff_longitude: number;
}

export const parcelsApi = {
  create: async (payload: CreateParcelPayload) => {
    const { data } = await api.post("/parcel", payload);
    return (data.data?.parcel ?? data.data) as AppParcel;
  },
  mine: async () => {
    const { data } = await api.get("/parcel/my");
    return toList<AppParcel>(data.data?.parcels ?? data.data);
  },
  byTrip: async (tripId: string) => {
    const { data } = await api.get(`/parcel/trip/${tripId}`);
    return toList<AppParcel>(data.data?.parcels ?? data.data);
  },
  details: async (parcelId: string) => {
    const { data } = await api.get(`/parcel/${parcelId}`);
    return (data.data?.parcel ?? data.data) as AppParcel;
  },
  cancel: async ({ parcelId, cancellationReason }: { parcelId: string; cancellationReason: string }) =>
    (await api.patch(`/parcel/${parcelId}/cancel`, { cancellationReason })).data,
  confirm: async (parcelId: string) => (await api.post(`/parcel/${parcelId}/confirm`)).data,
  reject: async ({ parcelId, reason }: { parcelId: string; reason?: string }) =>
    (await api.post(`/parcel/${parcelId}/reject`, reason ? { reason } : {})).data,
  pickup: async (parcelId: string) => (await api.post(`/parcel/${parcelId}/pickup`)).data,
  deliver: async (parcelId: string) => (await api.post(`/parcel/${parcelId}/deliver`)).data,
};

export const useMyParcels = () => useQuery({ queryKey: qk.parcels, queryFn: parcelsApi.mine });

export const useTripParcels = (tripId?: string) =>
  useQuery({
    queryKey: qk.tripParcels(tripId ?? ""),
    queryFn: () => parcelsApi.byTrip(tripId!),
    enabled: Boolean(tripId),
  });

const useParcelMutation = <TVars,>(mutationFn: (vars: TVars) => Promise<unknown>) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.parcels });
      qc.invalidateQueries({ queryKey: ["app", "trips"] });
    },
  });
};

export const useCreateParcel = () => useParcelMutation(parcelsApi.create);
export const useCancelParcel = () => useParcelMutation(parcelsApi.cancel);
export const useConfirmParcel = () => useParcelMutation(parcelsApi.confirm);
export const useRejectParcel = () => useParcelMutation(parcelsApi.reject);
export const usePickupParcel = () => useParcelMutation(parcelsApi.pickup);
export const useDeliverParcel = () => useParcelMutation(parcelsApi.deliver);
