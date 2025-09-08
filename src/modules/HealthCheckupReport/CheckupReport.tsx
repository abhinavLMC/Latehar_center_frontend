import { DownloadOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import Toast from "@components/Common/Toast";
import { ModalWrapper, TableWrapper } from "@components/Wrapper";
import { Button, Col, Row, Space, Table, TableColumnsType } from "antd";
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
  key: string;
  label: string;
  value: string;
  units: string;
  standard_value?: string[];
  remark?: string;
  status: string;
}

interface PropType {
  data: ReportType;
  previewModal: boolean;
  setPreviewModal: (p: boolean) => void;
  previewLoading: boolean;
}



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
    !previewLoading && setTimeout(() => setLoading(false), 200);
  }, [data, previewLoading]);

  const renderMetaData = (allTest: any) => {
    if (!allTest) return [];
    const { eye_unit, blood_pressure_unit, ...rest } = allTest || {
      eye_unit: {},
      blood_pressure_unit: {},
    };
    !!blood_pressure_unit && delete blood_pressure_unit?.['extraData'];
    const mainData = {
      ...blood_pressure_unit,
      ...rest,
      ...eye_unit,
    };

    const mapper = Object.entries(mainData).map(([key, value]) => {
      if (!!value && Object?.keys(value)?.length > 0) {
        return value;
      }
    });
    return mapper.filter((item : { value?: string | number } | undefined) => item !== undefined && item.value != null);
  };

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
          margin: [50, 0], // for page up and bottom margin
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
        ? dayjs(data.drivers.date_time as string).format("MMM D, YYYY h:mm A")
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
        ? dayjs(driverDetails?.dateOfBirthOrAge, "DD-MM-YYYY").format(
            "DD MMMM YYYY"
          )
        : NA,
    },
    {
      key: "Name of District",
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
    {
      key: "ABHA Number",
      value: driverDetails?.abhaNumber || NA,
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

  const color = (s: string) =>
    s === "success" ? "green" : s === "warning" ? "#ffa408" : "red";

  // generate standard value
  const standardValue = (obj: tableDataType) => {
    const value = Array.isArray(obj?.standard_value)
      ? obj?.standard_value?.join("-")
      : obj?.standard_value;
    switch (obj?.key) {
      case "haemoglobin_unit":
      case "pulmonary_function_test_unit":
        return `>${value}`;
      default:
        return value;
    }
  };

  const columns: TableColumnsType<tableDataType> = [
    {
      title: "No",
      render: (_: any, _k: any, index: number) => {
        return index + 1;
      },
    },
    {
      title: "Test Name",
      dataIndex: "label",
      width: "24%",
    },
    {
      title: "Health Data",
      width: "15%",
      render: ({ key, value, status }) => (
        <span className={`${status === "danger" ? "fw-bold" : ""}`}>
          {key !== 'hiv_unit' ? value : 'N/A'}
        </span>
      ),
    },
    {
      title: "Units",
      dataIndex: "units",
      width: "12%",
    },
    {
      title: "Standard Value",
      dataIndex: "standard_value",
      width: "18%",
      render: (_, record) => standardValue(record),
    },
    {
      title: "Remarks",
      dataIndex: "remark",
      render: (text: string, record) => (
        <span className="fs-7" style={{ color: color(record?.status) }}>
          {text}
        </span>
      ),
    },
  ];

  return (
    <ModalWrapper
      open={previewModal}
      onCancel={() => {
        setPreviewModal(false);
      }}
      footer={
        loading ? (
          <TableContentLoaderWithProps
            columnWidth={[10, "80", 10]}
            rowCounts={1}
            radius={5}
            rowHeight={70}
          />
        ) : (
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
        )
      }
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
                    {/* Logo Section - 2x2 Grid */}
                    <Row className="mb-4">
                      <Col span={12}>
                        <Row>
                          <Col span={12} className="text-center">
                            <div className="brand_image">
                              <img
                                src="/images/Jharkhand-Sarkar-logo.png"
                                className="brand-logo"
                                style={{ maxHeight: '80px', width: 'auto' }}
                              />
                            </div>
                          </Col>
                          <Col span={12} className="text-center">
                            <div className="brand_image">
                              <img
                                src="/images/LMC_logo.png"
                                className="brand-logo"
                                style={{ maxHeight: '80px', width: 'auto' }}
                              />
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={12}>
                        <Row>
                          <Col span={12} className="text-center">
                            <div className="brand_image">
                              <img
                                src="/images/NHM.png"
                                className="brand-logo"
                                style={{ maxHeight: '80px', width: 'auto' }}
                              />
                            </div>
                          </Col>
                          <Col span={12} className="text-center">
                            <div className="brand_image">
                              <img
                                src="/images/PMKKKY_Logo.png"
                                className="brand-logo"
                                style={{ maxHeight: '80px', width: 'auto' }}
                              />
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    
                    {/* Center Details */}
                    <Row>
                      <Col span={24} className="text-center">
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
                          <SignatureImage
                            imageUrl={
                              doctorDetails?.signature ||
                              "/images/no-picture-available.jpg"
                            }
                          />
                          <p>Signature of Doctor</p>
                        </div>
                      </Col>
                      <Col span="8"></Col>
                      <Col span="8">
                        <div className="text-right">
                          <SignatureImage
                            imageUrl={
                              centreDetails?.signature ||
                              "/images/no-picture-available.jpg"
                            }
                          />
                          <p>Signature of Professional</p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="report-footer mt-4">
                    <p className="mt-3 fs-6 d-block">
                      <strong>DECLARATION:</strong> I/We hereby agree and
                      declare that the medical health checkup statements and
                      reports will be generated based on the devices and medical
                      equipment contract issued or renewed between
                      myself/ourselves and the Company. I/We have made a
                      complete, true, and accurate disclosure of all relevant
                      facts and circumstances, without withholding any
                      information that may be pertinent for the Company to make
                      an informed decision regarding the acceptability of the
                      risk. Additionally, I fully understand that the Company
                      reserves the right to impose any recheck-up procedure by
                      or after consulting our healthcare providers as a result
                      of underwriting. I am also aware that, at the time of
                      renewal, the cost of medical examinations and special
                      tests, if any, will be borne accordingly. Units, if any,
                      will be allocated on the reinstatement date. I/We
                      undertake to notify the Company in writing of any changes
                      in the statements made in the declaration of good health
                      form after signing this declaration and before the
                      acceptance of risk and revival of the drivers or riders by
                      the Company.
                    </p>
                    <p className="fs-6 d-block mt-3">
                      <strong>DISCLAIMER:</strong> The tests have been conducted
                      in a closed environment with a qualified professional, and
                      the results mentioned are based on the patient's physical
                      condition at the time of the test. The beneficiary has
                      been given information about the diagnostic tests, and the
                      beneficiary has given consent for conducting & reporting
                      the data with the relevant stakeholders
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
          
        </>
      )}
    </ModalWrapper>
  );
};

export default CheckupReport;
