import React from "react";
import ConsultationManagement from "@modules/ConsultationManagement"; // Import the module
import usePermission from "src/hook/usePermission";
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from "@constants/AppConstant";
import NotFoundPage from '@components/Common/NotFoundPage';

const ConsultationManagementPage = () => {
    const { canView, loading } = usePermission(pageNameArray[5]); // consultation_management is at index 5



    return canView ? 
        <ConsultationManagement /> : 
        <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} />;
};

export default ConsultationManagementPage;
