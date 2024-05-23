import React, { useState } from "react";
import { message, Form, Input, Button, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { QuestionCircleOutlined } from "@ant-design/icons";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  const resetPassword = async () => {
    try {
      const response = await axios.post("/api/users/reset-password", {
        password,
        token: params.token,
      });
      if (response.data.success) {
        message.success(response.data.message);
        navigate("/login");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // Password rules tooltip content
  const getPasswordRulesText = () => {
    return (
      <div>
        <div>At least 8 characters</div>
        <div>At least one uppercase letter</div>
        <div>At least one lowercase letter</div>
        <div>At least one number</div>
        <div>At least one special character</div>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[400px] flex space-y-5 flex-col p-5 shadow-lg border border-gray-300">
        <h1 className="font-semibold text-3xl text-primary flex items-center">
          CHANGE YOUR PASSWORD
          <Tooltip title={getPasswordRulesText()} placement="right">
            <QuestionCircleOutlined style={{ marginLeft: "5px" }} />
          </Tooltip>
        </h1>

        <Form onFinish={resetPassword}>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              RESET PASSWORD
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default ResetPassword;
