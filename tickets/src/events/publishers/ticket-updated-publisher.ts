import { Publisher, Subjects, TicketUpdatedEvent } from '@js-ticketly/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
