import { SubmitButton, CancelButton } from "@components/Common";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import DynamicPageLayout from "@components/DynamicPageLayout";
import {
  ButtonWrapper,
  CardWrapper,
  FormItemWrapper,
  InputWrapper,
  SelectWrapper,
  UploadWrapper,
} from "@components/Wrapper";
import CommonUploadWrapper from "@components/Wrapper/CommonUploadWrapper";
import { CET_MANAGEMENT, INVALID_INPUT_MSG } from "@constants/AppConstant";
import {
  addEditTitle,
  fieldRules,
  normFile,
  removeNonAlphabeticCharacters,
} from "@utils/commonFunctions";
import { Col, Form, Input, Row } from "antd";
import { upperCase } from "lodash";
import React, { useEffect } from "react";
import useGetQuery from "src/hook/getQuery";
import {
  usePostRequestHandler,
  useGetRequestHandler,
} from "src/hook/requestHandler";

const BACK_URL = CET_MANAGEMENT;

interface FormFieldTypes {
  [key: string]: any;
}

const ModifyCetManagement = () => {
  const [form] = Form.useForm();
  const { id } = useGetQuery("update-cet");

  const { buttonLoading, submit } = usePostRequestHandler();
  const { loading, setLoading, data, fetchData } = useGetRequestHandler();

  useEffect(() => {
    if (id) {
      fetchData("/api/cet-details", { id });
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!!data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  // update or new creation
  const formSubmit = async (fieldsValues: FormFieldTypes) => {
    const name = upperCase(
      removeNonAlphabeticCharacters(fieldsValues?.name || "")?.substring(0, 2)
    );
    const shortCode = fieldsValues?.cet_type;
    const payload = {
      ...fieldsValues,

      ...(id
        ? {
            id,
            status: data?.status,
          }
        : {
            short_code: `${name}${shortCode}`,
          }),
    };
    const API_ENDPOINT = id ? "/api/cet-update" : "/api/cet-create";
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
        <Form
          form={form}
          layout="vertical"
          onFinish={formSubmit}
        >
          <div className="form-content">
            <h4 className="primary-color primary-bg-color-4">Basic Details</h4>
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Name"
                  name="name"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="CET Type"
                  name="cet_type"
                  rules={fieldRules()}
                >
                  <SelectWrapper
                    disabled={Boolean(id)}
                    options={[
                      { label: "Contractor", value: "CR" },
                      { label: "Employer", value: "ER" },
                      { label: "Transporter", value: "TR" },
                    ]}
                  />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Registered Address"
                  name="registeredAddress"
                  rules={fieldRules("text")}
                >
                  <Input.TextArea />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Correspondence Address"
                  name="correspondenceAddress"
                  rules={fieldRules("text")}
                >
                  <Input.TextArea />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Contact Number"
                  name="contactNumber"
                  rules={fieldRules("mobile")}
                >
                  <InputWrapper maxLength={10} />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="SPOC Name"
                  name="spocName"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="SPOC Whatsapp Number"
                  name="spocWhatsappNumber"
                  rules={fieldRules("mobile")}
                >
                  <InputWrapper maxLength={10} />
                </FormItemWrapper>
              </Col>

              <Col md={12} span={24}>
                <FormItemWrapper label="SPOC Email Id" name="spocEmail">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Alternate SPOC Name"
                  name="alternateSpocName"
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Alternate SPOC Email id"
                  name="alternateSpocEmail"
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Alternate SPOC Contact Number"
                  name="alternateSpocContactNumber"
                >
                  <InputWrapper maxLength={10} />
                </FormItemWrapper>
              </Col>
            </Row>
          </div>
          <div className="form-content mt-3">
            <h4 className="primary-color primary-bg-color-4">
              Financial Details
            </h4>
            <Row gutter={16}>
              <Col md={12} span={24}>
                <FormItemWrapper label="PAN" name="pan">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>

              <Col md={12} span={24}>
                <FormItemWrapper label="GSTIN" name="gstin">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>

              <Col md={12} span={24}>
                <FormItemWrapper label="Account Number" name="accountNumber">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper label="IFSC Code" name="ifscCode">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={24} span={24}>
                <FormItemWrapper label="Bank Name" name="bankName">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <CommonUploadWrapper
                  {...{
                    label: "Attach PAN Copy",
                    name: "attachPanCopy",
                    id,
                    form,
                  }}
                />
              </Col>
              <Col md={12} span={24}>
                <CommonUploadWrapper
                  {...{
                    label: "Attach GSTIN Copy",
                    name: "attachGstin",
                    id,
                    form,
                  }}
                />
              </Col>

              <Col md={12} span={24}>
                <CommonUploadWrapper
                  {...{
                    label: "Attach Cancelled Cheque or Passbook",
                    name: "attachCancelledChequeOrPassbook",
                    id,
                    form,
                  }}
                />
              </Col>
              <Col md={12} span={24}>
                <CommonUploadWrapper
                  {...{
                    label: "Attach Certificate of Incorporation",
                    name: "attachCertificateOfIncorporation",
                    id,
                    form,
                  }}
                />
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
      customTitle={`${addEditTitle(id as string)} CET Master`}
      goBackUrl={BACK_URL}
      MainComp={MainLayout}
    />
  );
};

export default ModifyCetManagement;
