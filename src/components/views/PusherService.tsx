import Pusher, { Channel } from "pusher-js";

class PusherService {
  private pusher: Pusher;

  // constructor
  constructor() {
    Pusher.logToConsole = true;
    this.pusher = new Pusher("e499792fd10f53102f20", {
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
