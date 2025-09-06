import { EditOutlined, MenuOutlined } from "@ant-design/icons";
import { CancelButton, EditPencil, SubmitButton } from "@components/Common";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import ViewDetailsModal from "@components/Common/ViewDetailsModal";
import DynamicPageLayout from "@components/DynamicPageLayout";
import { CardWrapper, DropdownWrapper, FormItemWrapper, ModalWrapper, SelectWrapper, TableWrapper } from "@components/Wrapper";
import {
  CET_MANAGEMENT,
  EMPTY_PLACEHOLDER,
  EXTERNAL_ID,
  pageNameArray,
} from "@constants/AppConstant";
import { fieldRules, renderAllDetails } from "@utils/commonFunctions";
import {
  TableProps,
  Tag,
  Space,
  Table,
  Button,
  Card,
  Switch,
  Dropdown,
  Form,
} from "antd";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { useGetRequestHandler, usePostRequestHandler } from "src/hook/requestHandler";
import useDevice from "src/hook/useDevice";
import usePermission from "src/hook/usePermission";
import useSearchHook from "src/hook/useSearch";

interface DataType {
  external_id: string;
  id: any;
  uniqueId: string;
  accountNumber: string;
  alternateSpocContactNumber: string;
  alternateSpocEmail: string;
  alternateSpocName: string;
  attachCertificateOfIncorporation: string;
  attachCancelledChequeOrPassbook: string;
  attachGstin: string;
  attachPanCopy: string;
  bankName: string;
  contactNumber: string;
  correspondenceAddress: string;
  createdAt: string;
  gstin: string;
  ifscCode: string;
  name: string;
  pan: string;
  registeredAddress: string;
  spocEmail: string;
  spocName: string;
  spocWhatsappNumber: string;
  status: string;
}

const ALL_STATUS = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

const CETMasterComponent = () => {
  const { tableScroll } = useDevice();
  const [statusForm] = Form.useForm();

  const { canEdit, canCreate, canModify } = usePermission(pageNameArray[0]);

  const { getColumnSearch } = useSearchHook();
  const { loading, data, fetchData } = useGetRequestHandler();
  const { buttonLoading, submit } = usePostRequestHandler();

  const [statusArray, setStatusArray] = useState(ALL_STATUS);
  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState<DataType>()

  const fetchTableData = () => fetchData("/api/cet-list");
  useEffect(() => {
    fetchTableData();
  }, []);

  const callBackFunc = () => {
    fetchTableData();
    setOpenModal(false);
    statusForm.resetFields();
  }

  const updateStatusHandler = (field: {status: string}) => {
    const payload = {
      ...selectedData,
      ...field,
    };

    const API_ENDPOINT ="/api/cet-update";
    submit(API_ENDPOINT, payload, null, () => callBackFunc());
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "CET ID",
      dataIndex: EXTERNAL_ID,
      key: EXTERNAL_ID,
      ...(getColumnSearch(EXTERNAL_ID, "", "CET ID") as () => void),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...(getColumnSearch("name", "") as () => void),
    },
    
    {
      title: "Contact No",
      dataIndex: "contactNumber",
      key: "contactNumber",
      ...(getColumnSearch("contactNumber", "", "contact no") as () => void),
    },
    {
      title: "Spoc Name",
      dataIndex: "spocName",
      key: "spocName",
      ...(getColumnSearch("spocName", "", "SPOC name") as () => void),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <DropdownWrapper
            onOpenChange={() => {
              setStatusArray(
                ALL_STATUS.filter((item) => item.value !== record?.status)
              );
              setSelectedData(record);
            }}
            menu={{
              items: [
                canEdit
                  ? {
                      label: (
                        <span
                          onClick={() =>
                            Router.push(
                              `${CET_MANAGEMENT}/update-cet-${record.id}`
                            )
                          }
                        >
                          Edit
                        </span>
                      ),
                      key: "edit",
                    }
                  : null,
                canEdit
                  ? {
                      label: "Update Status",
                      key: "update_status",
                      onClick: () => setOpenModal(true),
                    }
                  : null,
                {
                  label: (
                    <ViewDetailsModal
                      label="View Details"
                      viewData={{
                        "Cet ID": record?.external_id,
                        ...renderAllDetails(record, [
                          "uniqueId",
                          "external_id",
                          "short_code",
                          "center_id",
                        ]),
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

  const ButtonComp = canCreate && (
    <Button
      type="primary"
      size="large"
      onClick={() => Router.push(`${CET_MANAGEMENT}/add-cet-master`)}
    >
      Add CET Master
    </Button>
  );

  return (
    <>
      <CardWrapper>
        <DynamicPageLayout
          // hideTitle={true}
          MainComp={
            <>
              {loading ? (
                <TableContentLoaderWithProps
                  rowHeight={70}
                  columnWidth={[
                    10,
                    "2",
                    20,
                    "2",
                    15,
                    "2",
                    15,
                    "2",
                    15,
                    "2",
                    12,
                  ]}
                />
              ) : (
                <TableWrapper
                  className="mt-3"
                  columns={columns}
                  dataSource={data}
                  scroll={tableScroll}
                />
              )}
            </>
          }
          ActionComp={ButtonComp}
        />
      </CardWrapper>
      <ModalWrapper
        title="Update Status"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
      >
        <Form layout="vertical" form={statusForm} onFinish={updateStatusHandler}>
          <FormItemWrapper name="status" label="Status" rules={fieldRules()}>
            <SelectWrapper options={statusArray} />
          </FormItemWrapper>
          <div className="d-flex justify-content-end gap-3">
            <SubmitButton loading={buttonLoading} />
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          </div>
        </Form>
      </ModalWrapper>
    </>
  );
};

export default CETMasterComponent;
