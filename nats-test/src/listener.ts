import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const stan = nats.connect('ticketly', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  // called when stan.close() called
  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

// Graceful client shutdown - shutdown old when restarted without waiting for 30 seconds
process.on('SIGINT', () => stan.close());   //INTERRUPT signal
process.on('SIGTERM', () => stan.close());  //TERMINATE signal
