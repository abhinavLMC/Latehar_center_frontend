import NotFoundPage from "@components/Common/NotFoundPage";
import { NO_VIEW_PERMISSION_MSG, pageNameArray } from "@constants/AppConstant";
import ModifyCetManagement from "@modules/CetManagement/ModifyCetManagement"
import React from 'react'
import usePermission from "src/hook/usePermission";

const CETMasterEdit = () => {
  const { canModify, loading } = usePermission(pageNameArray[0]);
  return canModify ? (
    <ModifyCetManagement />
  ) : (
    <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} />
  );
}

export default CETMasterEdit