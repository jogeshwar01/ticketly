import mongoose from "mongoose";
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    // here ticketly is cluster id specified in nats-depl and nats-src is the service related to nats-depl
    // alsdj - random client id - should be different for all
    await natsWrapper.connect('ticketly', 'alsdkj', 'http://nats-srv:4222');
    
    // called when stan.close() called
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    //dont write this inside nats-wrapper as that could potentially exit the entire process

    // Graceful client shutdown - shutdown old when restarted without waiting for 30 seconds
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }
};

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});

start();