import { SubmitButton, CancelButton } from "@components/Common";
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

const RandomBloodSugar = ({ loading, data, form }: TestPropTypes) => {
  const fieldName = "random_blood_sugar_unit";
  const label = "Random Blood Sugar";
  const { getVitalValidationRules } = useVitalValidation();

  // set initially all the value inside of given field name
  useSetFieldData(form, label, fieldName, data);

  return (
    <CardWrapper>
      {loading ? (
        <TableContentLoaderWithProps columnWidth={[100]} />
      ) : (
        <div className="test-wrapper">
          <p>RBS</p>
          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">{label}</h4>
            <Form.Item name={["selected_test", fieldName]} hidden />
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={`Units ${data?.units && `(${data?.units})`}`}
                  name={["selected_test", fieldName, "value"]}
                  rules={[
                    ...getVitalValidationRules('random_blood_sugar'),
                    {
                      required: false,
                      message: 'Please enter blood sugar value'
                    }
                  ]}
                  validateTrigger={['onChange', 'onBlur']}
                >
                  <InputWrapper />
                </Form.Item>
              </Col>
              {/* <Col span={24}>
                <Form.Item
                  label="Comments"
                  name={["selected_test", fieldName, "comment"]}
                >
                  <InputWrapper />
                </Form.Item>
              </Col> */}
            </Row>
          </div>
        </div>
      )}
    </CardWrapper>
  );
};

export default RandomBloodSugar;
