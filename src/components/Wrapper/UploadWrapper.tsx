/* eslint-disable no-inline-comments */
import { EyeOutlined, PaperClipOutlined } from '@ant-design/icons'
import Toast from '@components/Common/Toast'
import { MAX_FILE_UPLOAD_COUNT, MAX_FILE_UPLOAD_SIZE } from '@constants/AppConstant'
import { type fileType } from '@utils/allTypes'
import { getBase64 } from '@utils/commonFunctions'
import { Upload } from 'antd'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UploadProps } from 'antd/lib/upload/interface'
import ImgCrop from 'antd-img-crop'
import React, { useMemo, useState } from 'react'

interface uploadPropsType extends UploadProps {
  getFiles?: (files: fileType[]) => void
  maximumSize?: number
  uploadClass?: string
  crop?: boolean
}

const UploadWrapper = (props: uploadPropsType): JSX.Element => {
  const {
    getFiles=false,
    maximumSize,
    maxCount=1,
    accept,
    uploadClass,
    children,
    multiple = false,
    crop = false,
    ...restProps
  } = props

  // main code start
  const [fileList, setFileList] = useState<fileType[]>([])

  const fileChangeHandler = async (info: any) => {
    const filesArr = await Promise.all(
      info.fileList.map(async (file: any) =>
        // eslint-disable-next-line no-prototype-builtins
        file.hasOwnProperty("fileId")
          ? file
          : ({
            name: file.name,
            size: file.size,
            type: file.type,
            originalImg: await getBase64(file.originFileObj),
            originFileObj: file.originFileObj,
          })
      )
    );
    setFileList(filesArr as fileType[]);
    getFiles && getFiles(filesArr as fileType[]);
    if (Array.isArray(event)) {
      return event;
    }
    return filesArr;
  };

  // upload props for upload component
  const uploadProps: UploadProps = useMemo(
    () => ({
      beforeUpload: (newFile) => {
        const isLt2M =
          newFile.size / 1024 / 1024 < (maximumSize ?? MAX_FILE_UPLOAD_SIZE);
        if (!isLt2M) {
          Toast("error", "", "File must smaller than 2MB!");
        }

        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        const duplicateFile = !!fileList.find(
          (file) => file.name === newFile.name
        );
        // check file alraedy exist or not if true then show a message otherwise return
        if (duplicateFile) {
          Toast("error", "", "Duplicate file is not allowed");
        }

        const isMaxFileExceed =
          fileList.length === (maxCount ?? MAX_FILE_UPLOAD_COUNT);

        if (isMaxFileExceed) {
          Toast(
            "error",
            "",
            `You can only upload maximum of ${
              maxCount ?? MAX_FILE_UPLOAD_COUNT
            } files`
          );
        }

        return (
          (isLt2M && !duplicateFile && !isMaxFileExceed) || Upload.LIST_IGNORE
        );
      },
      onChange: fileChangeHandler,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fileList, maxCount, maximumSize]
  );

  const allProps = {
    ...props,
    ...restProps,
    ...(getFiles && uploadProps),
    multiple,
    // listType: 'picture'
  };
  return (
    <>
      <div className="file-uploader">
        {crop ? (
          <ImgCrop rotationSlider>
            <Upload
              {...allProps}
              // fileList={fileList as UploadFile[]}
              accept={accept ?? "video/*, image/*"}
              className={`d-block ${uploadClass ?? ""}`}
              maxCount={maxCount ?? MAX_FILE_UPLOAD_COUNT}
            >
              {children ?? (
                <p>
                  <PaperClipOutlined className="mr-1" />
                  Browse or drop files here
                </p>
              )}
            </Upload>
          </ImgCrop>
        ) : (
          <Upload
            {...allProps}
            // fileList={fileList as UploadFile[]}
            accept={accept ?? "image/*,.pdf"}
            className={`d-block ${uploadClass ?? ""}`}
            maxCount={maxCount ?? MAX_FILE_UPLOAD_COUNT}
          >
            {children ?? (
              <p>
                <PaperClipOutlined className="mr-1" />
                Browse or drop files here
              </p>
            )}
          </Upload>
          // eslint-disable-next-line indent
        )}
        {/* {percent !== 0 && <Progress percent={percent} format={() => null} size="small" className="upload-percent" />} */}
      </div>
    </>
  );
}

export default UploadWrapper