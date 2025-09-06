import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import {
  CardWrapper,
  SelectWrapper,
} from "@components/Wrapper";
import { Form, Row, Col } from "antd";
import React from "react";
import { TestPropTypes } from "./type";
import CommonUploadWrapper from "@components/Wrapper/CommonUploadWrapper";
import { optionKeys } from "@utils/commonFunctions";
import useSetFieldData from "./hook/setFieldData";

const Hearing = ({ loading, data, form, id }: TestPropTypes) => {
  const fieldName = "hearing_unit";
  const label = "Hearing";

  // set initially all the value inside of given field name
  useSetFieldData(form, label, fieldName, data);
  const hearingOptions = optionKeys(data).map((item) => ({
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
                  <SelectWrapper options={hearingOptions} />
                </Form.Item>
              </Col>
              {/* <Col span={24}>
                <CommonUploadWrapper
                  {...{
                    id,
                    form,
                    label: "Attach Certificate of Incorporation",
                    name: ["selected_test", "hearing_unit", "doc"],
                  }}
                />
              </Col> */}
            </Row>
          </div>
        </div>
      )}
    </CardWrapper>
  );
};

export default Hearing;
