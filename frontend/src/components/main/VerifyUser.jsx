import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function VerifyUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your account...");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/verify/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "User verified successfully") {
          setMessage("Your account is verified! Redirecting to login...");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setMessage(data.message);
        }
      })
      .catch(() => setMessage("Something went wrong. Try again."));
  }, [id, navigate]);

  return <div>{message}</div>;
}

export default VerifyUser;
