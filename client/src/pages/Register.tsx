import React, { FormEvent, useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

export default function Register() {
  const [formsVariables, setFormVariables] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const submitRegisterForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormVariables({
      ...formsVariables,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Register</h1>
        <Form onSubmit={submitRegisterForm}>
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              name="email"
              type="email"
              value={formsVariables.email}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              type="text"
              value={formsVariables.username}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              value={formsVariables.password}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              name="confirmPassword"
              type="password"
              value={formsVariables.confirmPassword}
              onChange={onChange}
            />
          </Form.Group>
          <div className="text-center">
            <Button variant="success" type="submit">
              Register
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
}
