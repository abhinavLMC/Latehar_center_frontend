import NotFoundPage from '@components/Common/NotFoundPage';
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from '@constants/AppConstant';
import HealthCheckupReport from '@modules/HealthCheckupReport';
import React from 'react'
import usePermission from 'src/hook/usePermission';

const HealthCheckupReportPage = () => {
  const { canView, loading } = usePermission(pageNameArray[3]);
  return canView ? <HealthCheckupReport /> : <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} />
}

export default HealthCheckupReportPage