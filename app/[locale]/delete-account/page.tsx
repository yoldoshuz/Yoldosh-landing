import { Suspense } from "react";

import { DeleteAccount } from "@/components/pages/delete-account/DeleteAccount";

const DeleteAccountPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeleteAccount />
    </Suspense>
  );
};

export default DeleteAccountPage;
