import { Publisher, Subjects, TicketCreatedEvent } from '@js-ticketly/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
