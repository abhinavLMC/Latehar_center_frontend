import API from "@api/preference/API";
import { ALL_API_OBJECT } from "@constants/ApiConstant";
import { NextApiRequest, NextApiResponse } from "next";
import { AxiosError, AxiosResponse } from "axios";

const ERROR_MSG = "Something went wrong";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  // Get the token from cookies
  const token = req.cookies?.center_token || "";
  const pathname = req.query.path as string;
  const ENDPOINT = ALL_API_OBJECT[pathname];

  // Validate endpoint
  if (!ENDPOINT || typeof ENDPOINT !== 'string') {
    return res.status(400).json({ message: 'Invalid API endpoint' });
  }

  try {

    const response = await API({
      ...req,
      // method: req.method,
      url: ENDPOINT,
      baseURL: ENDPOINT,
      data: req.body,
      headers: {
        // ...req.headers,
        Cookie: `center_token=${token}`,
      },
    });

    if (response.status >= 400 && response.status < 500) {
      return res
        .status(response.status || 404)
        .json({ ...response.data, code: response.status });
    }

    const finalResponse = {
      ...response.data,
      message: response.data.message || ERROR_MSG,
    };

    // console.log("=================Try block called");
    return res.status(response.status || 200).json(finalResponse);
  } catch (error) {
    // Handle errors
    // console.log("=================Catch block called", error);
    if ((error as AxiosError).code === "ENOTFOUND") {
      return res.status(500).json({ message: "Please check your Internet." });
    }

    const axiosResponse = (error as AxiosError)?.response as AxiosResponse;
    if (axiosResponse && axiosResponse.status === 404) {
      return res
        .status(axiosResponse.status)
        .json(axiosResponse.data || { message: "API is not found" });
    }

    return res.status(axiosResponse?.status || 500).json({
      message: ERROR_MSG,
      ...(axiosResponse?.data || {}),
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb", // Set desired value here
    },
  },
};
