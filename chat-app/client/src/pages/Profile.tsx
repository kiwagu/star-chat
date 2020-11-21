import React, { Fragment } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuthDispatch } from '../context/auth';

export default function Profile() {
  const authDispatch = useAuthDispatch();
  const logout = () => {
    authDispatch({ type: 'LOGOUT' });
    window.location.href = '/login';
  };
  const pay = () => {
    const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=300,left=100,top=100`;
    const form = document.createElement('form');
    form.target = 'Payment';
    form.method = 'POST';
    form.action = 'http://localhost:4000/api';
    form.style.display = 'none';

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'secretKey';
    input.value = 'someSecret123';
    form.appendChild(input);

    const input2 = document.createElement('input');
    input2.type = 'hidden';
    input2.name = 'someParam';
    input2.value = 'SomeValue';
    form.appendChild(input2);

    document.body.appendChild(form);

    const paymentWindow = window.open('', 'Payment', params);
    if (paymentWindow) {
      form.submit();
    }
  };

  return (
    <Fragment>
      <Row className="bg-white justify-content-around mb-1">
        <Link to="/">
          <Button variant="link">Home</Button>
        </Link>
        <Link to="/profile">
          <Button variant="link">Profile</Button>
        </Link>
        <Button variant="link" onClick={logout}>
          Logout
        </Button>
      </Row>
      <Row>
        <Col xs={4} className="p-0 bg-secondary">
          Left side
        </Col>
        <Col xs={8} className="p-0 bg-secondary">
          <Button onClick={pay}>Pay</Button>
        </Col>
      </Row>
    </Fragment>
  );
}
