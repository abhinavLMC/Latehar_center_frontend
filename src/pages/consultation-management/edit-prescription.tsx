import React from "react";
import { useRouter } from "next/router";
import EditPrescriptionPage from "@modules/ConsultationManagement/components/EditPrescriptionPage";

const EditPrescription: React.FC = () => {
  const router = useRouter();
  const { consultation_id } = router.query;

  // Ensure consultation_id is available before rendering the component
  if (!consultation_id || typeof consultation_id !== "string") {
    return <p>Loading...</p>;
  }

  return <EditPrescriptionPage consultationId={consultation_id} />;
};

export default EditPrescription;
