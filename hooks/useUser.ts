import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

export const userApi = {
  getPassengerDetails: async (userId: string) => {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  },
};

export const usePassengerDetails = (userId: string) => {
  return useQuery({
    queryKey: ["user", "details", userId],
    queryFn: () => userApi.getPassengerDetails(userId),
    staleTime: 10 * 60 * 1000,
    enabled: !!userId,
  });
};
