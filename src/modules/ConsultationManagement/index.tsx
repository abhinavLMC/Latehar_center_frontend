import React, { useEffect, useState } from "react";
import { Table, Select, message, Space } from "antd";
import { CardWrapper, TableWrapper } from "@components/Wrapper";
import DynamicPageLayout from "@components/DynamicPageLayout";
import { ALL_API_OBJECT, MOBILE_API_BASE_URL } from "@constants/ApiConstant";
import ConsultationTable from "./components/ConsultationTable";
import moment from "moment";
import { fetchCenterId } from "@utils/centerIdHandler";

const { Option } = Select;

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
  isReady?: boolean;
}

const ConsultationManagement: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"booked" | "completed">("booked");

  // Function to sort consultations by scheduled_time in descending order
  const sortConsultations = (consultations: Consultation[]): Consultation[] => {
    return [...consultations].sort((a, b) => 
      moment(b.scheduled_time).valueOf() - moment(a.scheduled_time).valueOf()
    );
  };

  // Function to Fetch Consultation Data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // First, get the center ID
      const centerId = await fetchCenterId();
      if (!centerId) {
        message.error("Failed to get center ID. Please try again.");
        setLoading(false);
        return;
      }

      // Fetch consultations with centerID filter
      const consultationUrl = `${ALL_API_OBJECT["consultation-list"] as string}?centerID=${centerId}`;
      const response = await fetch(consultationUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch consultations: ${response.status}`);
      }

      const result = await response.json();

      // For completed consultations, fetch their prescriptions
      const completedConsultations = result.filter((consultation: Consultation) => consultation.iscomplete);
      
      if (completedConsultations.length > 0) {
        const consultationsWithPrescriptions = await Promise.all(
          result.map(async (consultation: Consultation) => {
            if (consultation.iscomplete) {
              try {
                const prescriptionResponse = await fetch(
                  `${MOBILE_API_BASE_URL}/api/prescriptions/prescription/${consultation.consultation_id}`
                );
                if (prescriptionResponse.ok) {
                  const prescriptionData = await prescriptionResponse.json();
                  return {
                    ...consultation,
                    prescription_id: prescriptionData.prescription_id,
                    isReady: prescriptionData.isReady
                  };
                }
              } catch (error) {
                console.error(`Error fetching prescription for consultation ${consultation.consultation_id}:`, error);
              }
            }
            return consultation;
          })
        );
        // Sort consultations before setting state
        setConsultations(sortConsultations(consultationsWithPrescriptions));
      } else {
        // Sort consultations before setting state
        setConsultations(sortConsultations(result));
      }
    } catch (error) {
      console.error("Error fetching consultations:", error);
      if (error instanceof Error) {
        message.error(`Failed to fetch consultations: ${error.message}`);
      } else {
        message.error("Failed to fetch consultations. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Apply filter based on "booked" or "completed" status
  const filteredConsultations = consultations?.filter((consultation: Consultation) =>
    statusFilter === "completed" ? consultation.iscomplete : !consultation.iscomplete
  );

  return (
    <CardWrapper>
      <DynamicPageLayout
        MainComp={
          <>
            <Space style={{ marginBottom: "20px" }}>
              <label>Filter by Status:</label>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 200 }}
              >
                <Option value="booked">Booked</Option>
                <Option value="completed">Completed</Option>
              </Select>
            </Space>

            <ConsultationTable
              data={filteredConsultations}
              loading={loading}
              statusFilter={statusFilter}
              onRefresh={fetchData}
            />
          </>
        }
      />
    </CardWrapper>
  );
};

export default ConsultationManagement;
