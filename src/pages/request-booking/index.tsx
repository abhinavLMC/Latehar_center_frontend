import React from 'react';
import RequestBookingModule from '@modules/RequestBooking';
import NotFoundPage from '@components/Common/NotFoundPage';
import { pageNameArray, NO_VIEW_PERMISSION_MSG } from '@constants/AppConstant';
import usePermission from 'src/hook/usePermission';

const RequestBookingPage: React.FC = () => {
  const { canView, loading } = usePermission(pageNameArray[0]); // Using index 4 for "request_booking"
  
  return canView ? 
    <RequestBookingModule /> : 
    <NotFoundPage status={403} message={NO_VIEW_PERMISSION_MSG} loading={loading} />;
};

export default RequestBookingPage; 