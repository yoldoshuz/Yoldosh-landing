import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, toList } from "@/lib/api";
import type { AppCar } from "@/types/api";
import { qk } from "./keys";

export interface CreateCarPayload {
  make: string;
  model: string;
  year: number;
  plate_number: string;
  seats_standard: number;
  color: string;
}

export const carsApi = {
  myCars: async () => {
    const { data } = await api.get("/car/my-cars");
    return toList<AppCar>(data.data);
  },
  create: async (payload: CreateCarPayload) => (await api.post("/car", payload)).data,
  update: async ({ carId, ...payload }: Partial<CreateCarPayload> & { carId: string }) =>
    (await api.patch(`/car/${carId}`, payload)).data,
  remove: async (carId: string) => (await api.delete(`/car/${carId}`)).data,
  resubmit: async ({ carId, passport_number, carPassportLink }: { carId: string; passport_number: string; carPassportLink: string }) =>
    (await api.patch(`/car/${carId}/resubmit`, { passport_number, carPassportLink })).data,
};

export const useMyCars = () => useQuery({ queryKey: qk.cars, queryFn: carsApi.myCars });

const useCarMutation = <TVars,>(mutationFn: (vars: TVars) => Promise<unknown>) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.cars });
      qc.invalidateQueries({ queryKey: qk.me });
    },
  });
};

export const useCreateCar = () => useCarMutation(carsApi.create);
export const useUpdateCar = () => useCarMutation(carsApi.update);
export const useDeleteCar = () => useCarMutation(carsApi.remove);
export const useResubmitCar = () => useCarMutation(carsApi.resubmit);
