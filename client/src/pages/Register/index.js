import React, { useEffect } from "react";
import { Form, Input, Button, message, Tooltip } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { QuestionCircleOutlined } from '@ant-design/icons';
import Divider from "../../components/Divider";
import { RegisterUser } from "../../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetButtonLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";

function Register() {
  const navigate = useNavigate();
  const { buttonLoading } = useSelector((state) => state.loaders);
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    try {
      dispatch(SetButtonLoading(true));
      const response = await RegisterUser(values);
      dispatch(SetButtonLoading(false));
      if (response.success) {
        message.success(response.message);
        navigate("/login");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetButtonLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

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
    <div className="grid grid-cols-2">
      {/* Left */}
      <div className="flex justify-center items-center background">
        <div className="w-[420px]">
          <h1 className="text-2xl text-gray-700 uppercase">
            Lets get you started
          </h1>
          <Divider />
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={getAntdFormInputRules}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              rules={getAntdFormInputRules}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={getAntdFormInputRules}>
              <Input />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Password&nbsp;
                  <Tooltip title={getPasswordRulesText()} placement="right">
                    <QuestionCircleOutlined style={{ cursor: "pointer", fontSize: "16px" }} />
                  </Tooltip>
                </span>
              }
              name="password"
              rules={getAntdFormInputRules}
            >
              <Input.Password type="password" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
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
              {buttonLoading ? "Loading" : "Register"}
            </Button>

            <div className="flex justify-center mt-5">
              <span>
                Already have an account? <Link to="/login">Login</Link>
              </span>
            </div>
          </Form>
        </div>
      </div>
      {/* Right */}
      <div className="bg-primary h-screen flex flex-col justify-center items-center">
        <div>
          <h1 className="text-7xl text-white">WORK-TRACKER</h1>
          <span className="flex justify-center text-white mt-5">
            One place to track all your business records
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;
