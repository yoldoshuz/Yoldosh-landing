import type { Metadata } from "next";
import { Suspense } from "react";

import { DeleteAccount } from "@/components/pages/delete-account/DeleteAccount";

/**
 * Account deletion is an authenticated utility flow with no SEO value
 * and potentially sensitive parameter shapes. Block indexing entirely
 * and disallow crawler link following from this surface.
 */
export const metadata: Metadata = {
  title: "Delete account — Yoldosh",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

const DeleteAccountPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeleteAccount />
    </Suspense>
  );
};

export default DeleteAccountPage;
