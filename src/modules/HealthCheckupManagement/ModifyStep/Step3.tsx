import {
  FormItemWrapper,
  DatePickerWrapper,
  SelectWrapper,
  ButtonWrapper,
  InputWrapper,
  CardWrapper,
} from "@components/Wrapper";
import { Row, Col, Space, Form, Divider } from "antd";
import { FormInstance } from "antd/es/form/Form";
import React, { Key, useEffect, useState } from "react";
import {
  Alchol,
  BMI,
  BloodGroup,
  BloodPressure,
  Cholesterol,
  Cretenine,
  ECG,
  EyeTest,
  HIV,
  Haemoglobin,
  Hearing,
  PFT,
  Pulse,
  RandomBloodSugar,
  SPO2,
  Temperature,
  Romberg,
  Vision,
} from "../AllTest";
import { useGetRequestHandler } from "src/hook/requestHandler";
import { fieldRules } from "@utils/commonFunctions";
import dayjs from "dayjs";
import useGetQuery from "src/hook/getQuery";
import { TableContentLoaderWithProps } from "@components/Common/SkeletonLoader/ContentLoader";
import EmptyContent from "@components/Common/Empty/EmptyContent";
import { EMPTY_PLACEHOLDER } from "@constants/AppConstant";
import { capitalize, startCase } from "lodash";

interface propTypes {
  mainForm: FormInstance;
  setTabKey: (param: string) => void;
  buttonLoading: boolean;
  packageList: packageTypes[];
}

interface packageTypes {
  package_name: any;
  id: any;
  package_list: any;
}

type TestType = 
  | 'ecg'
  | 'random-blood-sugar'
  | 'alchol'
  | 'bmi'
  | 'blood-pressure'
  | 'temperature'
  | 'pulse'
  | 'spo2'
  | 'haemoglobin'
  | 'pft'
  | 'hiv'
  | 'hearing'
  | 'eye';

// Map the API test names to their display order
const testOrder: Record<TestType, number> = {
  'ecg': 1,
  'random-blood-sugar': 2,
  'alchol': 3,
  'bmi': 4,
  'blood-pressure': 5,
  'temperature': 6,
  'pulse': 7,
  'spo2': 8,
  'haemoglobin': 9,
  'pft': 10,
  'hiv': 11,
  'hearing': 12,
  'eye': 13
};

// Type guard to check if a string is a valid test type
const isValidTestType = (test: string): test is TestType => {
  return test in testOrder;
};

const Step3 = ({
  mainForm,
  setTabKey,
  buttonLoading,
  packageList,
}: propTypes) => {
  const { id } = useGetQuery("update-health-checkup");

  const packageListData = Form.useWatch("package_list", mainForm);
  const isSubmitted = Form.useWatch("is_submited", mainForm);
  const driverId = Form.useWatch("driverId", mainForm);

  const [packageArr, setPackageArr] = useState<string[]>([]);

  const {
    loading: historyLoading,
    data: healthCheckupHistory,
    fetchData: fetchHistoryData,
  } = useGetRequestHandler();

  const {
    loading,
    data: unitData,
    fetchData: fetchPackageUnit,
  } = useGetRequestHandler();
  const {
    loading: isLoading,
    data: doctorList,
    fetchData: fetchDoctorList,
  } = useGetRequestHandler();

  // fetch unit list with package arr
  const pList = [...new Set([...packageArr.flat()])];
  useEffect(() => {
    if (pList?.length > 0) {
      fetchPackageUnit(`/api/package-unit-list`, {
        package_list: pList,
      });
    }
  }, [pList?.length]);

  // fetch doctor list of driver
  useEffect(() => {
    fetchDoctorList("/api/driver-doctor-list");
  }, []);

  useEffect(() => {
    if (driverId) {
      fetchHistoryData("/api/health-checkup-history", { id: driverId });
    }
  }, [driverId]);

  useEffect(() => {
    if (!!packageListData) {
      const plr = getPackageLists(packageList, packageListData);
      setPackageArr(plr);
    }
  }, [packageList, packageListData?.length]);

  const getPackageLists = (pList: any[], packages: string[]): string[] => {
    const packageIds = packages?.map((item) => Number(item));
    const selectedPackages = (pList?.length > 0 ? pList : []).filter((pkg) =>
      packageIds.includes(pkg.id)
    );
    const allItems = selectedPackages.flatMap((pkg) => pkg.package_list);
    return [...new Set(allItems)]; // Remove duplicates
  };

  const renderTest = (val: string) => {
    switch (val) {
      case "ecg":
        return <ECG {...{ loading, data: unitData?.[val], form: mainForm, id }} />;
      case "random-blood-sugar":
        return <RandomBloodSugar {...{ loading, data: unitData?.[val], form: mainForm, id }} />;
      case "alchol":
        return <Alchol {...{ loading, data: unitData?.[val], form: mainForm, id }} />;
      case "bmi":
        return <BMI {...{ loading, data: unitData?.[val], form: mainForm, id }} />;
      case "blood-pressure":
        return <BloodPressure {...{ loading, data: unitData?.[val], form: mainForm, id }} />;
      case "temperature":
        return <Temperature {...{ loading, data: unitData?.[val], form: mainForm, id }} />;
      case "pulse":
        return <Pulse {...{ loading, data: unitData?.[val], form: mainForm, id }} />;
      case "spo2":
        return <SPO2 {...{ loading, data: unitData?.[val], form: mainForm, id }} />;
      case "haemoglobin":
        return <Haemoglobin {...{ loading, data: unitData?.[val], form: mainForm, id }} />;
      case "pft":
        return <PFT {...{ loading, data: unitData?.[val], form: mainForm, id }} />;
      case "hiv":
        return <HIV {...{ loading, data: unitData?.[val], form: mainForm, id }} />;
      case "hearing":
        return <Hearing {...{ loading, data: unitData?.[val], form: mainForm, id }} />;
      case "eye":
        return <EyeTest {...{ loading, data: unitData?.[val], form: mainForm, id }} />;

      case "vision":
        return <Vision{...{ loading, data: unitData?.[val], form: mainForm, id }}/>;  

      default:
        return null;
    }
  };

  const packageArray = packageList?.map((item: packageTypes) => ({
    label: item.package_name,
    value: item.id.toString(),
    title: item.package_list,
  }));

  return (
    <Row gutter={16}>
      <Col span={24} md={12}>
        <CardWrapper>
          <Row>
            <Col span={24}>
              <FormItemWrapper name="selected_package_name" hidden />
              <FormItemWrapper name="selected_package_list" hidden />

              <FormItemWrapper name="external_id" label="Unique Id">
                {isLoading ? (
                  <TableContentLoaderWithProps
                    columnWidth={[100]}
                    rowCounts={1}
                    rowHeight={100}
                  />
                ) : (
                  <InputWrapper readOnly />
                )}
              </FormItemWrapper>
            </Col>
            <Col span={24}>
              <FormItemWrapper
                name="date_time"
                label="Date and Time"
                initialValue={dayjs()}
                rules={fieldRules()}
              >
                {isLoading ? (
                  <TableContentLoaderWithProps
                    columnWidth={[100]}
                    rowCounts={1}
                    rowHeight={100}
                  />
                ) : (
                  <DatePickerWrapper readOnly={isSubmitted} />
                )}
              </FormItemWrapper>
            </Col>
            <Col span={24}>
              <FormItemWrapper
                label="Select Doctor"
                name="doctor_id"
                rules={fieldRules()}
              >
                {isLoading ? (
                  <TableContentLoaderWithProps
                    columnWidth={[100]}
                    rowCounts={1}
                    rowHeight={100}
                  />
                ) : (
                  <SelectWrapper
                    disabled={isSubmitted}
                    options={doctorList?.map(
                      (obj: {
                        id: any;
                        User: { username: string; id: string };
                      }) => ({
                        label: obj?.User?.username,
                        value: obj?.id,
                      })
                    )}
                  />
                )}
              </FormItemWrapper>
            </Col>
            <Col span={24}>
              <FormItemWrapper
                name="package_list"
                label="Select Multiple Package"
                rules={fieldRules()}
              >
                {isLoading ? (
                  <TableContentLoaderWithProps
                    columnWidth={[100]}
                    rowCounts={1}
                    rowHeight={100}
                  />
                ) : (
                  <SelectWrapper
                    disabled={isSubmitted}
                    options={packageArray}
                    mode="multiple"
                    onChange={(_, obj) => {
                      setPackageArr(
                        obj.map((item: { title: string[] }) => item.title)
                      );
                      // all selected packages
                      mainForm.setFieldValue(
                        "selected_package_name",
                        obj.map((item: any) => item.label)
                      );
                      // all list of tests for individual package
                      mainForm.setFieldValue(
                        "selected_package_list",
                        obj.map((item: any) => item.title)
                      );
                    }}
                  />
                )}
              </FormItemWrapper>
            </Col>
            {[...new Set([...packageArr.flat()])]
              ?.sort((a, b) => {
                const orderA = isValidTestType(a) ? testOrder[a] : 999;
                const orderB = isValidTestType(b) ? testOrder[b] : 999;
                return orderA - orderB;
              })
              ?.map((item: string, index, arr) => (
                <Col
                  span={24}
                  className={arr?.length - 1 === index ? "" : "mb-4"}
                  key={item}
                >
                  {renderTest(item)}
                </Col>
              ))
            }
            <Col span={24}>
              <FormItemWrapper
                name="confirm_report"
                label="The report is ready now?"
                rules={fieldRules()}
                initialValue={"no"}
              >
                <SelectWrapper
                  options={[
                    {
                      label: "Yes",
                      value: "yes",
                    },
                    {
                      label: "No",
                      value: "no",
                    },
                  ]}
                />
              </FormItemWrapper>
            </Col>
            <Col span={24}>
              <Space className="mt-3">
                <ButtonWrapper
                  type="primary"
                  loading={buttonLoading}
                  htmlType="submit"
                >
                  Submit
                </ButtonWrapper>
              </Space>
            </Col>
          </Row>
        </CardWrapper>
      </Col>
      <Col span={24} md={12}>
        {historyLoading ? (
          <>
            <CardWrapper loading={historyLoading} className="mb-3" />
            <CardWrapper loading={historyLoading} className="mb-3" />
            <CardWrapper loading={historyLoading} />
          </>
        ) : (
          <CardWrapper>
            <div className="form-content">
              {healthCheckupHistory?.length > 0 && (
                <h4 className="primary-color primary-bg-color-4">
                  Previous Health Checkup History
                </h4>
              )}
            </div>
            {healthCheckupHistory?.length > 0 ? (
              healthCheckupHistory?.map(
                (
                  obj: {
                    selected_package_list: any;
                    selected_package_name: any;
                    date_time: string;
                  },
                  key: Key
                ) => (
                  <div className="" key={key}>
                    <Space className="history-row">
                      <h3 className="fs-6">Package Name:</h3>
                      <h3 className="fs-6">
                        {startCase(
                          obj?.selected_package_name
                            ?.flat()
                            .map((item: string) => startCase(item))
                            .join(", ")
                        )}
                      </h3>
                    </Space>

                    <Space className="fs-6 history-row">
                      <b>Package List: </b>
                      <p className="fs-6">
                        {obj?.selected_package_list
                          ?.flat()
                          .map((item: string) => startCase(item))
                          .join(", ")}
                      </p>
                    </Space>
                    <Space className="fs-7 history-row">
                      <b>Date & Time : </b>
                      {obj?.date_time
                        ? dayjs(obj.date_time).format("MMM D, YYYY h:mm A")
                        : EMPTY_PLACEHOLDER}
                    </Space>
                    {key !== 4 && <Divider />}
                  </div>
                )
              )
            ) : (
              <EmptyContent onlyMessage="No previous health history found." />
            )}
          </CardWrapper>
        )}
      </Col>
    </Row>
  );
};

export default Step3;
