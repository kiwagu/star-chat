import React, { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';

import Message from './Message';
import { SERVER_URL } from '../consts';
import { MessageDto } from '../types';
import { useAuthState } from '../context/auth';

interface MessagesProps {
  selectedUser: string;
}

export default function Messages({ selectedUser }: MessagesProps) {
  const authState = useAuthState();
  const [messages, setMessages] = useState<MessageDto[]>([]);

  useEffect(() => {
    if (selectedUser) {
      fetch(
        `${SERVER_URL}/messages?selectedUser=${decodeURIComponent(
          selectedUser
        )}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authState?.credentials?.accessToken}`,
          },
        }
      )
        .then(async (response) => {
          const data = await response.json();

          // check for error response
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          setMessages(data);
        })
        .catch((errors) => {
          console.error(errors);
        });
    }
  }, [selectedUser, authState]);

  return (
    <Col xs={8} className="messages-box d-flex flex-column bg-white">
      {messages && messages.length > 0 ? (
        messages.map((message) => (
          <Message key={message.id} message={message} />
        ))
      ) : (
        <p>Messages</p>
      )}
    </Col>
  );
}
