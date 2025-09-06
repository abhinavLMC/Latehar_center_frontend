import NotFoundPage from '@components/Common/NotFoundPage';
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from '@constants/AppConstant';
import WorkforceManagement from "@modules/WorkforceManagement";
import React from 'react'
import usePermission from 'src/hook/usePermission';

const WorkforceManagementPage = () => {
  const { canView, loading } = usePermission(pageNameArray[1]);
  return (
    canView ? <WorkforceManagement /> : <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} />
  )
}

export default WorkforceManagementPage