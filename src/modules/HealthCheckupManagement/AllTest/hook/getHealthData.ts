const useHealthData = () => {
  interface ObjectTypes {
    doc: string;
    label: string;
    key: string;
    standard_value_min?: string;
    standard_value_max?: string;
    within_deviation_value_min_below?: string;
    within_deviation_value_max_below?: string;
    within_deviation_value_min?: string;
    within_deviation_value_max?: string;
    out_of_range_below?: string;
    out_of_range?: string;
    units?: string;
    value: string;
    height?: string;
    weight?: string;
    option_1?: string;
    option_2?: string;
    option_3?: string;
    option_one?: string;
    option_two?: string;
  }

  function extraPayload(obj: ObjectTypes) {
    const fieldName = Array.isArray(obj?.key) ? obj?.key[1] : obj?.key;
    switch (fieldName) {
      case "bmi_unit":
        return {
          height: obj?.height ? Number(obj.height) : null,
          weight: obj?.weight ? Number(obj?.weight) : null,
        };
      case "cylindrical_left_eye_unit":
      case "cylindrical_right_eye_unit":
      case "spherical_left_eye_unit":
      case "spherical_right_eye_unit":
        return {
          units: "D",
        };
      case "ecg_unit":
        return {
          doc: obj?.doc,
          standard_value: obj?.option_1 || obj?.option_one,
        };
      case "vision_unit":
      case "romberg_unit":
      case "hearing_unit":
      case "colour_blindness_unit":
        return {
          standard_value: obj?.option_1 || obj?.option_one,
        };
    }
  }

  function getHealthStatus(obj: ObjectTypes) {
    const { value, units, label, key } = obj;

    // Convert value to number if it's a valid number
    const unitValue = !isNaN(value as any) ? Number(value) : value;

    // Convert properties to numbers if they are not null
    const sdMin =
      obj?.standard_value_min != null ? Number(obj?.standard_value_min) : null;
    const sdMax =
      obj?.standard_value_max != null ? Number(obj?.standard_value_max) : null;

    const belowSdMin =
      obj?.within_deviation_value_min_below != null
        ? Number(obj?.within_deviation_value_min_below)
        : null;
    const belowSdMax =
      obj?.within_deviation_value_max_below != null
        ? Number(obj?.within_deviation_value_max_below)
        : null;

    const aboveSdMin =
      obj?.within_deviation_value_min != null
        ? Number(obj?.within_deviation_value_min)
        : null;
    const aboveSdMax =
      obj?.within_deviation_value_max != null
        ? Number(obj?.within_deviation_value_max)
        : null;

    const outRangeMin =
      obj?.out_of_range_below != null ? Number(obj?.out_of_range_below) : null;
    const outRangeMax =
      obj?.out_of_range != null ? Number(obj?.out_of_range) : null;

    const keyName = Array.isArray(key) ? key[1] : key;
    const result = {
      label,
      key: keyName,
      value,
      ...(typeof unitValue !== "string" && {
        standard_value: [sdMin, sdMax].filter((item) => item != null),
        units,
      }),
      ...extraPayload(obj),
    };

    if (!unitValue) {
      return { ...result, status: null };
    }

    if (unitValue != null && typeof unitValue !== "string") {
      if (outRangeMin != null && unitValue <= outRangeMin) {
        return { ...result, status: "danger" };
      } else if (outRangeMax != null && unitValue >= outRangeMax) {
        return { ...result, status: "danger" };
      } else if (
        (belowSdMin != null &&
          belowSdMax != null &&
          unitValue >= belowSdMin &&
          unitValue <= belowSdMax) ||
        (aboveSdMin != null &&
          aboveSdMax != null &&
          unitValue >= aboveSdMin &&
          unitValue <= aboveSdMax)
      ) {
        return { ...result, status: "warning" };
      } else if (
        (sdMin != null &&
          sdMax != null &&
          unitValue >= sdMin &&
          unitValue <= sdMax) ||
        (sdMin != null && unitValue === sdMin) ||
        (sdMax != null && unitValue === sdMax)
      ) {
        return { ...result, status: "success" };
      } else if (sdMin != null && sdMax == null && unitValue >= sdMin) {
        return { ...result, status: "success" };
      } else if (sdMax != null && sdMin == null && unitValue <= sdMax) {
        return { ...result, status: "success" };
      } else {
        return { ...result, status: "unknown" }; // For any unexpected values
      }
    } else {
      const op1 = obj["option_1"] || obj["option_one"];
      const op2 = obj["option_2"] || obj["option_two"];
      if (value === op1) {
        return { ...result, status: "success" };
      } else if (keyName === "hiv_unit") {
        return { ...result, status: "success" };
      } else if (value === op2) {
        return { ...result, status: "warning" };
      } else {
        return { ...result, status: "danger" };
      }
    }
  }


  // only for eye unit generation
  function getEyeStatus(obj: ObjectTypes) {
    const { value, key, label, units } = obj;

    // Determine the key name
    const keyName = Array.isArray(key) ? key[1] : key;

    // Parse the testValue as a floating-point number
    const unitValue = !isNaN(value as any) ? Number(value) : null;

    // Initialize the result object
    const result = {
      label,
      key: keyName,
      value,
      standard_value: [],
      units,
      ...extraPayload(obj),
    };

    // Parse the thresholds from the object
    const sdMinBelow = obj.within_deviation_value_min_below
      ? parseFloat(obj.within_deviation_value_min_below)
      : null;

    const sdMaxBelow = obj.within_deviation_value_min
      ? parseFloat(obj.within_deviation_value_min)
      : null;

    const outOfRangeBelow = obj.out_of_range_below
      ? parseFloat(obj.out_of_range_below)
      : null;

    const outOfRange = obj.out_of_range ? parseFloat(obj.out_of_range) : null;

    if (unitValue != null && typeof unitValue !== "string") {
      // Check the conditions and return the appropriate status

      if (
        (outOfRangeBelow !== null && unitValue <= outOfRangeBelow) ||
        (outOfRange !== null && unitValue >= outOfRange)
      ) {
        return { ...result, status: "danger" };
      }

      if (
        (sdMinBelow !== null && unitValue >= sdMinBelow) ||
        (sdMaxBelow !== null && unitValue <= sdMaxBelow)
      ) {
        return { ...result, status: "warning" };
      }
      
    } else {
      const op1 = obj["option_1"] || obj["option_one"];
      if (value === op1) {
        return { ...result, status: "success" };
      } else {
        return { ...result, status: "warning" };
      }
    }
  }

  return { getHealthStatus, getEyeStatus };
};

export default useHealthData;
