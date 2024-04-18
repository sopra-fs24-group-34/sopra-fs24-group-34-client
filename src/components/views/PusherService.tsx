import Pusher, { Channel } from "pusher-js";

class PusherService {
  private pusher: Pusher;

  // constructor
  constructor() {
    this.pusher = new Pusher("a80f75b2d4e6f1aa786a", {
      cluster: "eu",
    });
  }

  // subscribes to a channel and binds a function to an event
  subscribeToChannel(
    channelName: string,
    eventName: string,
    methhod: Function
  ) {
    const channel = this.pusher.subscribe(channelName);
    channel.bind(eventName, methhod);
  }

  // clean up function
  unsubscribeFromChannel(channelName: string) {
    this.pusher.unsubscribe(channelName);
  }
}

export default PusherService;
