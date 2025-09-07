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
  blood_group: string;
  diabetes: boolean;
  hypertension: boolean;
  hypotension: boolean;
  epilepsy: boolean;
  physical_disability: boolean;
  physical_disability_details: string;
  mental_disability: boolean;
  mental_disability_details: string;
  vision_issues: boolean;
  vision_issues_details: string;
  hearing_issues: boolean;
  hearing_issues_details: string;
  major_accident: string;
  allergies: string;
  other_medical_info: string;
  alcohol_consumption: boolean;
  smoking: boolean;
  tobacco_consumption: boolean;
  birthmark_identification: string;
}

const BACK_URL = WORKFORCE_MANAGEMENT;

const WorkforcePersonalHistory = () => {
  const [form] = Form.useForm();
  const physicalDisability = Form.useWatch("physical_disability", form);
  const mentalDisability = Form.useWatch("mental_disability", form);
  const visionIssues = Form.useWatch("vision_issues", form);
  const hearingIssues = Form.useWatch("hearing_issues", form);

  const { id } = useGetQuery("update-workforce");
  const { buttonLoading, submit } = usePostRequestHandler();
  const { loading, setLoading, data, fetchData } = useGetRequestHandler();

  const [personalId, setPersonalId] = useState(null);

  useEffect(() => {
    if (id) {
      fetchData("/api/driver-personal-details", { id });
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!!data) {
      const finalData = {
        ...data,
        driver_id: id,
        ...data.driverPersonalData,
      };
      setPersonalId(data?.driverPersonalData?.id);
      form.setFieldsValue(finalData);
    }
  }, [data]);

  // update or new creation
  const formSubmit = async (fieldsValues: DataType) => {
    const { driver, ...restValues } = fieldsValues;
    const payload = {
      ...restValues,
      ...(id
        ? {
            id: personalId || id,
            driver_id: id,
          }
        : {}),
    };

    const API_ENDPOINT = id
      ? "/api/driver-personal-update"
      : "/api/driver-personal-create";
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
              <Col md={12} span={24}>
                <FormItemWrapper name="driver_id" hidden />
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
              
              <Col md={24} span={24}>
                <FormItemWrapper
                  name="diabetes"
                  className="mb-1"
                  valuePropName="checked"
                >
                  <CheckBoxWrapper>Diabetes</CheckBoxWrapper>
                </FormItemWrapper>
                <FormItemWrapper
                  name="hypertension"
                  className="mb-1"
                  valuePropName="checked"
                >
                  <CheckBoxWrapper>Hypertension/High BP</CheckBoxWrapper>
                </FormItemWrapper>
                <FormItemWrapper
                  name="hypotension"
                  className="mb-1"
                  valuePropName="checked"
                >
                  <CheckBoxWrapper>Hypotension/Low BP</CheckBoxWrapper>
                </FormItemWrapper>
                <FormItemWrapper
                  name="epilepsy"
                  className="mb-1"
                  valuePropName="checked"
                >
                  <CheckBoxWrapper>Epilepsy/Mirgi</CheckBoxWrapper>
                </FormItemWrapper>
                <FormItemWrapper
                  name="physical_disability"
                  className="mb-1"
                  valuePropName="checked"
                >
                  <CheckBoxWrapper>Any Physical Disability</CheckBoxWrapper>
                </FormItemWrapper>
                {physicalDisability && (
                  <FormItemWrapper
                    label="Provide details"
                    name="physical_disability_details"
                  >
                    <InputWrapper />
                  </FormItemWrapper>
                )}
                <FormItemWrapper
                  name="mental_disability"
                  className="mb-1"
                  valuePropName="checked"
                >
                  <CheckBoxWrapper>Any Mental Disability</CheckBoxWrapper>
                </FormItemWrapper>
                {mentalDisability && (
                  <FormItemWrapper
                    label="Provide details"
                    name="mental_disability_details"
                  >
                    <InputWrapper />
                  </FormItemWrapper>
                )}
                <FormItemWrapper
                  name="vision_issues"
                  className="mb-1"
                  valuePropName="checked"
                >
                  <CheckBoxWrapper>Any Vision related issues</CheckBoxWrapper>
                </FormItemWrapper>
                {visionIssues && (
                  <FormItemWrapper
                    label="Provide details"
                    name="vision_issues_details"
                  >
                    <InputWrapper />
                  </FormItemWrapper>
                )}
                <FormItemWrapper
                  name="hearing_issues"
                  className="mb-1"
                  valuePropName="checked"
                >
                  <CheckBoxWrapper>Any Hearing related issues</CheckBoxWrapper>
                </FormItemWrapper>
                {hearingIssues && (
                  <FormItemWrapper
                    label="Provide details"
                    name="hearing_issues_details"
                  >
                    <InputWrapper />
                  </FormItemWrapper>
                )}
              </Col>
            </Row>
          </div>

          <div className="form-content mt-3">
            <h4 className="primary-color primary-bg-color-4">Other Details</h4>
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Any major accident?"
                  name="major_accident"
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper label="Allergies" name="allergies">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Any other medical/health related information"
                  name="other_medical_info"
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Birthmark or Identification mark on the body"
                  name="birthmark_identification"
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  name="alcohol_consumption"
                  className="mb-1"
                  valuePropName="checked"
                >
                  <CheckBoxWrapper>Do you drink alcohol?</CheckBoxWrapper>
                </FormItemWrapper>

                <FormItemWrapper
                  name="smoking"
                  className="mb-1"
                  valuePropName="checked"
                >
                  <CheckBoxWrapper>Do you smoke?</CheckBoxWrapper>
                </FormItemWrapper>

                <FormItemWrapper
                  name="tobacco_consumption"
                  valuePropName="checked"
                >
                  <CheckBoxWrapper>Do you consume tobacco?</CheckBoxWrapper>
                </FormItemWrapper>
              </Col>
            </Row>
          </div>

          <div className="d-flex justify-content-start gap-3">
            <SubmitButton loading={buttonLoading} />
            <CancelButton backUrl={BACK_URL} />
          </div>
        </Form>
      )}
    </CardWrapper>
  );

  return (
    <DynamicPageLayout
      customTitle={`${addEditTitle(id as string)} Patient History`}
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
              "hypertension",
              "hypotension",
            ]),
            "High BP": data?.driverPersonalData?.hypertension ? "Yes" : "No",
            "Low BP": data?.driverPersonalData?.hypotension ? "Yes" : "No",
            "Photograph Of Patient":
              data?.driver?.photographOfDriver || EMPTY_PLACEHOLDER,
          }}
          label={<Button icon={<EyeOutlined />}>View Details</Button>}
        />
      }
    />
  );
};

export default WorkforcePersonalHistory;
