import { NextApiRequest, NextApiResponse } from 'next';
import { API_BASE_URL, API_VERSION } from '@constants/ApiConstant';
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

    console.log('Fetching center ID from:', `${API_BASE_URL}/${API_VERSION}/center/get-center-id`);
    
    const response = await axios.post(
      `${API_BASE_URL}/${API_VERSION}/center/get-center-id`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Cookie: `center_token=${token}`,
        },
      }
    );

    console.log('Center ID response:', response.data);
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Center ID API Error:', error);
    console.error('Request failed with status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    return res.status(error.response?.status || 500).json(
      error.response?.data || { message: 'Failed to fetch center ID' }
    );
  }
} 