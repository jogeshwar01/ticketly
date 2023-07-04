// kubectl port-forward nats-depl-2323342324 4222:4222

import nats from 'node-nats-streaming';

const stan = nats.connect('ticketly', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');
});
