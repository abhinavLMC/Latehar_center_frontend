import NotFoundPage from '@components/Common/NotFoundPage';
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from '@constants/AppConstant';
import ModifyWorkForceManagement from '@modules/WorkforceManagement/ModifyWorkforceManagement'
import React from 'react'
import usePermission from 'src/hook/usePermission';

const ModifyWorkForceManagementPage = () => {
  const { canModify, loading } = usePermission(pageNameArray[1]);
  return canModify ? (
    <ModifyWorkForceManagement />
  ) : (
    <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} />
  );
}

export default ModifyWorkForceManagementPage