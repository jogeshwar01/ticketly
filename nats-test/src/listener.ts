import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

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

  const options = stan.subscriptionOptions().setManualAckMode(true);
  // only when manually acknowledged do we consider an event processed
  
  // subscribing to channel ticket:created
  const subscription = stan.subscribe(
    'ticket:created',
    'orders-service-queue-group',
    options
  );

  // what to do when an msg received over the channel
  subscription.on('message', (msg: Message) => {
    const data = msg.getData();     // can get these getData and other functions from type def file or docs

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }

    msg.ack();
  });
});

// Graceful client shutdown - shutdown old when restarted without waiting for 30 seconds
process.on('SIGINT', () => stan.close());   //INTERRUPT signal
process.on('SIGTERM', () => stan.close());  //TERMINATE signal
