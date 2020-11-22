import React, { Fragment, useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { SERVER_URL } from '../consts';
import { useAuthDispatch, useAuthState } from '../context/auth';
import Messages from '../components/Messages';

/* eslint-disable-next-line */
export interface HomeProps {}

type UserDto = {
  id: string;
  uid?: number;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};
export default function Home(props: HomeProps) {
  const authDispatch = useAuthDispatch();
  const logout = () => {
    authDispatch({ type: 'LOGOUT' });
    window.location.href = '/login';
  };
  const authState = useAuthState();
  const accessToken = authState.credentials?.accessToken || '';
  const [users, setUsers] = useState<UserDto[]>([]);
  const [selectedUser, setSelectedUser] = useState('');

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

  let usersMarkup;
  if (users.length > 0) {
    usersMarkup = users.map((user) => (
      <div
        className={classNames('user-div d-flex p-3', {
          'bg-white': user.id === selectedUser,
        })}
        key={user.username}
        onClick={() => setSelectedUser(user.id)}
        role="button"
      >
        <p>
          {user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.username}
        </p>
      </div>
    ));
  } else {
    usersMarkup = <p>No users have joined yet</p>;
  }

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
          {usersMarkup}
        </Col>
        <Messages selectedUser={selectedUser} />
      </Row>
    </Fragment>
  );
}
