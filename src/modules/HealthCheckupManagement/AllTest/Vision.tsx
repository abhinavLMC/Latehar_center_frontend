import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import { CardWrapper, SelectWrapper } from "@components/Wrapper";
import { Form, Row, Col } from "antd";
import React from "react";
import { TestPropTypes } from "./type";
import useSetFieldData from "./hook/setFieldData";
import { optionKeys } from "@utils/commonFunctions";

const Vision = ({ loading, data, form }: TestPropTypes) => {
  const fieldName = "vision_unit";
  const label = "Vision"

  // set initially all the value inside of given field name
  useSetFieldData(form, label, fieldName, data);

  const visionOptions =
    !!data &&
    optionKeys(data)?.map((item) => ({
      label: item,
      value: item,
    }));
  return (
    <CardWrapper>
      {loading ? (
        <TableContentLoaderWithProps columnWidth={[100]} />
      ) : (
        <div className="test-wrapper">
          <p>{label}</p>
          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">{label}</h4>
            <Form.Item name={["selected_test", fieldName]} hidden />
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Select Unit"
                  name={["selected_test", fieldName, "value"]}
                >
                  <SelectWrapper options={visionOptions} />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </CardWrapper>
  );
};

export default Vision;
