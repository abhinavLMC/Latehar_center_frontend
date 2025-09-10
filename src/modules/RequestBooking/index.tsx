import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, Card, message, Space, Typography, Divider, Descriptions, List, Radio, Avatar } from 'antd';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { MOBILE_API_BASE_URL } from '@constants/ApiConstant';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { fetchCenterId, RequestPayload } from '@utils/centerIdHandler';

const { Text } = Typography;

interface DriverDetails {
  id: number;
  name: string;
  external_id: string;
  contactNumber: string;
  healthCardNumber?: string;
  gender?: string;
  blood_group?: string;
  localAddressDistrict?: string;
  localAddressState?: string;
}

const RequestBooking: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchingDriver, setSearchingDriver] = useState(false);
  const [driverDetails, setDriverDetails] = useState<DriverDetails | null>(null);
  const [driverList, setDriverList] = useState<DriverDetails[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const searchDriver = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      message.error('Please enter a valid 10-digit phone number');
      return;
    }

    setSearchingDriver(true);
    try {
      const response = await fetch(`${MOBILE_API_BASE_URL}/api/drivers/getUserData?phoneNumber=${phoneNumber}`);
      
      if (!response.ok) {
        throw new Error('Failed to find drivers');
      }

      const data = await response.json();
      if (data && Array.isArray(data) && data.length > 0) {
        setDriverList(data);
        setSelectedDriverId(null);
        setDriverDetails(null);
        message.success(`Found ${data.length} patient(s) with this phone number`);
      } else {
        message.error('No patients found with this phone number');
        setDriverList([]);
        setDriverDetails(null);
        setSelectedDriverId(null);
      }
    } catch (error) {
      console.error('Error searching for patients:', error);
      message.error('Failed to search for patients. Please try again.');
      setDriverList([]);
      setDriverDetails(null);
      setSelectedDriverId(null);
    } finally {
      setSearchingDriver(false);
    }
  };

  const onFinish = async (values: any) => {
    if (!selectedDriverId) {
      message.error('Please select a patient first');
      return;
    }

    setLoading(true);
    
    try {
      // First, fetch the center ID
      console.log('Fetching center ID...');
      const centerId = await fetchCenterId();
      
      if (!centerId) {
        message.error('Failed to fetch center ID. Please try again.');
        return;
      }

      console.log('Center ID fetched successfully:', centerId);

      // Prepare the payload with center ID
      const payload: RequestPayload = {
        request_id: uuidv4(),
        driver_id: selectedDriverId,
        centerID: centerId,
        status: false,
        preferred_time: `${values.preferred_time} hour${values.preferred_time > 1 ? 's' : ''}`,
      };

      console.log('Creating request with payload:', payload);

      // Create the request
      const response = await fetch(`${MOBILE_API_BASE_URL}/api/requests/createRequest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (response.ok) {
        message.success('Request booked successfully!', 3);
        form.resetFields();
        setDriverDetails(null);
        setDriverList([]);
        setSelectedDriverId(null);
        setPhoneNumber('');
      } else {
        message.error(data?.message || 'Failed to book request.', 3);
      }
    } catch (error) {
      message.error('Failed to book request. Please try again.', 3);
      console.error('Request error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric input and maximum 10 digits
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhoneNumber(value);
      if (driverList.length > 0 || driverDetails || selectedDriverId) {
        setDriverList([]);
        setDriverDetails(null);
        setSelectedDriverId(null);
      }
    }
  };

  const handleDriverSelection = (driverId: number) => {
    setSelectedDriverId(driverId);
    const selectedDriver = driverList.find(driver => driver.id === driverId);
    if (selectedDriver) {
      setDriverDetails(selectedDriver);
    }
  };

  return (
    <div className="container mt-4">
      <Card title="Book Health Checkup Request" className="max-w-md mx-auto">
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {/* Driver Search Section */}
          <div>
            <Text strong>Search Patient by Phone Number</Text>
            <Space.Compact style={{ width: '100%', marginTop: '8px' }}>
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
                onClick={searchDriver} 
                loading={searchingDriver}
              >
                Search
              </Button>
            </Space.Compact>
          </div>

          {/* Display Driver List for Selection */}
          {driverList.length > 0 && (
            <>
              <Divider orientation="left">Select Patient</Divider>
              <Radio.Group 
                value={selectedDriverId} 
                onChange={(e) => handleDriverSelection(e.target.value)}
                style={{ width: '100%' }}
              >
                <List
                  dataSource={driverList}
                  renderItem={(driver) => (
                    <List.Item>
                      <Radio value={driver.id} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Avatar icon={<UserOutlined />} style={{ marginRight: 12 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                              {driver.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              ID: {driver.external_id} | Phone: {driver.contactNumber}
                            </div>
                            {driver.healthCardNumber && (
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                Health Card: {driver.healthCardNumber}
                              </div>
                            )}
                            {driver.blood_group && (
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                Blood Group: {driver.blood_group}
                              </div>
                            )}
                            {(driver.localAddressDistrict || driver.localAddressState) && (
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                {driver.localAddressDistrict && `${driver.localAddressDistrict}, `}
                                {driver.localAddressState}
                              </div>
                            )}
                          </div>
                        </div>
                      </Radio>
                    </List.Item>
                  )}
                />
              </Radio.Group>
            </>
          )}


          {/* Booking Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              preferred_time: 1, // Default to 1 hour
            }}
          >
            <Form.Item
              label="Preferred Time (in hours)"
              name="preferred_time"
              rules={[
                { required: true, message: 'Please enter preferred time' },
                { type: 'number', min: 1, max: 24, message: 'Please enter a value between 1 and 24 hours' }
              ]}
            >
              <InputNumber
                min={1}
                max={24}
                className="w-full"
                placeholder="Enter number of hours"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                loading={loading}
                disabled={!selectedDriverId}
              >
                Book Request
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default RequestBooking; 