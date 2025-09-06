import { Tabs } from "antd";
import type { TabsProps } from "antd";
import DynamicPageLayout from "@components/DynamicPageLayout";
import {
  CardWrapper,
  FormItemWrapper,
} from "@components/Wrapper";
import { HEALTH_CHECKUP_MANAGEMENT } from "@constants/AppConstant";
import { addEditTitle } from "@utils/commonFunctions";
import { Form } from "antd";
import React, { useEffect, useState } from "react";
import useGetQuery from "src/hook/getQuery";
import {
  useGetRequestHandler,
  usePostRequestHandler,
} from "src/hook/requestHandler";
import Step2 from "./ModifyStep/Step2";
import Step3 from "./ModifyStep/Step3";
import Step1 from "./ModifyStep/Step1";
import dayjs from "dayjs";

const BACK_URL = HEALTH_CHECKUP_MANAGEMENT;

interface FormFieldTypes {
  [key: string]: any;
}

const ModifyHealthCheckupManagement = () => {
  
  const [mainForm] = Form.useForm();

  const { id } = useGetQuery("update-health-checkup");
  const [tabKey, setTabKey] = useState('step_1');

  const { buttonLoading, submit } = usePostRequestHandler();
  const { loading, setLoading, data, fetchData: fetchDetails } = useGetRequestHandler();

  const { data: packageList, fetchData: fetchPackage } = useGetRequestHandler();

  useEffect(() => {
    fetchPackage("/api/driver-packages");
  }, []);


  useEffect(() => {
    if (id) {
      setTabKey('step_3')
      fetchDetails("/api/details-driver-health-checkup", { id });
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!!data) {
      const finalData = {
        ...data,
        driverId: data?.driver_id,
        last_insert_id: data.id,
        date_time: data?.date_time ? dayjs(data?.date_time) : dayjs(),
      };

      mainForm.setFieldsValue(finalData);
    }
  }, [data]);

  // update or new creation
  const formSubmit = async (fieldsValues: FormFieldTypes) => {
    const { otp, ...restField} = fieldsValues
    const payload = {
      ...restField,
      selected_package_list: fieldsValues?.selected_package_list?.flat(),
      ...(id ? { id} : {}),
    };
    const API_ENDPOINT = id
      ? "/api/create-health-checkup-2"
      : "/api/create-health-checkup-2";

      // console.log("==payload", payload);

    await submit(API_ENDPOINT, payload, BACK_URL);
    mainForm.resetFields()
  };

  // get details from step 1 by the help of callback function
  const getDetails = (obj: any) => {
    mainForm.setFieldsValue({...obj, driverId: obj?.id});
  };


  const items: TabsProps["items"] = [
    {
      key: "step_1",
      label: "Step 1",
      children: <Step1 {...{ mainForm, setTabKey, getDetails }} />,
      disabled: Boolean(id),
    },
    {
      key: "step_2",
      label: "Step 2",
      children: <Step2 {...{ mainForm, setTabKey }} />,
      disabled: Boolean(id),
    },
    {
      key: "step_3",
      label: "Step 3",
      children: (
        <Step3
          {...{ mainForm, setTabKey, buttonLoading, packageList: packageList?.map((obj: { package: any; }) => obj.package) }}
        />
      ),
    },
  ];

  const MainLayout = (
    <CardWrapper>
      <Form form={mainForm} layout="vertical" onFinish={formSubmit}>
        {/* Very important line for step 3 */}
        <FormItemWrapper name="last_insert_id" hidden />
        {/* driverId will be set to the primary id of search data */}
        <FormItemWrapper name="driverId" hidden />
        <FormItemWrapper name="is_submited" hidden />
        <FormItemWrapper name="short_code" hidden />
        <Tabs activeKey={tabKey} items={items} />
      </Form>
    </CardWrapper>
  );

  return (
    <DynamicPageLayout
      customTitle={`${addEditTitle(id as string)} Health Checkup`}
      goBackUrl={HEALTH_CHECKUP_MANAGEMENT}
      MainComp={MainLayout}
    />
  );
};

export default ModifyHealthCheckupManagement;
