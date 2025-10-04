import React from "react";

import "../../styles/volunteer/AccountPageVol.css";

function DeleteAccount() {
  return (
    <div className="logs">
      <div className="delAcc">
        <h2>Delete Account</h2>
        <p>
          Deleting your account is a permanent action. Once deleted, you will no
          longer be able to access your account, and all of your personal
          information. This action cannot be undone.
        </p>
        <button>Delete Account</button>
      </div>

      <div className="logAcc">
        <h2>Log Out</h2>
        <p>
          Logging out will end your session immediately. You will need to log in
          again to access your account. Make sure you have saved all your work,
          as any unsaved changes will be lost. This action cannot be undone.
        </p>
        <button>Log Out</button>
      </div>
    </div>
  );
}

export default DeleteAccount;
