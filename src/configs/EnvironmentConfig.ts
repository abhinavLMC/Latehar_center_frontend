const BASE_URL= process.env.NEXT_PUBLIC_API_BASE_URL
const NEW_SERVER_BASE_URL = process.env.NEXT_PUBLIC_NEW_API_BASE_URL; // New server base URL
// localhost:3001

const development = {
  API_BASE_URL: BASE_URL || "http://localhost:3001/api",
  API_BASE_VERSION: 'v1',
  MOBILE_API_BASE_URL: NEW_SERVER_BASE_URL || "http://localhost:3000",
};
// dev prod : http://13.201.81.233:3002/api
const production = {
  API_BASE_URL: BASE_URL || "http://localhost:3001/api",
  API_BASE_VERSION: "v1",
  MOBILE_API_BASE_URL: NEW_SERVER_BASE_URL || "http://localhost:3000",
};

const env = (): {
  MOBILE_API_BASE_URL: any; API_BASE_URL: string; API_BASE_VERSION: string 
} => {
  switch (process.env.NEXT_PUBLIC_SERVER_ENVIRONMENT) {
    case "development":
      return development;
    default:
      return production;
  }
};

export default env();