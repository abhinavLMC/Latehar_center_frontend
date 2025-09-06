import React, { useEffect, useState } from "react";
import { EyeInvisibleOutlined, EyeOutlined, MenuOutlined } from "@ant-design/icons";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import DynamicPageLayout from "@components/DynamicPageLayout";
import { CardWrapper, TableWrapper, TooltipWrapper, DropdownWrapper } from "@components/Wrapper";
import {
  EMPTY_PLACEHOLDER,
  HEALTH_CHECKUP_MANAGEMENT,
} from "@constants/AppConstant";
import { TableProps, DatePicker, Space, Badge } from "antd";
import dayjs from "dayjs";
import {
  useGetRequestHandler,
} from "src/hook/requestHandler";
import useDevice from "src/hook/useDevice";
import useSearchHook from "src/hook/useSearch";
import ViewDetailsModal from "@components/Common/ViewDetailsModal";
import ViewFileLink from "@components/Common/ViewDetailsModal/ViewFile";
import { startCase } from "lodash";
import Router from "next/router";
import CheckupReport from "./CheckupReport";
import { ReportType } from "./type";
import { fetchCenterId } from '@utils/centerIdHandler';


interface DataType {
  CETMANAGEMENT: any;
  confirm_report: string;
  is_submited: any;
  name: string;
  id: string;
  transpoter: string;
  package_and_test_history: string;
  driver_details: string;
  driver_id: string;
  driver_type: string;
  package_list: string;
  unique_code: string;
  vehicle_no: string;
  date_time: string;
  verify_option: string;
  patient_type: string;
  selected_test: any;

}

const { RangePicker } = DatePicker;

const HealthReportTable = () => {
  const { tableScroll } = useDevice();
  const { getColumnSearch } = useSearchHook();
  const { loading, data, fetchData } = useGetRequestHandler();
  const { loading: previewLoading, data: downloadData, fetchData: fetchDownload } = useGetRequestHandler();

  const [filterDate, setFilterDate] = useState<string[]>([]);
  const [previewModal, setPreviewModal] = useState(false);
  const [reportData, setReportData] = useState<ReportType | null>();

  // 🔹 Modified to include center_id in payload
  const fetchListData = async () => {
    try {
      const centerId = await fetchCenterId();
      const payload = {
        startDate: filterDate?.[0], 
        endDate: filterDate?.[1],
        center_id: centerId
      };
      fetchData("/api/view-driver-health-checkup", payload);
    } catch (error) {
      console.error('Failed to fetch center ID:', error);
      // Fallback: fetch without center_id (will return all centers)
      fetchData("/api/view-driver-health-checkup", { 
        startDate: filterDate?.[0], 
        endDate: filterDate?.[1] 
      });
    }
  };


  useEffect(() => {
    fetchListData();
  }, [filterDate.toString()]);

  useEffect(() => {
    if (previewLoading) {
      setReportData(null);
    } else {
      setReportData(downloadData);
    }
  }, [previewLoading, downloadData]);

  // filter table data based on the selected date range
  const filterHandler = (_: any, dateArray: string[]) => {
    setFilterDate(dateArray);
  };

  // download API
  const previewDownloadReport = (id: string) =>
    fetchDownload("/api/health-checkup-download", { id });

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Test ID",
      dataIndex: "uniqueId",
      key: "uniqueId",
      ...(getColumnSearch("uniqueId") as () => void),
      render: (text) => text || EMPTY_PLACEHOLDER,
    },
    {
      title: "Name",
      dataIndex: "driver",
      key: "name",
      ...(getColumnSearch("name", "driver", "name") as () => void),
      render: (record) => record?.name || EMPTY_PLACEHOLDER,
    },
    {
      title: "LMC ID",
      dataIndex: "driver",
      ...(getColumnSearch("external_id", "driver", "lmc id") as () => void),
      key: "driver_id",
      render: (obj) => obj?.external_id || EMPTY_PLACEHOLDER,
    },
    {
      title: "Date & Time",
      dataIndex: "date_time",
      key: "date_time",
      ...(getColumnSearch("date_time", "", "date") as () => void),
      render: (date) =>
        date ? dayjs(date).format("DD-MM-YYYY") : EMPTY_PLACEHOLDER,
    },
    {
      title: "Status",
      dataIndex: "confirm_report",
      render: (isReady) => (
        <Badge
          status={isReady === "yes" ? "success" : "error"}
          text={isReady === "yes" ? "Ready" : "Not Ready"}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <TooltipWrapper title={record?.confirm_report === "yes" ? "Preview" : ""}>
            {record?.confirm_report === "yes" ? (
              <EyeOutlined
                className="cursor-pointer text-primary"
                onClick={() => {
                  previewDownloadReport(record?.id);
                  setPreviewModal(true);
                }}
              />
            ) : (
              <EyeInvisibleOutlined />
            )}
          </TooltipWrapper>
          <DropdownWrapper
            menu={{
              items: [
                {
                  label: (
                    <span
                      onClick={() =>
                        Router.push(`${HEALTH_CHECKUP_MANAGEMENT}/update-health-checkup-${record.id}`)
                      }
                    >
                      Edit
                    </span>
                  ),
                  key: "edit",
                },
                {
                  label: (
                    <ViewDetailsModal
                      label="View Details"
                      viewData={{
                        "Cet Name": record?.CETMANAGEMENT?.name,
                        "Verified By": startCase(record?.verify_option),
                        "Workforce Type": record?.patient_type,
                        "ECG Doc": (
                          <ViewFileLink
                            fileUrl={record?.selected_test?.ecg_unit?.doc}
                          />
                        ),
                        "Hearing Doc": (
                          <ViewFileLink
                            fileUrl={record?.selected_test?.hearing_unit?.doc}
                          />
                        ),
                      }}
                    />
                  ),
                  key: "view_details",
                },
              ],
            }}
          >
            <MenuOutlined />
          </DropdownWrapper>
        </Space>
      ),
    },
  ];

  const FILTER_COMPONENT = (
    <Space>
      Filter:
      <RangePicker style={{ width: "250px", fontSize: "14px" }} onChange={filterHandler} />
    </Space>
  );

  return (
    <>
      <CardWrapper>
        <DynamicPageLayout
          MainComp={
            loading ? (
              <TableContentLoaderWithProps
                rowHeight={70}
                columnWidth={[10, "2", 20, "2", 15, "2", 15, "2", 15, "2", 12]}
              />
            ) : (
              <TableWrapper
                className="mt-3"
                columns={columns}
                dataSource={data}
                scroll={tableScroll}
              />
            )
          }
          ActionComp={FILTER_COMPONENT}
        />
      </CardWrapper>
      {previewModal && (
        <CheckupReport
          {...{
            data: reportData || ({} as ReportType),
            previewModal,
            setPreviewModal,
            previewLoading,
          }}
        />
      )}
    </>
  );
};

export default HealthReportTable;
