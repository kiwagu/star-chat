import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

import { MessageDto } from '../types';
import { useAuthState } from '../context/auth';

/* eslint-disable-next-line */
export interface MessageProps {
  message: MessageDto;
}
export default function Message({ message }: MessageProps) {
  const { credentials } = useAuthState();
  const sent = message.user.username === credentials?.username;
  const received = !sent;
  return (
    <div
      className={classNames('d-flex my-3', {
        'ml-auto': sent,
        'mr-auto': received,
      })}
    >
      <div
        className={classNames('py-2 px-3 rounded-pill', {
          'bg-primary': sent,
          'bg-secondary': received,
        })}
      >
        <div
          className={classNames('message-time-label d-flex', {
            'text-white': sent,
            'justify-content-end': sent,
          })}
        >
          {moment(message.createdAt).format('MMMM DD, HH:MM:SS')}
        </div>
        <p className={classNames({ 'text-white': sent })} key={message.id}>
          {message.body}
        </p>
      </div>
    </div>
  );
}
