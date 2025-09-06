import { TableContentLoaderWithProps } from '@components/Common/SkeletonLoader/ContentLoader';
import { CardWrapper, InputWrapper } from '@components/Wrapper';
import { Form, Row, Col } from 'antd';
import React from 'react'
import { TestPropTypes } from "./type";
import useSetFieldData from './hook/setFieldData';
import { useVitalValidation } from "./hook/useVitalValidation";

const SPO2 = ({ loading, data, form }: TestPropTypes) => {
  const fieldName = "spo2_unit";
  const label = "SPO2";
  const { getVitalValidationRules } = useVitalValidation();

  // set initially all the value inside of given field name
  useSetFieldData(form, label, fieldName, data);

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
                  label={`Units ${data?.units && `(${data?.units})`}`}
                  name={["selected_test", fieldName, "value"]}
                  rules={[
                    ...getVitalValidationRules('spo2'),
                    {
                      required: true,
                      message: 'Please enter SPO2 value'
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

export default SPO2