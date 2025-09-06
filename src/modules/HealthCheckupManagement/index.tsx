import { MenuOutlined } from "@ant-design/icons";
import { EditPencil } from "@components/Common";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import ViewDetailsModal from "@components/Common/ViewDetailsModal";
import ViewFileLink from "@components/Common/ViewDetailsModal/ViewFile";
import DynamicPageLayout from "@components/DynamicPageLayout";
import { CardWrapper, DropdownWrapper, TableWrapper } from "@components/Wrapper";
import {
  EMPTY_PLACEHOLDER,
  HEALTH_CHECKUP_MANAGEMENT,
  pageNameArray,
} from "@constants/AppConstant";
import { renderAllDetails } from "@utils/commonFunctions";
import { TableProps, Space, Table, Button, Badge } from "antd";
import dayjs from "dayjs";
import { startCase } from "lodash";
import Router from "next/router";
import React, { useEffect } from "react";
import {
  useGetRequestHandler,
} from "src/hook/requestHandler";
import useDevice from "src/hook/useDevice";
import usePermission from "src/hook/usePermission";
import useSearchHook from "src/hook/useSearch";
import { fetchCenterId } from '@utils/centerIdHandler';

interface DataType {
  patient_type: string;
  CETMANAGEMENT: any;
  selected_test: any;
  driver: any;
  verify_option: string;
  signature: string;
  uniqueId: string;
  name: string;
  id: string;
  transpoter: string;
  package_and_test_history: string;
  driver_details: string;
  driver_id: string
  driver_type: string
  package_list: string
  unique_code: string
  vehicle_no: string
  date_time: string
}

const CenterWisePackageComp = () => {
  const { tableScroll } = useDevice();
  const { canEdit, canCreate } = usePermission(pageNameArray[2]);

  const { getColumnSearch } = useSearchHook();
  const { loading, data, fetchData } = useGetRequestHandler();

  // 🔹 Modified to include center_id in payload
  const fetchListData = async () => {
    try {
      const centerId = await fetchCenterId();
      const payload = {
        center_id: centerId
      };
      fetchData("/api/view-driver-health-checkup", payload);
    } catch (error) {
      console.error('Failed to fetch center ID:', error);
      // Fallback: fetch without center_id (will return all centers)
      fetchData("/api/view-driver-health-checkup");
    }
  };

  useEffect(() => {
    fetchListData()
  }, []);

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
      key: "driver",
      render: (text) => text?.external_id,
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
      title: "Test Package",  // ✅ New column for Test Package
      dataIndex: "selected_package_name",
      key: "test_package",
      render: (packageNames: string[] | null) => 
        packageNames?.length ? packageNames.join(", ") : EMPTY_PLACEHOLDER, 
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
          {canEdit && (
            <DropdownWrapper
              menu={{
                items: [
                  canEdit
                    ? {
                        label: (
                          <span
                            onClick={() =>
                              Router.push(
                                `${HEALTH_CHECKUP_MANAGEMENT}/update-health-checkup-${record.id}`
                              )
                            }
                          >
                            Edit
                          </span>
                        ),
                        key: "edit",
                      }
                    : null,
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
          )}
        </Space>
      ),
    },
  ];

  const ButtonComp = canCreate && (
    <Button
      type="primary"
      size="large"
      onClick={() =>
        Router.push(`${HEALTH_CHECKUP_MANAGEMENT}/add-health-checkup`)
      }
    >
      Add Health Checkup
    </Button>
  );

  return (
    <CardWrapper>
      <DynamicPageLayout
        // hideTitle={true}
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
              rowKey={'id'}
            />
          )
        }
        ActionComp={ButtonComp}
      />
    </CardWrapper>
  );
};

export default CenterWisePackageComp;
