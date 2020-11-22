export type PaymentStatus = 'pending' | 'success' | 'failed';
export class Transfer {
  paymentSessionKey: string;
  from: string;
  to: string;
  amount: number;
  status: PaymentStatus;
}
