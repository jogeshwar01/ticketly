import { Subjects, Publisher, OrderCancelledEvent } from '@js-ticketly/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
