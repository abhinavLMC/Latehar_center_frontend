import { TableContentLoaderWithProps } from '@components/Common/SkeletonLoader/ContentLoader';
import { CardWrapper, InputWrapper, SelectWrapper } from '@components/Wrapper';
import { Form, Row, Col } from "antd";
import React from 'react'
import { TestPropTypes } from "./type";
import { optionKeys } from '@utils/commonFunctions';
import useSetFieldData from './hook/setFieldData';
interface PropTypes {
  backUrl?: string
}

const EyeTest = ({ loading, data, form }: TestPropTypes) => {

  const fieldName = "eye_unit";

  const key1 = "Spherical Right";
  const key2 = "Spherical Left";
  const key3 = "Cylindrical Right";
  const key4 = "Cylindrical Left";
  const key5 = "Colour Blindness";

  // set initially all the value inside of given field name
  useSetFieldData( form, key1, [fieldName, "spherical_right_eye_unit"], data, "spherical_right_" );
  useSetFieldData( form, key2, [fieldName, "spherical_left_eye_unit"], data, "spherical_left_" );
  useSetFieldData( form, key3, [fieldName, "cylindrical_right_eye_unit"], data, "cylindrical_right_" );
  useSetFieldData( form, key4, [fieldName, "cylindrical_left_eye_unit"], data, "cylindrical_left_" );
  useSetFieldData( form, key5, [fieldName, "colour_blindness_unit"], data, "colour_blindness_" );

  const blindOptions =
    !!data &&
    optionKeys(data, "colour_blindness_")?.map((item) => ({
      label: item,
      value: item,
    }));

  return (
    <CardWrapper>
      {loading ? (
        <TableContentLoaderWithProps columnWidth={[100]} />
      ) : (
        <div className="test-wrapper">
          <p>Eye Test</p>
          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">Right Eye AV</h4>
            <Form.Item
              name={["selected_test", fieldName, "spherical_right_eye_unit"]}
              hidden
            />
            <Form.Item
              name={["selected_test", fieldName, "cylindrical_right_eye_unit"]}
              hidden
            />
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Spherical"
                  name={[
                    "selected_test",
                    fieldName,
                    "spherical_right_eye_unit",
                    "value",
                  ]}
                >
                  <InputWrapper />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Cylindrical"
                  name={[
                    "selected_test",
                    fieldName,
                    "cylindrical_right_eye_unit",
                    "value",
                  ]}
                >
                  <InputWrapper />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">Left Eye AV</h4>
            <Form.Item
              name={["selected_test", fieldName, "spherical_left_eye_unit"]}
              hidden
            />
            <Form.Item
              name={["selected_test", fieldName, "cylindrical_left_eye_unit"]}
              hidden
            />
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Spherical"
                  name={[
                    "selected_test",
                    fieldName,
                    "spherical_left_eye_unit",
                    "value",
                  ]}
                >
                  <InputWrapper />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Cylindrical"
                  name={[
                    "selected_test",
                    fieldName,
                    "cylindrical_left_eye_unit",
                    "value",
                  ]}
                >
                  <InputWrapper />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">
              Colour Blindness
            </h4>
            <Form.Item
              name={["selected_test", fieldName, "colour_blindness_unit"]}
              hidden
            />
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Select Unit"
                  name={[
                    "selected_test",
                    fieldName,
                    "colour_blindness_unit",
                    "value",
                  ]}
                >
                  <SelectWrapper options={blindOptions} />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </CardWrapper>
  );
};

export default EyeTest