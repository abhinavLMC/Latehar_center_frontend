import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import { CardWrapper, InputWrapper } from "@components/Wrapper";
import { Form, Row, Col } from "antd";
import React from "react";
import { TestPropTypes } from "./type";
import useSetFieldData from "./hook/setFieldData";

const Cholesterol = ({ loading, data, form }: TestPropTypes) => {
  const fieldName = "cholesterol_unit";
  const key1 = "Total Cholesterol";
  const key2 = "LD Cholesterol";
  const key3 = "HD Cholesterol";

  // set initially all the value inside of given field name
  useSetFieldData( form, key1, [fieldName, "total_cholesterol"], data, "total_cholesterol_" );
  useSetFieldData( form, key2, [fieldName, "ld_cholesterol"], data, "ld_cholesterol_" );
  useSetFieldData( form, key3, [fieldName, "hd_cholesterol"], data, "hd_cholesterol_" );

  return (
    <CardWrapper>
      {loading ? (
        <TableContentLoaderWithProps columnWidth={[100]} />
      ) : (
        <div className="test-wrapper">
          <p>Cholesterol</p>
          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">
              Total cholesterol
            </h4>
            <Form.Item
              name={["selected_test", fieldName, "total_cholesterol"]}
              hidden
            />
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={`Units (${data?.total_cholesterol_units})`}
                  name={[
                    "selected_test",
                    "cholesterol_unit",
                    "total_cholesterol",
                    "value",
                  ]}
                >
                  <InputWrapper />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">LD Cholesterol</h4>
            <Form.Item
              name={["selected_test", fieldName, "ld_cholesterol"]}
              hidden
            />
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={`Units (${data?.ld_cholesterol_units})`}
                  name={["selected_test", fieldName, "ld_cholesterol", "value"]}
                >
                  <InputWrapper />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">HD Cholesterol</h4>
            <Form.Item
              name={["selected_test", fieldName, "hd_cholesterol"]}
              hidden
            />
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={`Units (${data?.hd_cholesterol_units})`}
                  name={["selected_test", fieldName, "hd_cholesterol", "value"]}
                >
                  <InputWrapper />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </CardWrapper>
  );
};

export default Cholesterol;
