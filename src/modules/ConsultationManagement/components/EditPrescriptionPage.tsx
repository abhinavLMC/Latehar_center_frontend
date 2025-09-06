import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, message, Switch, Spin, Table, Select, Space, Modal } from "antd";
import { useRouter } from "next/router";
import moment from "moment";
import { MOBILE_API_BASE_URL } from "@constants/ApiConstant";
import { DownloadOutlined } from "@ant-design/icons";
import { ALL_API_OBJECT } from "@constants/ApiConstant";

const { Option } = Select;

interface Vitals {
  temperature: string;
  systolicBP: string;
  diastolicBP: string;
  spo2: string;
  bmi: string;
  height: string;
  weight: string;
  haemoglobin: string;
  bloodSugar: string;
  pulse: string
}

interface PrescriptionMedicine {
  prescription_medicine_id?: string;
  medicine_name: string;
  medicine_type: string;
  dosage: string;
  frequency: string[];
  duration: number;
  instructions: string;
}

interface Prescription {
  prescription_id: string;
  consultation_id: string;
  doctor_id: number;
  driver_id: number;
  lab: string;
  other_lab: string;
  instructions: string;
  chief_complaints: string;
  diagnose: string;
  follow_up: string;
  preventive_advice: string;
  prescription_slip_text: string;
  prescription_slip_image?: string;
  vitals: Vitals;
  isReady: boolean;
  medicines: PrescriptionMedicine[]; // ✅ Medicines list
}

interface Props {
  consultationId: string;
}

const EditPrescriptionPage: React.FC<Props> = ({ consultationId }): JSX.Element => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([]);
  const [medicineLoading, setMedicineLoading] = useState<{ [key: string]: boolean }>({});
  const [changedMedicines, setChangedMedicines] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        setLoading(true);
  
        // Step 1: Fetch Prescription Data
        const response = await fetch(
          `${MOBILE_API_BASE_URL}/api/prescriptions/prescription/${consultationId}`
        );
        if (!response.ok) throw new Error("Failed to fetch prescription");
  
        const data = await response.json();
        console.log('Fetched prescription data:', data); // Debug log
        setPrescription(data);
        setIsReady(data.isReady);
  
        // Step 2: Fetch Medicines for this prescription
        const medicinesResponse = await fetch(
          `${MOBILE_API_BASE_URL}/api/prescription-medicines/prescription/${data.prescription_id}`
        );
        if (!medicinesResponse.ok) throw new Error("Failed to fetch medicines");
  
        const medicinesData = await medicinesResponse.json();
        setMedicines(medicinesData || []); // ✅ Ensure medicines are loaded
  
      } catch (error) {
        if (error instanceof Error){
        message.error(error.message || "Error fetching prescription details.");}
      } finally {
        setLoading(false);
      }
    };
  
    fetchPrescription();
  }, [consultationId]);
  

  useEffect(() => {
    if (prescription) {
      console.log('Setting form values with vitals:', prescription.vitals); // Debug log
      
      // Make a copy of the prescription to avoid reference issues
      const formValues = {
        ...prescription,
        follow_up: prescription.follow_up ? moment(prescription.follow_up) : null,
        vitals: prescription.vitals ? { ...prescription.vitals } : {
          temperature: '',
          systolicBP: '',
          diastolicBP: '',
          spo2: '',
          bmi: '',
          height: '',
          weight: '',
          haemoglobin:'',
          bloodSugar: '',
          pulse:''
        }
      };
      
      form.setFieldsValue(formValues);
    }
  }, [prescription, form]);

  const handleIsReadyChange = (checked: boolean) => {
    setIsReady(checked);
  };

  /** ✅ Medicines Section */
  const addMedicineRow = () => {
    setMedicines([
      ...medicines,
      { medicine_name: "",medicine_type: "", dosage: "", frequency: [], duration: 0, instructions: "" },
    ]);
  };

  const createNewMedicines = async (newMedicines: PrescriptionMedicine[]) => {
    try {
      for (const medicine of newMedicines) {
        const payload = {
          prescription_id: prescription?.prescription_id, // Attach prescription ID
          medicine_name: medicine.medicine_name,
          medicine_type: medicine.medicine_type, // ✅ Added missing medicine_type field
          dosage: medicine.dosage,
          frequency: medicine.frequency,
          duration: medicine.duration,
          instructions: medicine.instructions,
        };

        console.log('Creating new medicine with payload:', payload); // Debug log to verify medicine_type is included

        const response = await fetch(
          `${MOBILE_API_BASE_URL}/api/prescription-medicines`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
  
        if (!response.ok) throw new Error(`Failed to add ${medicine.medicine_name}`);
      }
  
      message.success("New medicines added successfully!");
    } catch (error) {
      if (error instanceof Error){
      message.error(error.message || "Error adding medicines.");
    }
  }
  };
  
  
  const updateMedicineRow = (index: number, key: keyof PrescriptionMedicine, value: string | number | string[]) => {
    const updatedMedicines = [...medicines];
    const medicine = updatedMedicines[index];
    (medicine[key] as any) = value;
    setMedicines(updatedMedicines);

    // Mark this medicine as changed if it has an ID
    if (medicine.prescription_medicine_id) {
      setChangedMedicines(prev => ({
        ...prev,
        [medicine.prescription_medicine_id!]: true
      }));
    }
  };

  const handleSaveMedicineChanges = async (medicine: PrescriptionMedicine) => {
    if (!medicine.prescription_medicine_id) return;
    
    setMedicineLoading(prev => ({ ...prev, [medicine.prescription_medicine_id!]: true }));

    // console.log("medicine is " ,medicine)
    
    try {
      const response = await fetch(
        `${MOBILE_API_BASE_URL}/api/prescription-medicines/${medicine.prescription_medicine_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(medicine),
        }
      );

      if (!response.ok) throw new Error("Failed to update medicine");

      const updatedMedicine = await response.json();
      setMedicines(prev => 
        prev.map(med => 
          med.prescription_medicine_id === medicine.prescription_medicine_id 
            ? updatedMedicine 
            : med
        )
      );
      
      // Clear the changed state for this medicine
      setChangedMedicines(prev => {
        const updated = { ...prev };
        delete updated[medicine.prescription_medicine_id!];
        return updated;
      });
      
      message.success("Medicine updated successfully!");
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || "Error updating medicine");
      }
    } finally {
      setMedicineLoading(prev => ({ ...prev, [medicine.prescription_medicine_id!]: false }));
    }
  };

  const deleteMedicine = async (medicineId: string) => {
    setMedicineLoading(prev => ({ ...prev, [medicineId]: true }));
    
    try {
      const response = await fetch(
        `${MOBILE_API_BASE_URL}/api/prescription-medicines/${medicineId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to delete medicine");

      setMedicines(prev => prev.filter(med => med.prescription_medicine_id !== medicineId));
      message.success("Medicine deleted successfully!");
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message || "Error deleting medicine");
      }
    } finally {
      setMedicineLoading(prev => ({ ...prev, [medicineId]: false }));
    }
  };

  const removeMedicineRow = async (index: number) => {
    const medicine = medicines[index];
    
    if (medicine.prescription_medicine_id) {
      // Show confirmation modal before deleting
      Modal.confirm({
        title: "Delete Medicine",
        content: "Are you sure you want to delete this medicine?",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          await deleteMedicine(medicine.prescription_medicine_id!);
        },
      });
    } else {
      // If it's a new medicine that hasn't been saved, just remove it from the state
      setMedicines(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleUpdate = async (values: any) => {
    setLoading(true);
    try {
      // Transform multi-value fields to always be arrays
      const payload = {
        ...values,
        lab: Array.isArray(values.lab) ? values.lab : values.lab ? [values.lab] : [],
        chief_complaints: Array.isArray(values.chief_complaints) ? values.chief_complaints : values.chief_complaints ? [values.chief_complaints] : [],
        preventive_advice: Array.isArray(values.preventive_advice) ? values.preventive_advice : values.preventive_advice ? [values.preventive_advice] : [],
        drug_allergies: Array.isArray(values.drug_allergies) ? values.drug_allergies : values.drug_allergies ? [values.drug_allergies] : [],
        instructions: Array.isArray(values.instructions) ? values.instructions : values.instructions ? [values.instructions] : [],
        isReady,
        follow_up: values.follow_up ? values.follow_up.toISOString() : null,
        vitals: values.vitals || prescription?.vitals || {
          temperature: '',
          systolicBP: '',
          diastolicBP: '',
          spo2: '',
          bmi: '',
          height: '',
          weight: '',
          haemoglobin:'',
          bloodSugar:'',
          pulse:''
        }
      };
      
      console.log('Sending payload to API:', payload); // Debug log
      
      // ✅ Step 1: Update Prescription
      const response = await fetch(
        `${MOBILE_API_BASE_URL}/api/prescriptions/${prescription?.prescription_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
  
      if (!response.ok) throw new Error("Failed to update prescription");
  
      // ✅ Step 2: Identify New Medicines and Create Them
      const newMedicines = medicines.filter((med) => !med.prescription_medicine_id);
      if (newMedicines.length > 0) {
        await createNewMedicines(newMedicines);
      }
  
      message.success("Prescription updated successfully!");
      router.push("/consultation-management");
    } catch (error) {
      if (error instanceof Error){
      message.error(error.message || "Error updating prescription.");
    } }finally {
      setLoading(false);
    }
  };
  
  // Function to download the prescription PDF
  const handleDownloadPDF = () => {
    if (!prescription?.prescription_id) {
      message.error("Prescription ID not found");
      return;
    }

    const url = `${ALL_API_OBJECT["download-prescription-pdf"]}/${prescription.prescription_id}`;
    console.log('Downloading PDF from:', url);
    
    // Show loading message
    const hideLoading = message.loading('Downloading prescription PDF...', 0);
    
    try {
      // Open the PDF in a new tab
      const newWindow = window.open(url, '_blank');
      
      // Check if the window was successfully opened
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        message.error('Pop-up blocked! Please allow pop-ups for this site.');
      }
      
      // Hide loading after a short delay
      setTimeout(() => {
        hideLoading();
      }, 1000);
    } catch (error) {
      hideLoading();
      console.error('Error downloading PDF:', error);
      message.error('Error downloading PDF. Please try again.');
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Edit Prescription</h2>
        {prescription?.prescription_id ? (
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={handleDownloadPDF}
            aria-label="Download Prescription PDF"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDownloadPDF();
              }
            }}
            style={{ fontSize: '16px', padding: '0 20px', height: '40px' }}
            className="flex items-center"
          >
            Download PDF
          </Button>
        ) : (
          <span>No PDF available yet. Save to generate a prescription.</span>
        )}
      </div>

      {prescription?.prescription_slip_image && (
  <div style={{ marginBottom: "20px", textAlign: "center" }}>
    <strong>Prescription Slip:</strong>
    <div style={{ marginTop: "10px", border: "1px solid #ddd", padding: "10px", borderRadius: "5px" }}>
      <img
        src={prescription.prescription_slip_image}
        alt="Prescription Slip"
        style={{ maxWidth: "100%", height: "auto", maxHeight: "400px", borderRadius: "5px" }}
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  </div>
  )}

      <Form form={form} layout="vertical" onFinish={handleUpdate} initialValues={{ 
        vitals: {
          temperature: '',
          systolicBP: '',
          diastolicBP: '',
          spo2: '',
          bmi: '',
          height: '',
          weight: '',
          haemoglobin:'',
          bloodSugar:'',
          pulse:''
        }
      }}>
        <Form.Item name="chief_complaints" label="Chief Complaint">
          {/* Multi-value input for chief complaints */}
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Enter chief complaints"
            aria-label="Chief Complaints"
            tabIndex={0}
            allowClear
          />
        </Form.Item>

        {/* <Form.Item name="other_complaints" label="Other Complaints">
          <Input.TextArea placeholder="Enter other complaints" rows={3} />
        </Form.Item> */}

        <Form.Item name="drug_allergies" label="Drug Allergies">
          {/* Multi-value input for drug allergies */}
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Mention if any drug allergies"
            aria-label="Drug Allergies"
            tabIndex={0}
            allowClear
          />
        </Form.Item>

        <Form.Item name="diagnose" label="Diagnosis">
          <Input.TextArea placeholder="Enter diagnosis" rows={3} />
        </Form.Item>

        <Form.Item name="lab" label="Lab Test">
          {/* Multi-value input for lab tests */}
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Enter lab names"
            aria-label="Lab Tests"
            tabIndex={0}
            allowClear
          />
        </Form.Item>

        {/* <Form.Item name="other_lab" label="Other Lab">
          <Input placeholder="Enter other lab name" />
        </Form.Item> */}

        <Form.Item name="instructions" label="Instructions">
          {/* Multi-value input for instructions */}
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Enter instructions"
            aria-label="Instructions"
            tabIndex={0}
            allowClear
          />
        </Form.Item>

        <Form.Item name="follow_up" label="Follow-up Date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        {/* <Form.Item name="preventive_advice" label="Preventive Advice">
          <Input.TextArea placeholder="Enter preventive advice" rows={3} />
        </Form.Item> */}
        {/* <Form.Item name="preventive_advice" label="Preventive Advice">
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Enter preventive advice"
            aria-label="Preventive Advice"
            tabIndex={0}
            allowClear
          />
        </Form.Item> */}

        {/* <Form.Item name="prescription_slip_text" label="Prescription Slip Text">
          <Input.TextArea placeholder="Enter prescription slip text" rows={3} />
        </Form.Item> */}

        <h3>Vitals</h3>

        {/** ✅ Vitals section */}
        <div style={{ padding: "15px", border: "1px solid #f0f0f0", borderRadius: "5px", marginBottom: "20px" }}>
          <Form.Item name={["vitals", "temperature"]} label="Temperature">
            <Input placeholder="Enter temperature" />
          </Form.Item>

          <Form.Item name={["vitals", "systolicBP"]} label="Systolic BP">
            <Input placeholder="Enter systolic BP" />
          </Form.Item>

          <Form.Item name={["vitals", "diastolicBP"]} label="Diastolic BP">
            <Input placeholder="Enter diastolic BP" />
          </Form.Item>

          <Form.Item name={["vitals", "spo2"]} label="SpO2">
            <Input placeholder="Enter SpO2 level" />
          </Form.Item>

          <Form.Item name={["vitals", "bmi"]} label="BMI">
            <Input placeholder="Enter BMI" />
          </Form.Item>

          <Form.Item name={["vitals", "height"]} label="Height">
            <Input placeholder="Enter Height" />
          </Form.Item>

          <Form.Item name={["vitals", "weight"]} label="Weight">
            <Input placeholder="Enter Weight" />
          </Form.Item>

          <Form.Item name={["vitals", "haemoglobin"]} label="haemoglobin">
            <Input placeholder="Enter Haemoglobin" />
          </Form.Item>

          <Form.Item name={["vitals", "bloodSugar"]} label="BloodSugar">
            <Input placeholder="Enter BloodSugar" />
          </Form.Item>

          <Form.Item name={["vitals", "pulse"]} label="pulse">
            <Input placeholder="Enter Pulse" />
          </Form.Item>
        </div>

        {/** ✅ Medicines Table */}
        <h3>Prescribed Medicines</h3>
        <Table
          columns={[
            {
              title: "Med Type",
              dataIndex: "medicine_type",
              render: (_, record, index) => (
                <Input
                  value={record.medicine_type}
                  onChange={(e) =>
                    updateMedicineRow(index, "medicine_type", e.target.value)
                  }
                  disabled={
                    medicineLoading[record.prescription_medicine_id || ""]
                  }
                />
              ),
            },
            {
              title: "Med Name",
              dataIndex: "medicine_name",
              render: (_, record, index) => (
                <Input 
                  value={record.medicine_name} 
                  onChange={(e) => updateMedicineRow(index, "medicine_name", e.target.value)}
                  disabled={medicineLoading[record.prescription_medicine_id || '']}
                />
              ),
            },
            {
              title: "Dosage",
              dataIndex: "dosage",
              render: (_, record, index) => (
                <Input 
                  value={record.dosage} 
                  onChange={(e) => updateMedicineRow(index, "dosage", e.target.value)}
                  disabled={medicineLoading[record.prescription_medicine_id || '']}
                />
              ),
            },
            {
              title: "Frequency",
              dataIndex: "frequency",
              render: (_, record, index) => (
                <Select 
                  mode="multiple" 
                  value={record.frequency} 
                  onChange={(value) => updateMedicineRow(index, "frequency", value)}
                  disabled={medicineLoading[record.prescription_medicine_id || '']}
                >
                  {["Morning", "Afternoon", "Evening", "Night", "SOS","STAT"].map((freq) => (
                    <Option key={freq} value={freq}>
                      {freq}
                    </Option>
                  ))}
                </Select>
              ),
            },
            {
              title: "Duration(In Days)",
              dataIndex: "duration",
              render: (_, record, index) => (
                <Input 
                  type="number" 
                  value={record.duration} 
                  onChange={(e) => updateMedicineRow(index, "duration", Number(e.target.value))}
                  disabled={medicineLoading[record.prescription_medicine_id || '']}
                />
              ),
            },
            {
              title: "Instructions",
              dataIndex: "instructions",
              render: (_, record, index) => (
                <Input 
                  value={record.instructions} 
                  onChange={(e) => updateMedicineRow(index, "instructions", e.target.value)}
                  disabled={medicineLoading[record.prescription_medicine_id || '']}
                />
              ),
            },
            { 
              title: "Action", 
              render: (_, record) => (
                <Space>
                  {record.prescription_medicine_id && changedMedicines[record.prescription_medicine_id] && (
                    <Button
                      type="primary"
                      onClick={() => handleSaveMedicineChanges(record)}
                      loading={medicineLoading[record.prescription_medicine_id]}
                      disabled={medicineLoading[record.prescription_medicine_id]}
                    >
                      Save Changes
                    </Button>
                  )}
                  <Button 
                    danger 
                    onClick={() => removeMedicineRow(medicines.findIndex(m => m === record))}
                    loading={medicineLoading[record.prescription_medicine_id || '']}
                    disabled={medicineLoading[record.prescription_medicine_id || '']}
                  >
                    Delete
                  </Button>
                </Space>
              ) 
            },
          ]}
          dataSource={medicines}
          rowKey="prescription_medicine_id"
        />
        <Button type="dashed" onClick={addMedicineRow}>➕ Add Medicine</Button>

        <Button type="primary" htmlType="submit">Update Prescription</Button>

        <Form.Item label="Mark as Ready">
          <Switch checked={isReady} onChange={handleIsReadyChange} />
        </Form.Item>

      </Form>
    </div>
  );
};

export default EditPrescriptionPage;
