import { Publisher, OrderCreatedEvent, Subjects } from '@js-ticketly/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
