import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;  // ?-might be undefined for some period of time else error

  // to access this getter no need of () -> directly this.client
  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url }); // {url means url:url}

    // return promise to be able to use async/await
    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();

// create nats client and behave as a singleton - something similar to mongoose
// so that one client could be used by everything else in the app