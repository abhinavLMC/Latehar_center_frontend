import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import { CardWrapper, InputWrapper } from "@components/Wrapper";
import { Form, Row, Col } from "antd";
import React, { useEffect } from "react";
import { TestPropTypes } from "./type";
import useSetFieldData from "./hook/setFieldData";
import { useVitalValidation } from "./hook/useVitalValidation";

const BMI = ({ loading, data, form, id }: TestPropTypes) => {
  const fieldName = "bmi_unit";
  const label = "BMI (Body Mass Index)";
  const { getVitalValidationRules } = useVitalValidation();

  // set initially all the value inside of given field name
  useSetFieldData(form, label, fieldName, data, "bmi_");

  const bmiData = Form.useWatch(["selected_test", fieldName], form);

  const calculateBMI = (w: string, h: string) => {
    if (h && w) {
      // Convert height from centimeters to meters
      let heightInMeters = Number(h) / 100;

      // Calculate BMI
      let bmi = Number(w) / (heightInMeters * heightInMeters);

      return bmi?.toFixed(2);
    }
    return null;
  };

  // calculate the bmi value and set it

  // ! very important line to set bmi value
  useEffect(() => {
    if (!!bmiData) {
      const bmiValue = calculateBMI(bmiData?.weight, bmiData?.height);

      form.setFieldValue(["selected_test", fieldName], {
        ...bmiData,
        // value: bmiValue,
        ...(bmiValue ? {value: bmiValue} : {}),
      });
    }
  }, [bmiData?.weight, bmiData?.height]);

  return (
    <CardWrapper>
      {loading ? (
        <TableContentLoaderWithProps columnWidth={[100]} />
      ) : (
        <div className="test-wrapper">
          <p>{label}</p>
          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">Height</h4>
            <Form.Item name={["selected_test", fieldName]} hidden />
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={`Units (cm)`}
                  name={["selected_test", fieldName, "height"]}
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: 'Please enter height'
                  //   },
                  //   {
                  //     validator: async (_, value) => {
                  //       if (value) {
                  //         const height = parseFloat(value);
                  //         if (isNaN(height)) {
                  //           return Promise.reject(new Error('Please enter a valid number'));
                  //         }
                  //         if (height < 100 || height > 250) {
                  //           return Promise.reject(new Error('Height should be between 100 cm and 250 cm'));
                  //         }
                  //       }
                  //       return Promise.resolve();
                  //     }
                  //   }
                  // ]}
                  // validateTrigger={['onChange', 'onBlur']}
                >
                  <InputWrapper />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">Weight</h4>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={`Units (kg)`}
                  name={["selected_test", fieldName, "weight"]}
                  rules={[
                    {
                      required: false,
                      message: 'Please enter weight'
                    },
                    // {
                    //   validator: async (_, value) => {
                    //     if (value) {
                    //       const weight = parseFloat(value);
                    //       if (isNaN(weight)) {
                    //         return Promise.reject(new Error('Please enter a valid number'));
                    //       }
                    //       if (weight < 20 || weight > 200) {
                    //         return Promise.reject(new Error('Weight should be between 20 kg and 200 kg'));
                    //       }
                    //     }
                    //     return Promise.resolve();
                    //   }
                    // }
                  ]}
                  validateTrigger={['onChange', 'onBlur']}
                >
                  <InputWrapper />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">{label}</h4>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={`Units (${data?.bmi_units})`}
                  name={["selected_test", fieldName, "value"]}
                  // rules={[
                  //   ...getVitalValidationRules('bmi')
                  // ]}
                >
                  <InputWrapper readOnly />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </CardWrapper>
  );
};

export default BMI;
