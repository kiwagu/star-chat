import React, { FormEvent, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { RouteComponentProps, Link } from 'react-router-dom';

import AlertError from '../components/AlertError';
import { SERVER_URL } from '../consts';
import { useAuthDispatch } from '../context/auth';

export default function Login(props: RouteComponentProps<any>) {
  const initialsFormsVariables = {
    username: '',
    password: '',
  };
  const [formsVariables, setFormVariables] = useState(initialsFormsVariables);
  const [errors, setError] = useState([]);
  const [isShowError, setIsShowError] = useState(false);
  const dispatch = useAuthDispatch();
  const submitLoginForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch(`${SERVER_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(formsVariables),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }

        dispatch({ type: 'LOGIN', payload: data });
        setFormVariables(initialsFormsVariables);
        setIsShowError(false);
        props.history.push('/');
      })
      .catch((errors) => {
        setError(typeof errors === 'string' ? [errors] : errors);
        setIsShowError(true);
      });
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
        <h1 className="text-center">Login</h1>
        {isShowError && <AlertError errors={errors} setShow={setIsShowError} />}
        <Form onSubmit={submitLoginForm}>
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

          <div className="text-center">
            <Button variant="success" type="submit">
              Login
            </Button>
          </div>
          <br />
          <small>
            Do not have an account? <Link to="/register">Register</Link>
          </small>
        </Form>
      </Col>
    </Row>
  );
}
