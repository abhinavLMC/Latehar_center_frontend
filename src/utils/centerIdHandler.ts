/**
 * Utility function to fetch center ID from the API
 * 
 * @returns Promise<string | null> - Returns center ID if successful, null if failed
 */
export const fetchCenterId = async (): Promise<string | null> => {
  try {
    const response = await fetch('/api/center/getCenterId', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch center ID:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    console.log('Center ID API response:', data);
    
    // Extract center ID from the nested response structure
    // Response format: {status: true, code: 200, data: {center_id: "45"}, message: "..."}
    const centerId = data?.data?.center_id;
    
    if (!centerId) {
      console.error('Center ID not found in response:', data);
      return null;
    }

    console.log('Extracted center ID:', centerId);
    return centerId;
  } catch (error) {
    console.error('Error fetching center ID:', error);
    return null;
  }
};

/**
 * Interface for request payload with center ID
 */
export interface RequestPayload {
  request_id: string;
  driver_id: number;
  centerID: string;
  status: boolean;
  preferred_time: string;
} 