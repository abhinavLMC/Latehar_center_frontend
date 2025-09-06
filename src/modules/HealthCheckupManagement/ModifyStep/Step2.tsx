import { postRequest } from "@api/preference/RequestService";
import Toast from "@components/Common/Toast";
import {
  FormItemWrapper,
  SelectWrapper,
  InputWrapper,
  ButtonWrapper,
  UploadWrapper,
  CheckBoxWrapper,
} from "@components/Wrapper";
import CommonUploadWrapper from "@components/Wrapper/CommonUploadWrapper";
import { fieldRules, filterByStatus, getBase64, normFile } from "@utils/commonFunctions";
import { Row, Col, Space, Form, FormInstance, Button } from "antd";
import { upperCase } from "lodash";
import React, { useEffect, useState } from "react";
import {
  useGetRequestHandler,
  usePostRequestHandler,
} from "src/hook/requestHandler";

const SHORT_CODE_OPTIONS = [
  {
    label: "Driver",
    value: "DR",
  },
  {
    label: "Worker",
    value: "WO",
  },
  {
    label: "Employer",
    value: "EM",
  },
  {
    label: "Contractor",
    value: "CO",
  },
  {
    label: "Officer",
    value: "OF",
  },
  {
    label: "Walk in",
    value: "WA",
  },
  {
    label: "Other",
    value: "OT",
  },
];

interface propTypes {
  mainForm: FormInstance;
  setTabKey: (param: string) => void;
}

const Step2 = ({ mainForm, setTabKey }: propTypes) => {
  const patientType = Form.useWatch("patient_type", mainForm);
  const verifyOption = Form.useWatch("verify_option", mainForm);
  const signatureField = Form.useWatch("signature", mainForm);

  const { data: cetList, fetchData: fetchCetData } = useGetRequestHandler();
  const { data: workforceTypeList, fetchData: fetchWorkforceType } = useGetRequestHandler();
  const { submit: step2Submit } = usePostRequestHandler();


  const [isOtpSend, setIsOtpSend] = useState(false);
  const [disableNext, setDisableNext] = useState(true);
  const [btnLoader, setBtnLoader] = useState(false);
  const [shortCode, setShortCode] = useState('');


  useEffect(() => {
    fetchCetData("/api/cet-list");
    fetchWorkforceType("/api/workforce-type-list");
  }, []);

  // generate shor code behalf on workforce type and CET selection
    useEffect(() => {
      const sCode = `${shortCode}${patientType}`;
      mainForm.setFieldValue("short_code", sCode?.toUpperCase());
    }, [patientType, shortCode]);

  const sendOtpHandler = async () => {
    try {
      setBtnLoader(true);
      const res = await postRequest("/api/send-otp", {
      phoneNumber: mainForm.getFieldValue("contactNumber"),
    });

    if (res?.data.status) { setIsOtpSend(true) } else { setIsOtpSend(false) };
    } finally {
      setBtnLoader(false)
    }
  }

  // verify otp by phone number and otp
  const verifyOtpHandler = async () => {
    try {
      setBtnLoader(true);
      const res = await postRequest("/api/verify-otp", {
        phoneNumber: mainForm.getFieldValue("contactNumber"),
        otp: mainForm.getFieldValue("otp"),
      });

      if (res?.data.status) {
        setDisableNext(false);
      } else {
        setDisableNext(true);
      }
    } finally {
      setTimeout(() => setBtnLoader(false), 5000);
    }
  };

  useEffect(() => {
    if (verifyOption !== 'by_mobile') {
      setDisableNext(false)
    } else {
      setDisableNext(true)
    }
  }, [verifyOption]);


  const [buttonLoader, setButtonLoader] = useState(false);

  // step 2 form submit handler
  const step2FormHandler = async () => {
    if (buttonLoader) return;
    setButtonLoader(true)
    mainForm
      .validateFields({ recursive: true })
      .then(async () => {
        const payload = await mainForm.getFieldsValue()
        
        const res = await step2Submit("/api/create-health-checkup-1", payload);
        if (res?.status) {
          mainForm.setFieldValue("last_insert_id", res?.data?.id);
          mainForm.setFieldValue("external_id", res?.data?.external_id);
          setTabKey('step_3')
        }
      })
      .catch(() => {
        setDisableNext(false);
      })
      .finally (() => setButtonLoader(false));
  };

  return (
    <Row gutter={16}>
      <Col md={13} span={24}>
        <FormItemWrapper
          name="transpoter"
          label="Select CET"
          rules={fieldRules()}
        >
          <SelectWrapper
            options={cetList?.map(
              (obj: { short_code: string; name: string; id: string }) => ({
                label: obj?.name,
                value: obj?.id,
                title: obj?.short_code,
              })
            )}
            onChange={(_, obj: any) => setShortCode(obj?.title)}
          />
        </FormItemWrapper>
      </Col>
      <Col md={13} span={24}>
        <FormItemWrapper
          name="patient_type"
          label="Workforce Type"
          rules={fieldRules()}
        >
          <SelectWrapper
            options={filterByStatus(workforceTypeList, "isActive")?.map(
              (obj: { full_name: string; short_name: string }) => ({
                label: obj?.full_name,
                value: obj?.short_name,
              })
            )}
          />
        </FormItemWrapper>
      </Col>
      {patientType === "DR" && (
        <Col md={13} span={24}>
          <FormItemWrapper
            name="vehicle_no"
            label="Vehicle No"
            rules={fieldRules()}
          >
            <InputWrapper />
          </FormItemWrapper>
        </Col>
      )}
      <Col md={13} span={24}>
        <FormItemWrapper
          name="verify_option"
          label="Verify By"
          initialValue={"by_mobile"}
        >
          <SelectWrapper
            options={[
              { label: "Mobile", value: "by_mobile" },
              { label: "Signature", value: "by_signature" },
            ]}
          />
        </FormItemWrapper>
      </Col>
      {verifyOption === "by_mobile" ? (
        <Col md={13} span={24}>
          <FormItemWrapper name="contactNumber" label="Mobile">
            <InputWrapper
              readOnly
              addonAfter={
                !isOtpSend && (
                  <Button
                    type="link"
                    loading={btnLoader}
                    disabled={btnLoader}
                    onClick={sendOtpHandler}
                    className="mx-n3"
                  >
                    Send OTP
                  </Button>
                )
              }
            />
          </FormItemWrapper>
          {isOtpSend && disableNext && (
            <FormItemWrapper name="otp" label="Verify OTP">
              <InputWrapper
                addonAfter={
                  <Button
                    type="link"
                    loading={btnLoader}
                    disabled={btnLoader}
                    onClick={verifyOtpHandler}
                    className="mx-n3"
                  >
                    Verify OTP
                  </Button>
                }
              />
            </FormItemWrapper>
          )}
        </Col>
      ) : (
        <Col md={13} span={24}>
          <CommonUploadWrapper
            {...{
              form: mainForm,
              name: "signature",
              label: "Signature",
              required: false,
            }}
          />
        </Col>
      )}

      <Col md={13} span={24}>
        <FormItemWrapper
          name="accept_term_condition"
          rules={fieldRules()}
          valuePropName="checked"
        >
          <CheckBoxWrapper>
            I have read the{" "}
            <a href="/images/terms&condition.pdf" target="new">
              Terms and Conditions
            </a>{" "}
            and I hereby accept and agree it.
          </CheckBoxWrapper>
        </FormItemWrapper>
        <Space className="mt-3">
          <ButtonWrapper onClick={() => setTabKey("step_1")}>
            Prev
          </ButtonWrapper>
          <ButtonWrapper
            type="primary"
            disabled={disableNext}
            loading={buttonLoader}
            onClick={step2FormHandler}
          >
            Next
          </ButtonWrapper>
        </Space>
      </Col>
    </Row>
  );
};

export default Step2;
