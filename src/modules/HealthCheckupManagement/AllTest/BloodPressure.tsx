import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import {
  CardWrapper,
  InputWrapper,
} from "@components/Wrapper";
import { Form, Row, Col } from "antd";
import React from "react";
import { TestPropTypes } from "./type";
import useSetFieldData from "./hook/setFieldData";
import { useVitalValidation } from "./hook/useVitalValidation";

const BloodPressure = ({ loading, data, form }: TestPropTypes) => {
  const fieldName = "blood_pressure_unit";
  const key1 = "BP Systolic";
  const key2 = "BP Diastolic";
  const { getVitalValidationRules } = useVitalValidation();

  // set initially all the value inside of given field name
  useSetFieldData(form, key1, [fieldName, "systolic_bp_unit"], data, "systolic_");
  useSetFieldData(form, key2, [fieldName, "diastolic_bp_unit"], data, "diastolic_");

  return (
    <CardWrapper>
      {loading ? (
        <TableContentLoaderWithProps columnWidth={[100]} />
      ) : (
        <div className="test-wrapper">
          <p>Blood Pressure</p>
          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">Systolic BP</h4>
            <Form.Item
              name={["selected_test", fieldName, "systolic_bp_unit"]}
              hidden
            />
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={`Units (${data?.systolic_units})`}
                  name={[
                    "selected_test",
                    "blood_pressure_unit",
                    "systolic_bp_unit",
                    "value",
                  ]}
                  rules={[
                    ...getVitalValidationRules('blood_pressure', 'systolic'),
                    {
                      required: false,
                      message: 'Please enter systolic blood pressure'
                    }
                  ]}
                  validateTrigger={['onChange', 'onBlur']}
                >
                  <InputWrapper />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">Diastolic BP</h4>
            <Form.Item
              name={["selected_test", fieldName, "diastolic_bp_unit"]}
              hidden
            />
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={`Units (${data?.diastolic_units})`}
                  name={["selected_test", fieldName, "diastolic_bp_unit", "value"]}
                  rules={[
                    ...getVitalValidationRules('blood_pressure', 'diastolic'),
                    {
                      required: false,
                      message: 'Please enter diastolic blood pressure'
                    }
                  ]}
                  validateTrigger={['onChange', 'onBlur']}
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

export default BloodPressure;
