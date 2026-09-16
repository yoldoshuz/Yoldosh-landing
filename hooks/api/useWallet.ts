import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, toList } from "@/lib/api";
import type { AppCard, AppTransaction, AppWallet } from "@/types/api";
import { qk } from "./keys";

export const walletApi = {
  wallet: async () => {
    const { data } = await api.get("/wallet/me");
    return data.data as AppWallet;
  },
  transactions: async (page = 1, limit = 20) => {
    const { data } = await api.get("/wallet/me/transactions", { params: { page, limit } });
    return data.data as { transactions: AppTransaction[]; total: number; currentPage: number; totalPages: number };
  },
  deposit: async ({ amount, userCardId }: { amount: number; userCardId: string }) => {
    const { data } = await api.post("/wallet/deposit", { amount, userCardId });
    return data.data as { transactionId: string };
  },
  cards: async () => {
    const { data } = await api.get("/card/getAllUsersCards");
    return toList<AppCard>(data.data);
  },
  createCard: async () => {
    const { data } = await api.post("/card/createUserCard");
    return data.data as { tokenizeUrl: string; contractCreateUrl: string };
  },
  deleteCard: async (userCardId: number) => (await api.delete("/card/deleteCard", { data: { userCardId } })).data,
};

export const useWallet = () => useQuery({ queryKey: qk.wallet, queryFn: walletApi.wallet });

export const useTransactions = () => useQuery({ queryKey: qk.transactions, queryFn: () => walletApi.transactions() });

export const useCards = () => useQuery({ queryKey: qk.cards, queryFn: walletApi.cards });

export const useCreateCard = () => useMutation({ mutationFn: walletApi.createCard });

export const useDeleteCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: walletApi.deleteCard,
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.cards }),
  });
};

export const useDeposit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: walletApi.deposit,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.wallet });
      qc.invalidateQueries({ queryKey: qk.transactions });
    },
  });
};
