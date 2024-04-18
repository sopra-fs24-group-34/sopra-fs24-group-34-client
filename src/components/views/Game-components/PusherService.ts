import Pusher from 'pusher-js';

class PusherService {
  private pusher: Pusher;

  constructor() {
    this.pusher = new Pusher('YOUR_PUSHER_APP_KEY', {
      cluster: 'YOUR_PUSHER_CLUSTER',
    });
  }

  subscribeToChannel(channelName: string, eventName: string, callback: (data: any) => void) {
    const channel = this.pusher.subscribe(channelName);
    channel.bind(eventName, callback);
  }

  unsubscribeFromChannel(channelName: string) {
    this.pusher.unsubscribe(channelName);
  }
}

export default PusherService;