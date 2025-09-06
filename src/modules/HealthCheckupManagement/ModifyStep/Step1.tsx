import { SearchOutlined } from "@ant-design/icons";
import EmptyContent from "@components/Common/Empty/EmptyContent";
import RenderDetailsComponent from "@components/Common/RenderDetailsComponent";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import ViewFileLink from "@components/Common/ViewDetailsModal/ViewFile";
import {
  FormItemWrapper,
  InputWrapper,
  ButtonWrapper,
  CardWrapper,
} from "@components/Wrapper"; // CardWrapper is added for health history
import { renderAllDetails } from "@utils/commonFunctions";
import { Row, Col, FormInstance, Form, Space, Divider } from "antd";
import { startCase } from "lodash";
import React, { useEffect, useState } from "react";
import { useGetRequestHandler } from "src/hook/requestHandler";
import dayjs from "dayjs"; // Import dayjs for formatting dates

interface propTypes {
  mainForm: FormInstance;
  setTabKey: (param: string) => void;
  getDetails: (obj: Record<string, string>) => void;
}

const Step1 = ({ mainForm, setTabKey, getDetails }: propTypes) => {
  const { loading, data, fetchData, status } = useGetRequestHandler();
  const { loading: historyLoading, data: healthCheckupHistory, fetchData: fetchHistoryData } = useGetRequestHandler(); // Handler for health history

  const searchData = Form.useWatch("searchData", mainForm);
  const [details, setDetails] = useState<{ [k: string]: unknown } | null>(null);
  const [btnClicked, setBtnClicked] = useState(false);

  const centerNameMapping: { [key: string]: string } = {
    "48": "HSVK",
    "45": "KALINGANAGAR",
    "46": "MERAMANDALI",
    "47": "ROHTAK",
  };

  const searchHandler = () => {
    setBtnClicked(true);
    fetchData("/api/search-driver", { searchData });
  };

  useEffect(() => {
    if (status && data) {
      console.log('Search response data:', data);  // Logging search data response
      const { createdAt, updatedAt, ...restData } = data;
      setDetails(restData);
      getDetails && getDetails(restData);

      // Fetch health history using 'id' instead of 'driverId'
      const driverId = restData?.driverId || restData?.id;  // Fallback to 'id' if 'driverId' is null
      console.log('Driver ID:', driverId);  // Logging to check if driverId or id is available
      if (driverId) {
        fetchHistoryData("/api/health-checkup-history", { id: driverId });
      }
    } else {
      setDetails(null);
    }
  }, [status, data]);

  useEffect(() => {
    console.log("Health checkup history:", healthCheckupHistory);  // Add this line
  }, [healthCheckupHistory]);

  useEffect(() => {
    console.log("History loading:", historyLoading);  // Add this line
  }, [historyLoading]);

  const showDetails = details ? (
    <RenderDetailsComponent
      details={{ "LMC ID": details?.external_id, ...details }}
      excludeItems={["createdBy", "external_id", "driverId", "id"]}
    />
  ) : (
    <div className="border rounded-2 p-4">
      <EmptyContent onlyMessage="No user found" />
    </div>
  );

  // Display the previous health checkup history box
  const showHealthCheckupHistory = Array.isArray(healthCheckupHistory) && healthCheckupHistory.length > 0 ? (
    healthCheckupHistory?.map(
      (obj: { selected_package_list: any; selected_package_name: any; date_time: string; createdBy:string }, key: React.Key) => (
        <div key={key}>
          <Space className="history-row">
            <h3 className="fs-6">Package Name:</h3>
            <h3 className="fs-6">
              {startCase(
                obj?.selected_package_name?.flat().map((item: string) => startCase(item)).join(", ")
              )}
            </h3>
          </Space>
          <Space className="history-row">
            <b>Package List: </b>
            <p>{obj?.selected_package_list?.flat().map((item: string) => startCase(item)).join(", ")}</p>
          </Space>
          <Space className="history-row">
            <b>Date & Time : </b>
            <p>{obj?.date_time ? dayjs(obj.date_time).format("MMM D, YYYY h:mm A") : "N/A"}</p>
          </Space>
          <Space className="history-row">
            <b>Center Name: </b>
            <p>{centerNameMapping[obj?.createdBy] || obj?.createdBy}</p>
          </Space>
          {key !== 4 && <Divider />}
        </div>
      )
    )
  ) : (
    <EmptyContent onlyMessage="No previous health history found." />
  );

  return (
    <Row gutter={16}>
      <Col md={13} span={24}>
        <FormItemWrapper name="searchData" label="Phone or LMC ID or ID Proof">
          <InputWrapper
            addonAfter={
              <span
                className="text-primary cursor-pointer"
                onClick={searchHandler}
              >
                <SearchOutlined />
              </span>
            }
          />
        </FormItemWrapper>
      </Col>

      {searchData && btnClicked && (
        <>
          <Col md={13} span={24} className="mb-3">
            {loading ? (
              <TableContentLoaderWithProps
                rowHeight={70}
                columnWidth={[25, "2", 73]}
                rowCounts={10}
              />
            ) : (
              showDetails
            )}
          </Col>

          {/* Display Previous Health Checkup History after search */}
          <Col md={13} span={24} className="mb-3">
            {historyLoading ? (
              <TableContentLoaderWithProps rowHeight={70} columnWidth={[25, "2", 73]} rowCounts={10} />
            ) : (
              <CardWrapper>
                <div className="form-content">
                  {healthCheckupHistory?.length > 0 && (
                    <h4 className="primary-color primary-bg-color-4">
                      Previous Health Checkup History
                    </h4>
                  )}
                </div>
                {showHealthCheckupHistory}
              </CardWrapper>
            )}
          </Col>
        </>
      )}

      <Col md={13} span={24}>
        <FormItemWrapper name="">
          <ButtonWrapper
            disabled={!data}
            type="primary"
            onClick={() => setTabKey("step_2")}
          >
            Next
          </ButtonWrapper>
        </FormItemWrapper>
      </Col>
    </Row>
  );
};

export default Step1;
