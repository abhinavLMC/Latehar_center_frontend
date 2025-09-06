import { Card, Divider, Space, Spin } from "antd";
import React from "react";

interface cardProps {
  height?: string;
  message?: string;
  status?: number;
  loading?: boolean;
}
const NotFoundPage = ({
  height,
  message,
  status = 404,
  loading,
}: cardProps): JSX.Element => {
  return (
    <Card
      className="d-flex align-items-center justify-content-center rounded-0"
      style={{ height: height || "85vh" }}
    >
      {loading ? (
        <div className="container">
          <Spin />
        </div>
      ) : (
        <div className="container">
          {status === 403 ? (
            <div className="no-access-box">
              <img
                src="/images/access-denied.png"
                alt="No permission"
                className="img-fluid"
              />
              {/* <h3 className="m-0">{message}</h3> */}
            </div>
          ) : (
            <Space size={16}>
              <h2>{status}</h2>
              <Divider
                type="vertical"
                style={{ height: "80px", borderColor: "#ccc" }}
              />
              <h3 className="m-0">{message}</h3>
            </Space>
          )}
        </div>
      )}
    </Card>
  );
};

export default NotFoundPage;
