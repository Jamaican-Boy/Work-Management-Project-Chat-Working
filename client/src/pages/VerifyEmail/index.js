import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SetButtonLoading } from "../../redux/loadersSlice";
import axios from "axios";

function VerifyEmail() {
  const [emailVerified, setEmailVerified] = useState("");
  const params = useParams();
  const dispatch = useDispatch();

  const verifyToken = async () => {
    try {
      dispatch(SetButtonLoading(true));
      const response = await axios.post("/api/users/verifyemail", {
        token: params.token,
      });

      if (response.data.success) {
        setEmailVerified("true");
      } else {
        setEmailVerified("false");
      }

      dispatch(SetButtonLoading(false));
    } catch (error) {
      dispatch(SetButtonLoading(false));
      setEmailVerified("false");
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <div className="flex min-h-screen p-5 justify-center items-center">
      {emailVerified === "" && (
        <h1 className="text-primary text-4xl">
          Please Wait We We Verifying Your Email...
        </h1>
      )}

      {emailVerified === "true" && (
        <div>
          <h1 className="text-primary text-4xl">
            <span>Your Email Is Verified Successfully!</span>
            <br />
            <span className="block text-center">
              Continue Your Journey From{" "}
              <Link to="/login" className="text-red-600">
                Here
              </Link>{" "}
            </span>
          </h1>
        </div>
      )}

      {emailVerified === "false" && (
        <div>
          <h1 className="text-primary text-4xl">
            <span>Invalid or Expired Token</span>
            <br />
            <span className="block text-center">
              Please{" "}
              <Link to="/register" className="text-red-600">
                Register
              </Link>{" "}
              Again!
            </span>
          </h1>
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;
