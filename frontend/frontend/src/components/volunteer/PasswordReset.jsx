import React from "react";

function PasswordReset() {
  return (
    <div className="passwordReset">
      <form action="">
        <h2>Password Reset</h2>
        <label htmlFor="password">
          Current Password
          <input
            type="password"
            name="current-password"
            id="current-password"
          />
        </label>
        <label htmlFor="new-password">
          New Password
          <input type="password" name="new-password" id="new-password" />
        </label>
        <label htmlFor="confirm-password">
          Confirm Password
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
          />
        </label>
        <button className="save">Save Password</button>
      </form>
    </div>
  );
}

export default PasswordReset;
