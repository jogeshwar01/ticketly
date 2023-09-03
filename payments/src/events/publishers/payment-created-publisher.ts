import { Subjects, Publisher, PaymentCreatedEvent } from '@js-ticketly/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
