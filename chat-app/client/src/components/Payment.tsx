import React, { FormEvent, MouseEvent, useState } from 'react';
import { Col, Form, Spinner, Badge } from 'react-bootstrap';

import { SERVER_URL } from '../consts';
import { useAuthState } from '../context/auth';

interface PaymentProps {
  selectedUser: string;
}
type PaymentStatus = 'pending' | 'success' | 'failed';

export default function Payment({ selectedUser }: PaymentProps) {
  const authState = useAuthState();
  const [amount, setAmount] = useState<string>('10');
  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState<PaymentStatus>(
    'pending'
  );
  const submitPayment = (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLElement>
  ) => {
    e.preventDefault();
    setIsPaymentSuccess('pending');
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
          // from payment app. See payment-app/src/public/pay-form.js
          // @ts-ignore
          window.PMNTS.loadPinForm(data?.paymentSessionKey);
          setIsPaymentInProgress(true);
          while (true) {
            const queryParam = new URLSearchParams({
              paymentSessionKey: data?.paymentSessionKey,
            }).toString();
            const payStatusResp: Response | void = await fetch(
              `${SERVER_URL}/payments/check-status?${queryParam}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${authState?.credentials?.accessToken}`,
                },
              }
            ).catch((error) => {
              console.error(error.message);
              throw error;
            });
            const {
              paymentStatus,
            }: { paymentStatus: PaymentStatus } = await payStatusResp.json();

            console.log('paymentStatus:', paymentStatus);

            if (paymentStatus !== 'pending') {
              setIsPaymentInProgress(false);
              setIsPaymentSuccess(paymentStatus);
              break;
            }

            await(async () => {
              await new Promise((resolve) => setTimeout(resolve, 2500));
            })();
          }
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
          <Col xs={2} md={2}>
            <i
              className="fas fa-money-bill-alt mt-4 fa-2x text-primary ml-2"
              onClick={submitPayment}
              role="button"
            ></i>
          </Col>
          <Col xs={4} md={4}>
            <Form.Control
              type="number"
              className="message-input p-4 mt-3 rounded-pill bg-secondary border-0"
              placeholder="$"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Col>
          <Col xs={6} md={6}>
            {isPaymentInProgress && (
              <>
                <Spinner
                  className="mt-4 mr-4"
                  animation="border"
                  variant="info"
                />
                <Badge variant="info" className="mt-4">
                  Payment processing...
                </Badge>
              </>
            )}
            {isPaymentSuccess === 'success' && (
              <Badge variant="success" className="mt-4">
                Payment success!
              </Badge>
            )}
            {isPaymentSuccess === 'failed' && (
              <Badge variant="danger" className="mt-4">
                Payment failed!
              </Badge>
            )}
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
}
