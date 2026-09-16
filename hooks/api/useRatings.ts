import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, toList } from "@/lib/api";
import type { AppRating } from "@/types/api";
import { qk } from "./keys";

export const ratingsApi = {
  byUser: async (userId: string) => {
    const { data } = await api.get(`/ratings/${userId}`, { params: { limit: 20 } });
    return toList<AppRating>(data.data);
  },
  create: async (payload: { tripId: string; ratedUserId: string; rating: number; feedback?: string }) =>
    (await api.post("/ratings", payload)).data,
};

export const useUserRatings = (userId?: string) =>
  useQuery({
    queryKey: qk.ratings(userId ?? ""),
    queryFn: () => ratingsApi.byUser(userId!),
    enabled: Boolean(userId),
  });

export const useCreateRating = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ratingsApi.create,
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: qk.ratings(vars.ratedUserId) }),
  });
};
