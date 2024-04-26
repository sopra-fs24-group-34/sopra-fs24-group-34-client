import { useMemo } from "react";
import Pusher from "pusher-js";

const usePusherClient = () => {
  const pusherClient = useMemo(() => {
    Pusher.logToConsole = true;

    return new Pusher("19cbfeaeb11cb7adbda4", {
      cluster: "eu",
    });
  }, []);

  return pusherClient;
};

export default usePusherClient;
