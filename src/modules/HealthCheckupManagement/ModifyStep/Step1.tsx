import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import EmptyContent from "@components/Common/Empty/EmptyContent";
import RenderDetailsComponent from "@components/Common/RenderDetailsComponent";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import ViewFileLink from "@components/Common/ViewDetailsModal/ViewFile";
import {
  FormItemWrapper,
  InputWrapper,
  ButtonWrapper,
  CardWrapper,
} from "@components/Wrapper"; // CardWrapper is added for health history
import { renderAllDetails } from "@utils/commonFunctions";
import { Row, Col, FormInstance, Form, Space, Divider, Input, Button, Radio, List, Avatar, message } from "antd";
import { startCase } from "lodash";
import React, { useEffect, useState } from "react";
import { useGetRequestHandler } from "src/hook/requestHandler";
import dayjs from "dayjs"; // Import dayjs for formatting dates
import { MOBILE_API_BASE_URL } from "@constants/ApiConstant";

interface propTypes {
  mainForm: FormInstance;
  setTabKey: (param: string) => void;
  getDetails: (obj: Record<string, string>) => void;
}

interface UserDetails {
  id: number;
  name: string;
  external_id: string;
  contactNumber: string;
  healthCardNumber?: string;
  gender?: string;
  blood_group?: string;
  localAddressDistrict?: string;
  localAddressState?: string;
  localAddress?: string;
  abhaNumber?: string;
  dateOfBirth?: string;
  age?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  idProofName?: string;
  idProof?: string;
  idProofNumber?: string;
  idProofDoc?: string;
  employeeId?: string;
}

const Step1 = ({ mainForm, setTabKey, getDetails }: propTypes) => {
  const { loading, data, fetchData, status } = useGetRequestHandler();
  const { loading: historyLoading, data: healthCheckupHistory, fetchData: fetchHistoryData } = useGetRequestHandler(); // Handler for health history

  const searchData = Form.useWatch("searchData", mainForm);
  const [details, setDetails] = useState<{ [k: string]: unknown } | null>(null);
  const [btnClicked, setBtnClicked] = useState(false);
  
  // New state for phone number search
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchingUser, setSearchingUser] = useState(false);
  const [userList, setUserList] = useState<UserDetails[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const centerNameMapping: { [key: string]: string } = {
    "48": "HSVK",
    "45": "KALINGANAGAR",
    "46": "MERAMANDALI",
    "47": "ROHTAK",
  };

  const searchHandler = () => {
    setBtnClicked(true);
    fetchData("/api/search-driver", { searchData });
  };

  // Phone number search functionality
  const searchUserByPhone = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      message.error('Please enter a valid 10-digit phone number');
      return;
    }

    setSearchingUser(true);
    try {
      const response = await fetch(`${MOBILE_API_BASE_URL}/api/drivers/getUserData?phoneNumber=${phoneNumber}`);
      
      const data = await response.json();
      
      if (!response.ok) {
        // Display the actual API error message
        message.error(data.message || 'Failed to find users');
        setUserList([]);
        setUserDetails(null);
        setSelectedUserId(null);
        return;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        setUserList(data);
        setSelectedUserId(null);
        setUserDetails(null);
        message.success(`Found ${data.length} user(s) with this phone number`);
      } else {
        message.error('No users found with this phone number');
        setUserList([]);
        setUserDetails(null);
        setSelectedUserId(null);
      }
    } catch (error) {
      console.error('Error searching for users:', error);
      message.error('Failed to search for users. Please try again.');
      setUserList([]);
      setUserDetails(null);
      setSelectedUserId(null);
    } finally {
      setSearchingUser(false);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric input and maximum 10 digits
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhoneNumber(value);
      if (userList.length > 0 || userDetails || selectedUserId) {
        setUserList([]);
        setUserDetails(null);
        setSelectedUserId(null);
      }
    }
  };

  const handleUserSelection = (userId: number) => {
    setSelectedUserId(userId);
    const selectedUser = userList.find(user => user.id === userId);
    if (selectedUser) {
      setUserDetails(selectedUser);
      // Transform and set form data
      const transformedData = {
        id: selectedUser.id.toString(),
        driverId: selectedUser.id.toString(),
        external_id: selectedUser.external_id,
        name: selectedUser.name,
        contactNumber: selectedUser.contactNumber,
        healthCardNumber: selectedUser.healthCardNumber || '',
        gender: selectedUser.gender || '',
        blood_group: selectedUser.blood_group || '',
        localAddressDistrict: selectedUser.localAddressDistrict || '',
        localAddressState: selectedUser.localAddressState || '',
        localAddress: selectedUser.localAddress || '',
        abhaNumber: selectedUser.abhaNumber || '',
        dateOfBirth: selectedUser.dateOfBirth || '',
        age: selectedUser.age || '',
        emergencyContactName: selectedUser.emergencyContactName || '',
        emergencyContactNumber: selectedUser.emergencyContactNumber || '',
        idProofName: selectedUser.idProofName || '',
        idProof: selectedUser.idProof || '',
        idProofNumber: selectedUser.idProofNumber || '',
        idProofDoc: selectedUser.idProofDoc || '',
        employeeId: selectedUser.employeeId || '',
      };
      getDetails && getDetails(transformedData);
      
      // Fetch health history for the selected user
      if (selectedUser.id) {
        fetchHistoryData("/api/health-checkup-history", { id: selectedUser.id });
      }
    }
  };

  useEffect(() => {
    if (status && data) {
      console.log('Search response data:', data);  // Logging search data response
      const { createdAt, updatedAt, ...restData } = data;
      setDetails(restData);
      getDetails && getDetails(restData);

      // Fetch health history using 'id' instead of 'patientId'
      const patientId = restData?.driverId || restData?.id;  // Fallback to 'id' if 'driverId' is null
      console.log('Patient ID:', patientId);  // Logging to check if patientId or id is available
      if (patientId) {
        fetchHistoryData("/api/health-checkup-history", { id: patientId });
      }
    } else {
      setDetails(null);
    }
  }, [status, data]);

  useEffect(() => {
    console.log("Health checkup history:", healthCheckupHistory);  // Add this line
  }, [healthCheckupHistory]);

  useEffect(() => {
    console.log("History loading:", historyLoading);  // Add this line
  }, [historyLoading]);

  // Transform field names to replace "driver" with "patient"
  const transformDetails = (data: any) => {
    if (!data) return data;
    const transformed = { ...data };
    
    // Replace field names containing "driver" with "patient"
    Object.keys(transformed).forEach(key => {
      if (key.toLowerCase().includes('driver')) {
        const newKey = key.replace(/driver/gi, 'patient');
        transformed[newKey] = transformed[key];
        delete transformed[key];
      }
    });
    
    return transformed;
  };

  const showDetails = details ? (
    <RenderDetailsComponent
      details={{ "LMC ID": details?.external_id, ...transformDetails(details) }}
      excludeItems={["createdBy", "external_id", "driverId", "patientId", "id"]}
    />
  ) : (
    <div className="border rounded-2 p-4">
      <EmptyContent onlyMessage="No user found" />
    </div>
  );

  // Display the previous health checkup history box
  const showHealthCheckupHistory = Array.isArray(healthCheckupHistory) && healthCheckupHistory.length > 0 ? (
    healthCheckupHistory?.map(
      (obj: { selected_package_list: any; selected_package_name: any; date_time: string; createdBy:string }, key: React.Key) => (
        <div key={key}>
          <Space className="history-row">
            <h3 className="fs-6">Package Name:</h3>
            <h3 className="fs-6">
              {startCase(
                obj?.selected_package_name?.flat().map((item: string) => startCase(item)).join(", ")
              )}
            </h3>
          </Space>
          <Space className="history-row">
            <b>Package List: </b>
            <p>{obj?.selected_package_list?.flat().map((item: string) => startCase(item)).join(", ")}</p>
          </Space>
          <Space className="history-row">
            <b>Date & Time : </b>
            <p>{obj?.date_time ? dayjs(obj.date_time).format("MMM D, YYYY h:mm A") : "N/A"}</p>
          </Space>
          <Space className="history-row">
            <b>Center Name: </b>
            <p>{centerNameMapping[obj?.createdBy] || obj?.createdBy}</p>
          </Space>
          {key !== 4 && <Divider />}
        </div>
      )
    )
  ) : (
    <EmptyContent onlyMessage="No previous health history found." />
  );

  return (
    <Row gutter={16}>
      {/* Phone Number Search Section */}
      <Col md={13} span={24}>
        <FormItemWrapper label={
          <span>
            Search by Phone Number 
            <span style={{ fontWeight: 'bold', margin: '0 8px' }}>|</span> 
            LMC ID 
            <span style={{ fontWeight: 'bold', margin: '0 8px' }}>|</span> 
            ID Proof
          </span>
        }>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="Enter 10-digit phone number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              maxLength={10}
              style={{ width: 'calc(100% - 100px)' }}
            />
            <Button 
              type="primary" 
              icon={<SearchOutlined />} 
              onClick={searchUserByPhone} 
              loading={searchingUser}
              style={{ width: '100px' }}
            >
              Search
            </Button>
          </Space.Compact>
        </FormItemWrapper>
      </Col>

      {/* Display User List for Selection */}
      {userList.length > 0 && (
        <Col md={13} span={24} className="mb-3">
          <CardWrapper>
            <div className="form-content">
              <h4 className="primary-color primary-bg-color-4">
                Select User
              </h4>
            </div>
            <Radio.Group 
              value={selectedUserId} 
              onChange={(e) => handleUserSelection(e.target.value)}
              style={{ width: '100%' }}
            >
              <List
                dataSource={userList}
                renderItem={(user) => (
                  <List.Item>
                    <Radio value={user.id} style={{ width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Avatar icon={<UserOutlined />} style={{ marginRight: 12 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                            {user.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            LMC ID: {user.external_id} | Phone: {user.contactNumber}
                          </div>
                          {user.healthCardNumber && (
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              Health Card: {user.healthCardNumber}
                            </div>
                          )}
                          {user.abhaNumber && (
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              ABHA: {user.abhaNumber}
                            </div>
                          )}
                          {user.blood_group && (
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              Blood Group: {user.blood_group}
                            </div>
                          )}
                          {user.gender && (
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              Gender: {user.gender}
                            </div>
                          )}
                          {(user.localAddressDistrict || user.localAddressState) && (
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              {user.localAddressDistrict && `${user.localAddressDistrict}, `}
                              {user.localAddressState}
                            </div>
                          )}
                        </div>
                      </div>
                    </Radio>
                  </List.Item>
                )}
              />
            </Radio.Group>
          </CardWrapper>
        </Col>
      )}

      {/* Display Selected User Details */}
      {userDetails && (
        <Col md={13} span={24} className="mb-3">
          <CardWrapper>
            <div className="form-content">
              <h4 className="primary-color primary-bg-color-4">
                Selected User Details
              </h4>
            </div>
            <RenderDetailsComponent
              details={{
                "LMC ID": userDetails.external_id || "--",
                "Driver Cetid": "--",
                "Driver Cetname": "--",
                "Name": userDetails.name || "--",
                "Health Card Number": userDetails.healthCardNumber || "--",
                "Abha Number": userDetails.abhaNumber || "--",
                "Date Of Birth Or Age": userDetails.dateOfBirth || userDetails.age || "--",
                "Gender": userDetails.gender || "--",
                "Photograph Of Driver": "--",
                "Local Address": userDetails.localAddress || "--",
                "Local Address District": userDetails.localAddressDistrict || "--",
                "Local Address State": userDetails.localAddressState || "--",
                "Contact Number": userDetails.contactNumber || "--",
                "Emergency Contact Name": userDetails.emergencyContactName || "--",
                "Emergency Contact Number": userDetails.emergencyContactNumber || "--",
                "Id Proof Name": userDetails.idProofName || "--",
                "Id Proof": userDetails.idProof || "--",
                "Id Proof Number": userDetails.idProofNumber || "--",
                "Id Proof Doc": userDetails.idProofDoc || "--",
                "Blood Group": userDetails.blood_group || "--",
                "Employee Id": userDetails.employeeId || "--",
              }}
            />
          </CardWrapper>
        </Col>
      )}

      {/* Display Previous Health Checkup History after user selection */}
      {userDetails && (
        <Col md={13} span={24} className="mb-3">
          {historyLoading ? (
            <TableContentLoaderWithProps rowHeight={70} columnWidth={[25, "2", 73]} rowCounts={10} />
          ) : (
            <CardWrapper>
              <div className="form-content">
                {healthCheckupHistory?.length > 0 && (
                  <h4 className="primary-color primary-bg-color-4">
                    Previous Health Checkup History
                  </h4>
                )}
              </div>
              {showHealthCheckupHistory}
            </CardWrapper>
          )}
        </Col>
      )}

      {/* Legacy Search Section (keeping for backward compatibility) */}
      <Col md={13} span={24}>
        {/* <FormItemWrapper name="searchData" label="Or search by LMC ID or ID Proof">
          <InputWrapper
            addonAfter={
              <span
                className="text-primary cursor-pointer"
                onClick={searchHandler}
              >
                <SearchOutlined />
              </span>
            }
          />
        </FormItemWrapper> */}
      </Col>

      {searchData && btnClicked && (
        <Col md={13} span={24} className="mb-3">
          {loading ? (
            <TableContentLoaderWithProps
              rowHeight={70}
              columnWidth={[25, "2", 73]}
              rowCounts={10}
            />
          ) : (
            showDetails
          )}
        </Col>
      )}

      <Col md={13} span={24}>
        <FormItemWrapper name="">
          <ButtonWrapper
            disabled={!userDetails && !data}
            type="primary"
            onClick={() => setTabKey("step_2")}
          >
            Next
          </ButtonWrapper>
        </FormItemWrapper>
      </Col>
    </Row>
  );
};

export default Step1;
