export interface DriverDetailsType {
  DRIVERMASTERPERSONAL: any;
  blood_group: string;
  external_id: string;
  transpoter: string;
  vehicle_no: string;
  uniqueId: string;
  date_time: string;
  name: string;
  healthCardNumber: string;
  dateOfBirthOrAge: string;
  contactNumber: string;
  abhaNumber:string;
}

export interface DoctorDetailsType {
  id: string;
  external_id: string;
  user_id: number;
  registration_number: string;
  qualification: string;
  signature: string;
  contact_number: string;
  User: {
    id: string;
    username: string;
    status: boolean;
    phone: string;
  };
}

export interface ReportType {
  packageMetaData: {
    getPackageData: {
      package_name: string;
    }[];
  };
  centerMetaData: {
    getCenterUserData: {
      agency_spoc_contact_number: string;
      project_name: string;
      project_address: string;
      project_district: string;
      project_state: string;
    };
    signature: string;
  };
  drivers: {
    CETMANAGEMENT: any;
    driver_id: string;
    vehicle_no: string;
    uniqueId: string;
    transpoter: string;
    date_time: any;
    doctor: DoctorDetailsType;
    driver: DriverDetailsType;
  };
  metaData: any;
}
