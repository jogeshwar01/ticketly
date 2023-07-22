export const natsWrapper = {
  client: {
    publish: jest //needed as used in base-publisher
      .fn()   // mock function - allows us to make expectations around it
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};

// no need to have a mock of  -> _client as its private
// -> connect func as its just used in the index to connect but not really in our code so no need to mock this
// to mock nats client in tests