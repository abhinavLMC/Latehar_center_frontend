import { EyeOutlined } from "@ant-design/icons";
import { ModalWrapper } from "@components/Wrapper";
import { Col, Row, Tooltip } from "antd";
import React, { useState } from "react";
import ViewFileLink from "./ViewFile";

interface PropTypes {
  title?: string;
  children?: React.ReactNode;
  viewData?: {
    [key: string]: string | number | boolean | undefined | React.ReactNode;
  };
  label?: React.ReactNode
}

const ViewDetailsModal = ({ title, children, viewData, label }: PropTypes) => {
  const [openViewModal, setOpenViewModal] = useState(false);
  return (
    <>
      {label ? (
        <span onClick={() => setOpenViewModal(true)}>{label}</span>
      ) : (
        <Tooltip title="Preview">
          <EyeOutlined onClick={() => setOpenViewModal(true)} />
        </Tooltip>
      )}
      {openViewModal && (
        <ModalWrapper
          width={600}
          centered
          open={openViewModal}
          title={`${title ?? ""} Details`}
          onCancel={() => {
            setOpenViewModal(false);
          }}
          footer={
            <div>
              {/* <ButtonWrapper
                className="modal-close-btn"
                onClick={() => {
                  setOpenViewModal(false);
                }}
              >
                {"Cancel"}
              </ButtonWrapper> */}
            </div>
          }
        >
          <div className="mt-2">
            {!!viewData &&
              Object.entries(viewData)?.map((obj) => {
                const value = (obj[1]?.toString() as string)?.startsWith('https') ? <ViewFileLink fileUrl={obj[1] as string} /> : obj[1]
                return (
                  <Row className="mb-2">
                    <Col span={9}>{obj[0]}</Col>
                    <Col span={1}>:</Col>
                    <Col span={14}>{value}</Col>
                  </Row>
                ); 
              })}
          </div>
          <div>{children}</div>
        </ModalWrapper>
      )}
    </>
  );
};

export default ViewDetailsModal;
