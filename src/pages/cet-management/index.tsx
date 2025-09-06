import NotFoundPage from '@components/Common/NotFoundPage';
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from '@constants/AppConstant';
import CETMasterComponent from '@modules/CetManagement'
import React from 'react'
import usePermission from 'src/hook/usePermission';

const CetMasterPage = () => {
  const { canView, loading } = usePermission(pageNameArray[0]);

  return (
   canView ? <CETMasterComponent /> : <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} />
  )
}

export default CetMasterPage