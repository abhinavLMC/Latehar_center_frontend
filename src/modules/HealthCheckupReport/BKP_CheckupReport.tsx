import { DownloadOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import Toast from "@components/Common/Toast";
import { ModalWrapper, TableWrapper } from "@components/Wrapper";
import { Button, Col, Row, Space, Table } from "antd";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import { capitalize, kebabCase, startCase, upperCase } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { usePostRequestHandler } from "src/hook/requestHandler";
import { ReportType } from "./type";
import SignatureImage from "./SignatureImage";
import { calculateAge } from "@utils/commonFunctions";

interface tableDataType {
  test_name: string;
  value: string;
  unit: string;
}

interface PropType {
  data: ReportType;
  previewModal: boolean;
  setPreviewModal: (p: boolean) => void;
  previewLoading: boolean;
}



const renderMetaData = (data: { [x: string]: any }) => {
  const output = [];

  for (const key in data) {
    const unit = data[key];
    const extraData = unit.extraData;
    const children = [];

    for (const prop in unit) {
      if (prop !== "extraData") {
        // remove doc from children data
        prop !== "doc" &&
          children.push({
            name: startCase(prop?.replace("_unit", "")),
            parent: false,
            // unit[prop] if its an array then it will be joined by comma otherwise it will return as it is.
            value: Array.isArray(unit[prop])
              ? unit[prop]?.join(", ")
              : unit[prop],
            unit:
              extraData && extraData[`${prop}_units`] != null
                ? extraData[`${prop}_units`]
                : extraData?.[`units`],
            standard_value:
              extraData && extraData[`${prop}_standard_value_min`] != null
                ? `${extraData[`${prop}_standard_value_min`]} - ${
                    extraData[`${prop}_standard_value_max`]
                  }`
                : extraData?.hasOwnProperty("standard_value_min")
                ? `${extraData?.[`standard_value_min`]} - ${
                    extraData?.[`standard_value_max`]
                  }`
                : "",
          });
      }
    }

    // if (extraData && extraData.comments) {
    //   children.push({
    //     name: "comments",
    //     value: extraData.comments,
    //     unit: null,
    //     standard_value: null,
    //   });
    // }

    output.push({
      name: key,
      parent: true,
      children: children,
    });
  }

  return output;
};

const CheckupReport = ({
  data,
  previewModal,
  setPreviewModal,
  previewLoading,
}: PropType) => {
  const { submit: uploadFile } = usePostRequestHandler(null, false);
  const { submit: sendWhatsapp } = usePostRequestHandler(null, false, false);

  const driverDetails = (data?.drivers as ReportType["drivers"])?.driver || {};
  const doctorDetails = (data?.drivers as ReportType["drivers"])?.doctor || {};
  const centreDetails = data?.centerMetaData as ReportType["centerMetaData"];
  const packageDetails = data?.packageMetaData as ReportType["packageMetaData"];
  const mainObj = data?.drivers as ReportType["drivers"];

  const SUPPORT_EMAIL = "info@lastmilecare.in";
  const EMERGENCY_CONTACT = "+91 80921 02102";
  const NA = "N/A";

  const componentRef = useRef<HTMLDivElement>(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [tableData, setTableData] = useState<tableDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareLoading, setShareLoading] = useState(false);

  useEffect(() => {
    if (!!data) {
      const transformArr = renderMetaData(data?.metaData as any);
      setTableData(transformArr as unknown as tableDataType[]);
    }
    !previewLoading && setTimeout(() => setLoading(false), 2600);
  }, [data, previewLoading]);

  // print handler
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    print: () => {
      return new Promise<void>((resolve) => {
        generatePdf();
        resolve(); // Resolve the promise immediately after calling generatePdf()
        setLoadingBtn(false);
      });
    },
    removeAfterPrint: true,
  });

  // file name string with driver name and health card number
  const reportFileName = kebabCase(driverDetails?.name + mainObj?.uniqueId);

  /**
   *
   * @param base64 boolean
   * @returns string || file save popup will be triggered
   */
  const generatePdf = (base64 = false) => {
    return new Promise((resolve, reject) => {
      const doc = new jsPDF("p", "px", [1500, 1900], false);
      const content = componentRef.current;
      if (content) {
        doc.html(content as unknown as HTMLElement, {
          callback: function (doc) {
            if (base64) {
              const base64String = doc.output("datauristring");
              resolve(base64String);
            } else {
              doc.save(`${reportFileName}-report.pdf`);
              resolve(null);
            }
          },
          x: 35,
          y: 35,
          windowWidth: 1420,
          width: 1420
        });
      } else {
        reject(new Error("Content not found"));
      }
    });
  };

  // whatsapp repor share
  const whatsAppHandler = async () => {
    setShareLoading(true);
    try {
      const getPDFBase64 = await generatePdf(true);

      const payload = {
        file_url: getPDFBase64,
        name: `${reportFileName}-report.pdf`,
      };

      // upload file with base64 data
      const uploadRes = await uploadFile("/api/upload-file", payload);

      if (uploadRes?.status) {
        const reqBody = {
          phoneNumber: driverDetails?.contactNumber,
          name: driverDetails?.name,
          url: uploadRes?.data?.Location,
        };
        // share report with pdf link
        const res = await sendWhatsapp(
          "/api/health-report-send-whatsapp",
          reqBody
        );
        if (res?.code === 200) {
          Toast("success", "", "Report send successfully");
        }
      }
      // Handle sending the base64 PDF string via WhatsApp or any other action
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setShareLoading(false);
    }
  };

  const driverDetailsArr = [
    {
      key: "Date Time of checkup",
      value: mainObj?.date_time
        ? dayjs(data.drivers.date_time as string).format(
            "D, MMMM, YYYY, h:mm A"
          )
        : NA,
    },
    {
      key: "Name of the patient",
      value: driverDetails?.name || NA,
    },
    mainObj?.vehicle_no
      ? {
          ...{
            key: "Vehicle Number",
            value: mainObj?.vehicle_no || NA,
          },
        }
      : {},
    {
      key: "LMC ID",
      value: driverDetails?.external_id || NA,
    },
    {
      key: "Health Card Number ",
      value: driverDetails?.healthCardNumber || NA,
    },
    {
      key: "Age",
      value: driverDetails?.dateOfBirthOrAge
        ? calculateAge(driverDetails?.dateOfBirthOrAge)
        : NA,
    },
    {
      key: "Name of transporter",
      value: mainObj?.CETMANAGEMENT?.name || NA,
    },
    {
      key: "Mobile No",
      value: driverDetails?.contactNumber || NA,
    },
    {
      key: "Blood Group",
      value: driverDetails?.blood_group || NA,
    },
  ];

  const doctor_details = [
    {
      key: "Doctor's Name",
      value: doctorDetails?.User?.username || NA,
    },
    {
      key: "Registration Number",
      value: doctorDetails?.registration_number || NA,
    },
    {
      key: "Designation of doctor",
      value: doctorDetails?.qualification || NA,
    },
    // {
    //   key: "Mode of consultation",
    //   value: NA,
    // },
  ];

  const columns = [
    {
      title: "No",
      render: (text: any, __: any, index: number) => {
        return text?.parent ? index + 1 : "";
      },
    },
    {
      title: "Test Name",
      dataIndex: "name",
      width: "26%",
      render: (text: string, record: any) =>
        record?.parent ? (
          <strong className="">{upperCase(text.replace("_unit", ""))}</strong>
        ) : (
          text
        ),
    },
    {
      title: "Health Data",
      dataIndex: "value",
      width: "20%",
    },
    {
      title: "Units",
      dataIndex: "unit",
    },
    {
      title: "Standard Value",
      dataIndex: "standard_value",
      width: "25%",
    },
    {
      title: "Remarks",
      dataIndex: "bg_color",
      render: (color: any) =>
        color ? <div style={{ background: color, height: "20px" }} /> : "",
    },
  ];

  return (
    <ModalWrapper
      open={previewModal}
      onCancel={() => {
        setPreviewModal(false);
      }}
      footer={null}
      width={1100}
    >
      {loading ? (
        <TableContentLoaderWithProps
          columnWidth={[20, "1", 30, "1", 15, "1", 20, "1", 10]}
          rowCounts={16}
          radius={5}
          rowHeight={70}
        />
      ) : (
        <>
          <div ref={componentRef} className="pdf-content">
            <Row>
              <div className="report">
                <Col span={24}>
                  <div className="report-header">
                    <Row>
                      <Col span={6}>
                        <div className="brand_image">
                          <img
                            src="/images/LMC_logo.png"
                            className="brand-logo"
                          />
                        </div>
                      </Col>
                      <Col span={14} className="text-center">
                        <h2>
                          {centreDetails?.getCenterUserData?.project_name}
                        </h2>
                        <p className="fs-6">
                          Address:{" "}
                          {centreDetails?.getCenterUserData?.project_address}
                          {", "}
                          {centreDetails?.getCenterUserData?.project_district}
                          {", "}
                          {centreDetails?.getCenterUserData?.project_state}
                        </p>
                        <p className="mb-0">
                          Phone:{" "}
                          {centreDetails?.getCenterUserData
                            ?.agency_spoc_contact_number || NA}
                        </p>
                        <p className="mb-0">
                          Email us:{" "}
                          <a href={`mailto:${SUPPORT_EMAIL}`}>
                            {SUPPORT_EMAIL}
                          </a>{" "}
                          || Contact us:{" "}
                          <a href={`tel:${EMERGENCY_CONTACT}`}>
                            {" "}
                            {EMERGENCY_CONTACT}{" "}
                          </a>
                        </p>
                      </Col>
                      <Col span={4}>
                        <div className="brand_image d-flex justify-content-end">
                          <img
                            src="/images/1Care_Logo.png"
                            className="brand-logo"
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <p className="mt-3">
                    It is to certify that{" "}
                    {centreDetails?.getCenterUserData?.project_name} run by Last
                    Mile Care Pvt Ltd has conducted{" "}
                    <strong>
                      {packageDetails?.getPackageData
                        ?.map((obj) => obj.package_name)
                        .join(", ")}
                    </strong>{" "}
                    for the following personnel and found as per the measured
                    readings.
                  </p>
                  <div className="doctor-details mt-3">
                    <p>
                      <strong>DOCTOR’S DETAILS:</strong>
                    </p>
                    <Row>
                      <Col span={12}>
                        {doctor_details.slice(0, 2)?.map((item) => (
                          <Row gutter={16}>
                            <Col span={12}>
                              <p>{item.key}</p>
                            </Col>
                            <Col span={12}>
                              <p>{item.value}</p>
                            </Col>
                          </Row>
                        ))}
                      </Col>
                      <Col span={12}>
                        {doctor_details.slice(2, 10)?.map((item) => (
                          <Row gutter={16}>
                            <Col span={12}>
                              <p>{item.key}</p>
                            </Col>
                            <Col span={12}>
                              <p>{item.value}</p>
                            </Col>
                          </Row>
                        ))}
                      </Col>
                    </Row>
                  </div>
                  <div className="report-customer-details mt-3">
                    <p>
                      <strong>PATIENT’S DETAILS:</strong>
                    </p>
                    <Row gutter={12}>
                      <Col span={12}>
                        {driverDetailsArr
                          .slice(0, 5)
                          ?.map((item: { key?: string; value?: any }) => (
                            <Row gutter={16} key={item.key}>
                              <Col span={12}>
                                <p>{item.key}</p>
                              </Col>
                              <Col span={12}>
                                <p>{item.value}</p>
                              </Col>
                            </Row>
                          ))}
                      </Col>
                      <Col span={12}>
                        {driverDetailsArr
                          .slice(5, 10)
                          ?.map((item: { key?: string; value?: any }) => (
                            <Row gutter={16}>
                              <Col span={12}>
                                <p>{item.key}</p>
                              </Col>
                              <Col span={12}>
                                <p>{item.value}</p>
                              </Col>
                            </Row>
                          ))}
                      </Col>
                    </Row>
                  </div>

                  <div className="checkup-details mt-4">
                    <Table
                      bordered
                      indentSize={36}
                      className="mt-3 report-table"
                      columns={columns}
                      dataSource={tableData}
                      pagination={false}
                      expandable={{
                        defaultExpandAllRows: true,
                        expandIcon: () => null,
                      }}
                    />
                  </div>
                  <div className="signature-area mt-4">
                    <Row>
                      <Col span="8">
                        <div className="text-left">
                          <SignatureImage imageUrl={doctorDetails?.signature} />
                          <p>Signature of 1Care Doctor</p>
                        </div>
                      </Col>
                      <Col span="8"></Col>
                      <Col span="8">
                        <div className="text-right">
                          <SignatureImage imageUrl={centreDetails?.signature} />
                          <p>Signature of 1Care Professional</p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="report-footer mt-4">
                    <p className="mt-3 fs-6 d-block">
                      <strong>DECLARATION:</strong> I/We do hereby agree &
                      declare that above medical health checkup statements and
                      reports shall begenerated on the basis of the devices and
                      medical equipment’s contract to be issued or revived
                      between me/us and the Company & that I/We have made
                      complete, true and accurate disclosure of all the facts
                      and circumstances as may be relevant, and have not
                      withheld any information that may be relevant to enable
                      the Company to make an informed decision about the
                      acceptability of the risk. Further I fully understand that
                      the company reserves the right to impose any recheck up
                      procedure by/after consulting our HCPs as results of
                      underwriting. I am also aware that at the time of revival,
                      the cost of medical examination and special tests, if any.
                      Units, if any, shall be allocated at the reinstatement
                      date. I/We undertake to notify the Company, forthwith in
                      writing, of any change in any of the statements made in
                      the declaration of good health form subsequent to the
                      signing of this declaration of good health and prior to
                      acceptance of risk and revival of the drivers or rider of
                      the company
                    </p>
                    <p className="fs-6 d-block mt-3">
                      <strong>DISCLAIMER:</strong> The tests have been conducted
                      in a closed environment with a qualified professional and
                      the results mentioned are based on the physical condition
                      of the patient at the time of test.The beneficiary has
                      been given information about the diagnostic tests and
                      given the consent for conducting & reporting the data with
                      the relevant stakeholders
                    </p>
                    <p className="text-dark mt-3 fw-bold">
                      In Case of an Emergency call us on{" "}
                      <a href={`tel:${EMERGENCY_CONTACT}`}>
                        {EMERGENCY_CONTACT}
                      </a>{" "}
                      Or Email us at:{" "}
                      <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
                    </p>
                  </div>
                </Col>
              </div>
            </Row>
          </div>
          <Row
            align="middle"
            justify="space-between"
            className="border-top pt-3 primary-border-color"
          >
            <Col>
              <Space align="center">
                <span>Share with:</span>
                <Button
                  onClick={whatsAppHandler}
                  style={{ backgroundColor: "#25D366", color: "#fff" }}
                  loading={shareLoading}
                  icon={<WhatsAppOutlined />}
                />
              </Space>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={() => {
                  setLoadingBtn(true);
                  handlePrint();
                }}
                loading={loadingBtn}
              >
                Download
              </Button>
            </Col>
          </Row>
        </>
      )}
    </ModalWrapper>
  );
};

export default CheckupReport;
