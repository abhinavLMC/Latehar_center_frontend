import { FormInstance } from "antd";

export interface TestPropTypes {
  loading: boolean;
  data: Record<string, string>;
  form: FormInstance;
  id?: string | null
}