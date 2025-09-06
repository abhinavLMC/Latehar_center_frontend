import { CancelButton, SubmitButton } from "@components/Common";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import DynamicPageLayout from "@components/DynamicPageLayout";
import {
  CardWrapper,
  FormItemWrapper,
  InputNumberWrapper,
  InputWrapper,
  SelectWrapper,
  UploadWrapper,
} from "@components/Wrapper";
import CommonUploadWrapper from "@components/Wrapper/CommonUploadWrapper";
import DatePickerWrapper from "@components/Wrapper/DatePickerWrapper";
import { WORKFORCE_MANAGEMENT, REQUIRED_MESSAGE } from "@constants/AppConstant";
import { addEditTitle, fieldRules, normDate, normFile, optionKeys } from "@utils/commonFunctions";
import { Col, Form, Input, Row } from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import useGetQuery from "src/hook/getQuery";
import {
  useGetRequestHandler,
  usePostRequestHandler,
} from "src/hook/requestHandler";

const { TextArea } = Input;
const BACK_URL = WORKFORCE_MANAGEMENT;

interface DataType {
  name: string;
  healthCardNumber: string;
  driverId: string;
  abhaNumber: string;
  dateOfBirthOrAge: string;
  gender: string;
  doc1: string;
  localAddress: string;
  localAddressDistrict: string;
  localAddressState: string;
  contactNumber: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  idProof: string;
  idProof_number: string;
  doc2: string;
  employeeID: string;
}

const ModifyWorkForceManagement = () => {
  const [form] = Form.useForm();
  const idProof = Form.useWatch("idProof", form);

  const { id } = useGetQuery("update-workforce");
  const { buttonLoading, submit } = usePostRequestHandler();
  const { loading, setLoading, data, fetchData } = useGetRequestHandler();
  const { data: bloodGroups, fetchData: fetchBloodGroups } = useGetRequestHandler();

  const bloodOptions = optionKeys(bloodGroups?.["blood-group"])?.map((item) => ({
    label: item,
    value: item,
  }));

  useEffect(() => {
      fetchBloodGroups(`/api/package-unit-list`, {
        package_list: ["blood-group"],
      });
  }, []);

  useEffect(() => {
    if (id) {
      fetchData("/api/driver-details", { id });
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!!data) {
      const finalData = {
        ...data,
        dateOfBirthOrAge: normDate(data?.dateOfBirthOrAge, true),
      };
      form.setFieldsValue(finalData);
    }
  }, [data]);

  // update or new creation
  const formSubmit = async (fieldsValues: DataType) => {
    const payload = {
      ...fieldsValues,
      dateOfBirthOrAge: normDate(fieldsValues?.dateOfBirthOrAge),
      ...(id ? { id, } : {}),
    };

    const API_ENDPOINT = id ? "/api/driver-update" : "/api/driver-create";
    submit(API_ENDPOINT, payload, BACK_URL);
  };

  const getIdProofField = (selectedProof: string): JSX.Element => {
    switch (selectedProof) {
      case "voter_id":
        return (
          <>
            <Col md={12} span={24}>
              <FormItemWrapper
                label="Voter ID"
                name="idProof_number"
                rules={fieldRules("text")}
              >
                <InputWrapper />
              </FormItemWrapper>
            </Col>
            <Col md={12} span={24}>
              <CommonUploadWrapper
                {...{
                  label: "Attach Voter Id",
                  name: "idProof_doc",
                  id,
                  form,
                }}
              />
            </Col>
          </>
        );
      case "driving_licence":
        return (
          <>
            <Col md={12} span={24}>
              <FormItemWrapper
                label="Driving License Number"
                name="idProof_number"
                rules={fieldRules("text")}
              >
                <InputWrapper />
              </FormItemWrapper>
            </Col>
            <Col md={12} span={24}>
              <CommonUploadWrapper
                {...{
                  label: "Attach Driving License",
                  name: "idProof_doc",
                  id,
                  form,
                }}
              />
            </Col>
          </>
        );
      case "other_id":
        return (
          <>
            <Col md={12} span={24}>
              <FormItemWrapper
                label="Name of ID card"
                name="idProof_name"
                rules={fieldRules("text")}
              >
                <InputWrapper />
              </FormItemWrapper>
            </Col>
            <Col md={12} span={24}>
              <FormItemWrapper
                label="ID Number"
                name="idProof_number"
                rules={fieldRules("text")}
              >
                <InputWrapper />
              </FormItemWrapper>
            </Col>
            <Col md={12} span={24}>
              <CommonUploadWrapper
                {...{
                  label: "Attach Other License",
                  name: "idProof_doc",
                  id,
                  form,
                }}
              />
            </Col>
          </>
        );
      default:
        return <></>;
    }
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
                  label="Health Card Number"
                  name="healthCardNumber"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>

              {/* <Col md={12} span={24}>
                <FormItemWrapper
                  label="Short ID"
                  name="driverId"
                  rules={fieldRules("text")}
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col> */}
              <Col md={12} span={24}>
                <FormItemWrapper label="ABHA Number" name="abhaNumber">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper label="Employee ID" name="employeeID">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Date of Birth"
                  name="dateOfBirthOrAge"
                  rules={fieldRules()}
                >
                  <DatePickerWrapper
                    className="w-100"
                    placement="bottomRight"
                    showToday={false}
                  />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Gender"
                  name="gender"
                  rules={fieldRules()}
                >
                  <SelectWrapper
                    options={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                      { label: "Other", value: "Other" },
                    ]}
                  />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Blood Group"
                  name="blood_group"
                  rules={fieldRules("text")}
                >
                  <SelectWrapper options={[{label: 'N/A', value: 'N/A'}, ...bloodOptions]} />
                </FormItemWrapper>
              </Col>

              <Col span={12}>
                <FormItemWrapper label="Local Address" name="localAddress">
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Local Address District"
                  name="localAddressDistrict"
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Local Address State"
                  name="localAddressState"
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Contact Number"
                  name="contactNumber"
                  rules={fieldRules("text")}
                >
                  <InputWrapper maxLength={10} />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Emergency Contact Name"
                  name="emergencyContactName"
                >
                  <InputWrapper />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="Emergency Contact Number"
                  name="emergencyContactNumber"
                >
                  <InputWrapper maxLength={10} />
                </FormItemWrapper>
              </Col>
              <Col md={12} span={24}>
                <CommonUploadWrapper
                  {...{
                    label: "Photograph of Workforce",
                    name: "photographOfDriver",
                    id,
                    form,
                  }}
                />
              </Col>
              <Col md={12} span={24}>
                <FormItemWrapper
                  label="ID Proof"
                  name="idProof"
                  rules={fieldRules()}
                >
                  <SelectWrapper
                    options={[
                      { label: "Driving License", value: "driving_licence" },
                      { label: "Voter ID", value: "voter_id" },
                      { label: "Other ID", value: "other_id" },
                    ]}
                  />
                </FormItemWrapper>
              </Col>
              {getIdProofField(idProof)}
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
      customTitle={`${addEditTitle(id as string)} Workforce`}
      goBackUrl={BACK_URL}
      MainComp={MainLayout}
    />
  );
};

export default ModifyWorkForceManagement;
