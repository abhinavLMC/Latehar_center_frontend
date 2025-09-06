import env from "@configs/EnvironmentConfig";

export const API_BASE_URL = env.API_BASE_URL;
export const API_VERSION = env.API_BASE_VERSION;
export const MOBILE_API_BASE_URL = env.MOBILE_API_BASE_URL;


export const API_COMMON_CENTER_URL = `${API_BASE_URL}/${API_VERSION}/center`
export const API_COMMON_ADMIN_URL = `${API_BASE_URL}/${API_VERSION}/admin`;


export const ALL_API_OBJECT: { [key: string]: string | ((phoneNumber: string) => string)} = {
  login: `${API_COMMON_CENTER_URL}/login`,

  // for CET Management
  "cet-list": `${API_COMMON_CENTER_URL}/view/CET`,
  "cet-details": `${API_COMMON_CENTER_URL}/CET/details`,
  "cet-update": `${API_COMMON_CENTER_URL}/CET/updateCET`,
  "cet-create": `${API_COMMON_CENTER_URL}/create/CET`,

  // for Workforce Management
  "driver-list": `${API_COMMON_CENTER_URL}/driver/list`,
  "driver-details": `${API_COMMON_CENTER_URL}/driver/details`,
  "driver-update": `${API_COMMON_CENTER_URL}/driver/update`,
  "driver-create": `${API_COMMON_CENTER_URL}/driver/create`,
  "update-driver-status": `${API_COMMON_CENTER_URL}/driver/status`,

  // for Workforce Family History
  "driver-family-list": `${API_COMMON_CENTER_URL}/driver/family/history/list`,
  "driver-family-create": `${API_COMMON_CENTER_URL}/driver/family/history/create`,
  "driver-family-update": `${API_COMMON_CENTER_URL}/driver/family/history/update`,
  "driver-family-details": `${API_COMMON_CENTER_URL}/driver/family/history/details`,

  // for Workforce Family
  "driver-personal-list": `${API_COMMON_CENTER_URL}/driver/personal/history/list`,
  "driver-personal-create": `${API_COMMON_CENTER_URL}/driver/personal/history/create`,
  "driver-personal-update": `${API_COMMON_CENTER_URL}/driver/personal/history/update`,
  "driver-personal-details": `${API_COMMON_CENTER_URL}/driver/personal/history/details`,

  // Health Checkup Management
  "search-driver": `${API_COMMON_CENTER_URL}/driver/search/bynumber`,
  "send-otp": `${API_COMMON_CENTER_URL}/driver/send/otp`,
  "verify-otp": `${API_COMMON_CENTER_URL}/driver/verify/otp`,
  "package-unit-list": `${API_COMMON_CENTER_URL}/driver/package/list/wise/unit`,
  "create-health-checkup-1": `${API_COMMON_CENTER_URL}/driver/create/health-checkup/step-1`,
  "create-health-checkup-2": `${API_COMMON_CENTER_URL}/driver/create/health-checkup/step-2`,
  "view-driver-health-checkup": `${API_COMMON_CENTER_URL}/driver/view/health-checkup`,
  "details-driver-health-checkup": `${API_COMMON_CENTER_URL}/driver/health-checkup/details`,
  "update-driver-health-checkup": `${API_COMMON_CENTER_URL}/driver/update/health-checkup`,
  "driver-packages": `${API_COMMON_CENTER_URL}/driver/package/list`,
  "upload-signature": `${API_COMMON_CENTER_URL}/driver/upload/signature`,
  "driver-doctor-list": `${API_COMMON_CENTER_URL}/driver/doctor/list`,
  "workforce-type-list": `${API_COMMON_CENTER_URL}/driver/view/Workforce/type`,

  // Health Checkup Report
  "health-checkup-report": `${API_COMMON_CENTER_URL}/driver/health-report`,
  "health-checkup-download": `${API_COMMON_CENTER_URL}/driver/health-checkup/download`,
  "health-report-send-whatsapp": `${API_COMMON_CENTER_URL}/driver/send/otp/whatsapp`,
  "health-checkup-history": `${API_COMMON_CENTER_URL}/driver/health-checkup/history`,

  // all test related
  "temperature-view": `${API_COMMON_ADMIN_URL}/view/temperature`,
  "spo2-view": `${API_COMMON_ADMIN_URL}/view/spo2`,
  "random-blood-sugar-view": `${API_COMMON_ADMIN_URL}/view/random-blood-sugar`,
  "pulse-view": `${API_COMMON_ADMIN_URL}/view/pulse`,
  "pft-view": `${API_COMMON_ADMIN_URL}/view/pft`,
  "hearing-view": `${API_COMMON_ADMIN_URL}/view/hearing`,
  "haemoglobin-view": `${API_COMMON_ADMIN_URL}/view/haemoglobin`,
  "cretenine-view": `${API_COMMON_ADMIN_URL}/view/cretenine`,
  "cholesterol-view": `${API_COMMON_ADMIN_URL}/view/cholesterol`,
  "bmi-view": `${API_COMMON_ADMIN_URL}/view/bmi`,
  "blood-pressure-view": `${API_COMMON_ADMIN_URL}/view/blood-pressure`,
  "alchol-view": `${API_COMMON_ADMIN_URL}/view/alchol`,
  "hiv-view": `${API_COMMON_ADMIN_URL}/view/hiv`,
  "eye-view": `${API_COMMON_ADMIN_URL}/view/eye`,
  "ecg-view": `${API_COMMON_ADMIN_URL}/view/ecg`,
  "blood-group-view": `${API_COMMON_ADMIN_URL}/view/blood-group`,

  // File Upload API
  "upload-file": `${API_COMMON_CENTER_URL}/upload/file`,

  // ABHA APIs
  "getDriverDetails": (phoneNumber: string) => 
    `${MOBILE_API_BASE_URL}/drivers/getUserData?phoneNumber=${phoneNumber}`,
  
  "searchWorkforce": `${API_COMMON_CENTER_URL}/driver/search`,

  // Center ID API
  "get-center-id": `${API_COMMON_CENTER_URL}/get-center-id`,

  // for Request Booking
  "requests/createRequest": "/api/requests/createRequest",
  "center/getCenterId": "/api/center/getCenterId",

  // for Consultation Management
  "consultation-list": `${MOBILE_API_BASE_URL}/api/consultations/list`,
  "download-prescription-pdf": `${MOBILE_API_BASE_URL}/api/prescriptions/pdf`,
};
