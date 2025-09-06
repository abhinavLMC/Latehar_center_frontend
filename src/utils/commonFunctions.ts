import { EMPTY_PLACEHOLDER, INVALID_INPUT_MSG, REQUIRED_MESSAGE } from "@constants/AppConstant";
import { Rule } from "antd/es/form";
import dayjs from "dayjs";
import { isObject, startCase } from "lodash";
import Router from "next/router";

const duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getBase64 = (
  file: File,
  compression: number = 1
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Function to handle image files
    const handleImage = (imageResult: string) => {
      const img = new Image();
      img.src = imageResult;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image on the canvas
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Get the compressed base64 string
        const compressedBase64 = canvas.toDataURL("image/jpeg", compression);
        resolve(compressedBase64);
      };

      img.onerror = () => {
        reject(new Error("Image loading error"));
      };
    };

    reader.onload = function (): void {
      if (reader.result) {
        // Check the file type
        if (file.type.startsWith("image/")) {
          handleImage(reader.result as string);
        } else if (file.type === "application/pdf") {
          resolve(reader.result as string);
        } else {
          reject(new Error("Unsupported file type"));
        }
      } else {
        resolve(null);
      }
    };

    reader.onerror = function (error): void {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};



export const hexToRGBA = (
  hexOrName: string,
  alpha: number = 1
): string | null => {
  // Named color mapping
  const namedColors: { [key: string]: string } = {
    green: "#00ff00",
    blue: "#0000ff",
    red: "#ff0000",
    white: "#ffffff",
    cyan: "#00ffff",
    silver: "#c0c0c0",
    gray: "#808080",
    grey: "#808080",
    darkblue: "#00008b	",
    black: "#000000",
    lightblue: "#add8e6	",
    orange: "#ffa500",
    purple: "#800080",
    brown: "#a52a2a",
    yellow: "#ffff00	",
    maroon: "#800000",
    lime: "#00ff00",
    magenta: "#ff00ff	",
    olive: "#808000",
    pink: "#ffc0cb	",
    aquamarine: "#7fffd4",
    // Add more named colors as needed
  };

  // Check if the input is a named color
  const hex = hexOrName && namedColors[hexOrName.toLowerCase()];

  // If it's a named color, use the corresponding hex value
  if (hex) {
    hexOrName = hex;
  }

  // Remove '#' if present
  hexOrName = hexOrName.replace("#", "");

  // Handle shorthand hex notation (e.g., #FFF)
  if (hexOrName.length === 3) {
    hexOrName = hexOrName
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Parse hexadecimal values
  const bigint = parseInt(hexOrName, 16);

  // Extract RGB components
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Validate alpha value
  if (alpha < 0 || alpha > 1) {
    console.error("Alpha value must be between 0 and 1");
    return null;
  }

  // Return RGBA color string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface errTypes {
  response: {
    data: {
      message: string;
      status: number;
    };
  };
}
export const errorMsg = (err: errTypes) => err.response.data;

export const goBack = (url: string) => Router.push(url);

export const addEditTitle = (id: string | null) => `${id ? "Edit" : "Add"}`;

export const filterByStatus = (arr: any, key?: string) =>
  arr?.filter((item: any) => item[key || 'status']);
/**
 *
 * @param field : string
 * @returns {required: boolean, type: fieldType, message: string}[]
 */
export const fieldRules = (field?: string | undefined): Rule[] => {
  switch (field) {
    case "email":
      return [
        {
          required: true,
          type: "email",
          message: REQUIRED_MESSAGE,
        },
        {
          whitespace: true,
          message: INVALID_INPUT_MSG,
        },
      ];
    case "text":
      return [
        {
          required: true,
          message: REQUIRED_MESSAGE,
        },
        {
          whitespace: true,
          message: INVALID_INPUT_MSG,
        },
      ];
    case "number":
      return [
        {
          required: true,
          type: "number",
          message: REQUIRED_MESSAGE,
        },
      ];
    case "mobile":
      return [
        {
          required: true,
          message: REQUIRED_MESSAGE,
        },
        {},
      ];
    case "url":
      return [
        {
          required: true,
          type: "url",
          message: REQUIRED_MESSAGE,
        },
        {
          whitespace: true,
          message: INVALID_INPUT_MSG,
        },
      ];
    case "date":
      return [
        {
          required: true,
          type: "date",
          message: REQUIRED_MESSAGE,
        },
        {
          whitespace: true,
          message: INVALID_INPUT_MSG,
        },
      ];
    case "file":
      return [
        {
          required: false,
          message: "",
        },
      ];
    default:
      return [
        {
          required: true,
          message: REQUIRED_MESSAGE,
        },
      ];
  }
};

export const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e.fileList.map(
    (item: {
      size: number; name: string; uid: string; originFileObj: any, type: string
}) => ({
    name: item.name,
    uid: item.uid,
    file: item.originFileObj,
    size: item.size,
    type: item.type
  })
  );
};

export const normDate = (
  value: string,
  reverse: boolean = false,
  inputFormat: string = "DD-MM-YYYY",
  outputFormat: string = "DD-MM-YYYY"
) => {
  let dateObj;

  if (value) {
    // Try to parse the input date using the specified input format
    dateObj = dayjs(value, inputFormat);

    // If parsing failed, return null or handle the error as needed
    if (!dateObj.isValid()) {
      console.error("Invalid date format:", value);
      return null;
    }
  } else {
    // If no value is provided, use the current date
    dateObj = dayjs();
  }

  // If reverse is true, return the dayjs object; otherwise, return the formatted string
  return reverse ? dateObj : dateObj.format(outputFormat);
};


interface RenderAllDetails {
  [key: string]: any;
}


export const renderAllDetails = (
  obj: RenderAllDetails,
  excludeItems: string[] = ["updatedAt", "createdAt", "id", "createdBy"]
) => {
  const finalData = {} as RenderAllDetails;

  const processObject = (
    inputObj: RenderAllDetails,
    outputObj: RenderAllDetails
  ) => {
    for (const key in inputObj) {
      if (
        ![...excludeItems, "updatedAt", "createdAt", "createdBy", "id"].includes(key)
      ) {
        const newKey = startCase(key);
        if (isObject(inputObj[key]) && !Array.isArray(inputObj[key])) {
          processObject(inputObj[key], outputObj);
        } else if (Array.isArray(inputObj[key])) {
          outputObj[newKey] = inputObj[key].join(", ");
        } else {
          outputObj[newKey] = inputObj[key] || EMPTY_PLACEHOLDER;
        }
      }
    }
  };

  processObject(obj, finalData);
  return finalData;
};



export const optionKeys = (data: Record<string, string>, startsKey?: string) =>
  !!data ? Object
    .keys(data)
    .filter((key) => key.startsWith(startsKey || "option_"))
    .map((key) => data[key]) : [];

  
  
export function removeNonAlphabeticCharacters(str: string): string {
  return str.split('').filter(char => /[a-zA-Z]/.test(char)).join('');
}

// calculate year and month 
export const calculateAge = (birthDate: string) => {
  const now = dayjs();
  let birth = dayjs(birthDate);

  const diffInYears = now.diff(birth, "year");
  birth = birth.add(diffInYears, "year");

  const diffInMonths = now.diff(birth, "month");
  birth = birth.add(diffInMonths, "month");

  const diffInDays = now.diff(birth, "day");

  const parts = [];
  if (diffInYears > 0) {
    parts.push(`${diffInYears} ${diffInYears > 1 ? "years" : "year"}`);
  }
  if (diffInMonths > 0) {
    parts.push(`${diffInMonths} ${diffInMonths > 1 ? "months" : "month"}`);
  }
  if (diffInDays > 0 || parts.length === 0) {
    parts.push(`${diffInDays} ${diffInDays > 1 ? "days" : "day"}`);
  }

  return parts.join(", ");
};

interface PartialObject {
  [key: string]: string;
}
// get only needed object with needed key
export const getUnitDataWithKey = ( mainObj: PartialObject, keyName?: string ): PartialObject => {
  if (mainObj && keyName) {
    const obj: PartialObject = {};
    for (const key in mainObj) {
      if (key.startsWith(keyName)) {
        obj[key.replace(keyName, "")] = mainObj[key];
      }
    }
    return obj;
  } else {
    const { id, createdAt, updatedAt, ...restObj } = mainObj;
    return restObj;
  }
};