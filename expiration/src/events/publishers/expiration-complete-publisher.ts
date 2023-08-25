import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@js-ticketly/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
