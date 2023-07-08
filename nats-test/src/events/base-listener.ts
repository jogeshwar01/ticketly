import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject']; //name of channel this listener would listen to
  abstract queueGroupName: string; //the one the listener will join
  abstract onMessage(data: T['data'], msg: Message): void; //fn to run when msg received
  private client: Stan; //pre initialised stan client
  protected ackWait = 5 * 1000; //no. of seconds this listener has to ack a msg

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()             // get all events emitted ever - useful when new service created
      .setManualAckMode(true)               // only when manually acknowledged do we consider an event processed
      .setAckWait(this.ackWait)             //if we dont set anything it is 30 seconds
      .setDurableName(this.queueGroupName); // durable subscription - to get only the un-processed events 
                                            // as it contains details of all events and whether they are processed or not
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,    // helps when we even temporarily disconnect services in a group, the durable sub won't be dumped by nats
      this.subscriptionOptions()
    );

    // what to do when an msg received over the channel
    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData(); // data can be string/buffer -can get these getData and other functions from type def file or docs
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8')); // for type buffer - not expected though
  }
}
