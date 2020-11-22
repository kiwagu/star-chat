import React, { Fragment, useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Cards from 'react-credit-cards';

import 'react-credit-cards/es/styles-compiled.css';

import { useAuthDispatch, useAuthState } from '../context/auth';
import { SERVER_URL } from '../consts';

export default function Profile() {
  const authDispatch = useAuthDispatch();
  const authState = useAuthState();
  const accessToken = authState.credentials?.accessToken || '';
  const logout = () => {
    authDispatch({ type: 'LOGOUT' });
    window.location.href = '/login';
  };
  const [cvc, setCvc] = useState('123');
  const [expiry, setExpiry] = useState('1223');
  const [name, setName] = useState('John Smith');
  const [number, setNumber] = useState('4242 4242 4242 4242');

  useEffect(() => {
    fetch(`${SERVER_URL}/users/current`, {
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
        setCvc(data.cardCvc);
        setExpiry(data.cardExpiry);
        setName(data.cardName);
        setNumber(data.cardNumber);
      })
      .catch((errors) => {
        console.error(errors);
      });
  }, [accessToken]);

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
        <Col xs={4} className="bg-secondary">
          <p className="bg-white user-div d-flex p-3" role="button">
            Credit card
          </p>
        </Col>
        <Col xs={8} className="p-4 bg-secondary">
          <div id="PaymentForm">
            <Cards
              cvc={cvc}
              expiry={expiry}
              focused={'number'}
              name={name}
              number={number}
            />
          </div>
        </Col>
      </Row>
    </Fragment>
  );
}
