import { EyeOutlined } from "@ant-design/icons";
import { SubmitButton, CancelButton } from "@components/Common";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import ViewDetailsModal from "@components/Common/ViewDetailsModal";
import DynamicPageLayout from "@components/DynamicPageLayout";
import {
  CardWrapper,
  CheckBoxWrapper,
  FormItemWrapper,
  InputWrapper,
  SelectWrapper,
  UploadWrapper,
} from "@components/Wrapper";
import DatePickerWrapper from "@components/Wrapper/DatePickerWrapper";
import { EMPTY_PLACEHOLDER, WORKFORCE_MANAGEMENT } from "@constants/AppConstant";
import {
  fieldRules,
  normFile,
  addEditTitle,
  normDate,
  renderAllDetails,
} from "@utils/commonFunctions";
import { Form, Row, Col, Input, Button } from "antd";
import form from "antd/es/form";
import React, { useEffect, useState } from "react";
import useGetQuery from "src/hook/getQuery";
import {
  usePostRequestHandler,
  useGetRequestHandler,
} from "src/hook/requestHandler";

interface DataType {
  driver: {
    external_id: string;
    name: string;
    contactNumber: string;
  };
  driver_phone: string;
  driver_id: string;
  family_member_1: string
  family_member_1_relation: string
  family_member_2: string
  family_member_2_relation: string
  other_genetic_disease: string
  parent_diabetic: string
  parent_hypertension: string
  parent_hypotension: string
}

const BACK_URL = WORKFORCE_MANAGEMENT;

const WorkforceFamilyHistory = () => {
  const [form] = Form.useForm();

  const { id } = useGetQuery("update-workforce");
  const { buttonLoading, submit } = usePostRequestHandler();
  const { loading, setLoading, data, fetchData } = useGetRequestHandler();
  const [familyId, setFamilyId] = useState(null)

  useEffect(() => {
    if (id) {
      fetchData("/api/driver-family-details", { id });
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!!data) {
      const finalData = {
        ...data,
        driver_id: id,
        ...data.familyData
      };
      setFamilyId(data?.familyData?.id)
      form.setFieldsValue(finalData);
    }
  }, [data]);

  // update or new creation
  const formSubmit = async (fieldsValues: DataType) => {
    const { driver, ...restValues } = fieldsValues;
    const payload = {
      ...restValues,
      ...(id ? { 
        id: familyId || id, 
        driver_id: id 
      } : {}),
    };

    const API_ENDPOINT = familyId
      ? "/api/driver-family-update"
      : "/api/driver-family-create";
    submit(API_ENDPOINT, payload, BACK_URL);
  };
  const MainLayout = (
    <CardWrapper>
      {loading ? (
        <TableContentLoaderWithProps
          columnWidth={[48, "2", 49]}
          rowCounts={10}
          rowHeight={70}
        />
      ) : (
        <Form form={form} layout="vertical" onFinish={formSubmit}>
          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">Basic Details</h4>
            <Row gutter={16}>
              <FormItemWrapper name="driver_id" hidden />

              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Patient Name"
                  name={["driver", "name"]}
                >
                  <InputWrapper readOnly />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Patient Phone"
                  name={["driver", "contactNumber"]}
                >
                  <InputWrapper readOnly />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="LMC ID"
                  name={["driver", "external_id"]}
                >
                  <InputWrapper readOnly />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  name="other_genetic_disease"
                  label="Any other genetic disease in your family?"
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Family Member 1"
                  name="family_member_1"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Relation Of Family Member 1"
                  name="family_member_1_relation"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Family Member 2"
                  name="family_member_2"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Relation Of Family Member 2"
                  name="family_member_2_relation"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>

              <Col md={12} span={24}>
                <FormItemWrapper
                  name="parent_diabetic"
                  className="mb-1"
                  valuePropName="checked"
                >
                  <CheckBoxWrapper>
                    Are any of your parent diabetic?
                  </CheckBoxWrapper>
                </FormItemWrapper>
                <FormItemWrapper
                  name="parent_hypertension"
                  className="mb-1"
                  valuePropName="checked"
                >
                  <CheckBoxWrapper>
                    Are any of your parent have hypertension or High BP?
                  </CheckBoxWrapper>
                </FormItemWrapper>
                <FormItemWrapper
                  name="parent_hypotension"
                  className="mb-1"
                  valuePropName="checked"
                >
                  <CheckBoxWrapper>
                    Are any of your parent have hypotension or Low BP?
                  </CheckBoxWrapper>
                </FormItemWrapper>
              </Col>
            </Row>
          </div>

          <div className="d-flex justify-content-start gap-3 mt-3">
            <SubmitButton loading={buttonLoading} />
            <CancelButton backUrl={BACK_URL} />
          </div>
        </Form>
      )}
    </CardWrapper>
  );

  return (
    <DynamicPageLayout
      customTitle={`${addEditTitle(id as string)} Patient Family`}
      goBackUrl={BACK_URL}
      MainComp={MainLayout}
      ActionComp={
        <ViewDetailsModal
          viewData={{
            "LMC ID": data?.driver?.external_id || EMPTY_PLACEHOLDER,
            ...renderAllDetails(data, [
              "external_id",
              "driverId",
              "driver_id",
              "driver_phone",
              "photographOfDriver",
              "parent_hypertension",
              "parent_hypotension",
            ]),
            "High BP": data?.familyData?.parent_hypertension ? "Yes" : "No",
            "Low BP": data?.familyData?.parent_hypotension ? "Yes" : "No",
            "Photograph Of Patient":
              data?.driver?.photographOfDriver || EMPTY_PLACEHOLDER,
          }}
          label={<Button icon={<EyeOutlined />}>View Details</Button>}
        />
      }
    />
  );
};

export default WorkforceFamilyHistory;
