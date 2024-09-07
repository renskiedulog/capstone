"use client";

import { useEffect, useState } from "react";
import socket from "@/socket";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport: any) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("newActivity", () => {
      console.log("new activity found");
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("newActivity");
    };
  }, []);

  const handleSendMessage = async () => {
    try {
      const response = await fetch("/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activityType: "test",
          message: "test",
        }),
      });

      if (!response.ok) {
        throw new Error(`Fetch failed with status: ${response.status}`);
      }

      socket.emit("newActivity");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <Button onClick={handleSendMessage}>Message</Button>
    </div>
  );
}
