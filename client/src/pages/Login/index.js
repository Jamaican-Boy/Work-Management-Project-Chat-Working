import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Divider from "../../components/Divider";
import { LoginUser } from "../../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetButtonLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";
import axios from "axios";

function Login() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { buttonLoading } = useSelector((state) => state.loaders);
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(SetButtonLoading(true));
      const response = await LoginUser(values);
      dispatch(SetButtonLoading(false));
      if (response.success) {
        localStorage.setItem("token", response.data);
        message.success(response.message);
        navigate("/"); // Use navigate instead of window.location.href
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetButtonLoading(false));
      message.error(error.message || "An error occurred. Please try again.");
    }
  };

  const sendResetPasswordLink = async () => {
    try {
      // Check if email is empty or not a valid email address
      if (!email || !isValidEmail(email)) {
        message.error("Please enter a valid email address.");
        return;
      }

      message.loading({
        content: "Sending reset password link...",
        key: "resetPassword",
      });
      const response = await axios.post("/api/users/send-password-reset-link", {
        email,
      });
      message.destroy("resetPassword");
      if (response.data.success) {
        message.success(response.data.message);
        setShowForgotPassword(false);
      } else {
        message.error(
          response.data.message || "Failed to send reset password link."
        );
      }
    } catch (error) {
      message.destroy("resetPassword");
      message.error("Something went wrong. Please try again later.");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  // Function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="grid grid-cols-2">
      {/* Left */}
      <div className="bg-primary h-screen flex flex-col justify-center items-center">
        <div>
          <h1 className="text-7xl text-white">WORK-TRACKER</h1>
          <span className="flex justify-center text-white mt-5">
            One place to track all your business records
          </span>
        </div>
      </div>
      {/* Right */}
      {!showForgotPassword && (
        <div className="flex justify-center items-center">
          <div className="w-[420px]">
            <h1 className="text-2xl text-gray-700">LOGIN TO YOUR ACCOUNT</h1>
            <Divider />
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Email"
                name="email"
                rules={getAntdFormInputRules}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={getAntdFormInputRules}
              >
                <Input.Password type="password" />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={buttonLoading}
              >
                {buttonLoading ? "Loading" : "Login"}
              </Button>
              <div className="flex justify-between mt-5">
                <span>
                  Don't have an account? <Link to="/register">Register</Link>
                </span>
                <span
                  className="primary cursor-pointer text-red-500"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot Password?
                </span>
              </div>
            </Form>
          </div>
        </div>
      )}
      {/* Forgot Password Section */}
      {showForgotPassword && (
        <div className="flex justify-center items-center">
          <div className="w-[420px]">
            <h1 className="text-2xl text-gray-700">FORGOT PASSWORD</h1>
            <Divider />
            <Form>
              <Form.Item>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
              <Button type="primary" block onClick={sendResetPasswordLink}>
                Send Reset Password Link
              </Button>
              <div className="flex justify-center mt-5">
                <span
                  className="primary cursor-pointer text-blue-500"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Back to Login
                </span>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
