import React, { useEffect, useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { SERVER_URL } from '../consts';
import { useAuthDispatch } from '../context/auth';

/* eslint-disable-next-line */
export interface HomeProps {}

export default function Home(props: HomeProps) {
  const authDispatch = useAuthDispatch();
  const logout = () => {
    authDispatch({ type: 'LOGOUT' });
    window.location.href = '/login';
  };
  const accessToken = localStorage.getItem('accessToken');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${SERVER_URL}/users`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        setUsers(data);
      })
      .catch((errors) => {
        console.error(errors);
      });
  }, [accessToken]);

  console.log(users);
  

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
