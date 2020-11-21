import React, { FormEvent, MouseEvent, useState } from 'react';
import { Col, Form } from 'react-bootstrap';

import { SERVER_URL } from '../consts';
import { useAuthState } from '../context/auth';

interface PaymentProps {
  selectedUser: string;
}

const pay = () => {
  const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=300,left=100,top=100`;
  const form = document.createElement('form');
  form.target = 'Payment';
  form.method = 'POST';
  form.action = 'http://localhost:4000';
  form.style.display = 'none';

  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'secretKey';
  input.value = 'someSecret123';
  form.appendChild(input);

  const input2 = document.createElement('input');
  input2.type = 'hidden';
  input2.name = 'someParam';
  input2.value = 'SomeValue';
  form.appendChild(input2);

  document.body.appendChild(form);

  const paymentWindow = window.open('', 'Payment', params);
  if (paymentWindow) {
    form.submit();
  }
};

export default function Payment({ selectedUser }: PaymentProps) {
  const authState = useAuthState();
  const [amount, setAmount] = useState<string>('10');
  const submitPayment = (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLElement>
  ) => {
    e.preventDefault();
    if (selectedUser) {
      fetch(`${SERVER_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authState?.credentials?.accessToken}`,
        },
        body: JSON.stringify({ amount, toUserId: selectedUser }),
      })
        .then(async (response) => {
          const data = await response.json();

          // check for error response
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }
          // setMessages(data);
          pay();
          /* CONSOLE DEBUG TOREMOVE */ /* prettier-ignore */ console.log("==LOG==\n", "data:", typeof data, "↴\n", data, "\n==END==\n")
        })
        .catch((errors) => {
          console.error(errors);
        });
    }
  };

  return (
    <div>
      <Form onSubmit={submitPayment}>
        <Form.Group className="d-flex justify-content-start">
          <Col xs={2} md={1}>
            <i
              className="fas fa-money-bill-alt mt-4 fa-2x text-primary ml-2"
              onClick={submitPayment}
              role="button"
            ></i>
          </Col>
          <Col xs={4} md={3}>
            <Form.Control
              type="number"
              className="message-input p-4 mt-3 rounded-pill bg-secondary border-0"
              placeholder="$"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
}
