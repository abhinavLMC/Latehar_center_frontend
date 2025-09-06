import { getUnitDataWithKey } from "@utils/commonFunctions";
import { useEffect, useState } from "react";
import useHealthData from "./getHealthData";
import { Form } from "antd";

const useSetFieldData = (
  form: any,
  label: string,
  fieldName: string | string[],
  data: any,
  keyName?: string
) => {
  const { getHealthStatus, getEyeStatus } = useHealthData();
  const [result, setResult] = useState<any>(null);

  const field =
    fieldName && Array.isArray(fieldName)
      ? ["selected_test"].concat(fieldName)
      : ["selected_test"].concat([fieldName]);
  const changedValue = Form.useWatch(field, form);

  const warning_remark_1 = "Consultation Recommended";
  const warning_remark_2 =
    "Counselling for Lifestyle Changes/Consultation Recommended";
  const warning_remark_3 = "Take rest & Recheck/ Cosultation";
  const warning_remark_4 = "Trail Lens test Recommeded";
  const warning_remark_5 = "Detailed AR test recommended";
  const warning_remark_6 = "Traffic light knowledge required";
  const warning_remark_7 = "Moderate Hearning Issues";

  const danger_remark_1 = "Consultation Recommended";
  const danger_remark_2 = "Mandatory Corrective Lens Recommended";
  const danger_remark_3 = "Unfit/ Consultation Recommended";
  const danger_remark_4 = "Unfit without Hearning aid";

  // dont delete or manupulate this array
  const eyeTest = [
    "cylindrical_left_eye_unit",
    "cylindrical_right_eye_unit",
    "spherical_left_eye_unit",
    "spherical_right_eye_unit",
  ];

  const successMsg = (key: string) => {
    if (!eyeTest.includes(key)) {
      return "PASS";
    }
  };

  const warningMsg = (key: string) => {
    const testCategory1 = ["temperature_unit", "spo2_unit", "romberg_unit"];
    const testCategory2 = [
      "random_blood_sugar_unit",
      "haemoglobin_unit",
      "bmi_unit",
      "ecg_unit",
    ];
    const testCategory3 = [
      "pulse_unit",
      "pulmonary_function_test_unit",
      "diastolic_bp_unit",
      "systolic_bp_unit",
    ];
    const testCategory4 = eyeTest;
    const testCategory5 = ["vision_unit"];
    const testCategory6 = ["colour_blindness_unit"];
    const testCategory7 = ["alchol_test_unit", "hiv_unit"];

    if (testCategory1.includes(key)) {
      return warning_remark_1;
    } else if (testCategory2.includes(key)) {
      return warning_remark_2;
    } else if (testCategory3.includes(key)) {
      return warning_remark_3;
    } else if (testCategory4.includes(key)) {
      return warning_remark_4;
    } else if (testCategory5.includes(key)) {
      return warning_remark_5;
    } else if (testCategory6.includes(key)) {
      return warning_remark_6;
    } else if (!testCategory7?.includes(key)) {
      return warning_remark_7;
    }
  };

  const dangerMsg = (key: string) => {
    const testCategory1 = [
      "temperature_unit",
      "spo2_unit",
      "random_blood_sugar_unit",
      "haemoglobin_unit",
      "bmi_unit",
      "ecg_unit",
      "pulse_unit",
      "pulmonary_function_test_unit",
      "diastolic_bp_unit",
      "systolic_bp_unit",
    ];
    const testCategory2 = [...eyeTest, "vision_unit"];
    const testCategory3 = ["alchol_test_unit", "hiv_unit"];
    const testCategory4 = ["hearing_unit"]
    if (testCategory1.includes(key)) {
      return danger_remark_1;
    } else if (testCategory2.includes(key)) {
      return danger_remark_2;
    } else if (testCategory3.includes(key)) {
      return danger_remark_3;
    } else if (testCategory4.includes(key)) {
      return danger_remark_4;
    }
  };

  const testMessage = (result: { key: string; status: string }) => {
    switch (result.status) {
      case "success":
        return successMsg(result?.key);
      case "warning":
        return warningMsg(result?.key);
      case "danger":
        return dangerMsg(result?.key);
    }
  };

  useEffect(() => {
    if (!!data) {
      const finalObj = {
        label,
        key: fieldName,
        ...form.getFieldValue(field), // including value and other form fields value
        // ...changedValue,
        ...getUnitDataWithKey(data, keyName), // it will add standard_value, within_device_min, units etc
      };
      setResult(finalObj);

      const testName = Array.isArray(fieldName) ? fieldName[1] : fieldName;

      // eye test data
      const eyeData = eyeTest?.includes(testName) ? getEyeStatus(finalObj as any) : {};
      // excluding eye data
      const withoutEyeData = !eyeTest?.includes(testName) ? getHealthStatus(finalObj as any) : {};

      const allData: any = {
        ...eyeData,
        ...withoutEyeData,
      };

      const result = { ...allData, remark: testMessage(allData) };
      // set field with finalObj
      form.setFieldValue(field, result);
    }
  }, [data, changedValue]);

  return result;
};

export default useSetFieldData;
