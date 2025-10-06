import React from "react";
import PasswordReset from "../../components/main/PasswordReset";
import "../../styles/volunteer/AccountPageVol.css";
import DeleteAccount from "../../components/main/DeleteLogoutAccount";

function AccountPage() {
  return (
    <div className="account-page">
      <PasswordReset />
      <DeleteAccount />
    </div>
  );
}

export default AccountPage;
