import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import { CardWrapper, SelectWrapper } from "@components/Wrapper";
import { Form, Row, Col } from "antd";
import React from 'react'
import { TestPropTypes } from "./type";
import { optionKeys } from "@utils/commonFunctions";
import CommonUploadWrapper from "@components/Wrapper/CommonUploadWrapper";
import useSetFieldData from "./hook/setFieldData";
import { useVitalValidation } from "./hook/useVitalValidation";

const ECG = ({ loading, data, form, id }: TestPropTypes) => {
  const fieldName = "ecg_unit";
  const label = "ECG";
  const { getVitalValidationRules } = useVitalValidation();

  // set initially all the value inside of given field name
  useSetFieldData(form, label, fieldName, data);
  const ecgOptions = optionKeys(data).map((item) => ({
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
                  label="Select unit"
                  name={["selected_test", fieldName, "value"]}
                  rules={[
                    ...getVitalValidationRules('ecg'),
                    {
                      required: true,
                      message: 'Please select ECG result'
                    }
                  ]}
                  initialValue="Normal"
                >
                  <SelectWrapper options={ecgOptions} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <CommonUploadWrapper
                  {...{
                    id,
                    form,
                    label: "Attach Report",
                    name: ["selected_test", fieldName, "doc"],
                  }}
                />
              </Col>
            </Row>
          </div>
        </div>
      )}
    </CardWrapper>
  );
};

export default ECG