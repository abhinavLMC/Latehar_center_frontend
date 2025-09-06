
import NextImage from "@components/NextImage";
import { Button, Col, Form, Input, Row } from "antd";
import React from "react";
import { useLoginHandler } from "src/hook/useAuth";


const Login = () => {

  const [form] = Form.useForm();
  const {loading, submit} = useLoginHandler()
  
  return (
    <div className="login-container">
      <Row className="min-height-100-vh">
        <Col md={16} span={24}>
          <div className="login-bg">
            <img src="/images/secure-login.png" className="img-responsive" />
          </div>
        </Col>
        <Col md={8} span={24}>
          <div className="login-box">
            <Row justify="center" align="middle" className="min-height-100">
              <Col md={16}>
                <div className="logo">
                  <NextImage
                    src="/images/LMC_logo.webp"
                    alt="brand name"
                    width={240}
                    height={70}
                  />
                  {/* <div style={{background: '#ddd', height: '60px', margin: '15px'}}></div> */}
                </div>

                {/* <div className="mb-4">
                  <p>Welcome to</p>
                  <h2 className="fs-1 fw-bold text-uppercase">
                    Last Mile Care
                  </h2>
                </div> */}

                <Form
                  name="basic"
                  form={form}
                  initialValues={{ remember: true }}
                  onFinish={submit}
                  autoComplete="off"
                  layout="vertical"
                >
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your email!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>

                  {/* <Form.Item name="remember" valuePropName="checked">
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item> */}

                  <Form.Item>
                    <Button
                      type="primary"
                      loading={loading}
                      className="w-100"
                      htmlType="submit"
                    >
                      Sign In
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
