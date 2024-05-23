import { Button } from "antd";
import React from "react";

function PageNotFound() {
  const handleBack = () => {
    // Go back to the previous page
    window.history.back();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div className="text-center">
        <h1
          className="mb-4 text-6xl font-semibold"
          style={{ color: "#14a76c" }}
        >
          404
        </h1>
        <p className="mb-4 text-lg text-gray-600">
          Oops! Looks like you're lost.
        </p>
        <div className="animate-bounce">
          <svg
            className="mx-auto h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#14a76c"
            aria-hidden="true"
          >
            <title>Arrow icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            ></path>
          </svg>
        </div>
        <Button type="primary" onClick={handleBack}>
          GO BACK
        </Button>
      </div>
    </div>
  );
}

export default PageNotFound;
