import { TableContentLoaderWithProps } from '@components/Common/SkeletonLoader/ContentLoader';
import { CardWrapper, InputWrapper, SelectWrapper } from '@components/Wrapper';
import { Form, Row, Col } from 'antd';
import React from 'react'
import { TestPropTypes } from './type';
import { optionKeys } from '@utils/commonFunctions';
import { lowerCase } from 'lodash';
import useSetFieldData from './hook/setFieldData';

const BloodGroup = ({ loading, data, form }: TestPropTypes) => {
  const fieldName = "blood_group_unit";
  const label = "Blood Group";

  // set initially all the value inside of given field name
  useSetFieldData(form, label, fieldName, data);

  const bloodOptions = optionKeys(data).map((item) => ({
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
                >
                  <SelectWrapper options={bloodOptions} />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </CardWrapper>
  );
};

export default BloodGroup