import React from "react";
import { Table, Space, Button, message } from "antd";
import { useRouter } from "next/router";
import moment from "moment";
import { DownloadOutlined } from "@ant-design/icons";
import { JOIN_VIDEO_CALL_ROUTE, PRESCRIPTION_MANAGEMENT_ROUTE, CONSULTATION_BOOKING_ROUTE } from "@constants/AppConstant";
import { ALL_API_OBJECT, MOBILE_API_BASE_URL } from "@constants/ApiConstant";

interface Consultation {
  request_id: string;
  consultation_id: string;
  doctor_name: string;
  scheduled_time: string;
  isBooked: boolean;
  prescription_id?: string | null;
  driver_id: number;
  driver_contactNumber: string;
  iscomplete: boolean;
  consultation_driver?: {
    name: string;
    contactNumber: string;
  }
  room_name: string
  meet_link:string
  centerID?: number;
}

interface Props {
  data: Consultation[];
  loading: boolean;
  statusFilter: "booked"|"completed";
  onRefresh: () => void;
}

const ConsultationTable: React.FC<Props> = ({ data, loading, statusFilter, onRefresh }) => {

  // console.log("data in ConsultationTable" , data)
  const router = useRouter();

  // Function to handle PDF download
  const handleDownloadPDF = (prescriptionId: string | null | undefined) => {
    if (!prescriptionId) {
      message.error("No prescription available for this consultation");
      return;
    }

    const url = `${ALL_API_OBJECT["download-prescription-pdf"]}/${prescriptionId}`;
    const hideLoading = message.loading('Downloading prescription PDF...', 0);
    
    try {
      const newWindow = window.open(url, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        message.error('Pop-up blocked! Please allow pop-ups for this site.');
      }
      setTimeout(() => hideLoading(), 1000);
    } catch (error) {
      hideLoading();
      console.error('Error downloading PDF:', error);
      message.error('Error downloading PDF. Please try again.');
    }
  };



  const baseColumns = [
    {
      title: "Patient Name",
      dataIndex: ["consultation_driver", "name"],
      key: "driver_name",
      render: (name: string) => name || "N/A",
    },
    {
      title: "Patient Contact",
      dataIndex: ["consultation_driver", "contactNumber"],
      key: "driver_contactNumber",
      render: (contact: string) => contact || "N/A",
    },
    {
      title: "Doctor Name",
      dataIndex: "doctor_name",
      key: "doctor_name",
    },
    {
      title: "Scheduled Time",
      dataIndex: "scheduled_time",
      key: "scheduled_time",
      render: (time: string) => moment(time).format("YYYY-MM-DD HH:mm"),
    },
  ];

  const downloadColumn = {
    title: "Actions",
    key: "download_actions",
    render: (_: any, record: Consultation) => (
      <Space>
        <Button
          type="link"
          onClick={() =>
            router.push(
              `${PRESCRIPTION_MANAGEMENT_ROUTE}?consultation_id=${record.consultation_id}`
            )
          }
        >
          Preview Prescription
        </Button>
        <Button
          type="link"
          icon={<DownloadOutlined />}
          onClick={() => handleDownloadPDF(record.prescription_id)}
          aria-label="Download Prescription PDF"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleDownloadPDF(record.prescription_id);
            }
          }}
          disabled={!record.prescription_id}
        >
          Download PDF
        </Button>
      </Space>
    ),
  };

  const joinCallColumn = {
    title: "Actions",
    key: "actions",
    render: (_: any, record: Consultation) => (
      <Space>
        {statusFilter === "booked" && (
          <Button
          type="link"
          onClick={async () => {
            console.log("record is : ", record);
            const { meet_link, room_name } = record;
        
            if (!meet_link) {
              message.info("Please wait. consultation has not started yet.");
              return;
            }
        
            router.push(
              `${JOIN_VIDEO_CALL_ROUTE}?room_name=${room_name}&meet_link=${encodeURIComponent(meet_link)}`
            );
          }}
        >
          Join Call
        </Button>
        )}
        {statusFilter === "completed" && (
          <Button
            type="link"
            onClick={() =>
              router.push(
                `${CONSULTATION_BOOKING_ROUTE}?requestId=${record.request_id}&driver_id=${record.driver_id}&consultation_id=${record.consultation_id}`
              )
            }
          >
            Reschedule Consultation
          </Button>
        )}
      </Space>
    ),
  };
// Conditionally add columns based on status
const columns = statusFilter === "completed" 
  ? [...baseColumns, downloadColumn]  // Add download for completed consultations
  : [...baseColumns, joinCallColumn]; // Add join call for booked consultations

  return <Table columns={columns} dataSource={data} loading={loading} rowKey="consultation_id" />;
};

export default ConsultationTable;
