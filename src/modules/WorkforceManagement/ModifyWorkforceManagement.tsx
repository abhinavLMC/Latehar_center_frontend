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
import { Col, Form, Input, Row, Button, Modal, message, List, Card, Typography, Avatar } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import useGetQuery from "src/hook/getQuery";
import {
  useGetRequestHandler,
  usePostRequestHandler,
} from "src/hook/requestHandler";
import { postRequest } from "@api/preference/RequestService";
import { MOBILE_API_BASE_URL } from "@constants/ApiConstant";

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
  
  // Validation modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isContactValidated, setIsContactValidated] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [userData, setUserData] = useState<any[]>([]);
  const [validationStatus, setValidationStatus] = useState<'pending' | 'validated' | 'rejected'>('pending');

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
    // Check if contact number validation is required and completed
    if (fieldsValues.contactNumber && validationStatus !== 'validated') {
      message.error('Please validate the contact number before submitting the form');
      return;
    }

    const payload = {
      ...fieldsValues,
      dateOfBirthOrAge: normDate(fieldsValues?.dateOfBirthOrAge),
      ...(id ? { id, } : {}),
    };

    const API_ENDPOINT = id ? "/api/driver-update" : "/api/driver-create";
    submit(API_ENDPOINT, payload, BACK_URL);
  };

  // Validation handlers
  const handleValidateClick = async () => {
    const contactNumber = form.getFieldValue("contactNumber");
    if (!contactNumber || contactNumber.length !== 10) {
      message.error("Please enter a valid 10-digit contact number");
      return;
    }
    
    try {
      setBtnLoader(true);
      setIsModalVisible(true);
      
      const res = await fetch(`${MOBILE_API_BASE_URL}/api/drivers/getUserData?phoneNumber=${contactNumber}`);
      const data = await res.json();

      if (data && Array.isArray(data) && data.length > 0) {
        setUserData(data);
      } else {
        // No users found - automatically mark as validated for new patient
        setValidationStatus('validated');
        setIsContactValidated(true);
        setIsModalVisible(false);
        setUserData([]);
        message.success('Contact number validated - New patient');
      }
    } catch (error) {
      console.error("Error validating contact number:", error);
      message.error("Failed to validate contact number. Please try again.");
      setIsModalVisible(false);
      setValidationStatus('pending');
    } finally {
      setBtnLoader(false);
    }
  };



  const handleModalCancel = () => {
    setIsModalVisible(false);
    setUserData([]);
    setValidationStatus('pending');
  };

  const handleValidationConfirm = () => {
    setValidationStatus('validated');
    setIsContactValidated(true);
    setIsModalVisible(false);
    setUserData([]);
    message.success('Contact number validated successfully');
  };

  const handleValidationReject = () => {
    setValidationStatus('rejected');
    setIsContactValidated(false);
    setIsModalVisible(false);
    setUserData([]);
    message.warning('Contact number validation rejected');
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
                  <InputWrapper 
                    maxLength={10} 
                    onChange={() => {
                      // Reset validation status when contact number changes
                      setValidationStatus('pending');
                      setIsContactValidated(false);
                    }}
                    addonAfter={
                      !isContactValidated ? (
                        <Button
                          type="link"
                          loading={btnLoader}
                          disabled={btnLoader}
                          onClick={handleValidateClick}
                          className="mx-n3"
                        >
                          Validate
                        </Button>
                      ) : (
                        <span style={{ color: '#52c41a', fontSize: '12px' }}>
                          ✓ Validated
                        </span>
                      )
                    }
                  />
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
                    label: "Photograph of Patient",
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
       
       {/* Validation Modal */}
       <Modal
         title={`Patients associated with ${form.getFieldValue("contactNumber")}`}
         open={isModalVisible}
         onCancel={handleModalCancel}
         confirmLoading={btnLoader}
         width={800}
         footer={[
           <Button key="cancel" onClick={handleModalCancel}>
             Cancel
           </Button>,
           <Button key="no" type="default" danger onClick={handleValidationReject}>
             No
           </Button>,
           <Button key="yes" type="primary" onClick={handleValidationConfirm}>
             Yes
           </Button>,
         ]}
       >
         {btnLoader ? (
           <div style={{ textAlign: 'center', padding: '40px' }}>
             <Typography.Text>Searching for patients...</Typography.Text>
           </div>
         ) : (
           <div>
             <Typography.Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
               Found {userData.length} patient(s) with this contact number.
             </Typography.Text>
             {/* <Typography.Text type="secondary" style={{ marginBottom: 16, display: 'block', fontStyle: 'italic' }}>
               Please confirm if this contact number belongs to the correct patient by clicking "Yes" or "No" below.
             </Typography.Text> */}
             <List
               dataSource={userData}
               renderItem={(user) => (
                 <List.Item>
                   <Card
                     style={{ width: '100%' }}
                     bodyStyle={{ padding: '12px' }}
                   >
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <Avatar size={48} style={{ backgroundColor: '#1890ff' }}>
                         {user.name?.charAt(0)?.toUpperCase()}
                       </Avatar>
                       <div style={{ flex: 1 }}>
                         <Typography.Title level={5} style={{ margin: 0, marginBottom: '4px' }}>
                           {user.name}
                         </Typography.Title>
                         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#666' }}>
                           <span><strong>LMC ID:</strong> {user.external_id}</span>
                           <span><strong>Health Card:</strong> {user.healthCardNumber}</span>
                           <span><strong>Gender:</strong> {user.gender}</span>
                           <span><strong>Blood Group:</strong> {user.blood_group}</span>
                           <span><strong>District:</strong> {user.localAddressDistrict}</span>
                           <span><strong>State:</strong> {user.localAddressState}</span>
                           <span><strong>ID Proof:</strong> {user.idProof?.replace('_', ' ').toUpperCase()}</span>
                           <span><strong>ID Number:</strong> {user.idProof_number}</span>
                         </div>
                       </div>
                     </div>
                   </Card>
                 </List.Item>
               )}
             />
           </div>
         )}
       </Modal>
     </CardWrapper>
  );

  return (
    <DynamicPageLayout
      customTitle={`${addEditTitle(id as string)} Patient`}
      goBackUrl={BACK_URL}
      MainComp={MainLayout}
    />
  );
};

export default ModifyWorkForceManagement;
