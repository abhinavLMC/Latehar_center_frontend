import NotFoundPage from "@components/Common/NotFoundPage";
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from "@constants/AppConstant";
import ModifyHealthCheckupManagement from "@modules/HealthCheckupManagement/ModifyHealthCheckupManagement"
import React from 'react'
import usePermission from "src/hook/usePermission";

const ModifyHealthCheckupManagementPage = () => {
  const { canModify, loading } = usePermission(pageNameArray[2]);
  return canModify ? <ModifyHealthCheckupManagement /> : <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} />
}

export default ModifyHealthCheckupManagementPage