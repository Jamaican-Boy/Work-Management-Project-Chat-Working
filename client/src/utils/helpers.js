import moment from "moment";
import { Navigate } from "react-router-dom";

export const getAntdFormInputRules = [
  {
    required: true,
    message: "Required",
    validateTrigger: "onSubmit", // Trigger validation only on form submission
  },
];
export const getDateFormat = (date) => {
  return moment(date).format("MMMM Do YYYY, h:mm A");
};

export const PublicRoutes = ({ children }) => {
  const user = localStorage.getItem("user");
  if (user !== "" && user) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
};
