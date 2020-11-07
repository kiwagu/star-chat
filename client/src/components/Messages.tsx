import React, {
  FormEvent,
  Fragment,
  MouseEvent,
  useEffect,
  useState,
} from 'react';
import { Col, Form } from 'react-bootstrap';
import openSocket, { Socket } from 'socket.io-client';

import Message from './Message';
import { SERVER_URL, WEBSOCKET_SERVER_URL } from '../consts';
import { CreateMessageDto, MessageDto } from '../types';
import { useAuthState } from '../context/auth';

interface MessagesProps {
  selectedUser: string;
}

const sendMessage = async (
  accessToken: string,
  params: CreateMessageDto
): Promise<MessageDto> => {
  const response = await fetch(`${SERVER_URL}/messages`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return await response.json();
};
export default function Messages({ selectedUser }: MessagesProps) {
  const authState = useAuthState();
  const accessToken = authState.credentials?.accessToken;
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const [isWsAuthenticated, setIsWsAuthenticated] = useState(false);
  const submitMessage = (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLElement>
  ) => {
    e.preventDefault();

    if (messageContent.trim() === '' || !selectedUser) return;

    isWsAuthenticated &&
      sendMessage(accessToken || '', {
        body: messageContent,
        toUserId: selectedUser,
      });
  };

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
  }, [selectedUser, authState, accessToken]);

  useEffect(() => {
    const socket = openSocket(WEBSOCKET_SERVER_URL);
    socket.on('message', (message: MessageDto) => {
      if (
        message.user.id === selectedUser ||
        message.toUser.id === selectedUser
      ) {
        setMessages([message, ...messages]);
        setMessageContent('');
      }
    });

    socket.on(
      'authenticated',
      (authStatusResponse: { success: boolean }) => {
        setIsWsAuthenticated(authStatusResponse.success);
        if (authStatusResponse.success) {
          console.log('WS was authenticated');
          return;
        }
        console.error('WS was not authenticated');
      }
    );
    socket.emit('authenticate', {
      accessToken,
    });

    return () => {
      socket.disconnect();
    };
  }, [
    accessToken,
    authState.credentials?.username,
    isWsAuthenticated,
    messages,
    selectedUser,
  ]);

  return (
    <Col xs={10} md={8} className="bg-white">
      <div className="messages-box p-0 mt-3 d-flex flex-column-reverse">
        {messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <Fragment key={message.id}>
              <Message message={message} />
              {index === messages.length - 1 && (
                <div className="invisible">
                  <hr className="m-0" />
                </div>
              )}
            </Fragment>
          ))
        ) : (
          <p>Messages</p>
        )}
      </div>
      <div>
        <Form onSubmit={submitMessage}>
          <Form.Group className="d-flex align-items-center">
            <Form.Control
              type="text"
              className="message-input p-4 mt-3 rounded-pill bg-secondary border-0"
              placeholder="Type a message..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            />
            <i
              className="fas fa-paper-plane mt-3 fa-2x text-primary ml-2"
              onClick={submitMessage}
              role="button"
            ></i>
          </Form.Group>
        </Form>
      </div>
    </Col>
  );
}
