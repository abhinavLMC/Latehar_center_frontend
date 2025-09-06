import { DatePicker } from "antd";
import { DatePickerProps } from "antd";
import React from "react";

interface CustomDatePickerProps {
  // Add any additional props you want to define here
}

const DatePickerWrapper: React.FC<CustomDatePickerProps & DatePickerProps> = (
  props
) => {
  return <DatePicker {...props} className="w-100"/>;
};

export default DatePickerWrapper;
