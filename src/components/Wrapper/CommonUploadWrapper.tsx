import { getBase64 } from '@utils/commonFunctions';
import { Form, FormInstance, GetProp, Upload, UploadProps } from 'antd';
import React, { useEffect } from 'react'
import FormItemWrapper from './FormItemWrapper';
import InputWrapper from './InputWrapper';
import Toast from '@components/Common/Toast';
import { usePostRequestHandler } from 'src/hook/requestHandler';
import { REQUIRED_MESSAGE } from '@constants/AppConstant';

interface PropTypes {
  id?: string | null;
  form: FormInstance;
  uploadedMsg?: string;
  name: string | string[];
  label: string;
  required?: boolean
}
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const CommonUploadWrapper = ({ id, form, uploadedMsg, name, label, required }: PropTypes) => {
  const extraField = `${name}_file_name`;
  const fieldValue = Form.useWatch(name, form);
  const extrafieldValue = Form.useWatch(extraField, form);
  const { submit: uploadFile } = usePostRequestHandler();

  useEffect(() => {
    if (id && !extrafieldValue) {
      const initialValue = fieldValue ? uploadedMsg || "Old file" : "";
      form.setFieldValue(extraField, initialValue);
    }
  }, [id, fieldValue, !extrafieldValue]);

  // if fieldValue is not empty it means file uploaded then remove the validation message
  useEffect(() => {
    if (fieldValue) form.validateFields([extraField], { recursive: true });
  }, [fieldValue]);

  const uploadSignatureHandler = async (
    fileObj: {
      uid: any;
      name: string;
      originFileObj: any;
    }
  ) => {
    form.setFieldValue(extraField, "Uploading start....");
    const base64DAta = await getBase64(fileObj?.originFileObj, 0.4);
    const fileName = fileObj?.name
    const lastDotIndex = fileName.lastIndexOf('.');
    const fileBase = fileName.substring(0, lastDotIndex);
    const extension = fileName.substring(lastDotIndex);
    const uid = Date.now()

    const finalFileName = `${fileBase}-${uid}${extension}`

    const payload = {
      file_url: base64DAta,
      name: finalFileName,
    };

    const res = await uploadFile("/api/upload-file", payload);

    // if status true then set the object value to signature
    if (res?.status) {
      // set file url into a main key field for exact payload
      form.setFieldValue(name, res.data.Location);
      form.setFieldValue(extraField, "Upload completed");
    } else {
      Toast("error", "", "Something wrong in signature upload");
      form.setFieldValue(extraField, "Uploading failed");
    }
  };

  const beforeUpload = (file: FileType) => {
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      Toast("error", "", "Image must smaller than 5MB!");
    }
    return isLt2M || Upload.LIST_IGNORE;
  };

  return (
    <>
      <FormItemWrapper name={name} hidden></FormItemWrapper>

      <FormItemWrapper
        label={label}
        name={extraField}
        dependencies={[extraField]}
        rules={[
          {
            required: required || false,
            message: REQUIRED_MESSAGE,
          },
        ]}
      >
        <InputWrapper
          readOnly
          addonAfter={
            <Upload
              customRequest={() => null}
              onChange={(e) => uploadSignatureHandler(e.file as any)}
              showUploadList={false}
              accept=".pdf, image/*"
              maxCount={1}
              beforeUpload={beforeUpload}
            >
              Browse
            </Upload>
          }
        />
      </FormItemWrapper>
    </>
  );
};

export default CommonUploadWrapper