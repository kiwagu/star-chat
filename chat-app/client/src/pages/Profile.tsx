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
      <Row className="bg-white flex-grow-1">
        <Col xs={4} className="p-0 bg-secondary">
          <p>Category</p>
        </Col>
        <Col xs={8} className="p-0 bg-secondary">
          <p>Info</p>
        </Col>
      </Row>
    </Fragment>
  );
}
