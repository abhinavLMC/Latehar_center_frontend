import NotFoundPage from "@components/Common/NotFoundPage";
import { NO_VIEW_PERMISSION_MSG, pageNameArray } from "@constants/AppConstant";
import HealthCheckupManagement from "@modules/HealthCheckupManagement";
import React from 'react'
import usePermission from "src/hook/usePermission";

const HealthCheckupManagementPage = () => {
  const { canView, loading } = usePermission(pageNameArray[2]);
  return canView ? <HealthCheckupManagement /> : <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} />
}

export default HealthCheckupManagementPage