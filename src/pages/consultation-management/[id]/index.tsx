import React from "react";
import { useRouter } from "next/router";
import usePermission from "src/hook/usePermission";
import { pageNameArray } from "@constants/AppConstant";

const ConsultationDetailsPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const { canView, loading } = usePermission(pageNameArray[5]); // consultation_management

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!canView) {
        return <div>No permission to view this page.</div>;
    }

    if (!id || typeof id !== "string") {
        return <p>Loading consultation details...</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Consultation Details</h1>
            <p>Consultation ID: {id}</p>
            {/* Add consultation details component here when available */}
        </div>
    );
};

export default ConsultationDetailsPage; 