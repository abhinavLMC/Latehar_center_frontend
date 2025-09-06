
import NextImage from "@components/NextImage";
import { Button, Col, Form, Input, Row } from "antd";
import Image from "next/image";
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
                    src="/images/LMC_logo.png"
                    alt="brand name"
                    width={240}
                    height={70}
                  />
                  {/* <div style={{background: '#ddd', height: '60px', margin: '15px'}}></div> */}
                </div>

                {/* Government Logos */}
                <div className="d-flex align-items-center justify-content-center government-logos-login" style={{ gap: '20px', marginTop: '20px' }}>
                  <Image
                    src="/images/PMKKKY_Logo.png"
                    alt="PMKKKY Logo"
                    width={120}
                    height={120}
                    style={{ objectFit: 'contain' }}
                    className="logo-img"
                  />
                  <Image
                    src="/images/Jharkhand-Sarkar-logo.png"
                    alt="Jharkhand Government Logo"
                    width={100}
                    height={100}
                    style={{ objectFit: 'contain' }}
                    className="logo-img"
                  />
                  <Image
                    src="/images/NHM.png"
                    alt="National Rural Health Mission Logo"
                    width={100}
                    height={100}
                    style={{ objectFit: 'contain' }}
                    className="logo-img"
                  />
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
