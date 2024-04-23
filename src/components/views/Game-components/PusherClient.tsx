import { useMemo } from "react";
import Pusher from "pusher-js";

const usePusherClient = () => {
  const pusherClient = useMemo(() => {
    return new Pusher("87dd3817ca48322d3e02", {
      cluster: "eu",
    });
  }, []);

  return pusherClient;
};

export default usePusherClient;
