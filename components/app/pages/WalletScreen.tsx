"use client";

import { useState } from "react";
import { CreditCard, Loader2, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppTopBar } from "@/components/app/AppTopBar";
import { EmptyState, ErrorNote, formatDateTime, formatMoney, ILLUSTRATION, Screen, SectionLabel, Spinner, SuccessNote } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCards, useCreateCard, useDeleteCard, useDeposit, useTransactions, useWallet } from "@/hooks/api/useWallet";
import { apiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

const AMOUNT_TONE: Record<string, string> = {
  DEPOSIT: "text-brand-600",
  REFUND: "text-brand-600",
  TRANSFER: "text-ink",
  PAYMENT: "text-danger",
  WITHDRAWAL: "text-danger",
  COMMISSION: "text-danger",
};

export const WalletScreen = () => {
  const t = useTranslations("App");

  const { data: wallet, isLoading } = useWallet();
  const { data: transactionsData } = useTransactions();
  const { data: cards } = useCards();

  const deposit = useDeposit();
  const createCard = useCreateCard();
  const deleteCard = useDeleteCard();

  const [amount, setAmount] = useState("");
  const [selectedCard, setSelectedCard] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const transactions = transactionsData?.transactions ?? [];

  const topUp = async () => {
    if (!amount || !selectedCard) return;
    setError(null);
    setNotice(null);
    try {
      await deposit.mutateAsync({ amount: Number(amount), userCardId: selectedCard });
      setAmount("");
      setNotice(t("Wallet.DepositStarted"));
    } catch (e) {
      setError(apiErrorMessage(e, t("Errors.Generic")));
    }
  };

  const addCard = async () => {
    setError(null);
    try {
      const { tokenizeUrl } = await createCard.mutateAsync();
      // IPAK YOLI hosts the card form — hand the user off rather than ever
      // touching card data ourselves.
      if (tokenizeUrl) window.location.href = tokenizeUrl;
    } catch (e) {
      setError(apiErrorMessage(e, t("Errors.Generic")));
    }
  };

  if (isLoading) {
    return (
      <>
        <AppTopBar title={t("Wallet.Title")} back="/profile" />
        <Spinner />
      </>
    );
  }

  return (
    <>
      <AppTopBar title={t("Wallet.Title")} back="/profile" />
      <Screen className="space-y-4">
        <div className="app-hero rounded-[var(--radius-card)] p-6 text-white">
          <p className="text-sm text-white/85">{t("Wallet.Balance")}</p>
          <p className="mt-1 text-3xl font-bold">{formatMoney(wallet?.balance ?? 0, wallet?.currency ?? "UZS")}</p>
        </div>

        <ErrorNote message={error} />
        <SuccessNote message={notice} />

        <div>
          <SectionLabel>{t("Wallet.Cards")}</SectionLabel>
          <div className="space-y-2">
            {!cards || cards.length === 0 ? (
              <p className="app-card p-4 text-sm text-ink-muted">{t("Wallet.NoCards")}</p>
            ) : (
              cards.map((card) => (
                <div
                  key={card.id}
                  className={cn(
                    "app-card flex items-center gap-3 p-4 transition",
                    selectedCard === String(card.id) && "ring-2 ring-brand-500"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedCard(String(card.id))}
                    className="flex flex-1 cursor-pointer items-center gap-3 text-left"
                  >
                    <CreditCard className="size-5 shrink-0 text-ink-muted" />
                    <span className="font-medium text-ink">{card.cardNumber}</span>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t("Wallet.DeleteCard")}
                    onClick={() => void deleteCard.mutateAsync(card.id)}
                    className="size-8 shrink-0 text-neutral-400 hover:bg-red-50 hover:text-danger"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))
            )}

            <Button
              variant="outline"
              onClick={() => void addCard()}
              disabled={createCard.isPending}
              className="h-12 w-full rounded-full"
            >
              {createCard.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              {t("Wallet.AddCard")}
            </Button>
          </div>
        </div>

        <div>
          <SectionLabel>{t("Wallet.TopUp")}</SectionLabel>
          <div className="app-card space-y-3 p-4">
            <div>
              <Label htmlFor="amount" className="mb-1.5">
                {t("Wallet.Amount")}
              </Label>
              <Input
                id="amount"
                type="number"
                min={1000}
                step={1000}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50000"
                className="h-12 rounded-2xl"
              />
            </div>
            <Button
              onClick={() => void topUp()}
              disabled={!amount || !selectedCard || deposit.isPending}
              className="h-12 w-full rounded-full bg-brand-500 font-semibold hover:bg-brand-600 disabled:bg-neutral-300 disabled:opacity-100"
            >
              {deposit.isPending ? <Loader2 className="size-5 animate-spin" /> : t("Wallet.TopUpSubmit")}
            </Button>
            {!selectedCard && <p className="text-xs text-ink-muted">{t("Wallet.PickCard")}</p>}
          </div>
        </div>

        <div>
          <SectionLabel>{t("Wallet.History")}</SectionLabel>
          {transactions.length === 0 ? (
            <EmptyState illustration={ILLUSTRATION.money} title={t("Wallet.NoTransactions")} />
          ) : (
            <div className="app-card divide-y divide-neutral-100 px-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between gap-3 py-3.5">
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{t(`Wallet.Types.${tx.type}`)}</p>
                    <p className="truncate text-xs text-ink-muted">{tx.description || formatDateTime(tx.createdAt)}</p>
                  </div>
                  <span className={cn("shrink-0 font-semibold", AMOUNT_TONE[tx.type] ?? "text-ink")}>
                    {formatMoney(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Screen>
    </>
  );
};
