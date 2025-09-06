import React, { useState } from 'react';
import { CardWrapper } from '@components/Wrapper';
import DynamicPageLayout from '@components/DynamicPageLayout';

import env from '@configs/EnvironmentConfig'; // Import environment config
const { MOBILE_API_BASE_URL } = env; // Access the MOBILE_API_BASE_URL

interface DriverData {
  name: string;
  healthCardNumber: string;
  dateOfBirthOrAge: string;
  gender: string;
  blood_group: string;
  contactNumber: string;
  localAddressDistrict?: string; // Optional fields
  localAddressState?: string;
  idProof?: string;
  idProof_number?: string;
  id: number;
}
const ABHAPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  // const [driverData, setDriverData] = useState(null);
  const [aadharNumber, setAadharNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [abhaDetails, setAbhaDetails] = useState<any>(null);
  const [abhaImage, setAbhaImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [driverData, setDriverData] = useState<DriverData | null>(null); 

  const BASE_URL = MOBILE_API_BASE_URL;

  const validatePhoneNumber = (number: string) => /^\d{10}$/.test(number);
  const validateAadharNumber = (number: string) => /^\d{12}$/.test(number);

  

  // Handle Driver Search
  const handleSearch = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setDriverData(null);
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/drivers/getUserData?phoneNumber=${phoneNumber}`);
      if (!response.ok) throw new Error('Driver not found');
      const data = await response.json();
      setDriverData(data);
    } catch (err) {
      setError('Driver not linked. You can still proceed to create an ABHA card.');
    } finally {
      setLoading(false);
    }
  };

  // Handle ABHA Card Creation (Send OTP)
  const handleCreateABHA = async () => {
    if (!validateAadharNumber(aadharNumber)) {
      setError('Please enter a valid 12-digit Aadhaar card number.');
      return;
    }
    setError('');
    setOtpSent(false);
    setLoading(true);

    try {
      const payload = { aadhaar: aadharNumber, phoneNumber };
      const response = await fetch(`${BASE_URL}/abdm/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to send OTP. Please try again.');
      setOtpSent(true);
      alert('OTP sent successfully! Please check your phone.');
    } catch (err:any) {
      setError(err.message || 'An error occurred while creating the ABHA card.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Verification
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const payload = { otp, phoneNumber };
      const response = await fetch(`${BASE_URL}/abdm/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to verify OTP. Please try again.');
      const data = await response.json();
      setAbhaDetails(data);
      
      // Automatically update the ABHA details in the database if a driver is found
      if (driverData && driverData.id) {
      const updatePayload = {
        driverId: driverData.id, // ID of the driver found during search
        abhaNumber: data.ABHANumber,
        abhaDetails : data 
      };

      await fetch(`${BASE_URL}/api/drivers/update-abha-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });
    }

      alert('OTP verified successfully! ABHA number created.');
    } catch (err:any) {
      setError(err.message || 'An error occurred while verifying the OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Handle ABHA Card Download
  const handleDownloadABHA = async () => {
    try {
      const response = await fetch(`${BASE_URL}/abdm/download-card?phoneNumber=${encodeURIComponent(phoneNumber)}`, {
        method: 'GET',
      });
      if (!response.ok) throw new Error('Failed to download ABHA card.');
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setAbhaImage(imageUrl);

      // Trigger download
      const link = document.createElement('a');
      link.href = imageUrl;
      link.setAttribute('download', 'ABHA_Card.png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err:any) {
      setError(err.message || 'An error occurred while downloading the ABHA card.');
    }
  };

  return (
    <CardWrapper>
      <DynamicPageLayout
        MainComp={
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>ABHA Driver Search</h2>

            {/* Driver Search */}
            <div>
              <input
                type="text"
                placeholder="Enter driver's mobile number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{ padding: '10px', width: '300px', marginBottom: '10px' }}
              />
              <button onClick={handleSearch} disabled={loading} style={{ padding: '10px 20px', marginLeft: '10px' }}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {/* Display Driver Details */}
            {driverData && (
              <div style={{ marginTop: '20px', textAlign: 'left' }}>
                <h3>Driver Information</h3>
                <p><strong>Name:</strong> {driverData.name || 'N/A'}</p>
                <p><strong>Health Card Number:</strong> {driverData.healthCardNumber || 'N/A'}</p>
                <p><strong>Date of Birth/Age:</strong> {driverData.dateOfBirthOrAge || 'N/A'}</p>
                <p><strong>Gender:</strong> {driverData.gender || 'N/A'}</p>
                <p><strong>Blood Group:</strong> {driverData.blood_group || 'N/A'}</p>
                <p><strong>Contact Number:</strong> {driverData.contactNumber || 'N/A'}</p>
                <p>
                  <strong>Local Address:</strong> 
                  {driverData.localAddressDistrict ? `${driverData.localAddressDistrict}, ` : ''}
                  {driverData.localAddressState || 'N/A'}
                </p>
                <p><strong>ID Proof:</strong> {driverData.idProof || 'N/A'}</p>
                <p><strong>ID Proof Number:</strong> {driverData.idProof_number || 'N/A'}</p>
              </div>
            )}

            {/* Create ABHA */}
            <div style={{ marginTop: '20px' }}>
              <h3>Create ABHA Card</h3>
              <input
                type="text"
                placeholder="Enter Aadhaar Number"
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
                style={{ padding: '10px', width: '300px', marginBottom: '10px' }}
              />
              <button onClick={handleCreateABHA} disabled={loading} style={{ padding: '10px 20px', marginLeft: '10px' }}>
                {loading ? 'Processing...' : 'Create ABHA Card'}
              </button>
            </div>

            {/* Verify OTP */}
            {otpSent && (
              <div style={{ marginTop: '20px' }}>
                <h3>Verify OTP</h3>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{ padding: '10px', width: '300px', marginBottom: '10px' }}
                />
                <button onClick={handleVerifyOTP} disabled={loading} style={{ padding: '10px 20px', marginLeft: '10px' }}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            )}

            {/* Display ABHA Details */}
            {abhaDetails && (
              <div style={{ marginTop: '20px', textAlign: 'left' }}>
                <h3>ABHA Details</h3>
                <p><strong>ABHA Number:</strong> {abhaDetails.ABHANumber}</p>
                <p><strong>PHR Address:</strong> {abhaDetails.phrAddress}</p>
                <button onClick={handleDownloadABHA} style={{ padding: '10px 20px', marginTop: '10px', cursor: 'pointer' }}>
                  Download ABHA Card
                </button>
              </div>
            )}

            {/* Display ABHA Card Image */}
            {abhaImage && (
              <div style={{ marginTop: '20px' }}>
                <h3>ABHA Card</h3>
                <img src={abhaImage} alt="ABHA Card" style={{ width: '300px', border: '1px solid #ccc' }} />
              </div>
            )}
          </div>
        }
      />
    </CardWrapper>
  );
};

export default ABHAPage;
