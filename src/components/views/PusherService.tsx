import Pusher from "pusher-js";

class PusherService {
  private pusher: Pusher;

  // constructor
  constructor() {
    Pusher.logToConsole = true;
    //nedim-j: e499792fd10f53102f20, 87dd3817ca48322d3e02
    //smail: 19cbfeaeb11cb7adbda4
    this.pusher = new Pusher("19cbfeaeb11cb7adbda4", {
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
