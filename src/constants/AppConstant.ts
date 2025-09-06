export const MAX_FILE_UPLOAD_COUNT = 5;
export const MAX_FILE_UPLOAD_SIZE = 20;

export const LOGIN_URL_ROUTE = "/auth/login";
export const CET_MANAGEMENT = "/cet-management";
export const WORKFORCE_MANAGEMENT = "/workforce-management";
export const HEALTH_CHECKUP_MANAGEMENT = "/health-checkup-management";
export const HEALTH_CHECKUP_REPORT = "/health-checkup-report";
export const CONSULTATION_MANAGEMENT = "/consultation-management";
export const HOME_PAGE_ROUTE = WORKFORCE_MANAGEMENT;
export const EMPTY_PLACEHOLDER = "--";
export const REQUEST_BOOKING = "/request-booking";
export const CONSULTATION_BOOKING_ROUTE = "/consultation-booking";
export const JOIN_VIDEO_CALL_ROUTE = "/consultation-management/JoinCall";
export const PRESCRIPTION_MANAGEMENT_ROUTE = "/consultation-management/edit-prescription";

export const ALL_ROUTE = {
  HOME_PAGE_ROUTE,
  LOGIN_URL_ROUTE,
  CET_MANAGEMENT,
  WORKFORCE_MANAGEMENT,
  HEALTH_CHECKUP_MANAGEMENT,
  HEALTH_CHECKUP_REPORT,
  REQUEST_BOOKING,
  CONSULTATION_MANAGEMENT
};

export const pageNameArray = [
  "cet_management",
  "driver_management",
  "health_checkup",
  "health_report",
  "request_booking",
  "consultation_management"
];

export const REQUIRED_MESSAGE = "This field is required";
export const REQUIRED_MESSAGE_SHORT = "Required field";
export const INVALID_INPUT_MSG = "Please enter valid input";

export const LOCAL_FORAGE_PERMISSION_KEY = "permissions";
export const NO_VIEW_PERMISSION_MSG = "No permission to view this page.";
export const EXTERNAL_ID = 'external_id'