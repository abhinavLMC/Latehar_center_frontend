import { NextApiRequest, NextApiResponse } from 'next';
import { MOBILE_API_BASE_URL } from '@constants/ApiConstant';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.cookies?.center_token || '';
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication token not found' });
    }

    // Validate required fields in the request body
    const { driver_id, centerID, request_id, status, preferred_time } = req.body;
    
    if (!driver_id || !centerID || !request_id) {
      return res.status(400).json({ 
        message: 'Missing required fields: driver_id, centerID, and request_id are required' 
      });
    }

    console.log('Request body:', req.body);
    console.log('Endpoint:', `${MOBILE_API_BASE_URL}/api/v1/center/driver/request/create`);
    
    const response = await axios.post(
      `${MOBILE_API_BASE_URL}/api/v1/center/driver/request/create`,
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Cookie: `center_token=${token}`,
        },
      }
    );

    console.log('Response:', response.data);
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('API Error:', error);
    console.error('Request failed with status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    return res.status(error.response?.status || 500).json(error.response?.data || { message: 'Internal server error' });
  }
} 