import { postRequest } from "@api/preference/RequestService";
import {
  FormItemWrapper,
  SelectWrapper,
  InputWrapper,
  ButtonWrapper,
  CheckBoxWrapper,
} from "@components/Wrapper";
import CommonUploadWrapper from "@components/Wrapper/CommonUploadWrapper";
import { fieldRules } from "@utils/commonFunctions";
import { Row, Col, Space, Form, FormInstance, Button } from "antd";
import React, { useEffect, useState } from "react";
import {
  usePostRequestHandler,
} from "src/hook/requestHandler";

interface propTypes {
  mainForm: FormInstance;
  setTabKey: (param: string) => void;
}

const Step2 = ({ mainForm, setTabKey }: propTypes) => {
  const patientType = Form.useWatch("patient_type", mainForm);
  const verifyOption = Form.useWatch("verify_option", mainForm);
  const signatureField = Form.useWatch("signature", mainForm);

  const { submit: step2Submit } = usePostRequestHandler();

  // Hardcoded values - using correct IDs and codes from original payload
  const HARDCODED_CET_ID = 240; // Latehar CET ID
  const HARDCODED_CET_NAME = "Latehar"; // For display
  const HARDCODED_WORKFORCE_TYPE = "WR"; // Worker short code
  const HARDCODED_SHORT_CODE = "LAUNDEFINEDWR"; // Fixed short code

  const [isOtpSend, setIsOtpSend] = useState(false);
  const [disableNext, setDisableNext] = useState(true);
  const [btnLoader, setBtnLoader] = useState(false);

  // Set hardcoded values on component mount
  useEffect(() => {
    mainForm.setFieldValue("transpoter", HARDCODED_CET_ID);
    mainForm.setFieldValue("patient_type", HARDCODED_WORKFORCE_TYPE);
    
    // Set hardcoded short code
    mainForm.setFieldValue("short_code", HARDCODED_SHORT_CODE);
  }, []);

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
      {/* Hidden fields - values are set programmatically */}
      <FormItemWrapper name="transpoter" hidden>
        <InputWrapper />
      </FormItemWrapper>
      <FormItemWrapper name="patient_type" hidden>
        <InputWrapper />
      </FormItemWrapper>
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
          initialValue={"by_signature"}
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
