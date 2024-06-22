import React, { useState } from 'react';
import { Button, Input, Form, Card, Row, Col, message } from 'antd';
import { useAuth } from '../context/Context.Auth';
import axios from 'axios';
import backgroundImage from '../backgroundImage.jpeg';
import toGov from '../toGov.jpeg';
import Title from 'antd/es/typography/Title';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinishLogin = async (values: any) => {
        try {
            const response = await axios.post('http://localhost:3001/user/login', {
                email: values.username,
                password: values.password
            });
            if (response.data) {
                login(response.data.access_token);
                message.success('Login bem-sucedido!');
                navigate('/home');
            } else {
                message.error('Falha no login. Verifique suas credenciais.');
            }
        } catch (error: any) {
            if (error.response) {
                message.error(`Erro no login: ${error.response.data.message || 'Verifique suas credenciais.'}`);
            } else if (error.request) {
                message.error('Nenhuma resposta do servidor. Verifique sua conexão.');
            } else {
                message.error('Erro na configuração da solicitação.');
            }
        }
    };

    const onFinishRegister = async (values: any) => {
        try {
            const response = await axios.post('http://localhost:3001/user/register', {
                email: values.username,
                name: values.name,
                password: values.password,
                confirmPassword: values.confirmPassword
            });
            if (response.data) {
                message.success('Registro bem-sucedido!');
                // Após o registro, faz login automaticamente
                onFinishLogin({ username: values.username, password: values.password });
            } else {
                message.error('Falha no registro. Verifique os dados e tente novamente.');
            }
        } catch (error: any) {
            if (error.response) {
                message.error(`Erro no registro: ${error.response.data.error || 'Verifique os dados e tente novamente.'}`);
            } else if (error.request) {
                message.error('Nenhuma resposta do servidor. Verifique sua conexão.');
            } else {
                message.error('Erro na configuração da solicitação.');
            }
        }
    };

    return (
        <Row style={{ backgroundColor: "#007ABD", minHeight: "100vh" }} align="middle">
            <Col xs={0} sm={12} md={12} xl={12}>
                <div style={{
                    top: "0px",
                    width: "50%",
                    height: "100%",
                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0)), url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "left",
                    position: "fixed",
                    display: "flex",
                    justifyContent: "center",
                }}>
                     <Button type="primary" htmlType="submit" style={{ width: "50%", top: "85%" }}>
                        Baixe o app
                    </Button>
                </div>
            </Col>
            <Col xs={24} sm={12} md={12} xl={12} style={{ padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <Card style={{ width: "350px", display: "block" }}>
                        {isRegistering ? (
                            <Form
                                form={form}
                                onFinish={onFinishRegister}
                            >
                                <Title level={3} style={{ marginTop: "0px" }}>Cadastre-se</Title>
                                <Form.Item
                                    name="username"
                                    rules={[{ required: true, message: 'Insira um email válido!' }]}
                                >
                                    <Input placeholder="Email" />
                                </Form.Item>
                                <Form.Item
                                    name="name"
                                    rules={[{ required: true, message: 'Insira seu nome!' }]}
                                >
                                    <Input placeholder="Nome" />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Insira uma senha válida!' }]}
                                    hasFeedback
                                >
                                    <Input.Password placeholder="Password" />
                                </Form.Item>
                                <Form.Item
                                    name="confirmPassword"
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[
                                        { required: true, message: 'Confirme sua senha!' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('As senhas não conferem!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password placeholder="Confirm Password" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                                        Registrar
                                    </Button>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="text" onClick={() => setIsRegistering(false)} style={{ width: "100%" }}>
                                        Já tem uma conta? Entre
                                    </Button>
                                </Form.Item>
                            </Form>
                        ) : (
                            <Form onFinish={onFinishLogin}>
                                <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                                    <img src={toGov} alt="background" style={{ alignSelf: "center" }} />
                                </div>
                                <Form.Item
                                    name="username"
                                    rules={[{ required: true, message: 'Insira um email válido!' }]}
                                >
                                    <Input placeholder="Email" />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Insira uma senha válida!' }]}
                                >
                                    <Input.Password placeholder="Password" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                                        Entrar
                                    </Button>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="text" onClick={() => setIsRegistering(true)} style={{ width: "100%" }}>
                                        Cadastre-se
                                    </Button>
                                </Form.Item>
                            </Form>
                        )}
                    </Card>
                </div>
            </Col>
        </Row>
    );
};

export default Login;
