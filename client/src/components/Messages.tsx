import React, { useEffect, useState, Fragment } from 'react';
import { Col } from 'react-bootstrap';
import { SERVER_URL } from '../consts';
import { useAuthState } from '../context/auth';
import { MessageDto } from '../types';
import Message from './Message';

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
    <Col xs={10} md={8} className="bg-white">
      <div className="messages-box p-0 mt-3 d-flex flex-column-reverse">
        {messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <Fragment key={message.id}>
              <Message message={message} />
            </Fragment>
          ))
        ) : (
          <p>Messages</p>
        )}
      </div>
    </Col>
  );
}
