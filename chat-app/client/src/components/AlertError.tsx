import React from 'react';
import { Alert } from 'react-bootstrap';

export default function AlertError({
  errors,
  setShow,
}: {
  errors: string[];
  setShow: (show: boolean) => void;
}) {
  return (
    <Alert variant="danger" onClose={() => setShow(false)} dismissible>
      <Alert.Heading>You got an error!</Alert.Heading>
      <ul>
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </Alert>
  );
}
