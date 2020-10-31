import React from 'react';
import { Button, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useAuthDispatch } from '../context/auth';

/* eslint-disable-next-line */
export interface HomeProps {}

export default function Home(props: HomeProps) {
  const authDispatch = useAuthDispatch();
  const logout = () => {
    authDispatch({ type: 'LOGOUT' });
    window.location.href = '/login';
  };
  return (
    <Row className="bg-white justify-content-around mb-1">
      <Link to="/login">
        <Button variant="link">Login</Button>
      </Link>
      <Link to="/register">
        <Button variant="link">Register</Button>
      </Link>
      <Button variant="link" onClick={logout}>
        Logout
      </Button>
    </Row>
  );
}
