import Pusher, { Channel } from 'pusher-js';

class PusherService {
  private pusher: Pusher;

  // constructor
  constructor() {
    this.pusher = new Pusher("19cbfeaeb11cb7adbda4", {
      cluster: "eu",
    });
  }

  // subscribes to a channel and binds a function to an event
  subscribeToChannel(channelName: string, eventName: string, methhod: Function) {
    const channel = this.pusher.subscribe(channelName);
    channel.bind(eventName, methhod);
  }

  // clean up function
  unsubscribeFromChannel(channelName: string) {
    this.pusher.unsubscribe(channelName);
  }
}

export default PusherService;